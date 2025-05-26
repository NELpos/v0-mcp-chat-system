"use client"

import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import MessageList from "@/components/message-list"
import ChatInput from "@/components/chat-input"
import { mcpTools } from "@/lib/mcp-tools"
import { SettingsDialog } from "@/components/settings-dialog"
import { useSettings } from "@/contexts/settings-context"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ChatInterface() {
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
  const { hasRequiredTokens, toolTokens } = useSettings()
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)

  // Wait for settings to load
  useEffect(() => {
    // Check if settings context has been initialized
    if (toolTokens !== undefined) {
      setIsSettingsLoaded(true)
    }
  }, [toolTokens])

  const {
    messages = [],
    input = "",
    handleInputChange,
    handleSubmit,
    isLoading = false,
  } = useChat({
    api: "/api/chat",
    body: {
      activeTool: activeTool?.id || "default",
    },
  }) || {}

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
    const tool = safeMcpTools.find((t) => t.id === toolId) || safeMcpTools[0]
    setActiveTool(tool)
  }

  const needsToken = activeTool?.requiresAuth && !hasRequiredTokens(activeTool?.id || "")

  return (
    <Card className="w-full h-[calc(100vh-10rem)] flex flex-col">
      <CardContent className="flex flex-col h-full p-4 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Chat with {activeTool?.name || "AI"}</h2>
          <SettingsDialog />
        </div>

        {needsToken && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              API token required for {activeTool?.name || "this tool"}. Please configure it in settings.
            </AlertDescription>
          </Alert>
        )}

        {(!messages || messages.length === 0) && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Welcome to MCP Chat</AlertTitle>
            <AlertDescription>
              Start a conversation by typing a message below. You can select different MCP tools from the dropdown.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-auto mb-4">
          <MessageList messages={messages} />
        </div>
        <ChatInput
          input={input}
          handleInputChange={handleInputChange || (() => {})}
          handleSubmit={handleSubmit || (() => {})}
          isLoading={isLoading}
          activeTool={activeTool}
          tools={safeMcpTools}
          onToolChange={handleToolChange}
          disabled={needsToken}
        />
      </CardContent>
    </Card>
  )
}
