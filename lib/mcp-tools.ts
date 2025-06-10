export interface MCPTool {
  id: string
  name: string
  description: string
  type: string
  requiresAuth: boolean
}

export const mcpTools: MCPTool[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Access and manage Jira issues and projects",
    type: "productivity",
    requiresAuth: true,
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Integrate with Atlassian products like Confluence",
    type: "productivity",
    requiresAuth: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Access repositories, issues, and pull requests",
    type: "development",
    requiresAuth: true,
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    type: "search",
    requiresAuth: false,
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute code and analyze data",
    type: "code",
    requiresAuth: false,
  },
]
