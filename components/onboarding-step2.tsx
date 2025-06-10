"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "@/components/ui/use-toast"
import { Settings, CheckCircle, AlertCircle, ExternalLink, Building2, Github, Shield } from "lucide-react"

export function OnboardingStep2() {
  const { toolTokens, updateToken, isLoaded } = useSettings()
  const [localTokens, setLocalTokens] = useState({
    jira: "",
    atlassian: "",
    github: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Update local tokens when context tokens change
  useEffect(() => {
    if (isLoaded) {
      setLocalTokens({
        jira: toolTokens.jira || "",
        atlassian: toolTokens.atlassian || "",
        github: toolTokens.github || "",
      })
    }
  }, [toolTokens, isLoaded])

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
      title: "Settings saved successfully! 🎉",
      description: "Your API tokens have been configured.",
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
      description: "Manage issues and projects",
      icon: Building2,
      color: "bg-blue-500",
      docsUrl: "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/",
    },
    {
      id: "atlassian",
      name: "Atlassian",
      description: "Access Confluence and other tools",
      icon: Building2,
      color: "bg-indigo-500",
      docsUrl: "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Repository and code management",
      icon: Github,
      color: "bg-gray-800",
      docsUrl:
        "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token",
    },
  ]

  const hasAnyToken = Object.values(localTokens).some((token) => token.length > 0)
  const allTokensValid = Object.values(localTokens).every((token) => !token || token.length >= 10)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Step 2: Configure Your Service Tokens</CardTitle>
        </div>
        <CardDescription>
          Set up API tokens for the services you want to use. You can configure any or all of them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Token Inputs */}
        <div className="grid gap-6">
          {toolConfigs.map((tool) => {
            const tokenStatus = getTokenStatus(localTokens[tool.id as keyof typeof localTokens])
            const StatusIcon = tokenStatus.icon

            return (
              <div key={tool.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${tool.color} text-white`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <Label htmlFor={`${tool.id}-token`} className="font-medium">
                      {tool.name} API Token
                    </Label>
                    <Badge variant="outline" className={`text-xs ${tokenStatus.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {tokenStatus.status === "valid"
                        ? "Valid"
                        : tokenStatus.status === "invalid"
                          ? "Invalid"
                          : "Optional"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Guide
                    </a>
                  </Button>
                </div>
                <Input
                  id={`${tool.id}-token`}
                  type="password"
                  placeholder={`Enter your ${tool.name} API token (optional)`}
                  value={localTokens[tool.id as keyof typeof localTokens]}
                  onChange={(e) =>
                    setLocalTokens({
                      ...localTokens,
                      [tool.id]: e.target.value,
                    })
                  }
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            )
          })}
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Your API tokens are stored securely in your browser and are never sent to our servers.
          </AlertDescription>
        </Alert>

        {/* Status and Action */}
        <div className="space-y-4">
          {hasAnyToken && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Great Progress! 🎉</h4>
              <p className="text-sm text-green-700">
                You've configured {Object.values(localTokens).filter((token) => token.length > 0).length} service
                token(s). You can always add more later in the Settings page.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving || !hasAnyToken || !allTokensValid} className="flex-1">
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
            {!hasAnyToken && (
              <Button variant="outline" onClick={handleSave} className="flex-1">
                Skip for Now
              </Button>
            )}
          </div>

          {!hasAnyToken && (
            <p className="text-xs text-center text-muted-foreground">
              You can skip this step and configure tokens later, but you'll have limited functionality.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
