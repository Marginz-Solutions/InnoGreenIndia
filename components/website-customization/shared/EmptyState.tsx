import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
icon: React.ElementType;
title: string;
desc: string;
onAdd: () => void;
}

export const EmptyState = ({
icon: Icon,
title,
desc,
onAdd,
}: Props) => (

  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#edf8ee] flex items-center justify-center">
      <Icon
        size={30}
        className="text-[#1f7a36]"
      />
    </div>

<div>
  <p className="font-bold text-[#102018] text-base mb-1">
    {title}
  </p>

  <p className="text-sm text-[#61756a]">
    {desc}
  </p>
</div>

<button
  className="btn primary"
  onClick={onAdd}
>
  <Plus size={16} />
  Add First Item
</button>

  </div>
);
