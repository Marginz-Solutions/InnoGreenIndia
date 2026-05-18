function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-md bg-black/[0.06] ${className}`} style={style} />
  );
}

function SectionCardSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function BarRowSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-2.5 w-32 shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-gray-100" />
      <Skeleton className="h-2.5 w-6 shrink-0" />
    </div>
  );
}

function DonutSkeleton() {
  return (
    <div
      className="w-24 h-24 rounded-full shrink-0 animate-pulse"
      style={{ background: "conic-gradient(#e5e7eb 70%, #f3f4f6 70%)" }}
    />
  );
}

function DonutCard({ rows }: { rows: number }) {
  return (
    <SectionCardSkeleton>
      <div className="flex items-center gap-5">
        <DonutSkeleton />
        <div className="space-y-3 flex-1">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
              <Skeleton className="h-2.5 flex-1" />
              <Skeleton className="h-2.5 w-6 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SectionCardSkeleton>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 last:border-none">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-20" /></td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2 w-2 rounded-full shrink-0" />
          <Skeleton className="h-3 w-12" />
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-14" /></td>
    </tr>
  );
}

// ── Mirrors the <Dashboard dealers enquiries /> component at the bottom ────────

function DealersDashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-2">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        ))}
      </div>

      {/* Donut + 2 bar charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DonutCard rows={3} />
        {Array.from({ length: 2 }).map((_, i) => (
          <SectionCardSkeleton key={i}>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => <BarRowSkeleton key={j} />)}
            </div>
          </SectionCardSkeleton>
        ))}
      </div>

      {/* Recent activity */}
      <SectionCardSkeleton>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-none">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-2.5 w-16 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </SectionCardSkeleton>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Loading() {
  return (
    <div className="min-h-screen p-6 font-sans space-y-5">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <Skeleton className="h-3 w-36 hidden sm:block" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-2.5 w-28" />
            </div>
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
          </div>
        ))}
      </div>

      {/* Row 2: product status donut + category bars + brand bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DonutCard rows={3} />
        <SectionCardSkeleton>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <BarRowSkeleton key={i} />)}
          </div>
        </SectionCardSkeleton>
        <SectionCardSkeleton>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <BarRowSkeleton key={i} />)}
          </div>
        </SectionCardSkeleton>
      </div>

      {/* Row 3: brands list + brand status donut + tags cloud */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Brands list */}
        <SectionCardSkeleton>
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-none">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-40" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </SectionCardSkeleton>

        {/* Brand status donut + tags */}
        <div className="space-y-4">
          <DonutCard rows={2} />
          <SectionCardSkeleton>
            <div className="flex flex-wrap gap-1.5">
              {[80, 64, 96, 56, 72, 48, 88, 64, 56, 80, 72, 48].map((w, i) => (
                <Skeleton key={i} className="h-6 rounded-full" style={{ width: `${w}px` }} />
              ))}
            </div>
          </SectionCardSkeleton>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            {[112, 88, 96, 88].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded-lg" style={{ width: `${w}px` }} />
            ))}
          </div>
          <Skeleton className="h-8 w-52 rounded-xl" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {Array.from({ length: 7 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-2.5 w-14" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dealers section heading + dashboard */}
      <Skeleton className="h-5 w-20" />
      <DealersDashboardSkeleton />

    </div>
  );
}