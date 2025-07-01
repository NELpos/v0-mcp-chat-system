"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface DocumentContent {
  id: string
  title: string
  content: string
  type: "code" | "json" | "markdown" | "text"
  language?: string
  timestamp: Date
  messageId?: string
}

interface DocumentContextType {
  isOpen: boolean
  documents: DocumentContent[]
  activeDocumentId: string | null
  openDocument: (document: DocumentContent) => void
  closeDocument: () => void
  toggleDocument: () => void
  setActiveDocument: (id: string) => void
  removeDocument: (id: string) => void
  clearDocuments: () => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [documents, setDocuments] = useState<DocumentContent[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

  const openDocument = (document: DocumentContent) => {
    setDocuments((prev) => {
      const existing = prev.find((doc) => doc.id === document.id)
      if (existing) {
        return prev.map((doc) => (doc.id === document.id ? document : doc))
      }
      return [...prev, document]
    })
    setActiveDocumentId(document.id)
    setIsOpen(true)
  }

  const closeDocument = () => {
    setIsOpen(false)
  }

  const toggleDocument = () => {
    setIsOpen((prev) => !prev)
  }

  const setActiveDocument = (id: string) => {
    setActiveDocumentId(id)
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    if (activeDocumentId === id) {
      const remaining = documents.filter((doc) => doc.id !== id)
      setActiveDocumentId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const clearDocuments = () => {
    setDocuments([])
    setActiveDocumentId(null)
  }

  return (
    <DocumentContext.Provider
      value={{
        isOpen,
        documents,
        activeDocumentId,
        openDocument,
        closeDocument,
        toggleDocument,
        setActiveDocument,
        removeDocument,
        clearDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocument must be used within a DocumentProvider")
  }
  return context
}
