import React from 'react';

interface Props {
label: string;
children: React.ReactNode;
}

export const FormField = ({
label,
children,
}: Props) => (

  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-[#21432a] uppercase tracking-wide">
      {label}
    </label>

{children}

  </div>
);
