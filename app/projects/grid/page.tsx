import { PageHeader } from "@/components/page-header"
import { ProjectCard } from "@/components/project-card"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { TableIcon } from "lucide-react"
import Link from "next/link"

export default async function ProjectsGridPage() {
  const projects = await apiClient.getProjects()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <PageHeader title="Projekte" description="Open Source Projekte an denen Open Elements beteiligt ist" />
        <Button variant="outline" asChild>
          <Link href="/projects">
            <TableIcon className="h-4 w-4 mr-2" />
            Tabellen-Ansicht
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.uuid} project={project} />
        ))}
      </div>
    </div>
  )
}
