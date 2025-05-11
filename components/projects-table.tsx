"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/page-header"
import { FolderKanban, Github, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Project {
  uuid: string
  name: string
  description: string
  svgLogoForBrightBackground: string | null
  svgLogoForDarkBackground: string | null
  pngLogoForBrightBackground: string | null
  pngLogoForDarkBackground: string | null
  matchingRepos: string[]
}

export function ProjectsTable() {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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

  const getProjectLogo = (project: Project) => {
    const isDark = theme === "dark"

    // Try to get SVG logo first
    if (isDark && project.svgLogoForDarkBackground) {
      return `/data/logo/${project.svgLogoForDarkBackground}`
    } else if (!isDark && project.svgLogoForBrightBackground) {
      return `/data/logo/${project.svgLogoForBrightBackground}`
    }

    // Fall back to PNG logo
    if (isDark && project.pngLogoForDarkBackground) {
      return `/data/logo/${project.pngLogoForDarkBackground}`
    } else if (!isDark && project.pngLogoForBrightBackground) {
      return `/data/logo/${project.pngLogoForBrightBackground}`
    }

    // No logo available
    return null
  }

  // Function to truncate description to about 3 words
  const truncateDescription = (description: string) => {
    if (!description) return "No description available"
    if (description === "TODO") return "Description coming soon"

    // Split by spaces and take first 3 words
    const words = description.split(" ").slice(0, 3).join(" ")

    // Add ellipsis if the description is longer than 3 words
    return description.split(" ").length > 3 ? `${words}...` : words
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const project = row.original
        const logoUrl = getProjectLogo(project)

        return (
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md flex items-center justify-center w-10 h-10">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt={name} className="max-w-full max-h-full" />
              ) : (
                <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
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
        return <div className="max-w-md">{truncateDescription(description)}</div>
      },
    },
    {
      accessorKey: "matchingRepos",
      header: "Repositories",
      cell: ({ row }) => {
        const matchingRepos = row.getValue("matchingRepos") as string[]

        if (!matchingRepos || matchingRepos.length === 0) {
          return <span className="text-muted-foreground text-sm">Keine</span>
        }

        return (
          <div className="flex flex-wrap gap-2">
            {matchingRepos.slice(0, 2).map((repo, index) => {
              const parts = repo.split("/")
              const org = parts[0]
              const repoName = parts.length > 1 ? parts[1] : repo

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://github.com/${repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Github className="h-3 w-3" />
                        {repoName}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{repo}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
            {matchingRepos.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{matchingRepos.length - 2} weitere
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProject(project)} className="ml-auto">
                <Info className="h-4 w-4" />
                <span className="sr-only">Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md flex items-center justify-center w-10 h-10">
                    {getProjectLogo(project) ? (
                      <img src={getProjectLogo(project) || ""} alt={project.name} className="max-w-full max-h-full" />
                    ) : (
                      <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  {project.name}
                </DialogTitle>
                <DialogDescription>
                  {project.description === "TODO" ? "Description coming soon" : project.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Repositories</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.matchingRepos.map((repo, index) => (
                      <a
                        key={index}
                        href={`https://github.com/${repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Github className="h-3 w-3" />
                        {repo}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Project ID</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{project.uuid}</code>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
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
