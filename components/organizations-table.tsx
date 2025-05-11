"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { formatLink } from "@/lib/formatters"
import { PageHeader } from "@/components/page-header"
import { Building2, Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Organization {
  uuid: string
  name: string
  legalName: string
  streetAddress: string
  postalCode: string
  city: string
  country: string
  email: string
  telephone: string
  founder: string
  registerNumber: string
  registerCourt: string
  vatNumber: string
  url: string
}

export function OrganizationsTable() {
  const [data, setData] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizations = await apiClient.getOrganizations()
        setData(organizations)
      } catch (error) {
        console.error("Error fetching organizations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // For organizations, let's display a card layout instead of a table
  // since there's typically only one organization with many fields
  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Organisation" description="Informationen zu Open Elements" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Organisation" description="Informationen zu Open Elements" />
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Keine Organisationsdaten verfügbar</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Display the first organization in a card layout
  const org = data[0]

  return (
    <div className="space-y-8">
      <PageHeader title="Organisation" description="Informationen zu Open Elements" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {org.name}
            </CardTitle>
            <CardDescription>{org.legalName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Kontakt</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${org.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {org.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${org.telephone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {org.telephone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {org.streetAddress}, {org.postalCode} {org.city}, {org.country}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Website</h3>
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {org.url}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rechtliche Informationen</CardTitle>
            <CardDescription>Handelsregister und Steuerdaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Gründer</div>
                <div>{org.founder}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Handelsregister</div>
                <div>{org.registerCourt}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Registernummer</div>
                <div>{org.registerNumber}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Umsatzsteuer-ID</div>
                <div>{org.vatNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* If there are more organizations, show them in a table */}
      {data.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Weitere Organisationen</h2>
          <DataTable
            columns={getOrganizationColumns()}
            data={data.slice(1)}
            title="Weitere Organisationen"
            description="Zusätzliche Organisationen im System."
          />
        </div>
      )}
    </div>
  )
}

function getOrganizationColumns(): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "legalName",
      header: "Rechtlicher Name",
    },
    {
      accessorKey: "city",
      header: "Stadt",
      cell: ({ row }) => {
        const city = row.getValue("city") as string
        const country = row.getValue("country") as string
        return (
          <span>
            {city}, {country}
          </span>
        )
      },
    },
    {
      accessorKey: "email",
      header: "E-Mail-Adresse",
      cell: ({ row }) => {
        const email = row.getValue("email") as string
        return (
          <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {email}
          </a>
        )
      },
    },
    {
      accessorKey: "url",
      header: "Webseite",
      cell: ({ row }) => {
        const url = row.getValue("url") as string
        return url ? formatLink(url) : null
      },
    },
  ]
}
