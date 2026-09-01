"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
};
