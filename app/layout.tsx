import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SettingsProvider } from "@/contexts/settings-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/toaster"
import { UserMenu } from "@/components/user-menu"

export const metadata: Metadata = {
  title: "AI Chat System",
  description: "MCP and RAG Chat System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-background">
              <div className="absolute top-0 right-0 p-4 z-10">
                <UserMenu />
              </div>
              {children}
            </div>
            <Toaster />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
