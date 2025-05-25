import type { Message } from "ai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface MessageListProps {
  messages?: Message[]
}

export default function MessageList({ messages = [] }: MessageListProps) {
  // Ensure messages is an array
  const safeMessages = Array.isArray(messages) ? messages : []

  if (safeMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation by typing a message below.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-1">
      {safeMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-3 rounded-lg p-3",
            message.role === "user" ? "bg-muted/50" : "bg-background",
          )}
        >
          <Avatar className={message.role === "user" ? "bg-primary" : "bg-green-500"}>
            <AvatarFallback>{message.role === "user" ? <User size={18} /> : <Bot size={18} />}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="prose dark:prose-invert">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
