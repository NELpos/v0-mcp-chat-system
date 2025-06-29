"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "@/contexts/chat-context"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  isStreaming?: boolean
  onStopStreaming?: () => void
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message... (Shift + → for message history)",
  isStreaming = false,
  onStopStreaming,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [originalMessage, setOriginalMessage] = useState("")
  const [isInHistoryMode, setIsInHistoryMode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentSession } = useChat()

  // Get user messages from current session for history
  const userMessages = currentSession?.messages.filter((msg) => msg.role === "user") || []

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (message.trim() && !disabled && !isStreaming) {
        onSendMessage(message.trim())
        setMessage("")
        setHistoryIndex(-1)
        setIsInHistoryMode(false)
        setOriginalMessage("")
      }
    },
    [message, disabled, isStreaming, onSendMessage],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle message history navigation
      if (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault()

        if (userMessages.length === 0) return

        if (e.key === "ArrowRight") {
          // Move to previous message (older)
          if (!isInHistoryMode) {
            // First time entering history mode
            setOriginalMessage(message)
            setIsInHistoryMode(true)
            setHistoryIndex(0)
            setMessage(userMessages[userMessages.length - 1].content)
          } else if (historyIndex < userMessages.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setMessage(userMessages[userMessages.length - 1 - newIndex].content)
          }
        } else if (e.key === "ArrowLeft" && isInHistoryMode) {
          // Move to next message (newer) or back to original
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setMessage(userMessages[userMessages.length - 1 - newIndex].content)
          } else {
            // Return to original message
            setMessage(originalMessage)
            setHistoryIndex(-1)
            setIsInHistoryMode(false)
            setOriginalMessage("")
          }
        }
        return
      }

      // Handle Enter key
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
        return
      }

      // Exit history mode on any other key press
      if (isInHistoryMode && e.key !== "Shift") {
        setIsInHistoryMode(false)
        setHistoryIndex(-1)
        setOriginalMessage("")
      }
    },
    [message, userMessages, historyIndex, isInHistoryMode, originalMessage, handleSubmit],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value)
      // Exit history mode when user starts typing
      if (isInHistoryMode) {
        setIsInHistoryMode(false)
        setHistoryIndex(-1)
        setOriginalMessage("")
      }
    },
    [isInHistoryMode],
  )

  const handleFileAttach = useCallback(() => {
    // File attachment logic would go here
    console.log("File attachment clicked")
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className="relative">
      {/* History indicator */}
      {isInHistoryMode && (
        <div className="absolute -top-8 left-0 text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
          History: {historyIndex + 1}/{userMessages.length}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t bg-background">
        {/* File attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleFileAttach}
          disabled={disabled || isStreaming}
          className="flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[44px] max-h-32 resize-none pr-12",
              "focus:ring-2 focus:ring-primary focus:border-transparent",
            )}
            rows={1}
          />
        </div>

        {/* Send/Stop button */}
        {isStreaming ? (
          <Button type="button" variant="destructive" size="sm" onClick={onStopStreaming} className="flex-shrink-0">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={!message.trim() || disabled} className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
