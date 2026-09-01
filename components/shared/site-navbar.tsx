import { getMe } from "@/service/getMe";
import { Navbar } from "./navbar";
import { AuthHydrator } from "./auth-hydrator";

/** Server wrapper: resolves the session once, feeds the client navbar + store. */
export async function SiteNavbar() {
  const user = await getMe();
  return (
    <>
      <Navbar user={user} />
      <AuthHydrator user={user.success ? user.data : null} />
    </>
  );
}
