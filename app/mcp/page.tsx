"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ChatProvider } from "@/contexts/chat-context"
import { DocumentProvider } from "@/contexts/document-context"
import { MCPChatInterface } from "@/components/mcp-chat-interface"

export default function MCPPage() {
  return (
    <ChatProvider>
      <DocumentProvider>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">MCP Chat</h1>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            <MCPChatInterface />
          </div>
        </div>
      </DocumentProvider>
    </ChatProvider>
  )
}
