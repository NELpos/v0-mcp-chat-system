"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import type { Prompt, PromptVersion } from "@/types/prompt"

interface PromptEditorProps {
  prompt?: Prompt | null
  onSave: (promptData: any) => void
  onCancel: () => void
}

export function PromptEditor({ prompt, onSave, onCancel }: PromptEditorProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    content: "",
    versionDescription: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (prompt) {
      const activeVersion = prompt.versions.find((v) => v.isActive) || prompt.versions[prompt.versions.length - 1]
      setFormData({
        name: prompt.name,
        description: prompt.description,
        category: prompt.category,
        content: activeVersion?.content || "",
        versionDescription: "",
        tags: activeVersion?.tags || [],
      })
    }
  }, [prompt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newVersion: PromptVersion = {
      id: `v${Date.now()}`,
      version: prompt ? getNextVersion(prompt.versions) : "1.0.0",
      content: formData.content,
      description: formData.versionDescription || "Updated prompt",
      createdAt: new Date(),
      createdBy: "current.user",
      tags: formData.tags,
      isActive: true,
    }

    const promptData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      versions: prompt ? [...prompt.versions.map((v) => ({ ...v, isActive: false })), newVersion] : [newVersion],
    }

    onSave(promptData)
  }

  const getNextVersion = (versions: PromptVersion[]): string => {
    const latestVersion = versions[versions.length - 1]?.version || "1.0.0"
    const [major, minor, patch] = latestVersion.split(".").map(Number)
    return `${major}.${minor}.${patch + 1}`
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {prompt ? "Edit Prompt" : "Create New Prompt"}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[calc(100%-5rem)] overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Prompt Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter prompt name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Customer Service, Development"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this prompt is used for"
              rows={2}
              required
            />
          </div>

          {/* Prompt Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your prompt content here..."
              rows={12}
              className="font-mono"
              required
            />
          </div>

          {/* Version Description */}
          <div className="space-y-2">
            <Label htmlFor="versionDescription">Version Description</Label>
            <Input
              id="versionDescription"
              value={formData.versionDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, versionDescription: e.target.value }))}
              placeholder="Describe what changed in this version"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
