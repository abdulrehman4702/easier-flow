"use client"

import type React from "react"

import { useState } from "react"
import { Webhook, Database, Globe, Zap, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NodeSidebar() {
  const [searchTerm, setSearchTerm] = useState("")

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData("type", nodeType)
    event.dataTransfer.setData("label", nodeLabel)
    event.dataTransfer.effectAllowed = "move"
  }

  const filteredNodes = [
    { type: "triggerNode", label: "Webhook Trigger", icon: <Webhook className="h-4 w-4 mr-2 text-blue-500" /> },
    { type: "apiNode", label: "API Request", icon: <Globe className="h-4 w-4 mr-2 text-green-500" /> },
    { type: "dataMapperNode", label: "Data Mapper", icon: <Database className="h-4 w-4 mr-2 text-orange-500" /> },
    { type: "transformerNode", label: "Transformer", icon: <Zap className="h-4 w-4 mr-2 text-purple-500" /> },
    { type: "filterNode", label: "Filter", icon: <Filter className="h-4 w-4 mr-2 text-yellow-500" /> },
  ].filter((node) => node.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4 border-b">
        <Label htmlFor="search-nodes" className="text-sm font-medium mb-2 block">
          Search Nodes
        </Label>
        <Input
          id="search-nodes"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium mb-2">Triggers</h3>
            <div
              className="flex items-center p-2 border rounded-md cursor-grab hover:bg-muted"
              draggable
              onDragStart={(event) => onDragStart(event, "triggerNode", "Webhook Trigger")}
            >
              <Webhook className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">Webhook Trigger</span>
            </div>
          </div>

          <div className="border-b border-gray-200 py-4">
            <h3 className="text-lg font-medium mb-2">API</h3>
            <div
              className="flex items-center p-2 border rounded-md cursor-grab hover:bg-muted"
              draggable
              onDragStart={(event) => onDragStart(event, "apiNode", "API Request")}
            >
              <Globe className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm">API Request</span>
            </div>
          </div>

          <div className="border-b border-gray-200 py-4">
            <h3 className="text-lg font-medium mb-2">Data</h3>
            <div
              className="flex items-center p-2 border rounded-md cursor-grab hover:bg-muted"
              draggable
              onDragStart={(event) => onDragStart(event, "dataMapperNode", "Data Mapper")}
            >
              <Database className="h-4 w-4 mr-2 text-orange-500" />
              <span className="text-sm">Data Mapper</span>
            </div>
          </div>

          <div className="border-b border-gray-200 py-4">
            <h3 className="text-lg font-medium mb-2">Transformers</h3>
            <div
              className="flex items-center p-2 border rounded-md cursor-grab hover:bg-muted mb-2"
              draggable
              onDragStart={(event) => onDragStart(event, "transformerNode", "Transformer")}
            >
              <Zap className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-sm">Transformer</span>
            </div>
            <div
              className="flex items-center p-2 border rounded-md cursor-grab hover:bg-muted"
              draggable
              onDragStart={(event) => onDragStart(event, "filterNode", "Filter")}
            >
              <Filter className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="text-sm">Filter</span>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" asChild>
              <a href="https://docs.easierflow.com/nodes" target="_blank" rel="noopener noreferrer">
                View Node Documentation
              </a>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

