"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, SendHorizontal, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Message } from "ai"
import MessageList from "@/components/message-list"

// Example messages to demonstrate RAG functionality
const exampleMessages: Message[] = [
  {
    id: "example-1",
    role: "user",
    content: "What information do you have about our project documentation?",
  },
  {
    id: "example-2",
    role: "assistant",
    content: `Based on your uploaded documents, I found information about your project documentation:

## Available Documentation

### 📄 Project Documentation (PDF)
- **File**: project-documentation.pdf
- **Size**: 2.4 MB
- **Status**: ✅ Processed and indexed

### 📄 User Manual (DOCX)  
- **File**: user-manual.docx
- **Size**: 1.8 MB
- **Status**: ✅ Processed and indexed

### 🔗 Confluence Pages
- **API Documentation**: Available from your Confluence space
- **Status**: ✅ Content indexed

### 🔗 Jira Project Issues
- **Project Issues**: Linked from your Jira workspace
- **Status**: ✅ Content indexed

You can ask me specific questions about any of these resources, and I'll search through the content to provide accurate answers based on your knowledge base.`,
  },
  {
    id: "example-3",
    role: "user",
    content: "Can you summarize the main features mentioned in the user manual?",
  },
  {
    id: "example-4",
    role: "assistant",
    content: `Based on the user manual in your knowledge base, here are the main features:

## Key Features Summary

### 🚀 Core Functionality
- **User Authentication**: Secure login system with multi-factor authentication
- **Dashboard**: Customizable dashboard with real-time analytics
- **Project Management**: Create, manage, and track project progress
- **Team Collaboration**: Real-time messaging and file sharing

### 📊 Analytics & Reporting
- **Performance Metrics**: Track KPIs and generate automated reports
- **Data Visualization**: Interactive charts and graphs
- **Export Options**: PDF, Excel, and CSV export capabilities

### 🔧 Administration
- **User Management**: Role-based access control
- **System Configuration**: Customizable settings and preferences
- **Integration Support**: API access for third-party integrations

### 📱 Mobile Support
- **Responsive Design**: Works on all device sizes
- **Mobile App**: Native iOS and Android applications
- **Offline Mode**: Limited functionality available offline

*Source: user-manual.docx - Section 2: Feature Overview*`,
  },
]

export function RAGChatInterface() {
  const [displayMessages, setDisplayMessages] = useState<Message[]>(exampleMessages)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/rag-chat",
    onFinish: (message) => {
      // When real messages come in, replace example messages
      if (messages.length === 0) {
        setDisplayMessages([...messages, message])
      }
    },
  })

  // Use real messages if available, otherwise show examples
  const messagesToShow = messages.length > 0 ? messages : displayMessages

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 mb-4">
        {messagesToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Database className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">Start chatting with your knowledge base</h3>
              <p className="text-sm text-muted-foreground mt-1">Ask questions about your uploaded documents and URLs</p>
            </div>
            <Alert className="max-w-md">
              <AlertDescription>Upload some documents or add URLs to get started with RAG chat.</AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4 px-1">
            <MessageList messages={messagesToShow} />
          </div>
        )}
      </ScrollArea>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask questions about your documents..."
            className="min-h-16 pr-12 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
          />
          <Button
            size="icon"
            type="submit"
            disabled={isLoading || input.trim() === ""}
            className="absolute right-2 bottom-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  )
}
