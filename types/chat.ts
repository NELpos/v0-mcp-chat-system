export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  toolUsed?: string
}

export interface ChatSession {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
  toolId: string
  isActive: boolean
  messageCount: number
}

export interface ChatHistory {
  sessions: ChatSession[]
  currentSessionId?: string
}
