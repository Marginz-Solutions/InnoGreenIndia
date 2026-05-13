import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
active: boolean;
labels?: [string, string];
}

export const StatusBadge = ({
active,
labels = ['Active', 'Inactive'],
}: Props) => (
<span
className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
      active
        ? 'bg-[#edf8ee] text-[#166534]'
        : 'bg-slate-100 text-slate-500'
    }`}

>
{active ? (

  <CheckCircle size={11} />
) : (
  <XCircle size={11} />
)}

{active ? labels[0] : labels[1]}

  </span>
);
