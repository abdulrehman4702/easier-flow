"use client"

import { X, CheckCircle, XCircle, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ExecutionResult {
  id: string
  type: string
  status: "success" | "error"
  data: any
}

interface ExecutionPanelProps {
  results: ExecutionResult[]
  onClose: () => void
}

export function ExecutionPanel({ results, onClose }: ExecutionPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  return (
    <div className="border-t bg-background">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <h3 className="font-medium text-sm">Execution Results</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {expanded && (
        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            {results.map((result) => (
              <Button
                key={result.id}
                variant={selectedResult === result.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedResult(result.id)}
                className="flex items-center"
              >
                {result.status === "success" ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                Node {result.id}
              </Button>
            ))}
          </div>
          {selectedResult && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">{results.find((r) => r.id === selectedResult)?.type}</h4>
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(results.find((r) => r.id === selectedResult)?.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

