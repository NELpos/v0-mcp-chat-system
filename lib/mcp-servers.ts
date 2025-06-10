export interface MCPServerTool {
  id: string
  name: string
  description: string
  parameters: string[]
}

export interface MCPServer {
  id: string
  name: string
  description: string
  type: "productivity" | "communication" | "development" | "research" | "automation"
  tools: MCPServerTool[]
  requiresAuth: boolean
}

export const mcpServers: MCPServer[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Project management and issue tracking",
    type: "productivity",
    requiresAuth: true,
    tools: [
      {
        id: "create-issue",
        name: "Create Issue",
        description: "Create a new issue in Jira",
        parameters: ["project", "summary", "description", "issue_type"],
      },
      {
        id: "update-issue",
        name: "Update Issue",
        description: "Update an existing issue",
        parameters: ["issue_key", "fields"],
      },
      {
        id: "search-issues",
        name: "Search Issues",
        description: "Search for issues using JQL",
        parameters: ["jql", "fields", "max_results"],
      },
      {
        id: "get-issue",
        name: "Get Issue",
        description: "Get details of a specific issue",
        parameters: ["issue_key"],
      },
      {
        id: "add-comment",
        name: "Add Comment",
        description: "Add a comment to an issue",
        parameters: ["issue_key", "comment"],
      },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code repository management and collaboration",
    type: "development",
    requiresAuth: true,
    tools: [
      {
        id: "create-repository",
        name: "Create Repository",
        description: "Create a new repository",
        parameters: ["name", "description", "private"],
      },
      {
        id: "create-issue",
        name: "Create Issue",
        description: "Create a new issue",
        parameters: ["owner", "repo", "title", "body"],
      },
      {
        id: "create-pull-request",
        name: "Create Pull Request",
        description: "Create a new pull request",
        parameters: ["owner", "repo", "title", "head", "base"],
      },
      {
        id: "search-repositories",
        name: "Search Repositories",
        description: "Search for repositories",
        parameters: ["q", "sort", "order"],
      },
      {
        id: "get-file-content",
        name: "Get File Content",
        description: "Get content of a file",
        parameters: ["owner", "repo", "path", "ref"],
      },
    ],
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for information",
    type: "research",
    requiresAuth: false,
    tools: [
      {
        id: "search",
        name: "Search",
        description: "Search the web",
        parameters: ["query", "num_results"],
      },
      {
        id: "get-page-content",
        name: "Get Page Content",
        description: "Get content from a specific URL",
        parameters: ["url"],
      },
    ],
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code",
    type: "development",
    requiresAuth: false,
    tools: [
      {
        id: "execute-python",
        name: "Execute Python",
        description: "Execute Python code",
        parameters: ["code"],
      },
      {
        id: "analyze-data",
        name: "Analyze Data",
        description: "Analyze data and create visualizations",
        parameters: ["data", "analysis_type"],
      },
    ],
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Confluence and other Atlassian tools",
    type: "productivity",
    requiresAuth: true,
    tools: [
      {
        id: "create-page",
        name: "Create Page",
        description: "Create a new Confluence page",
        parameters: ["space", "title", "content"],
      },
      {
        id: "update-page",
        name: "Update Page",
        description: "Update an existing page",
        parameters: ["page_id", "content"],
      },
      {
        id: "search-content",
        name: "Search Content",
        description: "Search for content in Confluence",
        parameters: ["query", "space"],
      },
    ],
  },
]
