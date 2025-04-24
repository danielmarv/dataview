"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { formatDateTime, formatPrStatus } from "@/lib/formatters"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"

interface PullRequest {
  title: string
  createdAtInGitHub: string
  lastUpdateInGitHub: string
  state: string
  link: string
  org: string
  repository: string
}

export function PullRequestsTable() {
  const [data, setData] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pullRequests = await apiClient.getPullRequests()
        const formattedPRs = pullRequests.map((pr: any) => ({
          title: pr.title,
          createdAtInGitHub: pr.createdAtInGitHub,
          lastUpdateInGitHub: pr.lastUpdateInGitHub,
          state: pr.merged ? "merged" : pr.open ? "open" : "closed",
          link: `https://github.com/${pr.org}/${pr.repository}/pull/${pr.gitHubId}`,
          org: pr.org,
          repository: pr.repository,
        }))
        setData(formattedPRs)
      } catch (error) {
        console.error("Error fetching pull requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<PullRequest>[] = [
    {
      accessorKey: "title",
      header: "Titel",
      cell: ({ row }) => {
        const title = row.getValue("title") as string
        const state = row.getValue("state") as string
        return (
          <div className="flex flex-col gap-1">
            <div className="font-medium">{title}</div>
            <div className="flex items-center gap-2">
              <Badge
                variant={state === "merged" ? "default" : state === "open" ? "outline" : "secondary"}
                className="text-xs"
              >
                {state === "merged" ? "Gemergt" : state === "open" ? "Offen" : "Geschlossen"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {row.getValue("org") as string}/{row.getValue("repository") as string}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAtInGitHub",
      header: "Erstellt am",
      cell: ({ row }) => {
        const date = row.getValue("createdAtInGitHub") as string
        return <div className="text-sm">{formatDateTime(date)}</div>
      },
    },
    {
      accessorKey: "lastUpdateInGitHub",
      header: "Letzte Aktualisierung",
      cell: ({ row }) => {
        const date = row.getValue("lastUpdateInGitHub") as string
        return <div className="text-sm">{formatDateTime(date)}</div>
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
      <PageHeader title="Pull Requests" description="Alle Pull Requests, die von Open Elements erstellt wurden" />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        title="Pull Requests"
        description="Alle Pull Requests, die von Open Elements erstellt wurden."
      />
    </div>
  )
}
