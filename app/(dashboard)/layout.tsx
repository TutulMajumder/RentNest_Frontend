import { redirect } from "next/navigation";

import { SiteNavbar } from "@/components/shared/site-navbar";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/shared/dashboard-mobile-nav";
import { getMe } from "@/service/getMe";

// Every dashboard route is per-user and auth-gated — never prerender.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  if (!me.success) redirect("/login");

  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSidebar role={me.data.role} />
        <main className="min-w-0 flex-1">
          <DashboardMobileNav role={me.data.role} />
          {children}
        </main>
      </div>
    </div>
  );
}
