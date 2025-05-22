import ChatInterface from "@/components/chat-interface"
import { SettingsProvider } from "@/contexts/settings-context"
import { Toaster } from "@/components/toaster"

export default function Home() {
  return (
    <SettingsProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 container max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8 mt-4">AI Chat with MCP Tools</h1>
          <ChatInterface />
        </main>
        <Toaster />
      </div>
    </SettingsProvider>
  )
}
