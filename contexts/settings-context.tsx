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
  isLoaded: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [toolTokens, setToolTokens] = useState<ToolToken>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const loadTokensFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const savedTokens = localStorage.getItem("mcp-tool-tokens")
          if (savedTokens) {
            const parsed = JSON.parse(savedTokens)
            if (parsed && typeof parsed === "object") {
              console.log("Loading saved tokens from localStorage:", Object.keys(parsed))
              setToolTokens(parsed)
            }
          } else {
            console.log("No saved tokens found in localStorage")
          }
        }
      } catch (error) {
        console.error("Failed to parse saved tokens:", error)
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("mcp-tool-tokens")
        }
        setToolTokens({})
      } finally {
        setIsLoaded(true)
      }
    }

    loadTokensFromStorage()
  }, [])

  const updateToken = (tool: keyof ToolToken, token: string) => {
    setToolTokens((prev) => {
      const newTokens = {
        ...prev,
        [tool]: token,
      }

      // Immediately save to localStorage
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("mcp-tool-tokens", JSON.stringify(newTokens))
          console.log("Token updated and saved to localStorage:", { tool, hasToken: !!token })
        }
      } catch (error) {
        console.error("Failed to save tokens to localStorage:", error)
      }

      return newTokens
    })
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
    <SettingsContext.Provider value={{ toolTokens, updateToken, hasRequiredTokens, isLoaded }}>
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
