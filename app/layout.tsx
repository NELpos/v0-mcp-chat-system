import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SettingsProvider } from "@/contexts/settings-context"
import { Toaster } from "@/components/toaster"

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
    <html lang="en">
      <body>
        <SettingsProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
            <Toaster />
          </SidebarProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
