"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Plus, X, Filter, TrendingUp, AlertTriangle, Bug, Shield, Zap } from "lucide-react"
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

// Mock data for ticket analysis
const ticketTypes = [
  { id: "malware", name: "Malware Detection", color: "#ef4444", icon: Bug },
  { id: "phishing", name: "Phishing Attempt", color: "#f97316", icon: Shield },
  { id: "intrusion", name: "Intrusion Detection", color: "#eab308", icon: AlertTriangle },
  { id: "ddos", name: "DDoS Attack", color: "#22c55e", icon: Zap },
  { id: "data-breach", name: "Data Breach", color: "#3b82f6", icon: Shield },
  { id: "insider-threat", name: "Insider Threat", color: "#8b5cf6", icon: AlertTriangle },
]

const dailyData = [
  { date: "2024-01-01", malware: 12, phishing: 8, intrusion: 5, ddos: 3, "data-breach": 2, "insider-threat": 1 },
  { date: "2024-01-02", malware: 15, phishing: 12, intrusion: 7, ddos: 4, "data-breach": 3, "insider-threat": 2 },
  { date: "2024-01-03", malware: 18, phishing: 10, intrusion: 9, ddos: 6, "data-breach": 4, "insider-threat": 1 },
  { date: "2024-01-04", malware: 22, phishing: 15, intrusion: 11, ddos: 8, "data-breach": 5, "insider-threat": 3 },
  { date: "2024-01-05", malware: 20, phishing: 13, intrusion: 8, ddos: 5, "data-breach": 3, "insider-threat": 2 },
  { date: "2024-01-06", malware: 25, phishing: 18, intrusion: 12, ddos: 9, "data-breach": 6, "insider-threat": 4 },
  { date: "2024-01-07", malware: 28, phishing: 20, intrusion: 15, ddos: 11, "data-breach": 7, "insider-threat": 5 },
]

const weeklyData = [
  { week: "Week 1", malware: 120, phishing: 85, intrusion: 65, ddos: 45, "data-breach": 32, "insider-threat": 18 },
  { week: "Week 2", malware: 135, phishing: 92, intrusion: 72, ddos: 52, "data-breach": 38, "insider-threat": 22 },
  { week: "Week 3", malware: 148, phishing: 105, intrusion: 78, ddos: 58, "data-breach": 45, "insider-threat": 28 },
  { week: "Week 4", malware: 162, phishing: 118, intrusion: 85, ddos: 65, "data-breach": 52, "insider-threat": 35 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const ticketType = ticketTypes.find((t) => t.id === entry.dataKey)
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{ticketType?.name || entry.dataKey}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export default function TicketAnalysisPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["malware", "phishing", "intrusion"])
  const [timeRange, setTimeRange] = useState("7d")
  const [viewType, setViewType] = useState("daily")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const filteredTicketTypes = useMemo(() => {
    return ticketTypes.filter((type) => selectedTypes.includes(type.id))
  }, [selectedTypes])

  const availableTypes = useMemo(() => {
    return ticketTypes.filter((type) => !selectedTypes.includes(type.id))
  }, [selectedTypes])

  const handleAddTicketType = (typeId: string) => {
    if (!selectedTypes.includes(typeId)) {
      setSelectedTypes((prev) => [...prev, typeId])
    }
    setIsPopoverOpen(false)
  }

  const handleRemoveTicketType = (typeId: string) => {
    setSelectedTypes((prev) => prev.filter((id) => id !== typeId))
  }

  const chartData = viewType === "daily" ? dailyData : weeklyData
  const xAxisKey = viewType === "daily" ? "date" : "week"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Analysis</h1>
            <p className="text-gray-600 mt-1">Analyze security incident patterns and trends</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Ticket Type Filters
            </CardTitle>
            <CardDescription>Select which ticket types to include in the analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {filteredTicketTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Badge
                    key={type.id}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{ backgroundColor: `${type.color}20`, color: type.color, borderColor: type.color }}
                  >
                    <IconComponent className="h-3 w-3" />
                    {type.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTicketType(type.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}

              {availableTypes.length > 0 && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Plus className="h-4 w-4" />
                      Add Ticket Type
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search ticket types..." />
                      <CommandList>
                        <CommandEmpty>No ticket types found.</CommandEmpty>
                        <CommandGroup>
                          {availableTypes.map((type) => {
                            const IconComponent = type.icon
                            return (
                              <CommandItem
                                key={type.id}
                                value={type.name}
                                onSelect={() => handleAddTicketType(type.id)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <IconComponent className="h-4 w-4" style={{ color: type.color }} />
                                  <span>{type.name}</span>
                                </div>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs value={viewType} onValueChange={setViewType} className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Ticket Volume
                </CardTitle>
                <CardDescription>Daily breakdown of security incidents by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <XAxis
                        dataKey={xAxisKey}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          if (viewType === "daily") {
                            return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                          return value
                        }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {filteredTicketTypes.map((type) => (
                        <Area
                          key={type.id}
                          type="monotone"
                          dataKey={type.id}
                          name={type.name}
                          stackId="1"
                          stroke={type.color}
                          fill={type.color}
                          fillOpacity={0.6}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Ticket Trends
                </CardTitle>
                <CardDescription>Weekly trends showing incident patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {filteredTicketTypes.map((type) => (
                        <Line
                          key={type.id}
                          type="monotone"
                          dataKey={type.id}
                          name={type.name}
                          stroke={type.color}
                          strokeWidth={2}
                          dot={{ fill: type.color, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: type.color, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTicketTypes.map((type) => {
            const IconComponent = type.icon
            const totalTickets = chartData.reduce(
              (sum, day) => sum + ((day[type.id as keyof typeof day] as number) || 0),
              0,
            )
            const avgDaily = Math.round(totalTickets / chartData.length)

            return (
              <Card key={type.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{type.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
                      <p className="text-xs text-gray-500">Avg: {avgDaily}/day</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                      <IconComponent className="h-6 w-6" style={{ color: type.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
