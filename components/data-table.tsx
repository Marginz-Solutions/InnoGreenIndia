"use client";

import { useState, useMemo } from "react";
import { Panel, Button, Tag, TableWrap, SearchBar } from "@/components/ui";

interface DataTableProps {
  title: string;
  description: string;
  rows: number;
  columns: number;
  headers: string[];
  data: Record<string, string | number>[];
}

export function DataTable({
  title,
  description,
  rows,
  columns,
  headers,
  data,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);

  const exportToCSV = () => {
    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] || "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Panel>
        <div className="flex justify-between gap-4 items-start flex-wrap">
          <div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-[#61756a]">{description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Tag>Rows: {rows}</Tag>
            <Tag>Columns: {columns}</Tag>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mt-4 mb-5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search this sheet..."
          />
          <Button onClick={exportToCSV}>Export CSV</Button>
          <Button href="/sheets">Back to planning sheets</Button>
        </div>

        <TableWrap>
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </>
  );
}

// Simple info sheet without table data
export function InfoSheet({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Panel>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-[#61756a] mb-4">{description}</p>
      <div className="flex gap-3 flex-wrap mt-4">
        <Button href="/sheets" variant="primary">
          Back to planning sheets
        </Button>
      </div>
    </Panel>
  );
}
