"use client"

import { memo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Brain, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkingIndicatorProps {
  message?: string
  variant?: "default" | "processing" | "analyzing" | "generating"
  showAvatar?: boolean
  className?: string
}

const ThinkingIndicator = memo(
  ({ message = "AI is thinking...", variant = "default", showAvatar = true, className }: ThinkingIndicatorProps) => {
    const getVariantConfig = () => {
      switch (variant) {
        case "processing":
          return {
            icon: Zap,
            message: "Processing your request...",
            color: "text-blue-500",
            bgColor: "bg-blue-500",
            badgeText: "Processing",
            badgeVariant: "default" as const,
          }
        case "analyzing":
          return {
            icon: Brain,
            message: "Analyzing data...",
            color: "text-purple-500",
            bgColor: "bg-purple-500",
            badgeText: "Analyzing",
            badgeVariant: "secondary" as const,
          }
        case "generating":
          return {
            icon: Sparkles,
            message: "Generating response...",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500",
            badgeText: "Generating",
            badgeVariant: "default" as const,
          }
        default:
          return {
            icon: Bot,
            message: message,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500",
            badgeText: "Thinking",
            badgeVariant: "secondary" as const,
          }
      }
    }

    const config = getVariantConfig()
    const IconComponent = config.icon

    return (
      <div className={cn("flex gap-3 group animate-in fade-in-0 duration-300", className)}>
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0 mt-1">
            <Avatar className={cn("w-8 h-8", config.bgColor, "text-white")}>
              <AvatarFallback className="bg-transparent">
                <IconComponent size={16} />
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Thinking Block */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <span className="font-medium">AI Assistant</span>
            <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <Badge variant={config.badgeVariant} className="text-xs py-0 px-1">
              {config.badgeText}
            </Badge>
          </div>

          {/* Thinking Content */}
          <div className="w-full rounded-lg px-4 py-3 shadow-sm border bg-card border-border text-sm">
            <div className="flex items-center gap-3">
              {/* Animated thinking dots */}
              <div className="flex space-x-1">
                <div className={cn("w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]", config.color)}>
                  <div className={cn("w-full h-full rounded-full", config.bgColor, "animate-pulse")}></div>
                </div>
                <div className={cn("w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]", config.color)}>
                  <div className={cn("w-full h-full rounded-full", config.bgColor, "animate-pulse")}></div>
                </div>
                <div className={cn("w-2 h-2 rounded-full animate-bounce", config.color)}>
                  <div className={cn("w-full h-full rounded-full", config.bgColor, "animate-pulse")}></div>
                </div>
              </div>

              {/* Thinking message */}
              <span className={cn("text-foreground font-medium", config.color)}>{config.message}</span>

              {/* Animated brain icon */}
              <div className="ml-auto">
                <IconComponent className={cn("h-4 w-4 animate-pulse", config.color)} />
              </div>
            </div>

            {/* Progress bar animation */}
            <div className="mt-3 w-full bg-muted rounded-full h-1 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full animate-pulse",
                  config.bgColor,
                  "animate-[shimmer_2s_ease-in-out_infinite]",
                )}
                style={{
                  background: `linear-gradient(90deg, transparent, currentColor, transparent)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

ThinkingIndicator.displayName = "ThinkingIndicator"

export { ThinkingIndicator }
