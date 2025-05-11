"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Search, ExternalLink, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useParams } from "next/navigation"

interface Endpoint {
  id: string
  method: string
  path: string
  summary: string
  description?: string
  tags: string[]
  parameters?: any[]
  requestBody?: any
  responses?: Record<string, any>
}

interface App {
  id: string
  name: string
  description: string
  logo: string
  yamlFile: string
  endpoints: Endpoint[]
  createdAt: string
  updatedAt: string
}

export default function AppEndpointsPage() {
  const params = useParams()
  const appId = params.id as string

  const [app, setApp] = useState<App | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEndpoints, setFilteredEndpoints] = useState<Endpoint[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [copiedEndpointId, setCopiedEndpointId] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading app data from API
    const mockApp: App = {
      id: appId,
      name: "GitHub API",
      description: "GitHub REST API v3",
      logo: "/placeholder.svg?height=80&width=80",
      yamlFile: "github-api.yaml",
      endpoints: [
        {
          id: "endpoint-1",
          method: "GET",
          path: "/repos/{owner}/{repo}",
          summary: "Get a repository",
          description: "Gets the details of a repository.",
          tags: ["repositories"],
          parameters: [
            { name: "owner", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Repository details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      full_name: { type: "string" },
                      description: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "endpoint-2",
          method: "POST",
          path: "/repos/{owner}/{repo}/issues",
          summary: "Create an issue",
          description: "Creates a new issue in a repository.",
          tags: ["issues"],
          parameters: [
            { name: "owner", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    body: { type: "string" },
                    labels: { type: "array", items: { type: "string" } },
                  },
                  required: ["title"],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Issue created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      number: { type: "integer" },
                      title: { type: "string" },
                      body: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "endpoint-3",
          method: "GET",
          path: "/repos/{owner}/{repo}/issues",
          summary: "List issues",
          description: "Lists issues in a repository.",
          tags: ["issues"],
          parameters: [
            { name: "owner", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
            { name: "state", in: "query", schema: { type: "string", enum: ["open", "closed", "all"] } },
            { name: "sort", in: "query", schema: { type: "string", enum: ["created", "updated", "comments"] } },
          ],
          responses: {
            "200": {
              description: "List of issues",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        number: { type: "integer" },
                        title: { type: "string" },
                        state: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "endpoint-4",
          method: "PUT",
          path: "/repos/{owner}/{repo}/issues/{issue_number}",
          summary: "Update an issue",
          description: "Updates an existing issue.",
          tags: ["issues"],
          parameters: [
            { name: "owner", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
            { name: "issue_number", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    body: { type: "string" },
                    state: { type: "string", enum: ["open", "closed"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Issue updated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      number: { type: "integer" },
                      title: { type: "string" },
                      state: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "endpoint-5",
          method: "DELETE",
          path: "/repos/{owner}/{repo}/issues/comments/{comment_id}",
          summary: "Delete an issue comment",
          description: "Deletes an issue comment.",
          tags: ["issues", "comments"],
          parameters: [
            { name: "owner", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
            { name: "comment_id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            "204": {
              description: "Comment deleted",
            },
          },
        },
      ],
      createdAt: "2023-10-15T10:30:00Z",
      updatedAt: "2023-10-15T10:30:00Z",
    }

    setApp(mockApp)
    setFilteredEndpoints(mockApp.endpoints)
  }, [appId])

  useEffect(() => {
    if (!app) return

    let filtered = app.endpoints

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(term) ||
          endpoint.summary.toLowerCase().includes(term) ||
          endpoint.description?.toLowerCase().includes(term) ||
          endpoint.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "get") {
        filtered = filtered.filter((endpoint) => endpoint.method === "GET")
      } else if (activeTab === "post") {
        filtered = filtered.filter((endpoint) => endpoint.method === "POST")
      } else if (activeTab === "put") {
        filtered = filtered.filter((endpoint) => endpoint.method === "PUT")
      } else if (activeTab === "delete") {
        filtered = filtered.filter((endpoint) => endpoint.method === "DELETE")
      }
    }

    setFilteredEndpoints(filtered)
  }, [app, searchTerm, activeTab])

  const handleCopyEndpoint = (endpointId: string) => {
    setCopiedEndpointId(endpointId)
    setTimeout(() => setCopiedEndpointId(null), 2000)
  }

  if (!app) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/apps">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Link href="/" className="ml-4 flex items-center space-x-2">
              <span className="font-bold text-xl">✨ Easier Flow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image src={app.logo || "/placeholder.svg"} alt={`${app.name} logo`} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <p className="text-muted-foreground">{app.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link href={`/workflow/create?app=${app.id}`}>Use in Workflow</Link>
            </Button>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="get">GET</TabsTrigger>
              <TabsTrigger value="post">POST</TabsTrigger>
              <TabsTrigger value="put">PUT</TabsTrigger>
              <TabsTrigger value="delete">DELETE</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          {filteredEndpoints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No endpoints found matching your search criteria.</p>
            </div>
          ) : (
            filteredEndpoints.map((endpoint) => (
              <Card key={endpoint.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "default"
                            : endpoint.method === "POST"
                              ? "outline"
                              : endpoint.method === "PUT"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <CardTitle className="text-base font-mono">{endpoint.path}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyEndpoint(endpoint.id)}>
                        {copiedEndpointId === endpoint.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/workflow/create?app=${app.id}&endpoint=${endpoint.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{endpoint.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    {endpoint.tags && endpoint.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {endpoint.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Parameters:</p>
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          {endpoint.parameters.map((param, index) => (
                            <div key={index} className="flex items-center">
                              <span className="font-medium mr-1">{param.name}</span>
                              <span className="text-muted-foreground">({param.in})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Easier Flow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

