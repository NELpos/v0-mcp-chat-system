"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  LucideUser,
  UserCircle,
  Boxes,
  CalendarIcon,
  Edit,
  Trash2,
  Shield,
} from "lucide-react"
import type { Permission, ToolGroup, User, UserGroup } from "@/types/tool-group"
import { toast } from "@/components/ui/use-toast"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
]

// Mock data for user groups
const mockUserGroups: UserGroup[] = [
  {
    id: "group-1",
    name: "Administrators",
    description: "System administrators with full access",
    members: [mockUsers[0]],
  },
  {
    id: "group-2",
    name: "Developers",
    description: "Software development team",
    members: [mockUsers[1], mockUsers[2]],
  },
]

// Mock data for tool groups
const mockToolGroups: ToolGroup[] = [
  {
    id: "tgroup-1",
    name: "Development Tools",
    description: "Tools for software development",
    tools: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: "tgroup-2",
    name: "Productivity Suite",
    description: "Tools for project management",
    tools: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
]

// Mock data for permissions
const mockPermissions: Permission[] = [
  {
    id: "perm-1",
    userId: "user-1",
    toolGroupId: "tgroup-1",
    accessLevel: "admin",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "perm-2",
    userGroupId: "group-2",
    toolGroupId: "tgroup-1",
    accessLevel: "write",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "perm-3",
    userId: "user-2",
    toolGroupId: "tgroup-2",
    accessLevel: "read",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    expiresAt: new Date("2024-06-30"),
  },
]

export function PermissionManager() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletePermissionId, setDeletePermissionId] = useState<string | null>(null)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users")

  // Form state
  const [formData, setFormData] = useState({
    entityType: "user" as "user" | "group",
    entityId: "",
    toolGroupId: "",
    accessLevel: "read" as "read" | "write" | "admin",
    expiryDate: undefined as Date | undefined,
  })

  // Filter permissions based on search term and active tab
  const filteredPermissions = permissions.filter((permission) => {
    const matchesTab = activeTab === "users" ? permission.userId !== undefined : permission.userGroupId !== undefined

    if (!matchesTab) return false

    if (!searchTerm) return true

    // Search in user/group name
    if (permission.userId) {
      const user = mockUsers.find((u) => u.id === permission.userId)
      return (
        user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      )
    } else if (permission.userGroupId) {
      const group = mockUserGroups.find((g) => g.id === permission.userGroupId)
      return (
        group?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      )
    }

    return false
  })

  const handleCreatePermission = () => {
    setFormData({
      entityType: activeTab === "users" ? "user" : "group",
      entityId: "",
      toolGroupId: "",
      accessLevel: "read",
      expiryDate: undefined,
    })
    setIsCreateDialogOpen(true)
  }

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormData({
      entityType: permission.userId ? "user" : "group",
      entityId: permission.userId || permission.userGroupId || "",
      toolGroupId: permission.toolGroupId,
      accessLevel: permission.accessLevel,
      expiryDate: permission.expiresAt,
    })
    setIsEditDialogOpen(true)
  }

  const handleSavePermission = () => {
    if (!formData.entityId) {
      toast({
        title: "Error",
        description: `Please select a ${formData.entityType}`,
        variant: "destructive",
      })
      return
    }

    if (!formData.toolGroupId) {
      toast({
        title: "Error",
        description: "Please select a tool group",
        variant: "destructive",
      })
      return
    }

    if (isCreateDialogOpen) {
      // Create new permission
      const newPermission: Permission = {
        id: `perm-${Date.now()}`,
        ...(formData.entityType === "user" ? { userId: formData.entityId } : { userGroupId: formData.entityId }),
        toolGroupId: formData.toolGroupId,
        accessLevel: formData.accessLevel,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: formData.expiryDate,
      }

      setPermissions((prev) => [...prev, newPermission])
      setIsCreateDialogOpen(false)

      toast({
        title: "Success",
        description: "Permission created successfully",
      })
    } else if (isEditDialogOpen && selectedPermission) {
      // Update existing permission
      setPermissions((prev) =>
        prev.map((permission) =>
          permission.id === selectedPermission.id
            ? {
                ...permission,
                ...(formData.entityType === "user"
                  ? { userId: formData.entityId, userGroupId: undefined }
                  : { userGroupId: formData.entityId, userId: undefined }),
                toolGroupId: formData.toolGroupId,
                accessLevel: formData.accessLevel,
                updatedAt: new Date(),
                expiresAt: formData.expiryDate,
              }
            : permission,
        ),
      )
      setIsEditDialogOpen(false)

      toast({
        title: "Success",
        description: "Permission updated successfully",
      })
    }
  }

  const handleDeletePermission = (permissionId: string) => {
    setPermissions((prev) => prev.filter((permission) => permission.id !== permissionId))
    setDeletePermissionId(null)

    toast({
      title: "Success",
      description: "Permission deleted successfully",
    })
  }

  const getEntityName = (permission: Permission) => {
    if (permission.userId) {
      const user = mockUsers.find((u) => u.id === permission.userId)
      return user?.name || "Unknown User"
    } else if (permission.userGroupId) {
      const group = mockUserGroups.find((g) => g.id === permission.userGroupId)
      return group?.name || "Unknown Group"
    }
    return "Unknown"
  }

  const getEntityEmail = (permission: Permission) => {
    if (permission.userId) {
      const user = mockUsers.find((u) => u.id === permission.userId)
      return user?.email || ""
    }
    return ""
  }

  const getToolGroupName = (toolGroupId: string) => {
    const group = mockToolGroups.find((g) => g.id === toolGroupId)
    return group?.name || "Unknown Tool Group"
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-500"
      case "write":
        return "bg-yellow-500"
      case "read":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs for Users vs Groups */}
      <Tabs defaultValue="users" value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "groups")}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <LucideUser className="h-4 w-4" />
              User Permissions
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Permissions
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab === "users" ? "users" : "groups"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreatePermission}>
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </div>
        </div>

        <TabsContent value="users" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Permissions ({filteredPermissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No user permissions found</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleCreatePermission}>
                    Add your first user permission
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredPermissions.map((permission) => (
                      <Card key={permission.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              {/* User Info */}
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                  <UserCircle className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{getEntityName(permission)}</h3>
                                  {permission.userId && (
                                    <p className="text-sm text-muted-foreground">{getEntityEmail(permission)}</p>
                                  )}
                                </div>
                              </div>

                              {/* Permission Details */}
                              <div className="flex flex-wrap gap-3 mt-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Tool Group</p>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Boxes className="h-3 w-3" />
                                    {getToolGroupName(permission.toolGroupId)}
                                  </Badge>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Access Level</p>
                                  <Badge
                                    variant="outline"
                                    className={`text-white ${getAccessLevelColor(permission.accessLevel)}`}
                                  >
                                    {permission.accessLevel.toUpperCase()}
                                  </Badge>
                                </div>

                                {permission.expiresAt && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Expires</p>
                                    <Badge variant="outline">
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      {permission.expiresAt.toLocaleDateString()}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span>Created: {permission.createdAt.toLocaleDateString()}</span>
                                <span>Updated: {permission.updatedAt.toLocaleDateString()}</span>
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
                                <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Permission
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeletePermissionId(permission.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Permission
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
        </TabsContent>

        <TabsContent value="groups" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Group Permissions ({filteredPermissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No group permissions found</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleCreatePermission}>
                    Add your first group permission
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredPermissions.map((permission) => (
                      <Card key={permission.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              {/* Group Info */}
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                  <Users className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{getEntityName(permission)}</h3>
                                  {permission.userGroupId && (
                                    <p className="text-sm text-muted-foreground">
                                      {mockUserGroups.find((g) => g.id === permission.userGroupId)?.members.length || 0}{" "}
                                      members
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Permission Details */}
                              <div className="flex flex-wrap gap-3 mt-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Tool Group</p>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Boxes className="h-3 w-3" />
                                    {getToolGroupName(permission.toolGroupId)}
                                  </Badge>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Access Level</p>
                                  <Badge
                                    variant="outline"
                                    className={`text-white ${getAccessLevelColor(permission.accessLevel)}`}
                                  >
                                    {permission.accessLevel.toUpperCase()}
                                  </Badge>
                                </div>

                                {permission.expiresAt && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Expires</p>
                                    <Badge variant="outline">
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      {permission.expiresAt.toLocaleDateString()}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span>Created: {permission.createdAt.toLocaleDateString()}</span>
                                <span>Updated: {permission.updatedAt.toLocaleDateString()}</span>
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
                                <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Permission
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeletePermissionId(permission.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Permission
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
        </TabsContent>
      </Tabs>

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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? "Create Permission" : "Edit Permission"}</DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? "Grant access to tool groups for users or user groups."
                : "Modify access permissions for this entity."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Permission Type</Label>
              <Select
                value={formData.entityType}
                onValueChange={(value) =>
                  setFormData({ ...formData, entityType: value as "user" | "group", entityId: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User Permission</SelectItem>
                  <SelectItem value="group">Group Permission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{formData.entityType === "user" ? "User" : "User Group"}</Label>
              <Select
                value={formData.entityId}
                onValueChange={(value) => setFormData({ ...formData, entityId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${formData.entityType === "user" ? "user" : "group"}`} />
                </SelectTrigger>
                <SelectContent>
                  {formData.entityType === "user"
                    ? mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))
                    : mockUserGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.members.length} members)
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tool Group</Label>
              <Select
                value={formData.toolGroupId}
                onValueChange={(value) => setFormData({ ...formData, toolGroupId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tool group" />
                </SelectTrigger>
                <SelectContent>
                  {mockToolGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Access Level</Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, accessLevel: value as "read" | "write" | "admin" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read (View Only)</SelectItem>
                  <SelectItem value="write">Write (Create & Modify)</SelectItem>
                  <SelectItem value="admin">Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : "No expiration"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, expiryDate: undefined })}
                    >
                      Clear Date
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Leave empty for a permission that never expires.</p>
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
            <Button onClick={handleSavePermission}>{isCreateDialogOpen ? "Create Permission" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePermissionId} onOpenChange={() => setDeletePermissionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this permission? This action cannot be undone. The user or group will lose
              access to the associated tool group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletePermissionId) {
                  handleDeletePermission(deletePermissionId)
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
