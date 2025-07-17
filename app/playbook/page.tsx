"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink,
  Download,
  FileText,
  Clock,
  Plus,
  Trash2,
  Settings,
  GripVertical,
  Bot,
  Database,
  Shield,
  Search,
  Mail,
  Scan,
  RotateCcw,
  Package,
  BarChart3,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface TodoTask {
  id: string
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  category: "Detection" | "Containment" | "Eradication" | "Recovery" | "Documentation"
  estimatedTime: string
  completed: boolean
  assignedTools: string[]
}

interface MCPTool {
  id: string
  name: string
  description: string
  category: "monitoring" | "control" | "planning" | "analysis" | "communication"
  serverEndpoint: string
  parameters: string[]
  icon: React.ReactNode
}

const mockMCPTools: MCPTool[] = [
  {
    id: "siem-query",
    name: "SIEM Query Tool",
    description: "Execute queries against SIEM database for log analysis",
    category: "monitoring",
    serverEndpoint: "mcp://siem-server/query",
    parameters: ["query", "timeRange", "logSource"],
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "network-isolation",
    name: "Network Isolation Tool",
    description: "Isolate compromised systems from network",
    category: "control",
    serverEndpoint: "mcp://network-server/isolate",
    parameters: ["targetIP", "isolationType", "duration"],
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "forensic-collection",
    name: "Forensic Collection Tool",
    description: "Collect forensic evidence from target systems",
    category: "analysis",
    serverEndpoint: "mcp://forensic-server/collect",
    parameters: ["targetSystem", "evidenceType", "preservationMethod"],
    icon: <Search className="h-4 w-4" />,
  },
  {
    id: "incident-notification",
    name: "Incident Notification Tool",
    description: "Send notifications to stakeholders about incidents",
    category: "communication",
    serverEndpoint: "mcp://notification-server/send",
    parameters: ["recipients", "severity", "message"],
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "malware-scanner",
    name: "Malware Scanner",
    description: "Scan systems for malware and suspicious files",
    category: "analysis",
    serverEndpoint: "mcp://scanner-server/scan",
    parameters: ["targetPath", "scanType", "quarantineAction"],
    icon: <Scan className="h-4 w-4" />,
  },
  {
    id: "backup-restore",
    name: "Backup Restore Tool",
    description: "Restore systems from clean backups",
    category: "control",
    serverEndpoint: "mcp://backup-server/restore",
    parameters: ["backupId", "targetSystem", "restorePoint"],
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    id: "patch-deployment",
    name: "Patch Deployment Tool",
    description: "Deploy security patches to affected systems",
    category: "control",
    serverEndpoint: "mcp://patch-server/deploy",
    parameters: ["patchId", "targetSystems", "deploymentSchedule"],
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "log-analysis",
    name: "Log Analysis Tool",
    description: "Analyze logs for patterns and anomalies",
    category: "analysis",
    serverEndpoint: "mcp://analysis-server/analyze",
    parameters: ["logFiles", "analysisType", "timeWindow"],
    icon: <BarChart3 className="h-4 w-4" />,
  },
]

