import { NextResponse } from "next/server"

export async function GET() {
  const projects = [
    {
      uuid: "p1",
      name: "Open Elements SDK",
      description: "A TypeScript SDK to interact with Open Elements APIs.",
      svgLogoForBrightBackground: "sdk-logo-light.svg",
      svgLogoForDarkBackground: "sdk-logo-dark.svg",
      pngLogoForBrightBackground: "sdk-logo-light.png",
      pngLogoForDarkBackground: "sdk-logo-dark.png",
      matchingRepos: ["OpenElements/open-elements-sdk"],
    },
    {
      uuid: "Project-support-and-care",
      name: "Support & Care",
      description: "Support and maintenance for open source projects",
      matchingRepos: ["OpenElements/support-care"],
    },
  ]

  return NextResponse.json(projects)
}
