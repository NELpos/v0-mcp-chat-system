"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for use cases
const useCases = [
  {
    id: "phishing-detection",
    title: "Phishing Email Detection",
    description: "Automated detection and response to phishing attempts",
    severity: "High",
    status: "Active",
    lastUpdated: "2024-01-15",
    playbooks: 3,
    tickets: 45,
    category: "Email Security",
  },
  {
    id: "malware-analysis",
    title: "Malware Analysis & Containment",
    description: "Comprehensive malware detection and isolation procedures",
    severity: "Critical",
    status: "Active",
    lastUpdated: "2024-01-14",
    playbooks: 5,
    tickets: 23,
    category: "Endpoint Security",
  },
  {
    id: "data-breach-response",
    title: "Data Breach Response",
    description: "Incident response procedures for data breach scenarios",
    severity: "Critical",
    status: "Under Review",
    lastUpdated: "2024-01-13",
    playbooks: 4,
    tickets: 12,
    category: "Incident Response",
  },
  {
    id: "ddos-mitigation",
    title: "DDoS Attack Mitigation",
    description: "Network-level protection against distributed denial of service attacks",
    severity: "High",
    status: "Active",
    lastUpdated: "2024-01-12",
    playbooks: 2,
    tickets: 8,
    category: "Network Security",
  },
  {
    id: "insider-threat",
    title: "Insider Threat Detection",
    description: "Monitoring and response to potential insider threats",
    severity: "Medium",
    status: "Active",
    lastUpdated: "2024-01-11",
    playbooks: 3,
    tickets: 15,
    category: "User Behavior",
  },
  {
    id: "vulnerability-management",
    title: "Vulnerability Management",
    description: "Systematic approach to identifying and patching vulnerabilities",
    severity: "Medium",
    status: "Active",
    lastUpdated: "2024-01-10",
    playbooks: 6,
    tickets: 67,
    category: "Vulnerability Management",
  },
]

// Mock data for playbooks
const playbooks = [
  {
    id: "pb-001",
    title: "Email Phishing Response",
    description: "Step-by-step guide for responding to phishing emails",
    useCase: "Phishing Email Detection",
    steps: 8,
    estimatedTime: "30 minutes",
    lastUpdated: "2024-01-15",
    status: "Published",
  },
  {
    id: "pb-002",
    title: "Malware Containment Protocol",
    description: "Immediate containment procedures for malware incidents",
    useCase: "Malware Analysis & Containment",
    steps: 12,
    estimatedTime: "45 minutes",
    lastUpdated: "2024-01-14",
    status: "Published",
  },
  {
    id: "pb-003",
    title: "Data Breach Notification",
    description: "Legal and regulatory notification procedures",
    useCase: "Data Breach Response",
    steps: 6,
    estimatedTime: "2 hours",
    lastUpdated: "2024-01-13",
    status: "Draft",
  },
  {
    id: "pb-004",
    title: "Network Traffic Analysis",
    description: "Analyzing suspicious network traffic patterns",
    useCase: "DDoS Attack Mitigation",
    steps: 10,
    estimatedTime: "1 hour",
    lastUpdated: "2024-01-12",
    status: "Published",
  },
]

// Mock data for tickets
const ticketStats = {
  total: 234,
  open: 45,
  inProgress: 23,
  resolved: 166,
  categories: [
    { name: "Email Security", count: 78, trend: "+12%" },
    { name: "Endpoint Security", count: 56, trend: "+8%" },
    { name: "Network Security", count: 43, trend: "-3%" },
    { name: "Incident Response", count: 34, trend: "+15%" },
    { name: "User Behavior", count: 23, trend: "+5%" },
  ],
}

export default function WorkbookPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  const filteredUseCases = useCases.filter((useCase) => {
    const matchesSearch =
      useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      useCase.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || useCase.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(useCases.map((uc) => uc.category)))]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Published":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleUseCaseClick = (useCaseId: string) => {
    router.push(`/workbook/usecase/${useCaseId}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Blue Team Workbook</h2>
      </div>

      <Tabs defaultValue="use-cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="use-cases" className="space-y-6">
          {/* Enhanced Google-style Search Section */}
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Search security use cases, playbooks, and procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg rounded-full border-2 border-gray-200 shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-200 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div className="text-sm text-muted-foreground">
                Found {filteredUseCases.length} result{filteredUseCases.length !== 1 ? "s" : ""} for "{searchTerm}"
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUseCases.map((useCase) => (
              <Card
                key={useCase.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleUseCaseClick(useCase.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-sm">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getSeverityColor(useCase.severity)}>{useCase.severity}</Badge>
                    <Badge className={getStatusColor(useCase.status)}>{useCase.status}</Badge>
                    <Badge variant="outline">{useCase.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {useCase.playbooks} playbooks
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {useCase.tickets} tickets
                      </span>
                    </div>
                    <span>{useCase.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {playbooks.map((playbook) => (
              <Card key={playbook.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{playbook.title}</CardTitle>
                    <Badge className={getStatusColor(playbook.status)}>{playbook.status}</Badge>
                  </div>
                  <CardDescription>{playbook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Use Case:</span>
                      <span className="font-medium">{playbook.useCase}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Steps:</span>
                      <span className="font-medium">{playbook.steps}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Est. Time:</span>
                      <span className="font-medium">{playbook.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{playbook.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ticketStats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{ticketStats.open}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
              <CardDescription>Distribution of tickets across security categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketStats.categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{category.name}</div>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        category.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {category.trend}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
