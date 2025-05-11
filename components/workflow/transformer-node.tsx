"use client"

import type React from "react"

import { memo, useState, useRef, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Zap, Settings, Edit2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { calculateNodeWidth } from "@/lib/node-utils"

interface TransformerNodeProps extends NodeProps {
  onConfigureTransformer: (nodeId: string) => void
}

export const TransformerNode = memo(
  ({ data, isConnectable, id, onConfigureTransformer, selected }: TransformerNodeProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [nodeName, setNodeName] = useState(data.label || "Transformer")
    const inputRef = useRef<HTMLInputElement>(null)
    const [nodeWidth, setNodeWidth] = useState(calculateNodeWidth(data.label, 220))

    const hasSourceAndTarget = data.sourceNodeId && data.targetNodeId
    const mappingCount = data.fieldMappings?.length || 0

    // Update node width when label changes
    useEffect(() => {
      setNodeWidth(calculateNodeWidth(data.label, 220))
      setNodeName(data.label || "Transformer")
    }, [data.label])

    // Focus input when editing starts
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isEditing])

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsEditing(true)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNodeName(e.target.value)
    }

    const handleNameSave = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (data.onNameChange) {
        data.onNameChange(nodeName)
      }
      setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (data.onNameChange) {
          data.onNameChange(nodeName)
        }
        setIsEditing(false)
      } else if (e.key === "Escape") {
        setNodeName(data.label || "Transformer")
        setIsEditing(false)
      }
    }

    return (
      <div
        className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? "border-blue-500" : "border-purple-500"}`}
        style={{ width: `${nodeWidth}px`, minWidth: "220px" }}
      >
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-purple-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <Zap className="h-4 w-4 mr-2 text-purple-500" />
            {isEditing ? (
              <Input
                ref={inputRef}
                value={nodeName}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                className="h-6 text-sm py-0 px-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="text-sm font-bold truncate">{nodeName}</div>
            )}
          </div>
          {isEditing ? (
            <button onClick={handleNameSave} className="ml-1 p-1 rounded-full hover:bg-gray-100">
              <Check className="h-3 w-3 text-green-500" />
            </button>
          ) : (
            <button onClick={handleEditClick} className="ml-1 p-1 rounded-full hover:bg-gray-100">
              <Edit2 className="h-3 w-3 text-gray-500" />
            </button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1"
            onClick={(e) => {
              e.stopPropagation()
              // Add a small delay before configuring to prevent resize issues
              setTimeout(() => {
                onConfigureTransformer(id)
              }, 50)
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs mt-1 text-gray-500">
          {hasSourceAndTarget ? (
            <div className="flex flex-col">
              <span>{mappingCount} field mappings</span>
              {data.sourceNodeName && data.targetNodeName && (
                <span className="text-xs text-muted-foreground truncate">
                  {data.sourceNodeName} → {data.targetNodeName}
                </span>
              )}
            </div>
          ) : (
            <span className="text-amber-500">Needs configuration</span>
          )}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-2 h-2 bg-purple-500"
        />
      </div>
    )
  },
)

TransformerNode.displayName = "TransformerNode"

