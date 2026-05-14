import React from 'react'

const KpiCard = ({
    label,
    value,
    sub,
    color,
}: {
    label: string;
    value: number;
    sub?: string;
    color?: string;
}) => {
    return (
        <div className="bg-white border border-[#e2ece3] rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#61756a] uppercase tracking-wide">{label}</span>
            <span className={`text-3xl font-extrabold ${color ?? 'text-[#102018]'}`}>{value}</span>
            {sub && <span className="text-xs text-[#9bb4a1]">{sub}</span>}
        </div>
    )
}

export default KpiCard