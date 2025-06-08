"use client"

import type { Message } from "ai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react"
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
    <div className="space-y-6 px-1">
      {safeMessages.map((message, index) => {
        const isUser = message.role === "user"
        const isLastMessage = index === safeMessages.length - 1
        const feedback = getFeedbackForMessage(message.id)

        return (
          <div key={message.id} className={cn("flex gap-4 group", isUser ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                className={cn("w-8 h-8", isUser ? "bg-primary text-primary-foreground" : "bg-emerald-500 text-white")}
              >
                <AvatarFallback className="bg-transparent">
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Message Content */}
            <div
              className={cn(
                "flex-1 min-w-0 space-y-2",
                isUser ? "flex flex-col items-end" : "flex flex-col items-start",
              )}
            >
              {/* Message Bubble */}
              <div
                className={cn(
                  "relative max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md",
                )}
              >
                {/* Message Content */}
                <div className={cn(isUser ? "text-primary-foreground" : "text-foreground")}>
                  {isUser ? (
                    // User messages - simple text
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  ) : (
                    // AI messages - support markdown, JSON, code blocks
                    <MessageContent content={message.content} messageId={message.id} />
                  )}
                </div>
              </div>

              {/* Message Metadata */}
              <div className={cn("flex items-center justify-between text-xs text-muted-foreground px-2")}>
                <div className="flex items-center gap-2">
                  <span>{isUser ? "You" : "AI Assistant"}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs py-0 px-1">
                        AI Response
                      </Badge>
                    </>
                  )}
                  {/* Feedback indicator */}
                  {!isUser && feedback && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {feedback === "like" ? (
                          <ThumbsUp className="h-3 w-3 text-green-600 fill-current" />
                        ) : (
                          <ThumbsDown className="h-3 w-3 text-red-600 fill-current" />
                        )}
                        <span className={feedback === "like" ? "text-green-600" : "text-red-600"}>
                          {feedback === "like" ? "Liked" : "Disliked"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {!isUser && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
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
                        "h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
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
                        "h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
