/* loading.tsx — skeleton for AdminContactClient */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-black/[0.06] ${className}`}
    />
  );
}

function SectionHeaderSkeleton({ accent = false }: { accent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 mb-5 pb-3.5 border-b ${
        accent ? "border-[rgba(93,202,165,0.2)]" : "border-black/[0.08]"
      }`}
    >
      <Skeleton className="h-3.5 w-3.5 rounded-sm" />
      <Skeleton className="h-2.5 w-28" />
    </div>
  );
}

function FieldSkeleton({
  wide = false,
  dark = false,
}: {
  wide?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "col-span-2" : ""}`}>
      <Skeleton
        className={`h-2.5 w-20 ${dark ? "bg-white/[0.12]" : "bg-black/[0.06]"}`}
      />
      <Skeleton
        className={`h-[38px] w-full rounded-lg ${
          dark ? "bg-white/[0.08]" : "bg-black/[0.06]"
        }`}
      />
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-black/[0.08] rounded-[18px] p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb skeleton */}
      <div className="px-7 py-3.5 border-b border-black/[0.06] flex items-center gap-2">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-2 rounded-none" />
        <Skeleton className="h-3 w-16" />
      </div>

      <main className="max-w-[1280px] mx-auto px-7 py-10 pb-20">

        {/* PAGE HERO */}
        <div className="flex items-start justify-between gap-6 mb-9 flex-wrap">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-72" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4">

            {/* Communications */}
            <Card className="bg-white">
              <SectionHeaderSkeleton />
              <div className="grid grid-cols-2 gap-[18px]">
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton wide />
                <FieldSkeleton wide />
              </div>
            </Card>

            {/* Address */}
            <Card className="bg-white">
              <SectionHeaderSkeleton />
              <div className="grid grid-cols-2 gap-[18px]">
                <FieldSkeleton wide />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
            </Card>

            {/* GPS — dark card */}
            <div className="bg-gradient-to-r from-[#242c26] to-[#1f7a36] border border-white/[0.07] rounded-[18px] p-6">
              <SectionHeaderSkeleton accent />
              <div className="grid grid-cols-2 gap-[18px]">
                <FieldSkeleton dark />
                <FieldSkeleton dark />
                <FieldSkeleton dark />
                <FieldSkeleton dark />
              </div>
            </div>

            {/* Operations */}
            <Card className="bg-white">
              <SectionHeaderSkeleton />
              <div className="grid grid-cols-2 gap-[18px]">
                <FieldSkeleton wide />
                <FieldSkeleton wide />
              </div>
            </Card>

            {/* Commander */}
            <Card className="bg-white">
              <SectionHeaderSkeleton />
              <div className="grid grid-cols-2 gap-[18px]">
                <FieldSkeleton wide />
                <FieldSkeleton />
              </div>
            </Card>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">

            {/* Map card */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] overflow-hidden">
              {/* Map header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.08]">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>

              {/* Map body */}
              <div className="h-[420px] bg-[#e8e4dc] animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 opacity-30">
                  {/* Fake map grid lines */}
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="opacity-50"
                  >
                    <rect x="0" y="21" width="64" height="1" fill="#9ca3af" />
                    <rect x="0" y="42" width="64" height="1" fill="#9ca3af" />
                    <rect x="21" y="0" width="1" height="64" fill="#9ca3af" />
                    <rect x="42" y="0" width="1" height="64" fill="#9ca3af" />
                    <circle cx="32" cy="32" r="5" fill="#6b7280" />
                    <line
                      x1="32"
                      y1="16"
                      x2="32"
                      y2="27"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="32"
                      y1="37"
                      x2="32"
                      y2="48"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="16"
                      y1="32"
                      x2="27"
                      y2="32"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="37"
                      y1="32"
                      x2="48"
                      y2="32"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Map footer */}
              <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-black/[0.08]">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Quick Info card */}
            <div className="bg-white border border-black/[0.08] rounded-[18px] overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    i < 2 ? "border-b border-black/[0.08]" : ""
                  }`}
                >
                  <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-2 w-14" />
                    <Skeleton className="h-3.5 w-36" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}