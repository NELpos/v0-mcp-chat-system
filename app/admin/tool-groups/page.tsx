import type { Metadata } from "next"
import { ToolGroupManager } from "@/components/tool-group-manager"

export const metadata: Metadata = {
  title: "Tool Groups",
  description: "Manage MCP tool groups and organize tools by functionality",
}

export default function ToolGroupsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tool Groups</h2>
      </div>
      <ToolGroupManager />
    </div>
  )
}
