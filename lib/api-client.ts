function matchesPR(pattern: string, pr: any) {
    const full = `${pr.org}/${pr.repository}`
    if (pattern.endsWith("/*")) {
      const org = pattern.replace("/*", "")
      return pr.org === org
    }
    return full === pattern
  }
  
  export class OpenDataApiClient {
    private baseUrl: string
  
    constructor(baseUrl?: string) {
      this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
    }
  
    async getJson(endpoint: string) {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`)
        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen von ${endpoint}: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        console.error(`[ApiClient] GET ${endpoint} failed:`, error)
        throw error
      }
    }
  
    async getSupportAndCarePullRequests() {
      const prsPromise = this.getPullRequests()
      const projectsPromise = this.getProjects()
  
      const SPECIAL_PROJECT_UUIDS = ["Project-support-and-care", "Project-maven", "Project-maven-plugins"]
  
      return Promise.all([prsPromise, projectsPromise]).then(([prs, projects]) => {
        const filteredProjects = projects.filter((project: { uuid: string; matchingRepos?: string[] }) => SPECIAL_PROJECT_UUIDS.includes(project.uuid))
        const relevantPatterns = filteredProjects.flatMap((project: { uuid: string; matchingRepos?: string[] }) => project.matchingRepos || [])
  
        const filteredPRs = prs.filter(
          (pr: { org: string; repository: string; lastUpdateInGitHub: string; merged: boolean; open: boolean; gitHubId: number; title: string }) =>
            relevantPatterns.some((pattern: string) => matchesPR(pattern, pr)) &&
            new Date(pr.lastUpdateInGitHub) >= new Date("2024-12-01"),
        )
  
        return filteredPRs.map((pr: { org: string; repository: string; lastUpdateInGitHub: string; merged: boolean; open: boolean; gitHubId: number; title: string }) => ({
          title: pr.title,
          lastUpdateInGitHub: pr.lastUpdateInGitHub,
          state: pr.merged ? "merged" : pr.open ? "open" : "closed",
          link: `https://github.com/${pr.org}/${pr.repository}/pull/${pr.gitHubId}`,
        }))
      })
    }
  
    async getMergedPullRequestsPerProject() {
      const prs = this.getPullRequests()
      const projects = this.getProjects()
  
      return Promise.all([prs, projects]).then(([prs, projects]) => {
        return projects.map((project: { name: string; matchingRepos?: string[] }) => {
          const matching = prs.filter(
            (pr: { org: string; repository: string; merged: boolean }) =>
              Array.isArray(project.matchingRepos) &&
              project.matchingRepos.some((pattern: string) => matchesPR(pattern, pr)) &&
              pr.merged === true,
          )
          return {
            name: project.name,
            mergedCount: matching.length,
          }
        })
      })
    }
  
    async getEmployees() {
      return this.getJson("employees")
    }
  
    async getPullRequests() {
      return this.getJson("pullrequests")
    }
  
    async getProjects() {
      return this.getJson("projects")
    }
  
    async getRepositories() {
      return this.getJson("repositories")
    }
  
    async getOrganizations() {
      return this.getJson("organizations")
    }
  }
  
  export const apiClient = new OpenDataApiClient()
  