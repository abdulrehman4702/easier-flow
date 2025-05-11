"use client"

import type React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { WorkflowHeader } from "@/components/workflow/workflow-header"
import { NodeSidebar } from "@/components/workflow/node-sidebar"
import { NodeConfigPanel } from "@/components/workflow/node-config-panel"
import { ExecutionPanel } from "@/components/workflow/execution-panel"
import { ChatInterface } from "@/components/ai-assistant/chat-interface"
import { AuthFormModal } from "@/components/workflow/auth-form-modal"
import { WorkflowGeneratorModal } from "@/components/workflow/workflow-generator-modal"
import { YamlUploader } from "@/components/workflow/yaml-uploader"
import { TransformerConfigPanel } from "@/components/workflow/transformer-config-panel"
import { nodeTypes } from "@/lib/workflow/node-types"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const initialNodes: Node[] = [
  {
    id: "1",
    type: "triggerNode",
    data: { label: "Webhook Trigger" },
    position: { x: 250, y: 100 },
  },
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Enhanced ResizeObserver error handling
export function handleResizeObserverError() {
  // Only apply the fix if we're in a browser environment
  if (typeof window === "undefined") return

  // Store the original console.error
  const originalConsoleError = window.console.error

  // Override console.error to filter out ResizeObserver errors
  window.console.error = (...args) => {
    // Check if the error is a ResizeObserver error
    if (
      args.length > 0 &&
      typeof args[0] === "string" &&
      (args[0].includes("ResizeObserver loop") ||
        args[0].includes("ResizeObserver loop completed with undelivered notifications") ||
        args[0].includes("ResizeObserver is not defined") ||
        args[0].includes("Maximum update depth exceeded"))
    ) {
      // Ignore the ResizeObserver and Maximum update depth errors
      return
    }

    // Pass through all other errors to the original console.error
    originalConsoleError.apply(console, args)
  }

  // Add a global error handler for unhandled promise rejections
  window.addEventListener(
    "error",
    (event) => {
      if (
        event.message &&
        (event.message.includes("ResizeObserver loop") ||
          event.message.includes("ResizeObserver is not defined") ||
          event.message.includes("Maximum update depth exceeded"))
      ) {
        event.stopImmediatePropagation()
        event.preventDefault()
        return true
      }
      return false
    },
    true,
  )

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (
        event.reason &&
        event.reason.message &&
        (event.reason.message.includes("ResizeObserver loop") ||
          event.reason.message.includes("ResizeObserver is not defined") ||
          event.reason.message.includes("Maximum update depth exceeded"))
      ) {
        event.stopImmediatePropagation()
        event.preventDefault()
        return true
      }
      return false
    },
    true,
  )

  // Apply a polyfill for ResizeObserver if it's not available
  if (typeof window.ResizeObserver === "undefined") {
    // Simple mock implementation to prevent errors
    window.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback
      }
      observe() {
        /* no-op */
      }
      unobserve() {
        /* no-op */
      }
      disconnect() {
        /* no-op */
      }
    }
  } else {
    // Patch the existing ResizeObserver to catch errors
    const OriginalResizeObserver = window.ResizeObserver
    window.ResizeObserver = class PatchedResizeObserver extends OriginalResizeObserver {
      constructor(callback) {
        const patchedCallback = (entries, observer) => {
          try {
            callback(entries, observer)
          } catch (e) {
            // Silently catch errors in the callback
            console.warn("ResizeObserver callback error suppressed:", e)
          }
        }
        super(patchedCallback)
      }
    }
  }
}

// Add a debounce utility function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Add a throttle utility function
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      lastRan = Date.now()
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// Safe state update function to prevent state updates during unmount
export function useSafeState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialState)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMounted.current) {
      setState(value)
    }
  }, [])

  return [state, safeSetState]
}

// Utility to safely access window object
export function safeWindow<T>(callback: (w: Window) => T, fallback: T): T {
  if (typeof window !== "undefined") {
    try {
      return callback(window)
    } catch (e) {
      console.warn("Error accessing window:", e)
      return fallback
    }
  }
  return fallback
}

