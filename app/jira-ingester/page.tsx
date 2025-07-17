"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Database, Download, Filter, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock Jira ticket data
const mockJiraTickets = [
  {
    id: "SEC-1001",
    summary: "Suspicious login attempt detected from unauthorized IP",
    status: "Open",
    priority: "High",
    assignee: "Kim Minjun",
    created: "2023-07-15T08:23:45",
    updated: "2023-07-15T09:12:30",
    reporter: "Security Monitoring System",
    description: "Multiple failed login attempts detected from IP 203.0.113.42 which is not in the allowed range.",
  },
  {
    id: "SEC-1002",
    summary: "Malware detected on workstation WS-42",
    status: "In Progress",
    priority: "Critical",
    assignee: "Park Jiwon",
    created: "2023-07-14T14:05:22",
    updated: "2023-07-15T10:45:12",
    reporter: "Endpoint Protection",
    description:
      "Trojan.Emotet variant detected on workstation WS-42. Initial quarantine successful but further investigation required.",
  },
  {
    id: "SEC-1003",
    summary: "Firewall rule change request for new application server",
    status: "Resolved",
    priority: "Medium",
    assignee: "Lee Seunghoon",
    created: "2023-07-10T09:30:00",
    updated: "2023-07-14T16:22:18",
    reporter: "Jung Hyejin",
    description: "Need to open port 8443 for new application server (10.0.5.23) to communicate with payment gateway.",
  },
  {
    id: "SEC-1004",
    summary: "Data exfiltration attempt blocked",
    status: "Closed",
    priority: "High",
    assignee: "Kim Minjun",
    created: "2023-07-08T22:17:36",
    updated: "2023-07-13T11:05:27",
    reporter: "DLP System",
    description:
      "Attempted upload of sensitive financial documents to unauthorized cloud storage service. User: jsmith@company.com",
  },
  {
    id: "SEC-1005",
    summary: "SSL certificate expiring for customer portal",
    status: "Open",
    priority: "Medium",
    assignee: "Unassigned",
    created: "2023-07-15T07:00:12",
    updated: "2023-07-15T07:00:12",
    reporter: "Monitoring System",
    description: "SSL certificate for customer.company.com will expire in 14 days. Renewal required.",
  },
]

