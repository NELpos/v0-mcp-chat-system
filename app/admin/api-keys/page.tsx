"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Key, Plus, MoreHorizontal, Copy, Eye, EyeOff, Activity, Shield } from "lucide-react"

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: Date
  lastUsed: Date | null
  isActive: boolean
  usage: {
    requests: number
    limit: number
  }
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "ak_prod_1234567890abcdef",
    permissions: ["read", "write", "admin"],
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date("2024-01-20"),
    isActive: true,
    usage: { requests: 1250, limit: 5000 },
  },
  {
    id: "2",
    name: "Development API Key",
    key: "ak_dev_abcdef1234567890",
    permissions: ["read", "write"],
    createdAt: new Date("2024-01-10"),
    lastUsed: new Date("2024-01-19"),
    isActive: true,
    usage: { requests: 450, limit: 1000 },
  },
  {
    id: "3",
    name: "Testing API Key",
    key: "ak_test_fedcba0987654321",
    permissions: ["read"],
    createdAt: new Date("2024-01-05"),
    lastUsed: null,
    isActive: false,
    usage: { requests: 0, limit: 500 },
  },
]

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([])
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId))
  }

  const toggleApiKeyStatus = (keyId: string) => {
    setApiKeys(apiKeys.map((key) => (key.id === keyId ? { ...key, isActive: !key.isActive } : key)))
  }

  const createApiKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `ak_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      permissions: newKeyPermissions,
      createdAt: new Date(),
      lastUsed: null,
      isActive: true,
      usage: { requests: 0, limit: 1000 },
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
    setNewKeyPermissions([])
    setShowCreateDialog(false)
  }

  const getUsagePercentage = (usage: { requests: number; limit: number }) => {
    return (usage.requests / usage.limit) * 100
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Key Management</h1>
            <p className="text-muted-foreground">Manage API keys for system integrations and external access</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key with specific permissions for system access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName">API Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="Enter a descriptive name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="flex gap-2 mt-2">
                    {["read", "write", "admin"].map((permission) => (
                      <Button
                        key={permission}
                        variant={newKeyPermissions.includes(permission) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (newKeyPermissions.includes(permission)) {
                            setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission))
                          } else {
                            setNewKeyPermissions([...newKeyPermissions, permission])
                          }
                        }}
                      >
                        {permission}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={createApiKey} className="w-full">
                  Create API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="keys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Active API Keys
                </CardTitle>
                <CardDescription>Manage and monitor your API keys for system integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {apiKey.usage.requests} / {apiKey.usage.limit}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  getUsagePercentage(apiKey.usage) >= 90
                                    ? "bg-red-500"
                                    : getUsagePercentage(apiKey.usage) >= 70
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{ width: `${getUsagePercentage(apiKey.usage)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                            {apiKey.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {apiKey.lastUsed ? (
                            <div className="text-sm">{apiKey.lastUsed.toLocaleDateString()}</div>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => toggleApiKeyStatus(apiKey.id)}>
                                {apiKey.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key)}>Copy Key</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteApiKey(apiKey.id)} className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,700</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{apiKeys.filter((k) => k.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Out of {apiKeys.length} total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.2%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure global API settings and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                  <Input id="rateLimit" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="keyExpiry">Default Key Expiry (days)</Label>
                  <Input id="keyExpiry" type="number" defaultValue="365" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="requireAuth" defaultChecked />
                  <Label htmlFor="requireAuth">Require authentication for all endpoints</Label>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
