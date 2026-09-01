"use server";

import { BACKEND_URL } from "@/lib/backend-url";

import { redirect } from "next/navigation";

import type { ActionResult, FieldError } from "@/lib/types";

export type RegisterState = ActionResult | null;

export const registerAction = async (
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = (formData.get("phone") as string | null)?.trim();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
      errorDetails: [
        { field: "confirmPassword", message: "Passwords do not match" },
      ],
    };
  }

  let result: { success?: boolean; message?: string; errorDetails?: unknown };

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        ...(phone ? { phone } : {}), // omit empty — backend rejects ""
      }),
    });
    result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message ?? "Registration failed",
        errorDetails: Array.isArray(result?.errorDetails)
          ? (result.errorDetails as FieldError[])
          : undefined,
      };
    }
  } catch {
    return { success: false, message: "Cannot reach the server. Try again." };
  }

  redirect("/login?registered=1"); // outside try/catch
};
