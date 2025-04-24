import { DashboardCards } from "@/components/dashboard-cards"
import { PullRequestsOverTimeChart } from "@/components/pull-requests-over-time-chart"
import { MergedPRsPerProjectTable } from "@/components/merged-prs-per-project-table"
import { PageHeader } from "@/components/page-header"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Übersicht über alle Open Elements Aktivitäten und Beiträge" />
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PullRequestsOverTimeChart />
        <MergedPRsPerProjectTable limit={5} />
      </div>
    </div>
  )
}
