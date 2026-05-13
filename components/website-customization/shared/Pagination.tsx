import {
ChevronLeft,
ChevronRight,
} from 'lucide-react';

interface Props {
page: number;
total: number;
onPrev: () => void;
onNext: () => void;
}

export const Pagination = ({
page,
total,
onPrev,
onNext,
}: Props) => (

  <div className="flex items-center justify-between pt-4 border-t border-[#e2ece3]">
    <span className="text-sm text-[#61756a]">
      Page {page} of {total}
    </span>

<div className="flex gap-2">
  <button
    className="btn"
    onClick={onPrev}
    disabled={page === 1}
  >
    <ChevronLeft size={15} />
    Prev
  </button>

  <button
    className="btn"
    onClick={onNext}
    disabled={page === total}
  >
    Next
    <ChevronRight size={15} />
  </button>
</div>

  </div>
);
