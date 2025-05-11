"use client"

import type React from "react"
import { useCallback, useState, useRef, useEffect } from "react"
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
import { FilterConfigPanel } from "@/components/workflow/filter-config-panel"
import { NodeTypes } from "@/components/workflow/node-types"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleResizeObserverError } from "@/lib/utils"
import { LayoutWithOverlay } from "@/components/workflow/layout-with-overlay"

const initialNodes: Node[] = [
  {
    id: "1",
    type: "triggerNode",
    data: {
      label: "Webhook Trigger",
      onNameChange: (newName: string) => {}, // Will be replaced in useEffect
    },
    position: { x: 250, y: 100 },
  },
]

export default function CreatePage() {
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
  const [showFilterConfig, setShowFilterConfig] = useState(false)
  const [transformerNodeId, setTransformerNodeId] = useState<string | null>(null)
  const [filterNodeId, setFilterNodeId] = useState<string | null>(null)
  const [chatMinimized, setChatMinimized] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<any>(null)
  const isInitialRender = useRef(true)
  const updateInProgress = useRef(false)

  // Apply ResizeObserver error handling once on mount
  useEffect(() => {
    handleResizeObserverError()
  }, [])

  // Initialize onNameChange for initial nodes
  useEffect(() => {
    if (isInitialRender.current) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onNameChange: (newName: string) => {
              setNodes((nodes) =>
                nodes.map((n) => {
                  if (n.id === node.id) {
                    return {
                      ...n,
                      data: {
                        ...n.data,
                        label: newName,
                      },
                    }
                  }
                  return n
                }),
              )
            },
          },
        })),
      )
    }
  }, [setNodes])

  // Check if a node is selected in the URL
  useEffect(() => {
    const nodeId = searchParams.get("nodeId")

    if (isInitialRender.current) {
      if (nodeId) {
        const node = nodes.find((node) => node.id === nodeId)
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

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation() // Prevent event bubbling
    setSelectedNode(node)

    // Update URL with node ID
    const url = new URL(window.location.href)
    url.searchParams.set("nodeId", node.id)
    window.history.replaceState({}, "", url.toString())
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)

    // Remove nodeId from URL
    const url = new URL(window.location.href)
    url.searchParams.delete("nodeId")
    window.history.replaceState({}, "", url.toString())
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

      const type = event.dataTransfer.getData("type")
      const label = event.dataTransfer.getData("label")
      const dataStr = event.dataTransfer.getData("data")

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

      const nodeId = `${Date.now()}`

      // Create a function to handle node name changes
      const handleNodeNameChange = (newName: string) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: newName,
                },
              }
            }
            return node
          }),
        )
      }

      const newNode = {
        id: nodeId,
        type,
        position,
        data: {
          label,
          ...additionalData,
          onNameChange: handleNodeNameChange,
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

  const handleUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...data,
                onNameChange: (newName: string) => {
                  setNodes((nodes) =>
                    nodes.map((n) => {
                      if (n.id === nodeId) {
                        return {
                          ...n,
                          data: {
                            ...n.data,
                            label: newName,
                          },
                        }
                      }
                      return n
                    }),
                  )
                },
              },
            }
          }
          return node
        }),
      )

      setTimeout(() => {
        updateInProgress.current = false
      }, 100)
    },
    [setNodes],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (updateInProgress.current) return
      updateInProgress.current = true

      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setSelectedNode(null)

      // Delay edge updates to happen after node updates
      setTimeout(() => {
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
        updateInProgress.current = false
      }, 100)
    },
    [setNodes, setEdges],
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

  const handleConfigureTransformer = useCallback((nodeId: string) => {
    if (updateInProgress.current) return

    setTransformerNodeId(nodeId)
    // Add a small delay before showing the config panel
    setTimeout(() => {
      setShowTransformerConfig(true)
    }, 50)
  }, [])

  const handleConfigureFilter = useCallback((nodeId: string) => {
    if (updateInProgress.current) return

    setFilterNodeId(nodeId)
    // Add a small delay before showing the config panel
    setTimeout(() => {
      setShowFilterConfig(true)
    }, 50)
  }, [])

  // Create custom node types with the configure callbacks
  const customNodeTypes = {
    ...NodeTypes,
    transformerNode: (props: any) => (
      <NodeTypes.transformerNode {...props} onConfigureTransformer={handleConfigureTransformer} />
    ),
    filterNode: (props: any) => <NodeTypes.filterNode {...props} onConfigureFilter={handleConfigureFilter} />,
  }

  return (
    <LayoutWithOverlay>
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
          onAddNode={(nodeType, data, position) => {
            if (updateInProgress.current) return
            updateInProgress.current = true

            const nodeId = `${Date.now()}`

            const newNode = {
              id: nodeId,
              type: nodeType,
              position,
              data: {
                ...data,
                onNameChange: (newName: string) => {
                  setNodes((nodes) =>
                    nodes.map((n) => {
                      if (n.id === nodeId) {
                        return {
                          ...n,
                          data: {
                            ...n.data,
                            label: newName,
                          },
                        }
                      }
                      return n
                    }),
                  )
                },
              },
            }

            setNodes((nds) => nds.concat(newNode))
            setTimeout(() => {
              updateInProgress.current = false
            }, 100)
          }}
          onGenerateWorkflow={(workflow) => {
            if (updateInProgress.current) return
            updateInProgress.current = true

            // Clear existing nodes and edges first
            setNodes([])
            setEdges([])
            setWorkflowName(workflow.name || "Generated Workflow")

            // Add a longer delay before adding new nodes and edges
            setTimeout(() => {
              // Add nodes
              if (workflow.nodes) {
                setNodes(
                  workflow.nodes.map((node: any) => ({
                    ...node,
                    data: {
                      ...node.data,
                      onNameChange: (newName: string) => {
                        setNodes((nodes) =>
                          nodes.map((n) => {
                            if (n.id === node.id) {
                              return {
                                ...n,
                                data: {
                                  ...n.data,
                                  label: newName,
                                },
                              }
                            }
                            return n
                          }),
                        )
                      },
                    },
                  })),
                )
              }

              // Add edges after nodes
              setTimeout(() => {
                if (workflow.edges) {
                  setEdges(workflow.edges)
                }
                updateInProgress.current = false
              }, 200)
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
                // Add nodes
                if (workflow.nodes) {
                  setNodes(
                    workflow.nodes.map((node: any) => ({
                      ...node,
                      data: {
                        ...node.data,
                        onNameChange: (newName: string) => {
                          setNodes((nodes) =>
                            nodes.map((n) => {
                              if (n.id === node.id) {
                                return {
                                  ...n,
                                  data: {
                                    ...n.data,
                                    label: newName,
                                  },
                                }
                              }
                              return n
                            }),
                          )
                        },
                      },
                    })),
                  )
                }

                // Add edges after nodes
                setTimeout(() => {
                  if (workflow.edges) {
                    setEdges(workflow.edges)
                  }
                  setShowWorkflowGenerator(false)
                  updateInProgress.current = false
                }, 200)
              }, 300)
            }}
          />
        )}

        {showYamlUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Import Swagger/OpenAPI YAML</h2>
              <YamlUploader
                onEndpointsExtracted={(endpoints) => {
                  if (updateInProgress.current) return
                  updateInProgress.current = true

                  // Create API nodes for each endpoint
                  const startX = 250
                  const startY = 100
                  const spacing = 150

                  const newNodes = endpoints.map((endpoint, index) => {
                    const nodeId = `${Date.now() + index}`
                    return {
                      id: nodeId,
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
                        onNameChange: (newName: string) => {
                          setNodes((nodes) =>
                            nodes.map((n) => {
                              if (n.id === nodeId) {
                                return {
                                  ...n,
                                  data: {
                                    ...n.data,
                                    label: newName,
                                  },
                                }
                              }
                              return n
                            }),
                          )
                        },
                      },
                    }
                  })

                  setNodes((nds) => [...nds, ...newNodes])
                  setTimeout(() => {
                    setShowYamlUploader(false)
                    updateInProgress.current = false
                  }, 200)
                }}
              />
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

        {showFilterConfig && filterNodeId && (
          <FilterConfigPanel
            node={nodes.find((n) => n.id === filterNodeId)!}
            nodes={nodes}
            onClose={() => {
              setShowFilterConfig(false)
              setFilterNodeId(null)
            }}
            onSave={handleUpdateNode}
          />
        )}
      </div>
    </LayoutWithOverlay>
  )
}

