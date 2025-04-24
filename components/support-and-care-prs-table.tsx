"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { formatDateTime, formatPrStatus } from "@/lib/formatters"
import { PageHeader } from "@/components/page-header"

interface SupportAndCarePR {
  title: string
  lastUpdateInGitHub: string
  state: string
  link: string
}

export function SupportAndCarePRsTable() {
  const [data, setData] = useState<SupportAndCarePR[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supportAndCarePRs = await apiClient.getSupportAndCarePullRequests()
        setData(supportAndCarePRs)
      } catch (error) {
        console.error("Error fetching support and care PRs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<SupportAndCarePR>[] = [
    {
      accessorKey: "title",
      header: "Titel",
    },
    {
      accessorKey: "lastUpdateInGitHub",
      header: "Letzte Aktualisierung",
      cell: ({ row }) => {
        const date = row.getValue("lastUpdateInGitHub") as string
        return formatDateTime(date)
      },
    },
    {
      accessorKey: "state",
      header: "Status",
      cell: ({ row }) => {
        const state = row.getValue("state") as string
        return formatPrStatus(state)
      },
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => {
        const link = row.getValue("link") as string
        return (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            PR #{link.split("/").pop()}
          </a>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support & Care Pull Requests"
        description="Übersicht über alle von Open Elements erstellten Pull Requests für das Support & Care Projekt"
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        title="Alle Pull Requests von Support & Care"
        description="Übersicht über alle von Open Elements erstellten Pull Requests für das Support & Care Projekt (nach 01.12.2024)."
      />
    </div>
  )
}
