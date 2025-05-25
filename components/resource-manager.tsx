"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Link, FileText, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Resource {
  id: string
  type: "file" | "url"
  name: string
  url?: string
  size?: string
  status: "processing" | "completed" | "error"
  createdAt: Date
}

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      type: "file",
      name: "project-documentation.pdf",
      size: "2.4 MB",
      status: "completed",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      type: "url",
      name: "Confluence - API Documentation",
      url: "https://company.atlassian.net/wiki/spaces/API/overview",
      status: "processing",
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "3",
      type: "file",
      name: "user-manual.docx",
      size: "1.8 MB",
      status: "completed",
      createdAt: new Date("2024-01-14"),
    },
    {
      id: "4",
      type: "url",
      name: "Jira - Project Issues",
      url: "https://company.atlassian.net/browse/PROJ",
      status: "completed",
      createdAt: new Date("2024-01-13"),
    },
  ])
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      const newResource: Resource = {
        id: Math.random().toString(36).substring(7),
        type: "file",
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: "processing",
        createdAt: new Date(),
      }

      setResources((prev) => [newResource, ...prev])

      // Simulate processing
      setTimeout(() => {
        setResources((prev) => prev.map((r) => (r.id === newResource.id ? { ...r, status: "completed" as const } : r)))
      }, 3000)
    }

    setIsUploading(false)
    toast({
      title: "Files uploaded",
      description: "Your files are being processed and will be available shortly.",
    })
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return

    const newResource: Resource = {
      id: Math.random().toString(36).substring(7),
      type: "url",
      name: `URL - ${new URL(urlInput).hostname}`,
      url: urlInput,
      status: "processing",
      createdAt: new Date(),
    }

    setResources((prev) => [newResource, ...prev])
    setUrlInput("")

    // Simulate processing
    setTimeout(() => {
      setResources((prev) => prev.map((r) => (r.id === newResource.id ? { ...r, status: "completed" as const } : r)))
    }, 5000)

    toast({
      title: "URL added",
      description: "The URL content is being processed and will be available shortly.",
    })
  }

  const handleDelete = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
    toast({
      title: "Resource deleted",
      description: "The resource has been removed from your knowledge base.",
    })
  }

  const getStatusColor = (status: Resource["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Left Column - Upload/Add Resources */}
      <div className="space-y-4">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="url">Add URLs</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Upload Documents</CardTitle>
                <CardDescription className="text-xs">
                  Upload PDF, DOCX, TXT files to your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 mb-2 text-gray-500 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 mb-2 text-gray-500" />
                      )}
                      <p className="mb-1 text-xs text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 10MB)</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Add URLs</CardTitle>
                <CardDescription className="text-xs">
                  Add Wiki, Jira, or other web pages to your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="url-input" className="text-xs">
                    URL
                  </Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/page"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleUrlAdd} className="w-full" size="sm">
                  <Link className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column - Resources List */}
      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Resources ({resources.length})</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-3rem)]">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {resource.type === "file" ? (
                        <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{resource.name}</p>
                        {resource.size && <p className="text-xs text-gray-500">{resource.size}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(resource.status)} text-white`}>
                        {resource.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resource.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
