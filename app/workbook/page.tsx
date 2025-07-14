"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Activity,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Shield,
  TrendingUp,
  FileText,
  ArrowRight,
} from "lucide-react"

// Mock data
const mockData = {
  overview: {
    metrics: {
      totalUseCases: 24,
      activePlaybooks: 18,
      openTickets: 7,
      detectionAccuracy: 94.2,
    },
    recentActivity: [
      {
        id: 1,
        type: "SIEM",
        message: "New suspicious login pattern detected",
        timestamp: "2 minutes ago",
        severity: "high",
      },
      {
        id: 2,
        type: "SOAR",
        message: "Ticket #SOC-2024-001 resolved as false positive",
        timestamp: "15 minutes ago",
        severity: "low",
      },
      {
        id: 3,
        type: "Wiki",
        message: "Playbook updated: Phishing Response v2.1",
        timestamp: "1 hour ago",
        severity: "medium",
      },
    ],
  },
  useCases: [
    {
      id: "UC-001",
      title: "Suspicious Login Activity",
      description: "Detects multiple failed login attempts from single IP",
      category: "Authentication",
      severity: "High",
      jiraTicket: "SEC-2024-001",
      siemQuery: "SELECT * FROM auth_logs WHERE failed_attempts > 5 AND time_window < 300",
      lastUpdated: "2024-01-15",
      status: "Active",
    },
    {
      id: "UC-002",
      title: "Data Exfiltration Pattern",
      description: "Identifies unusual data transfer volumes",
      category: "Data Loss Prevention",
      severity: "Critical",
      jiraTicket: "SEC-2024-002",
      siemQuery: "SELECT * FROM network_logs WHERE bytes_out > threshold AND dst_external = true",
      lastUpdated: "2024-01-14",
      status: "Active",
    },
    {
      id: "UC-003",
      title: "Malware Communication",
      description: "Detects C2 communication patterns",
      category: "Malware",
      severity: "High",
      jiraTicket: "SEC-2024-003",
      siemQuery: "SELECT * FROM dns_logs WHERE domain IN (ioc_list) AND query_type = 'A'",
      lastUpdated: "2024-01-13",
      status: "Under Review",
    },
  ],
  playbooks: [
    {
      id: "PB-001",
      title: "Authentication Incident Response",
      description: "Step-by-step guide for handling authentication-related security incidents",
      category: "Authentication",
      steps: 8,
      estimatedTime: "45 minutes",
      lastUpdated: "2024-01-10",
      confluenceUrl: "https://wiki.company.com/playbook-auth-001",
    },
    {
      id: "PB-002",
      title: "Data Loss Prevention Response",
      description: "Procedures for investigating and containing data exfiltration attempts",
      category: "Data Loss Prevention",
      steps: 12,
      estimatedTime: "2 hours",
      lastUpdated: "2024-01-08",
      confluenceUrl: "https://wiki.company.com/playbook-dlp-002",
    },
    {
      id: "PB-003",
      title: "Malware Incident Containment",
      description: "Comprehensive malware analysis and containment procedures",
      category: "Malware",
      steps: 15,
      estimatedTime: "3 hours",
      lastUpdated: "2024-01-05",
      confluenceUrl: "https://wiki.company.com/playbook-malware-003",
    },
  ],
}

export default function WorkbookPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredUseCases = mockData.useCases.filter(
    (useCase) =>
      useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      useCase.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActivitySeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Workbook</h1>
          <p className="text-muted-foreground">Comprehensive security event management and incident response</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Use Cases</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.overview.metrics.totalUseCases}</div>
                <p className="text-xs text-muted-foreground">Active detection rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Playbooks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.overview.metrics.activePlaybooks}</div>
                <p className="text-xs text-muted-foreground">Response procedures</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.overview.metrics.openTickets}</div>
                <p className="text-xs text-muted-foreground">Pending investigation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.overview.metrics.detectionAccuracy}%</div>
                <p className="text-xs text-muted-foreground">True positive rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from SIEM, SOAR, and documentation systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.overview.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <Activity className={`h-4 w-4 ${getActivitySeverityColor(activity.severity)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm font-medium">{activity.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usecases" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search use cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUseCases.map((useCase) => (
              <Card
                key={useCase.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => router.push(`/workbook/usecase/${useCase.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{useCase.id}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge>{useCase.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Severity</span>
                      <Badge className={`text-white ${getSeverityColor(useCase.severity)}`}>{useCase.severity}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={useCase.status === "Active" ? "default" : "secondary"}>{useCase.status}</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">JIRA Ticket</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {useCase.jiraTicket}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.playbooks.map((playbook) => (
              <Card key={playbook.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{playbook.id}</Badge>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{playbook.title}</CardTitle>
                  <CardDescription>{playbook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge>{playbook.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Steps</span>
                      <span className="text-sm font-medium">{playbook.steps}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Time</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{playbook.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{playbook.lastUpdated}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                        onClick={() => window.open(playbook.confluenceUrl, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View in Confluence
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
