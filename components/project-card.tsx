"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

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

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { theme } = useTheme()

  const getProjectLogo = () => {
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

  // Function to truncate description
  const truncateDescription = (description: string, maxLength = 120) => {
    if (!description) return "No description available"
    if (description === "TODO") return "Description coming soon"
    if (description.length <= maxLength) return description
    return `${description.substring(0, maxLength)}...`
  }

  const logoUrl = getProjectLogo()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md flex items-center justify-center w-10 h-10">
            {logoUrl ? (
              <img src={logoUrl || "/placeholder.svg"} alt={project.name} className="max-w-full max-h-full" />
            ) : (
              <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <CardTitle className="text-lg">{project.name}</CardTitle>
        </div>
        <CardDescription className="mt-2">{truncateDescription(project.description)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Repositories</h4>
            <div className="flex flex-wrap gap-2">
              {project.matchingRepos.slice(0, 3).map((repo, index) => (
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
              {project.matchingRepos.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.matchingRepos.length - 3} weitere
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
