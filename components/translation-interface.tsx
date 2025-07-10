"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, RefreshCw, Languages } from "lucide-react"
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
        title: "Error",
        description: "Please enter text to translate",
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
        title: "Success",
        description: "Translation completed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate text",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: `${type} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
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
      description: "Input and output text swapped",
    })
  }

  const handleReset = () => {
    setInputText("")
    setOutputText("")
    toast({
      title: "Reset",
      description: "All text cleared",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Languages className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Translation</h1>
      </div>

      {/* Prompt Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Translation Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter translation instructions and language direction..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Translation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Input Text</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{inputText.length} characters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(inputText, "Input text")}
                disabled={!inputText}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Translation Result</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{outputText.length} characters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(outputText, "Translation result")}
                disabled={!outputText}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Translation will appear here..."
              className="min-h-[300px] resize-none bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleReset} disabled={!inputText && !outputText}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <Button variant="outline" onClick={handleSwap} disabled={!inputText || !outputText}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Swap
        </Button>

        <Button onClick={handleTranslate} disabled={!inputText.trim() || isTranslating} className="min-w-[120px]">
          {isTranslating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              Translate
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
