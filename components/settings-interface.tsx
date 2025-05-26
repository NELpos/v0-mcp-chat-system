"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "@/components/ui/use-toast"
import { Key, CheckCircle, AlertCircle, ExternalLink, Shield, Zap, MessageSquare, Building2 } from "lucide-react"

export function SettingsInterface() {
  const { toolTokens, updateToken } = useSettings()
  const [localTokens, setLocalTokens] = useState({
    jira: toolTokens.jira || "",
    atlassian: toolTokens.atlassian || "",
    slack: toolTokens.slack || "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save all tokens
    Object.entries(localTokens).forEach(([tool, token]) => {
      updateToken(tool as keyof typeof toolTokens, token)
    })

    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your API tokens have been saved successfully.",
    })
  }

  const handleReset = () => {
    setLocalTokens({
      jira: "",
      atlassian: "",
      slack: "",
    })
    toast({
      title: "Settings reset",
      description: "All API tokens have been cleared.",
    })
  }

  const getTokenStatus = (token: string) => {
    if (!token) return { status: "missing", color: "text-red-500", icon: AlertCircle }
    if (token.length < 10) return { status: "invalid", color: "text-yellow-500", icon: AlertCircle }
    return { status: "valid", color: "text-green-500", icon: CheckCircle }
  }

  const toolConfigs = [
    {
      id: "jira",
      name: "Jira",
      description: "Access and manage Jira issues and projects",
      icon: Building2,
      color: "bg-blue-500",
      docsUrl: "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/",
      features: ["Create and update issues", "Search projects", "Manage workflows", "Access comments"],
    },
    {
      id: "atlassian",
      name: "Atlassian",
      description: "Integrate with Atlassian products like Confluence",
      icon: Building2,
      color: "bg-indigo-500",
      docsUrl: "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/",
      features: ["Access Confluence pages", "Manage spaces", "Search content", "Edit documents"],
    },
    {
      id: "slack",
      name: "Slack",
      description: "Send messages and access Slack channels",
      icon: MessageSquare,
      color: "bg-green-500",
      docsUrl: "https://api.slack.com/authentication/token-types",
      features: ["Send messages", "Access channels", "Manage users", "File sharing"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {toolConfigs.map((tool) => {
          const tokenStatus = getTokenStatus(localTokens[tool.id as keyof typeof localTokens])
          const StatusIcon = tokenStatus.icon

          return (
            <Card key={tool.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${tokenStatus.color}`} />
                </div>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={tokenStatus.status === "valid" ? "default" : "secondary"} className="text-xs">
                    {tokenStatus.status === "valid"
                      ? "Configured"
                      : tokenStatus.status === "invalid"
                        ? "Invalid Token"
                        : "Not Configured"}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="space-y-1">
                      {tool.features.slice(0, 2).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Configuration Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Token Configuration
          </CardTitle>
          <CardDescription>
            Configure your API tokens for MCP tool integrations. These tokens are stored securely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jira" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              {toolConfigs.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="flex items-center gap-2">
                  <tool.icon className="h-4 w-4" />
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {toolConfigs.map((tool) => {
              const tokenStatus = getTokenStatus(localTokens[tool.id as keyof typeof localTokens])

              return (
                <TabsContent key={tool.id} value={tool.id} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Token Input */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${tool.id}-token`} className="flex items-center gap-2">
                          {tool.name} API Token
                          <Badge variant="outline" className={`text-xs ${tokenStatus.color}`}>
                            {tokenStatus.status}
                          </Badge>
                        </Label>
                        <Input
                          id={`${tool.id}-token`}
                          type="password"
                          placeholder={`Enter your ${tool.name} API token`}
                          value={localTokens[tool.id as keyof typeof localTokens]}
                          onChange={(e) =>
                            setLocalTokens({
                              ...localTokens,
                              [tool.id]: e.target.value,
                            })
                          }
                          className="font-mono"
                        />
                      </div>

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Your API tokens are stored locally in your browser and are never sent to our servers.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Documentation & Features */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Available Features
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {tool.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">How to get your API token:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Visit your {tool.name} account settings</li>
                          <li>Navigate to API tokens or developer settings</li>
                          <li>Generate a new API token</li>
                          <li>Copy and paste it into the field above</li>
                        </ol>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Documentation
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset All
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
