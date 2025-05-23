"use client"

import type { Message } from "ai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useState, useEffect } from "react"

interface MessageListProps {
  messages?: Message[]
}

// Example conversations to demonstrate the chat functionality
const exampleConversations: Message[] = [
  {
    id: "example-1",
    role: "user",
    content: "Can you help me create a Jira ticket for a bug I found?",
  },
  {
    id: "example-2",
    role: "assistant",
    content: `Sure, I can help you create a Jira ticket. Please provide the following information:

## Required Information
* **Summary**: A brief description of the bug
* **Description**: Detailed information about the bug
* **Steps to reproduce**: How can someone else reproduce this bug?
* **Expected behavior**: What should happen
* **Actual behavior**: What actually happens
* **Priority**: How urgent is this issue?

Once you provide these details, I'll create a ticket in Jira for you.`,
  },
  {
    id: "example-3",
    role: "user",
    content: "I need to find information about our project documentation in Confluence.",
  },
  {
    id: "example-4",
    role: "assistant",
    content: `I'll help you find information about your project documentation in Confluence. Here's what I found:

### Project Documentation
Your team has several documentation spaces in Confluence:

1. **Project Overview** - Contains high-level information about the project
   - [Project Goals and Objectives](/project-goals)
   - [Team Structure](/team-structure)
   - [Timeline](/timeline)

2. **Technical Documentation**
   - [Architecture Diagram](/architecture)
   - [API Documentation](/api-docs)
   - [Database Schema](/db-schema)

3. **User Guides**
   - [Admin Guide](/admin-guide)
   - [End User Manual](/user-manual)

**Project Structure:**
\`\`\`
Project Documentation/
├── Project Overview/
│   ├── Goals & Objectives
│   ├── Team Structure
│   └── Timeline
├── Technical Documentation/
│   ├── Architecture
│   ├── API Documentation
│   └── Database Schema
└── User Guides/
    ├── Admin Guide
    └── User Manual
\`\`\`

Would you like me to provide more details about any specific section?`,
  },
  {
    id: "example-5",
    role: "user",
    content: "Can you send a message to the #development channel in Slack about our upcoming deployment?",
  },
  {
    id: "example-6",
    role: "assistant",
    content: `I'll help you send a message to the #development channel about the upcoming deployment. Here's a preview of the message I'll send:

---

**Upcoming Deployment Notice**

Hello team! This is an automated message regarding our upcoming deployment:

| Detail | Information |
|--------|-------------|
| **Date** | Friday, May 24, 2025 |
| **Time** | 10:00 PM - 2:00 AM EST |
| **Services Affected** | User Authentication, Payment Processing |
| **Expected Downtime** | ~30 minutes |

**Deployment Steps**:
1. Database migration
2. Backend service update
3. Frontend deployment
4. Smoke testing

Please ensure all your changes are committed and merged by EOD Thursday.

*For questions, contact the DevOps team.*

---

Would you like me to send this message now, or would you like to make any changes?`,
  },
]

export default function MessageList({ messages = [] }: MessageListProps) {
  const [displayMessages, setDisplayMessages] = useState<Message[]>([])

  useEffect(() => {
    // Ensure messages is an array before checking length
    const messageArray = Array.isArray(messages) ? messages : []

    // If there are no actual messages, show example conversations
    if (messageArray.length === 0) {
      setDisplayMessages(exampleConversations)
    } else {
      setDisplayMessages(messageArray)
    }
  }, [messages])

  if (!Array.isArray(displayMessages) || displayMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation by typing a message below.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-1">
      {displayMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-3 rounded-lg p-3",
            message.role === "user" ? "bg-muted/50" : "bg-background border border-border",
          )}
        >
          <Avatar className={message.role === "user" ? "bg-primary" : "bg-green-500"}>
            <AvatarFallback>{message.role === "user" ? <User size={18} /> : <Bot size={18} />}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            {message.role === "assistant" ? (
              <MarkdownRenderer content={message.content || ""} />
            ) : (
              <div className="prose dark:prose-invert">{message.content || ""}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
