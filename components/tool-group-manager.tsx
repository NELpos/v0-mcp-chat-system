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
import { Plus, Search, MoreHorizontal, Boxes, PenToolIcon as Tool, Edit, Trash2, Check } from "lucide-react"
import { mcpTools } from "@/lib/mcp-tools"
import type { ToolGroup } from "@/types/tool-group"
import { toast } from "@/components/ui/use-toast"

// Mock data for tool groups
const mockToolGroups: ToolGroup[] = [
  {
    id: "group-1",
    name: "Development Tools",
    description: "Tools for software development and code management",
    tools: [
      mcpTools.find((t) => t.id === "github") || mcpTools[0],
      mcpTools.find((t) => t.id === "code-interpreter") || mcpTools[0],
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    isActive: true,
  },
  {
    id: "group-2",
    name: "Productivity Suite",
    description: "Tools for project management and team collaboration",
    tools: [
      mcpTools.find((t) => t.id === "jira") || mcpTools[0],
      mcpTools.find((t) => t.id === "atlassian") || mcpTools[0],
      mcpTools.find((t) => t.id === "slack") || mcpTools[0],
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    isActive: true,
  },
  {
    id: "group-3",
    name: "Research Tools",
    description: "Tools for information gathering and analysis",
    tools: [mcpTools.find((t) => t.id === "web-search") || mcpTools[0]],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
    isActive: false,
  },
]

export function ToolGroupManager() {
  const [toolGroups, setToolGroups] = useState<ToolGroup[]>(mockToolGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<ToolGroup | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedTools: [] as string[],
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
      selectedTools: [],
    })
    setIsCreateDialogOpen(true)
  }

  const handleEditGroup = (group: ToolGroup) => {
    setSelectedGroup(group)
    setFormData({
      name: group.name,
      description: group.description,
      selectedTools: group.tools.map((tool) => tool.id),
    })
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

    if (formData.selectedTools.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one tool",
        variant: "destructive",
      })
      return
    }

    const selectedToolObjects = mcpTools.filter((tool) => formData.selectedTools.includes(tool.id))

    if (isCreateDialogOpen) {
      // Create new group
      const newGroup: ToolGroup = {
        id: `group-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        tools: selectedToolObjects,
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
                tools: selectedToolObjects,
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

  const handleToolSelection = (toolId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedTools: checked ? [...prev.selectedTools, toolId] : prev.selectedTools.filter((id) => id !== toolId),
    }))
  }

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

                          {/* Tools */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {group.tools.map((tool) => (
                              <Badge key={tool.id} variant="outline" className="flex items-center gap-1 py-1">
                                <Tool className="h-3 w-3" />
                                {tool.name}
                              </Badge>
                            ))}
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                            <span>Created: {group.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {group.updatedAt.toLocaleDateString()}</span>
                            <span>Tools: {group.tools.length}</span>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? "Create Tool Group" : "Edit Tool Group"}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? "Create a new group of tools for Generative AI tool calling capabilities."
                : "Edit this tool group's details and included tools."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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

            <div className="space-y-3">
              <Label>Select Tools</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                <div className="space-y-3">
                  {mcpTools.map((tool) => (
                    <div key={tool.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`tool-${tool.id}`}
                        checked={formData.selectedTools.includes(tool.id)}
                        onCheckedChange={(checked) => handleToolSelection(tool.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`tool-${tool.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tool.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Selected: {formData.selectedTools.length} tools</p>
            </div>
          </div>

          <DialogFooter>
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
