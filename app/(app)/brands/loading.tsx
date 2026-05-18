import Skeleton from '@/components/website-customization/shared/Skeleton';

export default function BrandsLoading() {
    return (
        <section>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-28 rounded-lg" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 space-y-3 mb-5">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-18 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
            </div>

            {/* Brand cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card flex flex-col gap-4 p-5">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton className="w-16 h-16 shrink-0 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-1">
                            <Skeleton className="h-5 w-16 rounded-lg" />
                            <Skeleton className="h-5 w-20 rounded-lg" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#e2ece3]">
                            <Skeleton className="h-5 w-16 rounded-lg" />
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-9 rounded-[10px]" />
                                <Skeleton className="h-9 w-9 rounded-[10px]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}