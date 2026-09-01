import "server-only";

import { cookies } from "next/headers";

import type { ApiEnvelope, ApiMeta, FieldError, Paginated } from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

// `.trim()` + strip trailing slash — a stray space in .env otherwise makes
// every fetch throw "Failed to parse URL".
const BASE_URL = (process.env.BACKEND_API_URL ?? "").trim().replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  errorDetails?: FieldError[];

  constructor(message: string, status: number, errorDetails?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  /** query params — empty/undefined values are dropped */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** JSON body — serialized automatically */
  body?: unknown;
  /** attach `Authorization: Bearer <accessToken cookie>` (default true) */
  auth?: boolean;
};

/**
 * The single entry point for talking to the RentNest backend from the server.
 * Unwraps the `{ success, data, meta }` envelope and throws `ApiError` on failure.
 */
export async function apiFetch<T>(
  path: string,
  { query, body, auth = true, headers, ...init }: ApiFetchOptions = {},
): Promise<{ data: T; meta?: ApiEnvelope<T>["meta"]; message: string }> {
  const url = `${BASE_URL}${path}${query ? buildQueryString(query) : ""}`;

  const finalHeaders = new Headers(headers);
  if (body !== undefined) finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = (await cookies()).get("accessToken")?.value;
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  let json: ApiEnvelope<T> & { errorDetails?: FieldError[] };
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Unexpected response from the server.", res.status);
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message || "Request failed",
      res.status,
      Array.isArray(json.errorDetails) ? json.errorDetails : undefined,
    );
  }

  return { data: json.data, meta: json.meta, message: json.message };
}

const EMPTY_META: ApiMeta = { page: 1, limit: 0, total: 0, totalPage: 0 };

/**
 * Backend paginated list endpoints nest as `data: { data: [], meta: {} }`.
 * This flattens that to `{ data, meta }`.
 */
export async function apiFetchList<T>(
  path: string,
  options?: Parameters<typeof apiFetch>[1],
): Promise<Paginated<T>> {
  const { data } = await apiFetch<{ data: T[]; meta: ApiMeta }>(path, options);
  return {
    data: Array.isArray(data?.data) ? data.data : [],
    meta: data?.meta ?? EMPTY_META,
  };
}