export default function CreateWorkflow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState("Untitled Workflow")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<any[]>([])
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [showWorkflowGenerator, setShowWorkflowGenerator] = useState(false)
  const [showYamlUploader, setShowYamlUploader] = useState(false)
  const [showTransformerConfig, setShowTransformerConfig] = useState(false)
  const [transformerNodeId, setTransformerNodeId] = useState<string | null>(null)
  const [chatMinimized, setChatMinimized] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<any>(null)
  const isInitialRender = useRef(true)
  const updateInProgress = useRef(false)

  // Apply ResizeObserver error handling once on mount
  useEffect(() => {
    handleResizeObserverError()

    // Clean up function
    return () => {
      // Any cleanup needed
    }
  }, [])

  // Update URL when a node is selected - use throttling to prevent too many history updates
  const updateUrlWithSelectedNode = useCallback(
    throttle((nodeId: string | null) => {
      if (nodeId) {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set("activationId", nodeId)
        window.history.replaceState({}, "", newUrl.toString())
      } else {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete("activationId")
        window.history.replaceState({}, "", newUrl.toString())
      }
    }, 300),
    [],
  )

  // Update URL when selected node changes
  useEffect(() => {
    if (!isInitialRender.current) {
      updateUrlWithSelectedNode(selectedNode?.id || null)
    }
  }, [selectedNode, updateUrlWithSelectedNode])

  // Check if a node is selected in the URL
  useEffect(() => {
    const activationId = searchParams.get("activationId")

    if (isInitialRender.current) {
      if (activationId) {
        const node = nodes.find((node) => node.id === activationId)
        if (node) {
          setSelectedNode(node)
        }
      }
      isInitialRender.current = false
    }
  }, [searchParams, nodes])

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      // Add a small delay before adding the edge
      setTimeout(() => {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds))
        updateInProgress.current = false
      }, 50)
    },
    [setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Store the ReactFlow instance when it's ready
  const onInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (updateInProgress.current) return
      updateInProgress.current = true

      const type = event.dataTransfer.getData("application/reactflow/type")
      const label = event.dataTransfer.getData("application/reactflow/label")
      const dataStr = event.dataTransfer.getData("application/reactflow/data")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        updateInProgress.current = false
        return
      }

      const position = reactFlowWrapper.current
        ? {
            x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
            y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
          }
        : { x: event.clientX, y: event.clientY }

      // Parse additional data if available
      let additionalData = {}
      if (dataStr) {
        try {
          additionalData = JSON.parse(dataStr)
        } catch (e) {
          console.error("Failed to parse node data:", e)
        }
      }

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: {
          label,
          ...additionalData,
          activationId: `${Date.now()}`,
        },
      }

      // Use a longer delay for node addition from drag and drop
      setTimeout(() => {
        setNodes((nds) => nds.concat(newNode))
        setTimeout(() => {
          updateInProgress.current = false
        }, 100)
      }, 100)
    },
    [setNodes],
  )

  // Debounced version of handleAddNode to prevent too many updates
  const debouncedAddNode = useCallback(
    debounce((nodeType: string, data: any, position: { x: number; y: number }) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      const newNode = {
        id: `${Date.now()}`,
        type: nodeType,
        position,
        data: {
          ...data,
          activationId: `${Date.now()}`,
        },
      }

      setNodes((nds) => nds.concat(newNode))

      setTimeout(() => {
        updateInProgress.current = false
      }, 100)
    }, 100),
    [],
  )

  const handleAddNode = useCallback(
    (nodeType: string, data: any, position: { x: number; y: number }) => {
      debouncedAddNode(nodeType, data, position)
    },
    [debouncedAddNode],
  )

  // Debounced version of handleDeleteNode to prevent too many updates
  const debouncedDeleteNode = useCallback(
    debounce((nodeId: string) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      setNodes((nds) => nds.filter((node) => node.id !== nodeId))

      // Delay edge updates to happen after node updates
      setTimeout(() => {
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
        updateInProgress.current = false
      }, 100)
    }, 100),
    [],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      debouncedDeleteNode(nodeId)
    },
    [debouncedDeleteNode],
  )

  // Debounced version of handleUpdateNode to prevent too many updates
  const debouncedUpdateNode = useCallback(
    debounce((nodeId: string, data: any) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data } : node)))

      setTimeout(() => {
        updateInProgress.current = false
      }, 100)
    }, 100),
    [],
  )

  const handleUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      debouncedUpdateNode(nodeId, data)
    },
    [debouncedUpdateNode],
  )

  const handleExecuteWorkflow = useCallback(() => {
    if (updateInProgress.current) return
    updateInProgress.current = true

    setIsExecuting(true)
    // Simulate workflow execution
    setTimeout(() => {
      setExecutionResults(
        nodes.map((node) => ({
          id: node.id,
          type: node.type,
          status: Math.random() > 0.2 ? "success" : "error",
          data:
            node.type === "apiNode"
              ? { response: { status: 200, data: { message: "Success", items: [1, 2, 3] } } }
              : { output: { processed: true, timestamp: new Date().toISOString() } },
        })),
      )
      setIsExecuting(false)
      updateInProgress.current = false
    }, 2000)
  }, [nodes])

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (updateInProgress.current) return

      // Check if the node is close to another node to create a connection
      const closeNode = nodes.find(
        (n) =>
          n.id !== node.id &&
          Math.abs(n.position.x - node.position.x) < 50 &&
          Math.abs(n.position.y - node.position.y) < 50,
      )

      if (closeNode) {
        updateInProgress.current = true
        // Add a small delay before adding the edge
        setTimeout(() => {
          const newEdge = {
            id: `e${node.id}-${closeNode.id}`,
            source: node.id,
            target: closeNode.id,
            animated: true,
          }
          setEdges((eds) => [...eds, newEdge])
          updateInProgress.current = false
        }, 100)
      }
    },
    [nodes, setEdges],
  )

  // Improved batch processing for adding nodes
  const addNodesInBatches = useCallback(
    (newNodes: Node[], batchSize = 2, onComplete?: () => void) => {
      if (!newNodes || newNodes.length === 0) {
        if (onComplete) onComplete()
        return
      }

      if (updateInProgress.current) {
        // If an update is in progress, retry after a delay
        setTimeout(() => {
          addNodesInBatches(newNodes, batchSize, onComplete)
        }, 200)
        return
      }

      updateInProgress.current = true
      const batch = newNodes.slice(0, batchSize)
      const remaining = newNodes.slice(batchSize)

      setTimeout(() => {
        setNodes((nds) => [...nds, ...batch])

        setTimeout(() => {
          updateInProgress.current = false

          if (remaining.length > 0) {
            setTimeout(() => {
              addNodesInBatches(remaining, batchSize, onComplete)
            }, 200)
          } else if (onComplete) {
            setTimeout(onComplete, 200)
          }
        }, 100)
      }, 200)
    },
    [setNodes],
  )

  const handleEndpointsExtracted = useCallback(
    (endpoints: any[]) => {
      // Create API nodes for each endpoint
      const startX = 250
      const startY = 100
      const spacing = 150

      const newNodes = endpoints.map((endpoint, index) => ({
        id: `${Date.now() + index}`,
        type: "apiNode",
        position: {
          x: startX,
          y: startY + index * spacing,
        },
        data: {
          label: endpoint.operationId || `${endpoint.method} ${endpoint.path}`,
          method: endpoint.method,
          url: endpoint.path,
          schemaResponse:
            endpoint.responses && endpoint.responses["200"]
              ? endpoint.responses["200"].content?.["application/json"]?.schema
              : { type: "object", properties: {} },
          requestBody: endpoint.requestBody?.content?.["application/json"]?.schema?.properties || {},
          activationId: `${Date.now() + index}`,
        },
      }))

      // Add nodes in batches
      addNodesInBatches(newNodes, 2, () => {
        setShowYamlUploader(false)
      })
    },
    [addNodesInBatches],
  )

  const handleConfigureTransformer = useCallback((nodeId: string) => {
    if (updateInProgress.current) return

    setTransformerNodeId(nodeId)
    // Add a small delay before showing the config panel
    setTimeout(() => {
      setShowTransformerConfig(true)
    }, 100)
  }, [])

  // Create custom node types with the configure transformer callback
  const customNodeTypes = {
    ...nodeTypes,
    transformerNode: (props: any) => (
      <nodeTypes.transformerNode {...props} onConfigureTransformer={handleConfigureTransformer} />
    ),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <WorkflowHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        onExecute={handleExecuteWorkflow}
        isExecuting={isExecuting}
        onGenerateWorkflow={() => setShowWorkflowGenerator(true)}
        onImportYaml={() => setShowYamlUploader(true)}
      />
      <div className="flex flex-1">
        <NodeSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1" style={{ height: "calc(100vh - 56px)" }} ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={customNodeTypes}
              onInit={onInit}
              fitView
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              nodesDraggable={true}
              nodesConnectable={true}
              snapToGrid={true}
              snapGrid={[15, 15]}
              onError={(error) => {
                console.warn("ReactFlow error suppressed:", error)
              }}
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
              <Panel position="bottom-right">
                <Button className="rounded-full h-12 w-12 shadow-lg" onClick={() => setChatMinimized(!chatMinimized)}>
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </Panel>
            </ReactFlow>
          </div>
          {executionResults.length > 0 && (
            <ExecutionPanel results={executionResults} onClose={() => setExecutionResults([])} />
          )}
        </div>
        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onDelete={handleDeleteNode}
            onShowAuthForm={() => setShowAuthForm(true)}
            onUpdateNode={handleUpdateNode}
          />
        )}
      </div>

      <ChatInterface
        onAddNode={handleAddNode}
        onGenerateWorkflow={(workflow) => {
          if (updateInProgress.current) return
          updateInProgress.current = true

          // Clear existing nodes and edges first
          setNodes([])
          setEdges([])
          setWorkflowName(workflow.name || "Generated Workflow")

          // Add a longer delay before adding new nodes and edges
          setTimeout(() => {
            updateInProgress.current = false
            // Add nodes in batches
            addNodesInBatches(workflow.nodes || [], 2, () => {
              // Add edges after all nodes are added
              setTimeout(() => {
                setEdges(workflow.edges || [])
              }, 200)
            })
          }, 300)
        }}
        minimized={chatMinimized}
        onToggleMinimize={() => setChatMinimized(!chatMinimized)}
        nodes={nodes}
        edges={edges}
      />

      {showAuthForm && (
        <AuthFormModal
          show={showAuthForm}
          onClose={() => setShowAuthForm(false)}
          onComplete={(authConfig) => {
            if (selectedNode) {
              if (updateInProgress.current) return
              updateInProgress.current = true

              setTimeout(() => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === selectedNode.id ? { ...node, data: { ...node.data, auth: authConfig } } : node,
                  ),
                )
                updateInProgress.current = false
                setShowAuthForm(false)
              }, 100)
            } else {
              setShowAuthForm(false)
            }
          }}
          initialAuthType={selectedNode?.data?.auth?.type || "none"}
          serviceType={selectedNode?.data?.service}
        />
      )}

      {showWorkflowGenerator && (
        <WorkflowGeneratorModal
          show={showWorkflowGenerator}
          onClose={() => setShowWorkflowGenerator(false)}
          onGenerate={(workflow) => {
            if (updateInProgress.current) return
            updateInProgress.current = true

            // Clear existing nodes and edges first
            setNodes([])
            setEdges([])
            setWorkflowName(workflow.name || "Generated Workflow")

            // Add a longer delay before adding new nodes and edges
            setTimeout(() => {
              updateInProgress.current = false
              // Add nodes in batches
              addNodesInBatches(workflow.nodes || [], 2, () => {
                // Add edges after all nodes are added
                setTimeout(() => {
                  setEdges(workflow.edges || [])
                  setShowWorkflowGenerator(false)
                }, 200)
              })
            }, 300)
          }}
        />
      )}

      {showYamlUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import Swagger/OpenAPI YAML</h2>
            <YamlUploader onEndpointsExtracted={handleEndpointsExtracted} />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowYamlUploader(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTransformerConfig && transformerNodeId && (
        <TransformerConfigPanel
          node={nodes.find((n) => n.id === transformerNodeId)!}
          nodes={nodes}
          onClose={() => {
            setShowTransformerConfig(false)
            setTransformerNodeId(null)
          }}
          onSave={handleUpdateNode}
        />
      )}
    </div>
  )
}

