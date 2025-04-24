"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { apiClient } from "@/lib/api-client"
import { formatLink } from "@/lib/formatters"

interface Organization {
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

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "legalName",
      header: "Rechtlicher Name",
    },
    {
      accessorKey: "streetAddress",
      header: "Strasse",
    },
    {
      accessorKey: "postalCode",
      header: "Postleitzahl",
    },
    {
      accessorKey: "city",
      header: "Stadt",
    },
    {
      accessorKey: "country",
      header: "Land",
    },
    {
      accessorKey: "email",
      header: "E-Mail-Adresse",
    },
    {
      accessorKey: "telephone",
      header: "Telefonnummer",
    },
    {
      accessorKey: "founder",
      header: "Gründer",
    },
    {
      accessorKey: "registerNumber",
      header: "Registernummer",
    },
    {
      accessorKey: "registerCourt",
      header: "Handelsregister",
    },
    {
      accessorKey: "vatNumber",
      header: "Umsatzsteuer-ID",
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

  if (loading) {
    return <div>Lade Daten...</div>
  }

  return (
    <DataTable columns={columns} data={data} title="Organisation" description="Alle Informationen zu Open Elements." />
  )
}