// Generate more mock data for pagination and chunking demonstration
const generateMoreMockData = (count: number) => {
  const result = [...mockJiraTickets]
  for (let i = 0; i < count - mockJiraTickets.length; i++) {
    const baseTicket = mockJiraTickets[i % mockJiraTickets.length]
    const ticketNumber = 1006 + i
    result.push({
      ...baseTicket,
      id: `SEC-${ticketNumber}`,
      summary: `${baseTicket.summary} (${ticketNumber})`,
      created: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  return result
}

export default function JiraIngesterPage() {
  const [jql, setJql] = useState('project = "SEC" AND created &gt;= -30d ORDER BY created DESC')
  const [chunkSize, setChunkSize] = useState(50)
  const [isIngesting, setIsIngesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [ingestedTickets, setIngestedTickets] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("ingestion")
  const [totalTickets, setTotalTickets] = useState(0)
  const [error, setError] = useState("")

  // Handle JQL input change
  const handleJqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJql(e.target.value)
  }

  // Handle chunk size change
  const handleChunkSizeChange = (value: number[]) => {
    setChunkSize(value[0])
  }

  // Start ingestion process
  const startIngestion = async () => {
    if (!jql.trim()) {
      setError("JQL query cannot be empty")
      return
    }

    setError("")
    setIsIngesting(true)
    setProgress(0)
    setCurrentChunk(0)
    setIngestedTickets([])
    setShowResults(false)

    try {
      // Simulate API call to get total count
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockTotalTickets = 120 // Mock total tickets count
      setTotalTickets(mockTotalTickets)

      const mockTotalChunks = Math.ceil(mockTotalTickets / chunkSize)
      setTotalChunks(mockTotalChunks)

      // Generate all mock data upfront
      const allMockData = generateMoreMockData(mockTotalTickets)

      // Process each chunk
      for (let i = 0; i < mockTotalChunks; i++) {
        setCurrentChunk(i + 1)

        // Simulate API call for each chunk
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get chunk data
        const startIdx = i * chunkSize
        const endIdx = Math.min(startIdx + chunkSize, mockTotalTickets)
        const chunkData = allMockData.slice(startIdx, endIdx)

        // Update ingested tickets
        setIngestedTickets((prev) => [...prev, ...chunkData])

        // Update progress
        const newProgress = Math.round(((i + 1) / mockTotalChunks) * 100)
        setProgress(newProgress)
      }

      // Complete ingestion
      setIsIngesting(false)
      setShowResults(true)
      setActiveTab("results")
    } catch (err) {
      setError("An error occurred during ingestion. Please try again.")
      setIsIngesting(false)
    }
  }

  // Reset the form
  const resetForm = () => {
    setJql('project = "SEC" AND created &gt;= -30d ORDER BY created DESC')
    setChunkSize(50)
    setIsIngesting(false)
    setProgress(0)
    setCurrentChunk(0)
    setTotalChunks(0)
    setIngestedTickets([])
    setShowResults(false)
    setError("")
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-500"
      case "in progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-300"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-red-400"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-green-400"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jira Event Ingester</h1>
        <Button variant="outline" onClick={resetForm} className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ingestion">Ingestion Configuration</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>
            Results {showResults && `(${ingestedTickets.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingestion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jira Query Configuration</CardTitle>
              <CardDescription>Enter your JQL (Jira Query Language) to fetch specific tickets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="jql">JQL Query</Label>
                <Textarea
                  id="jql"
                  value={jql}
                  onChange={handleJqlChange}
                  placeholder="Enter your JQL query here..."
                  className="min-h-[100px]"
                  disabled={isIngesting}
                />
                <p className="text-sm text-muted-foreground">
                  Example: project = "SEC" AND created &gt;= -30d ORDER BY created DESC
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chunk-size">Chunk Size: {chunkSize}</Label>
                  <span className="text-sm text-muted-foreground">(Tickets per batch)</span>
                </div>
                <Slider
                  id="chunk-size"
                  defaultValue={[chunkSize]}
                  max={100}
                  min={10}
                  step={10}
                  onValueChange={handleChunkSizeChange}
                  disabled={isIngesting}
                />
                <p className="text-sm text-muted-foreground">
                  Adjust chunk size for large data sets to optimize performance
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={isIngesting}>
                Clear
              </Button>
              <Button onClick={startIngestion} disabled={isIngesting}>
                {isIngesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Start Ingestion
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {isIngesting && (
            <Card>
              <CardHeader>
                <CardTitle>Ingestion Progress</CardTitle>
                <CardDescription>
                  Processing chunk {currentChunk} of {totalChunks}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>{progress}% Complete</span>
                  <span>
                    {ingestedTickets.length} of {totalTickets} tickets ingested
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {showResults && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Ingestion Summary</CardTitle>
                  <CardDescription>Results of your Jira ticket ingestion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{ingestedTickets.length}</div>
                          <p className="text-xs text-muted-foreground">Total Tickets</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {ingestedTickets.filter((t) => t.priority === "High" || t.priority === "Critical").length}
                          </div>
                          <p className="text-xs text-muted-foreground">High Priority</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {ingestedTickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                          </div>
                          <p className="text-xs text-muted-foreground">Open Tickets</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {ingestedTickets.filter((t) => !t.assignee || t.assignee === "Unassigned").length}
                          </div>
                          <p className="text-xs text-muted-foreground">Unassigned</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">
                        Successfully ingested {ingestedTickets.length} tickets in {totalChunks} chunks
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Export Results
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingested Tickets</CardTitle>
                  <CardDescription>Showing {ingestedTickets.length} tickets from your query</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Summary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingestedTickets.slice(0, 10).map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell className="max-w-xs truncate">{ticket.summary}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            </TableCell>
                            <TableCell>{ticket.assignee || "Unassigned"}</TableCell>
                            <TableCell className="text-sm">{new Date(ticket.created).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>
                        {ingestedTickets.length > 10
                          ? `Showing 10 of ${ingestedTickets.length} tickets`
                          : `Showing all ${ingestedTickets.length} tickets`}
                      </TableCaption>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Use filters to narrow down results</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("ingestion")}>
                    Back to Configuration
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
