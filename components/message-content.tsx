"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Code, Braces } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/contexts/theme-context"

interface MessageContentProps {
  content: string
  messageId?: string
}

interface CodeBlock {
  language: string
  code: string
}

interface JsonData {
  data: any
  isValid: boolean
}

export function MessageContent({ content, messageId }: MessageContentProps) {
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null)
  const [contentType, setContentType] = useState<"text" | "markdown" | "json" | "mixed">("text")
  const [parsedContent, setParsedContent] = useState<{
    text?: string
    codeBlocks?: CodeBlock[]
    jsonData?: JsonData
    markdownSections?: string[]
  }>({})

  // 테마 변경 감지 및 초기화
  useEffect(() => {
    setIsDarkMode(theme === "dark")
  }, [theme])

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

    // Check for markdown patterns (more comprehensive)
    const markdownPatterns = [
      /^#{1,6}\s+.+$/m, // Headers
      /\*\*.*?\*\*/g, // Bold
      /\*.*?\*/g, // Italic
      /\[.*?\]$$.*?$$/g, // Links
      /^[-*+]\s+.+$/m, // Lists
      /^\d+\.\s+.+$/m, // Numbered lists
      /^>\s+.+$/m, // Blockquotes
      /`[^`]+`/g, // Inline code
      /^\|.*\|$/m, // Tables
      /^- \[[ x]\]/m, // Checkboxes
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

  const renderJson = (data: any, depth = 0) => {
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
        <div className="p-0">
          <SyntaxHighlighter
            language={codeBlock.language}
            style={isDarkMode ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.875rem",
            }}
            wrapLongLines
          >
            {codeBlock.code}
          </SyntaxHighlighter>
        </div>
      </Card>
    )
  }

  // Custom components for ReactMarkdown
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "")
      const language = match ? match[1] : ""

      if (!inline && language) {
        const codeString = String(children).replace(/\n$/, "")
        const blockId = `markdown-code-${Math.random()}`

        return (
          <Card className="my-3 overflow-hidden border border-muted">
            <div className="flex items-center justify-between px-3 py-2 bg-muted border-b">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <Badge variant="secondary" className="text-xs">
                  {language}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(codeString, blockId)}
              >
                {copiedBlock === blockId ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <div className="p-0">
              <SyntaxHighlighter
                language={language}
                style={isDarkMode ? oneDark : oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: "0.875rem",
                }}
                wrapLongLines
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </Card>
        )
      }

      return (
        <code
          className={`px-1.5 py-0.5 rounded text-sm font-mono ${
            isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"
          }`}
          {...props}
        >
          {children}
        </code>
      )
    },
    h1: ({ children }: any) => (
      <h1
        className={`text-2xl font-bold mt-6 mb-4 pb-2 border-b ${
          isDarkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"
        }`}
      >
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2
        className={`text-xl font-semibold mt-5 mb-3 pb-2 border-b ${
          isDarkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"
        }`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className={`text-lg font-semibold mt-4 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className={`text-base font-semibold mt-3 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{children}</h4>
    ),
    h5: ({ children }: any) => (
      <h5 className={`text-sm font-semibold mt-3 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{children}</h5>
    ),
    h6: ({ children }: any) => (
      <h6 className={`text-xs font-semibold mt-3 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{children}</h6>
    ),
    p: ({ children }: any) => (
      <p className={`mb-3 leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{children}</p>
    ),
    ul: ({ children }: any) => <ul className="mb-3 ml-4 space-y-1 list-disc">{children}</ul>,
    ol: ({ children }: any) => <ol className="mb-3 ml-4 space-y-1 list-decimal">{children}</ol>,
    li: ({ children }: any) => (
      <li className={`leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote
        className={`border-l-4 pl-4 italic my-3 ${
          isDarkMode ? "border-gray-600 bg-gray-800 text-gray-300" : "border-gray-300 bg-gray-50 text-gray-600"
        } py-2 rounded-r`}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        className={`hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-3">
        <table className={`min-w-full border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>{children}</thead>,
    th: ({ children }: any) => (
      <th
        className={`border px-3 py-2 text-left font-semibold ${
          isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-700"
        }`}
      >
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td
        className={`border px-3 py-2 ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"}`}
      >
        {children}
      </td>
    ),
    strong: ({ children }: any) => (
      <strong className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className={`italic ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{children}</em>
    ),
    hr: () => <hr className={`my-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`} />,
    input: ({ type, checked, ...props }: any) => {
      if (type === "checkbox") {
        return <input type="checkbox" checked={checked} readOnly className="mr-2" {...props} />
      }
      return <input type={type} {...props} />
    },
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
    case "mixed":
      return (
        <div className="relative">
          <div className={`prose prose-sm max-w-none ${isDarkMode ? "prose-invert" : ""}`}>
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {parsedContent.text || content}
            </ReactMarkdown>
          </div>
        </div>
      )

    default:
      return (
        <div
          className={`whitespace-pre-wrap break-words leading-relaxed ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {content}
        </div>
      )
  }
}
