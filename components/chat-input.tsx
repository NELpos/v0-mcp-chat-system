"use client"

import type { FormEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, SendHorizontal, Square } from "lucide-react"
import type { MCPTool } from "@/lib/mcp-tools"

interface ChatInputProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  activeTool: MCPTool
  tools?: MCPTool[]
  onToolChange: (toolId: string) => void
  disabled?: boolean
  onStop?: () => void
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  activeTool,
  tools = [],
  onToolChange,
  disabled = false,
  onStop,
}: ChatInputProps) {
  // Ensure activeTool is valid
  const safeActiveTool = activeTool || {
    id: "default",
    name: "Default",
    description: "Default tool",
    type: "default",
    requiresAuth: false,
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={
            disabled
              ? `Configure ${safeActiveTool.name} API token in settings first`
              : `Message with ${safeActiveTool.name}...`
          }
          className="min-h-24 pr-24 resize-none"
          disabled={isLoading || disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !disabled) {
              e.preventDefault()
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
            }
          }}
        />

        <div className="absolute right-2 bottom-2 flex gap-1">
          {isLoading && onStop && (
            <Button
              size="icon"
              type="button"
              variant="outline"
              onClick={onStop}
              className="h-10 w-10"
              title="Stop generation"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="icon"
            type="submit"
            disabled={isLoading || input.trim() === "" || disabled}
            className="h-10 w-10"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </form>
  )
}
