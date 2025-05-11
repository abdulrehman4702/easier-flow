"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Zap, Bot, User, X, Minimize } from "lucide-react"
import { cn, useSafeState, handleResizeObserverError } from "@/lib/utils"
import { processAiMessage } from "@/lib/ai-assistant"
import type { Node, Edge } from "reactflow"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  status?: "loading" | "complete" | "error"
  suggestions?: string[]
  nodeConfig?: any
  autoComplete?: any
}

interface ChatInterfaceProps {
  onAddNode?: (nodeType: string, data: any, position: { x: number; y: number }) => void
  onGenerateWorkflow?: (workflow: any) => void
  onOptimizeWorkflow?: (optimization: string) => void
  onAutoComplete?: (autoComplete: any) => void
  minimized?: boolean
  onToggleMinimize?: () => void
  nodes: Node[]
  edges: Edge[]
}

// Initial welcome message
const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your AI assistant for Easier Flow. I can help you create workflows, configure nodes, and more. What would you like to do today?",
  timestamp: new Date(),
  suggestions: [
    "Create a workflow to fetch data from an API",
    "Help me connect to a database",
    "Generate a workflow for social media automation",
  ],
}

export function ChatInterface({
  onAddNode,
  onGenerateWorkflow,
  onOptimizeWorkflow,
  onAutoComplete,
  minimized = false,
  onToggleMinimize,
  nodes,
  edges,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  // Use useSafeState to prevent state updates after unmount
  const [messages, setMessages] = useSafeState<Message[]>([WELCOME_MESSAGE])
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const processingRef = useRef(false) // Use ref to track processing state to prevent race conditions

  // Apply ResizeObserver error handling
  useEffect(() => {
    handleResizeObserverError()
  }, [])

  // Only scroll to bottom on first render and when messages change
  useEffect(() => {
    if (isFirstRender.current) {
      scrollToBottom()
      isFirstRender.current = false
    } else if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || processingRef.current) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      status: "loading",
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsProcessing(true)
    processingRef.current = true

    try {
      // Process the message with AI
      const response = await processAiMessage(input, nodes, edges)

      // Update the assistant message with the response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: response.message,
                status: "complete",
                suggestions: response.suggestions,
                nodeConfig: response.nodeConfig,
                autoComplete: response.autoComplete,
              }
            : msg,
        ),
      )

      // Handle AI-generated suggestions
      if (response.suggestions?.includes("Apply optimization") && onOptimizeWorkflow) {
        onOptimizeWorkflow(response.message)
      }

      // Handle auto-complete
      if (response.autoComplete && onAutoComplete) {
        onAutoComplete(response.autoComplete)
      }

      // If there's a node configuration, add it to the canvas
      if (response.nodeConfig && onAddNode) {
        setTimeout(() => {
          onAddNode(
            response.nodeConfig.type,
            { label: response.nodeConfig.label, ...response.nodeConfig.data },
            { x: 250, y: 200 },
          )
        }, 100)
      }

      // If there's a workflow configuration, generate the workflow
      if (response.workflow && onGenerateWorkflow) {
        setTimeout(() => {
          onGenerateWorkflow(response.workflow)
        }, 100)
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "Sorry, I encountered an error processing your request. Please try again.",
                status: "error",
              }
            : msg,
        ),
      )
    } finally {
      setIsProcessing(false)
      processingRef.current = false
    }
  }, [input, nodes, edges, onAddNode, onGenerateWorkflow, onOptimizeWorkflow, onAutoComplete, setMessages])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInput(suggestion)
      // Use setTimeout to ensure the input state is updated before sending
      setTimeout(() => {
        handleSendMessage()
      }, 0)
    },
    [handleSendMessage],
  )

  if (minimized) {
    return (
      <Button className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg" onClick={onToggleMinimize}>
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-lg border-primary/20 overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </Avatar>
          <CardTitle className="text-md font-medium">AI Assistant</CardTitle>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleMinimize}>
            <Minimize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleMinimize}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <Tabs defaultValue="chat">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="chat" className="flex-1">
            Chat
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1">
            Suggestions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="m-0">
          <ScrollArea className="h-[350px] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex flex-col mb-4", message.role === "assistant" ? "items-start" : "items-end")}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === "assistant" && (
                    <Avatar className="h-6 w-6 bg-primary">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </Avatar>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </span>
                  {message.role === "user" && (
                    <Avatar className="h-6 w-6 bg-secondary">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </Avatar>
                  )}
                </div>
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-[85%]",
                    message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {message.status === "loading" ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
                {message.nodeConfig && (
                  <div className="mt-2 p-2 bg-muted rounded-md text-xs">
                    <div className="font-medium">Node Configuration:</div>
                    <pre className="overflow-x-auto">{JSON.stringify(message.nodeConfig, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <CardFooter className="p-2 pt-0">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isProcessing || !input.trim()}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
        <TabsContent value="suggestions" className="m-0">
          <ScrollArea className="h-[350px] p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSuggestionClick("Create a workflow to fetch data from an API")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Fetch data from API
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSuggestionClick("Help me connect to a database")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Connect to database
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSuggestionClick("Generate a workflow for social media automation")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Social media automation
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Popular Workflows</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      handleSuggestionClick(
                        "Create a workflow to send Slack notifications when a new GitHub issue is created",
                      )
                    }
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    GitHub to Slack notifications
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSuggestionClick("Create a workflow to save Gmail attachments to Google Drive")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Gmail to Google Drive
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleSuggestionClick("Create a workflow to post new WordPress articles to Twitter")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    WordPress to Twitter
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

