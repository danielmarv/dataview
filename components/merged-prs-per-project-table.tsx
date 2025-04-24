"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/page-header"
import { Progress } from "@/components/ui/progress"

interface MergedPRsPerProject {
  name: string
  mergedCount: number
}

export function MergedPRsPerProjectTable({ limit }: { limit?: number }) {
  const [data, setData] = useState<MergedPRsPerProject[]>([])
  const [loading, setLoading] = useState(true)
  const [maxCount, setMaxCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mergedPRs = await apiClient.getMergedPullRequestsPerProject()
        // Sort by mergedCount in descending order
        const sortedData = [...mergedPRs].sort((a, b) => b.mergedCount - a.mergedCount)
        setData(sortedData)

        // Find the maximum count for the progress bar
        const max: number = Math.max(...mergedPRs.map((item: MergedPRsPerProject) => item.mergedCount))
        setMaxCount(max)
      } catch (error) {
        console.error("Error fetching merged PRs per project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<MergedPRsPerProject>[] = [
    {
      accessorKey: "name",
      header: "Projekt",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return <div className="font-medium">{name}</div>
      },
    },
    {
      accessorKey: "mergedCount",
      header: "Gemergte PRs",
      cell: ({ row }) => {
        const count = row.getValue("mergedCount") as number
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

        return (
          <div className="w-full flex items-center gap-2">
            <div className="w-full max-w-[200px]">
              <Progress value={percentage} className="h-2" />
            </div>
            <span className="text-sm font-medium">{count}</span>
          </div>
        )
      },
    },
  ]

  return (
    <>
      {!limit && (
        <PageHeader
          title="Gemergte Pull Requests pro Projekt"
          description="Übersicht über alle von Open Elements erstellten und erfolgreich gemergten Pull Requests pro Projekt"
        />
      )}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        limit={limit}
        title="Gemergte Pull Requests pro Projekt"
        description="Übersicht über alle von Open Elements erstellten und erfolgreich gemergten Pull Requests pro Projekt."
      />
    </>
  )
}
