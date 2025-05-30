"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  MoreHorizontal,
  MessageSquare,
  Clock,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { mcpTools } from "@/lib/mcp-tools"
import type { ChatSession } from "@/types/chat"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ChatHistorySidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNewChat: () => void
}

export function ChatHistorySidebar({ isCollapsed, onToggleCollapse, onNewChat }: ChatHistorySidebarProps) {
  const { sessions, currentSession, loadSession, deleteSession, updateSessionTitle } = useChat()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getToolIcon = (toolId: string) => {
    const tool = mcpTools.find((t) => t.id === toolId)
    return tool?.name.charAt(0) || "?"
  }

  const getToolColor = (toolId: string) => {
    const colors: Record<string, string> = {
      jira: "bg-blue-500",
      atlassian: "bg-indigo-500",
      slack: "bg-green-500",
      github: "bg-gray-800",
      "web-search": "bg-orange-500",
      "code-interpreter": "bg-purple-500",
    }
    return colors[toolId] || "bg-gray-500"
  }

  const handleEditTitle = (session: ChatSession) => {
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  const handleSaveTitle = () => {
    if (editingSessionId && editTitle.trim()) {
      updateSessionTitle(editingSessionId, editTitle.trim())
      setEditingSessionId(null)
      setEditTitle("")
      toast({
        title: "Chat renamed",
        description: "The chat session has been renamed successfully.",
      })
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
    setDeleteSessionId(null)
    toast({
      title: "Chat deleted",
      description: "The chat session has been deleted successfully.",
    })
  }

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col">
        <div className="p-2">
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="w-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 p-2">
          <Button variant="ghost" size="sm" onClick={onNewChat} className="w-full">
            <Plus className="h-4 w-4" />
          </Button>
          {filteredSessions.slice(0, 5).map((session) => (
            <Button
              key={session.id}
              variant={currentSession?.id === session.id ? "default" : "ghost"}
              size="sm"
              onClick={() => loadSession(session.id)}
              className="w-full"
              title={session.title}
            >
              <div
                className={`w-3 h-3 rounded-full ${getToolColor(session.toolId)} text-white text-xs flex items-center justify-center`}
              >
                {getToolIcon(session.toolId)}
              </div>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-80 h-full border-r rounded-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Chat History
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 h-[calc(100%-8rem)]">
        <ScrollArea className="h-full">
          <div className="space-y-1 p-3">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat sessions found</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={onNewChat}>
                  Start New Chat
                </Button>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-colors",
                    currentSession?.id === session.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                  onClick={() => loadSession(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-4 h-4 rounded-full ${getToolColor(session.toolId)} text-white text-xs flex items-center justify-center`}
                        >
                          {getToolIcon(session.toolId)}
                        </div>
                        {editingSessionId === session.id ? (
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveTitle()
                              if (e.key === "Escape") {
                                setEditingSessionId(null)
                                setEditTitle("")
                              }
                            }}
                            className="h-6 text-sm font-medium"
                            autoFocus
                          />
                        ) : (
                          <h3 className="font-medium text-sm truncate">{session.title}</h3>
                        )}
                      </div>

                      {session.description && (
                        <p className="text-xs text-muted-foreground truncate mb-2">{session.description}</p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{session.updatedAt.toLocaleDateString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          {session.messageCount} messages
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTitle(session)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteSessionId(session.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSessionId} onOpenChange={() => setDeleteSessionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone and all messages will be
              permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteSessionId) {
                  handleDeleteSession(deleteSessionId)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
