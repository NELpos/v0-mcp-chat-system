"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
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
  Cell,
} from "recharts"
import { ArrowUpRight, Download, TrendingDown, TrendingUp, Zap } from "lucide-react"

// Mock data for ticket types
const ticketTypes = [
  { id: "malware", name: "Malware Detection", color: "#FF6384" },
  { id: "phishing", name: "Phishing Attempt", color: "#36A2EB" },
  { id: "vpn", name: "VPN Access Issue", color: "#FFCE56" },
  { id: "firewall", name: "Firewall Alert", color: "#4BC0C0" },
  { id: "auth", name: "Authentication Failure", color: "#9966FF" },
  { id: "dlp", name: "Data Loss Prevention", color: "#FF9F40" },
  { id: "compliance", name: "Compliance Violation", color: "#8AC926" },
  { id: "endpoint", name: "Endpoint Security", color: "#F15BB5" },
  { id: "network", name: "Network Anomaly", color: "#00BBF9" },
  { id: "access", name: "Unauthorized Access", color: "#9B5DE5" },
]

// Generate daily mock data for the past 30 days
const generateDailyData = () => {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const entry: any = {
      date: date.toISOString().split("T")[0],
      total: 0,
    }

    // Generate random values for each ticket type
    ticketTypes.forEach((type) => {
      // More realistic distribution - some ticket types are more common
      let baseValue = 0
      switch (type.id) {
        case "phishing":
          baseValue = 8
          break
        case "auth":
          baseValue = 6
          break
        case "malware":
          baseValue = 4
          break
        default:
          baseValue = 2
      }

      // Add some randomness and weekly patterns
      const dayOfWeek = date.getDay()
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1
      const randomFactor = 0.5 + Math.random()

      const value = Math.floor(baseValue * weekendFactor * randomFactor)
      entry[type.id] = value
      entry.total += value
    })

    data.push(entry)
  }

  return data
}

// Generate weekly mock data
const generateWeeklyData = () => {
  const data = []
  const today = new Date()

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay())

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const entry: any = {
      week: `${weekStart.toISOString().split("T")[0]} to ${weekEnd.toISOString().split("T")[0]}`,
      total: 0,
    }

    // Generate random values for each ticket type
    ticketTypes.forEach((type) => {
      const value = Math.floor(Math.random() * 50) + 10
      entry[type.id] = value
      entry.total += value
    })

    data.push(entry)
  }

  return data
}

// Generate metrics data for each ticket type
const generateMetricsData = () => {
  return ticketTypes
    .map((type) => {
      // Generate realistic metrics
      const totalTickets = Math.floor(Math.random() * 200) + 50
      const avgResolutionHours = Math.floor(Math.random() * 24) + 1
      const assignedResources = Math.floor(Math.random() * 5) + 1
      const costPerTicket = (Math.floor(Math.random() * 200) + 50) * assignedResources
      const monthlyCost = totalTickets * costPerTicket

      // Generate trend (up or down)
      const trend = Math.random() > 0.5 ? "up" : "down"
      const trendPercentage = Math.floor(Math.random() * 30) + 1

      return {
        id: type.id,
        name: type.name,
        color: type.color,
        totalTickets,
        avgResolutionHours,
        assignedResources,
        costPerTicket,
        monthlyCost,
        trend,
        trendPercentage,
      }
    })
    .sort((a, b) => b.totalTickets - a.totalTickets)
}

// Generate top 5 most frequent tickets
const generateTop5Tickets = (metricsData: any[]) => {
  return metricsData
    .sort((a, b) => b.totalTickets - a.totalTickets)
    .slice(0, 5)
    .map((ticket) => {
      // Generate recommendations based on ticket type
      let recommendation = ""
      switch (ticket.id) {
        case "phishing":
          recommendation = "Implement user security awareness training to reduce phishing susceptibility"
          break
        case "auth":
          recommendation = "Consider implementing multi-factor authentication to reduce authentication failures"
          break
        case "malware":
          recommendation = "Update endpoint protection and implement regular scanning schedule"
          break
        case "vpn":
          recommendation = "Upgrade VPN infrastructure to handle increased remote work load"
          break
        case "firewall":
          recommendation = "Review and optimize firewall rules to reduce false positives"
          break
        case "dlp":
          recommendation = "Refine DLP policies to reduce false positives while maintaining security"
          break
        default:
          recommendation = "Analyze root causes and implement preventative measures"
      }

      return {
        ...ticket,
        recommendation,
        potentialSavings: Math.floor(ticket.monthlyCost * 0.3), // 30% potential savings
      }
    })
}

