import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Save, Play, Upload, Download, Plus, ArrowLeft } from "lucide-react"

interface WorkflowHeaderProps {
  workflowName: string
  setWorkflowName: (name: string) => void
  onExecute: () => void
  isExecuting: boolean
  onGenerateWorkflow: () => void
  onImportYaml: () => void
}

export function WorkflowHeader({
  workflowName,
  setWorkflowName,
  onExecute,
  isExecuting,
  onGenerateWorkflow,
  onImportYaml,
}: WorkflowHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="ml-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="h-9 w-[200px] font-medium"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onGenerateWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Workflow
          </Button>
          <Button variant="outline" size="sm" onClick={onImportYaml}>
            <Upload className="h-4 w-4 mr-2" />
            Import YAML
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onExecute} disabled={isExecuting}>
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? "Executing..." : "Execute"}
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

