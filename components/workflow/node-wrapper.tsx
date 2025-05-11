import type React from "react"
import { type NodeProps, Handle, Position } from "reactflow"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NodeWrapperProps extends NodeProps {
  children: React.ReactNode
  onDelete: (nodeId: string) => void
}

export function NodeWrapper({ id, data, children, onDelete }: NodeWrapperProps) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      {children}
      <Handle type="source" position={Position.Bottom} />
      <Button variant="ghost" size="icon" className="absolute top-0 right-0 -mt-2 -mr-2" onClick={() => onDelete(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

