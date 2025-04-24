"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { parseISO, format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PageHeader } from "@/components/page-header"

interface ChartData {
  month: string
  count: number
}

function groupPRsByMonth(prs: any[]) {
  const grouped: Record<string, number> = {}

  prs.forEach((pr) => {
    const date = parseISO(pr.createdAtInGitHub)
    const key = format(date, "yyyy-MM") // z. B. "2024-09"

    if (!grouped[key]) {
      grouped[key] = 0
    }
    grouped[key]++
  })

  // Sort by date
  return Object.entries(grouped)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({
      month,
      count,
    }))
}

function getYearTicks(data: ChartData[]) {
  const years = new Set()
  return data
    .filter((item) => {
      const year = item.month.split("-")[0]
      if (!years.has(year)) {
        years.add(year)
        return true
      }
      return false
    })
    .map((item) => item.month)
}

export function PullRequestsOverTimeChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pullRequests = await apiClient.getPullRequests()
        const groupedData = groupPRsByMonth(pullRequests)
        setData(groupedData)
      } catch (error) {
        console.error("Error fetching pull requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {window.location.pathname === "/prs-over-time" && (
        <PageHeader
          title="Pull Requests über die Zeit"
          description="Alle Pull Requests, die von Open Elements erstellt wurden zeitlich angeordnet"
        />
      )}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pull Requests über die Zeit</CardTitle>
          <CardDescription>
            Alle Pull Requests, die von Open Elements erstellt wurden zeitlich angeordnet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-md">
              Lade Daten...
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(month) => {
                      const [year, monthNum] = month.split("-")
                      return `${monthNum}/${year.slice(2)}`
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} PRs`, "Anzahl"]}
                    labelFormatter={(label) => {
                      const [year, month] = label.split("-")
                      const monthNames = [
                        "Jan",
                        "Feb",
                        "Mär",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Okt",
                        "Nov",
                        "Dez",
                      ]
                      return `${monthNames[Number.parseInt(month) - 1]} ${year}`
                    }}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
