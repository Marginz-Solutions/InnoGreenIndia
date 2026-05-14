'use client';

import React from 'react';

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle = ({ checked, onChange, label, description, disabled }: Props) => (
  <label
    className={`flex items-center justify-between gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {(label || description) && (
      <div className="flex-1 min-w-0">
        {label && (
          <span className="block text-sm font-semibold text-[#102018] leading-tight">{label}</span>
        )}
        {description && (
          <span className="block text-xs text-[#61756a] mt-0.5">{description}</span>
        )}
      </div>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1f7a36]/30 ${
        checked ? 'bg-[#1f7a36]' : 'bg-[#d1dfd5]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </label>
);