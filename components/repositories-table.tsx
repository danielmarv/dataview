"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/page-header"
import { Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Repository {
  uuid: string
  org: string
  repository: string
}

export function RepositoriesTable() {
  const [data, setData] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repositories = await apiClient.getRepositories()
        setData(repositories)
      } catch (error) {
        console.error("Error fetching repositories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<Repository>[] = [
    {
      accessorKey: "org",
      header: "Organisation",
      cell: ({ row }) => {
        const org = row.getValue("org") as string
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
              <Github className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{org}</span>
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "repository",
      header: "Repository",
      cell: ({ row }) => {
        const org = row.getValue("org") as string
        const repo = row.getValue("repository") as string
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${org}/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                >
                  {repo}
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Repository auf GitHub öffnen</p>
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
      <PageHeader
        title="Repositories"
        description="Alle GitHub Repositories, an denen Open Elements bisher Contributions geleistet hat"
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        title="Repositories"
        description="Alle GitHub Repositories, an denen Open Elements bisher Contributions (in Form von Pull Requests) geleistet hat."
      />
    </div>
  )
}
