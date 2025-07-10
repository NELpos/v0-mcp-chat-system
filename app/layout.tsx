import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { ChatProvider } from "@/contexts/chat-context"
import { DocumentProvider } from "@/contexts/document-context"
import { Toaster } from "@/components/toaster"
import { UserMenu } from "@/components/user-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCP Chat System",
  description: "A comprehensive chat system with MCP tools integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SettingsProvider>
            <ChatProvider>
              <DocumentProvider>
                {/* ====== NO SIDEBAR ====== */}
                <div className="flex h-screen w-full flex-col">
                  {/* Header */}
                  <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <h1 className="text-xl font-semibold">MCP Chat System</h1>
                    <UserMenu />
                  </header>

                  {/* Main Content */}
                  <main className="flex-1 overflow-auto">{children}</main>
                </div>

                {/* Global Toasts */}
                <Toaster />
              </DocumentProvider>
            </ChatProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
