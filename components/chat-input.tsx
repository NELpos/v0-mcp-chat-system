"use client"

import type { FormEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Check, ChevronDown, Loader2, SendHorizontal, Wrench, Square } from "lucide-react"
import type { MCPTool } from "@/lib/mcp-tools"
import { cn } from "@/lib/utils"

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
  // Ensure tools is an array
  const safeTools = Array.isArray(tools) ? tools : []

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
      <div className="flex items-center gap-2 mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 text-xs">
              <Wrench size={14} />
              <span>{safeActiveTool.name}</span>
              <ChevronDown size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" side="top">
            <Command>
              <CommandGroup heading="Available MCP Tools">
                {safeTools.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    onSelect={() => onToolChange(tool.id)}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className={cn("mr-2", safeActiveTool.id === tool.id ? "opacity-100" : "opacity-0")}>
                      <Check size={16} />
                    </div>
                    <span>{tool.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="text-xs text-muted-foreground">
          Using <span className="font-medium">{safeActiveTool.name}</span> - {safeActiveTool.description}
        </div>
      </div>

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
