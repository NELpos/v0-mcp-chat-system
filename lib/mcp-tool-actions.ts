import { mcpServers } from "./mcp-servers"

// Export mcpServers for use in other components
export { mcpServers }

// Define the structure for tool actions
export interface ToolAction {
  id: string
  name: string
  description: string
  execute: (params: any) => Promise<any>
}

// Mock implementation of tool actions
export const toolActions: Record<string, ToolAction[]> = {
  jira: [
    {
      id: "create-issue",
      name: "Create Issue",
      description: "Create a new issue in Jira",
      execute: async (params) => {
        console.log("Creating Jira issue with params:", params)
        return {
          success: true,
          data: {
            id: "DEMO-123",
            key: "DEMO-123",
            self: "https://your-domain.atlassian.net/rest/api/3/issue/10000",
          },
        }
      },
    },
    {
      id: "search-issues",
      name: "Search Issues",
      description: "Search for issues using JQL",
      execute: async (params) => {
        console.log("Searching Jira issues with params:", params)
        return {
          success: true,
          data: {
            issues: [
              {
                id: "10000",
                key: "DEMO-123",
                fields: {
                  summary: "Demo issue",
                  status: { name: "To Do" },
                  assignee: { displayName: "John Doe" },
                },
              },
              {
                id: "10001",
                key: "DEMO-124",
                fields: {
                  summary: "Another demo issue",
                  status: { name: "In Progress" },
                  assignee: { displayName: "Jane Smith" },
                },
              },
            ],
          },
        }
      },
    },
  ],
  github: [
    {
      id: "create-issue",
      name: "Create Issue",
      description: "Create a new issue on GitHub",
      execute: async (params) => {
        console.log("Creating GitHub issue with params:", params)
        return {
          success: true,
          data: {
            id: 1,
            number: 1347,
            title: "Found a bug",
            state: "open",
            url: "https://github.com/octocat/Hello-World/issues/1347",
          },
        }
      },
    },
    {
      id: "search-repositories",
      name: "Search Repositories",
      description: "Search for repositories on GitHub",
      execute: async (params) => {
        console.log("Searching GitHub repositories with params:", params)
        return {
          success: true,
          data: {
            total_count: 2,
            items: [
              {
                id: 1296269,
                name: "Hello-World",
                full_name: "octocat/Hello-World",
                owner: { login: "octocat" },
                html_url: "https://github.com/octocat/Hello-World",
                description: "This is a demo repository",
                stargazers_count: 1524,
              },
              {
                id: 1296270,
                name: "Hello-Universe",
                full_name: "octocat/Hello-Universe",
                owner: { login: "octocat" },
                html_url: "https://github.com/octocat/Hello-Universe",
                description: "This is another demo repository",
                stargazers_count: 753,
              },
            ],
          },
        }
      },
    },
  ],
  "web-search": [
    {
      id: "search",
      name: "Search",
      description: "Search the web",
      execute: async (params) => {
        console.log("Searching the web with params:", params)
        return {
          success: true,
          data: {
            results: [
              {
                title: "Demo search result 1",
                url: "https://example.com/result1",
                snippet: "This is a demo search result snippet.",
              },
              {
                title: "Demo search result 2",
                url: "https://example.com/result2",
                snippet: "This is another demo search result snippet.",
              },
            ],
          },
        }
      },
    },
  ],
  "code-interpreter": [
    {
      id: "execute-python",
      name: "Execute Python",
      description: "Execute Python code",
      execute: async (params) => {
        console.log("Executing Python code:", params.code)
        return {
          success: true,
          data: {
            result: "Code executed successfully",
            output: "Hello, world!",
          },
        }
      },
    },
  ],
  atlassian: [
    {
      id: "create-page",
      name: "Create Page",
      description: "Create a new Confluence page",
      execute: async (params) => {
        console.log("Creating Confluence page with params:", params)
        return {
          success: true,
          data: {
            id: "12345",
            title: params.title,
            url: "https://your-domain.atlassian.net/wiki/spaces/DEMO/pages/12345",
          },
        }
      },
    },
  ],
}
