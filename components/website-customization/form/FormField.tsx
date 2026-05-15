import React from 'react';

interface Props {
label: string;
children: React.ReactNode;
error?: string;
}

export const FormField = ({
label,
children,
error,
}: Props) => (

  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-[#21432a] uppercase tracking-wide">
      {label}
    </label>

{children}
    {error && <p className="text-xs text-red-600">{error}</p>}

  </div>
);
