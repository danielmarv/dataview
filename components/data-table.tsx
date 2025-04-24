"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, FileJson } from "lucide-react"
import { saveAs } from "file-saver"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title: string
  description: string
  loading?: boolean
  limit?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  loading = false,
  limit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const limitedData = limit ? data.slice(0, limit) : data

  const table = useReactTable({
    data: limitedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const exportCSV = () => {
    const header = columns.map((col) => (col.header as string) || "")
    const rows = data.map((row: any) =>
      columns.map((col) => {
        const key = (col as any).accessorKey
        return row[key] !== undefined ? row[key] : ""
      }),
    )

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${(cell ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `${title.toLowerCase().replace(/\s+/g, "-")}.csv`)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8",
    })
    saveAs(blob, `${title.toLowerCase().replace(/\s+/g, "-")}.json`)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {title} {!loading && <span className="text-muted-foreground">({data.length})</span>}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {!limit && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportCSV} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportJSON} disabled={loading}>
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? "flex items-center cursor-pointer select-none" : ""}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Keine Daten
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!limit && data.length > 10 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Zurück
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Weiter
            </Button>
          </div>
        )}

        {limit && data.length > limit && (
          <div className="flex justify-center py-4">
            <Button variant="link" asChild>
              <a href={title === "Gemergte Pull Requests pro Projekt" ? "/prs-by-project" : "/pullrequests"}>
                Alle anzeigen
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
