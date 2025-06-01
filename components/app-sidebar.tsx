"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Bot, Database, Settings, FileText, Shield, Key, Users, Boxes } from "lucide-react"

// Navigation items
const navItems = [
  {
    title: "MCP Chat",
    url: "/mcp",
    icon: Bot,
    description: "Model Context Protocol chat with external tools",
  },
  {
    title: "RAG Chat",
    url: "/rag",
    icon: Database,
    description: "Retrieval Augmented Generation with your documents",
  },
  {
    title: "Prompts",
    url: "/prompts",
    icon: FileText,
    description: "Manage and version your AI prompts",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Configure API tokens and preferences",
  },
]

// Admin navigation items
const adminItems = [
  {
    title: "API Keys",
    url: "/admin/api-keys",
    icon: Key,
    description: "Manage API keys for system access",
  },
  {
    title: "Tools Group",
    url: "/admin/tools-group",
    icon: Boxes,
    description: "Manage tool groups for Generative AI",
  },
  {
    title: "Permissions",
    url: "/admin/permissions",
    icon: Users,
    description: "Manage user permissions for tool groups",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/mcp">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Bot className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AI Chat System</span>
                  <span className="truncate text-xs">MCP & RAG</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/admin")}>
                  <Link href="/admin/api-keys">
                    <Shield />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {adminItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={pathname === item.url}>
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center w-full px-2">
              <span className="text-sm text-muted-foreground">AI Chat System v1.0</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
