"use client";

import Link from "next/link";
import { Topbar } from "./topbar";
import { Footer } from "./footer";
import { useAuth } from "./auth-provider";

interface SheetLayoutProps {
  title: string;
  description: string;
  rowCount: number;
  columnCount: number;
  children: React.ReactNode;
}

export function SheetLayout({
  title,
  description,
  rowCount,
  columnCount,
  children,
}: SheetLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Topbar />
      <div className="container max-w-[1380px] mx-auto p-6">
        <div className="panel">
          <div className="flex justify-between gap-4 items-start flex-wrap">
            <div>
              <h2 className="m-0 mb-3 text-lg font-semibold">{title}</h2>
              <p className="text-[var(--muted)] m-0">{description}</p>
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              <span className="tag">Rows: {rowCount}</span>
              <span className="tag">Columns: {columnCount}</span>
            </div>
          </div>
          {children}
          <div className="mt-4">
            <Link href="/sheets" className="btn">
              Back to planning sheets
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
