"use client"

import { useState } from "react"
import { ChatProvider } from "@/contexts/chat-context"
import { DocumentProvider } from "@/contexts/document-context"
import { MCPChatInterface } from "@/components/mcp-chat-interface"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"

export default function MCPPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleNewChat = () => {
    // This will be handled by the MCPChatInterface component
    window.dispatchEvent(new CustomEvent("newChat"))
  }

  return (
    <ChatProvider>
      <DocumentProvider>
        <div className="flex h-screen bg-background">
          {/* Chat History Sidebar */}
          <ChatHistorySidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onNewChat={handleNewChat}
          />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center px-4 border-b bg-background">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">MCP Chat</h1>
                <div className="text-sm text-muted-foreground">Model Context Protocol Interface</div>
              </div>
            </header>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <MCPChatInterface />
            </div>
          </div>
        </div>
      </DocumentProvider>
    </ChatProvider>
  )
}
