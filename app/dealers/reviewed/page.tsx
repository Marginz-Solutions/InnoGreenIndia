// Server Component — no "use client"
import ReviewedDealersClient from "./ReviewedClient";

export type Dealer = {
  id: number;
  firmName: string;
  gstNumber: string;
  mobileNo: string;
  district: string;
  categoryInterest: string;
  monthlyVolume: string | null;
  reviewedAt: string;
};

export default async function ReviewedDealers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dealers/reviewed`,
    {
      cache: "no-store", // always fresh data
    }
  );

  if (!res.ok) {
    const { error } = await res.json();
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f0] p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center max-w-sm w-full">
          <p className="text-sm font-semibold text-red-600 mb-1">Failed to load dealers</p>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const { data } = await res.json();

  return <ReviewedDealersClient dealers={data ?? []} />;
}