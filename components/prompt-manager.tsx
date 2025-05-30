"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptEditor } from "@/components/prompt-editor"
import { PromptDiffViewer } from "@/components/prompt-diff-viewer"
import { PromptVersionHistory } from "@/components/prompt-version-history"
import { Plus, Search, FileText, Clock, Tag, User, GitBranch } from "lucide-react"
import type { Prompt } from "@/types/prompt"
import { toast } from "@/components/ui/use-toast"

// Mock data
const mockPrompts: Prompt[] = [
  {
    id: "1",
    name: "Customer Support Assistant",
    description: "AI assistant for handling customer inquiries",
    category: "Customer Service",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    createdBy: "john.doe",
    versions: [
      {
        id: "v1",
        version: "1.0.0",
        content: "You are a helpful customer support assistant. Always be polite and professional.",
        description: "Initial version",
        createdAt: new Date("2024-01-15"),
        createdBy: "john.doe",
        tags: ["customer-service", "polite"],
        isActive: false,
      },
      {
        id: "v2",
        version: "1.1.0",
        content:
          "You are a helpful customer support assistant. Always be polite, professional, and empathetic. Provide clear solutions and escalate when necessary.",
        description: "Added empathy and escalation guidelines",
        createdAt: new Date("2024-01-18"),
        createdBy: "jane.smith",
        tags: ["customer-service", "polite", "empathetic"],
        isActive: false,
      },
      {
        id: "v3",
        version: "1.2.0",
        content:
          "You are a helpful customer support assistant. Always be polite, professional, and empathetic. Provide clear solutions and escalate when necessary.\n\nGuidelines:\n- Listen actively to customer concerns\n- Offer specific solutions\n- Follow up to ensure satisfaction\n- Escalate complex issues to human agents",
        description: "Added detailed guidelines and structure",
        createdAt: new Date("2024-01-20"),
        createdBy: "john.doe",
        tags: ["customer-service", "polite", "empathetic", "guidelines"],
        isActive: true,
      },
    ],
  },
  {
    id: "2",
    name: "Code Review Assistant",
    description: "AI assistant for reviewing code and providing feedback",
    category: "Development",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-22"),
    createdBy: "dev.team",
    versions: [
      {
        id: "v1",
        version: "1.0.0",
        content: "You are a code review assistant. Review code for bugs, performance issues, and best practices.",
        description: "Initial code review prompt",
        createdAt: new Date("2024-01-10"),
        createdBy: "dev.team",
        tags: ["code-review", "development"],
        isActive: false,
      },
      {
        id: "v2",
        version: "2.0.0",
        content:
          "You are an expert code review assistant. Review code for:\n- Bugs and logical errors\n- Performance optimizations\n- Security vulnerabilities\n- Code style and best practices\n- Documentation quality\n\nProvide constructive feedback with specific suggestions for improvement.",
        description: "Enhanced with security and documentation checks",
        createdAt: new Date("2024-01-22"),
        createdBy: "security.team",
        tags: ["code-review", "development", "security", "documentation"],
        isActive: true,
      },
    ],
  },
]

export function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [selectedVersions, setSelectedVersions] = useState<{ from: string; to: string }>({ from: "", to: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showEditor, setShowEditor] = useState(false)
  const [showDiff, setShowDiff] = useState(false)

  const categories = ["all", ...Array.from(new Set(prompts.map((p) => p.category)))]

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreatePrompt = () => {
    setSelectedPrompt(null)
    setShowEditor(true)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setShowEditor(true)
  }

  const handleSavePrompt = (promptData: any) => {
    if (selectedPrompt) {
      // Update existing prompt
      setPrompts((prev) =>
        prev.map((p) => (p.id === selectedPrompt.id ? { ...p, ...promptData, updatedAt: new Date() } : p)),
      )
      toast({
        title: "Prompt updated",
        description: "The prompt has been successfully updated.",
      })
    } else {
      // Create new prompt
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        ...promptData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current.user",
      }
      setPrompts((prev) => [...prev, newPrompt])
      toast({
        title: "Prompt created",
        description: "A new prompt has been successfully created.",
      })
    }
    setShowEditor(false)
  }

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId))
    toast({
      title: "Prompt deleted",
      description: "The prompt has been successfully deleted.",
    })
  }

  const handleShowDiff = (prompt: Prompt, fromVersion: string, toVersion: string) => {
    setSelectedPrompt(prompt)
    setSelectedVersions({ from: fromVersion, to: toVersion })
    setShowDiff(true)
  }

  if (showEditor) {
    return <PromptEditor prompt={selectedPrompt} onSave={handleSavePrompt} onCancel={() => setShowEditor(false)} />
  }

  if (showDiff && selectedPrompt) {
    return (
      <PromptDiffViewer
        prompt={selectedPrompt}
        fromVersion={selectedVersions.from}
        toVersion={selectedVersions.to}
        onBack={() => setShowDiff(false)}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Prompt List */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prompts ({filteredPrompts.length})
              </CardTitle>
              <Button onClick={handleCreatePrompt}>
                <Plus className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="h-[calc(100%-8rem)] overflow-auto">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {filteredPrompts.map((prompt) => {
                  const activeVersion = prompt.versions.find((v) => v.isActive)
                  const versionCount = prompt.versions.length

                  return (
                    <Card key={prompt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{prompt.name}</h3>
                              <Badge variant="outline">{prompt.category}</Badge>
                              <Badge variant="secondary" className="text-xs">
                                <GitBranch className="h-3 w-3 mr-1" />
                                {versionCount} version{versionCount !== 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{prompt.description}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {prompt.createdBy}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {prompt.updatedAt.toLocaleDateString()}
                              </div>
                              {activeVersion && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />v{activeVersion.version}
                                </div>
                              )}
                            </div>

                            {activeVersion && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {activeVersion.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedPrompt(prompt)}>
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditPrompt(prompt)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Version History Panel */}
      <div className="lg:col-span-1">
        {selectedPrompt ? (
          <PromptVersionHistory
            prompt={selectedPrompt}
            onShowDiff={handleShowDiff}
            onEdit={handleEditPrompt}
            onDelete={handleDeletePrompt}
          />
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a prompt to view its version history</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
