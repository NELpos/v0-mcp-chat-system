"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, ArrowLeftRight, Languages, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function TranslationInterface() {
  const [prompt, setPrompt] = useState(
    "Translate the following text from Korean to English accurately, maintaining the original meaning and tone:",
  )
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          text: inputText,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()
      setOutputText(data.translation)

      toast({
        title: "Translation Complete",
        description: "Text has been successfully translated.",
      })
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = async (text: string, type: "input" | "output") => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: `${type === "input" ? "Input" : "Output"} text copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleSwap = () => {
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
    toast({
      title: "Swapped",
      description: "Input and output text have been swapped.",
    })
  }

  const handleReset = () => {
    setInputText("")
    setOutputText("")
    toast({
      title: "Reset",
      description: "All text has been cleared.",
    })
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Languages className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AI Translation</h1>
      </div>

      {/* Prompt Section */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your translation instructions here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Translation Section */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Input Text</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{inputText.length} characters</span>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(inputText, "input")} disabled={!inputText}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-full min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Translation Result</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{outputText.length} characters</span>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(outputText, "output")} disabled={!outputText}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              placeholder="Translation will appear here..."
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              className="h-full min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleReset} disabled={!inputText && !outputText}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" onClick={handleSwap} disabled={!inputText && !outputText}>
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Swap
        </Button>
        <Button onClick={handleTranslate} disabled={!inputText.trim() || isTranslating} className="min-w-[120px]">
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </div>
    </div>
  )
}
