import { SiteNavbar } from "@/components/shared/site-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
