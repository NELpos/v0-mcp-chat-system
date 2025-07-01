export interface MCPTool {
  name: string
  description: string
  tags: string[]
}

export interface ToolGroup {
  id: string
  name: string
  description: string
  tags: string[]
  tools: MCPTool[]
  color: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  assignedUsers?: string[]
  assignedGroups?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Group {
  id: string
  name: string
  description: string
  memberCount: number
}

export interface ToolAssignment {
  id: string
  toolGroupId: string
  userId?: string
  groupId?: string
  permissions: {
    canView: boolean
    canExecute: boolean
  }
  assignedAt: Date
  assignedBy: string
}
