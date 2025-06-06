"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  MoreHorizontal,
  Boxes,
  PenToolIcon as Tool,
  Edit,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
  Server,
  CheckSquare,
  Square,
} from "lucide-react"
import { mcpServers } from "@/lib/mcp-servers"
import type { ToolGroup, SelectedTool } from "@/types/tool-group"
import { toast } from "@/components/ui/use-toast"

// Mock data for tool groups
const mockToolGroups: ToolGroup[] = [
  {
    id: "group-1",
    name: "Development Workflow",
    description: "Tools for software development and code management",
    selectedTools: [
      { serverId: "github", toolId: "create-repository", serverName: "GitHub", toolName: "Create Repository" },
      { serverId: "github", toolId: "create-issue", serverName: "GitHub", toolName: "Create Issue" },
      {
        serverId: "code-interpreter",
        toolId: "execute-python",
        serverName: "Code Interpreter",
        toolName: "Execute Python",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    isActive: true,
  },
  {
    id: "group-2",
    name: "Project Management",
    description: "Tools for project management and team collaboration",
    selectedTools: [
      { serverId: "jira", toolId: "create-issue", serverName: "Jira", toolName: "Create Issue" },
      { serverId: "jira", toolId: "search-issues", serverName: "Jira", toolName: "Search Issues" },
      { serverId: "slack", toolId: "send-message", serverName: "Slack", toolName: "Send Message" },
      { serverId: "atlassian", toolId: "create-page", serverName: "Atlassian", toolName: "Create Page" },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    isActive: true,
  },
]

export function ToolGroupManager() {
  const [toolGroups, setToolGroups] = useState<ToolGroup[]>(mockToolGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<ToolGroup | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null)
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set())

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedTools: new Set<string>(),
  })

  const filteredGroups = toolGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateGroup = () => {
    setFormData({
      name: "",
      description: "",
      selectedTools: new Set(),
    })
    setExpandedServers(new Set())
    setIsCreateDialogOpen(true)
  }

  const handleEditGroup = (group: ToolGroup) => {
    setSelectedGroup(group)
    const selectedToolIds = new Set(group.selectedTools.map((t) => `${t.serverId}:${t.toolId}`))
    setFormData({
      name: group.name,
      description: group.description,
      selectedTools: selectedToolIds,
    })
    // Expand servers that have selected tools
    const serversWithSelectedTools = new Set(group.selectedTools.map((t) => t.serverId))
    setExpandedServers(serversWithSelectedTools)
    setIsEditDialogOpen(true)
  }

  const handleSaveGroup = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      })
      return
    }

    if (formData.selectedTools.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one tool",
        variant: "destructive",
      })
      return
    }

    // Convert selected tools to SelectedTool objects
    const selectedToolObjects: SelectedTool[] = Array.from(formData.selectedTools).map((toolKey) => {
      const [serverId, toolId] = toolKey.split(":")
      const server = mcpServers.find((s) => s.id === serverId)!
      const tool = server.tools.find((t) => t.id === toolId)!
      return {
        serverId,
        toolId,
        serverName: server.name,
        toolName: tool.name,
      }
    })

    if (isCreateDialogOpen) {
      // Create new group
      const newGroup: ToolGroup = {
        id: `group-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        selectedTools: selectedToolObjects,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      setToolGroups((prev) => [newGroup, ...prev])
      setIsCreateDialogOpen(false)

      toast({
        title: "Success",
        description: "Tool group created successfully",
      })
    } else if (isEditDialogOpen && selectedGroup) {
      // Update existing group
      setToolGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroup.id
            ? {
                ...group,
                name: formData.name,
                description: formData.description,
                selectedTools: selectedToolObjects,
                updatedAt: new Date(),
              }
            : group,
        ),
      )
      setIsEditDialogOpen(false)

      toast({
        title: "Success",
        description: "Tool group updated successfully",
      })
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    setToolGroups((prev) => prev.filter((group) => group.id !== groupId))
    setDeleteGroupId(null)

    toast({
      title: "Success",
      description: "Tool group deleted successfully",
    })
  }

  const handleToggleGroupStatus = (groupId: string) => {
    setToolGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isActive: !group.isActive, updatedAt: new Date() } : group,
      ),
    )

    toast({
      title: "Success",
      description: "Tool group status updated",
    })
  }

  const handleToolSelection = (serverId: string, toolId: string, checked: boolean) => {
    const toolKey = `${serverId}:${toolId}`
    setFormData((prev) => {
      const newSelectedTools = new Set(prev.selectedTools)
      if (checked) {
        newSelectedTools.add(toolKey)
      } else {
        newSelectedTools.delete(toolKey)
      }
      return {
        ...prev,
        selectedTools: newSelectedTools,
      }
    })
  }

  const handleServerToggle = (serverId: string) => {
    const server = mcpServers.find((s) => s.id === serverId)!
    const serverToolKeys = server.tools.map((tool) => `${serverId}:${tool.id}`)
    const allSelected = serverToolKeys.every((key) => formData.selectedTools.has(key))

    setFormData((prev) => {
      const newSelectedTools = new Set(prev.selectedTools)
      if (allSelected) {
        // Deselect all tools from this server
        serverToolKeys.forEach((key) => newSelectedTools.delete(key))
      } else {
        // Select all tools from this server
        serverToolKeys.forEach((key) => newSelectedTools.add(key))
      }
      return {
        ...prev,
        selectedTools: newSelectedTools,
      }
    })
  }

  const handleSelectAll = () => {
    const allToolKeys = mcpServers.flatMap((server) => server.tools.map((tool) => `${server.id}:${tool.id}`))
    const allSelected = allToolKeys.every((key) => formData.selectedTools.has(key))

    setFormData((prev) => ({
      ...prev,
      selectedTools: allSelected ? new Set() : new Set(allToolKeys),
    }))
  }

  const toggleServerExpansion = (serverId: string) => {
    setExpandedServers((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(serverId)) {
        newExpanded.delete(serverId)
      } else {
        newExpanded.add(serverId)
      }
      return newExpanded
    })
  }

  const getServerSelectionState = (serverId: string) => {
    const server = mcpServers.find((s) => s.id === serverId)!
    const serverToolKeys = server.tools.map((tool) => `${serverId}:${tool.id}`)
    const selectedCount = serverToolKeys.filter((key) => formData.selectedTools.has(key)).length

    if (selectedCount === 0) return "none"
    if (selectedCount === serverToolKeys.length) return "all"
    return "partial"
  }

  const getServerTypeColor = (type: string) => {
    const colors = {
      productivity: "bg-blue-100 text-blue-800",
      communication: "bg-green-100 text-green-800",
      development: "bg-purple-100 text-purple-800",
      research: "bg-orange-100 text-orange-800",
      automation: "bg-red-100 text-red-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const allToolKeys = mcpServers.flatMap((server) => server.tools.map((tool) => `${server.id}:${tool.id}`))
  const allSelected = allToolKeys.length > 0 && allToolKeys.every((key) => formData.selectedTools.has(key))
  const someSelected = allToolKeys.some((key) => formData.selectedTools.has(key))

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tool groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreateGroup}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tool Group
        </Button>
      </div>

      {/* Tool Groups List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5" />
            Tool Groups ({filteredGroups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Boxes className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tool groups found</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleCreateGroup}>
                Create your first tool group
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            <Badge variant={group.isActive ? "default" : "secondary"}>
                              {group.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground">{group.description}</p>

                          {/* Selected Tools */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Selected Tools ({group.selectedTools.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {group.selectedTools.map((tool) => (
                                <Badge
                                  key={`${tool.serverId}:${tool.toolId}`}
                                  variant="outline"
                                  className="flex items-center gap-1 py-1"
                                >
                                  <Server className="h-3 w-3" />
                                  {tool.serverName}: {tool.toolName}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                            <span>Created: {group.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {group.updatedAt.toLocaleDateString()}</span>
                            <span>Tools: {group.selectedTools.length}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleGroupStatus(group.id)}>
                              {group.isActive ? (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteGroupId(group.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setIsEditDialogOpen(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{isCreateDialogOpen ? "Create Tool Group" : "Edit Tool Group"}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? "Create a new group by selecting MCP servers and their specific tools."
                : "Edit this tool group's details and selected tools."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="space-y-4 py-4 h-full overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the purpose of this tool group"
                  rows={3}
                />
              </div>

              <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between flex-shrink-0">
                  <Label>Select MCP Servers and Tools</Label>
                  <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex items-center gap-2">
                    {allSelected ? (
                      <>
                        <Square className="h-4 w-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4" />
                        Select All
                      </>
                    )}
                  </Button>
                </div>

                <div className="border rounded-md p-4 flex-1 min-h-0 overflow-y-auto">
                  <div className="space-y-4">
                    {mcpServers.map((server) => {
                      const selectionState = getServerSelectionState(server.id)
                      const isExpanded = expandedServers.has(server.id)
                      const selectedToolsCount = server.tools.filter((tool) =>
                        formData.selectedTools.has(`${server.id}:${tool.id}`),
                      ).length

                      return (
                        <div key={server.id} className="space-y-2">
                          {/* Server Header */}
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectionState === "all"}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = selectionState === "partial"
                                  }
                                }}
                                onCheckedChange={() => handleServerToggle(server.id)}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleServerExpansion(server.id)}
                                className="p-0 h-auto"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4" />
                                <span className="font-medium">{server.name}</span>
                                <Badge className={getServerTypeColor(server.type)}>{server.type}</Badge>
                                {server.requiresAuth && (
                                  <Badge variant="outline" className="text-xs">
                                    Auth Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{server.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedToolsCount} of {server.tools.length} tools selected
                              </p>
                            </div>
                          </div>

                          {/* Server Tools */}
                          {isExpanded && (
                            <div className="ml-6 space-y-2">
                              {server.tools.map((tool) => {
                                const toolKey = `${server.id}:${tool.id}`
                                const isSelected = formData.selectedTools.has(toolKey)

                                return (
                                  <div key={tool.id} className="flex items-start gap-3 p-2 rounded border">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handleToolSelection(server.id, tool.id, checked as boolean)
                                      }
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <Tool className="h-3 w-3" />
                                        <span className="text-sm font-medium">{tool.name}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                                      {tool.parameters.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {tool.parameters.map((param) => (
                                            <Badge key={param} variant="secondary" className="text-xs">
                                              {param}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground flex-shrink-0">
                  Selected: {formData.selectedTools.size} tools from{" "}
                  {new Set(Array.from(formData.selectedTools).map((key) => key.split(":")[0])).size} servers
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setIsEditDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveGroup}>{isCreateDialogOpen ? "Create Group" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteGroupId} onOpenChange={() => setDeleteGroupId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tool group? This action cannot be undone. Any permissions associated
              with this group will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteGroupId) {
                  handleDeleteGroup(deleteGroupId)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
