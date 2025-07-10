"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectItem, SelectTrigger, SelectValue, SearchableSelectContent } from "@/components/ui/select"
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
  const [templateSearchValue, setTemplateSearchValue] = useState("")
  const [contentFormat, setContentFormat] = useState<"html" | "markdown">("html")

  // Email form state
  const [recipients, setRecipients] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])

  // Dialog states
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false)
  const [isExpandDialogOpen, setIsExpandDialogOpen] = useState(false)
  const [expandedJsonData, setExpandedJsonData] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [variableName, setVariableName] = useState("")
  const [suggestedVariables, setSuggestedVariables] = useState<string[]>([])
  const [isInExpandDialog, setIsInExpandDialog] = useState(false)

  // useToast can return `toast` as undefined if the ToastProvider is missing.
  // `showToast` guarantees we never call an undefined function.
  const { toast } = useToast() as { toast?: (opts: any) => void }

  function showToast(opts: Parameters<NonNullable<typeof toast>>[0]) {
    if (typeof toast === "function") {
      toast(opts)
    } else {
      // Fallback - keep the app from crashing and surface the message in dev tools
      console.warn("Toast provider missing:", opts)
    }
  }

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

    if (selectedText && selectedText.length > 0) {
      setSelectedText(selectedText)

      // Get template variables as suggestions
      const templateVariables = selectedTemplate?.variables || []
      setSuggestedVariables(templateVariables)

      // Only open dialog if not in expand dialog context
      if (!isInExpandDialog) {
        setIsVariableDialogOpen(true)
      }
    }
  }

  const handleVariableSuggestionSelect = (suggestion: string) => {
    setVariableName(suggestion)
  }

  const handleSaveVariable = () => {
    if (variableName && selectedText) {
      const newVariable: SavedVariable = {
        name: variableName,
        value: selectedText,
      }

      setSavedVariables((prev) => [...prev, newVariable])
      setVariableName("")
      setSelectedText("")
      setSuggestedVariables([])
      setIsVariableDialogOpen(false)

      showToast({
        title: "Variable Saved",
        description: `Variable "${variableName}" has been saved successfully.`,
      })
    }
  }

  const handleRemoveVariable = (index: number) => {
    setSavedVariables((prev) => prev.filter((_, i) => i !== index))
    showToast({
      title: "Variable Removed",
      description: "Variable removed successfully.",
    })
  }

  const handleOpenExpandDialog = () => {
    setExpandedJsonData(jsonData)
    setIsInExpandDialog(true)
    setIsExpandDialogOpen(true)
  }

  const handleSaveExpandedData = () => {
    setJsonData(expandedJsonData)
    setIsInExpandDialog(false)
    setIsExpandDialogOpen(false)
    showToast({
      title: "JSON Data Updated",
      description: "Your JSON data has been updated successfully.",
    })
  }

  const handleClearExpandedData = () => {
    setExpandedJsonData("")
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      showToast({
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

      showToast({
        title: "Email Generated",
        description: "Your email has been generated successfully!",
      })
    } catch (error) {
      showToast({
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
      showToast({
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

      showToast({
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
      showToast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleContentFormatChange = (format: "html" | "markdown") => {
    setContentFormat(format)
  }

  const filteredTemplates = emailTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(templateSearchValue.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchValue.toLowerCase()),
  )

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
                    <SearchableSelectContent searchable onSearch={setTemplateSearchValue}>
                      {filteredTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SearchableSelectContent>
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
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON Data
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setJsonData("")} className="h-7 px-2 text-xs">
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenExpandDialog}
                      className="h-7 px-2 text-xs bg-transparent"
                    >
                      Expand
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jsonData">Template Variables (JSON)</Label>
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
                    <div className="flex items-center gap-4">
                      <Label className="text-xs font-medium">Format:</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="format-html"
                          name="contentFormat"
                          value="html"
                          checked={contentFormat === "html"}
                          onChange={() => handleContentFormatChange("html")}
                          className="h-3 w-3"
                        />
                        <Label htmlFor="format-html" className="text-xs cursor-pointer">
                          HTML
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="format-markdown"
                          name="contentFormat"
                          value="markdown"
                          checked={contentFormat === "markdown"}
                          onChange={() => handleContentFormatChange("markdown")}
                          className="h-3 w-3"
                        />
                        <Label htmlFor="format-markdown" className="text-xs cursor-pointer">
                          Markdown
                        </Label>
                      </div>
                    </div>
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

            {suggestedVariables.length > 0 && (
              <div className="space-y-2">
                <Label>Template Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedVariables.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant={variableName === suggestion ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => handleVariableSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click on a template variable to use it as the variable name.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="variableName">Variable Name *</Label>
              <Input
                id="variableName"
                placeholder="e.g., user_name, company_name"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
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

      {/* Expand JSON Data Dialog */}
      <Dialog
        open={isExpandDialogOpen}
        onOpenChange={(open) => {
          setIsExpandDialogOpen(open)
          if (!open) {
            setIsInExpandDialog(false)
            setSelectedText("")
            setVariableName("")
            setSuggestedVariables([])
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Edit JSON Data
            </DialogTitle>
            <DialogDescription>
              Edit your JSON template variables in an expanded view. Select text to save as variables.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Left side - JSON Editor */}
            <div className="flex flex-col space-y-4 flex-1 min-h-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="expandedJsonData">JSON Template Variables</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearExpandedData}
                  className="h-7 px-2 text-xs bg-transparent"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear All
                </Button>
              </div>
              <ScrollArea className="flex-1 min-h-[400px] max-h-[500px]">
                <Textarea
                  id="expandedJsonData"
                  placeholder='{\n  "user_name": "John Doe",\n  "company_name": "Acme Corp",\n  "email": "john@example.com"\n}'
                  value={expandedJsonData}
                  onChange={(e) => setExpandedJsonData(e.target.value)}
                  onMouseUp={handleTextSelection}
                  className="min-h-[400px] font-mono text-sm resize-none border-0 focus-visible:ring-0"
                />
              </ScrollArea>
              <div className="text-xs text-muted-foreground">
                <p>• Use valid JSON format with double quotes around keys and string values</p>
                <p>• Variables will be available as {`{{variable_name}}`} in your templates</p>
                <p>• Select text to save as a variable in the panel on the right</p>
              </div>
            </div>

            {/* Right side - Variable Management */}
            <div className="w-80 flex flex-col space-y-4 border-l pl-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Variable Assignment</Label>
                {selectedText && (
                  <Badge variant="secondary" className="text-xs">
                    Text Selected
                  </Badge>
                )}
              </div>

              {selectedText ? (
                <div className="space-y-3 p-3 bg-muted/50 rounded-md">
                  <div className="space-y-2">
                    <Label className="text-xs">Selected Text</Label>
                    <div className="p-2 bg-background rounded border text-xs font-mono max-h-20 overflow-y-auto">
                      {selectedText}
                    </div>
                  </div>

                  {suggestedVariables.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Suggested Variables</Label>
                      <div className="flex flex-wrap gap-1">
                        {suggestedVariables.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant={variableName === suggestion ? "default" : "secondary"}
                            className="cursor-pointer hover:bg-primary/80 transition-colors text-xs"
                            onClick={() => handleVariableSuggestionSelect(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="expandVariableName" className="text-xs">
                      Variable Name
                    </Label>
                    <Input
                      id="expandVariableName"
                      placeholder="e.g., user_name"
                      value={variableName}
                      onChange={(e) => setVariableName(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveVariable}
                      disabled={!variableName}
                      className="flex-1 h-7 text-xs"
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedText("")
                        setVariableName("")
                        setSuggestedVariables([])
                      }}
                      className="h-7 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Select text in the JSON editor to save as a variable</p>
                </div>
              )}

              <Separator />

              {/* Saved Variables Display */}
              <div className="space-y-3 flex-1">
                <Label className="text-sm font-medium">Saved Variables ({savedVariables.length})</Label>
                <ScrollArea className="flex-1 max-h-60">
                  {savedVariables.length > 0 ? (
                    <div className="space-y-2">
                      {savedVariables.map((variable, index) => (
                        <div key={index} className="flex items-start justify-between p-2 bg-muted/30 rounded-md">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs shrink-0">
                                {variable.name}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate" title={variable.value}>
                              {variable.value}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariable(index)}
                            className="h-6 w-6 p-0 shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No variables saved yet</p>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsExpandDialogOpen(false)
                setIsInExpandDialog(false)
                setSelectedText("")
                setVariableName("")
                setSuggestedVariables([])
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveExpandedData}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
