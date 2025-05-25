"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResourceManager } from "@/components/resource-manager"
import { RAGChatInterface } from "@/components/rag-chat-interface"
import { Database, MessageSquare, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RAGInterface() {
  const [isKnowledgeBaseCollapsed, setIsKnowledgeBaseCollapsed] = useState(false)

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
      {/* Knowledge Base Panel - Collapsible */}
      <Card className={cn("transition-all duration-300", isKnowledgeBaseCollapsed ? "h-auto" : "h-80")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsKnowledgeBaseCollapsed(!isKnowledgeBaseCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isKnowledgeBaseCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {!isKnowledgeBaseCollapsed && (
          <CardContent className="h-[calc(100%-4rem)] overflow-auto">
            <ResourceManager />
          </CardContent>
        )}
      </Card>

      {/* Chat Interface - Expandable */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            RAG Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)]">
          <RAGChatInterface />
        </CardContent>
      </Card>
    </div>
  )
}
