"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Plus, X, Save, Send, Wand2, FileText, Database, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SavedVariable {
  name: string
  value: string
  description?: string
}

interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  content: string
  variables: string[]
}

const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Welcome new users to the platform",
    subject: "Welcome to {{company_name}}!",
    content:
      "Hi {{user_name}},\n\nWelcome to {{company_name}}! We're excited to have you on board.\n\nBest regards,\nThe {{company_name}} Team",
    variables: ["user_name", "company_name"],
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Monthly newsletter template",
    subject: "{{company_name}} Newsletter - {{month}} {{year}}",
    content:
      "Dear {{user_name}},\n\nHere's what's new this month at {{company_name}}:\n\n{{newsletter_content}}\n\nStay tuned for more updates!\n\nBest,\n{{sender_name}}",
    variables: ["user_name", "company_name", "month", "year", "newsletter_content", "sender_name"],
  },
  {
    id: "promotion",
    name: "Promotional Email",
    description: "Product promotion and marketing email",
    subject: "Special Offer: {{discount_percentage}}% Off {{product_name}}!",
    content:
      "Hi {{user_name}},\n\nDon't miss out on our special offer!\n\nGet {{discount_percentage}}% off {{product_name}} - limited time only!\n\nUse code: {{promo_code}}\nValid until: {{expiry_date}}\n\nShop now: {{shop_url}}\n\nHappy shopping!\n{{company_name}} Team",
    variables: [
      "user_name",
      "discount_percentage",
      "product_name",
      "promo_code",
      "expiry_date",
      "shop_url",
      "company_name",
    ],
  },
]

export function EmailTemplateInterface() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [jsonData, setJsonData] = useState("")
  const [savedVariables, setSavedVariables] = useState<SavedVariable[]>([])
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Email form state
  const [recipients, setRecipients] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])

  // Dialog states
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [variableName, setVariableName] = useState("")
  const [variableDescription, setVariableDescription] = useState("")

  const { toast } = useToast()

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setSubject(template.subject)
      setContent(template.content)
    }
  }

  const handleJsonDataChange = (value: string) => {
    setJsonData(value)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    // Check if all text is selected (prevent dialog for Ctrl+A or similar)
    if (selectedText && selectedText.length > 0 && selectedText !== jsonData.trim()) {
      setSelectedText(selectedText)
      setIsVariableDialogOpen(true)
    }
  }

  const handleSaveVariable = () => {
    if (variableName && selectedText) {
      const newVariable: SavedVariable = {
        name: variableName,
        value: selectedText,
        description: variableDescription,
      }

      setSavedVariables((prev) => [...prev, newVariable])
      setVariableName("")
      setVariableDescription("")
      setSelectedText("")
      setIsVariableDialogOpen(false)

      toast({
        title: "Variable Saved",
        description: `Variable "${variableName}" has been saved successfully.`,
      })
    }
  }

  const handleRemoveVariable = (index: number) => {
    setSavedVariables((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would typically call your AI service
      let generatedSubject = selectedTemplate.subject
      let generatedContent = selectedTemplate.content

      // Apply JSON data if provided
      if (jsonData) {
        try {
          const data = JSON.parse(jsonData)
          Object.keys(data).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, "g")
            generatedSubject = generatedSubject.replace(regex, data[key])
            generatedContent = generatedContent.replace(regex, data[key])
          })
        } catch (error) {
          console.error("Invalid JSON data:", error)
        }
      }

      // Apply saved variables
      savedVariables.forEach((variable) => {
        const regex = new RegExp(`{{${variable.name}}}`, "g")
        generatedSubject = generatedSubject.replace(regex, variable.value)
        generatedContent = generatedContent.replace(regex, variable.value)
      })

      setSubject(generatedSubject)
      setContent(generatedContent)

      toast({
        title: "Email Generated",
        description: "Your email has been generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendEmail = async () => {
    if (!recipients || !subject || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in recipients, subject, and content.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully!",
      })

      // Reset form
      setRecipients("")
      setCc("")
      setBcc("")
      setSubject("")
      setContent("")
      setAttachments([])
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="h-full w-full flex gap-6 p-6">
      {/* Left Panel - Template Configuration */}
      <Card className="w-1/2 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template Configuration
          </CardTitle>
          <CardDescription>Configure your email template with data and AI enhancement</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6 pb-20">
              {/* Template Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2">Template Selection</h3>
                <div className="space-y-2">
                  <Label htmlFor="template">Choose Template</Label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an email template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">{selectedTemplate.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTemplate.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* JSON Data Input */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  JSON Data
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jsonData">Template Variables (JSON)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setJsonData("")
                        toast({
                          title: "Data Cleared",
                          description: "JSON data has been cleared successfully.",
                        })
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <Textarea
                    id="jsonData"
                    placeholder='{"user_name": "John Doe", "company_name": "Acme Corp"}'
                    value={jsonData}
                    onChange={(e) => handleJsonDataChange(e.target.value)}
                    onMouseUp={handleTextSelection}
                    className="min-h-[120px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter JSON data to populate template variables. Select text to save as variable.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Saved Variables */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2">Saved Variables</h3>
                {savedVariables.length > 0 ? (
                  <div className="space-y-2">
                    {savedVariables.map((variable, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {variable.name}
                            </Badge>
                            <span className="text-sm truncate">{variable.value}</span>
                          </div>
                          {variable.description && (
                            <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariable(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No saved variables yet. Select text in JSON data to save as variable.
                  </p>
                )}
              </div>

              <Separator />

              {/* AI Enhancement */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Enhancement
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="aiPrompt">AI Instructions (Optional)</Label>
                  <Textarea
                    id="aiPrompt"
                    placeholder="Add specific instructions for AI to enhance your email..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide additional context or instructions for AI to improve your email content.
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Generate Button */}
          <div className="shrink-0 border-t bg-background p-4 -mx-6 -mb-6">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedTemplate}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Panel - Email Composition */}
      <Card className="w-1/2 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Email Composition
          </CardTitle>
          <CardDescription>Review and send your generated email</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 pb-20">
              {/* Recipients */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2">Recipients</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="recipients">To *</Label>
                    <Input
                      id="recipients"
                      placeholder="recipient@example.com, another@example.com"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cc">CC</Label>
                    <Input id="cc" placeholder="cc@example.com" value={cc} onChange={(e) => setCc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bcc">BCC</Label>
                    <Input
                      id="bcc"
                      placeholder="bcc@example.com"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Email Content */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2">Email Content</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Email content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Attachments */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium border-b pb-2">Attachments</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attachment
                  </Button>
                  {attachments.length > 0 && (
                    <div className="space-y-1">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm">{attachment}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Send Button */}
          <div className="shrink-0 border-t bg-background p-4 -mx-6 -mb-6">
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !recipients || !subject || !content}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variable Save Dialog */}
      <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Variable</DialogTitle>
            <DialogDescription>Save the selected text as a reusable variable for your templates.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selected Text</Label>
              <div className="p-2 bg-muted rounded-md">
                <code className="text-sm">{selectedText}</code>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="variableName">Variable Name *</Label>
              <Input
                id="variableName"
                placeholder="e.g., user_name, company_name"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variableDescription">Description (Optional)</Label>
              <Input
                id="variableDescription"
                placeholder="Brief description of this variable"
                value={variableDescription}
                onChange={(e) => setVariableDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVariableDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVariable} disabled={!variableName}>
              <Save className="mr-2 h-4 w-4" />
              Save Variable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
