import yaml from "js-yaml"

interface SwaggerEndpoint {
  path: string
  method: string
  operationId: string
  summary?: string
  description?: string
  parameters?: any[]
  requestBody?: any
  responses?: Record<string, any>
}

export function parseSwaggerYaml(yamlContent: string): SwaggerEndpoint[] {
  try {
    const parsedYaml = yaml.load(yamlContent) as any

    if (!parsedYaml.paths) {
      throw new Error("Invalid Swagger/OpenAPI format: 'paths' property not found")
    }

    const endpoints: SwaggerEndpoint[] = []

    // Extract endpoints from paths
    Object.entries(parsedYaml.paths).forEach(([path, pathItem]: [string, any]) => {
      // For each HTTP method in the path
      const methods = ["get", "post", "put", "delete", "patch", "options", "head"]

      methods.forEach((method) => {
        if (pathItem[method]) {
          const operation = pathItem[method]

          endpoints.push({
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId || `${method}${path.replace(/\//g, "_")}`,
            summary: operation.summary,
            description: operation.description,
            parameters: operation.parameters,
            requestBody: operation.requestBody,
            responses: operation.responses,
          })
        }
      })
    })

    return endpoints
  } catch (error) {
    console.error("Error parsing Swagger YAML:", error)
    throw error
  }
}

