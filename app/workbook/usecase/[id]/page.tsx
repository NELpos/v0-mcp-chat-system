"use client"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Code,
  Search,
  User,
  Building,
  Tag,
  FileText,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

// Mock data for use case details
const mockUseCaseDetails = {
  "UC-001": {
    id: "UC-001",
    title: "Suspicious Login Activity",
    description:
      "This use case detects multiple failed login attempts from a single IP address within a short time window. It helps identify potential brute force attacks, credential stuffing attempts, and other authentication-based threats. The detection logic monitors authentication logs for patterns that indicate malicious activity, such as rapid successive login failures, attempts from unusual geographic locations, or login attempts outside normal business hours.",
    category: "Authentication",
    severity: "High",
    jiraTicket: "SEC-2024-001",
    reporter: "alice.smith@company.com",
    usecase_code: "AUTH_BRUTE_FORCE_001",
    projectLabels: ["Authentication", "Brute Force", "Login Security", "Threat Detection"],
    reporterName: "Alice Smith",
    organization: ["Security Operations Center", "Incident Response Team", "Blue Team"],
    sourceType: "Windows Security Logs",
    ticketId: "JIRA-SEC-2024-001",
    splQuery: `index=security sourcetype=auth_logs
| eval time_window=300
| stats count as failed_attempts by src_ip, user, _time
| where failed_attempts > 5
| eval time_diff = _time - lag(_time)
| where time_diff < time_window
| table _time, src_ip, user, failed_attempts
| sort -_time`,
    drilldownQuery: `index=security sourcetype=auth_logs src_ip="$click.value$"
| eval success=if(action="success", 1, 0)
| eval failure=if(action="failure", 1, 0)
| stats sum(success) as successful_logins, sum(failure) as failed_logins by user, src_ip
| eval success_rate=round((successful_logins/(successful_logins+failed_logins))*100, 2)
| table user, src_ip, successful_logins, failed_logins, success_rate
| sort -failed_logins`,
    lastUpdated: "2024-01-15",
    status: "Active",
    relatedPlaybooks: [
      {
        id: "PB-001",
        title: "Authentication Incident Response",
        description: "Step-by-step guide for handling authentication-related security incidents",
        steps: 8,
        estimatedTime: "45 minutes",
        analysisSteps: [
          {
            step: 1,
            title: "Initial Event Triage",
            description: "Assess the event and determine scope",
            todos: [
              "Review event details and metadata",
              "Determine affected user accounts",
              "Check for similar events in timeframe",
              "Assess potential business impact",
            ],
          },
          {
            step: 2,
            title: "Evidence Collection",
            description: "Gather relevant logs and forensic evidence",
            todos: [
              "Collect authentication logs",
              "Gather network connection logs",
              "Document source IP geolocation",
              "Preserve relevant system snapshots",
            ],
          },
          {
            step: 3,
            title: "Impact Assessment",
            description: "Evaluate the scope and impact of the incident",
            todos: [
              "Identify all affected systems",
              "Assess data access attempts",
              "Check for privilege escalation",
              "Document timeline of events",
            ],
          },
          {
            step: 4,
            title: "Containment Actions",
            description: "Implement immediate containment measures",
            todos: [
              "Block suspicious IP addresses",
              "Disable compromised accounts",
              "Reset affected user passwords",
              "Enable additional monitoring",
            ],
          },
          {
            step: 5,
            title: "Root Cause Analysis",
            description: "Investigate underlying causes",
            todos: [
              "Analyze attack vectors used",
              "Review security control effectiveness",
              "Identify security gaps",
              "Document lessons learned",
            ],
          },
          {
            step: 6,
            title: "Recovery Planning",
            description: "Plan and execute recovery procedures",
            todos: [
              "Restore affected systems",
              "Re-enable user accounts safely",
              "Implement additional security measures",
              "Verify system integrity",
            ],
          },
          {
            step: 7,
            title: "Communication & Reporting",
            description: "Notify stakeholders and document findings",
            todos: [
              "Notify affected users",
              "Update management on status",
              "Prepare incident report",
              "Communicate with legal/compliance",
            ],
          },
          {
            step: 8,
            title: "Post-Incident Review",
            description: "Conduct lessons learned session",
            todos: [
              "Review response effectiveness",
              "Update procedures if needed",
              "Provide team training",
              "Implement preventive measures",
            ],
          },
        ],
      },
    ],
    eventAnalytics: {
      totalEvents: 156,
      truePositives: 23,
      falsePositives: 133,
      accuracy: 14.7,
      monthlyTrends: [
        { month: "Jul", truePositives: 18, falsePositives: 142, total: 160 },
        { month: "Aug", truePositives: 22, falsePositives: 138, total: 160 },
        { month: "Sep", truePositives: 25, falsePositives: 135, total: 160 },
        { month: "Oct", truePositives: 28, falsePositives: 132, total: 160 },
        { month: "Nov", truePositives: 31, falsePositives: 129, total: 160 },
        { month: "Dec", truePositives: 23, falsePositives: 133, total: 156 },
      ],
      dwellTimeAnalytics: {
        averageDwellTime: 4.2, // hours
        averageMitigationTime: 2.8, // hours
        stageBreakdown: {
          storedTime: 0.3,
          notableCreateTime: 0.2,
          ticketCreateTime: 0.1,
          automationTime: 0.8,
          pickupTime: 1.2,
          analysisTime: 1.5,
          respondTime: 0.1,
        },
        recentEvents: [
          {
            eventId: "EVT-001",
            totalDwellTime: 5.2,
            stages: {
              storedTime: 0.4,
              notableCreateTime: 0.3,
              ticketCreateTime: 0.1,
              automationTime: 1.0,
              pickupTime: 1.5,
              analysisTime: 1.8,
              respondTime: 0.1,
            },
          },
          {
            eventId: "EVT-002",
            totalDwellTime: 3.8,
            stages: {
              storedTime: 0.2,
              notableCreateTime: 0.1,
              ticketCreateTime: 0.1,
              automationTime: 0.6,
              pickupTime: 1.0,
              analysisTime: 1.6,
              respondTime: 0.2,
            },
          },
          {
            eventId: "EVT-003",
            totalDwellTime: 6.1,
            stages: {
              storedTime: 0.5,
              notableCreateTime: 0.4,
              ticketCreateTime: 0.2,
              automationTime: 1.2,
              pickupTime: 2.0,
              analysisTime: 1.6,
              respondTime: 0.2,
            },
          },
        ],
      },
    },
    recentEvents: [
      {
        id: "EVT-001",
        timestamp: "2024-01-15 14:30:22",
        sourceIp: "192.168.1.100",
        targetUser: "john.doe@company.com",
        attempts: 7,
        status: "Investigating",
        analyst: "Alice Smith",
      },
      {
        id: "EVT-002",
        timestamp: "2024-01-15 13:45:11",
        sourceIp: "10.0.0.50",
        targetUser: "jane.smith@company.com",
        attempts: 12,
        status: "False Positive",
        analyst: "Bob Johnson",
      },
      {
        id: "EVT-003",
        timestamp: "2024-01-15 12:15:33",
        sourceIp: "203.0.113.45",
        targetUser: "admin@company.com",
        attempts: 15,
        status: "True Positive",
        analyst: "Carol Davis",
      },
    ],
  },
}

const DwellTimeTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.originalTotal
    return (
      <div className="p-2 text-xs bg-background border rounded-md shadow-lg">
        <p className="font-bold">{`${label}`}</p>
        <p className="font-medium">{`Total Dwell Time: ${total.toFixed(2)}h`}</p>
        <ul className="mt-1">
          {payload
            .slice()
            .reverse()
            .map((p, index) => (
              <li key={index} style={{ color: p.color }}>
                {`${p.name}: ${p.payload.originalStages[p.dataKey as string].toFixed(2)}h`}
              </li>
            ))}
        </ul>
      </div>
    )
  }
  return null
}

export default function UseCaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const useCaseId = params.id as string

  const useCaseDetail = mockUseCaseDetails[useCaseId as keyof typeof mockUseCaseDetails]

  if (!useCaseDetail) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Use Case Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested use case could not be found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

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

  const dwellTimeEvents = useCaseDetail.eventAnalytics.dwellTimeAnalytics.recentEvents
  const maxDwellTime = Math.max(...dwellTimeEvents.map((e) => e.totalDwellTime))

  const normalizedDwellTimeData = dwellTimeEvents.map((event) => ({
    eventId: event.eventId,
    originalTotal: event.totalDwellTime,
    originalStages: event.stages,
    storedTime: event.stages.storedTime / maxDwellTime,
    notableCreateTime: event.stages.notableCreateTime / maxDwellTime,
    ticketCreateTime: event.stages.ticketCreateTime / maxDwellTime,
    automationTime: event.stages.automationTime / maxDwellTime,
    pickupTime: event.stages.pickupTime / maxDwellTime,
    analysisTime: event.stages.analysisTime / maxDwellTime,
    respondTime: event.stages.respondTime / maxDwellTime,
  }))

  const dwellTimeStageColors = [
    { name: "Stored Time", key: "storedTime", color: "#6366F1" },
    { name: "Notable Create", key: "notableCreateTime", color: "#818CF8" },
    { name: "Ticket Create", key: "ticketCreateTime", color: "#A5B4FC" },
    { name: "Automation", key: "automationTime", color: "#34D399" },
    { name: "Pickup Time", key: "pickupTime", color: "#6EE7B7" },
    { name: "Analysis Time", key: "analysisTime", color: "#FBBF24" },
    { name: "Respond Time", key: "respondTime", color: "#FCD34D" },
  ]

  const generateAiSummary = () => {
    const { accuracy } = useCaseDetail.eventAnalytics
    const { averageDwellTime, stageBreakdown } = useCaseDetail.eventAnalytics.dwellTimeAnalytics
    const pickupTimePercentage = (stageBreakdown.pickupTime / averageDwellTime) * 100

    let result = "Operating Normally"
    let resultVariant: "default" | "destructive" | "secondary" = "default"
    const findings = []
    const recommendations = []
    const strengths = []
    const weaknesses = []

    // Accuracy Analysis
    if (accuracy < 20) {
      result = "Fine-tuning Recommended"
      resultVariant = "destructive"
      weaknesses.push(`Low accuracy (${accuracy}%) indicates a high volume of false positives.`)
      recommendations.push("Refine the SIEM query to be more specific and reduce noise.")
    } else if (accuracy > 75) {
      strengths.push(`High accuracy (${accuracy}%) effectively identifies true threats.`)
    } else {
      strengths.push(`Moderate accuracy (${accuracy}%) provides a reasonable signal-to-noise ratio.`)
    }
    findings.push(`Detection accuracy is currently at ${accuracy}%.`)

    // Dwell Time Analysis
    if (averageDwellTime > 5) {
      weaknesses.push(`High average Dwell Time (${averageDwellTime}h) slows down incident response.`)
      recommendations.push(
        "Investigate bottlenecks in the response process, particularly in automation and analysis stages.",
      )
    } else {
      strengths.push(`Efficient average Dwell Time (${averageDwellTime}h) enables quick response.`)
    }
    findings.push(`The average end-to-end response time (Dwell Time) is ${averageDwellTime} hours.`)

    // Pickup Time Analysis
    if (pickupTimePercentage > 30) {
      if (result !== "Fine-tuning Recommended") {
        result = "Process Review Recommended"
        resultVariant = "secondary"
      }
      weaknesses.push(
        `Analyst pickup time constitutes a significant portion (${pickupTimePercentage.toFixed(
          0,
        )}%) of the total Dwell Time.`,
      )
      recommendations.push("Review analyst workload and consider automated ticket assignment to reduce pickup delays.")
    }
    findings.push(`Analyst pickup time accounts for ${pickupTimePercentage.toFixed(0)}% of the Dwell Time.`)

    if (recommendations.length === 0) {
      recommendations.push("No critical issues detected. Continue monitoring performance.")
    }

    return { result, resultVariant, findings, recommendations, strengths, weaknesses }
  }

  const aiSummary = generateAiSummary()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Use Cases
        </Button>
      </div>

      {/* Use Case Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{useCaseDetail.id}</Badge>
                <Badge className={getSeverityColor(useCaseDetail.severity)}>{useCaseDetail.severity}</Badge>
                <Badge variant="secondary">{useCaseDetail.category}</Badge>
                <Badge variant={useCaseDetail.status === "Active" ? "default" : "secondary"}>
                  {useCaseDetail.status}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{useCaseDetail.title}</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              {useCaseDetail.jiraTicket}
            </Button>
          </div>
          <CardDescription>Last updated: {useCaseDetail.lastUpdated}</CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
          <TabsTrigger value="playbooks">Related Playbooks</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{useCaseDetail.description}</p>
            </CardContent>
          </Card>

          {/* Additional Fields Section */}
          <Card>
            <CardHeader>
              <CardTitle>Use Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporter */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Reporter</label>
                  </div>
                  <p className="text-sm text-muted-foreground">{useCaseDetail.reporter}</p>
                </div>

                {/* Use Case Code */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Use Case Code</label>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {useCaseDetail.usecase_code}
                  </Badge>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Severity</label>
                  </div>
                  <Badge className={getSeverityColor(useCaseDetail.severity)}>{useCaseDetail.severity}</Badge>
                </div>

                {/* Reporter Name */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Reporter Name</label>
                  </div>
                  <p className="text-sm text-muted-foreground">{useCaseDetail.reporterName}</p>
                </div>

                {/* Source Type */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Source Type</label>
                  </div>
                  <p className="text-sm text-muted-foreground">{useCaseDetail.sourceType}</p>
                </div>

                {/* Ticket ID */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Ticket ID</label>
                  </div>
                  <Badge variant="outline">{useCaseDetail.ticketId}</Badge>
                </div>
              </div>

              {/* Project Labels */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Project Labels</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {useCaseDetail.projectLabels.map((label, index) => (
                    <Badge key={index} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Organization</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {useCaseDetail.organization.map((org, index) => (
                    <Badge key={index} variant="outline">
                      {org}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SPL Query Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                SPL Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{useCaseDetail.splQuery}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Drilldown Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Drilldown Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{useCaseDetail.drilldownQuery}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Event Analytics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Performance metrics and trends for this use case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{useCaseDetail.eventAnalytics.totalEvents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">True Positives</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {useCaseDetail.eventAnalytics.truePositives}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">False Positives</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{useCaseDetail.eventAnalytics.falsePositives}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{useCaseDetail.eventAnalytics.accuracy}%</div>
                    <Progress value={useCaseDetail.eventAnalytics.accuracy} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly True/False Positive Trends</CardTitle>
                  <CardDescription>Comparison of true positives vs false positives over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={useCaseDetail.eventAnalytics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="truePositives"
                          stroke="#22c55e"
                          strokeWidth={2}
                          name="True Positives"
                        />
                        <Line
                          type="monotone"
                          dataKey="falsePositives"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="False Positives"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Dwell Time Analytics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Dwell Time Analytics</CardTitle>
              <CardDescription>Response time analysis and stage breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Dwell Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {useCaseDetail.eventAnalytics.dwellTimeAnalytics.averageDwellTime}h
                    </div>
                    <p className="text-xs text-muted-foreground">End-to-end response time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Longest Dwell Time</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{maxDwellTime.toFixed(2)}h</div>
                    <p className="text-xs text-muted-foreground">Baseline for normalization</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        (useCaseDetail.eventAnalytics.dwellTimeAnalytics.averageMitigationTime /
                          useCaseDetail.eventAnalytics.dwellTimeAnalytics.averageDwellTime) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">Mitigation vs Total Time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Normalized Dwell Time Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Normalized Dwell Time Comparison</CardTitle>
                  <CardDescription>
                    Relative Dwell Time of events compared to the longest event ({maxDwellTime.toFixed(2)}h)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={normalizedDwellTimeData} margin={{ right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          domain={[0, 1]}
                          tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                          label={{ value: "Normalized Dwell Time", position: "insideBottom", dy: 10 }}
                        />
                        <YAxis dataKey="eventId" type="category" width={80} />
                        <Tooltip content={<DwellTimeTooltip />} />
                        <Legend />
                        {dwellTimeStageColors.map((stage) => (
                          <Bar key={stage.key} dataKey={stage.key} stackId="a" name={stage.name} fill={stage.color} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Stage Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Dwell Time Stage Breakdown</CardTitle>
                  <CardDescription>
                    Average time distribution across different stages of event processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(useCaseDetail.eventAnalytics.dwellTimeAnalytics.stageBreakdown).map(
                            ([name, value]) => ({ name, value }),
                          )}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name.replace(/([A-Z])/g, " $1")}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.keys(useCaseDetail.eventAnalytics.dwellTimeAnalytics.stageBreakdown).map(
                            (key, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={dwellTimeStageColors.find((s) => s.key === key)?.color || "#8884d8"}
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip formatter={(value) => [`${(value as number).toFixed(2)}h`, "Average Duration"]} />
                        <Legend
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>{value.replace(/([A-Z])/g, " $1")}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Recent Events Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest security events detected by this use case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {useCaseDetail.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.id}</Badge>
                        <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Source IP:</span> {event.sourceIp}
                        <span className="mx-2">|</span>
                        <span className="font-medium">Target:</span> {event.targetUser}
                        <span className="mx-2">|</span>
                        <span className="font-medium">Attempts:</span> {event.attempts}
                      </div>
                      <div className="text-sm text-muted-foreground">Analyst: {event.analyst}</div>
                    </div>
                    <Badge
                      variant={
                        event.status === "True Positive"
                          ? "destructive"
                          : event.status === "False Positive"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-6 w-6 mr-2" />
                AI Diagnostic Assessment
              </CardTitle>
              <CardDescription>
                Automated analysis of this use case's performance metrics to identify opportunities for fine-tuning and
                automation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Diagnostic Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={aiSummary.resultVariant} className="text-lg px-4 py-2">
                    {aiSummary.result}
                  </Badge>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                      {aiSummary.findings.map((finding, i) => (
                        <li key={i}>{finding}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Actionable Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                      {aiSummary.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                      {aiSummary.strengths.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                      {aiSummary.weaknesses.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Playbooks</CardTitle>
              <CardDescription>Incident response procedures for this use case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {useCaseDetail.relatedPlaybooks.map((playbook) => (
                  <Card key={playbook.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{playbook.id}</Badge>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{playbook.estimatedTime}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{playbook.title}</CardTitle>
                      <CardDescription>{playbook.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Analysis Steps & TODO Items</h4>
                        <div className="space-y-4">
                          {playbook.analysisSteps.map((step) => (
                            <Card key={step.step} className="border-l-4 border-l-primary">
                              <CardContent className="pt-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {step.step}
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <h5 className="font-medium">{step.title}</h5>
                                      <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">TODO Items:</p>
                                      <ul className="space-y-1">
                                        {step.todos.map((todo, index) => (
                                          <li
                                            key={index}
                                            className="text-sm text-muted-foreground flex items-start space-x-2"
                                          >
                                            <span className="text-primary mt-1">•</span>
                                            <span>{todo}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
