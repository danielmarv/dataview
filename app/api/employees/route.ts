import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - in a real app, this would come from a database or external API
  const employees = [
    {
      uuid: "e1",
      firstName: "Jon",
      lastName: "Doe",
      role: "Senior Engineer",
      gitHubUsername: "octocat",
    },
    {
      uuid: "e2",
      firstName: "Alice",
      lastName: "Smith",
      role: "DevRel",
      gitHubUsername: "alicesmith",
    },
  ]

  return NextResponse.json(employees)
}
