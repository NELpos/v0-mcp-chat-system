"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Settings, Tag, X, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchMCPTools, groupToolsByTags, createToolGroupFromTags } from "@/lib/mcp-tools"
import type { ToolGroup, MCPTool } from "@/types/tool-group"

// Mock data for users and groups
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Manager" },
]

const mockGroups = [
  { id: "1", name: "Developers", description: "Development team members", memberCount: 8 },
  { id: "2", name: "Analysts", description: "Data analysts and researchers", memberCount: 5 },
  { id: "3", name: "Managers", description: "Team leads and managers", memberCount: 3 },
  { id: "4", name: "Security Team", description: "Security specialists", memberCount: 4 },
]

export function ToolGroupManager() {
  const [toolGroups, setToolGroups] = useState<ToolGroup[]>([])
  const [availableTools, setAvailableTools] = useState<MCPTool[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ToolGroup | null>(null)

  // Create dialog state
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("tools")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const tools = await fetchMCPTools()
      setAvailableTools(tools)

      // Extract unique tags
      const allTags = tools.flatMap((tool) => tool.tags)
      const uniqueTags = Array.from(new Set(allTags)).filter(Boolean)
      setAvailableTags(uniqueTags)

      // Create auto groups from tags
      const grouped = groupToolsByTags(tools)
      const autoGroups = Object.entries(grouped).map(([tag, tools]) => createToolGroupFromTags(tag, tools))
      setToolGroups(autoGroups)
    } catch (error) {
      console.error("Failed to load MCP tools:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredGroups = toolGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredTools =
    selectedTagFilters.length > 0
      ? availableTools.filter((tool) => selectedTagFilters.some((tag) => tool.tags.includes(tag)))
      : availableTools

  const createGroup = () => {
    if (!newGroupName.trim() || selectedTools.length === 0) return

    const selectedToolObjects = availableTools.filter((tool) => selectedTools.includes(tool.name))
    const groupTags = Array.from(new Set(selectedToolObjects.flatMap((tool) => tool.tags)))

    const newGroup: ToolGroup = {
      id: `custom-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      tags: groupTags,
      tools: selectedToolObjects,
      color: "bg-blue-100 text-blue-800",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      assignedUsers: selectedUsers,
      assignedGroups: selectedGroups,
    }

    setToolGroups((prev) => [...prev, newGroup])
    resetCreateDialog()
  }

  const updateGroup = () => {
    if (!editingGroup || !newGroupName.trim() || selectedTools.length === 0) return

    const selectedToolObjects = availableTools.filter((tool) => selectedTools.includes(tool.name))
    const groupTags = Array.from(new Set(selectedToolObjects.flatMap((tool) => tool.tags)))

    const updatedGroup: ToolGroup = {
      ...editingGroup,
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      tags: groupTags,
      tools: selectedToolObjects,
      assignedUsers: selectedUsers,
      assignedGroups: selectedGroups,
      updatedAt: new Date(),
    }

    setToolGroups((prev) => prev.map((group) => (group.id === editingGroup.id ? updatedGroup : group)))
    resetEditDialog()
  }

  const resetCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setNewGroupName("")
    setNewGroupDescription("")
    setSelectedTagFilters([])
    setSelectedTools([])
    setSelectedUsers([])
    setSelectedGroups([])
    setActiveTab("tools")
  }

  const resetEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingGroup(null)
    setNewGroupName("")
    setNewGroupDescription("")
    setSelectedTagFilters([])
    setSelectedTools([])
    setSelectedUsers([])
    setSelectedGroups([])
    setActiveTab("tools")
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const removeTagFilter = (tag: string) => {
    setSelectedTagFilters((prev) => prev.filter((t) => t !== tag))
  }

  const clearAllFilters = () => {
    setSelectedTagFilters([])
  }

  const toggleToolSelection = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName) ? prev.filter((name) => name !== toolName) : [...prev, toolName],
    )
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const toggleGroupStatus = (groupId: string) => {
    setToolGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, isActive: !group.isActive } : group)),
    )
  }

  const deleteGroup = (groupId: string) => {
    setToolGroups((prev) => prev.filter((group) => group.id !== groupId))
  }

  const startEdit = (group: ToolGroup) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setNewGroupDescription(group.description)
    setSelectedTools(group.tools.map((tool) => tool.name))
    setSelectedUsers(group.assignedUsers || [])
    setSelectedGroups(group.assignedGroups || [])
    setActiveTab("tools")
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading tool groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Tool Groups</h3>
          <p className="text-sm text-muted-foreground">Organize and manage your MCP tools into logical groups</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create Tool Group</DialogTitle>
              <DialogDescription>Create a custom tool group and assign it to users or groups</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={2}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Select Tools ({selectedTools.length})
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Assign Access ({selectedUsers.length + selectedGroups.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="space-y-4">
                  <div>
                    <Label>Filter by Tags (Optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTagFilters.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                          {selectedTagFilters.includes(tag) && (
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTagFilter(tag)
                              }}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>

                    {selectedTagFilters.length > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          Filtering by: {selectedTagFilters.join(", ")} ({filteredTools.length} tools)
                        </span>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-1 text-xs">
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Select Tools ({selectedTools.length} selected)</Label>
                    {filteredTools.length === 0 && selectedTagFilters.length > 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Tag className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No tools found with selected tags</p>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="mt-2">
                          Clear filters to see all tools
                        </Button>
                      </div>
                    )}

                    {filteredTools.length > 0 && (
                      <ScrollArea className="h-64 border rounded-md p-4">
                        <div className="space-y-3">
                          {filteredTools.map((tool) => (
                            <div key={tool.name} className="flex items-start space-x-3">
                              <Checkbox
                                id={tool.name}
                                checked={selectedTools.includes(tool.name)}
                                onCheckedChange={() => toggleToolSelection(tool.name)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={tool.name} className="font-medium cursor-pointer">
                                      {tool.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    {tool.tags.length > 0 ? (
                                      tool.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant={selectedTagFilters.includes(tag) ? "default" : "outline"}
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Badge variant="outline" className="text-xs">
                                        general
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Users Section */}
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assign to Users ({selectedUsers.length} selected)
                      </Label>
                      <ScrollArea className="h-64 border rounded-md p-4 mt-2">
                        <div className="space-y-3">
                          {mockUsers.map((user) => (
                            <div key={user.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={`user-${user.id}`}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => toggleUserSelection(user.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                                      {user.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {user.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Groups Section */}
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assign to Groups ({selectedGroups.length} selected)
                      </Label>
                      <ScrollArea className="h-64 border rounded-md p-4 mt-2">
                        <div className="space-y-3">
                          {mockGroups.map((group) => (
                            <div key={group.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={`group-${group.id}`}
                                checked={selectedGroups.includes(group.id)}
                                onCheckedChange={() => toggleGroupSelection(group.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={`group-${group.id}`} className="font-medium cursor-pointer">
                                      {group.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{group.description}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {group.memberCount} members
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Assignment Summary</h4>
                      <div className="space-y-2 text-sm">
                        {selectedUsers.length > 0 && (
                          <div>
                            <span className="font-medium">Users:</span>{" "}
                            {selectedUsers.map((userId) => mockUsers.find((u) => u.id === userId)?.name).join(", ")}
                          </div>
                        )}
                        {selectedGroups.length > 0 && (
                          <div>
                            <span className="font-medium">Groups:</span>{" "}
                            {selectedGroups.map((groupId) => mockGroups.find((g) => g.id === groupId)?.name).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetCreateDialog}>
                Cancel
              </Button>
              <Button onClick={createGroup} disabled={!newGroupName.trim() || selectedTools.length === 0}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Tool Group Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Tool Group</DialogTitle>
              <DialogDescription>Modify the tool group settings and assignments</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="edit-group-name">Group Name</Label>
                  <Input
                    id="edit-group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-group-description">Description</Label>
                  <Textarea
                    id="edit-group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={2}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Select Tools ({selectedTools.length})
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Assign Access ({selectedUsers.length + selectedGroups.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="space-y-4">
                  <div>
                    <Label>Filter by Tags (Optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTagFilters.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                          {selectedTagFilters.includes(tag) && (
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTagFilter(tag)
                              }}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>

                    {selectedTagFilters.length > 0 && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          Filtering by: {selectedTagFilters.join(", ")} ({filteredTools.length} tools)
                        </span>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-1 text-xs">
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Select Tools ({selectedTools.length} selected)</Label>
                    {filteredTools.length === 0 && selectedTagFilters.length > 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Tag className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No tools found with selected tags</p>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="mt-2">
                          Clear filters to see all tools
                        </Button>
                      </div>
                    )}

                    {filteredTools.length > 0 && (
                      <ScrollArea className="h-64 border rounded-md p-4">
                        <div className="space-y-3">
                          {filteredTools.map((tool) => (
                            <div key={tool.name} className="flex items-start space-x-3">
                              <Checkbox
                                id={`edit-${tool.name}`}
                                checked={selectedTools.includes(tool.name)}
                                onCheckedChange={() => toggleToolSelection(tool.name)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={`edit-${tool.name}`} className="font-medium cursor-pointer">
                                      {tool.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    {tool.tags.length > 0 ? (
                                      tool.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant={selectedTagFilters.includes(tag) ? "default" : "outline"}
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Badge variant="outline" className="text-xs">
                                        general
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Users Section */}
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assign to Users ({selectedUsers.length} selected)
                      </Label>
                      <ScrollArea className="h-64 border rounded-md p-4 mt-2">
                        <div className="space-y-3">
                          {mockUsers.map((user) => (
                            <div key={user.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={`edit-user-${user.id}`}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => toggleUserSelection(user.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={`edit-user-${user.id}`} className="font-medium cursor-pointer">
                                      {user.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {user.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Groups Section */}
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assign to Groups ({selectedGroups.length} selected)
                      </Label>
                      <ScrollArea className="h-64 border rounded-md p-4 mt-2">
                        <div className="space-y-3">
                          {mockGroups.map((group) => (
                            <div key={group.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={`edit-group-${group.id}`}
                                checked={selectedGroups.includes(group.id)}
                                onCheckedChange={() => toggleGroupSelection(group.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label htmlFor={`edit-group-${group.id}`} className="font-medium cursor-pointer">
                                      {group.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{group.description}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {group.memberCount} members
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Assignment Summary</h4>
                      <div className="space-y-2 text-sm">
                        {selectedUsers.length > 0 && (
                          <div>
                            <span className="font-medium">Users:</span>{" "}
                            {selectedUsers.map((userId) => mockUsers.find((u) => u.id === userId)?.name).join(", ")}
                          </div>
                        )}
                        {selectedGroups.length > 0 && (
                          <div>
                            <span className="font-medium">Groups:</span>{" "}
                            {selectedGroups.map((groupId) => mockGroups.find((g) => g.id === groupId)?.name).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetEditDialog}>
                Cancel
              </Button>
              <Button onClick={updateGroup} disabled={!newGroupName.trim() || selectedTools.length === 0}>
                Update Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tool groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolGroups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolGroups.filter((g) => g.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTools.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTags.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Groups Grid */}
      <div className="grid gap-4 grid-cols-1">
        {filteredGroups.map((group) => (
          <Card key={group.id} className={`${group.isActive ? "" : "opacity-60"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge className={group.color}>{group.tags.join(", ") || "Custom"}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={group.isActive} onCheckedChange={() => toggleGroupStatus(group.id)} />
                  <Button variant="ghost" size="sm" onClick={() => startEdit(group)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteGroup(group.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{group.tools.length} tools</span>
                  <span>Updated {group.updatedAt.toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="space-y-1">
                  {group.tools.slice(0, 3).map((tool) => (
                    <div key={tool.name} className="text-sm flex items-center justify-between">
                      <span className="font-medium">{tool.name}</span>
                      <div className="flex gap-1">
                        {tool.tags.length > 0 ? (
                          tool.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            general
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {group.tools.length > 3 && (
                    <div className="text-sm text-muted-foreground">+{group.tools.length - 3} more tools</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No tool groups found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first tool group"}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tool Group
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
