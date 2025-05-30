"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, GitCompare, Copy } from "lucide-react"
import type { Prompt, PromptDiff } from "@/types/prompt"
import { toast } from "@/components/ui/use-toast"

interface PromptDiffViewerProps {
  prompt: Prompt
  fromVersion: string
  toVersion: string
  onBack: () => void
}

export function PromptDiffViewer({ prompt, fromVersion, toVersion, onBack }: PromptDiffViewerProps) {
  const fromVersionData = prompt.versions.find((v) => v.id === fromVersion)
  const toVersionData = prompt.versions.find((v) => v.id === toVersion)

  const diffData = useMemo(() => {
    if (!fromVersionData || !toVersionData) return []

    const fromLines = fromVersionData.content.split("\n")
    const toLines = toVersionData.content.split("\n")
    const diffs: PromptDiff[] = []

    // Simple diff algorithm
    const maxLines = Math.max(fromLines.length, toLines.length)

    for (let i = 0; i < maxLines; i++) {
      const fromLine = fromLines[i] || ""
      const toLin = toLines[i] || ""

      if (fromLine === toLin) {
        diffs.push({
          type: "unchanged",
          content: fromLine,
          lineNumber: i + 1,
        })
      } else {
        if (fromLine && !toLin) {
          diffs.push({
            type: "removed",
            content: fromLine,
            lineNumber: i + 1,
          })
        } else if (!fromLine && toLin) {
          diffs.push({
            type: "added",
            content: toLin,
            lineNumber: i + 1,
          })
        } else {
          diffs.push({
            type: "removed",
            content: fromLine,
            lineNumber: i + 1,
          })
          diffs.push({
            type: "added",
            content: toLin,
            lineNumber: i + 1,
          })
        }
      }
    }

    return diffs
  }, [fromVersionData, toVersionData])

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  if (!fromVersionData || !toVersionData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Version data not found</p>
        </CardContent>
      </Card>
    )
  }

  const addedLines = diffData.filter((d) => d.type === "added").length
  const removedLines = diffData.filter((d) => d.type === "removed").length
  const unchangedLines = diffData.filter((d) => d.type === "unchanged").length

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <GitCompare className="h-5 w-5" />
            Diff Viewer: {prompt.name}
          </CardTitle>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">From: v{fromVersionData.version}</Badge>
            <Badge variant="outline">To: v{toVersionData.version}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Badge variant="destructive" className="text-xs">
              -{removedLines}
            </Badge>
            <Badge variant="default" className="text-xs bg-green-500">
              +{addedLines}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {unchangedLines} unchanged
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[calc(100%-8rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Side by Side View */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v{fromVersionData.version}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {fromVersionData.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(fromVersionData.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <ScrollArea className="h-full">
                <pre className="text-sm font-mono whitespace-pre-wrap p-2 bg-muted rounded">
                  {fromVersionData.content}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v{toVersionData.version}</Badge>
                  <span className="text-sm text-muted-foreground">{toVersionData.createdAt.toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(toVersionData.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <ScrollArea className="h-full">
                <pre className="text-sm font-mono whitespace-pre-wrap p-2 bg-muted rounded">
                  {toVersionData.content}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Unified Diff View */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unified Diff</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ScrollArea className="h-full">
              <div className="font-mono text-sm">
                {diffData.map((diff, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 ${
                      diff.type === "added"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        : diff.type === "removed"
                          ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                          : "bg-background"
                    }`}
                  >
                    <span className="inline-block w-8 text-muted-foreground text-xs">{diff.lineNumber}</span>
                    <span className="inline-block w-4">
                      {diff.type === "added" ? "+" : diff.type === "removed" ? "-" : " "}
                    </span>
                    <span className="whitespace-pre-wrap">{diff.content}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
