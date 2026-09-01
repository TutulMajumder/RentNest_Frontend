"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";
import type { CurrentUser } from "@/lib/types";

/**
 * Pushes the server-resolved user into the Zustand store so client components
 * (navbar, dashboard widgets) can read the role without prop drilling.
 * Render once in a layout, below the server `getMe()` call.
 */
export function AuthHydrator({ user }: { user: CurrentUser | null }) {
  useEffect(() => {
    useAuthStore.getState().setUser(user);
  }, [user]);

  return null;
}
