"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  MessageSquare,
  Users,
  Shield,
  Zap,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "MCP Chat System",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Chat",
      url: "/mcp",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "MCP Chat",
          url: "/mcp",
        },
        {
          title: "RAG Chat",
          url: "/rag",
        },
      ],
    },
    {
      title: "Management",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Prompts",
          url: "/prompts",
        },
        {
          title: "Resources",
          url: "/rag",
        },
        {
          title: "Settings",
          url: "/settings",
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: Users,
      items: [
        {
          title: "API Keys",
          url: "/user/api-key",
        },
        {
          title: "Profile",
          url: "/user/profile",
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "API Keys",
          url: "/admin/api-keys",
        },
        {
          title: "Tool Groups",
          url: "/admin/tool-groups",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Getting Started",
      url: "/onboarding",
      icon: Zap,
    },
    {
      name: "Documentation",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Support",
      url: "#",
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
