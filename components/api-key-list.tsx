"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
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
import { Copy, MoreHorizontal, Eye, EyeOff, Trash2, Clock, User, Shield, Search } from "lucide-react"
import type { APIKey } from "@/types/api-key"
import { toast } from "@/components/ui/use-toast"

interface APIKeyListProps {
  apiKeys: APIKey[]
  onDelete: (keyId: string) => void
  onToggle: (keyId: string) => void
}

export function APIKeyList({ apiKeys, onDelete, onToggle }: APIKeyListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${keyName} API key has been copied to your clipboard.`,
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    setRevealedKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
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

  const isExpiringSoon = (expiresAt?: Date) => {
    if (!expiresAt) return false
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search API keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* API Keys List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {filteredKeys.map((apiKey) => (
            <Card key={apiKey.id} className={`${!apiKey.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{apiKey.name}</h3>
                      <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {apiKey.expiresAt && isExpiringSoon(apiKey.expiresAt) && (
                        <Badge variant="destructive" className="text-xs">
                          Expires Soon
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{apiKey.description}</p>

                    {/* API Key */}
                    <div className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-sm">
                      <span className="flex-1">{revealedKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-6 w-6 p-0"
                      >
                        {revealedKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Permissions */}
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className={`text-xs text-white ${getPermissionColor(permission)}`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {permission}
                        </Badge>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Created {apiKey.createdAt.toLocaleDateString()}
                      </div>
                      {apiKey.lastUsed && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last used {apiKey.lastUsed.toLocaleDateString()}
                        </div>
                      )}
                      {apiKey.expiresAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {apiKey.expiresAt.toLocaleDateString()}
                        </div>
                      )}
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
                      <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key, apiKey.name)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Key
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggle(apiKey.id)}>
                        {apiKey.isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {apiKey.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteKeyId(apiKey.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteKeyId} onOpenChange={() => setDeleteKeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke
              access for any applications using this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteKeyId) {
                  onDelete(deleteKeyId)
                  setDeleteKeyId(null)
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
