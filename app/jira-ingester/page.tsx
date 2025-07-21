"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Download, Play, CheckCircle, AlertCircle, Clock, Users, FileText } from "lucide-react"

// Mock Jira ticket data
const mockJiraTickets = [
  {
    id: "SEC-1001",
    summary: "Suspicious login attempts from multiple IP addresses",
    status: "Open",
    priority: "High",
    assignee: "John Smith",
    created: "2024-01-15T10:30:00Z",
    description: "Multiple failed login attempts detected from different geographical locations",
  },
  {
    id: "SEC-1002",
    summary: "Malware detected on endpoint device",
    status: "In Progress",
    priority: "Critical",
    assignee: "Sarah Johnson",
    created: "2024-01-15T09:15:00Z",
    description: "Endpoint protection software detected potential malware on user workstation",
  },
  {
    id: "SEC-1003",
    summary: "Phishing email reported by user",
    status: "Resolved",
    priority: "Medium",
    assignee: "Mike Davis",
    created: "2024-01-14T16:45:00Z",
    description: "User reported suspicious email with potential phishing content",
  },
  {
    id: "SEC-1004",
    summary: "Unauthorized access attempt to database",
    status: "Open",
    priority: "Critical",
    assignee: "Lisa Chen",
    created: "2024-01-14T14:20:00Z",
    description: "Database access logs show unauthorized connection attempts",
  },
  {
    id: "SEC-1005",
    summary: "VPN connection issues for remote users",
    status: "Closed",
    priority: "Low",
    assignee: "Tom Wilson",
    created: "2024-01-13T11:30:00Z",
    description: "Multiple users reporting VPN connectivity problems",
  },
]

export default function JiraIngesterPage() {
  const [jql, setJql] = useState('project = "SEC" AND created &gt;= -30d ORDER BY created DESC')
  const [chunkSize, setChunkSize] = useState([50])
  const [isIngesting, setIsIngesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [ingestedTickets, setIngestedTickets] = useState<typeof mockJiraTickets>([])
  const [ingestionComplete, setIngestionComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("configuration")

  const handleIngest = async () => {
    if (!jql.trim()) {
      alert("Please enter a JQL query")
      return
    }

    setIsIngesting(true)
    setProgress(0)
    setIngestionComplete(false)
    setActiveTab("results")

    // Simulate API call and chunking
    const totalTickets = mockJiraTickets.length
    const chunks = Math.ceil(totalTickets / chunkSize[0])
    setTotalChunks(chunks)

    const allTickets = []

    for (let i = 0; i < chunks; i++) {
      setCurrentChunk(i + 1)

      // Simulate chunk processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get tickets for this chunk
      const startIndex = i * chunkSize[0]
      const endIndex = Math.min(startIndex + chunkSize[0], totalTickets)
      const chunkTickets = mockJiraTickets.slice(startIndex, endIndex)

      allTickets.push(...chunkTickets)
      setIngestedTickets([...allTickets])

      // Update progress
      const progressValue = ((i + 1) / chunks) * 100
      setProgress(progressValue)
    }

    setIsIngesting(false)
    setIngestionComplete(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "destructive"
      case "in progress":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jira Event Ingester</h1>
          <p className="text-muted-foreground">
            Collect and store Jira tickets using JQL queries with configurable chunk processing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JQL Configuration</CardTitle>
              <CardDescription>Enter your Jira Query Language (JQL) to specify which tickets to ingest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jql">JQL Query</Label>
                <Textarea
                  id="jql"
                  placeholder="Enter your JQL query here..."
                  value={jql}
                  onChange={(e) => setJql(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Example: project = "SEC" AND created &gt;= -30d ORDER BY created DESC
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Chunk Size: {chunkSize[0]} tickets per chunk</Label>
                  <Slider
                    value={chunkSize}
                    onValueChange={setChunkSize}
                    max={100}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adjust chunk size for processing large datasets. Smaller chunks reduce memory usage but increase
                    processing time.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleIngest}
                  disabled={isIngesting || !jql.trim()}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isIngesting ? "Ingesting..." : "Start Ingestion"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingestion Preview</CardTitle>
              <CardDescription>Preview of the ingestion process configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Query Length</div>
                    <div className="text-sm text-muted-foreground">{jql.length} characters</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Chunk Size</div>
                    <div className="text-sm text-muted-foreground">{chunkSize[0]} tickets</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Est. Chunks</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.ceil(mockJiraTickets.length / chunkSize[0])} chunks
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {isIngesting && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 animate-pulse text-blue-600" />
                  Ingestion in Progress
                </CardTitle>
                <CardDescription>Processing Jira tickets in chunks of {chunkSize[0]}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Chunk:</span>
                    <span className="ml-2 font-medium">
                      {currentChunk} of {totalChunks}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tickets Processed:</span>
                    <span className="ml-2 font-medium">{ingestedTickets.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium text-blue-600">Processing...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {ingestionComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Ingestion Complete
                </CardTitle>
                <CardDescription>
                  Successfully ingested {ingestedTickets.length} tickets in {totalChunks} chunks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Statistics */}
          {ingestedTickets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{ingestedTickets.length}</div>
                      <div className="text-sm text-muted-foreground">Total Tickets</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {ingestedTickets.filter((t) => t.priority === "Critical" || t.priority === "High").length}
                      </div>
                      <div className="text-sm text-muted-foreground">High Priority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {ingestedTickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Open Tickets</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{new Set(ingestedTickets.map((t) => t.assignee)).size}</div>
                      <div className="text-sm text-muted-foreground">Assignees</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ingested Tickets Table */}
          {ingestedTickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ingested Tickets</CardTitle>
                <CardDescription>List of tickets successfully ingested from Jira</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingestedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono">{ticket.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.summary}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell>{ticket.assignee}</TableCell>
                        <TableCell>{new Date(ticket.created).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isIngesting && ingestedTickets.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Data Ingested</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your JQL query and start the ingestion process to see results here.
                </p>
                <Button onClick={() => setActiveTab("configuration")} variant="outline">
                  Go to Configuration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
