import type { Node, Edge } from "reactflow"

interface ExecutionResult {
  nodeId: string
  status: "success" | "error"
  data: any
}

export async function executeWorkflow(nodes: Node[], edges: Edge[]): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = []
  const startNodes = nodes.filter((node) => !edges.some((edge) => edge.target === node.id))

  // Execute start nodes in parallel
  const startNodePromises = startNodes.map((node) => executeNode(node, nodes, edges))
  await Promise.all(startNodePromises)

  return results

  async function executeNode(node: Node, allNodes: Node[], allEdges: Edge[]): Promise<void> {
    let result: ExecutionResult

    try {
      switch (node.type) {
        case "apiNode":
          result = await executeApiNode(node.data)
          break
        case "transformerNode":
          result = await executeTransformerNode(node.data)
          break
        case "loopNode":
          result = await executeLoopNode(node.data, allNodes, allEdges)
          break
        // ... other node types
        default:
          throw new Error(`Unknown node type: ${node.type}`)
      }

      results.push({ nodeId: node.id, status: "success", data: result })
    } catch (error) {
      results.push({ nodeId: node.id, status: "error", data: error })
      return // Stop execution for this branch
    }

    // Find and execute child nodes
    const childEdges = allEdges.filter((edge) => edge.source === node.id)
    const childNodes = childEdges.map((edge) => allNodes.find((n) => n.id === edge.target)!)

    // Execute child nodes in parallel
    const childPromises = childNodes.map((childNode) => executeNode(childNode, allNodes, allEdges))
    await Promise.all(childPromises)
  }
}

async function executeApiNode(data: any): Promise<any> {
  // Implement API call logic here
  return { status: 200, data: { message: "API call successful" } }
}

async function executeTransformerNode(data: any): Promise<any> {
  // Implement data transformation logic here
  return { transformed: true, data: data.input }
}

async function executeLoopNode(data: any, allNodes: Node[], allEdges: Edge[]): Promise<any> {
  const results = []
  for (const item of data.items) {
    // Find and execute child nodes for each iteration
    const childEdges = allEdges.filter((edge) => edge.source === data.id)
    const childNodes = childEdges.map((edge) => allNodes.find((n) => n.id === edge.target)!)

    for (const childNode of childNodes) {
      const result = await executeNode(childNode, allNodes, allEdges)
      results.push(result)
    }
  }
  return results
}

