"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APIKeyList } from "@/components/api-key-list"
import { CreateAPIKeyDialog } from "@/components/create-api-key-dialog"
import { APIKeyStats } from "@/components/api-key-stats"
import { Plus, Key } from "lucide-react"
import type { APIKey } from "@/types/api-key"
import { toast } from "@/components/ui/use-toast"

// Mock data
const mockAPIKeys: APIKey[] = [
  {
    id: "1",
    name: "Production API",
    description: "Main production API key for the web application",
    key: "sk-1234567890abcdef1234567890abcdef12345678",
    maskedKey: "sk-****************************5678",
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date("2024-01-25"),
    isActive: true,
    permissions: ["read", "write", "admin"],
    expiresAt: new Date("2024-12-31"),
  },
  {
    id: "2",
    name: "Development API",
    description: "API key for development and testing purposes",
    key: "sk-abcdef1234567890abcdef1234567890abcdef12",
    maskedKey: "sk-****************************ef12",
    createdAt: new Date("2024-01-10"),
    lastUsed: new Date("2024-01-24"),
    isActive: true,
    permissions: ["read", "write"],
  },
  {
    id: "3",
    name: "Analytics Service",
    description: "Read-only API key for analytics and reporting",
    key: "sk-fedcba0987654321fedcba0987654321fedcba09",
    maskedKey: "sk-****************************ba09",
    createdAt: new Date("2024-01-05"),
    lastUsed: new Date("2024-01-20"),
    isActive: true,
    permissions: ["read"],
    expiresAt: new Date("2024-06-30"),
  },
  {
    id: "4",
    name: "Legacy Integration",
    description: "Deprecated API key for legacy system integration",
    key: "sk-0123456789fedcba0123456789fedcba01234567",
    maskedKey: "sk-****************************4567",
    createdAt: new Date("2023-12-01"),
    lastUsed: new Date("2024-01-15"),
    isActive: false,
    permissions: ["read"],
  },
]

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreateAPIKey = (keyData: any) => {
    // Generate a new API key
    const newKey = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const maskedKey = `sk-****************************${newKey.slice(-4)}`

    const newAPIKey: APIKey = {
      id: Date.now().toString(),
      key: newKey,
      maskedKey,
      createdAt: new Date(),
      isActive: true,
      lastUsed: undefined,
      ...keyData,
    }

    setApiKeys((prev) => [newAPIKey, ...prev])

    // Copy to clipboard
    navigator.clipboard.writeText(newKey)
    toast({
      title: "API Key Created",
      description: "The new API key has been created and copied to your clipboard.",
    })

    setShowCreateDialog(false)
  }

  const handleDeleteAPIKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId))
    toast({
      title: "API Key Deleted",
      description: "The API key has been successfully deleted.",
    })
  }

  const handleToggleAPIKey = (keyId: string) => {
    setApiKeys((prev) => prev.map((key) => (key.id === keyId ? { ...key, isActive: !key.isActive } : key)))
    toast({
      title: "API Key Updated",
      description: "The API key status has been updated.",
    })
  }

  const activeKeys = apiKeys.filter((key) => key.isActive)
  const totalRequests = 15420 // Mock data
  const todayRequests = 342 // Mock data

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <APIKeyStats
        totalKeys={apiKeys.length}
        activeKeys={activeKeys.length}
        totalRequests={totalRequests}
        todayRequests={todayRequests}
      />

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys ({apiKeys.length})
            </CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <APIKeyList apiKeys={apiKeys} onDelete={handleDeleteAPIKey} onToggle={handleToggleAPIKey} />
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <CreateAPIKeyDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreateKey={handleCreateAPIKey} />
    </div>
  )
}
