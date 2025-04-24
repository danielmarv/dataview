"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/page-header"
import { FolderKanban } from "lucide-react"

interface Project {
  name: string
  description: string
}

export function ProjectsTable() {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await apiClient.getProjects()
        setData(projects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return (
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
              <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Beschreibung",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return <div className="max-w-md">{description}</div>
      },
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Projekte" description="Open Source Projekte an denen Open Elements beteiligt ist" />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        title="Projekte"
        description="Open Source Projekte an denen Open Elements beteiligt ist."
      />
    </div>
  )
}
