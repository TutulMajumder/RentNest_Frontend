import type { Metadata } from "next";

import { PaymentResult } from "./_components/payment-result";

export const metadata: Metadata = { title: "Payment" };

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sessionId = str((await searchParams).session_id) ?? null;
  return <PaymentResult sessionId={sessionId} />;
}
