'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { SheetTable } from '@/components/sheet-table';
import { getSheetData } from '@/lib/sheet-data';

interface SheetPageProps {
  params: Promise<{ id: string }>;
}

export default function SheetPage({ params }: SheetPageProps) {
  const { id } = use(params);
  const sheet = getSheetData(id);

  if (!sheet) {
    notFound();
  }

  return (
    <AuthGuard>
      <SheetTable
        tableId={`table-${sheet.id}`}
        title={sheet.title}
        description={sheet.description}
        rows={sheet.rows}
        columns={sheet.columns}
        headers={sheet.headers}
        data={sheet.data}
        backLink="/sheets"
        exportFilename={`${sheet.id}.csv`}
      />
    </AuthGuard>
  );
}

