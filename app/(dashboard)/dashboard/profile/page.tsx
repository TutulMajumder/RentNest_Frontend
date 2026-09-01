import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { getMe } from "@/service/getMe";
import { ProfileForm } from "../../_components/ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const me = await getMe();
  if (!me.success) redirect("/login");

  return (
    <>
      <PageHeader
        title="Profile"
        description="Update your name, phone number and password."
      />
      <ProfileForm user={me.data} />
    </>
  );
}
