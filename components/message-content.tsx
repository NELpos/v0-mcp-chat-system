"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Code, Braces } from "lucide-react"

interface MessageContentProps {
  content: string
}

interface CodeBlock {
  language: string
  code: string
}

interface JsonData {
  data: any
  isValid: boolean
}

export function MessageContent({ content }: MessageContentProps) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null)
  const [contentType, setContentType] = useState<"text" | "markdown" | "json" | "mixed">("text")
  const [parsedContent, setParsedContent] = useState<{
    text?: string
    codeBlocks?: CodeBlock[]
    jsonData?: JsonData
    markdownSections?: string[]
  }>({})

  useEffect(() => {
    analyzeContent(content)
  }, [content])

  const analyzeContent = (text: string) => {
    // Check if content is JSON
    if (isJsonString(text)) {
      try {
        const parsed = JSON.parse(text)
        setParsedContent({ jsonData: { data: parsed, isValid: true } })
        setContentType("json")
        return
      } catch (e) {
        // Not valid JSON
      }
    }

    // Check for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const codeBlocks: CodeBlock[] = []
    let match
    let hasCodeBlocks = false

    while ((match = codeBlockRegex.exec(text)) !== null) {
      hasCodeBlocks = true
      codeBlocks.push({
        language: match[1] || "text",
        code: match[2].trim(),
      })
    }

    // Check for markdown patterns
    const markdownPatterns = [
      /^#{1,6}\s+.+$/m, // Headers
      /\*\*.*?\*\*/g, // Bold
      /\*.*?\*/g, // Italic
      /\[.*?\]$$.*?$$/g, // Links
      /^[-*+]\s+.+$/m, // Lists
      /^\d+\.\s+.+$/m, // Numbered lists
      /^>\s+.+$/m, // Blockquotes
    ]

    const hasMarkdown = markdownPatterns.some((pattern) => pattern.test(text))

    if (hasCodeBlocks || hasMarkdown) {
      setParsedContent({
        text,
        codeBlocks: hasCodeBlocks ? codeBlocks : undefined,
        markdownSections: hasMarkdown ? [text] : undefined,
      })
      setContentType(hasCodeBlocks && hasMarkdown ? "mixed" : hasCodeBlocks ? "markdown" : "markdown")
    } else {
      setParsedContent({ text })
      setContentType("text")
    }
  }

  const isJsonString = (str: string): boolean => {
    try {
      const trimmed = str.trim()
      return (trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))
    } catch {
      return false
    }
  }

  const copyToClipboard = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedBlock(blockId)
      setTimeout(() => setCopiedBlock(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    const html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // Lists
      .replace(/^[-*+]\s+(.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4">$1</li>')
      // Blockquotes
      .replace(
        /^>\s+(.+)$/gm,
        '<blockquote class="border-l-4 border-muted pl-4 italic text-muted-foreground">$1</blockquote>',
      )
      // Line breaks
      .replace(/\n/g, "<br>")

    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm max-w-none" />
  }

  const renderJson = (data: any, depth = 0) => {
    const indent = "  ".repeat(depth)

    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <div>
            <span className="text-muted-foreground">[</span>
            {data.map((item, index) => (
              <div key={index} className="ml-4">
                {renderJson(item, depth + 1)}
                {index < data.length - 1 && <span className="text-muted-foreground">,</span>}
              </div>
            ))}
            <span className="text-muted-foreground">]</span>
          </div>
        )
      } else {
        return (
          <div>
            <span className="text-muted-foreground">{"{"}</span>
            {Object.entries(data).map(([key, value], index, arr) => (
              <div key={key} className="ml-4">
                <span className="text-blue-600">"{key}"</span>
                <span className="text-muted-foreground">: </span>
                {renderJson(value, depth + 1)}
                {index < arr.length - 1 && <span className="text-muted-foreground">,</span>}
              </div>
            ))}
            <span className="text-muted-foreground">{"}"}</span>
          </div>
        )
      }
    } else if (typeof data === "string") {
      return <span className="text-green-600">"{data}"</span>
    } else if (typeof data === "number") {
      return <span className="text-orange-600">{data}</span>
    } else if (typeof data === "boolean") {
      return <span className="text-purple-600">{data.toString()}</span>
    } else if (data === null) {
      return <span className="text-gray-500">null</span>
    } else {
      return <span>{String(data)}</span>
    }
  }

  const renderCodeBlock = (codeBlock: CodeBlock, index: number) => {
    const blockId = `code-${index}`

    return (
      <Card key={index} className="my-3 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-muted border-b">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <Badge variant="secondary" className="text-xs">
              {codeBlock.language}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(codeBlock.code, blockId)}
          >
            {copiedBlock === blockId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <div className="p-3">
          <pre className="text-sm overflow-x-auto">
            <code className="font-mono">{codeBlock.code}</code>
          </pre>
        </div>
      </Card>
    )
  }

  // Render based on content type
  switch (contentType) {
    case "json":
      return (
        <Card className="my-2 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted border-b">
            <div className="flex items-center gap-2">
              <Braces className="h-4 w-4" />
              <Badge variant="secondary" className="text-xs">
                JSON
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(content, "json-content")}
            >
              {copiedBlock === "json-content" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="p-3 font-mono text-sm overflow-x-auto">
            {parsedContent.jsonData && renderJson(parsedContent.jsonData.data)}
          </div>
        </Card>
      )

    case "markdown":
      return (
        <div className="space-y-2">
          {parsedContent.codeBlocks && parsedContent.codeBlocks.map((block, index) => renderCodeBlock(block, index))}
          {parsedContent.markdownSections && (
            <div className="prose prose-sm max-w-none">{renderMarkdown(parsedContent.text || "")}</div>
          )}
        </div>
      )

    case "mixed":
      return (
        <div className="space-y-2">
          {renderMarkdown(parsedContent.text || "")}
          {parsedContent.codeBlocks && parsedContent.codeBlocks.map((block, index) => renderCodeBlock(block, index))}
        </div>
      )

    default:
      return <div className="whitespace-pre-wrap break-words leading-relaxed">{content}</div>
  }
}
