import type { NextRequest } from "next/server";

import { forwardToBackend } from "@/lib/backend-proxy";

export function GET(request: NextRequest) {
  const qs = request.nextUrl.search;
  return forwardToBackend(`/api/landlord/requests${qs}`);
}
