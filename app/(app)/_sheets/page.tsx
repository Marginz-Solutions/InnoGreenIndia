'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { SHEET_REGISTRY } from '@/lib/sheet-registry';

export default function SheetsPage() {
  return (
    <AuthGuard>
      <div className="container">
        <div className="panel">
          <h2>IGIM planning sheets</h2>
          <p className="muted">
            Browse the operational workbook as branded web pages. Source-reference sheets have been removed from staff-facing navigation.
          </p>
        </div>
        <div className="sheet-grid" style={{ marginTop: '18px' }}>
          {SHEET_REGISTRY.map((sheet) => (
            <div className="sheet-card" key={sheet.id}>
              <h3>{sheet.title}</h3>
              <p className="muted">{sheet.description}</p>
              <div className="inline-tags">
                <span className="tag">Rows: {sheet.rows}</span>
                <span className="tag">Columns: {sheet.columns}</span>
              </div>
              <div style={{ marginTop: '14px' }}>
                <Link className="btn primary" href={`/sheets/${sheet.id}`}>
                  View sheet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}

