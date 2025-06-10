"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Plus, CheckCircle, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

const VALIDITY_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
]

interface OnboardingStep1Props {
  onApiKeyGenerated: () => void
}

export function OnboardingStep1({ onApiKeyGenerated }: OnboardingStep1Props) {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedValidity, setSelectedValidity] = useState<string>("30")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const generateApiKey = async () => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newKey = "sk_user_" + Math.random().toString(36).substring(2, 38)
    setGeneratedKey(newKey)
    setIsGenerateDialogOpen(false)
    setIsGenerating(false)

    // Copy to clipboard automatically
    navigator.clipboard.writeText(newKey)

    toast({
      title: "API key generated successfully! 🎉",
      description: "Your API key has been copied to your clipboard.",
    })

    // Notify parent component
    onApiKeyGenerated()
  }

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
      toast({
        title: "Copied to clipboard",
        description: "Your API key has been copied to your clipboard.",
      })
    }
  }

  if (generatedKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            API Key Generated Successfully!
          </CardTitle>
          <CardDescription>
            Your personal API key is ready. Keep it safe and don't share it with others.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded font-mono text-sm">
            <span className="flex-1 break-all">{generatedKey}</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>API key has been automatically copied to your clipboard</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
            <p className="text-sm text-green-700">
              Great! Now let's configure your service tokens so you can start using the MCP tools.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Step 1: Generate Your API Key</CardTitle>
          <CardDescription>
            First, let's create your personal API key. This key will authenticate your requests to the MCP Chat System.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Why do you need an API key?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Secure access to MCP Chat features</li>
              <li>• Track your usage and requests</li>
              <li>• Manage your personal settings</li>
            </ul>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => setIsGenerateDialogOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Generate My API Key
            </Button>
          </div>
        </CardContent>
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
              Choose how long you want your API key to be valid. You can always regenerate it later.
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
              <p className="text-xs text-muted-foreground">Recommended: 30 days for regular use, 7 days for testing</p>
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
