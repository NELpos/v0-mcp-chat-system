import type { MCPTool } from "@/lib/mcp-tools"

export interface ToolGroup {
  id: string
  name: string
  description: string
  tools: MCPTool[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "guest"
  avatarUrl?: string
}

export interface UserGroup {
  id: string
  name: string
  description: string
  members: User[]
}

export interface Permission {
  id: string
  userId?: string
  userGroupId?: string
  toolGroupId: string
  accessLevel: "read" | "write" | "admin"
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}
