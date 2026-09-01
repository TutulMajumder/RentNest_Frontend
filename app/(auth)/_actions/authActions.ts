"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { type JwtPayload } from "jsonwebtoken";

import type { ActionResult } from "@/lib/types";
import { ROLE_DASHBOARD, isValidRole } from "@/lib/constants";

export type LoginState = ActionResult | null;

const ACCESS_MAX_AGE = 60 * 60 * 24; // 1 day
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const safeNext = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : null;

export const loginAction = async (
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const next = safeNext(formData.get("next"));

  let result: {
    success?: boolean;
    message?: string;
    data?: { accessToken: string; refreshToken: string };
  };

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    result = await res.json();

    if (!res.ok || !result?.success || !result.data) {
      return { success: false, message: result?.message ?? "Login failed" };
    }
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  const store = await cookies();
  const shared = { httpOnly: true, sameSite: "lax", path: "/" } as const;
  store.set("accessToken", result.data.accessToken, {
    ...shared,
    maxAge: ACCESS_MAX_AGE,
  });
  store.set("refreshToken", result.data.refreshToken, {
    ...shared,
    maxAge: REFRESH_MAX_AGE,
  });

  const decoded = jwt.decode(result.data.accessToken) as JwtPayload | null;
  const dest =
    next ?? (isValidRole(decoded?.role) ? ROLE_DASHBOARD[decoded.role] : "/");

  redirect(dest); // throws by design — keep outside try/catch
};
