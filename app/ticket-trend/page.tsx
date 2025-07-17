"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Treemap, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { TrendingUpIcon, TicketIcon, FilterIcon } from "lucide-react"

interface TicketData {
  id: string
  type: string
  category: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  assignee: string
  createdAt: string
  resolvedAt?: string
  processingTime?: number // in hours
  count: number
  value: number // for treemap sizing
}

const mockTicketData: TicketData[] = [
  {
    id: "TKT-001",
    type: "Malware Detection",
    category: "Security Incident",
    priority: "Critical",
    status: "Resolved",
    assignee: "John Smith",
    createdAt: "2024-01-15T10:30:00",
    resolvedAt: "2024-01-15T14:20:00",
    processingTime: 3.8,
    count: 45,
    value: 45,
  },
  {
    id: "TKT-002",
    type: "Phishing Email",
    category: "Email Security",
    priority: "High",
    status: "Resolved",
    assignee: "Sarah Johnson",
    createdAt: "2024-01-14T09:15:00",
    resolvedAt: "2024-01-14T16:30:00",
    processingTime: 7.2,
    count: 38,
    value: 38,
  },
  {
    id: "TKT-003",
    type: "Suspicious Login",
    category: "Authentication",
    priority: "Medium",
    status: "In Progress",
    assignee: "Mike Davis",
    createdAt: "2024-01-13T16:20:00",
    processingTime: 12.5,
    count: 32,
    value: 32,
  },
  {
    id: "TKT-004",
    type: "Data Exfiltration",
    category: "Data Loss Prevention",
    priority: "Critical",
    status: "Open",
    assignee: "Lisa Wilson",
    createdAt: "2024-01-12T14:10:00",
    processingTime: 18.3,
    count: 28,
    value: 28,
  },
  {
    id: "TKT-005",
    type: "Network Anomaly",
    category: "Network Security",
    priority: "Low",
    status: "Closed",
    assignee: "Tom Brown",
    createdAt: "2024-01-11T11:45:00",
    resolvedAt: "2024-01-12T08:30:00",
    processingTime: 20.8,
    count: 25,
    value: 25,
  },
  {
    id: "TKT-006",
    type: "Vulnerability Scan",
    category: "Vulnerability Management",
    priority: "Medium",
    status: "Resolved",
    assignee: "Emma Garcia",
    createdAt: "2024-01-10T13:25:00",
    resolvedAt: "2024-01-11T09:15:00",
    processingTime: 19.8,
    count: 22,
    value: 22,
  },
  {
    id: "TKT-007",
    type: "Policy Violation",
    category: "Compliance",
    priority: "Low",
    status: "Resolved",
    assignee: "David Lee",
    createdAt: "2024-01-09T15:40:00",
    resolvedAt: "2024-01-10T11:20:00",
    processingTime: 19.7,
    count: 18,
    value: 18,
  },
  {
    id: "TKT-008",
    type: "Insider Threat",
    category: "Behavioral Analysis",
    priority: "High",
    status: "In Progress",
    assignee: "Rachel Kim",
    createdAt: "2024-01-08T12:15:00",
    processingTime: 25.2,
    count: 15,
    value: 15,
  },
  {
    id: "TKT-009",
    type: "DDoS Attack",
    category: "Network Security",
    priority: "Critical",
    status: "Resolved",
    assignee: "Alex Chen",
    createdAt: "2024-01-07T16:30:00",
    resolvedAt: "2024-01-08T10:45:00",
    processingTime: 18.2,
    count: 12,
    value: 12,
  },
  {
    id: "TKT-010",
    type: "Unauthorized Access",
    category: "Access Control",
    priority: "High",
    status: "Open",
    assignee: "Maria Rodriguez",
    createdAt: "2024-01-06T14:20:00",
    processingTime: 30.1,
    count: 10,
    value: 10,
  },
]

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ff0000",
  "#0000ff",
  "#ffff00",
]

export default function TicketTrendPage() {
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<TicketData[]>(mockTicketData)

  const handleTreemapClick = (data: any) => {
    if (data && data.type) {
      setSelectedTicketType(data.type)
      const filtered = mockTicketData.filter((ticket) => ticket.type === data.type)
      setFilteredData(filtered)
    }
  }

  const resetFilter = () => {
    setSelectedTicketType(null)
    setFilteredData(mockTicketData)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-black"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalTickets = filteredData.reduce((sum, ticket) => sum + ticket.count, 0)
  const avgProcessingTime =
    filteredData.reduce((sum, ticket) => sum + (ticket.processingTime || 0), 0) / filteredData.length
  const criticalTickets = filteredData
    .filter((ticket) => ticket.priority === "Critical")
    .reduce((sum, ticket) => sum + ticket.count, 0)
  const openTickets = filteredData
    .filter((ticket) => ticket.status === "Open" || ticket.status === "In Progress")
    .reduce((sum, ticket) => sum + ticket.count, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUpIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Ticket Trend Analysis</h1>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
              <TicketIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold">{avgProcessingTime.toFixed(1)}h</p>
              </div>
              <Badge className="bg-blue-500">Time</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Tickets</p>
                <p className="text-2xl font-bold text-red-600">{criticalTickets}</p>
              </div>
              <Badge className="bg-red-500">!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-orange-600">{openTickets}</p>
              </div>
              <Badge className="bg-orange-500">Open</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treemap Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Ticket Type Distribution
              </CardTitle>
              <CardDescription>
                Interactive treemap showing ticket volume by type. Click on a section to filter the data below.
              </CardDescription>
            </div>
            {selectedTicketType && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FilterIcon className="h-3 w-3" />
                  Filtered: {selectedTicketType}
                </Badge>
                <button onClick={resetFilter} className="text-sm text-muted-foreground hover:text-foreground underline">
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={mockTicketData}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                onClick={handleTreemapClick}
                className="cursor-pointer"
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.type}</p>
                          <p className="text-sm text-muted-foreground">Category: {data.category}</p>
                          <p className="text-sm">Count: {data.count} tickets</p>
                          <p className="text-sm">Avg Processing: {data.processingTime?.toFixed(1)}h</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to filter table</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {mockTicketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Treemap>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Raw Ticket Data
            {selectedTicketType && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                - Filtered by: {selectedTicketType}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Detailed view of ticket processing data. {filteredData.length} of {mockTicketData.length} tickets shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.type}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{ticket.count}</TableCell>
                  <TableCell>{ticket.processingTime?.toFixed(1)}h</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
