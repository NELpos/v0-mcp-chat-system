"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  FileText,
  Code2,
  Braces,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { useDocument } from "@/contexts/document-context"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/contexts/theme-context"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import type { DocumentContent as DocumentContentType } from "@/types/document" // Import DocumentContent type

export function DocumentBlock() {
  const { isOpen, documents, activeDocumentId, closeDocument, setActiveDocument, removeDocument } = useDocument()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMaximized, setIsMaximized] = useState(false)

  const activeDocument = documents.find((doc) => doc.id === activeDocumentId)
  const currentIndex = documents.findIndex((doc) => doc.id === activeDocumentId)

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleDownload = (document: DocumentContentType) => {
    const blob = new Blob([document.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title}.${getFileExtension(document.type, document.language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (type: string, language?: string) => {
    switch (type) {
      case "code":
        return language || "txt"
      case "json":
        return "json"
      case "markdown":
        return "md"
      default:
        return "txt"
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code2 className="h-4 w-4" />
      case "json":
        return <Braces className="h-4 w-4" />
      case "markdown":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const navigateDocument = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setActiveDocument(documents[currentIndex - 1].id)
    } else if (direction === "next" && currentIndex < documents.length - 1) {
      setActiveDocument(documents[currentIndex + 1].id)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "border-l bg-background transition-all duration-300",
        isMaximized ? "w-full" : "w-1/2 min-w-[400px]",
      )}
    >
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Document Viewer</h3>
              {documents.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {documents.length} document{documents.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMaximized(!isMaximized)} className="h-8 w-8 p-0">
                {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={closeDocument} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Navigation */}
          {documents.length > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDocument("prev")}
                  disabled={currentIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {documents.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDocument("next")}
                  disabled={currentIndex === documents.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Document Tabs */}
          {documents.length > 1 && (
            <Tabs value={activeDocumentId || undefined} onValueChange={setActiveDocument}>
              <TabsList className="w-full justify-start overflow-x-auto">
                {documents.map((doc) => (
                  <TabsTrigger key={doc.id} value={doc.id} className="flex items-center gap-2 text-xs">
                    {getDocumentIcon(doc.type)}
                    <span className="truncate max-w-[100px]">{doc.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeDocument(doc.id)
                      }}
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </CardHeader>

        <CardContent className="p-0 h-[calc(100%-120px)]">
          {activeDocument ? (
            <div className="h-full flex flex-col">
              {/* Document Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  {getDocumentIcon(activeDocument.type)}
                  <div>
                    <h4 className="font-medium">{activeDocument.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {activeDocument.type.toUpperCase()}
                      {activeDocument.language && ` • ${activeDocument.language}`}
                      {" • "}
                      {activeDocument.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(activeDocument.content, activeDocument.id)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedId === activeDocument.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(activeDocument)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Document Content */}
              <ScrollArea className="flex-1 p-4">{renderDocumentContent(activeDocument, isDark)}</ScrollArea>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium text-muted-foreground">No document selected</p>
                  <p className="text-sm text-muted-foreground">
                    Click on a document expand button in the chat to view it here
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function renderDocumentContent(document: DocumentContentType, isDark: boolean) {
  switch (document.type) {
    case "code":
      return (
        <SyntaxHighlighter
          language={document.language || "text"}
          style={isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            backgroundColor: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          showLineNumbers
          wrapLines
          wrapLongLines
        >
          {document.content}
        </SyntaxHighlighter>
      )

    case "json":
      const formattedJson = (() => {
        try {
          return JSON.stringify(JSON.parse(document.content), null, 2)
        } catch {
          return document.content
        }
      })()

      return (
        <SyntaxHighlighter
          language="json"
          style={isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            backgroundColor: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          showLineNumbers
          wrapLines
          wrapLongLines
        >
          {formattedJson}
        </SyntaxHighlighter>
      )

    case "markdown":
      return (
        <div className={cn("prose prose-sm max-w-none", isDark ? "prose-invert" : "")}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{document.content}</ReactMarkdown>
        </div>
      )

    default:
      return <pre className="whitespace-pre-wrap text-sm font-mono">{document.content}</pre>
  }
}
