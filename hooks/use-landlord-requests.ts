"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { Paginated, RentalRequest, RentalStatus } from "@/lib/types";

export type RequestFilters = { page: number; limit: number; status?: string };

const EMPTY: Paginated<RentalRequest> = {
  data: [],
  meta: { page: 1, limit: 0, total: 0 },
};

async function fetchRequests(
  filters: RequestFilters,
): Promise<Paginated<RentalRequest>> {
  const qs = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(filters.status ? { status: filters.status } : {}),
  });
  const res = await fetch(`/api/landlord/requests?${qs}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load requests");
  }
  return {
    data: json.data?.data ?? [],
    meta: json.data?.meta ?? EMPTY.meta,
  };
}

export function useLandlordRequests(
  filters: RequestFilters,
  initialData: Paginated<RentalRequest>,
) {
  return useQuery({
    queryKey: queryKeys.landlord.requests(filters),
    queryFn: () => fetchRequests(filters),
    initialData,
  });
}

export function useUpdateRequestStatus(filters: RequestFilters) {
  const qc = useQueryClient();
  const key = queryKeys.landlord.requests(filters);

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: RentalStatus;
    }) => {
      const res = await fetch(`/api/landlord/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Update failed");
      }
      return json.data as RentalRequest;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Paginated<RentalRequest>>(key);
      qc.setQueryData<Paginated<RentalRequest>>(key, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((r) =>
                r.id === id ? { ...r, status } : r,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}
