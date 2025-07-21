export interface TicketType {
  id: string
  name: string
  color: string
  category: string
}

export interface TicketMetric {
  type: string
  category: string
  totalTickets: number
  avgResolutionTime: number
  assignedResources: number
  monthlyCost: number
  trend: "up" | "down"
  trendValue: number
}

export interface ChartDataPoint {
  date: string
  day?: string
  week?: string
  [key: string]: any
}
