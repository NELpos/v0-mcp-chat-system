"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Settings2,
  MessageSquare,
  Languages,
  Users,
  Shield,
  Mail,
  ChevronLeft,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
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
      url: "#",
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
      title: "Translation",
      url: "/translation",
      icon: Languages,
    },
    {
      title: "Email Template",
      url: "/template/email",
      icon: Mail,
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
          url: "#",
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
          url: "#",
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
      icon: Frame,
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
  const { toggleSidebar, state } = useSidebar()

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
      <SidebarRail>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="absolute inset-y-0 right-0 w-4 flex items-center justify-center hover:bg-sidebar-accent transition-colors duration-200 group"
          aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-200 ${state === "collapsed" ? "rotate-180" : ""}`}
          />
        </Button>
      </SidebarRail>
    </Sidebar>
  )
}
