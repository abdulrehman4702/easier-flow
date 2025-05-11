"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Save, X, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FieldMappingItem } from "@/components/workflow/field-mapping-item"
import { VisualFieldMapper } from "@/components/workflow/visual-field-mapper"
import type { Node } from "reactflow"

interface TransformerConfigPanelProps {
  node: Node
  nodes: Node[]
  onClose: () => void
  onSave: (nodeId: string, data: any) => void
}

interface Endpoint {
  id: string
  method: string
  path: string
  responseSchema?: any
  requestSchema?: any
}

interface FieldMapping {
  id: string
  sourceField: string
  targetField: string
  transformation?: string
}

export function TransformerConfigPanel({ node, nodes, onClose, onSave }: TransformerConfigPanelProps) {
  const [sourceNodeId, setSourceNodeId] = useState<string>(node.data.sourceNodeId || "")
  const [targetNodeId, setTargetNodeId] = useState<string>(node.data.targetNodeId || "")
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(node.data.fieldMappings || [])
  const [sourceFields, setSourceFields] = useState<string[]>([])
  const [targetFields, setTargetFields] = useState<string[]>([])
  const [sourceNodeName, setSourceNodeName] = useState<string>("")
  const [targetNodeName, setTargetNodeName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("mappings")

  // Get API nodes that can be used as source or target
  const apiNodes = nodes.filter((n) => n.type === "apiNode")
  const sourceNodes = apiNodes.filter((n) => n.data.method === "GET")
  const targetNodes = apiNodes.filter((n) => ["POST", "PUT", "PATCH"].includes(n.data.method))

  useEffect(() => {
    // When source node changes, update source fields
    if (sourceNodeId) {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId)
      if (sourceNode) {
        setSourceNodeName(sourceNode.data.label || `${sourceNode.data.method} ${sourceNode.data.url}`)
        if (sourceNode.data.schemaResponse) {
          // Extract fields from response schema
          const fields = extractFieldsFromSchema(sourceNode.data.schemaResponse)
          setSourceFields(fields)
        }
      }
    }
  }, [sourceNodeId, nodes])

  useEffect(() => {
    // When target node changes, update target fields
    if (targetNodeId) {
      const targetNode = nodes.find((n) => n.id === targetNodeId)
      if (targetNode) {
        setTargetNodeName(targetNode.data.label || `${targetNode.data.method} ${targetNode.data.url}`)
        if (targetNode.data.requestBody) {
          // Extract fields from request body schema
          const fields = extractFieldsFromSchema(targetNode.data.requestBody)
          setTargetFields(fields)
        }
      }
    }
  }, [targetNodeId, nodes])

  // Helper function to extract fields from schema
  const extractFieldsFromSchema = (schema: any): string[] => {
    if (!schema) return []

    // If it's a JSON string, parse it
    const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema

    // Extract fields from properties
    if (schemaObj.properties) {
      return Object.keys(schemaObj.properties)
    }

    // If it's an array with items that have properties
    if (schemaObj.type === "array" && schemaObj.items && schemaObj.items.properties) {
      return Object.keys(schemaObj.items.properties).map((field) => `items[].${field}`)
    }

    // If it's a simple object, return its keys
    if (typeof schemaObj === "object" && !Array.isArray(schemaObj)) {
      return Object.keys(schemaObj)
    }

    return []
  }

  const handleAddMapping = () => {
    const newMapping: FieldMapping = {
      id: `mapping-${Date.now()}`,
      sourceField: sourceFields.length > 0 ? sourceFields[0] : "",
      targetField: targetFields.length > 0 ? targetFields[0] : "",
      transformation: "",
    }
    setFieldMappings([...fieldMappings, newMapping])
  }

  const handleRemoveMapping = (id: string) => {
    setFieldMappings(fieldMappings.filter((mapping) => mapping.id !== id))
  }

  const handleUpdateMapping = (id: string, field: keyof FieldMapping, value: string) => {
    setFieldMappings(fieldMappings.map((mapping) => (mapping.id === id ? { ...mapping, [field]: value } : mapping)))
  }

  const handleSave = () => {
    onSave(node.id, {
      ...node.data,
      sourceNodeId,
      targetNodeId,
      sourceNodeName,
      targetNodeName,
      fieldMappings,
      label: `Transform: ${sourceNodeName} → ${targetNodeName}`,
    })

    // Add a small delay before closing to prevent resize issues
    setTimeout(() => {
      onClose()
    }, 50)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[800px] max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Configure Data Transformer</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 items-center">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="source-node">Source (GET Endpoint)</Label>
              <Select value={sourceNodeId} onValueChange={setSourceNodeId}>
                <SelectTrigger id="source-node">
                  <SelectValue placeholder="Select source node" />
                </SelectTrigger>
                <SelectContent>
                  {sourceNodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.data.label || `${node.data.method} ${node.data.url}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="target-node">Target (POST/PUT Endpoint)</Label>
              <Select value={targetNodeId} onValueChange={setTargetNodeId}>
                <SelectTrigger id="target-node">
                  <SelectValue placeholder="Select target node" />
                </SelectTrigger>
                <SelectContent>
                  {targetNodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.data.label || `${node.data.method} ${node.data.url}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="mappings" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
              <TabsTrigger value="visual">Visual Mapper</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="mappings" className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Map Source Fields to Target Fields</h3>
                <Button variant="outline" size="sm" onClick={handleAddMapping}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>

              <ScrollArea className="flex-1 border rounded-md p-2">
                <div className="space-y-2">
                  {fieldMappings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No field mappings defined. Click "Add Mapping" to create one.
                    </div>
                  ) : (
                    fieldMappings.map((mapping) => (
                      <FieldMappingItem
                        key={mapping.id}
                        mapping={mapping}
                        sourceFields={sourceFields}
                        targetFields={targetFields}
                        onUpdate={(field, value) => handleUpdateMapping(mapping.id, field, value)}
                        onRemove={() => handleRemoveMapping(mapping.id)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="visual" className="flex-1 flex flex-col">
              <VisualFieldMapper
                sourceFields={sourceFields}
                targetFields={targetFields}
                mappings={fieldMappings}
                onMappingsChange={setFieldMappings}
                sourceNodeName={sourceNodeName}
                targetNodeName={targetNodeName}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Source Data (Sample)</h3>
                  <div className="border rounded-md p-2 h-[300px] overflow-auto bg-muted/50">
                    <pre className="text-xs">
                      {JSON.stringify(
                        sourceFields.reduce(
                          (acc, field) => {
                            acc[field] = `value_for_${field}`
                            return acc
                          },
                          {} as Record<string, string>,
                        ),
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Transformed Data (Preview)</h3>
                  <div className="border rounded-md p-2 h-[300px] overflow-auto bg-muted/50">
                    <pre className="text-xs">
                      {JSON.stringify(
                        fieldMappings.reduce(
                          (acc, mapping) => {
                            acc[mapping.targetField] = mapping.transformation
                              ? `transformed(${mapping.sourceField})`
                              : `from_${mapping.sourceField}`
                            return acc
                          },
                          {} as Record<string, string>,
                        ),
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                // Add a small delay before closing to prevent resize issues
                setTimeout(() => {
                  onClose()
                }, 50)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

