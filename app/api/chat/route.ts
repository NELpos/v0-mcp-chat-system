import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { mcpTools } from "@/lib/mcp-tools"

export async function POST(req: Request) {
  const { messages, activeTool } = await req.json()

  // Find the active tool
  const tool = mcpTools.find((t) => t.id === activeTool) || mcpTools[0]

  // Create system message based on the active tool
  const systemMessage = `You are a helpful AI assistant with access to the ${tool.name} tool. 
  ${tool.description}. When appropriate, use this tool to provide better answers.
  Always respond in a helpful, safe, and ethical manner.`

  try {
    // Use the AI SDK to stream the response
    const result = streamText({
      model: openai("gpt-4o"),
      messages: [{ role: "system", content: systemMessage }, ...messages],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
