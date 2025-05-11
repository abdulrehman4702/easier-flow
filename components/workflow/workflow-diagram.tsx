"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WorkflowDiagram() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Workflow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            {/* This is a mermaid diagram that will be rendered */}
            <div className="mermaid">
              {`
              graph TD;
                T["Trigger Node"] --> A["API Node: GET"]
                A --> F["Filter Node"]
                F -->|"Matches Conditions"| D["Data Mapper"]
                D --> TR["Transformer"]
                TR --> AP["API Node: POST"]
                
                style T fill:#e0f2fe,stroke:#0369a1
                style A fill:#dcfce7,stroke:#16a34a
                style F fill:#fef9c3,stroke:#ca8a04
                style D fill:#ffedd5,stroke:#ea580c
                style TR fill:#f3e8ff,stroke:#7e22ce
                style AP fill:#dcfce7,stroke:#16a34a
              `}
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              <p>
                A typical workflow begins with a Trigger, which initiates the process when an event occurs. Data then
                flows through connected nodes, with each node performing a specific operation:
              </p>

              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium text-blue-600">Trigger Node</span>: Starts the workflow
                </li>
                <li>
                  <span className="font-medium text-green-600">API Node (GET)</span>: Fetches data from an external API
                </li>
                <li>
                  <span className="font-medium text-yellow-600">Filter Node</span>: Applies conditions to control data
                  flow
                </li>
                <li>
                  <span className="font-medium text-orange-600">Data Mapper</span>: Maps fields between data structures
                </li>
                <li>
                  <span className="font-medium text-purple-600">Transformer</span>: Transforms the data format
                </li>
                <li>
                  <span className="font-medium text-green-600">API Node (POST)</span>: Sends the processed data
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

