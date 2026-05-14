'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export const TagInput = ({
  value,
  onChange,
  placeholder = 'Add tag…',
  maxTags = 10,
}: Props) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2.5 min-h-[44px] border border-[#cfe0d2] rounded-xl bg-white focus-within:border-[#1f7a36] focus-within:ring-2 focus-within:ring-[#1f7a36]/20 transition-all">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#edf8ee] text-[#1f7a36] text-xs font-semibold rounded-lg border border-[#c8e6cc]"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-red-500 transition-colors"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      {value.length < maxTags && (
        <div className="flex items-center gap-1 flex-1 min-w-[100px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 text-sm bg-transparent outline-none text-[#102018] placeholder:text-[#b0bcb5] min-w-0"
          />
          {input.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded bg-[#1f7a36] text-white hover:bg-[#166534] transition-colors"
            >
              <Plus size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};