export default function PlaybookPage() {
  const [wikiUrl, setWikiUrl] = useState(
    "https://confluence.company.com/display/SEC/Malware-Incident-Response-Playbook",
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(true)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showToolSelectionDialog, setShowToolSelectionDialog] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium" as const,
    category: "Detection" as const,
    estimatedTime: "30",
  })

  const [todoTasks, setTodoTasks] = useState<TodoTask[]>([
    {
      id: "1",
      title: "Initial Event Triage",
      description: "Assess the severity and scope of the malware incident",
      priority: "High",
      category: "Detection",
      estimatedTime: "15 minutes",
      completed: true,
      assignedTools: ["siem-query", "log-analysis"],
    },
    {
      id: "2",
      title: "Isolate Affected Systems",
      description: "Immediately isolate compromised systems from the network",
      priority: "High",
      category: "Containment",
      estimatedTime: "30 minutes",
      completed: true,
      assignedTools: ["network-isolation"],
    },
    {
      id: "3",
      title: "Collect Forensic Evidence",
      description: "Gather digital evidence from affected systems for analysis",
      priority: "High",
      category: "Detection",
      estimatedTime: "45 minutes",
      completed: false,
      assignedTools: ["forensic-collection", "malware-scanner"],
    },
    {
      id: "4",
      title: "Notify Stakeholders",
      description: "Inform management and relevant teams about the incident",
      priority: "Medium",
      category: "Documentation",
      estimatedTime: "20 minutes",
      completed: false,
      assignedTools: ["incident-notification"],
    },
    {
      id: "5",
      title: "Malware Analysis",
      description: "Analyze the malware sample to understand its behavior",
      priority: "High",
      category: "Detection",
      estimatedTime: "90 minutes",
      completed: false,
      assignedTools: ["malware-scanner", "log-analysis"],
    },
    {
      id: "6",
      title: "System Restoration",
      description: "Restore affected systems from clean backups",
      priority: "Medium",
      category: "Recovery",
      estimatedTime: "60 minutes",
      completed: false,
      assignedTools: ["backup-restore"],
    },
    {
      id: "7",
      title: "Apply Security Patches",
      description: "Deploy necessary security patches to prevent reinfection",
      priority: "Medium",
      category: "Eradication",
      estimatedTime: "45 minutes",
      completed: false,
      assignedTools: ["patch-deployment"],
    },
    {
      id: "8",
      title: "Monitor for Persistence",
      description: "Monitor systems for signs of malware persistence",
      priority: "Medium",
      category: "Recovery",
      estimatedTime: "30 minutes",
      completed: false,
      assignedTools: ["siem-query", "log-analysis"],
    },
  ])

  const completedTasks = todoTasks.filter((task) => task.completed).length
  const totalTasks = todoTasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
    setIsAnalyzed(true)
  }

  const handleTaskToggle = (taskId: string) => {
    setTodoTasks((tasks) => tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTodoTasks((tasks) => tasks.filter((task) => task.id !== taskId))
  }

  const handleAddTask = () => {
    const task: TodoTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      estimatedTime: `${newTask.estimatedTime} minutes`,
      completed: false,
      assignedTools: [],
    }
    setTodoTasks((tasks) => [...tasks, task])
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      category: "Detection",
      estimatedTime: "30",
    })
    setShowAddTaskDialog(false)
  }

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const items = Array.from(todoTasks)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      setTodoTasks(items)
    },
    [todoTasks],
  )

  const handleToolSelection = (taskId: string, toolId: string) => {
    setTodoTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === taskId) {
          const assignedTools = task.assignedTools.includes(toolId)
            ? task.assignedTools.filter((id) => id !== toolId)
            : [...task.assignedTools, toolId]
          return { ...task, assignedTools }
        }
        return task
      }),
    )
  }

  const openToolSelection = (taskId: string) => {
    setSelectedTaskId(taskId)
    setShowToolSelectionDialog(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Detection":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Containment":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Eradication":
        return "bg-red-100 text-red-800 border-red-200"
      case "Recovery":
        return "bg-green-100 text-green-800 border-green-200"
      case "Documentation":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getToolCategoryColor = (category: string) => {
    switch (category) {
      case "monitoring":
        return "bg-blue-100 text-blue-800"
      case "control":
        return "bg-red-100 text-red-800"
      case "planning":
        return "bg-green-100 text-green-800"
      case "analysis":
        return "bg-purple-100 text-purple-800"
      case "communication":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Playbook Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze Confluence wiki playbooks and generate interactive TODO lists with MCP tool integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Wiki Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Wiki Document Analysis
            </CardTitle>
            <CardDescription>Enter a Confluence wiki URL to analyze and extract TODO tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wiki-url">Confluence Wiki URL</Label>
              <Input
                id="wiki-url"
                value={wikiUrl}
                onChange={(e) => setWikiUrl(e.target.value)}
                placeholder="https://confluence.company.com/display/..."
              />
            </div>

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !wikiUrl} className="w-full">
              {isAnalyzing ? (
                <>
                  <Bot className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Analyze Playbook
                </>
              )}
            </Button>

            {isAnalyzed && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.5h</div>
                    <div className="text-sm text-muted-foreground">Est. Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Wiki
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export TODO
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>Playbook Overview</CardTitle>
            <CardDescription>Malware Incident Response Playbook - Security Operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {completedTasks}/{totalTasks} completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Detection
              </Badge>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                Containment
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                Eradication
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Recovery
              </Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                Documentation
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                This playbook provides step-by-step procedures for responding to malware incidents. Each task has been
                analyzed and categorized with estimated completion times and assigned MCP tools for automation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TODO List */}
      {isAnalyzed && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI-Generated TODO List</CardTitle>
                <CardDescription>
                  Interactive task list with MCP tool integration and drag-and-drop reordering
                </CardDescription>
              </div>
              <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task for the playbook</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Title</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={newTask.category}
                          onValueChange={(value: any) => setNewTask({ ...newTask, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Detection">Detection</SelectItem>
                            <SelectItem value="Containment">Containment</SelectItem>
                            <SelectItem value="Eradication">Eradication</SelectItem>
                            <SelectItem value="Recovery">Recovery</SelectItem>
                            <SelectItem value="Documentation">Documentation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-time">Estimated Time (minutes)</Label>
                      <Input
                        id="estimated-time"
                        type="number"
                        value={newTask.estimatedTime}
                        onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                        placeholder="30"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.description}>
                        Add Task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="todo-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {todoTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg p-4 bg-white transition-all ${
                              snapshot.isDragging ? "shadow-lg opacity-75" : "hover:shadow-md"
                            } ${task.completed ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div {...provided.dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>

                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleTaskToggle(task.id)}
                                className="mt-1"
                              />

                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openToolSelection(task.id)}>
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <p className={`text-sm text-muted-foreground ${task.completed ? "line-through" : ""}`}>
                                  {task.description}
                                </p>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline" className={getCategoryColor(task.category)}>
                                    {task.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {task.estimatedTime}
                                  </div>
                                </div>

                                {task.assignedTools.length > 0 && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-muted-foreground">MCP Tools:</span>
                                    {task.assignedTools.map((toolId) => {
                                      const tool = mockMCPTools.find((t) => t.id === toolId)
                                      return tool ? (
                                        <Badge key={toolId} variant="secondary" className="text-xs">
                                          {tool.icon}
                                          <span className="ml-1">{tool.name}</span>
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

      {/* MCP Tool Selection Dialog */}
      <Dialog open={showToolSelectionDialog} onOpenChange={setShowToolSelectionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select MCP Tools</DialogTitle>
            <DialogDescription>Choose MCP tools to assign to this task for automated execution</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMCPTools.map((tool) => {
              const selectedTask = todoTasks.find((t) => t.id === selectedTaskId)
              const isSelected = selectedTask?.assignedTools.includes(tool.id) || false

              return (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => handleToolSelection(selectedTaskId, tool.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{tool.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{tool.name}</h4>
                          <Badge variant="outline" className={getToolCategoryColor(tool.category)}>
                            {tool.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                        <div className="text-xs text-muted-foreground">
                          <div>Endpoint: {tool.serverEndpoint}</div>
                          <div>Parameters: {tool.parameters.join(", ")}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowToolSelectionDialog(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
