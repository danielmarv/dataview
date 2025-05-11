"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Github } from "lucide-react"

interface Employee {
  uuid: string
  firstName: string
  lastName: string
  role: string | null
  gitHubUsername: string | null
}

export function EmployeesTable() {
  const [data, setData] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await apiClient.getEmployees()
        setData(employees)
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => {
        const firstName = row.getValue("firstName") as string
        const lastName = row.getValue("lastName") as string
        const username = row.getValue("gitHubUsername") as string | null

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={username ? `https://github.com/${username}.png` : undefined}
                alt={`${firstName} ${lastName}`}
              />
              <AvatarFallback>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${firstName} ${lastName}`}</div>
              {username && <div className="text-sm text-muted-foreground">@{username}</div>}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastName",
      header: "Nachname",
      cell: () => null,
    },
    {
      accessorKey: "role",
      header: "Rolle",
      cell: ({ row }) => {
        const role = row.getValue("role") as string | null
        return role ? <Badge variant="outline">{role}</Badge> : null
      },
    },
    {
      accessorKey: "gitHubUsername",
      header: "GitHub",
      cell: ({ row }) => {
        const username = row.getValue("gitHubUsername") as string | null
        return username ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  {username}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub Profil öffnen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null
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
      <PageHeader title="Mitarbeitende" description="Übersicht aller Mitarbeitenden von Open Elements" />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        title="Mitarbeiter"
        description="Alle Mitarbeiter von Open Elements."
      />
    </div>
  )
}
