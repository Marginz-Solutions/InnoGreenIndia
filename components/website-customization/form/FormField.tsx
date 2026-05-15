import React from 'react';

interface Props {
  label: string;
  className?: string;
  children: React.ReactNode;
  error?: string;
}

export const FormField = ({
  label,
  className,
  children,
  error,
}: Props) => (
  <div className="space-y-1.5">
    <label className={`block text-xs font-bold text-[#21432a] uppercase tracking-wide ${className}`}>
      {label}
    </label>

    {children}

    {error && (
      <p className="text-[11px] text-red-500 font-medium">
        {error}
      </p>
    )}
  </div>
);