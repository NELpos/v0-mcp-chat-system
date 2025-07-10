"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Download,
  Save,
  Upload,
  Play,
  Settings,
  ArrowRight,
  X,
  MapPin,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import type { ApiConfig, TableInfo, ColumnInfo, DataMapping, MappingTemplate, IngestorStep } from "@/types/ingestor"

// Mock data
const mockTables: TableInfo[] = [
  { id: "users", name: "users", schema: "public", description: "User account information" },
  { id: "products", name: "products", schema: "public", description: "Product catalog" },
  { id: "orders", name: "orders", schema: "public", description: "Customer orders" },
  { id: "customers", name: "customers", schema: "public", description: "Customer information" },
]

const mockColumns: Record<string, ColumnInfo[]> = {
  users: [
    { name: "id", type: "integer", nullable: false, primaryKey: true, description: "User ID" },
    { name: "email", type: "varchar(255)", nullable: false, primaryKey: false, description: "Email address" },
    { name: "name", type: "varchar(100)", nullable: false, primaryKey: false, description: "Full name" },
    { name: "created_at", type: "timestamp", nullable: false, primaryKey: false, description: "Creation date" },
  ],
  products: [
    { name: "id", type: "integer", nullable: false, primaryKey: true, description: "Product ID" },
    { name: "name", type: "varchar(200)", nullable: false, primaryKey: false, description: "Product name" },
    { name: "price", type: "decimal(10,2)", nullable: false, primaryKey: false, description: "Product price" },
    { name: "category", type: "varchar(50)", nullable: true, primaryKey: false, description: "Product category" },
  ],
  orders: [
    { name: "id", type: "integer", nullable: false, primaryKey: true, description: "Order ID" },
    { name: "user_id", type: "integer", nullable: false, primaryKey: false, description: "User ID" },
    { name: "total", type: "decimal(10,2)", nullable: false, primaryKey: false, description: "Order total" },
    { name: "status", type: "varchar(20)", nullable: false, primaryKey: false, description: "Order status" },
  ],
  customers: [
    { name: "id", type: "integer", nullable: false, primaryKey: true, description: "Customer ID" },
    { name: "company", type: "varchar(100)", nullable: true, primaryKey: false, description: "Company name" },
    { name: "contact_name", type: "varchar(100)", nullable: false, primaryKey: false, description: "Contact person" },
    { name: "phone", type: "varchar(20)", nullable: true, primaryKey: false, description: "Phone number" },
  ],
}

const mockApiResponse = {
  users: [
    { id: 1, email: "john@example.com", full_name: "John Doe", registration_date: "2024-01-15" },
    { id: 2, email: "jane@example.com", full_name: "Jane Smith", registration_date: "2024-01-16" },
  ],
  products: [
    { product_id: 101, title: "Laptop Pro", cost: 1299.99, category_name: "Electronics" },
    { product_id: 102, title: "Wireless Mouse", cost: 29.99, category_name: "Accessories" },
  ],
}

interface MappingDialog {
  isOpen: boolean
  selectedText: string
  selectedPath: string
  position: { x: number; y: number }
}

