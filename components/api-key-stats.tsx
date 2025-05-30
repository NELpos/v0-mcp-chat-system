"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Activity, Shield, TrendingUp } from "lucide-react"

interface APIKeyStatsProps {
  totalKeys: number
  activeKeys: number
  totalRequests: number
  todayRequests: number
}

export function APIKeyStats({ totalKeys, activeKeys, totalRequests, todayRequests }: APIKeyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalKeys}</div>
          <p className="text-xs text-muted-foreground">
            {activeKeys} active, {totalKeys - activeKeys} inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeKeys}</div>
          <p className="text-xs text-muted-foreground">{((activeKeys / totalKeys) * 100).toFixed(1)}% of total keys</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All time API requests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Requests</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayRequests}</div>
          <p className="text-xs text-muted-foreground">+12% from yesterday</p>
        </CardContent>
      </Card>
    </div>
  )
}
