"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Save } from "lucide-react"
import type { Node } from "reactflow"
import { JsonEditor } from "@/components/workflow/json-editor"
import { RequestBodyEditor } from "@/components/workflow/request-body-editor"

interface NodeConfigPanelProps {
  node: Node
  onDelete: (nodeId: string) => void
  onShowAuthForm: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

export function NodeConfigPanel({ node, onDelete, onShowAuthForm, onUpdateNode }: NodeConfigPanelProps) {
  const [nodeName, setNodeName] = useState(node.data.label || "")
  const [nodeMethod, setNodeMethod] = useState(node.data.method || "GET")
  const [nodeUrl, setNodeUrl] = useState(node.data.url || "")
  const [schemaResponse, setSchemaResponse] = useState<string>(
    node.data.schemaResponse
      ? JSON.stringify(node.data.schemaResponse, null, 2)
      : JSON.stringify({ status: 200, data: {} }, null, 2),
  )
  const [requestBody, setRequestBody] = useState<any>(node.data.requestBody || {})

  // Update local state when node changes
  useEffect(() => {
    setNodeName(node.data.label || "")
    setNodeMethod(node.data.method || "GET")
    setNodeUrl(node.data.url || "")
    setSchemaResponse(
      node.data.schemaResponse
        ? JSON.stringify(node.data.schemaResponse, null, 2)
        : JSON.stringify({ status: 200, data: {} }, null, 2),
    )
    setRequestBody(node.data.requestBody || {})
  }, [node])

  const handleSave = () => {
    let parsedSchema
    try {
      parsedSchema = JSON.parse(schemaResponse)
    } catch (error) {
      console.error("Invalid JSON schema:", error)
      // You might want to show an error message to the user here
      return
    }

    // Add a small delay before updating the node to prevent resize issues
    setTimeout(() => {
      onUpdateNode(node.id, {
        ...node.data,
        label: nodeName,
        method: nodeMethod,
        url: nodeUrl,
        schemaResponse: parsedSchema,
        requestBody,
      })
    }, 50)
  }

  const showRequestBody = ["POST", "PUT", "PATCH", "DELETE"].includes(nodeMethod)

  return (
    <div className="w-80 border-l p-4 overflow-y-auto" style={{ height: "calc(100vh - 56px)" }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Node Configuration</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(node.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="node-name">Node Name</Label>
          <Input id="node-name" value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          {showRequestBody && <TabsTrigger value="body">Body</TabsTrigger>}
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          {node.type === "apiNode" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input
                  id="endpoint"
                  placeholder="https://api.example.com/data"
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Method</Label>
                <Select value={nodeMethod} onValueChange={setNodeMethod}>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth">Authentication</Label>
                <div className="flex space-x-2">
                  <Select defaultValue={node.data.auth?.type || "none"}>
                    <SelectTrigger id="auth" className="flex-1">
                      <SelectValue placeholder="Select authentication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="apiKey">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={onShowAuthForm}>
                    Configure
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Add more node-specific configuration options here */}
        </TabsContent>

        <TabsContent value="schema" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Response Schema</Label>
            <JsonEditor value={schemaResponse} onChange={setSchemaResponse} height="300px" />
          </div>
        </TabsContent>

        {showRequestBody && (
          <TabsContent value="body" className="space-y-4 mt-4">
            <RequestBodyEditor value={requestBody} onChange={setRequestBody} method={nodeMethod} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

