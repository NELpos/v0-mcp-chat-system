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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
]

// Settings navigation items
const settingsItems = [
  {
    title: "MCP Settings",
    url: "/settings",
    icon: Settings,
    description: "Configure MCP tokens and preferences",
  },
  {
    title: "API Key",
    url: "/user/api-key",
    icon: Key,
    description: "Manage your personal API key",
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

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "",
  role: "Administrator",
}

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
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings" || pathname === "/user/api-key"}>
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {settingsItems.map((item) => (
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
            <Link href="/user/api-key" className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatarUrl || "/placeholder.svg"} alt={mockUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{mockUser.name}</span>
                <span className="text-xs text-muted-foreground">{mockUser.role}</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
