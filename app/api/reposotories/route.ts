import { NextResponse } from "next/server"

export async function GET() {
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
