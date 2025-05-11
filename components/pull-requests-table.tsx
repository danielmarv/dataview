"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { formatDateTime } from "@/lib/formatters"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ExternalLink, GitPullRequest, GitMerge, GitBranch } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PullRequest {
  uuid: string
  org: string
  repository: string
  gitHubId: number
  title: string
  createdAtInGitHub: string
  lastUpdateInGitHub: string
  open: boolean
  draft: boolean
  merged: boolean
  author: string
}

export function PullRequestsTable() {
  const [data, setData] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pullRequests = await apiClient.getPullRequests()
        setData(pullRequests)
      } catch (error) {
        console.error("Error fetching pull requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPrState = (pr: PullRequest) => {
    if (pr.merged) return "merged"
    if (pr.draft) return "draft"
    if (pr.open) return "open"
    return "closed"
  }

  const getPrIcon = (state: string) => {
    switch (state) {
      case "merged":
        return <GitMerge className="h-4 w-4" />
      case "draft":
        return <GitBranch className="h-4 w-4" />
      case "open":
        return <GitPullRequest className="h-4 w-4" />
      default:
        return <GitPullRequest className="h-4 w-4" />
    }
  }

  const getPrBadgeVariant = (state: string) => {
    switch (state) {
      case "merged":
        return "default"
      case "draft":
        return "outline"
      case "open":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPrLabel = (state: string) => {
    switch (state) {
      case "merged":
        return "Gemergt"
      case "draft":
        return "Entwurf"
      case "open":
        return "Offen"
      default:
        return "Geschlossen"
    }
  }

  const columns: ColumnDef<PullRequest>[] = [
    {
      accessorKey: "title",
      header: "Titel",
      cell: ({ row }) => {
        const pr = row.original
        const state = getPrState(pr)
        const link = `https://github.com/${pr.org}/${pr.repository}/pull/${pr.gitHubId}`

        return (
          <div className="flex flex-col gap-1.5">
            <div className="font-medium">
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
                {pr.title}
              </a>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getPrBadgeVariant(state) as any} className="text-xs flex items-center gap-1">
                {getPrIcon(state)}
                {getPrLabel(state)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {pr.org}/{pr.repository}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`https://github.com/${pr.author}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={`https://github.com/${pr.author}.png`} alt={pr.author} />
                        <AvatarFallback className="text-[8px]">
                          {pr.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{pr.author}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GitHub Profil öffnen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      accessorKey: "gitHubId",
      header: "PR #",
      cell: ({ row }) => {
        const pr = row.original
        const link = `https://github.com/${pr.org}/${pr.repository}/pull/${pr.gitHubId}`

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  #{pr.gitHubId}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pull Request auf GitHub öffnen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "uuid",
      header: "ID",
      cell: ({ row }) => {
        const uuid = row.getValue("uuid") as string
        return <span className="text-xs text-muted-foreground font-mono">{uuid.substring(0, 8)}...</span>
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
