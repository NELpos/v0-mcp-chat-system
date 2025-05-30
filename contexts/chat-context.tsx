"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ChatSession, ChatMessage } from "@/types/chat"
import { mcpTools } from "@/lib/mcp-tools"

interface ChatContextType {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  createNewSession: (toolId: string, title?: string) => ChatSession
  loadSession: (sessionId: string) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  deleteSession: (sessionId: string) => void
  addMessageToSession: (sessionId: string, message: ChatMessage) => void
  clearAllSessions: () => void
  isLoaded: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock data for demonstration
const mockSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "Jira Issue Management",
    description: "Discussion about creating and managing Jira issues",
    createdAt: new Date("2024-01-20T10:00:00Z"),
    updatedAt: new Date("2024-01-20T10:30:00Z"),
    toolId: "jira",
    isActive: false,
    messageCount: 8,
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Can you help me create a new Jira issue for the login bug?",
        timestamp: new Date("2024-01-20T10:00:00Z"),
        toolUsed: "jira",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "I'll help you create a Jira issue for the login bug. Let me gather the necessary information first. What project should this issue be created in?",
        timestamp: new Date("2024-01-20T10:01:00Z"),
        toolUsed: "jira",
      },
      {
        id: "msg-3",
        role: "user",
        content: "It should go in the WEBAPP project. The issue is that users can't log in with their email addresses.",
        timestamp: new Date("2024-01-20T10:02:00Z"),
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "Perfect! I've created a new issue in the WEBAPP project:\n\n**Issue Key**: WEBAPP-123\n**Summary**: Login Bug - Users Cannot Log In with Email Addresses\n**Type**: Bug\n**Priority**: High\n\nThe issue has been assigned to the development team and is now in the 'To Do' status. Would you like me to add any additional details or attachments?",
        timestamp: new Date("2024-01-20T10:03:00Z"),
        toolUsed: "jira",
      },
    ],
  },
  {
    id: "session-2",
    title: "Slack Team Communication",
    description: "Setting up team notifications and channels",
    createdAt: new Date("2024-01-19T14:00:00Z"),
    updatedAt: new Date("2024-01-19T14:45:00Z"),
    toolId: "slack",
    isActive: false,
    messageCount: 12,
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "I need to send a message to the #development channel about the new release.",
        timestamp: new Date("2024-01-19T14:00:00Z"),
        toolUsed: "slack",
      },
      {
        id: "msg-6",
        role: "assistant",
        content: "I can help you send a message to the #development channel. What would you like the message to say?",
        timestamp: new Date("2024-01-19T14:01:00Z"),
        toolUsed: "slack",
      },
    ],
  },
  {
    id: "session-3",
    title: "GitHub Repository Analysis",
    description: "Analyzing code quality and pull requests",
    createdAt: new Date("2024-01-18T09:00:00Z"),
    updatedAt: new Date("2024-01-18T09:30:00Z"),
    toolId: "github",
    isActive: false,
    messageCount: 6,
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "Can you review the latest pull request in our main repository?",
        timestamp: new Date("2024-01-18T09:00:00Z"),
        toolUsed: "github",
      },
      {
        id: "msg-8",
        role: "assistant",
        content: "I'll review the latest pull request for you. Let me fetch the details from your main repository.",
        timestamp: new Date("2024-01-18T09:01:00Z"),
        toolUsed: "github",
      },
    ],
  },
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadSessionsFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const savedSessions = localStorage.getItem("mcp-chat-sessions")
          if (savedSessions) {
            const parsed = JSON.parse(savedSessions)
            if (Array.isArray(parsed)) {
              // Convert date strings back to Date objects
              const sessionsWithDates = parsed.map((session: any) => ({
                ...session,
                createdAt: new Date(session.createdAt),
                updatedAt: new Date(session.updatedAt),
                messages: session.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                })),
              }))
              setSessions(sessionsWithDates)
            }
          } else {
            // Use mock data if no saved sessions
            setSessions(mockSessions)
          }
        }
      } catch (error) {
        console.error("Failed to parse saved sessions:", error)
        setSessions(mockSessions)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSessionsFromStorage()
  }, [])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("mcp-chat-sessions", JSON.stringify(sessions))
    }
  }, [sessions, isLoaded])

  const createNewSession = (toolId: string, title?: string) => {
    const tool = mcpTools.find((t) => t.id === toolId) || mcpTools[0]
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: title || `New ${tool.name} Chat`,
      createdAt: new Date(),
      updatedAt: new Date(),
      toolId,
      isActive: true,
      messageCount: 0,
      messages: [],
    }

    setSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession)
    return newSession
  }

  const loadSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      // Mark session as active and others as inactive
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          isActive: s.id === sessionId,
        })),
      )
    }
  }

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, title, updatedAt: new Date() } : session)),
    )
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
    if (currentSession?.id === sessionId) {
      setCurrentSession(null)
    }
  }

  const addMessageToSession = (sessionId: string, message: ChatMessage) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              messageCount: session.messageCount + 1,
              updatedAt: new Date(),
            }
          : session,
      ),
    )
  }

  const clearAllSessions = () => {
    setSessions([])
    setCurrentSession(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("mcp-chat-sessions")
    }
  }

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        createNewSession,
        loadSession,
        updateSessionTitle,
        deleteSession,
        addMessageToSession,
        clearAllSessions,
        isLoaded,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
