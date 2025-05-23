"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content?: string
}

export function MarkdownRenderer({ content = "" }: MarkdownRendererProps) {
  // Handle undefined or null content
  const safeContent = content || ""

  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent"
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-4 bg-gray-50 dark:bg-gray-800 py-2"
            {...props}
          />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""

          return !inline ? (
            <div className="my-4">
              {language && (
                <div className="bg-gray-800 text-gray-200 px-3 py-1 text-xs font-mono rounded-t-md border-b border-gray-600">
                  {language}
                </div>
              )}
              <pre
                className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${language ? "rounded-b-md" : "rounded-md"}`}
              >
                <code {...props}>{String(children || "").replace(/\n$/, "")}</code>
              </pre>
            </div>
          ) : (
            <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        pre: ({ node, ...props }) => <div {...props} />, // Override default pre styling
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table
              className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 border border-gray-300 dark:border-gray-700 rounded-md"
              {...props}
            />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
        th: ({ node, ...props }) => (
          <th
            className="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="px-3 py-2 text-sm border-b border-gray-200 dark:border-gray-700" {...props} />
        ),
        hr: ({ node, ...props }) => <hr className="my-6 border-gray-300 dark:border-gray-700" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,
      }}
    >
      {safeContent}
    </ReactMarkdown>
  )
}
