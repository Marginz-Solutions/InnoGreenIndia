import React from 'react'

const FilterPill = ({
    label,
    icon: Icon,
    active,
    onClick,
}: {
    label: string;
    icon?: React.ElementType;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${active
                ? 'bg-[#1f7a36] text-white border-[#1f7a36] shadow-sm'
                : 'bg-white text-[#61756a] border-[#d1dfd5] hover:border-[#1f7a36] hover:text-[#1f7a36]'
            }`}
    >
        {Icon && <Icon size={11} />}
        {label}
    </button>
);

export default FilterPill