export default function TicketAnalysisPage() {
  // Generate mock data
  const dailyData = generateDailyData()
  const weeklyData = generateWeeklyData()
  const metricsData = generateMetricsData()
  const top5Tickets = generateTop5Tickets(metricsData)

  // State for active tab
  const [activeTab, setActiveTab] = useState("daily")

  // State for visible ticket types
  const [visibleTicketTypes, setVisibleTicketTypes] = useState(ticketTypes.map((type) => type.id))

  // State for date range
  const [dateRange, setDateRange] = useState("30")

  // Toggle ticket type visibility
  const toggleTicketType = (typeId: string) => {
    if (visibleTicketTypes.includes(typeId)) {
      setVisibleTicketTypes(visibleTicketTypes.filter((id) => id !== typeId))
    } else {
      setVisibleTicketTypes([...visibleTicketTypes, typeId])
    }
  }

  // Calculate summary metrics
  const totalTickets = metricsData.reduce((sum, item) => sum + item.totalTickets, 0)
  const avgResolutionTime = metricsData.reduce((sum, item) => sum + item.avgResolutionHours, 0) / metricsData.length
  const totalResources = metricsData.reduce((sum, item) => sum + item.assignedResources, 0)
  const totalCost = metricsData.reduce((sum, item) => sum + item.monthlyCost, 0)

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map(
              (entry: any, index: number) =>
                entry.name !== "total" && (
                  <div key={`item-${index}`} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm">{ticketTypes.find((t) => t.id === entry.name)?.name}: </span>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ),
            )}
          </div>
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total:</span>
              <span className="font-medium">
                {payload.reduce((sum: number, entry: any) => (entry.name !== "total" ? sum + entry.value : sum), 0)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ticket Analysis Dashboard</h1>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
              <div className="text-3xl font-bold mt-2">{totalTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
              <div className="text-3xl font-bold mt-2">{avgResolutionTime.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground mt-1">Per ticket</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
              <div className="text-3xl font-bold mt-2">{totalResources}</div>
              <p className="text-xs text-muted-foreground mt-1">Assigned analysts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
              <div className="text-3xl font-bold mt-2">${(totalCost / 1000).toFixed(1)}k</div>
              <p className="text-xs text-muted-foreground mt-1">Monthly operational</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ticket Volume Trends</CardTitle>
                  <CardDescription>Analysis of ticket volume by type over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyData.slice(-Number.parseInt(dateRange))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {ticketTypes.map(
                          (type) =>
                            visibleTicketTypes.includes(type.id) && (
                              <Area
                                key={type.id}
                                type="monotone"
                                dataKey={type.id}
                                name={type.id}
                                stackId="1"
                                stroke={type.color}
                                fill={type.color}
                                fillOpacity={0.6}
                              />
                            ),
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {ticketTypes.map(
                          (type) =>
                            visibleTicketTypes.includes(type.id) && (
                              <Line
                                key={type.id}
                                type="monotone"
                                dataKey={type.id}
                                name={type.id}
                                stroke={type.color}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                            ),
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Filter Ticket Types:</p>
                <div className="flex flex-wrap gap-2">
                  {ticketTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <Checkbox
                        id={`filter-${type.id}`}
                        checked={visibleTicketTypes.includes(type.id)}
                        onCheckedChange={() => toggleTicketType(type.id)}
                      />
                      <label htmlFor={`filter-${type.id}`} className="ml-2 text-sm flex items-center">
                        <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: type.color }}></div>
                        {type.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Metrics</CardTitle>
              <CardDescription>Key performance indicators for each ticket type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Avg. Resolution</TableHead>
                      <TableHead className="text-right">Resources</TableHead>
                      <TableHead className="text-right">Monthly Cost</TableHead>
                      <TableHead className="text-right">30d Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{item.totalTickets}</TableCell>
                        <TableCell className="text-right">{item.avgResolutionHours}h</TableCell>
                        <TableCell className="text-right">{item.assignedResources}</TableCell>
                        <TableCell className="text-right">${(item.monthlyCost / 1000).toFixed(1)}k</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={item.trend === "up" ? "destructive" : "default"}>
                            {item.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {item.trendPercentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Actionable Insights
              </CardTitle>
              <CardDescription>Data-driven recommendations to improve efficiency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Top 5 Most Frequent Ticket Types</h3>
                <div className="space-y-3">
                  {top5Tickets.map((ticket, index) => (
                    <div key={ticket.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted text-muted-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="font-medium">{ticket.name}</div>
                        </div>
                        <Badge variant="outline">{ticket.totalTickets} tickets</Badge>
                      </div>

                      <div className="mt-2 text-sm text-muted-foreground">{ticket.recommendation}</div>

                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>Potential monthly savings:</span>
                        </div>
                        <div className="font-medium text-green-600">
                          ${(ticket.potentialSavings / 1000).toFixed(1)}k
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Resource Optimization Opportunities</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      High
                    </Badge>
                    <span className="text-sm">
                      Implement automation for {top5Tickets[0]?.name} tickets to reduce resolution time by up to 40%
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      Medium
                    </Badge>
                    <span className="text-sm">
                      Consolidate resources handling similar ticket types to improve efficiency
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      Medium
                    </Badge>
                    <span className="text-sm">
                      Implement preventative measures for recurring {top5Tickets[1]?.name} issues
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Current distribution of resources by ticket type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metricsData.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="assignedResources" name="Assigned Resources" fill="#8884d8">
                      {metricsData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 text-sm text-center text-muted-foreground">
                Resource allocation should be proportional to ticket volume and complexity
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
