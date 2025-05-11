import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsTable } from "@/components/projects-table"
import { Button } from "@/components/ui/button"
import { GridIcon } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <DashboardHeader />
        <Button variant="outline" asChild>
          <Link href="/projects/grid">
            <GridIcon className="h-4 w-4 mr-2" />
            Grid-Ansicht
          </Link>
        </Button>
      </div>
      <ProjectsTable />
    </div>
  )
}
