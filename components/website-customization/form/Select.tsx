import React from 'react';

export const Select = (
props: React.SelectHTMLAttributes<HTMLSelectElement>
) => (
<select
{...props}
className={`w-full px-4 py-2.5 border border-[#cfe0d2] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1f7a36] focus:ring-2 focus:ring-[#1f7a36]/20 transition-all ${props.className ?? ''}`}
/>
);
