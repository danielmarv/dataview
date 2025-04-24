import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - in a real app, this would come from a database or external API
  const repositories = [
    {
      uuid: "r1",
      org: "OpenElements",
      repository: "open-elements-website",
    },
    {
      uuid: "r2",
      org: "OpenElements",
      repository: "open-elements-sdk",
    },
    {
      uuid: "r3",
      org: "OpenElements",
      repository: "support-care",
    },
  ]

  return NextResponse.json(repositories)
}
