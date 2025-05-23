import { DashboardHeader } from "@/components/dashboard-header"
import { PullRequestsOverTimeChart } from "@/components/pull-requests-over-time-chart"

export default function PRsOverTimePage() {
  return (
    <div>
      {/* <DashboardHeader /> */}
      <PullRequestsOverTimeChart />
    </div>
  )
}
