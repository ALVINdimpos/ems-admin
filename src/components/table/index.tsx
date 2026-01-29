import React from "react";

import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

type Column<T> = {
  id: string;
  label: string;
  /**
   * Optional custom renderer for this column.
   * If omitted, `row[id]` is rendered.
   */
  render?: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

interface IDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey?: (row: T, index: number) => React.Key;
  className?: string;
  containerClassName?: string;
  tableClassName?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  className,
  containerClassName,
  tableClassName,
}: IDataTableProps<T>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
        "w-full overflow-hidden",
        className
      )}
    >
      <UiTable
        containerClassName={cn(
          "max-h-[70vh] w-full overflow-x-auto",
          containerClassName
        )}
        className={cn(
          "w-full border-separate border-spacing-0",
          tableClassName
        )}
      >
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-[#1298E5] text-white hover:bg-[#1298E5]">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "h-12 whitespace-nowrap px-4 text-left text-[13px] font-semibold tracking-wide text-white first:rounded-tl-2xl last:rounded-tr-2xl",
                  column.headerClassName
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={getRowKey ? getRowKey(row, index) : index}
              className={cn(
                "bg-white text-[13px] text-slate-700",
                "even:bg-[#f7f9fc]",
                "hover:bg-[#eef3ff]"
              )}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 align-middle last:pr-5",
                    column.cellClassName
                  )}
                >
                  {column.render ? column.render(row) : (row as any)[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UiTable>
    </div>
  );
}


