// Calculate the appropriate width for a node based on content
export function calculateNodeWidth(text: string, minWidth = 180, charWidth = 8): number {
  if (!text) return minWidth

  // Estimate width based on text length
  const estimatedWidth = text.length * charWidth

  // Return the larger of the minimum width or estimated width
  return Math.max(minWidth, estimatedWidth)
}

// Generate a unique ID for a node
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

// Format endpoint path for display
export function formatEndpointPath(path: string): string {
  // Replace path parameters with a more readable format
  return path.replace(/\{([^}]+)\}/g, ":$1")
}

