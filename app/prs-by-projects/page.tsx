import { DashboardHeader } from "@/components/dashboard-header"
import { MergedPRsPerProjectTable } from "@/components/merged-prs-per-project-table"

export default function PRsByProjectPage() {
  return (
    <div>
      <DashboardHeader />
      <MergedPRsPerProjectTable />
    </div>
  )
}
