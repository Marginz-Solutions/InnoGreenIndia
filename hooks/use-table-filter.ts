'use client';

import { useState, useMemo } from 'react';

export function useTableFilter<T extends Record<string, unknown>>(
  data: T[],
  searchFields?: (keyof T)[]
) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    
    const searchTerm = query.toLowerCase();
    
    return data.filter((item) => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some((field) => {
          const value = item[field];
          return String(value ?? '').toLowerCase().includes(searchTerm);
        });
      }
      // If no search fields specified, search all string values
      return Object.values(item).some((value) =>
        String(value ?? '').toLowerCase().includes(searchTerm)
      );
    });
  }, [data, query, searchFields]);

  return { query, setQuery, filtered };
}
