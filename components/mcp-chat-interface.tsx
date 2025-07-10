"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import MessageList from "@/components/message-list"
import ChatInput from "@/components/chat-input"
import { DocumentBlock } from "@/components/document-block"
import { useDocument } from "@/contexts/document-context"
import { mcpTools } from "@/lib/mcp-tools"
import { ToolSettingsDialog } from "@/components/tool-settings-dialog"
import { useSettings } from "@/contexts/settings-context"
import { useChat } from "@/contexts/chat-context"
import { AlertCircle, Info, GripVertical } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { Message } from "ai"

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Can you help me create a React component for a todo list?",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: `# Todo List Component

Here's a complete React component for a todo list with TypeScript:

\`\`\`tsx
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-2"
              />
              <span className={\`\${todo.completed ? 'line-through text-gray-500' : ''}\`}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 text-red-500 hover:bg-red-100 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
\`\`\`

## Features

- **Add todos**: Type in the input field and press Enter or click Add
- **Toggle completion**: Click the checkbox to mark todos as complete
- **Delete todos**: Click the Delete button to remove todos
- **Responsive design**: Works well on different screen sizes

## Usage

\`\`\`tsx
import { TodoList } from './TodoList';

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}
\`\`\`

This component uses React hooks for state management and includes TypeScript for better type safety.`,
  },
  {
    id: "msg-3",
    role: "user",
    content: "That's great! Can you also show me how to add drag and drop functionality?",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: `# Drag and Drop Todo List

Here's an enhanced version with drag and drop functionality using react-beautiful-dnd:

## Installation

First, install the required dependency:

\`\`\`bash
npm install react-beautiful-dnd
npm install --save-dev @types/react-beautiful-dnd
\`\`\`

## Enhanced Component

\`\`\`tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const DragDropTodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn React', completed: false },
    { id: '2', text: 'Build a todo app', completed: true },
    { id: '3', text: 'Add drag and drop', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Drag & Drop Todo List</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={\`flex items-center justify-between p-2 border border-gray-200 rounded transition-colors \${
                        snapshot.isDragging ? 'bg-blue-50 border-blue-300' : 'bg-white'
                      }\`}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 cursor-grab">⋮⋮</div>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="mr-2"
                        />
                        <span className={\`\${todo.completed ? 'line-through text-gray-500' : ''}\`}>
                          {todo.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-2 py-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
\`\`\`

## Key Features Added

1. **Drag Handle**: The ⋮⋮ icon serves as a drag handle
2. **Visual Feedback**: Items change appearance when being dragged
3. **Reordering**: Todos can be reordered by dragging
4. **Smooth Animations**: Built-in animations for drag operations

## Usage Notes

- Drag any todo item to reorder the list
- The drag handle (⋮⋮) makes it clear where to grab
- Visual feedback shows when an item is being dragged
- The list automatically reorders when you drop an item

This enhanced version maintains all the original functionality while adding intuitive drag and drop capabilities!`,
  },
]

export function MCPChatInterface() {
  // Ensure mcpTools is an array and has at least one item
  const safeMcpTools =
    Array.isArray(mcpTools) && mcpTools.length > 0
      ? mcpTools
      : [
          {
            id: "default",
            name: "Default",
            description: "Default tool",
            type: "default",
            requiresAuth: false,
          },
        ]

  const [activeTool, setActiveTool] = useState(safeMcpTools[0])
  const { hasRequiredTokens, toolTokens, toolActivation } = useSettings()
  const { currentSession, createNewSession, addMessageToSession } = useChat()
  const { isOpen: isDocumentOpen } = useDocument()
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Resize functionality
  const [chatWidth, setChatWidth] = useState(60) // percentage
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Wait for settings to load
  useEffect(() => {
    // Check if settings context has been initialized
    if (toolTokens !== undefined) {
      setIsSettingsLoaded(true)
    }
  }, [toolTokens])

  // Listen for new chat events from sidebar
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([])
      setInput("")
    }

    window.addEventListener("newChat", handleNewChat)
    return () => window.removeEventListener("newChat", handleNewChat)
  }, [])

  // Filter tools based on activation status
  const activeTools = safeMcpTools.filter((tool) => toolActivation[tool.id] !== false)

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain between 30% and 80%
      const constrainedWidth = Math.min(Math.max(newWidth, 30), 80)
      setChatWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Show loading state while settings are loading
  if (!isSettingsLoaded) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat interface...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleToolChange = (toolId: string) => {
    const tool = activeTools.find((t) => t.id === toolId) || activeTools[0]
    if (tool) {
      setActiveTool(tool)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with markdown content
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: `# Response to: "${input}"

Here's a detailed response with markdown content:

## Code Example

\`\`\`javascript
function handleUserInput(input) {
  console.log('Processing:', input);
  return {
    status: 'success',
    message: 'Input processed successfully'
  };
}
\`\`\`

## Key Points

1. **Input Processing**: The system processes your input efficiently
2. **Response Generation**: AI generates contextual responses
3. **Markdown Support**: Full markdown rendering is supported

## Additional Information

This is a mock response that demonstrates how markdown content would be displayed in the chat interface. The Document Block on the right allows for better review of longer content.

### Features Included

- Syntax highlighting for code blocks
- Proper markdown formatting
- Interactive document viewing
- Resizable interface panels

Thank you for your question!`,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleStop = () => {
    setIsLoading(false)
  }

  const needsToken = activeTool?.requiresAuth && !hasRequiredTokens(activeTool?.id || "")

  return (
    <div className="flex h-full" ref={containerRef}>
      {/* Main Chat Area */}
      <div className="flex flex-col" style={{ width: isDocumentOpen ? `${chatWidth}%` : "100%" }}>
        <div className="h-full flex flex-col bg-background">
          {/* Content Area */}
          <div className="flex flex-col h-full p-4">
            {/* Header with Tool Settings */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium">
                  {currentSession ? currentSession.title : `Chat with ${activeTool?.name || "AI"}`}
                </h2>
                {currentSession && (
                  <div className="text-sm text-muted-foreground">{currentSession.messageCount} messages</div>
                )}
              </div>
              <ToolSettingsDialog />
            </div>

            {/* Alerts */}
            {activeTools.length === 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No tools are currently active. Please enable at least one tool in Tool Settings.
                </AlertDescription>
              </Alert>
            )}

            {needsToken && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  API token required for {activeTool?.name || "this tool"}. Please configure it in settings.
                </AlertDescription>
              </Alert>
            )}

            {messages.length === 0 && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Welcome to MCP Chat</AlertTitle>
                <AlertDescription>
                  Start a conversation by typing a message below. This demo includes mock data with markdown content
                  that you can explore in the Document Block.
                </AlertDescription>
              </Alert>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-muted/30 rounded-lg border">
              <div className="h-full overflow-auto">
                <MessageList messages={messages} isStreaming={isLoading} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="mt-4">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                activeTool={activeTool}
                tools={activeTools}
                onToolChange={handleToolChange}
                disabled={needsToken || activeTools.length === 0}
                onStop={handleStop}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      {isDocumentOpen && (
        <div
          className={cn(
            "flex items-center justify-center w-2 bg-border hover:bg-muted cursor-col-resize transition-colors",
            isResizing && "bg-muted",
          )}
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Document Block */}
      {isDocumentOpen && (
        <div className="flex-1" style={{ width: `${100 - chatWidth}%` }}>
          <DocumentBlock />
        </div>
      )}
    </div>
  )
}
