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

// Extended mock data for demonstration (20 sessions)
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
    ],
  },
  {
    id: "session-4",
    title: "Web Search for Documentation",
    description: "Searching for API documentation and tutorials",
    createdAt: new Date("2024-01-17T16:20:00Z"),
    updatedAt: new Date("2024-01-17T16:45:00Z"),
    toolId: "web-search",
    isActive: false,
    messageCount: 15,
    messages: [
      {
        id: "msg-10",
        role: "user",
        content: "Find the latest React documentation for hooks",
        timestamp: new Date("2024-01-17T16:20:00Z"),
        toolUsed: "web-search",
      },
    ],
  },
  {
    id: "session-5",
    title: "Code Interpreter Session",
    description: "Python data analysis and visualization",
    createdAt: new Date("2024-01-16T11:30:00Z"),
    updatedAt: new Date("2024-01-16T12:15:00Z"),
    toolId: "code-interpreter",
    isActive: false,
    messageCount: 22,
    messages: [
      {
        id: "msg-12",
        role: "user",
        content: "Analyze this CSV data and create a visualization",
        timestamp: new Date("2024-01-16T11:30:00Z"),
        toolUsed: "code-interpreter",
      },
    ],
  },
  {
    id: "session-6",
    title: "Atlassian Confluence Setup",
    description: "Setting up team documentation space",
    createdAt: new Date("2024-01-15T13:45:00Z"),
    updatedAt: new Date("2024-01-15T14:20:00Z"),
    toolId: "atlassian",
    isActive: false,
    messageCount: 9,
    messages: [
      {
        id: "msg-15",
        role: "user",
        content: "Help me create a new Confluence space for our project",
        timestamp: new Date("2024-01-15T13:45:00Z"),
        toolUsed: "atlassian",
      },
    ],
  },
  {
    id: "session-7",
    title: "Bug Tracking Workflow",
    description: "Optimizing bug reporting process in Jira",
    createdAt: new Date("2024-01-14T08:15:00Z"),
    updatedAt: new Date("2024-01-14T09:00:00Z"),
    toolId: "jira",
    isActive: false,
    messageCount: 18,
    messages: [
      {
        id: "msg-18",
        role: "user",
        content: "How can we improve our bug tracking workflow?",
        timestamp: new Date("2024-01-14T08:15:00Z"),
        toolUsed: "jira",
      },
    ],
  },
  {
    id: "session-8",
    title: "Daily Standup Automation",
    description: "Automating daily standup reminders in Slack",
    createdAt: new Date("2024-01-13T10:30:00Z"),
    updatedAt: new Date("2024-01-13T11:15:00Z"),
    toolId: "slack",
    isActive: false,
    messageCount: 14,
    messages: [
      {
        id: "msg-20",
        role: "user",
        content: "Set up automated daily standup reminders",
        timestamp: new Date("2024-01-13T10:30:00Z"),
        toolUsed: "slack",
      },
    ],
  },
  {
    id: "session-9",
    title: "Code Review Guidelines",
    description: "Establishing code review best practices",
    createdAt: new Date("2024-01-12T15:20:00Z"),
    updatedAt: new Date("2024-01-12T16:10:00Z"),
    toolId: "github",
    isActive: false,
    messageCount: 25,
    messages: [
      {
        id: "msg-22",
        role: "user",
        content: "Create guidelines for effective code reviews",
        timestamp: new Date("2024-01-12T15:20:00Z"),
        toolUsed: "github",
      },
    ],
  },
  {
    id: "session-10",
    title: "Market Research Analysis",
    description: "Researching competitor analysis and trends",
    createdAt: new Date("2024-01-11T09:45:00Z"),
    updatedAt: new Date("2024-01-11T10:30:00Z"),
    toolId: "web-search",
    isActive: false,
    messageCount: 11,
    messages: [
      {
        id: "msg-25",
        role: "user",
        content: "Research current trends in AI development tools",
        timestamp: new Date("2024-01-11T09:45:00Z"),
        toolUsed: "web-search",
      },
    ],
  },
  {
    id: "session-11",
    title: "Data Pipeline Optimization",
    description: "Optimizing ETL processes with Python",
    createdAt: new Date("2024-01-10T14:00:00Z"),
    updatedAt: new Date("2024-01-10T15:30:00Z"),
    toolId: "code-interpreter",
    isActive: false,
    messageCount: 31,
    messages: [
      {
        id: "msg-28",
        role: "user",
        content: "Optimize our data processing pipeline",
        timestamp: new Date("2024-01-10T14:00:00Z"),
        toolUsed: "code-interpreter",
      },
    ],
  },
  {
    id: "session-12",
    title: "Team Knowledge Base",
    description: "Creating comprehensive team documentation",
    createdAt: new Date("2024-01-09T11:20:00Z"),
    updatedAt: new Date("2024-01-09T12:45:00Z"),
    toolId: "atlassian",
    isActive: false,
    messageCount: 16,
    messages: [
      {
        id: "msg-30",
        role: "user",
        content: "Structure our team knowledge base in Confluence",
        timestamp: new Date("2024-01-09T11:20:00Z"),
        toolUsed: "atlassian",
      },
    ],
  },
  {
    id: "session-13",
    title: "Sprint Planning Session",
    description: "Planning next sprint tasks and assignments",
    createdAt: new Date("2024-01-08T13:30:00Z"),
    updatedAt: new Date("2024-01-08T14:15:00Z"),
    toolId: "jira",
    isActive: false,
    messageCount: 20,
    messages: [
      {
        id: "msg-32",
        role: "user",
        content: "Help plan our next 2-week sprint",
        timestamp: new Date("2024-01-08T13:30:00Z"),
        toolUsed: "jira",
      },
    ],
  },
  {
    id: "session-14",
    title: "Release Announcement",
    description: "Coordinating product release communications",
    createdAt: new Date("2024-01-07T16:45:00Z"),
    updatedAt: new Date("2024-01-07T17:20:00Z"),
    toolId: "slack",
    isActive: false,
    messageCount: 8,
    messages: [
      {
        id: "msg-35",
        role: "user",
        content: "Draft release announcement for v2.0",
        timestamp: new Date("2024-01-07T16:45:00Z"),
        toolUsed: "slack",
      },
    ],
  },
  {
    id: "session-15",
    title: "CI/CD Pipeline Setup",
    description: "Configuring automated deployment workflows",
    createdAt: new Date("2024-01-06T10:15:00Z"),
    updatedAt: new Date("2024-01-06T11:45:00Z"),
    toolId: "github",
    isActive: false,
    messageCount: 27,
    messages: [
      {
        id: "msg-38",
        role: "user",
        content: "Set up GitHub Actions for automated testing",
        timestamp: new Date("2024-01-06T10:15:00Z"),
        toolUsed: "github",
      },
    ],
  },
  {
    id: "session-16",
    title: "Technical Documentation Search",
    description: "Finding specific API endpoints and examples",
    createdAt: new Date("2024-01-05T12:30:00Z"),
    updatedAt: new Date("2024-01-05T13:00:00Z"),
    toolId: "web-search",
    isActive: false,
    messageCount: 7,
    messages: [
      {
        id: "msg-40",
        role: "user",
        content: "Find examples of REST API authentication methods",
        timestamp: new Date("2024-01-05T12:30:00Z"),
        toolUsed: "web-search",
      },
    ],
  },
  {
    id: "session-17",
    title: "Machine Learning Model Training",
    description: "Training and evaluating ML models",
    createdAt: new Date("2024-01-04T09:20:00Z"),
    updatedAt: new Date("2024-01-04T11:30:00Z"),
    toolId: "code-interpreter",
    isActive: false,
    messageCount: 35,
    messages: [
      {
        id: "msg-42",
        role: "user",
        content: "Train a classification model on this dataset",
        timestamp: new Date("2024-01-04T09:20:00Z"),
        toolUsed: "code-interpreter",
      },
    ],
  },
  {
    id: "session-18",
    title: "Project Requirements Documentation",
    description: "Documenting functional and technical requirements",
    createdAt: new Date("2024-01-03T14:45:00Z"),
    updatedAt: new Date("2024-01-03T16:00:00Z"),
    toolId: "atlassian",
    isActive: false,
    messageCount: 19,
    messages: [
      {
        id: "msg-45",
        role: "user",
        content: "Document requirements for the new feature",
        timestamp: new Date("2024-01-03T14:45:00Z"),
        toolUsed: "atlassian",
      },
    ],
  },
  {
    id: "session-19",
    title: "Performance Issue Investigation",
    description: "Investigating and resolving performance bottlenecks",
    createdAt: new Date("2024-01-02T11:10:00Z"),
    updatedAt: new Date("2024-01-02T12:30:00Z"),
    toolId: "jira",
    isActive: false,
    messageCount: 13,
    messages: [
      {
        id: "msg-48",
        role: "user",
        content: "Investigate slow API response times",
        timestamp: new Date("2024-01-02T11:10:00Z"),
        toolUsed: "jira",
      },
    ],
  },
  {
    id: "session-20",
    title: "Team Onboarding Process",
    description: "Streamlining new team member onboarding",
    createdAt: new Date("2024-01-01T15:30:00Z"),
    updatedAt: new Date("2024-01-01T16:45:00Z"),
    toolId: "slack",
    isActive: false,
    messageCount: 24,
    messages: [
      {
        id: "msg-50",
        role: "user",
        content: "Create onboarding checklist for new developers",
        timestamp: new Date("2024-01-01T15:30:00Z"),
        toolUsed: "slack",
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
