"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/page-header"
import { Github } from "lucide-react"

interface Repository {
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
            <Github className="h-4 w-4 text-muted-foreground" />
            <a
              href={`https://github.com/${org}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {org}
            </a>
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
          <a
            href={`https://github.com/${org}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {repo}
          </a>
        )
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
