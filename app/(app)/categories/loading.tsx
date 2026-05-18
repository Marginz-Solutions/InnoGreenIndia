import Skeleton from '@/components/website-customization/shared/Skeleton';

export default function CategoriesLoading() {
    const chips = [100, 80, 120, 90, 110, 75];

    return (
        <section>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-36 rounded-lg" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-20 rounded-lg" />
            </div>

            <div className="flex flex-wrap gap-3 md:gap-5">
                {chips.map((w) => (
                    <Skeleton key={w} className="h-10 rounded-xl" style={{ width: w }} />
                ))}
            </div>
        </section>
    );
}
