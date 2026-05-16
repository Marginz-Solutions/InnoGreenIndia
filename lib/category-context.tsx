'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category } from '@/components/website-customization/types/common.types';
import { api } from './axiosInstance';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/categories') as { data: Category[] };
      setCategories(response.data ?? []);
    } 
    catch(error: any) {
      setError(error.message || 'Failed to fetch categories');
    } 
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider 
      value={{ 
        categories, 
        isLoading, 
        error, 
        refreshCategories: fetchCategories 
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if(context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
