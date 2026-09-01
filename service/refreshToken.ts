import "server-only";

import { BACKEND_URL } from "@/lib/backend-url";

type RefreshResult =
  | { success: true; accessToken: string }
  | { success: false };

/**
 * Exchange a valid refresh token for a fresh access token.
 * The backend reads the refresh token from the `Cookie` header.
 */
export async function getNewAccessToken(
  refreshToken: string,
): Promise<RefreshResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });
    const json = await res.json();

    if (res.ok && json?.success && json.data?.accessToken) {
      return { success: true, accessToken: json.data.accessToken };
    }
  } catch {
    // fall through
  }
  return { success: false };
}