export function IngestorInterface() {
  const [currentStep, setCurrentStep] = useState(1)
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [selectedColumns, setSelectedColumns] = useState<ColumnInfo[]>([])
  const [mappings, setMappings] = useState<DataMapping[]>([])
  const [templates, setTemplates] = useState<MappingTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [mappingDialog, setMappingDialog] = useState<MappingDialog>({
    isOpen: false,
    selectedText: "",
    selectedPath: "",
    position: { x: 0, y: 0 },
  })
  const [selectedColumn, setSelectedColumn] = useState<string>("")
  const jsonPreviewRef = useRef<HTMLPreElement>(null)

  const steps: IngestorStep[] = [
    {
      id: 1,
      title: "Table Selection",
      description: "Select target database table",
      completed: !!selectedTable,
    },
    {
      id: 2,
      title: "API Configuration",
      description: "Configure API endpoint",
      completed: !!apiResponse,
    },
    {
      id: 3,
      title: "Data Mapping",
      description: "Map JSON fields to columns",
      completed: mappings.length > 0,
    },
    {
      id: 4,
      title: "Data Storage",
      description: "Store mapped data",
      completed: false,
    },
  ]

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId)
    setSelectedColumns(mockColumns[tableId] || [])
    setCurrentStep(2)

    toast.info("Table selected", {
      description: `Selected ${tableId} table with ${mockColumns[tableId]?.length || 0} columns`,
    })
  }

  const handleApiCall = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (apiConfig.url.includes("users")) {
        setApiResponse(mockApiResponse.users)
      } else {
        setApiResponse(mockApiResponse.products)
      }

      toast.success("Data retrieved successfully from API", {
        description: `Retrieved ${apiConfig.url.includes("users") ? mockApiResponse.users.length : mockApiResponse.products.length} records`,
      })
      setCurrentStep(3)
    } catch (error) {
      toast.error("Failed to retrieve data from API", {
        description: "Please check your API configuration and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJsonSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const selectedText = selection.toString().trim()
    if (!selectedText || selectedText.length < 2) return

    // Check if the entire JSON is selected (avoid Ctrl+A selections)
    const jsonString = JSON.stringify(apiResponse, null, 2)
    if (selectedText === jsonString || selectedText.length > jsonString.length * 0.8) {
      return
    }

    // Get the selected range and position
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Try to extract the JSON path from the selected text
    const jsonPath = extractJsonPath(selectedText, apiResponse)

    if (jsonPath) {
      setMappingDialog({
        isOpen: true,
        selectedText,
        selectedPath: jsonPath,
        position: { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY },
      })
    }
  }, [apiResponse])

  const extractJsonPath = (selectedText: string, data: any): string => {
    // Simple path extraction - in a real implementation, this would be more sophisticated
    try {
      // Remove quotes and whitespace
      const cleanText = selectedText.replace(/["\s]/g, "")

      // Check if it's a key-value pair
      if (selectedText.includes(":")) {
        const key = selectedText.split(":")[0].replace(/["\s]/g, "")
        return key
      }

      // Check if it's just a key
      if (data && Array.isArray(data) && data.length > 0) {
        const firstItem = data[0]
        if (typeof firstItem === "object" && firstItem.hasOwnProperty(cleanText)) {
          return cleanText
        }
      }

      return cleanText
    } catch (error) {
      return selectedText
    }
  }

  const handleMappingConfirm = () => {
    if (!selectedColumn || !mappingDialog.selectedPath) {
      toast.error("Please select a column", {
        description: "You must select a target column for the mapping",
      })
      return
    }

    const newMapping: DataMapping = {
      sourceField: mappingDialog.selectedPath,
      targetColumn: selectedColumn,
      transformation: "",
    }

    // Check if mapping already exists
    const existingIndex = mappings.findIndex((m) => m.sourceField === mappingDialog.selectedPath)
    if (existingIndex >= 0) {
      const updatedMappings = [...mappings]
      updatedMappings[existingIndex] = newMapping
      setMappings(updatedMappings)
      toast.info("Mapping updated", {
        description: `Updated mapping for ${mappingDialog.selectedPath}`,
      })
    } else {
      setMappings([...mappings, newMapping])
      toast.success("Mapping created", {
        description: `Mapped ${mappingDialog.selectedPath} to ${selectedColumn}`,
      })
    }

    setMappingDialog({ isOpen: false, selectedText: "", selectedPath: "", position: { x: 0, y: 0 } })
    setSelectedColumn("")
  }

  const handleMappingCancel = () => {
    setMappingDialog({ isOpen: false, selectedText: "", selectedPath: "", position: { x: 0, y: 0 } })
    setSelectedColumn("")
  }

  const handleRemoveMapping = (index: number) => {
    const removedMapping = mappings[index]
    setMappings(mappings.filter((_, i) => i !== index))

    toast.info("Mapping removed", {
      description: `Removed mapping for ${removedMapping.sourceField}`,
    })
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Template name is required", {
        description: "Please enter a name for your template",
      })
      return
    }

    const newTemplate: MappingTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      apiConfig,
      tableId: selectedTable,
      mappings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTemplates([...templates, newTemplate])
    setShowTemplateDialog(false)
    setTemplateName("")
    setTemplateDescription("")

    toast.success("Template saved successfully", {
      description: `Template "${templateName}" has been saved`,
    })
  }

  const handleLoadTemplate = (template: MappingTemplate) => {
    setApiConfig(template.apiConfig)
    setSelectedTable(template.tableId)
    setSelectedColumns(mockColumns[template.tableId] || [])
    setMappings(template.mappings)
    setCurrentStep(3)

    toast.success("Template loaded successfully", {
      description: `Loaded template "${template.name}" with ${template.mappings.length} mappings`,
    })
  }

  const handleDataStorage = async () => {
    setIsLoading(true)
    try {
      // Simulate data storage
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const recordCount = apiResponse?.length || 0
      toast.success("Data stored successfully", {
        description: `Successfully stored ${recordCount} records to ${selectedTable} table`,
      })
      setCurrentStep(4)
    } catch (error) {
      toast.error("Failed to store data", {
        description: "An error occurred while storing data to the database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Ingestor</h1>
          <p className="text-muted-foreground">Configure and manage data ingestion workflows</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Mapping Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter template description"
                  />
                </div>
                <Button onClick={handleSaveTemplate} className="w-full">
                  Save Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Streamlined Workflow Progress Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Layout - Horizontal */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between w-full">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center text-center min-w-0 flex-1">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white shadow-lg"
                          : currentStep === step.id
                            ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-3 max-w-[140px]">
                      <div
                        className={`font-medium text-sm ${currentStep === step.id ? "text-blue-600" : "text-gray-700"}`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 leading-tight">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 flex justify-center px-4">
                      <div
                        className={`h-0.5 w-full transition-colors duration-300 ${
                          steps[index + 1].completed || currentStep > step.id
                            ? "bg-green-500"
                            : currentStep === step.id
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tablet Layout - Compact Horizontal */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center relative">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : currentStep === step.id
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <div
                      className={`font-medium text-xs ${currentStep === step.id ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className={`absolute -right-3 top-4 w-4 h-4 transition-colors duration-300 ${
                        steps[index + 1].completed || currentStep > step.id
                          ? "text-green-500"
                          : currentStep === step.id
                            ? "text-blue-500"
                            : "text-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Vertical */}
          <div className="block md:hidden">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        step.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : currentStep === step.id
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-2 transition-colors duration-300 ${
                          steps[index + 1].completed || currentStep > step.id
                            ? "bg-green-500"
                            : currentStep === step.id
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div
                      className={`font-medium text-sm ${currentStep === step.id ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping Dialog */}
      <Dialog open={mappingDialog.isOpen} onOpenChange={(open) => !open && handleMappingCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Create Field Mapping
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selected JSON Field</Label>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm font-mono">{mappingDialog.selectedPath}</code>
              </div>
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                Selected: "{mappingDialog.selectedText}"
              </div>
            </div>
            <div>
              <Label htmlFor="target-column">Target Table Column</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {selectedColumns.map((column) => (
                    <SelectItem key={column.name} value={column.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{column.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {column.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleMappingCancel}>
              Cancel
            </Button>
            <Button onClick={handleMappingConfirm}>Create Mapping</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content - Full Width */}
      <div className="w-full space-y-6">
        <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number.parseInt(value))}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1">Table Selection</TabsTrigger>
            <TabsTrigger value="2">API Config</TabsTrigger>
            <TabsTrigger value="3">Data Mapping</TabsTrigger>
            <TabsTrigger value="4">Storage</TabsTrigger>
          </TabsList>

          {/* Step 1: Table Selection */}
          <TabsContent value="1">
            <Card>
              <CardHeader>
                <CardTitle>Select Target Table</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the database table where you want to store the ingested data
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTables.map((table) => (
                    <Card
                      key={table.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTable === table.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleTableSelect(table.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{table.name}</div>
                            <div className="text-sm text-muted-foreground">{table.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Show selected table columns */}
                {selectedColumns.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Table Columns ({selectedTable})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedColumns.map((column) => (
                        <div key={column.name} className="p-3 border rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{column.name}</span>
                            {column.primaryKey && <Badge variant="secondary">PK</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{column.type}</div>
                          {column.description && (
                            <div className="text-xs text-muted-foreground mt-1">{column.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: API Configuration */}
          <TabsContent value="2">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">Configure the API endpoint to fetch data from</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-url">API URL</Label>
                  <Input
                    id="api-url"
                    value={apiConfig.url}
                    onChange={(e) => setApiConfig({ ...apiConfig, url: e.target.value })}
                    placeholder="https://api.example.com/data"
                  />
                </div>

                <div>
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select
                    value={apiConfig.method}
                    onValueChange={(value: "GET" | "POST") => setApiConfig({ ...apiConfig, method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="headers">Headers (JSON)</Label>
                  <Textarea
                    id="headers"
                    value={JSON.stringify(apiConfig.headers, null, 2)}
                    onChange={(e) => {
                      try {
                        const headers = JSON.parse(e.target.value)
                        setApiConfig({ ...apiConfig, headers })
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"Content-Type": "application/json"}'
                    rows={3}
                  />
                </div>

                {apiConfig.method === "POST" && (
                  <div>
                    <Label htmlFor="body">Request Body</Label>
                    <Textarea
                      id="body"
                      value={apiConfig.body || ""}
                      onChange={(e) => setApiConfig({ ...apiConfig, body: e.target.value })}
                      placeholder='{"key": "value"}'
                      rows={4}
                    />
                  </div>
                )}

                <Button onClick={handleApiCall} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Settings className="w-4 h-4 mr-2 animate-spin" />
                      Fetching Data...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Fetch Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Data Mapping */}
          <TabsContent value="3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* JSON Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>JSON Data Preview</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select any JSON field to create a mapping to a table column
                  </p>
                </CardHeader>
                <CardContent>
                  {apiResponse ? (
                    <ScrollArea className="h-96 w-full rounded-md border p-4">
                      <pre
                        ref={jsonPreviewRef}
                        className="text-sm cursor-text select-text"
                        onMouseUp={handleJsonSelection}
                        style={{ userSelect: "text" }}
                      >
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </ScrollArea>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>No data available. Please fetch data from the API first.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Field Mappings */}
              <Card>
                <CardHeader>
                  <CardTitle>Field Mappings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Current mappings between JSON fields and table columns
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mappings.length > 0 ? (
                    <>
                      <ScrollArea className="h-80">
                        <div className="space-y-3">
                          {mappings.map((mapping, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Source</span>
                                  <code className="text-sm bg-blue-100 px-2 py-1 rounded">{mapping.sourceField}</code>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Target</span>
                                  <code className="text-sm bg-green-100 px-2 py-1 rounded">{mapping.targetColumn}</code>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleRemoveMapping(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <Button onClick={handleDataStorage} disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <>
                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                            Storing Data...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Store Data ({mappings.length} mappings)
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No field mappings created yet. Select JSON fields in the preview to create mappings.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Step 4: Data Storage */}
          <TabsContent value="4">
            <Card>
              <CardHeader>
                <CardTitle>Data Storage Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Data has been successfully stored to the {selectedTable} table with {mappings.length} field
                    mappings.
                  </AlertDescription>
                </Alert>

                {/* Saved Templates */}
                {templates.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Saved Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {templates.map((template) => (
                        <div key={template.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{template.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleLoadTemplate(template)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          {template.description && (
                            <div className="text-sm text-muted-foreground">{template.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground">{template.mappings.length} mappings</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
