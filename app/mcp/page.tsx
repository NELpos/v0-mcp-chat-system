"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { MCPChatInterface } from "@/components/mcp-chat-interface"
import { ChatProvider } from "@/contexts/chat-context"

export default function MCPPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleNewChat = () => {
    // This will be handled by the MCPChatInterface component
  }

  return (
    <ChatProvider>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/mcp">MCP Chat</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Model Context Protocol</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1">
          <ChatHistorySidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onNewChat={handleNewChat}
          />

          <main className="flex-1 container max-w-6xl mx-auto p-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">MCP Chat</h1>
              <p className="text-muted-foreground">
                Chat with AI using Model Context Protocol tools like Jira, Slack, GitHub, and Atlassian.
              </p>
            </div>
            <MCPChatInterface />
          </main>
        </div>
      </div>
    </ChatProvider>
  )
}
