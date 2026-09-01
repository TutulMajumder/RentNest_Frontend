import { redirect } from "next/navigation";

import { ROLE_DASHBOARD } from "@/lib/constants";
import { getMe } from "@/service/getMe";

/** `/dashboard` is a role router — send the user to their section. */
export default async function DashboardIndex() {
  const me = await getMe();
  redirect(me.success ? ROLE_DASHBOARD[me.data.role] : "/login");
}
