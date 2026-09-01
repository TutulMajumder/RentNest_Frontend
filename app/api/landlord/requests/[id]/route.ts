import type { NextRequest } from "next/server";

import { forwardToBackend } from "@/lib/backend-proxy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.text();
  return forwardToBackend(`/api/landlord/requests/${id}`, {
    method: "PATCH",
    body,
  });
}
