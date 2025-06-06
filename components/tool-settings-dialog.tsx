"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Wrench, ChevronDown, ChevronRight } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { mcpServers } from "@/lib/mcp-tool-actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function ToolSettingsDialog() {
  const { toolActivation, updateToolActivation, hasRequiredTokens, isLoaded } = useSettings()
  const [open, setOpen] = useState(false)
  const [expandedServers, setExpandedServers] = useState<string[]>([])

  const toggleServerExpansion = (serverId: string) => {
    setExpandedServers((prev) => (prev.includes(serverId) ? prev.filter((id) => id !== serverId) : [...prev, serverId]))
  }

  const getServerTypeColor = (type: string) => {
    switch (type) {
      case "productivity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "communication":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "development":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "search":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "code":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getActiveServersCount = () => {
    if (!isLoaded) return 0
    return Object.values(toolActivation).filter(Boolean).length
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Wrench className="h-5 w-5" />
          <span className="sr-only">Tool Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            MCP Tool Settings
          </DialogTitle>
          <DialogDescription>Configure which MCP servers are active and view their available tools.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between p-3 border rounded-lg mb-4">
          <div>
            <p className="font-medium">Active MCP Servers</p>
            <p className="text-sm text-muted-foreground">Currently enabled MCP servers</p>
          </div>
          <Badge variant="default">
            {isLoaded ? `${getActiveServersCount()}/${mcpServers.length} active` : "Loading..."}
          </Badge>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mcpServers.map((server) => {
              const isActive = toolActivation[server.id] ?? true
              const hasTokens = hasRequiredTokens(server.id)
              const isExpanded = expandedServers.includes(server.id)

              return (
                <div key={server.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <h3 className="font-medium">{server.name}</h3>
                          <p className="text-sm text-muted-foreground">{server.description}</p>
                        </div>
                      </div>
                      <Badge className={getServerTypeColor(server.type)}>{server.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => updateToolActivation(server.id, checked)}
                        disabled={server.requiresAuth && !hasTokens}
                      />
                    </div>
                  </div>

                  {server.requiresAuth && !hasTokens && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                      API token required. Configure in Settings to enable this server.
                    </div>
                  )}

                  <Collapsible open={isExpanded} onOpenChange={() => toggleServerExpansion(server.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                        <span className="text-sm font-medium">Available Tools ({server.tools.length})</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="space-y-3">
                        {server.tools.map((tool, index) => (
                          <div key={tool.id}>
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium">{tool.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {tool.id}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                                {tool.parameters && tool.parameters.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {tool.parameters.map((param) => (
                                      <Badge key={param} variant="secondary" className="text-xs">
                                        {param}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {index < server.tools.length - 1 && <Separator className="mt-3" />}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
