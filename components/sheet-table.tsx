'use client';

import { useState } from 'react';
import Link from 'next/link';
import { exportTableToCSV } from '@/lib/csv-export';

interface SheetTableProps {
  tableId: string;
  title: string;
  description: string;
  rows: number;
  columns: number;
  headers: string[];
  data: string[][];
  backLink?: string;
  exportFilename: string;
}

export function SheetTable({
  tableId,
  title,
  description,
  rows,
  columns,
  headers,
  data,
  backLink = '/sheets',
  exportFilename,
}: SheetTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = () => {
    exportTableToCSV(tableId, exportFilename);
  };

  return (
    <div className="container">
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <h2>{title}</h2>
            <p className="muted">{description}</p>
          </div>
          <div className="inline-tags">
            <span className="tag">Rows: {rows}</span>
            <span className="tag">Columns: {columns}</span>
          </div>
        </div>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search this sheet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn" onClick={handleExport}>
            Export CSV
          </button>
          <Link className="btn" href={backLink}>
            Back to planning sheets
          </Link>
        </div>
        <div className="table-wrap">
          <table id={tableId}>
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
