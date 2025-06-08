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

// Mock data for demonstration (5 sessions with 3 messages each)
const mockSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "Jira Bug Report",
    description: "Creating a bug report for login issues",
    createdAt: new Date("2024-01-20T10:00:00Z"),
    updatedAt: new Date("2024-01-20T10:15:00Z"),
    toolId: "jira",
    isActive: false,
    messageCount: 3,
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "I need to create a bug report for users unable to login after the latest update.",
        timestamp: new Date("2024-01-20T10:00:00Z"),
        toolUsed: "jira",
      },
      {
        id: "msg-2",
        role: "assistant",
        content: `I'll help you create a bug report in Jira. Here's what I've created:

## Bug Report Created: PROJ-123

**Title:** Login failure after latest update  
**Priority:** High  
**Status:** Open  
**Assignee:** Development Team

### Issue Description
Users are experiencing login failures following the latest system update. The authentication service appears to be affected.

### Steps to Reproduce
1. Navigate to login page
2. Enter valid credentials
3. Click "Sign In" button
4. Observe error message

### Expected Result
User should be successfully logged in and redirected to dashboard.

### Actual Result
Login fails with "Authentication Error" message.

The development team has been automatically notified and will investigate the authentication service immediately.`,
        timestamp: new Date("2024-01-20T10:01:00Z"),
        toolUsed: "jira",
      },
      {
        id: "msg-3",
        role: "user",
        content: "Can you also add the affected user count to the issue description?",
        timestamp: new Date("2024-01-20T10:02:00Z"),
        toolUsed: "jira",
      },
    ],
  },
  {
    id: "session-2",
    title: "GitHub Code Review",
    description: "Reviewing pull request for new feature",
    createdAt: new Date("2024-01-19T14:00:00Z"),
    updatedAt: new Date("2024-01-19T14:15:00Z"),
    toolId: "github",
    isActive: false,
    messageCount: 3,
    messages: [
      {
        id: "msg-4",
        role: "user",
        content: "Please review the pull request #456 for the new user dashboard feature.",
        timestamp: new Date("2024-01-19T14:00:00Z"),
        toolUsed: "github",
      },
      {
        id: "msg-5",
        role: "assistant",
        content: `I've completed the review for pull request #456. Here's my assessment:

## Code Review Summary

### ✅ Strengths
- **Clean Architecture**: Well-structured component hierarchy
- **Error Handling**: Proper try-catch blocks implemented
- **Performance**: Efficient state management with hooks

### 🔍 Suggestions for Improvement

#### 1. PropTypes Validation
\`\`\`javascript
// Add PropTypes for better type checking
import PropTypes from 'prop-types';

UserDashboard.propTypes = {
  userId: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired
};
\`\`\`

#### 2. API Call Optimization
\`\`\`javascript
// Use useCallback to prevent unnecessary re-renders
const fetchUserData = useCallback(async () => {
  // API call logic
}, [userId]);
\`\`\`

#### 3. Test Coverage
- Current coverage: 78%
- Target coverage: 85%
- Missing tests for error scenarios

### Recommendation
**Approve after addressing the 3 points above.** The core functionality is solid and ready for merge once these improvements are implemented.`,
        timestamp: new Date("2024-01-19T14:01:00Z"),
        toolUsed: "github",
      },
      {
        id: "msg-6",
        role: "user",
        content: "Should we also check the performance impact of the new dashboard?",
        timestamp: new Date("2024-01-19T14:02:00Z"),
        toolUsed: "github",
      },
    ],
  },
  {
    id: "session-3",
    title: "Slack Team Update",
    description: "Sending project status update to team",
    createdAt: new Date("2024-01-18T09:00:00Z"),
    updatedAt: new Date("2024-01-18T09:15:00Z"),
    toolId: "slack",
    isActive: false,
    messageCount: 3,
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "Send a project status update to the development team channel about our sprint progress.",
        timestamp: new Date("2024-01-18T09:00:00Z"),
        toolUsed: "slack",
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "I've sent the sprint progress update to the #development channel. The message includes our current completion rate of 85%, highlights of the 12 completed tasks, and mentions the 3 remaining items for this sprint. The team has been notified about the upcoming code freeze on Friday and the demo scheduled for next Monday.",
        timestamp: new Date("2024-01-18T09:01:00Z"),
        toolUsed: "slack",
      },
      {
        id: "msg-9",
        role: "user",
        content: "Can you also mention the new testing procedures in the update?",
        timestamp: new Date("2024-01-18T09:02:00Z"),
        toolUsed: "slack",
      },
    ],
  },
  {
    id: "session-4",
    title: "Web Search Research",
    description: "Researching React best practices",
    createdAt: new Date("2024-01-17T16:20:00Z"),
    updatedAt: new Date("2024-01-17T16:35:00Z"),
    toolId: "web-search",
    isActive: false,
    messageCount: 3,
    messages: [
      {
        id: "msg-10",
        role: "user",
        content: "Find the latest best practices for React performance optimization in 2024.",
        timestamp: new Date("2024-01-17T16:20:00Z"),
        toolUsed: "web-search",
      },
      {
        id: "msg-11",
        role: "assistant",
        content:
          "I found the latest React performance optimization best practices for 2024. Key recommendations include using React 18's concurrent features like Suspense and startTransition, implementing proper memoization with useMemo and useCallback, code splitting with lazy loading, optimizing bundle size with tree shaking, and using the new React DevTools Profiler for performance monitoring. Virtual scrolling for large lists and image optimization techniques are also highly recommended.",
        timestamp: new Date("2024-01-17T16:21:00Z"),
        toolUsed: "web-search",
      },
      {
        id: "msg-12",
        role: "user",
        content: "What about server-side rendering improvements in React 18?",
        timestamp: new Date("2024-01-17T16:22:00Z"),
        toolUsed: "web-search",
      },
    ],
  },
  {
    id: "session-5",
    title: "Data Analysis",
    description: "Analyzing sales performance data",
    createdAt: new Date("2024-01-16T11:30:00Z"),
    updatedAt: new Date("2024-01-16T11:45:00Z"),
    toolId: "code-interpreter",
    isActive: false,
    messageCount: 3,
    messages: [
      {
        id: "msg-13",
        role: "user",
        content: "Analyze our Q4 sales data and provide insights on performance trends.",
        timestamp: new Date("2024-01-16T11:30:00Z"),
        toolUsed: "code-interpreter",
      },
      {
        id: "msg-14",
        role: "assistant",
        content:
          "I've analyzed your Q4 sales data and found several key insights. Total revenue reached $2.4M with a 15% growth compared to Q3. The top performing product category was Enterprise Software with 40% of total sales. Regional analysis shows North America leading with 55% of sales, followed by Europe at 30%. Customer acquisition cost decreased by 8% while average order value increased by 12%. The data suggests strong momentum heading into Q1 2024.",
        timestamp: new Date("2024-01-16T11:31:00Z"),
        toolUsed: "code-interpreter",
      },
      {
        id: "msg-15",
        role: "user",
        content: "Can you create a forecast for Q1 2025 based on this trend?",
        timestamp: new Date("2024-01-16T11:32:00Z"),
        toolUsed: "code-interpreter",
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
