"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save } from "lucide-react"
import { FieldFilter, type FilterCondition } from "@/components/workflow/field-filter"
import type { Node } from "reactflow"

interface FilterConfigPanelProps {
  node: Node
  nodes: Node[]
  onClose: () => void
  onSave: (nodeId: string, data: any) => void
}

export function FilterConfigPanel({ node, nodes, onClose, onSave }: FilterConfigPanelProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>(node.data.conditions || [])
  const [availableFields, setAvailableFields] = useState<string[]>([])

  // Find incoming nodes to extract fields
  useEffect(() => {
    // Get all edges where this node is the target
    const incomingNodeIds = nodes.filter((n) => n.id !== node.id).map((n) => n.id)

    // Extract fields from incoming nodes' schemas
    const fields: string[] = []

    incomingNodeIds.forEach((nodeId) => {
      const sourceNode = nodes.find((n) => n.id === nodeId)
      if (sourceNode) {
        if (sourceNode.type === "apiNode" && sourceNode.data.schemaResponse) {
          // Extract fields from API response schema
          const schema =
            typeof sourceNode.data.schemaResponse === "string"
              ? JSON.parse(sourceNode.data.schemaResponse)
              : sourceNode.data.schemaResponse

          if (schema.properties) {
            Object.keys(schema.properties).forEach((field) => {
              if (!fields.includes(field)) {
                fields.push(field)
              }
            })
          }
        } else if (sourceNode.data.fields) {
          // For other node types that might have fields defined
          sourceNode.data.fields.forEach((field: string) => {
            if (!fields.includes(field)) {
              fields.push(field)
            }
          })
        }
      }
    })

    // Add some default fields if none were found
    if (fields.length === 0) {
      fields.push("id", "name", "status", "createdAt", "updatedAt")
    }

    setAvailableFields(fields)
  }, [node.id, nodes])

  const handleSave = () => {
    onSave(node.id, {
      ...node.data,
      conditions,
      label:
        conditions.length > 0
          ? `Filter (${conditions.length} condition${conditions.length !== 1 ? "s" : ""})`
          : node.data.label || "Filter",
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[700px] max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Configure Filter</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
          <p className="text-sm text-muted-foreground">
            Define conditions to filter data. Only data that matches all conditions will pass through this node.
          </p>

          <FieldFilter fields={availableFields} conditions={conditions} onConditionsChange={setConditions} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
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

