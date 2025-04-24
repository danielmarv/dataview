"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  FolderKanban,
  Building2,
  Github,
  GitPullRequest,
  GitMerge,
  Clock,
  HeartHandshake,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  {
    name: "Allgemein",
    children: [
      { name: "Organisationen", href: "/organizations", icon: Building2 },
      { name: "Mitarbeitende", href: "/employees", icon: Users },
      { name: "Projekte", href: "/projects", icon: FolderKanban },
    ],
  },
  {
    name: "GitHub",
    children: [
      { name: "Repositories", href: "/repositories", icon: Github },
      { name: "Pull Requests", href: "/pullrequests", icon: GitPullRequest },
      { name: "Merged PRs pro Projekt", href: "/prs-by-project", icon: GitMerge },
      { name: "Pull Requests nach Zeit", href: "/prs-over-time", icon: Clock },
      { name: "Support & Care PRs", href: "/support-care-prs", icon: HeartHandshake },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 lg:block lg:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
            <span>Open Elements</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-2 px-2">
            {navigation.map((item) => (
              <li key={item.name}>
                {!item.children ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">{item.name}</p>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === child.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4" />}
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
