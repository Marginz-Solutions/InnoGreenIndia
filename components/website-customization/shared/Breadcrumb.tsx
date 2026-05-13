import { ChevronRight } from 'lucide-react';

interface Props {
section: string;
}

export const Breadcrumb = ({
section,
}: Props) => (

  <nav className="flex items-center gap-2 text-sm text-[#61756a] mb-3">
    <span>Dashboard</span>

<ChevronRight size={14} />

<span className="font-semibold text-[#102018]">
  {section}
</span>

  </nav>
);
