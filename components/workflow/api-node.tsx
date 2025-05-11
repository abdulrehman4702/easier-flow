"use client"

import type React from "react"

import { memo, useState, useRef, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Globe, Edit2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { calculateNodeWidth } from "@/lib/node-utils"

export const ApiNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nodeName, setNodeName] = useState(data.label || "API Request")
  const inputRef = useRef<HTMLInputElement>(null)
  const [nodeWidth, setNodeWidth] = useState(calculateNodeWidth(data.label))

  // Update node width when label changes
  useEffect(() => {
    setNodeWidth(calculateNodeWidth(data.label))
    setNodeName(data.label || "API Request")
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
      setNodeName(data.label || "API Request")
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? "border-blue-500" : "border-green-500"}`}
      style={{ width: `${nodeWidth}px`, minWidth: "180px" }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-green-500" />
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Globe className="h-4 w-4 mr-2 text-green-500" />
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
      </div>
      <div className="text-xs mt-1 text-gray-500 truncate">
        {data.method} {data.url && formatEndpointPath(data.url)}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 bg-green-500" />
    </div>
  )
})

ApiNode.displayName = "ApiNode"

// Helper function to format endpoint paths
function formatEndpointPath(path: string): string {
  return path?.replace(/\{([^}]+)\}/g, ":$1") || ""
}

