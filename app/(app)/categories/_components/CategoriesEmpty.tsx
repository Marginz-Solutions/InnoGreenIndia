'use client';

import { Tags } from 'lucide-react';
import { EmptyState } from '@/components/website-customization/shared/EmptyState';

interface Props {
  onAdd: () => void;
}

export function CategoriesEmpty({ onAdd }: Props) {
  return (
    <EmptyState
      icon={Tags}
      title="No categories yet"
      desc="Create a category to classify products on the site."
      onAdd={onAdd}
    />
  );
}
