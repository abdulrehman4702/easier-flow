"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronDown, ChevronRight, ExternalLink, Info, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WorkflowDiagram } from "@/components/workflow/workflow-diagram"

interface OverviewPanelProps {
  onClose: () => void
}

export function OverviewPanel({ onClose }: OverviewPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "getting-started": true,
    "node-types": false,
    transformers: false,
    filters: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-4 border-primary/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Welcome to Easier Flow</CardTitle>
          <CardDescription>A powerful no-code platform for creating automated workflows</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nodes">Node Types</TabsTrigger>
            <TabsTrigger value="tutorials">Quick Start</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 py-4">
            <div className="prose max-w-none">
              <section>
                <div className="flex items-center cursor-pointer mb-2" onClick={() => toggleSection("getting-started")}>
                  {expandedSections["getting-started"] ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-primary" />
                  )}
                  <h3 className="text-xl font-semibold m-0">Getting Started</h3>
                </div>

                {expandedSections["getting-started"] && (
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <p>
                        Easier Flow is a no-code automation platform that allows you to create powerful workflows by
                        connecting different services, transforming data, and automating processes - all without writing
                        code.
                      </p>

                      <h4 className="font-semibold text-lg mt-4">Core Concepts</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>
                          <span className="font-medium">Nodes:</span> Building blocks of your workflow that perform
                          specific actions
                        </li>
                        <li>
                          <span className="font-medium">Connections:</span> Define how data flows between nodes
                        </li>
                        <li>
                          <span className="font-medium">Triggers:</span> Events that start your workflow
                        </li>
                        <li>
                          <span className="font-medium">Transformers:</span> Modify data between nodes
                        </li>
                        <li>
                          <span className="font-medium">Filters:</span> Conditionally control the flow of data
                        </li>
                      </ul>

                      <h4 className="font-semibold text-lg mt-4">Basic Workflow</h4>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Start with a trigger node that begins your workflow</li>
                        <li>Add action nodes like API requests or data mappers</li>
                        <li>Connect nodes by dragging from a source handle to a target handle</li>
                        <li>Configure each node by clicking on it and using the configuration panel</li>
                        <li>Execute your workflow using the "Execute" button</li>
                      </ol>
                    </div>
                  </ScrollArea>
                )}
              </section>

              <section className="mt-6">
                <h3 className="text-xl font-semibold mb-4">How Workflows Function</h3>
                <WorkflowDiagram />
              </section>

              <section className="mt-6">
                <div className="flex items-center cursor-pointer mb-2" onClick={() => toggleSection("node-types")}>
                  {expandedSections["node-types"] ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-primary" />
                  )}
                  <h3 className="text-xl font-semibold m-0">Node Types</h3>
                </div>

                {expandedSections["node-types"] && (
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-3 bg-background">
                          <h4 className="font-semibold text-blue-500">Trigger Node</h4>
                          <p className="text-sm">Starts your workflow based on a webhook, schedule, or event.</p>
                        </div>

                        <div className="border rounded-md p-3 bg-background">
                          <h4 className="font-semibold text-green-500">API Node</h4>
                          <p className="text-sm">Makes HTTP requests to external APIs and services.</p>
                        </div>

                        <div className="border rounded-md p-3 bg-background">
                          <h4 className="font-semibold text-orange-500">Data Mapper</h4>
                          <p className="text-sm">Maps data fields from one format to another.</p>
                        </div>

                        <div className="border rounded-md p-3 bg-background">
                          <h4 className="font-semibold text-purple-500">Transformer</h4>
                          <p className="text-sm">Transforms data between nodes, such as format changes.</p>
                        </div>

                        <div className="border rounded-md p-3 bg-background">
                          <h4 className="font-semibold text-yellow-500">Filter</h4>
                          <p className="text-sm">Controls data flow based on conditions you define.</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-4">
                        Each node type has different configuration options. Click on a node to view and edit its
                        settings.
                      </p>
                    </div>
                  </ScrollArea>
                )}
              </section>

              <section className="mt-6">
                <div className="flex items-center cursor-pointer mb-2" onClick={() => toggleSection("transformers")}>
                  {expandedSections["transformers"] ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-primary" />
                  )}
                  <h3 className="text-xl font-semibold m-0">Working with Transformers</h3>
                </div>

                {expandedSections["transformers"] && (
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <p>
                        Transformers are powerful nodes that let you map and transform data between a source and target.
                      </p>

                      <h4 className="font-semibold text-lg">How to Use Transformers</h4>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Add a Transformer node to your workflow</li>
                        <li>Click the Settings icon on the node</li>
                        <li>Select a source node (usually an API GET request) that provides data</li>
                        <li>Select a target node (usually an API POST/PUT request) that will receive data</li>
                        <li>Create field mappings between source and target fields</li>
                        <li>Optionally, add transformations to modify the data</li>
                        <li>Save your configuration</li>
                      </ol>

                      <p className="text-sm text-muted-foreground mt-2">
                        Transformers automatically extract fields from your source and target nodes, making it easy to
                        create mappings.
                      </p>
                    </div>
                  </ScrollArea>
                )}
              </section>

              <section className="mt-6">
                <div className="flex items-center cursor-pointer mb-2" onClick={() => toggleSection("filters")}>
                  {expandedSections["filters"] ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-primary" />
                  )}
                  <h3 className="text-xl font-semibold m-0">Working with Filters</h3>
                </div>

                {expandedSections["filters"] && (
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <p>
                        Filters allow you to control the flow of data based on conditions, only processing data that
                        matches your criteria.
                      </p>

                      <h4 className="font-semibold text-lg">How to Use Filters</h4>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Add a Filter node to your workflow</li>
                        <li>Click the Settings icon on the node</li>
                        <li>Add filter conditions by selecting a field, operator, and value</li>
                        <li>Add multiple conditions if needed</li>
                        <li>Save your configuration</li>
                      </ol>

                      <p className="mt-2">Available filter operators:</p>
                      <ul className="space-y-1 list-disc pl-5">
                        <li>
                          <span className="font-medium">Equals:</span> Field must match the specified value
                        </li>
                        <li>
                          <span className="font-medium">Not equals:</span> Field must not match the specified value
                        </li>
                        <li>
                          <span className="font-medium">Exists:</span> Field must exist in the data
                        </li>
                        <li>
                          <span className="font-medium">Not exists:</span> Field must not exist in the data
                        </li>
                      </ul>
                    </div>
                  </ScrollArea>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="nodes" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-500">Trigger Node</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Starts your workflow using a webhook, schedule, or event.</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">When to use:</h4>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                      <li>Starting a workflow based on an API webhook</li>
                      <li>Running workflows on a schedule</li>
                      <li>Responding to system events</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-500">API Node</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Makes HTTP requests to external APIs and services.</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Features:</h4>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                      <li>Support for all HTTP methods</li>
                      <li>Authentication options</li>
                      <li>Custom headers and request bodies</li>
                      <li>Response schema editing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-500">Data Mapper</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Maps data fields from one structure to another.</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Use cases:</h4>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                      <li>Transforming API responses</li>
                      <li>Restructuring data</li>
                      <li>Mapping fields between different systems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-500">Transformer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Transforms data between a source and target node.</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Capabilities:</h4>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                      <li>Visual field mapping</li>
                      <li>Data transformations</li>
                      <li>Source to target field connections</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-500">Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Controls data flow based on conditions.</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Operators:</h4>
                    <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                      <li>Equals / Not equals</li>
                      <li>Exists / Not exists</li>
                      <li>Multiple condition support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Creating Your First Workflow</h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Start with a Trigger</h4>
                    <p className="text-sm text-muted-foreground">
                      Drag a Webhook Trigger from the sidebar onto the canvas. This will be the starting point of your
                      workflow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Add an API Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Drag an API Node from the sidebar. Configure it by clicking on the node and setting the endpoint
                      URL and method.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Connect the Nodes</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a connection by clicking and dragging from the Trigger's output handle to the API Node's
                      input handle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Transform the Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Add a Transformer Node and connect it to the API Node. Configure it to map data from the API
                      response.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Execute Your Workflow</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the Execute button in the header to run your workflow and see the results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>View Full Documentation</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">API to Database Workflow</CardTitle>
                  <CardDescription>Fetch data from an API and store it in a database</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This workflow demonstrates how to:</p>
                  <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                    <li>Use an API node to fetch data</li>
                    <li>Transform the response</li>
                    <li>Map fields to database columns</li>
                    <li>Store the data using another API call</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Load Example
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Data Filtering Workflow</CardTitle>
                  <CardDescription>Process data conditionally based on filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This workflow demonstrates how to:</p>
                  <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                    <li>Fetch data from multiple sources</li>
                    <li>Apply filters based on field values</li>
                    <li>Process data conditionally</li>
                    <li>Send notifications based on results</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Load Example
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Multi-Step Transformation</CardTitle>
                  <CardDescription>Complex data transformation across systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This workflow demonstrates how to:</p>
                  <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                    <li>Chain multiple transformers together</li>
                    <li>Use data mappers for complex mappings</li>
                    <li>Apply conditional logic</li>
                    <li>Handle errors gracefully</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Load Example
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Schedule-Based Workflow</CardTitle>
                  <CardDescription>Automated workflow that runs on a schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">This workflow demonstrates how to:</p>
                  <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                    <li>Set up a schedule-based trigger</li>
                    <li>Fetch and process data automatically</li>
                    <li>Apply transformations and filters</li>
                    <li>Send notifications with results</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Load Example
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>Need help? Use the AI Assistant available in the bottom right corner.</p>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onClose}>
              Close Overview
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Building
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

