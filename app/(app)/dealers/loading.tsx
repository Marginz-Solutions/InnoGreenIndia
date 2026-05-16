function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-black/[0.06] ${className}`} />
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-none">
      {/* Avatar */}
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      {/* Firm + district */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      {/* District pill */}
      <Skeleton className="h-5 w-20 rounded-full hidden sm:block" />
      {/* Category */}
      <Skeleton className="h-5 w-24 rounded-full hidden md:block" />
      {/* Volume */}
      <Skeleton className="h-5 w-16 rounded-full hidden lg:block" />
      {/* Status badge */}
      <Skeleton className="h-5 w-14 rounded-full shrink-0" />
      {/* Date */}
      <Skeleton className="h-3 w-20 hidden sm:block shrink-0" />
      {/* Action button */}
      <Skeleton className="h-7 w-7 rounded-full shrink-0" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen font-sans">

      {/* Breadcrumb */}
      <div className="px-6 py-3.5 border-b border-black/[0.06] flex items-center gap-2">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-2 rounded-none" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 pt-4 flex-wrap gap-y-2">
        <div className="flex items-center gap-1 pb-3">
          {/* Tab 1 — active */}
          <div className="relative flex items-center gap-2 px-4 pb-3">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-4 w-6 rounded-full" />
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gray-200 animate-pulse" />
          </div>
          {/* Tab 2 */}
          <div className="flex items-center gap-2 px-4 pb-3">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
        </div>
        {/* Add Dealer button */}
        <Skeleton className="mb-3 h-8 w-28 rounded-full" />
      </div>

      {/* Content — matches EnquiriesClient table layout */}
      <div className="p-6">

        {/* Toolbar: search + filters */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
            <Skeleton className="h-2.5 w-9 rounded-full shrink-0" />
            <Skeleton className="h-2.5 flex-1" />
            <Skeleton className="h-2.5 w-20 hidden sm:block" />
            <Skeleton className="h-2.5 w-20 hidden md:block" />
            <Skeleton className="h-2.5 w-16 hidden lg:block" />
            <Skeleton className="h-2.5 w-14 shrink-0" />
            <Skeleton className="h-2.5 w-20 hidden sm:block shrink-0" />
            <Skeleton className="h-2.5 w-7 shrink-0" />
          </div>

          {/* 8 rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>

        {/* Pagination row */}
        <div className="flex items-center justify-between mt-4 px-1">
          <Skeleton className="h-3 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}