"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import MessageList from "@/components/message-list"
import ChatInput from "@/components/chat-input"
import { mcpTools } from "@/lib/mcp-tools"
import { SettingsDialog } from "@/components/settings-dialog"
import { useSettings } from "@/contexts/settings-context"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ChatInterface() {
  const [activeTool, setActiveTool] = useState(
    mcpTools[0] || {
      id: "default",
      name: "Default",
      description: "Default tool",
      type: "default",
      requiresAuth: false,
    },
  )
  const { hasRequiredTokens } = useSettings()

  const {
    messages = [],
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      activeTool: activeTool.id,
    },
  })

  const handleToolChange = (toolId: string) => {
    const tool = mcpTools.find((t) => t.id === toolId) || mcpTools[0]
    if (tool) {
      setActiveTool(tool)
    }
  }

  const needsToken = activeTool.requiresAuth && !hasRequiredTokens(activeTool.id)

  return (
    <Card className="w-full h-[calc(100vh-10rem)] flex flex-col">
      <CardContent className="flex flex-col h-full p-4 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Chat with {activeTool.name}</h2>
          <SettingsDialog />
        </div>

        {needsToken && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              API token required for {activeTool.name}. Please configure it in settings.
            </AlertDescription>
          </Alert>
        )}

        {(!messages || messages.length === 0) && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Markdown Support</AlertTitle>
            <AlertDescription>
              AI responses support Markdown formatting including headings, lists, code blocks, tables, and more.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-auto mb-4">
          <MessageList messages={messages} />
        </div>
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          activeTool={activeTool}
          tools={mcpTools}
          onToolChange={handleToolChange}
          disabled={needsToken}
        />
      </CardContent>
    </Card>
  )
}
