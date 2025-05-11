"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRightCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FieldMapping {
  id: string
  sourceField: string
  targetField: string
  transformation?: string
}

interface VisualFieldMapperProps {
  sourceFields: string[]
  targetFields: string[]
  mappings: FieldMapping[]
  onMappingsChange: (mappings: FieldMapping[]) => void
  sourceNodeName: string
  targetNodeName: string
}

export function VisualFieldMapper({
  sourceFields,
  targetFields,
  mappings,
  onMappingsChange,
  sourceNodeName,
  targetNodeName,
}: VisualFieldMapperProps) {
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<{ source: string; target: string; id: string }[]>([])

  // Update lines when mappings change
  useEffect(() => {
    setLines(
      mappings.map((mapping) => ({
        source: mapping.sourceField,
        target: mapping.targetField,
        id: mapping.id,
      })),
    )
  }, [mappings])

  const handleDragStart = (e: React.DragEvent, field: string) => {
    e.dataTransfer.setData("text/plain", field)
    setDraggedField(field)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent, field: string) => {
    e.preventDefault()
    setHoveredTarget(field)
  }

  const handleDragLeave = () => {
    setHoveredTarget(null)
  }

  const handleDrop = (e: React.DragEvent, targetField: string) => {
    e.preventDefault()
    const sourceField = e.dataTransfer.getData("text/plain")

    // Check if this mapping already exists
    const existingMapping = mappings.find((m) => m.sourceField === sourceField && m.targetField === targetField)

    if (!existingMapping) {
      const newMapping: FieldMapping = {
        id: `mapping-${Date.now()}`,
        sourceField,
        targetField,
        transformation: "",
      }

      onMappingsChange([...mappings, newMapping])
    }

    setDraggedField(null)
    setHoveredTarget(null)
  }

  const handleRemoveMapping = (id: string) => {
    onMappingsChange(mappings.filter((mapping) => mapping.id !== id))
  }

  const getFieldColor = (field: string) => {
    // Check if field is mapped
    const isMapped = mappings.some((m) => m.sourceField === field || m.targetField === field)
    return isMapped ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Drag fields from source to target to create mappings</h3>
        <Button variant="outline" size="sm" onClick={() => onMappingsChange([])} disabled={mappings.length === 0}>
          Clear All Mappings
        </Button>
      </div>

      <div className="flex-1 flex border rounded-md overflow-hidden">
        <div className="flex-1 flex flex-col border-r">
          <div className="p-2 bg-muted font-medium text-sm border-b truncate">{sourceNodeName || "Source Fields"}</div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {sourceFields.map((field) => (
                <div
                  key={field}
                  className={`p-2 rounded border ${getFieldColor(field)} cursor-grab relative`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field)}
                  data-field={field}
                >
                  <div className="text-sm truncate">{field}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="w-16 flex items-center justify-center bg-muted/30">
          <ArrowRightCircle className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-2 bg-muted font-medium text-sm border-b truncate">{targetNodeName || "Target Fields"}</div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {targetFields.map((field) => (
                <div
                  key={field}
                  className={`p-2 rounded border ${
                    hoveredTarget === field ? "bg-blue-100 border-blue-300" : getFieldColor(field)
                  } relative`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, field)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, field)}
                  data-field={field}
                >
                  <div className="text-sm truncate">{field}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Current Mappings</h3>
        <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
          {mappings.length === 0 ? (
            <div className="text-center py-2 text-muted-foreground">
              No mappings defined. Drag fields to create mappings.
            </div>
          ) : (
            <div className="space-y-1">
              {mappings.map((mapping) => (
                <div key={mapping.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center text-sm">
                    <span className="font-medium">{mapping.sourceField}</span>
                    <ArrowRightCircle className="h-4 w-4 mx-2 text-muted-foreground" />
                    <span className="font-medium">{mapping.targetField}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMapping(mapping.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// X icon component
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

