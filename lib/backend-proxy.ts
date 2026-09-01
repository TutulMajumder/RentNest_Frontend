import "server-only";
import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";

/**
 * Forwards a request from a Next route handler to the RentNest backend,
 * attaching the caller's access token. Keeps the browser same-origin
 * (no CORS) while the httpOnly cookie stays server-side.
 */
export async function forwardToBackend(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
