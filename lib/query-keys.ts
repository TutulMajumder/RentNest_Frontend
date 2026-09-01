/** Centralised TanStack Query keys so invalidation stays consistent. */
export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    list: (filters: Record<string, unknown>) =>
      ["properties", "list", filters] as const,
    detail: (id: string) => ["properties", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  rentals: {
    all: ["rentals"] as const,
    mine: (filters: Record<string, unknown>) =>
      ["rentals", "mine", filters] as const,
  },
  landlord: {
    properties: (filters: Record<string, unknown>) =>
      ["landlord", "properties", filters] as const,
    requests: (filters: Record<string, unknown>) =>
      ["landlord", "requests", filters] as const,
    reviews: ["landlord", "reviews"] as const,
  },
  payments: {
    mine: ["payments", "mine"] as const,
  },
  admin: {
    users: (filters: Record<string, unknown>) =>
      ["admin", "users", filters] as const,
    properties: (filters: Record<string, unknown>) =>
      ["admin", "properties", filters] as const,
    rentals: (filters: Record<string, unknown>) =>
      ["admin", "rentals", filters] as const,
  },
} as const;
