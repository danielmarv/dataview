"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderKanban, Github, GitPullRequest } from "lucide-react"

export function DashboardCards() {
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    repositories: 0,
    pullRequests: 0,
    mergedPRs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employees, projects, repositories, pullRequests] = await Promise.all([
          apiClient.getEmployees(),
          apiClient.getProjects(),
          apiClient.getRepositories(),
          apiClient.getPullRequests(),
        ])

        setStats({
          employees: employees.length,
          projects: projects.length,
          repositories: repositories.length,
          pullRequests: pullRequests.length,
          mergedPRs: pullRequests.filter((pr: any) => pr.merged).length,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const cards = [
    {
      title: "Mitarbeitende",
      value: stats.employees,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Projekte",
      value: stats.projects,
      icon: FolderKanban,
      color: "bg-purple-500",
    },
    {
      title: "Repositories",
      value: stats.repositories,
      icon: Github,
      color: "bg-amber-500",
    },
    {
      title: "Pull Requests",
      value: stats.pullRequests,
      icon: GitPullRequest,
      color: "bg-emerald-500",
      subtitle: `${stats.mergedPRs} gemergt`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`${card.color} p-2 rounded-md text-white`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> : card.value}
            </div>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
