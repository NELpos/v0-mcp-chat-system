export interface DocumentContent {
  id: string
  title: string
  content: string
  type: "code" | "json" | "markdown" | "text"
  language?: string
  timestamp: Date
  messageId?: string
}
