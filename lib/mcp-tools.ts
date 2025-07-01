import type { MCPTool, ToolGroup } from "@/types/tool-group"

// Mock data - 실제로는 API에서 가져올 데이터
export const mockMCPTools: MCPTool[] = [
  {
    name: "get_my_data",
    description: "Provides data",
    tags: [],
  },
  {
    name: "get_ip_report",
    description: "Fetches the virustotal report for a given IP address",
    tags: ["virustotal"],
  },
  {
    name: "scan_file",
    description: "Scans a file for malware using VirusTotal",
    tags: ["virustotal", "security"],
  },
  {
    name: "create_repository",
    description: "Creates a new GitHub repository",
    tags: ["github", "development"],
  },
  {
    name: "create_issue",
    description: "Creates a new issue in GitHub repository",
    tags: ["github", "development"],
  },
  {
    name: "search_repositories",
    description: "Searches for GitHub repositories",
    tags: ["github", "development"],
  },
  {
    name: "send_message",
    description: "Sends a message to Slack channel",
    tags: ["slack", "communication"],
  },
  {
    name: "create_channel",
    description: "Creates a new Slack channel",
    tags: ["slack", "communication"],
  },
  {
    name: "get_weather",
    description: "Gets current weather information",
    tags: ["weather", "api"],
  },
  {
    name: "translate_text",
    description: "Translates text between languages",
    tags: ["translation", "ai"],
  },
]

// Make the same array available under the original name for backward-compat
export const mcpTools = mockMCPTools

// 태그별로 도구들을 그룹화하는 함수
export function groupToolsByTags(tools: MCPTool[]): Record<string, MCPTool[]> {
  const grouped: Record<string, MCPTool[]> = {}

  tools.forEach((tool) => {
    if (tool.tags.length === 0) {
      // 태그가 없는 도구들은 "general" 그룹에 포함
      if (!grouped["general"]) {
        grouped["general"] = []
      }
      grouped["general"].push(tool)
    } else {
      // 각 태그별로 도구 추가
      tool.tags.forEach((tag) => {
        if (!grouped[tag]) {
          grouped[tag] = []
        }
        grouped[tag].push(tool)
      })
    }
  })

  return grouped
}

// 서비스별 정보 (태그 기반)
export const serviceInfo: Record<string, { name: string; description: string; color: string }> = {
  virustotal: {
    name: "VirusTotal",
    description: "Malware detection and analysis service",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  github: {
    name: "GitHub",
    description: "Code repository management and collaboration",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  slack: {
    name: "Slack",
    description: "Team communication and collaboration",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  weather: {
    name: "Weather API",
    description: "Weather information and forecasts",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  translation: {
    name: "Translation",
    description: "Language translation services",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  security: {
    name: "Security",
    description: "Security and threat analysis",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  development: {
    name: "Development",
    description: "Software development tools",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  communication: {
    name: "Communication",
    description: "Team communication tools",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  api: {
    name: "API Services",
    description: "External API integrations",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  ai: {
    name: "AI Services",
    description: "Artificial intelligence tools",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  },
  general: {
    name: "General",
    description: "General purpose tools",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
}

// API에서 도구 목록을 가져오는 함수
export async function fetchMCPTools(): Promise<MCPTool[]> {
  try {
    // 실제 API 호출
    // const response = await fetch('/api/mcp/tools')
    // const data: MCPServerResponse = await response.json()
    // return data.tools

    // 현재는 mock 데이터 반환
    return mockMCPTools
  } catch (error) {
    console.error("Failed to fetch MCP tools:", error)
    return []
  }
}

// Tool Group 생성 함수
export function createToolGroupFromTags(tag: string, tools: MCPTool[]): ToolGroup {
  const info = serviceInfo[tag] || serviceInfo.general

  return {
    id: `group-${tag}`,
    name: info.name,
    description: info.description,
    tags: [tag],
    tools: tools,
    color: info.color,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }
}
