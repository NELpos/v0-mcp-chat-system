export interface MCPTool {
  id: string
  name: string
  description: string
  parameters?: string[]
}

export interface MCPServer {
  id: string
  name: string
  description: string
  type: string
  requiresAuth: boolean
  tools: MCPTool[]
}

export const mcpServers: MCPServer[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Access and manage Jira issues and projects",
    type: "productivity",
    requiresAuth: true,
    tools: [
      {
        id: "create_issue",
        name: "Create Issue",
        description: "Create a new Jira issue with specified details",
        parameters: ["project", "summary", "description", "issue_type"],
      },
      {
        id: "search_issues",
        name: "Search Issues",
        description: "Search for Jira issues using JQL or filters",
        parameters: ["jql", "fields", "max_results"],
      },
      {
        id: "update_issue",
        name: "Update Issue",
        description: "Update an existing Jira issue",
        parameters: ["issue_key", "fields"],
      },
      {
        id: "get_issue",
        name: "Get Issue",
        description: "Retrieve detailed information about a specific issue",
        parameters: ["issue_key", "fields"],
      },
      {
        id: "add_comment",
        name: "Add Comment",
        description: "Add a comment to a Jira issue",
        parameters: ["issue_key", "comment"],
      },
      {
        id: "transition_issue",
        name: "Transition Issue",
        description: "Move an issue through workflow transitions",
        parameters: ["issue_key", "transition_id"],
      },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages and access Slack channels",
    type: "communication",
    requiresAuth: true,
    tools: [
      {
        id: "send_message",
        name: "Send Message",
        description: "Send a message to a Slack channel or user",
        parameters: ["channel", "text", "attachments"],
      },
      {
        id: "list_channels",
        name: "List Channels",
        description: "Get a list of all channels in the workspace",
        parameters: ["types", "exclude_archived"],
      },
      {
        id: "get_channel_info",
        name: "Get Channel Info",
        description: "Get information about a specific channel",
        parameters: ["channel"],
      },
      {
        id: "list_users",
        name: "List Users",
        description: "Get a list of users in the workspace",
        parameters: ["include_locale"],
      },
      {
        id: "upload_file",
        name: "Upload File",
        description: "Upload a file to Slack",
        parameters: ["channels", "file", "title", "initial_comment"],
      },
      {
        id: "search_messages",
        name: "Search Messages",
        description: "Search for messages in Slack",
        parameters: ["query", "sort", "count"],
      },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Access repositories, issues, and pull requests",
    type: "development",
    requiresAuth: true,
    tools: [
      {
        id: "list_repositories",
        name: "List Repositories",
        description: "List repositories for the authenticated user or organization",
        parameters: ["type", "sort", "direction"],
      },
      {
        id: "get_repository",
        name: "Get Repository",
        description: "Get detailed information about a repository",
        parameters: ["owner", "repo"],
      },
      {
        id: "create_issue",
        name: "Create Issue",
        description: "Create a new issue in a repository",
        parameters: ["owner", "repo", "title", "body", "labels"],
      },
      {
        id: "list_issues",
        name: "List Issues",
        description: "List issues in a repository",
        parameters: ["owner", "repo", "state", "labels", "sort"],
      },
      {
        id: "create_pull_request",
        name: "Create Pull Request",
        description: "Create a new pull request",
        parameters: ["owner", "repo", "title", "head", "base", "body"],
      },
      {
        id: "list_pull_requests",
        name: "List Pull Requests",
        description: "List pull requests in a repository",
        parameters: ["owner", "repo", "state", "sort", "direction"],
      },
      {
        id: "get_file_content",
        name: "Get File Content",
        description: "Get the contents of a file in a repository",
        parameters: ["owner", "repo", "path", "ref"],
      },
      {
        id: "search_code",
        name: "Search Code",
        description: "Search for code in repositories",
        parameters: ["q", "sort", "order"],
      },
    ],
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Integrate with Atlassian products like Confluence",
    type: "productivity",
    requiresAuth: true,
    tools: [
      {
        id: "create_page",
        name: "Create Page",
        description: "Create a new Confluence page",
        parameters: ["space_key", "title", "content", "parent_id"],
      },
      {
        id: "search_content",
        name: "Search Content",
        description: "Search for content in Confluence",
        parameters: ["cql", "limit", "start"],
      },
      {
        id: "get_page",
        name: "Get Page",
        description: "Get detailed information about a Confluence page",
        parameters: ["page_id", "expand"],
      },
      {
        id: "update_page",
        name: "Update Page",
        description: "Update an existing Confluence page",
        parameters: ["page_id", "title", "content", "version"],
      },
      {
        id: "list_spaces",
        name: "List Spaces",
        description: "Get a list of Confluence spaces",
        parameters: ["type", "status", "limit"],
      },
      {
        id: "add_comment",
        name: "Add Comment",
        description: "Add a comment to a Confluence page",
        parameters: ["page_id", "comment"],
      },
    ],
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    type: "search",
    requiresAuth: false,
    tools: [
      {
        id: "search_web",
        name: "Search Web",
        description: "Perform a web search and get results",
        parameters: ["query", "num_results", "region"],
      },
      {
        id: "search_news",
        name: "Search News",
        description: "Search for recent news articles",
        parameters: ["query", "time_range", "region"],
      },
      {
        id: "search_images",
        name: "Search Images",
        description: "Search for images on the web",
        parameters: ["query", "size", "type"],
      },
      {
        id: "get_page_content",
        name: "Get Page Content",
        description: "Extract content from a specific web page",
        parameters: ["url", "format"],
      },
      {
        id: "search_academic",
        name: "Search Academic",
        description: "Search for academic papers and research",
        parameters: ["query", "year_range", "field"],
      },
    ],
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute code and analyze data",
    type: "code",
    requiresAuth: false,
    tools: [
      {
        id: "execute_python",
        name: "Execute Python",
        description: "Execute Python code and return results",
        parameters: ["code", "timeout"],
      },
      {
        id: "execute_javascript",
        name: "Execute JavaScript",
        description: "Execute JavaScript code in a sandbox",
        parameters: ["code", "timeout"],
      },
      {
        id: "analyze_data",
        name: "Analyze Data",
        description: "Perform data analysis on uploaded datasets",
        parameters: ["data", "analysis_type"],
      },
      {
        id: "create_visualization",
        name: "Create Visualization",
        description: "Generate charts and graphs from data",
        parameters: ["data", "chart_type", "options"],
      },
      {
        id: "install_package",
        name: "Install Package",
        description: "Install Python or JavaScript packages",
        parameters: ["package_name", "version"],
      },
      {
        id: "file_operations",
        name: "File Operations",
        description: "Read, write, and manipulate files",
        parameters: ["operation", "file_path", "content"],
      },
    ],
  },
]
