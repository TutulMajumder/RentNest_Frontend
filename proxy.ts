import { NextResponse, type NextRequest } from "next/server";
import type { JwtPayload } from "jsonwebtoken";

import { jwtUtils } from "@/utils/jwt";
import { getNewAccessToken } from "@/service/refreshToken";
import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  ROLE_DASHBOARD,
  isValidRole,
} from "@/lib/constants";

const ACCESS_MAX_AGE = 60 * 60 * 24; // 1 day

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decoded = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  // Access token missing/expired but refresh token still valid -> rotate it.
  let refreshedToken: string | null = null;
  let refreshTokenUsable = false;
  if (!decoded?.success && refreshToken) {
    const refreshValid = jwtUtils.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    );
    if (refreshValid.success) {
      refreshTokenUsable = true; // structurally valid — keep it even if the call fails
      const result = await getNewAccessToken(refreshToken);
      if (result.success) {
        refreshedToken = result.accessToken;
        accessToken = result.accessToken;
        decoded = jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        );
      }
    }
  }

  // Make the rotated token visible to the Server Components rendering THIS request.
  if (refreshedToken) {
    request.cookies.set("accessToken", refreshedToken);
  }

  const rawRole =
    decoded?.success && decoded.data
      ? (decoded.data as JwtPayload).role
      : null;
  const role = isValidRole(rawRole) ? rawRole : null;
  const isLoggedIn = !!role;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  /** Every return path goes through here so cookie changes reach the browser. */
  const finalize = (res: NextResponse) => {
    if (refreshedToken) {
      res.cookies.set("accessToken", refreshedToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_MAX_AGE,
      });
    } else if (accessToken && !isLoggedIn) {
      // Dead access token -> always drop it.
      res.cookies.delete("accessToken");
      // Only drop the refresh token if it's genuinely unusable — not on a
      // transient backend failure, so the next request can retry the refresh.
      if (!refreshTokenUsable) res.cookies.delete("refreshToken");
    }
    return res;
  };

  // Logged in and visiting /login or /register -> their dashboard.
  if (isLoggedIn && isAuthRoute) {
    return finalize(
      NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url)),
    );
  }

  // Not logged in and visiting a protected route -> login (remember where).
  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return finalize(NextResponse.redirect(loginUrl));
  }

  // Logged in but in the wrong role's dashboard section.
  if (isLoggedIn && pathname.startsWith("/dashboard")) {
    const home = ROLE_DASHBOARD[role];

    if (pathname === "/dashboard") {
      return finalize(NextResponse.redirect(new URL(home, request.url)));
    }

    const inOwnSection =
      pathname === "/dashboard/profile" || pathname.startsWith(home);
    if (!inOwnSection) {
      return finalize(NextResponse.redirect(new URL(home, request.url)));
    }
  }

  return finalize(NextResponse.next({ request }));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml)$).*)",
  ],
};
