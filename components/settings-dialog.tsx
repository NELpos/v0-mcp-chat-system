"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings, ExternalLink } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function SettingsDialog() {
  const { toolTokens, isLoaded } = useSettings()
  const [open, setOpen] = useState(false)

  const getConfiguredCount = () => {
    if (!isLoaded) return 0
    return Object.values(toolTokens).filter((token) => token && token.length > 0).length
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Quick Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Quick Settings</DialogTitle>
          <DialogDescription>View your current configuration status and access full settings.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">MCP Tools</p>
              <p className="text-sm text-muted-foreground">API token configuration</p>
            </div>
            <Badge variant={getConfiguredCount() > 0 ? "default" : "secondary"}>
              {isLoaded ? `${getConfiguredCount()}/3 configured` : "Loading..."}
            </Badge>
          </div>

          {isLoaded && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Jira</span>
                <Badge variant={toolTokens.jira ? "default" : "outline"} className="text-xs">
                  {toolTokens.jira ? "✓" : "○"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Atlassian</span>
                <Badge variant={toolTokens.atlassian ? "default" : "outline"} className="text-xs">
                  {toolTokens.atlassian ? "✓" : "○"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Slack</span>
                <Badge variant={toolTokens.slack ? "default" : "outline"} className="text-xs">
                  {toolTokens.slack ? "✓" : "○"}
                </Badge>
              </div>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/settings" onClick={() => setOpen(false)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full Settings
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
