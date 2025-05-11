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
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, FileJson, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { saveAs } from "file-saver"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title: string
  description: string
  loading?: boolean
  limit?: number
  searchable?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  loading = false,
  limit,
  searchable = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const limitedData = limit ? data.slice(0, limit) : data

  const table = useReactTable({
    data: limitedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
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

        {searchable && !loading && data.length > 5 && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}
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
          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Weiter
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
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
