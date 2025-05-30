"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, GitBranch, Edit, Trash2, GitCompare } from "lucide-react"
import type { Prompt } from "@/types/prompt"

interface PromptVersionHistoryProps {
  prompt: Prompt
  onShowDiff: (prompt: Prompt, fromVersion: string, toVersion: string) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (promptId: string) => void
}

export function PromptVersionHistory({ prompt, onShowDiff, onEdit, onDelete }: PromptVersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions((prev) => prev.filter((id) => id !== versionId))
    } else if (selectedVersions.length < 2) {
      setSelectedVersions((prev) => [...prev, versionId])
    } else {
      setSelectedVersions([versionId])
    }
  }

  const handleShowDiff = () => {
    if (selectedVersions.length === 2) {
      const [from, to] = selectedVersions.sort((a, b) => {
        const versionA = prompt.versions.find((v) => v.id === a)
        const versionB = prompt.versions.find((v) => v.id === b)
        return new Date(versionA!.createdAt).getTime() - new Date(versionB!.createdAt).getTime()
      })
      onShowDiff(prompt, from, to)
    }
  }

  const sortedVersions = [...prompt.versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version History
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(prompt)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(prompt.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {selectedVersions.length === 2 && (
          <Button variant="default" size="sm" onClick={handleShowDiff} className="w-full">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Versions
          </Button>
        )}
      </CardHeader>

      <CardContent className="h-[calc(100%-8rem)] overflow-auto">
        <ScrollArea className="h-full">
          <div className="space-y-3">
            {sortedVersions.map((version, index) => (
              <Card
                key={version.id}
                className={`cursor-pointer transition-all ${
                  selectedVersions.includes(version.id) ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => handleVersionSelect(version.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={version.isActive ? "default" : "secondary"}>v{version.version}</Badge>
                      {version.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedVersions.includes(version.id)}
                      onChange={() => handleVersionSelect(version.id)}
                      className="rounded"
                    />
                  </div>

                  {version.description && <p className="text-sm font-medium mb-2">{version.description}</p>}

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {version.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {version.createdAt.toLocaleDateString()} {version.createdAt.toLocaleTimeString()}
                    </div>
                  </div>

                  {version.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {version.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                    {version.content.length > 100 ? `${version.content.substring(0, 100)}...` : version.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
