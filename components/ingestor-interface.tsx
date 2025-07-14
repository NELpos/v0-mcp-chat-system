"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Play, CheckCircle, Clock, ArrowRight, Download, Zap, MapPin, Save } from "lucide-react"

interface ApiResponse {
  id: string
  name: string
  email: string
  department: string
  salary: number
  joinDate: string
  status: string
}

interface FieldMapping {
  jsonField: string
  tableColumn: string
  dataType: string
}

const mockTables = [
  {
    id: "employees",
    name: "employees",
    description: "Employee information and records",
    columns: ["id", "name", "email", "department", "salary", "join_date", "status"],
    rowCount: 1250,
    lastUpdated: "2024-01-15",
  },
  {
    id: "customers",
    name: "customers",
    description: "Customer database with contact information",
    columns: ["customer_id", "company_name", "contact_person", "email", "phone", "address", "created_at"],
    rowCount: 3420,
    lastUpdated: "2024-01-14",
  },
  {
    id: "orders",
    name: "orders",
    description: "Order transactions and details",
    columns: ["order_id", "customer_id", "product_id", "quantity", "price", "order_date", "status"],
    rowCount: 8750,
    lastUpdated: "2024-01-15",
  },
  {
    id: "products",
    name: "products",
    description: "Product catalog and inventory",
    columns: ["product_id", "name", "description", "category", "price", "stock_quantity", "supplier_id"],
    rowCount: 560,
    lastUpdated: "2024-01-13",
  },
]

const mockApiResponse: ApiResponse[] = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    salary: 75000,
    joinDate: "2023-03-15",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    salary: 68000,
    joinDate: "2023-01-20",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Sales",
    salary: 72000,
    joinDate: "2022-11-10",
    status: "Active",
  },
]

const steps = [
  { id: 1, title: "Table Selection", completed: false, current: true },
  { id: 2, title: "API Configuration", completed: false, current: false },
  { id: 3, title: "Data Mapping", completed: false, current: false },
  { id: 4, title: "Data Storage", completed: false, current: false },
]

export function IngestorInterface() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTable, setSelectedTable] = useState<any | null>(null)
  const [apiUrl, setApiUrl] = useState("https://api.example.com/employees")
  const [apiKey, setApiKey] = useState("")
  const [apiResponse, setApiResponse] = useState<ApiResponse[] | null>(null)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [selectedJsonText, setSelectedJsonText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMappingDialog, setShowMappingDialog] = useState(false)
  const [selectedTableColumn, setSelectedTableColumn] = useState("")

  const handleTableSelect = (table: any) => {
    setSelectedTable(table)
    setCurrentStep(2)
  }

  const handleApiCall = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setApiResponse(mockApiResponse)
      setIsLoading(false)
      setCurrentStep(3)
    }, 2000)
  }

  const handleJsonSelection = (selectedText: string) => {
    setSelectedJsonText(selectedText)
    setShowMappingDialog(true)
  }

  const handleFieldMapping = () => {
    if (selectedJsonText && selectedTableColumn) {
      const newMapping: FieldMapping = {
        jsonField: selectedJsonText,
        tableColumn: selectedTableColumn,
        dataType: "string", // Default type
      }

      setFieldMappings([...fieldMappings, newMapping])
      setShowMappingDialog(false)
      setSelectedJsonText("")
      setSelectedTableColumn("")
    }
  }

  const handleSaveData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(4)
    }, 1500)
  }

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Ingestor</h1>
          <p className="text-muted-foreground">Streamlined workflow for data ingestion and field mapping</p>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Workflow Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center min-w-0 flex-1">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-green-500 border-green-500 text-white shadow-lg"
                        : step.current
                          ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1">
                    <p
                      className={`text-sm font-medium ${
                        step.completed || step.current ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step.completed ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Select Target Table</span>
            </CardTitle>
            <CardDescription>Choose the database table where you want to store the ingested data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTables.map((table) => (
                <Card
                  key={table.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTable?.id === table.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => handleTableSelect(table)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{table.name}</CardTitle>
                      <Database className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>{table.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Columns:</span>
                        <span className="font-medium">{table.columns.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rows:</span>
                        <span className="font-medium">{table.rowCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Updated:</span>
                        <span className="font-medium">{table.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTable && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Selected Table: {selectedTable.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedTable.columns.map((column) => (
                    <Badge key={column} variant="outline">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && selectedTable && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>Configure the API endpoint to fetch data for ingestion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Endpoint URL</Label>
                <Input
                  id="api-url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.example.com/data"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key if required"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={handleApiCall} disabled={isLoading || !apiUrl}>
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Fetching Data...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Fetch Data
                  </>
                )}
              </Button>

              {isLoading && (
                <div className="flex-1">
                  <Progress value={33} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">Connecting to API...</p>
                </div>
              )}
            </div>

            {apiResponse && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">API Response Preview</h4>
                  <Badge variant="outline">{apiResponse.length} records</Badge>
                </div>
                <pre className="text-sm bg-background p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(apiResponse[0], null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && apiResponse && selectedTable && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>API JSON Response</span>
              </CardTitle>
              <CardDescription>Select JSON fields to map to table columns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <pre
                  className="text-sm bg-muted p-4 rounded border overflow-auto max-h-96 cursor-text select-text"
                  onMouseUp={() => {
                    const selection = window.getSelection()
                    if (selection && selection.toString().trim()) {
                      handleJsonSelection(selection.toString().trim())
                    }
                  }}
                >
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
                <p className="text-sm text-muted-foreground">
                  Select any text in the JSON above to create field mappings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Field Mappings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Field Mappings</span>
              </CardTitle>
              <CardDescription>Map JSON fields to table columns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fieldMappings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <span className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No field mappings created yet</p>
                    <p className="text-sm">Select JSON text to start mapping</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fieldMappings.map((mapping, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{mapping.jsonField}</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Badge>{mapping.tableColumn}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFieldMappings(fieldMappings.filter((_, i) => i !== index))
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button onClick={handleSaveData} disabled={fieldMappings.length === 0} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Mappings & Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Data Storage Complete</span>
            </CardTitle>
            <CardDescription>Data has been successfully ingested and stored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold">Records Processed</p>
                  <p className="text-2xl font-bold text-green-600">{apiResponse?.length || 0}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">Fields Mapped</p>
                  <p className="text-2xl font-bold text-blue-600">{fieldMappings.length}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <span className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold">Target Table</p>
                  <p className="text-lg font-bold text-purple-600">{selectedTable?.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedTable(null)
                    setApiResponse(null)
                    setFieldMappings([])
                  }}
                >
                  Start New Ingestion
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Field Mapping</DialogTitle>
            <DialogDescription>Map the selected JSON field to a table column</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selected JSON Field</Label>
              <Input value={selectedJsonText} disabled />
            </div>
            <div>
              <Label>Target Table Column</Label>
              <Select value={selectedTableColumn} onValueChange={setSelectedTableColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTable?.columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleFieldMapping} disabled={!selectedTableColumn}>
                Create Mapping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IngestorInterface
