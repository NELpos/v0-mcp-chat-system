import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, text } = await request.json()

    if (!text || !prompt) {
      return NextResponse.json({ error: "Text and prompt are required" }, { status: 400 })
    }

    const { text: translation } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a professional translator. Provide accurate and natural translations while preserving the original meaning, tone, and context.",
      prompt: `${prompt}\n\n${text}`,
      temperature: 0.3,
    })

    return NextResponse.json({ translation })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
