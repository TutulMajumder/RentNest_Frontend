"use client";

import { create } from "zustand";

import type { CurrentUser } from "@/lib/types";

type AuthState = {
  user: CurrentUser | null;
  /** Set once from the server-rendered layout, then updated on profile edits. */
  setUser: (user: CurrentUser | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
