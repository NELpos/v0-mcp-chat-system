"use client"

import type React from "react"

import { useChat as useAIChat } from "ai/react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import MessageList from "@/components/message-list"
import ChatInput from "@/components/chat-input"
import { mcpTools } from "@/lib/mcp-tools"
import { ToolSettingsDialog } from "@/components/tool-settings-dialog"
import { useSettings } from "@/contexts/settings-context"
import { useChat } from "@/contexts/chat-context"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ChatMessage } from "@/types/chat"

export function MCPChatInterface() {
  // Ensure mcpTools is an array and has at least one item
  const safeMcpTools =
    Array.isArray(mcpTools) && mcpTools.length > 0
      ? mcpTools
      : [
          {
            id: "default",
            name: "Default",
            description: "Default tool",
            type: "default",
            requiresAuth: false,
          },
        ]

  const [activeTool, setActiveTool] = useState(safeMcpTools[0])
  const { hasRequiredTokens, toolTokens, toolActivation } = useSettings()
  const { currentSession, createNewSession, addMessageToSession } = useChat()
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)

  // Wait for settings to load
  useEffect(() => {
    // Check if settings context has been initialized
    if (toolTokens !== undefined) {
      setIsSettingsLoaded(true)
    }
  }, [toolTokens])

  // Filter tools based on activation status
  const activeTools = safeMcpTools.filter((tool) => toolActivation[tool.id] !== false)

  const {
    messages = [],
    input = "",
    handleInputChange,
    handleSubmit,
    isLoading = false,
    setMessages,
    stop,
  } = useAIChat({
    api: "/api/chat",
    body: {
      activeTool: activeTool?.id || "default",
      activeTools: activeTools.map((tool) => tool.id),
    },
    onFinish: (message) => {
      // Add message to current session
      if (currentSession) {
        const chatMessage: ChatMessage = {
          id: message.id,
          role: message.role as "user" | "assistant",
          content: message.content,
          timestamp: new Date(),
          toolUsed: activeTool?.id,
        }
        addMessageToSession(currentSession.id, chatMessage)
      }
    },
  }) || {}

  // Load messages from current session
  useEffect(() => {
    if (currentSession) {
      const aiMessages = currentSession.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }))
      setMessages(aiMessages)

      // Update active tool based on session
      const sessionTool = activeTools.find((t) => t.id === currentSession.toolId)
      if (sessionTool) {
        setActiveTool(sessionTool)
      } else if (activeTools.length > 0) {
        // If session tool is not active, switch to first active tool
        setActiveTool(activeTools[0])
      }
    } else {
      setMessages([])
    }
  }, [currentSession, setMessages, activeTools])

  // Show loading state while settings are loading
  if (!isSettingsLoaded) {
    return (
      <Card className="w-full h-[calc(100vh-10rem)] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat interface...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleToolChange = (toolId: string) => {
    const tool = activeTools.find((t) => t.id === toolId) || activeTools[0]
    if (tool) {
      setActiveTool(tool)

      // Create new session when tool changes
      if (!currentSession || currentSession.toolId !== toolId) {
        createNewSession(toolId)
      }
    }
  }

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Create new session if none exists
    if (!currentSession) {
      const toolId = activeTool?.id || (activeTools.length > 0 ? activeTools[0].id : safeMcpTools[0].id)
      const newSession = createNewSession(toolId)

      // Add user message to session
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: input,
        timestamp: new Date(),
        toolUsed: activeTool?.id,
      }
      addMessageToSession(newSession.id, userMessage)
    } else {
      // Add user message to existing session
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: input,
        timestamp: new Date(),
        toolUsed: activeTool?.id,
      }
      addMessageToSession(currentSession.id, userMessage)
    }

    handleSubmit(e)
  }

  const handleStop = () => {
    if (stop) {
      stop()
    }
  }

  const needsToken = activeTool?.requiresAuth && !hasRequiredTokens(activeTool?.id || "")

  return (
    <Card className="w-full h-[calc(100vh-10rem)] flex flex-col">
      <CardContent className="flex flex-col h-full p-4 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {currentSession ? currentSession.title : `Chat with ${activeTool?.name || "AI"}`}
          </h2>
          <ToolSettingsDialog />
        </div>

        {activeTools.length === 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tools are currently active. Please enable at least one tool in Tool Settings.
            </AlertDescription>
          </Alert>
        )}

        {needsToken && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              API token required for {activeTool?.name || "this tool"}. Please configure it in settings.
            </AlertDescription>
          </Alert>
        )}

        {(!messages || messages.length === 0) && !currentSession && activeTools.length > 0 && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Welcome to MCP Chat</AlertTitle>
            <AlertDescription>
              Start a conversation by typing a message below. You have {activeTools.length} active tool
              {activeTools.length !== 1 ? "s" : ""} available.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-auto mb-4">
          <MessageList messages={messages} />
        </div>

        <ChatInput
          input={input}
          handleInputChange={handleInputChange || (() => {})}
          handleSubmit={handleChatSubmit}
          isLoading={isLoading}
          activeTool={activeTool}
          tools={activeTools}
          onToolChange={handleToolChange}
          disabled={needsToken || activeTools.length === 0}
          onStop={handleStop}
        />
      </CardContent>
    </Card>
  )
}
