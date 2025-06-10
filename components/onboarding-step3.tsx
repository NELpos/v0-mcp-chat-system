"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface OnboardingStep3Props {
  onFinish: () => void
}

export function OnboardingStep3({ onFinish }: OnboardingStep3Props) {
  const { toolTokens } = useSettings()

  const configuredTools = Object.entries(toolTokens).filter(([_, token]) => token && token.length > 0)
  const toolNames = {
    jira: "Jira",
    atlassian: "Atlassian",
    github: "GitHub",
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-green-600">
          <Sparkles className="h-5 w-5" />
          Setup Complete!
        </CardTitle>
        <CardDescription>Congratulations! You're all set up and ready to start using MCP Chat.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-3">Your Configuration Summary:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700">API Key generated and ready</span>
            </div>
            {configuredTools.length > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">{configuredTools.length} service token(s) configured:</span>
                <div className="flex gap-1 ml-1">
                  {configuredTools.map(([tool, _]) => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      {toolNames[tool as keyof typeof toolNames]}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Ready to configure service tokens when needed</span>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3">What you can do now:</h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Start chatting with AI using your configured tools</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Access Jira, Atlassian, and GitHub through natural language</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Add more service tokens anytime in Settings</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button size="lg" onClick={onFinish} className="w-full sm:w-auto">
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Using MCP Chat
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can always return to Settings to modify your configuration later.
        </p>
      </CardContent>
    </Card>
  )
}
