"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Link,
  Bot,
  CheckCircle,
  Circle,
  Clock,
  Loader2,
  GripVertical,
  Trash2,
  Plus,
  Settings,
  Wrench,
  Database,
  Shield,
  Search,
  Mail,
  Terminal,
} from "lucide-react"

interface MCPTool {
  id: string
  name: string
  description: string
  category: "monitoring" | "control" | "planning" | "analysis" | "communication"
  icon: string
  serverEndpoint: string
  parameters: string[]
}

interface TodoItem {
  id: string
  task: string
  description: string
  priority: "high" | "medium" | "low"
  estimatedTime: string
  completed: boolean
  category: string
  mcpTools: string[]
  order: number
}

interface PlaybookAnalysis {
  title: string
  summary: string
  totalTasks: number
  estimatedDuration: string
  categories: string[]
  todos: TodoItem[]
}

// Mock MCP Tools Data
const mockMCPTools: MCPTool[] = [
  {
    id: "siem-query",
    name: "SIEM Query Tool",
    description: "Execute queries against SIEM database for log analysis",
    category: "monitoring",
    icon: "Database",
    serverEndpoint: "mcp://siem-server/query",
    parameters: ["query", "timeRange", "logSource"],
  },
  {
    id: "network-isolate",
    name: "Network Isolation Tool",
    description: "Isolate compromised systems from network",
    category: "control",
    icon: "Shield",
    serverEndpoint: "mcp://network-server/isolate",
    parameters: ["hostId", "isolationType", "duration"],
  },
  {
    id: "forensic-collect",
    name: "Forensic Collection Tool",
    description: "Collect forensic evidence from target systems",
    category: "analysis",
    icon: "Search",
    serverEndpoint: "mcp://forensic-server/collect",
    parameters: ["targetHost", "artifactTypes", "outputPath"],
  },
  {
    id: "incident-notify",
    name: "Incident Notification Tool",
    description: "Send notifications to stakeholders",
    category: "communication",
    icon: "Mail",
    serverEndpoint: "mcp://notify-server/send",
    parameters: ["recipients", "severity", "message"],
  },
  {
    id: "malware-scan",
    name: "Malware Scanner",
    description: "Scan systems for malware signatures",
    category: "analysis",
    icon: "Shield",
    serverEndpoint: "mcp://scanner-server/scan",
    parameters: ["targetPath", "scanType", "quarantine"],
  },
  {
    id: "backup-restore",
    name: "Backup Restore Tool",
    description: "Restore systems from clean backups",
    category: "control",
    icon: "Database",
    serverEndpoint: "mcp://backup-server/restore",
    parameters: ["backupId", "targetSystem", "verifyIntegrity"],
  },
  {
    id: "patch-deploy",
    name: "Patch Deployment Tool",
    description: "Deploy security patches to systems",
    category: "control",
    icon: "Wrench",
    serverEndpoint: "mcp://patch-server/deploy",
    parameters: ["patchId", "targetSystems", "scheduleTime"],
  },
  {
    id: "log-analyzer",
    name: "Log Analysis Tool",
    description: "Analyze logs for suspicious patterns",
    category: "analysis",
    icon: "Terminal",
    serverEndpoint: "mcp://analyzer-server/analyze",
    parameters: ["logFiles", "patterns", "timeWindow"],
  },
]

const mockPlaybookAnalysis: PlaybookAnalysis = {
  title: "Malware Incident Response Playbook",
  summary:
    "Comprehensive procedure for handling malware incidents including detection, containment, eradication, and recovery phases.",
  totalTasks: 12,
  estimatedDuration: "4-6 hours",
  categories: ["Detection", "Containment", "Eradication", "Recovery", "Documentation"],
  todos: [
    {
      id: "1",
      task: "Initial Incident Triage",
      description: "Assess the scope and severity of the malware incident",
      priority: "high",
      estimatedTime: "15 min",
      completed: false,
      category: "Detection",
      mcpTools: ["siem-query", "log-analyzer"],
      order: 1,
    },
    {
      id: "2",
      task: "Isolate Affected Systems",
      description: "Disconnect infected systems from network to prevent spread",
      priority: "high",
      estimatedTime: "10 min",
      completed: false,
      category: "Containment",
      mcpTools: ["network-isolate"],
      order: 2,
    },
    {
      id: "3",
      task: "Collect Forensic Evidence",
      description: "Gather logs, memory dumps, and disk images for analysis",
      priority: "medium",
      estimatedTime: "45 min",
      completed: false,
      category: "Detection",
      mcpTools: ["forensic-collect", "siem-query"],
      order: 3,
    },
    {
      id: "4",
      task: "Identify Malware Type",
      description: "Analyze samples to determine malware family and capabilities",
      priority: "medium",
      estimatedTime: "30 min",
      completed: false,
      category: "Detection",
      mcpTools: ["malware-scan", "log-analyzer"],
      order: 4,
    },
    {
      id: "5",
      task: "Check for Lateral Movement",
      description: "Scan network for signs of malware propagation",
      priority: "high",
      estimatedTime: "20 min",
      completed: false,
      category: "Detection",
      mcpTools: ["siem-query", "network-isolate"],
      order: 5,
    },
    {
      id: "6",
      task: "Remove Malware Artifacts",
      description: "Clean infected systems and remove malicious files",
      priority: "medium",
      estimatedTime: "60 min",
      completed: false,
      category: "Eradication",
      mcpTools: ["malware-scan"],
      order: 6,
    },
  ],
}

