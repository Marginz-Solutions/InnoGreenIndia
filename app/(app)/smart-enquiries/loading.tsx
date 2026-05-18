function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-black/[0.06] ${className}`} />
  );
}

export function TableRowSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              {["Need", "Sender", "District", "Category", "Brand", "Crop", "Mobile", "Status", "When"].map((h) => (
                <th key={h} className="px-4 py-3">
                  <div className="h-2.5 w-14 animate-pulse rounded-md bg-black/[0.06]" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className={`border-b border-gray-100 last:border-none ${i % 2 !== 0 ? "bg-gray-50/40" : ""}`}>
                {/* Need */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg animate-pulse bg-black/[0.06] shrink-0" />
                    <div className="h-3 w-32 animate-pulse rounded-md bg-black/[0.06]" />
                  </div>
                </td>
                {/* Sender */}
                <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* District */}
                <td className="px-4 py-3"><div className="h-3 w-24 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* Category */}
                <td className="px-4 py-3"><div className="h-3 w-20 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* Brand */}
                <td className="px-4 py-3"><div className="h-3 w-20 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* Crop */}
                <td className="px-4 py-3"><div className="h-3 w-16 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* Mobile */}
                <td className="px-4 py-3"><div className="h-3 w-24 animate-pulse rounded-md bg-black/[0.06]" /></td>
                {/* Status */}
                <td className="px-4 py-3"><div className="h-5 w-16 animate-pulse rounded-full bg-black/[0.06]" /></td>
                {/* When */}
                <td className="px-4 py-3"><div className="h-3 w-14 animate-pulse rounded-md bg-black/[0.06]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export function GridCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top accent */}
      <div className="h-1 w-full bg-gray-100 animate-pulse" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
        </div>
        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        {/* Message */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 space-y-1.5">
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-3/4" />
        </div>
        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-4 font-sans">

      {/* ── FilterBar skeleton ── */}
      <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-4">

        {/* Search + view toggle row */}
        <div className="flex items-center gap-3">
          <Skeleton className="flex-1 h-10 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl shrink-0" />
        </div>

        {/* Filter pills row */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <div className="flex items-center gap-1.5 border-l border-[#e2ece3] pl-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Refresh button ── */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>

      <TableRowSkeleton></TableRowSkeleton>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <Skeleton className="h-3 w-40" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>

    </div>
  );
}