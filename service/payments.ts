import "server-only";

import { apiFetch } from "./api-client";
import type { Payment } from "@/lib/types";

/** Tenant: my payments (backend returns a bare array here). */
export async function getMyPayments() {
  const { data } = await apiFetch<Payment[]>("/api/payments", {
    cache: "no-store",
  });
  return Array.isArray(data) ? data : [];
}

export async function getPayment(id: string) {
  const { data } = await apiFetch<Payment>(`/api/payments/${id}`, {
    cache: "no-store",
  });
  return data;
}
