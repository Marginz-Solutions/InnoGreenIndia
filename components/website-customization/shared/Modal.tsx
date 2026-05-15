import React from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10! flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ece3] shrink-0">
          <h2 className="text-xl! mb-0! font-bold text-[#102018]">{title}</h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#edf8ee] transition-colors text-[#61756a]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
