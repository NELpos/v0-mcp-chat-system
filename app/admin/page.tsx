import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Key, Activity, TrendingUp, Server, Database, Shield, Settings } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 container max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your MCP chat system and monitor system performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+12 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">Uptime this month</p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                MCP Server Status
              </CardTitle>
              <CardDescription>Current status of MCP servers and connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">GitHub Server</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Slack Server</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jira Server</span>
                <Badge variant="secondary">Disconnected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Code Interpreter</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>Database performance and storage metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Pool</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Query Performance</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Optimal
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Up to date
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks and system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Key className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage API Keys</div>
                  <div className="text-sm text-muted-foreground">Create and manage API keys</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">User Management</div>
                  <div className="text-sm text-muted-foreground">Manage user accounts and permissions</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Server className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Server Configuration</div>
                  <div className="text-sm text-muted-foreground">Configure MCP servers and tools</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Shield className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Security Settings</div>
                  <div className="text-sm text-muted-foreground">Manage security and access controls</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Activity className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">System Monitoring</div>
                  <div className="text-sm text-muted-foreground">View system logs and performance</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
                <Database className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Database Management</div>
                  <div className="text-sm text-muted-foreground">Backup and maintenance tasks</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
