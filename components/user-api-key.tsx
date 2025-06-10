"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Eye, EyeOff, RefreshCw, Clock, Key, Plus, Trash2 } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import type { UserAPIKey } from "@/types/user-api-key"

const VALIDITY_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
]

export function UserApiKey() {
  const [apiKey, setApiKey] = useState<UserAPIKey | null>(null)
  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedValidity, setSelectedValidity] = useState<string>("7")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible)
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey.key)
      toast({
        title: "Copied to clipboard",
        description: "Your API key has been copied to your clipboard.",
      })
    }
  }

  const generateApiKey = async () => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newKey = "sk_user_" + Math.random().toString(36).substring(2, 38)
    const maskedKey = `sk_user_${newKey.substring(8, 14)}******************************${newKey.substring(newKey.length - 4)}`

    const validityDays = Number.parseInt(selectedValidity)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validityDays)

    const newApiKey: UserAPIKey = {
      id: "user-api-key-1",
      name: "Personal API Key",
      key: newKey,
      maskedKey: maskedKey,
      createdAt: new Date(),
      expiresAt: expiresAt,
      lastUsed: undefined,
    }

    setApiKey(newApiKey)
    setIsGenerateDialogOpen(false)
    setIsGenerating(false)

    // Copy to clipboard automatically
    navigator.clipboard.writeText(newKey)

    toast({
      title: "API key generated successfully",
      description: "Your new API key has been generated and copied to your clipboard.",
    })
  }

  const regenerateApiKey = async () => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newKey = "sk_user_" + Math.random().toString(36).substring(2, 38)
    const maskedKey = `sk_user_${newKey.substring(8, 14)}******************************${newKey.substring(newKey.length - 4)}`

    const validityDays = Number.parseInt(selectedValidity)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validityDays)

    if (apiKey) {
      const updatedApiKey: UserAPIKey = {
        ...apiKey,
        key: newKey,
        maskedKey: maskedKey,
        createdAt: new Date(),
        expiresAt: expiresAt,
        lastUsed: undefined,
      }

      setApiKey(updatedApiKey)
    }

    setIsRegenerateDialogOpen(false)
    setIsGenerating(false)

    // Copy to clipboard automatically
    navigator.clipboard.writeText(newKey)

    toast({
      title: "API key regenerated",
      description: "Your new API key has been generated and copied to your clipboard.",
    })
  }

  const deleteApiKey = async () => {
    setIsDeleting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setApiKey(null)
    setIsDeleteDialogOpen(false)
    setIsDeleting(false)

    toast({
      title: "API key deleted",
      description: "Your API key has been permanently deleted.",
      variant: "destructive",
    })
  }

  const isExpiringSoon = (expiresAt?: Date) => {
    if (!expiresAt) return false
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7
  }

  // If no API key exists, show generation interface
  if (!apiKey) {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Key className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No API Key Generated</CardTitle>
            <CardDescription>
              You haven't generated your personal API key yet. Click the button below to create one.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => setIsGenerateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate API Key
            </Button>
          </CardFooter>
        </Card>

        {/* Generate API Key Dialog */}
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Generate API Key
              </DialogTitle>
              <DialogDescription>
                Create your personal API key for accessing the MCP Chat System API. You can only have one active API key
                at a time.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="validity">Validity Period</Label>
                <Select value={selectedValidity} onValueChange={setSelectedValidity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select validity period" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALIDITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Your API key will expire after the selected period and will need to be regenerated.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={generateApiKey} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate API Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // If API key exists, show management interface
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{apiKey.name}</span>
            <div className="flex gap-2">
              <Badge variant="default">Active</Badge>
              {apiKey.expiresAt && isExpiringSoon(apiKey.expiresAt) && (
                <Badge variant="destructive" className="text-xs">
                  Expires Soon
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>Your personal API key for accessing the MCP Chat System API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded font-mono text-sm">
            <span className="flex-1 break-all">{isKeyVisible ? apiKey.key : apiKey.maskedKey}</span>
            <Button variant="ghost" size="sm" onClick={toggleKeyVisibility} className="h-8 w-8 p-0">
              {isKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created: {apiKey.createdAt.toLocaleDateString()}</span>
            </div>
            {apiKey.lastUsed && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last used: {apiKey.lastUsed.toLocaleDateString()}</span>
              </div>
            )}
            {apiKey.expiresAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Expires: {apiKey.expiresAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setIsRegenerateDialogOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Regenerate API Key Dialog */}
      <Dialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Regenerate API Key
            </DialogTitle>
            <DialogDescription>
              Generate a new API key with a new validity period. This will immediately revoke access for any
              applications using your current key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="validity">New Validity Period</Label>
              <Select value={selectedValidity} onValueChange={setSelectedValidity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select validity period" />
                </SelectTrigger>
                <SelectContent>
                  {VALIDITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The new API key will expire after the selected period from today.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={regenerateApiKey} disabled={isGenerating}>
              {isGenerating ? "Regenerating..." : "Regenerate API Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete API Key Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete API Key
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your API key? This action cannot be undone and will immediately revoke
              access for any applications using this key. You will need to generate a new API key to continue using the
              API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteApiKey}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete API Key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
