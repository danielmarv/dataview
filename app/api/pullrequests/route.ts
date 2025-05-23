import { NextResponse } from "next/server"

export async function GET() {
  const pullrequests = [
    {
      uuid: "pr1",
      org: "OpenElements",
      repository: "open-elements-sdk",
      gitHubId: 1001,
      title: "Add authentication support",
      createdAtInGitHub: "2025-03-23T21:03:13.123Z",
      lastUpdateInGitHub: "2025-03-24T12:45:00.000Z",
      open: true,
      merged: false,
      author: "octocat",
    },
    {
      uuid: "pr2",
      org: "OpenElements",
      repository: "open-elements-website",
      gitHubId: 1002,
      title: "Update documentation",
      createdAtInGitHub: "2025-02-15T14:30:00.000Z",
      lastUpdateInGitHub: "2025-02-16T09:20:00.000Z",
      open: false,
      merged: true,
      author: "alicesmith",
    },
    {
      uuid: "pr3",
      org: "OpenElements",
      repository: "support-care",
      gitHubId: 1003,
      title: "Fix critical bug in support module",
      createdAtInGitHub: "2025-01-10T08:15:00.000Z",
      lastUpdateInGitHub: "2025-01-12T16:45:00.000Z",
      open: false,
      merged: true,
      author: "octocat",
    },
  ]

  return NextResponse.json(pullrequests)
}