export default function PlaybookPage() {
  const [wikiUrl, setWikiUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PlaybookAnalysis | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showToolDialog, setShowToolDialog] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    task: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    estimatedTime: "",
    category: "",
  })

  const dragCounter = useRef(0)

  const handleAnalyzePlaybook = async () => {
    if (!wikiUrl.trim()) return

    setIsAnalyzing(true)
    setTimeout(() => {
      setAnalysis(mockPlaybookAnalysis)
      setTodos(mockPlaybookAnalysis.todos.sort((a, b) => a.order - b.order))
      setIsAnalyzing(false)
    }, 3000)
  }

  const toggleTodoComplete = (todoId: string) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (todoId: string) => {
    setTodos(todos.filter((todo) => todo.id !== todoId))
  }

  const addNewTask = () => {
    if (!newTask.task.trim()) return

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      task: newTask.task,
      description: newTask.description,
      priority: newTask.priority,
      estimatedTime: newTask.estimatedTime,
      completed: false,
      category: newTask.category,
      mcpTools: [],
      order: todos.length + 1,
    }

    setTodos([...todos, newTodo])
    setNewTask({
      task: "",
      description: "",
      priority: "medium",
      estimatedTime: "",
      category: "",
    })
    setShowAddDialog(false)
  }

  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedItem(todoId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedItem)
    const targetIndex = todos.findIndex((todo) => todo.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newTodos = [...todos]
    const [draggedTodo] = newTodos.splice(draggedIndex, 1)
    newTodos.splice(targetIndex, 0, draggedTodo)

    // Update order numbers
    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index + 1,
    }))

    setTodos(updatedTodos)
    setDraggedItem(null)
  }

  const updateTaskMCPTools = (taskId: string, toolIds: string[]) => {
    setTodos(todos.map((todo) => (todo.id === taskId ? { ...todo, mcpTools: toolIds } : todo)))
  }

  const openToolDialog = (taskId: string) => {
    setSelectedTaskId(taskId)
    setShowToolDialog(true)
  }

  const completedTasks = todos.filter((todo) => todo.completed).length
  const progressPercentage = todos.length > 0 ? (completedTasks / todos.length) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Detection: "bg-blue-100 text-blue-800",
      Containment: "bg-orange-100 text-orange-800",
      Eradication: "bg-red-100 text-red-800",
      Recovery: "bg-green-100 text-green-800",
      Documentation: "bg-purple-100 text-purple-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getMCPToolIcon = (iconName: string) => {
    const icons = {
      Database: Database,
      Shield: Shield,
      Search: Search,
      Mail: Mail,
      Wrench: Wrench,
      Terminal: Terminal,
    }
    return icons[iconName as keyof typeof icons] || Settings
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interactive Playbook Analyzer</h1>
            <p className="text-muted-foreground">Extract and manage actionable TODO lists with MCP tool integration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Wiki Input */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Wiki Document Input
                </CardTitle>
                <CardDescription>Enter the Confluence wiki URL for playbook analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wikiUrl">Confluence Wiki URL</Label>
                  <Input
                    id="wikiUrl"
                    placeholder="https://company.atlassian.net/wiki/spaces/..."
                    value={wikiUrl}
                    onChange={(e) => setWikiUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleAnalyzePlaybook} disabled={!wikiUrl.trim() || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      AI is analyzing the playbook document and extracting actionable tasks...
                    </AlertDescription>
                  </Alert>
                )}

                {analysis && (
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold">Analysis Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Tasks:</span>
                        <span className="font-medium">{todos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Duration:</span>
                        <span className="font-medium">{analysis.estimatedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categories:</span>
                        <span className="font-medium">{analysis.categories.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MCP Tools Overview */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available MCP Tools</CardTitle>
                  <CardDescription>Tools available for task automation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockMCPTools.slice(0, 4).map((tool) => {
                      const IconComponent = getMCPToolIcon(tool.icon)
                      return (
                        <div key={tool.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                          <IconComponent className="w-4 h-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{tool.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      +{mockMCPTools.length - 4} more tools available
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="lg:col-span-2 space-y-4">
            {analysis ? (
              <>
                {/* Playbook Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {analysis.title}
                    </CardTitle>
                    <CardDescription>{analysis.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {completedTasks} of {todos.length} tasks completed
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />

                      <div className="flex flex-wrap gap-2">
                        {analysis.categories.map((category) => (
                          <Badge key={category} className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive TODO List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Interactive TODO List
                      </div>
                      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>Create a new task for the playbook</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="taskName">Task Name</Label>
                              <Input
                                id="taskName"
                                value={newTask.task}
                                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                                placeholder="Enter task name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="taskDescription">Description</Label>
                              <Textarea
                                id="taskDescription"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Enter task description"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Priority</Label>
                                <Select
                                  value={newTask.priority}
                                  onValueChange={(value: "high" | "medium" | "low") =>
                                    setNewTask({ ...newTask, priority: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="estimatedTime">Estimated Time</Label>
                                <Input
                                  id="estimatedTime"
                                  value={newTask.estimatedTime}
                                  onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                                  placeholder="e.g., 30 min"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Input
                                id="category"
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                placeholder="e.g., Detection, Containment"
                              />
                            </div>
                            <Button onClick={addNewTask} className="w-full">
                              Add Task
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                    <CardDescription>Drag and drop to reorder, assign MCP tools for automation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, todo.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, todo.id)}
                          className={`p-4 rounded-lg border transition-all cursor-move ${
                            todo.completed
                              ? "bg-green-50 border-green-200 opacity-75"
                              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          } ${draggedItem === todo.id ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <GripVertical className="w-5 h-5 text-gray-400 mt-1 cursor-grab" />

                            <button onClick={() => toggleTodoComplete(todo.id)} className="mt-1">
                              {todo.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className={`font-medium ${todo.completed ? "line-through text-gray-500" : ""}`}>
                                  {todo.task}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openToolDialog(todo.id)}
                                    className="h-8 px-2"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTodo(todo.id)}
                                    className="h-8 px-2 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <p className={`text-sm text-muted-foreground ${todo.completed ? "line-through" : ""}`}>
                                {todo.description}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getPriorityColor(todo.priority)}>{todo.priority}</Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {todo.estimatedTime}
                                </Badge>
                                <Badge className={getCategoryColor(todo.category)} variant="outline">
                                  {todo.category}
                                </Badge>
                              </div>

                              {/* MCP Tools Display */}
                              {todo.mcpTools.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground">MCP Tools:</span>
                                  {todo.mcpTools.map((toolId) => {
                                    const tool = mockMCPTools.find((t) => t.id === toolId)
                                    if (!tool) return null
                                    const IconComponent = getMCPToolIcon(tool.icon)
                                    return (
                                      <Badge key={toolId} variant="secondary" className="text-xs">
                                        <IconComponent className="w-3 h-3 mr-1" />
                                        {tool.name}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* MCP Tool Assignment Dialog */}
                <Dialog open={showToolDialog} onOpenChange={setShowToolDialog}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Assign MCP Tools</DialogTitle>
                      <DialogDescription>Select MCP tools to automate this task execution</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {mockMCPTools.map((tool) => {
                          const IconComponent = getMCPToolIcon(tool.icon)
                          const selectedTask = todos.find((t) => t.id === selectedTaskId)
                          const isSelected = selectedTask?.mcpTools.includes(tool.id) || false

                          return (
                            <div
                              key={tool.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                if (!selectedTaskId) return
                                const currentTools = selectedTask?.mcpTools || []
                                const newTools = isSelected
                                  ? currentTools.filter((id) => id !== tool.id)
                                  : [...currentTools, tool.id]
                                updateTaskMCPTools(selectedTaskId, newTools)
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <IconComponent className="w-5 h-5 mt-1" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{tool.name}</h4>
                                  <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {tool.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {tool.parameters.length} params
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => setShowToolDialog(false)}>Done</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Bot className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Ready to Analyze</h3>
                    <p className="text-muted-foreground">
                      Enter a Confluence wiki URL to extract actionable TODO lists with MCP tool integration
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
