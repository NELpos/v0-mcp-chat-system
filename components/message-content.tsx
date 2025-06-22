"use client"

import { memo, useMemo, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Code2, Braces, ChevronDown, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import "katex/dist/katex.min.css"

interface MessageContentProps {
  content: string
  messageId?: string
  isStreaming?: boolean
}

interface ContentBlock {
  type: "text" | "code" | "json" | "math" | "table" | "list"
  content: string
  language?: string
  metadata?: Record<string, any>
}

// Memoized component for performance optimization
const MessageContent = memo(({ content, messageId, isStreaming = false }: MessageContentProps) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set())

  // Parse content into structured blocks
  const contentBlocks = useMemo(() => {
    return parseContent(content)
  }, [content])

  // Copy to clipboard handler
  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(id))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }, [])

  // Toggle block collapse
  const toggleCollapse = useCallback((blockId: string) => {
    setCollapsedBlocks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(blockId)) {
        newSet.delete(blockId)
      } else {
        newSet.add(blockId)
      }
      return newSet
    })
  }, [])

  // Render streaming indicator
  const StreamingIndicator = memo(() => (
    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
      </div>
      <span className="text-sm">AI is thinking...</span>
    </div>
  ))

  return (
    <div className="space-y-3">
      {contentBlocks.map((block, index) => (
        <ContentBlockRenderer
          key={`${messageId}-${index}`}
          block={block}
          blockId={`${messageId}-${index}`}
          isDark={isDark}
          onCopy={handleCopy}
          onToggleCollapse={toggleCollapse}
          isCopied={copiedItems.has(`${messageId}-${index}`)}
          isCollapsed={collapsedBlocks.has(`${messageId}-${index}`)}
        />
      ))}
      {isStreaming && <StreamingIndicator />}
    </div>
  )
})

// Content block renderer component
const ContentBlockRenderer = memo(
  ({
    block,
    blockId,
    isDark,
    onCopy,
    onToggleCollapse,
    isCopied,
    isCollapsed,
  }: {
    block: ContentBlock
    blockId: string
    isDark: boolean
    onCopy: (text: string, id: string) => void
    onToggleCollapse: (blockId: string) => void
    isCopied: boolean
    isCollapsed: boolean
  }) => {
    switch (block.type) {
      case "code":
        return (
          <CodeBlock
            code={block.content}
            language={block.language || "text"}
            blockId={blockId}
            isDark={isDark}
            onCopy={onCopy}
            onToggleCollapse={onToggleCollapse}
            isCopied={isCopied}
            isCollapsed={isCollapsed}
          />
        )

      case "json":
        return (
          <JsonBlock
            json={block.content}
            blockId={blockId}
            isDark={isDark}
            onCopy={onCopy}
            onToggleCollapse={onToggleCollapse}
            isCopied={isCopied}
            isCollapsed={isCollapsed}
          />
        )

      case "text":
      default:
        return <MarkdownBlock content={block.content} isDark={isDark} />
    }
  },
)

// Code block component
const CodeBlock = memo(
  ({
    code,
    language,
    blockId,
    isDark,
    onCopy,
    onToggleCollapse,
    isCopied,
    isCollapsed,
  }: {
    code: string
    language: string
    blockId: string
    isDark: boolean
    onCopy: (text: string, id: string) => void
    onToggleCollapse: (blockId: string) => void
    isCopied: boolean
    isCollapsed: boolean
  }) => {
    const lineCount = code.split("\n").length
    const shouldShowCollapse = lineCount > 20

    return (
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2 border-b",
            isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200",
          )}
        >
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <Badge variant="secondary" className="text-xs font-mono">
              {language}
            </Badge>
            {lineCount > 1 && <span className="text-xs text-muted-foreground">{lineCount} lines</span>}
          </div>

          <div className="flex items-center gap-1">
            {shouldShowCollapse && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onToggleCollapse(blockId)}>
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onCopy(code, blockId)}>
              {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="relative">
            <SyntaxHighlighter
              language={language}
              style={isDark ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                padding: "1rem",
                backgroundColor: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
              showLineNumbers={lineCount > 5}
              wrapLines
              wrapLongLines
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}

        {isCollapsed && (
          <div className="px-4 py-2 text-sm text-muted-foreground">Code block collapsed ({lineCount} lines)</div>
        )}
      </Card>
    )
  },
)

// JSON block component
const JsonBlock = memo(
  ({
    json,
    blockId,
    isDark,
    onCopy,
    onToggleCollapse,
    isCopied,
    isCollapsed,
  }: {
    json: string
    blockId: string
    isDark: boolean
    onCopy: (text: string, id: string) => void
    onToggleCollapse: (blockId: string) => void
    isCopied: boolean
    isCollapsed: boolean
  }) => {
    const parsedJson = useMemo(() => {
      try {
        return JSON.parse(json)
      } catch {
        return null
      }
    }, [json])

    const formattedJson = useMemo(() => {
      return parsedJson ? JSON.stringify(parsedJson, null, 2) : json
    }, [parsedJson, json])

    return (
      <Card className={cn("overflow-hidden", isDark ? "bg-gray-900 border-gray-700" : "bg-blue-50 border-blue-200")}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2 border-b",
            isDark ? "bg-gray-800 border-gray-700" : "bg-blue-100 border-blue-200",
          )}
        >
          <div className="flex items-center gap-2">
            <Braces className="h-4 w-4" />
            <Badge variant="secondary" className="text-xs">
              JSON
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onToggleCollapse(blockId)}>
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onCopy(formattedJson, blockId)}>
              {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            <SyntaxHighlighter
              language="json"
              style={isDark ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                backgroundColor: "transparent",
                fontSize: "0.875rem",
              }}
            >
              {formattedJson}
            </SyntaxHighlighter>
          </div>
        )}
      </Card>
    )
  },
)

