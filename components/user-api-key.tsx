"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, RefreshCw, Clock } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import type { UserAPIKey } from "@/types/user-api-key"

// Mock data for demonstration
const mockUserApiKey: UserAPIKey = {
  id: "user-api-key-1",
  name: "Personal API Key",
  key: "sk_user_1234567890abcdefghijklmnopqrstuvwxyz",
  maskedKey: "sk_user_123456******************************wxyz",
  createdAt: new Date(2023, 5, 15),
  expiresAt: new Date(2024, 5, 15),
  lastUsed: new Date(2023, 11, 20),
}

export function UserApiKey() {
  const [apiKey, setApiKey] = useState<UserAPIKey>(mockUserApiKey)
  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key)
    toast({
      title: "Copied to clipboard",
      description: "Your API key has been copied to your clipboard.",
    })
  }

  const regenerateApiKey = () => {
    // In a real application, this would make an API call to regenerate the key
    const newKey = "sk_user_" + Math.random().toString(36).substring(2, 38)
    const maskedKey = `sk_user_${newKey.substring(8, 14)}******************************${newKey.substring(newKey.length - 4)}`

    setApiKey({
      ...apiKey,
      key: newKey,
      maskedKey: maskedKey,
      createdAt: new Date(),
    })

    setIsRegenerateDialogOpen(false)

    toast({
      title: "API key regenerated",
      description: "Your new API key has been generated successfully.",
    })
  }

  const isExpiringSoon = (expiresAt?: Date) => {
    if (!expiresAt) return false
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{apiKey.name}</span>
            {apiKey.expiresAt && isExpiringSoon(apiKey.expiresAt) && (
              <Badge variant="destructive" className="text-xs">
                Expires Soon
              </Badge>
            )}
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
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsRegenerateDialogOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate API Key
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to regenerate your API key? This action cannot be undone and will immediately revoke
              access for any applications using your current key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={regenerateApiKey}>Regenerate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
