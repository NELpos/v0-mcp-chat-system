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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "@/components/ui/use-toast"

export function SettingsDialog() {
  const { toolTokens, updateToken } = useSettings()
  const [open, setOpen] = useState(false)
  const [localTokens, setLocalTokens] = useState({
    jira: toolTokens.jira || "",
    atlassian: toolTokens.atlassian || "",
    slack: toolTokens.slack || "",
  })

  const handleSave = () => {
    // Save all tokens
    Object.entries(localTokens).forEach(([tool, token]) => {
      updateToken(tool as keyof typeof toolTokens, token)
    })

    toast({
      title: "Settings saved",
      description: "Your API tokens have been saved successfully.",
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>MCP Tool Settings</DialogTitle>
          <DialogDescription>
            Configure your API tokens for MCP tool integrations. These tokens will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="jira" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="jira">Jira</TabsTrigger>
            <TabsTrigger value="atlassian">Atlassian</TabsTrigger>
            <TabsTrigger value="slack">Slack</TabsTrigger>
          </TabsList>

          <TabsContent value="jira" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="jira-token">Jira API Token</Label>
              <Input
                id="jira-token"
                type="password"
                placeholder="Enter your Jira API token"
                value={localTokens.jira}
                onChange={(e) => setLocalTokens({ ...localTokens, jira: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                You can generate a Jira API token from your Atlassian account settings.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="atlassian" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="atlassian-token">Atlassian API Token</Label>
              <Input
                id="atlassian-token"
                type="password"
                placeholder="Enter your Atlassian API token"
                value={localTokens.atlassian}
                onChange={(e) => setLocalTokens({ ...localTokens, atlassian: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                You can generate an Atlassian API token from your Atlassian account settings.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="slack" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="slack-token">Slack API Token</Label>
              <Input
                id="slack-token"
                type="password"
                placeholder="Enter your Slack API token"
                value={localTokens.slack}
                onChange={(e) => setLocalTokens({ ...localTokens, slack: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                You can generate a Slack API token from the Slack API website.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
