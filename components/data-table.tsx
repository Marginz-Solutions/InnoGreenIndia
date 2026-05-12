"use client";

import { useState, useMemo, useCallback } from "react";

interface DataTableProps {
  id: string;
  headers: string[];
  rows: string[][];
  filename: string;
}

export function DataTable({ id, headers, rows, filename }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(query))
    );
  }, [rows, searchQuery]);

  const exportToCSV = useCallback(() => {
    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      ...filteredRows.map((row) =>
        row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [headers, filteredRows, filename]);

  return (
    <>
      <div className="searchbar flex gap-3 flex-wrap my-3">
        <input
          type="text"
          placeholder="Search this sheet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <button className="btn" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>
      <div className="table-wrap">
        <table id={id}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
