"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Open Data Übersicht</h1>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Start</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Allgemein</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4">
                <ListItem href="/organizations" title="Organisationen" active={pathname === "/organizations"} />
                <ListItem href="/employees" title="Mitarbeitende" active={pathname === "/employees"} />
                <ListItem href="/projects" title="Projekte" active={pathname === "/projects"} />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>GitHub</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[250px] gap-3 p-4">
                <ListItem href="/repositories" title="Repositories" active={pathname === "/repositories"} />
                <ListItem href="/pullrequests" title="Pull Requests" active={pathname === "/pullrequests"} />
                <ListItem
                  href="/prs-by-project"
                  title="Merged PRs pro Projekt"
                  active={pathname === "/prs-by-project"}
                />
                <ListItem
                  href="/prs-over-time"
                  title="Pull Requests nach Zeit"
                  active={pathname === "/prs-over-time"}
                />
                <ListItem
                  href="/support-care-prs"
                  title="Support & Care PRs"
                  active={pathname === "/support-care-prs"}
                />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

interface ListItemProps {
  href: string
  title: string
  active?: boolean
}

const ListItem = ({ href, title, active }: ListItemProps) => {
  return (
    <li>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            active && "bg-accent text-accent-foreground",
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </NavigationMenuLink>
      </Link>
    </li>
  )
}
