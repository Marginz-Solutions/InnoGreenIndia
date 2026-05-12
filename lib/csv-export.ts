'use client';

export function exportTableToCSV(tableId: string, filename: string): void {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const csv = rows
    .map((row) =>
      Array.from(row.children)
        .map((cell) => `"${(cell.textContent || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportDataToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string
): void {
  const headerRow = headers.map((h) => `"${h.label}"`).join(',');
  const dataRows = data.map((row) =>
    headers
      .map((h) => `"${String(row[h.key] ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );

  const csv = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