// Markdown block component
const MarkdownBlock = memo(({ content, isDark }: { content: string; isDark: boolean }) => {
  const markdownComponents = useMemo(
    () => ({
      // Code blocks
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "")
        const language = match ? match[1] : "text"

        if (!inline) {
          return (
            <div className="my-4">
              <SyntaxHighlighter
                language={language}
                style={isDark ? vscDarkPlus : vs}
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          )
        }

        return (
          <code
            className={cn(
              "px-1.5 py-0.5 rounded text-sm font-mono",
              isDark
                ? "bg-gray-800 text-gray-100 border border-gray-700"
                : "bg-gray-100 text-gray-800 border border-gray-200",
            )}
            {...props}
          >
            {children}
          </code>
        )
      },

      // Headers
      h1: ({ children }: any) => (
        <h1
          className={cn(
            "text-2xl font-bold mt-6 mb-4 pb-2 border-b",
            isDark ? "text-white border-gray-700" : "text-gray-900 border-gray-200",
          )}
        >
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2
          className={cn(
            "text-xl font-semibold mt-5 mb-3 pb-2 border-b",
            isDark ? "text-white border-gray-700" : "text-gray-900 border-gray-200",
          )}
        >
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className={cn("text-lg font-semibold mt-4 mb-2", isDark ? "text-white" : "text-gray-900")}>{children}</h3>
      ),

      // Paragraphs and text
      p: ({ children }: any) => (
        <p className={cn("mb-3 leading-relaxed", isDark ? "text-gray-200" : "text-gray-700")}>{children}</p>
      ),

      // Lists
      ul: ({ children }: any) => (
        <ul className="mb-3 ml-6 space-y-1 list-disc marker:text-muted-foreground">{children}</ul>
      ),
      ol: ({ children }: any) => (
        <ol className="mb-3 ml-6 space-y-1 list-decimal marker:text-muted-foreground">{children}</ol>
      ),
      li: ({ children }: any) => (
        <li className={cn("leading-relaxed", isDark ? "text-gray-200" : "text-gray-700")}>{children}</li>
      ),

      // Blockquotes
      blockquote: ({ children }: any) => (
        <blockquote
          className={cn(
            "border-l-4 pl-4 italic my-4 py-2 rounded-r",
            isDark ? "border-blue-500 bg-blue-950/20 text-blue-200" : "border-blue-500 bg-blue-50 text-blue-800",
          )}
        >
          {children}
        </blockquote>
      ),

      // Links
      a: ({ href, children }: any) => (
        <a
          href={href}
          className={cn(
            "underline underline-offset-2 hover:no-underline transition-colors",
            isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),

      // Tables
      table: ({ children }: any) => (
        <div className="overflow-x-auto my-4">
          <table className={cn("min-w-full border rounded-lg", isDark ? "border-gray-700" : "border-gray-200")}>
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: any) => <thead className={isDark ? "bg-gray-800" : "bg-gray-50"}>{children}</thead>,
      th: ({ children }: any) => (
        <th
          className={cn(
            "border px-3 py-2 text-left font-semibold text-sm",
            isDark ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-700",
          )}
        >
          {children}
        </th>
      ),
      td: ({ children }: any) => (
        <td
          className={cn(
            "border px-3 py-2 text-sm",
            isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700",
          )}
        >
          {children}
        </td>
      ),

      // Emphasis
      strong: ({ children }: any) => (
        <strong className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className={cn("italic", isDark ? "text-gray-200" : "text-gray-700")}>{children}</em>
      ),

      // Horizontal rule
      hr: () => <hr className={cn("my-6 border-t", isDark ? "border-gray-700" : "border-gray-200")} />,

      // Checkboxes
      input: ({ type, checked, ...props }: any) => {
        if (type === "checkbox") {
          return <input type="checkbox" checked={checked} readOnly className="mr-2 accent-blue-500" {...props} />
        }
        return <input type={type} {...props} />
      },
    }),
    [isDark],
  )

  return (
    <div className={cn("prose prose-sm max-w-none", isDark ? "prose-invert" : "")}>
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

// Content parsing function
function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = []

  // Split by code blocks first
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim()
      if (textContent) {
        // Check if it's JSON
        if (isJsonString(textContent)) {
          blocks.push({
            type: "json",
            content: textContent,
          })
        } else {
          blocks.push({
            type: "text",
            content: textContent,
          })
        }
      }
    }

    // Add code block
    const language = match[1] || "text"
    const code = match[2].trim()

    if (language === "json" || isJsonString(code)) {
      blocks.push({
        type: "json",
        content: code,
      })
    } else {
      blocks.push({
        type: "code",
        content: code,
        language,
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingContent = content.slice(lastIndex).trim()
    if (remainingContent) {
      if (isJsonString(remainingContent)) {
        blocks.push({
          type: "json",
          content: remainingContent,
        })
      } else {
        blocks.push({
          type: "text",
          content: remainingContent,
        })
      }
    }
  }

  // If no blocks were created, treat entire content as text
  if (blocks.length === 0) {
    blocks.push({
      type: "text",
      content: content,
    })
  }

  return blocks
}

// Utility function to check if string is JSON
function isJsonString(str: string): boolean {
  try {
    const trimmed = str.trim()
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false
    JSON.parse(trimmed)
    return true
  } catch {
    return false
  }
}

MessageContent.displayName = "MessageContent"

export { MessageContent }
