"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ToolToken {
  jira?: string
  atlassian?: string
  slack?: string
}

interface SettingsContextType {
  toolTokens: ToolToken
  updateToken: (tool: keyof ToolToken, token: string) => void
  hasRequiredTokens: (toolId: string) => boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [toolTokens, setToolTokens] = useState<ToolToken>({})

  // Load tokens from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTokens = localStorage.getItem("mcp-tool-tokens")
        if (savedTokens) {
          const parsed = JSON.parse(savedTokens)
          if (parsed && typeof parsed === "object") {
            setToolTokens(parsed)
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse saved tokens:", error)
      setToolTokens({})
    }
  }, [])

  // Save tokens to localStorage when they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("mcp-tool-tokens", JSON.stringify(toolTokens))
      }
    } catch (error) {
      console.error("Failed to save tokens:", error)
    }
  }, [toolTokens])

  const updateToken = (tool: keyof ToolToken, token: string) => {
    setToolTokens((prev) => ({
      ...prev,
      [tool]: token,
    }))
  }

  const hasRequiredTokens = (toolId: string) => {
    if (!toolId) return false

    switch (toolId) {
      case "jira":
        return !!toolTokens.jira
      case "atlassian":
        return !!toolTokens.atlassian
      case "slack":
        return !!toolTokens.slack
      default:
        return true
    }
  }

  return (
    <SettingsContext.Provider value={{ toolTokens, updateToken, hasRequiredTokens }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
