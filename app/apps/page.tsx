"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Plus, Settings, LogOut, ArrowLeft } from "lucide-react"
import { AppUploadForm } from "@/components/apps/app-upload-form"
import { AppCard } from "@/components/apps/app-card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface App {
  id: string
  name: string
  description: string
  logo: string
  yamlFile: string
  endpoints: number
  createdAt: string
  updatedAt: string
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    // Simulate loading apps from API
    const mockApps: App[] = [
      {
        id: "app-1",
        name: "GitHub API",
        description: "GitHub REST API v3",
        logo: "/placeholder.svg?height=80&width=80",
        yamlFile: "github-api.yaml",
        endpoints: 24,
        createdAt: "2023-10-15T10:30:00Z",
        updatedAt: "2023-10-15T10:30:00Z",
      },
      {
        id: "app-2",
        name: "Stripe API",
        description: "Stripe Payment Processing API",
        logo: "/placeholder.svg?height=80&width=80",
        yamlFile: "stripe-api.yaml",
        endpoints: 18,
        createdAt: "2023-10-10T14:20:00Z",
        updatedAt: "2023-10-12T09:15:00Z",
      },
      {
        id: "app-3",
        name: "Salesforce API",
        description: "Salesforce REST API",
        logo: "/placeholder.svg?height=80&width=80",
        yamlFile: "salesforce-api.yaml",
        endpoints: 32,
        createdAt: "2023-09-28T16:45:00Z",
        updatedAt: "2023-10-05T11:30:00Z",
      },
    ]

    setApps(mockApps)
  }, [])

  const handleAppUpload = (newApp: App) => {
    setApps([newApp, ...apps])
    setShowUploadForm(false)
  }

  const handleDeleteApp = (appId: string) => {
    setApps(apps.filter((app) => app.id !== appId))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Link href="/" className="ml-4 flex items-center space-x-2">
              <span className="font-bold text-xl">✨ Easier Flow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/apps">Apps</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <ModeToggle />
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">API Apps</h1>
          <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New App
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <AppUploadForm
                onUpload={handleAppUpload}
                onCancel={() => setShowUploadForm(false)}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} onDelete={() => handleDeleteApp(app.id)} />
          ))}

          <Card className="border-dashed flex items-center justify-center h-[200px]">
            <Button variant="ghost" onClick={() => setShowUploadForm(true)} className="flex flex-col items-center">
              <Plus className="h-8 w-8 mb-2" />
              <span>Add New App</span>
            </Button>
          </Card>
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

