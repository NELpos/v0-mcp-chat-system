"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, AlertTriangle, Maximize2 } from "lucide-react"
import { useState } from "react"
import { MessageContent } from "@/components/message-content"
import { ThinkingIndicator } from "@/components/thinking-indicator"
import { toast } from "@/components/ui/use-toast"
import { memo } from "react"
import { useDocument } from "@/contexts/document-context"
import type { DocumentContent } from "@/contexts/document-context"

interface MessageListProps {
  messages?: Message[]
  isStreaming?: boolean
  streamingVariant?: "default" | "processing" | "analyzing" | "generating"
}

interface MessageFeedback {
  messageId: string
  type: "like" | "dislike" | null
}

const MessageList = memo(
  ({ messages = [], isStreaming = false, streamingVariant = "generating" }: MessageListProps) => {
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
    const [messageFeedback, setMessageFeedback] = useState<MessageFeedback[]>([])
    const { openDocument } = useDocument()

    // Ensure messages is an array
    const safeMessages = Array.isArray(messages) ? messages : []

    const copyToClipboard = async (content: string, messageId: string) => {
      try {
        await navigator.clipboard.writeText(content)
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), 2000)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    }

    const handleFeedback = (messageId: string, type: "like" | "dislike") => {
      setMessageFeedback((prev) => {
        const existing = prev.find((f) => f.messageId === messageId)
        const newFeedback = [...prev.filter((f) => f.messageId !== messageId)]

        // If clicking the same type, remove feedback (toggle off)
        if (existing?.type === type) {
          toast({
            title: "Feedback removed",
            description: "Your feedback has been removed.",
          })
          return newFeedback
        }

        // Add new feedback
        newFeedback.push({ messageId, type })

        toast({
          title: type === "like" ? "👍 Feedback received" : "👎 Feedback received",
          description: `Thank you for your ${type === "like" ? "positive" : "negative"} feedback!`,
        })

        return newFeedback
      })
    }

    const getFeedbackForMessage = (messageId: string) => {
      return messageFeedback.find((f) => f.messageId === messageId)?.type || null
    }

    const getMessageType = (content: string, role: string) => {
      if (role === "user") {
        return "User Message"
      }

      try {
        const parsed = JSON.parse(content)
        if (typeof parsed === "object" && parsed !== null) {
          return "Structured Response"
        }
      } catch (e) {
        // Not a JSON object, so it's a legacy response
      }

      return "AI Response"
    }

    const isStructuredResponse = (content: string) => {
      try {
        const parsed = JSON.parse(content)
        if (typeof parsed === "object" && parsed !== null) {
          return true
        }
      } catch (e) {
        // Not a JSON object, so it's a legacy response
      }

      return false
    }

    // Check if message content is suitable for document view
    const isExpandableContent = (content: string) => {
      // Check for code blocks
      const codeBlockRegex = /```[\s\S]*?```/g
      const codeBlocks = content.match(codeBlockRegex)

      // Check for JSON content
      const isJson = isStructuredResponse(content)

      // Check for long content (more than 500 characters)
      const isLongContent = content.length > 500

      // Check for multiple lines (more than 10 lines)
      const lineCount = content.split("\n").length
      const hasMultipleLines = lineCount > 10

      return !!(codeBlocks && codeBlocks.length > 0) || isJson || isLongContent || hasMultipleLines
    }

    const extractDocumentContent = (content: string, messageId: string): DocumentContent[] => {
      const documents: DocumentContent[] = []

      // Extract code blocks
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
      let match
      let codeBlockIndex = 0

      while ((match = codeBlockRegex.exec(content)) !== null) {
        const language = match[1] || "text"
        const code = match[2].trim()

        documents.push({
          id: `${messageId}-code-${codeBlockIndex}`,
          title: `Code Block ${codeBlockIndex + 1} (${language})`,
          content: code,
          type: language === "json" ? "json" : "code",
          language: language,
          timestamp: new Date(),
          messageId: messageId,
        })
        codeBlockIndex++
      }

      // If it's a JSON response, add as JSON document
      if (isStructuredResponse(content) && documents.length === 0) {
        documents.push({
          id: `${messageId}-json`,
          title: "JSON Response",
          content: content,
          type: "json",
          timestamp: new Date(),
          messageId: messageId,
        })
      }

      // If it's long content without code blocks, add as markdown
      if (documents.length === 0 && content.length > 500) {
        documents.push({
          id: `${messageId}-content`,
          title: "Message Content",
          content: content,
          type: "markdown",
          timestamp: new Date(),
          messageId: messageId,
        })
      }

      return documents
    }

    const handleExpandToDocument = (content: string, messageId: string) => {
      const documents = extractDocumentContent(content, messageId)

      if (documents.length > 0) {
        // Open the first document (or could open all)
        openDocument(documents[0])

        // If there are multiple documents, open them all
        documents.slice(1).forEach((doc) => {
          setTimeout(() => openDocument(doc), 100)
        })
      }
    }

    if (safeMessages.length === 0 && !isStreaming) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start a conversation by typing a message below.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        {safeMessages.map((message, index) => {
          const isUser = message.role === "user"
          const feedback = getFeedbackForMessage(message.id)
          const messageType = getMessageType(message.content, message.role)
          const isStructured = isStructuredResponse(message.content)
          const canExpand = !isUser && isExpandableContent(message.content)

          return (
            <div key={message.id} className="flex gap-3 group">
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                <Avatar
                  className={cn(
                    "w-8 h-8",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : isStructured
                        ? "bg-purple-500 text-white"
                        : "bg-emerald-500 text-white",
                  )}
                >
                  <AvatarFallback className="bg-transparent">
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{isUser ? "You" : "AI Assistant"}</span>
                    <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {!isUser && (
                      <>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs py-0 px-1",
                            isStructured && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
                          )}
                        >
                          {messageType}
                        </Badge>
                        {isStructured && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-purple-500" />
                            <span className="text-purple-600 dark:text-purple-400 text-xs">MCP Blocks</span>
                          </div>
                        )}
                      </>
                    )}
                    {/* Feedback indicator */}
                    {!isUser && feedback && (
                      <div className="flex items-center gap-1">
                        {feedback === "like" ? (
                          <ThumbsUp className="h-3 w-3 text-green-600 fill-current" />
                        ) : (
                          <ThumbsDown className="h-3 w-3 text-red-600 fill-current" />
                        )}
                        <span className={cn("text-xs", feedback === "like" ? "text-green-600" : "text-red-600")}>
                          {feedback === "like" ? "Liked" : "Disliked"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - AI 메시지의 경우 오른쪽 상단에 배치 */}
                  {!isUser && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Expand to Document Button */}
                      {canExpand && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => handleExpandToDocument(message.content, message.id)}
                          title="Expand to document view"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Copy Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>

                      {/* Like Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
                          feedback === "like" && "text-green-600 hover:text-green-700",
                        )}
                        onClick={() => handleFeedback(message.id, "like")}
                        title="Like"
                      >
                        <ThumbsUp className={cn("h-3 w-3", feedback === "like" && "fill-current")} />
                      </Button>

                      {/* Dislike Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
                          feedback === "dislike" && "text-red-600 hover:text-red-700",
                        )}
                        onClick={() => handleFeedback(message.id, "dislike")}
                        title="Dislike"
                      >
                        <ThumbsDown className={cn("h-3 w-3", feedback === "dislike" && "fill-current")} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <MessageContent content={message.content} role={message.role} />
              </div>
            </div>
          )
        })}

        {/* Thinking Indicator */}
        {isStreaming && <ThinkingIndicator variant={streamingVariant} />}
      </div>
    )
  },
)

MessageList.displayName = "MessageList"

export default MessageList
