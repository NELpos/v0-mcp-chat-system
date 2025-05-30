export interface PromptVersion {
  id: string
  version: string
  content: string
  description?: string
  createdAt: Date
  createdBy: string
  tags: string[]
  isActive: boolean
}

export interface Prompt {
  id: string
  name: string
  description: string
  category: string
  versions: PromptVersion[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface PromptDiff {
  type: "added" | "removed" | "unchanged"
  content: string
  lineNumber?: number
}
