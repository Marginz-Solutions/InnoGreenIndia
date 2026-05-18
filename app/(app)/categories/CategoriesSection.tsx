'use client';

import { useState } from 'react';
import { CategoriesEmpty } from './_components/CategoriesEmpty';
import { CategoryChip } from './_components/CategoryChip';
import { NewCategoryModal } from './_components/NewCategoryModal';
import { Category } from '@/lib/global.types';


interface Props {
  categories: Category[];
}

export function CategoriesSection({ categories }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Categories</h1>
          <p className="muted text-sm">Organize products with reusable category labels</p>
        </div>
        <NewCategoryModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>

      {categories.length === 0 ? (
        <CategoriesEmpty onAdd={() => setModalOpen(true)} />
      ) : (
        <div className="flex flex-wrap gap-3 md:gap-5">
          {categories.map((cat) => (
            <CategoryChip key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </>
  );
}
