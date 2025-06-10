"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ToolToken {
  jira?: string
  atlassian?: string
  github?: string
}

interface ToolActivation {
  [toolId: string]: boolean
}

interface SettingsContextType {
  toolTokens: ToolToken
  updateToken: (tool: keyof ToolToken, token: string) => void
  hasRequiredTokens: (toolId: string) => boolean
  isLoaded: boolean
  toolActivation: ToolActivation
  updateToolActivation: (toolId: string, isActive: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [toolTokens, setToolTokens] = useState<ToolToken>({})
  const [toolActivation, setToolActivation] = useState<ToolActivation>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tokens and activation states from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          // Load tokens
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

          // Load tool activation states
          const savedActivation = localStorage.getItem("mcp-tool-activation")
          if (savedActivation) {
            const parsed = JSON.parse(savedActivation)
            if (parsed && typeof parsed === "object") {
              console.log("Loading saved tool activation from localStorage:", Object.keys(parsed))
              setToolActivation(parsed)
            }
          } else {
            // Default: all tools are active
            const defaultActivation = {
              jira: true,
              atlassian: true,
              github: true,
              "web-search": true,
              "code-interpreter": true,
            }
            setToolActivation(defaultActivation)
            localStorage.setItem("mcp-tool-activation", JSON.stringify(defaultActivation))
          }
        }
      } catch (error) {
        console.error("Failed to parse saved data:", error)
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("mcp-tool-tokens")
          localStorage.removeItem("mcp-tool-activation")
        }
        setToolTokens({})
        setToolActivation({})
      } finally {
        setIsLoaded(true)
      }
    }

    loadFromStorage()
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

  const updateToolActivation = (toolId: string, isActive: boolean) => {
    setToolActivation((prev) => {
      const newActivation = {
        ...prev,
        [toolId]: isActive,
      }

      // Immediately save to localStorage
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("mcp-tool-activation", JSON.stringify(newActivation))
          console.log("Tool activation updated and saved to localStorage:", { toolId, isActive })
        }
      } catch (error) {
        console.error("Failed to save tool activation to localStorage:", error)
      }

      return newActivation
    })
  }

  const hasRequiredTokens = (toolId: string) => {
    if (!toolId) return false

    switch (toolId) {
      case "jira":
        return !!toolTokens.jira
      case "atlassian":
        return !!toolTokens.atlassian
      case "github":
        return !!toolTokens.github
      default:
        return true
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        toolTokens,
        updateToken,
        hasRequiredTokens,
        isLoaded,
        toolActivation,
        updateToolActivation,
      }}
    >
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
