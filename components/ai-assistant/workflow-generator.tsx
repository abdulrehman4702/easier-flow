"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2 } from "lucide-react"

interface WorkflowGeneratorProps {
  onGenerate: (workflow: any) => void
  onCancel: () => void
}

export function WorkflowGenerator({ onGenerate, onCancel }: WorkflowGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [workflowName, setWorkflowName] = useState("My Generated Workflow")
  const [workflowType, setWorkflowType] = useState("api-integration")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a workflow based on the type
    let workflow

    if (workflowType === "api-integration") {
      workflow = {
        name: workflowName,
        nodes: [
          {
            id: "1",
            type: "triggerNode",
            data: { label: "Webhook Trigger" },
            position: { x: 250, y: 50 },
          },
          {
            id: "2",
            type: "apiNode",
            data: {
              label: "API Request",
              url: "https://api.example.com/data",
              method: "GET",
            },
            position: { x: 250, y: 150 },
          },
          {
            id: "3",
            type: "dataMapperNode",
            data: {
              label: "Data Mapper",
              mappings: [
                { key: "id", value: "$.data.id" },
                { key: "name", value: "$.data.name" },
                { key: "email", value: "$.data.email" },
              ],
            },
            position: { x: 250, y: 250 },
          },
          {
            id: "4",
            type: "transformerNode",
            data: {
              label: "Transformer",
              transformType: "string",
            },
            position: { x: 250, y: 350 },
          },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2", animated: true },
          { id: "e2-3", source: "2", target: "3", animated: true },
          { id: "e3-4", source: "3", target: "4", animated: true },
        ],
      }
    } else if (workflowType === "social-media") {
      workflow = {
        name: workflowName,
        nodes: [
          {
            id: "1",
            type: "triggerNode",
            data: { label: "Schedule Trigger" },
            position: { x: 250, y: 50 },
          },
          {
            id: "2",
            type: "apiNode",
            data: {
              label: "Content API",
              url: "https://api.example.com/content",
              method: "GET",
            },
            position: { x: 250, y: 150 },
          },
          {
            id: "3",
            type: "transformerNode",
            data: {
              label: "Format Content",
              transformType: "string",
            },
            position: { x: 250, y: 250 },
          },
          {
            id: "4",
            type: "apiNode",
            data: {
              label: "Twitter API",
              url: "https://api.twitter.com/2/tweets",
              method: "POST",
              authType: "OAuth",
            },
            position: { x: 250, y: 350 },
          },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2", animated: true },
          { id: "e2-3", source: "2", target: "3", animated: true },
          { id: "e3-4", source: "3", target: "4", animated: true },
        ],
      }
    } else if (workflowType === "data-processing") {
      workflow = {
        name: workflowName,
        nodes: [
          {
            id: "1",
            type: "triggerNode",
            data: { label: "File Upload Trigger" },
            position: { x: 250, y: 50 },
          },
          {
            id: "2",
            type: "transformerNode",
            data: {
              label: "Parse CSV",
              transformType: "csv",
            },
            position: { x: 250, y: 150 },
          },
          {
            id: "3",
            type: "dataMapperNode",
            data: {
              label: "Data Mapper",
              mappings: [
                { key: "id", value: "$.row.id" },
                { key: "name", value: "$.row.name" },
                { key: "email", value: "$.row.email" },
              ],
            },
            position: { x: 250, y: 250 },
          },
          {
            id: "4",
            type: "apiNode",
            data: {
              label: "Database API",
              url: "https://api.example.com/db/insert",
              method: "POST",
            },
            position: { x: 250, y: 350 },
          },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2", animated: true },
          { id: "e2-3", source: "2", target: "3", animated: true },
          { id: "e3-4", source: "3", target: "4", animated: true },
        ],
      }
    }

    setIsGenerating(false)
    onGenerate(workflow)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generate Workflow</CardTitle>
        <CardDescription>Describe what you want to build, and I'll generate a workflow for you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input id="workflow-name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-type">Workflow Type</Label>
            <Select value={workflowType} onValueChange={setWorkflowType}>
              <SelectTrigger id="workflow-type">
                <SelectValue placeholder="Select workflow type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api-integration">API Integration</SelectItem>
                <SelectItem value="social-media">Social Media Automation</SelectItem>
                <SelectItem value="data-processing">Data Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Describe Your Workflow</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., I want to fetch data from GitHub API and post it to Slack when new issues are created"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Workflow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

