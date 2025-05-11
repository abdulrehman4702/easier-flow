import type { Node, Edge } from "reactflow"
import { Button } from "@/components/ui/button"

interface SmartNodeRecommendationsProps {
  nodes: Node[]
  edges: Edge[]
  onAddNode: (nodeType: string, position: { x: number; y: number }) => void
}

export function SmartNodeRecommendations({ nodes, edges, onAddNode }: SmartNodeRecommendationsProps) {
  const lastNode = nodes[nodes.length - 1]
  let recommendation = null

  if (lastNode) {
    switch (lastNode.type) {
      case "triggerNode":
        recommendation = { type: "apiNode", label: "API Request" }
        break
      case "apiNode":
        recommendation = { type: "transformerNode", label: "Transform Data" }
        break
      case "transformerNode":
        recommendation = { type: "dataMapperNode", label: "Map Data" }
        break
      // Add more recommendations based on node types
    }
  }

  if (!recommendation) return null

  const handleAddRecommendedNode = () => {
    const position = {
      x: lastNode.position.x,
      y: lastNode.position.y + 100,
    }
    onAddNode(recommendation!.type, position)
  }

  return (
    <div className="absolute bottom-4 left-4 bg-background border rounded-md p-2 shadow-sm">
      <p className="text-sm mb-2">Recommended next step:</p>
      <Button onClick={handleAddRecommendedNode} size="sm">
        Add {recommendation.label}
      </Button>
    </div>
  )
}

