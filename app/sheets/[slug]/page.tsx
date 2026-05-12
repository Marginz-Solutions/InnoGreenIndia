"use client";

import { use } from "react";
import Link from "next/link";
import { SheetLayout } from "@/components/sheet-layout";
import { DataTable } from "@/components/data-table";
import { sheetData } from "@/lib/sheet-data";
import { villageMasterData, villageClusterMapData, villageScoringData } from "@/lib/village-data";

function getSheetData(slug: string) {
  if (slug === "village-master") {
    return villageMasterData;
  }
  if (slug === "village-cluster-map") {
    return villageClusterMapData;
  }
  if (slug === "village-scoring") {
    return villageScoringData;
  }
  return sheetData[slug];
}

export default function SheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const data = getSheetData(slug);

  if (!data) {
    return (
      <SheetLayout title="Not Found" description="Sheet not found" rowCount={0} columnCount={0}>
        <div className="note mt-4">
          <p>This sheet could not be found.</p>
        </div>
        <div className="mt-4">
          <Link href="/sheets" className="btn primary">
            Back to planning sheets
          </Link>
        </div>
      </SheetLayout>
    );
  }

  // Handle removed reference sheets
  if (data.headers.length === 0 && data.rows.length === 0) {
    return (
      <SheetLayout
        title={data.title}
        description={data.description}
        rowCount={0}
        columnCount={0}
      >
        <div className="note mt-4">
          <p>This reference sheet has been removed from the staff-facing portal.</p>
        </div>
      </SheetLayout>
    );
  }

  return (
    <SheetLayout
      title={data.title}
      description={data.description}
      rowCount={data.rows.length}
      columnCount={data.headers.length}
    >
      <DataTable
        id={`table-${slug}`}
        headers={data.headers}
        rows={data.rows}
        filename={`${slug}.csv`}
      />
    </SheetLayout>
  );
}
