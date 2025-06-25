"use client"

import type { Message } from "ai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { MessageContent } from "@/components/message-content"
import { toast } from "@/components/ui/use-toast"

interface MessageListProps {
  messages?: Message[]
}

interface MessageFeedback {
  messageId: string
  type: "like" | "dislike" | null
}

export default function MessageList({ messages = [] }: MessageListProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [messageFeedback, setMessageFeedback] = useState<MessageFeedback[]>([])

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

  if (safeMessages.length === 0) {
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
    <div className="space-y-4 px-1">
      {safeMessages.map((message, index) => {
        const isUser = message.role === "user"
        const feedback = getFeedbackForMessage(message.id)
        const messageType = getMessageType(message.content, message.role)
        const isStructured = isStructuredResponse(message.content)

        return (
          <div key={message.id} className="flex gap-3 group">
            {/* Avatar - 항상 왼쪽에 배치 */}
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

            {/* Message Block - 전체 너비 사용 */}
            <div className="flex-1 min-w-0">
              {/* Message Header */}
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

              {/* Message Content Block */}
              <div
                className={cn(
                  "w-full rounded-lg px-4 py-3 shadow-sm border",
                  isUser
                    ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30"
                    : "bg-card border-border",
                )}
              >
                <div className={cn("text-foreground")}>
                  {isUser ? (
                    // User messages - simple text
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  ) : (
                    // AI messages - support structured blocks and legacy content
                    <MessageContent content={message.content} messageId={message.id} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
