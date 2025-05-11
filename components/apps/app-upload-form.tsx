"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { parseSwaggerYaml } from "@/lib/workflow/swagger-parser"

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

interface AppUploadFormProps {
  onUpload: (app: App) => void
  onCancel: () => void
  isUploading: boolean
  setIsUploading: (isUploading: boolean) => void
}

export function AppUploadForm({ onUpload, onCancel, isUploading, setIsUploading }: AppUploadFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [yamlFile, setYamlFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [endpointCount, setEndpointCount] = useState(0)

  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleYamlFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setYamlFile(file)
      setError(null)

      try {
        const fileContent = await file.text()
        const endpoints = parseSwaggerYaml(fileContent)
        setEndpointCount(endpoints.length)

        // If no name is set yet, use the file name without extension
        if (!name) {
          const fileName = file.name.replace(/\.[^/.]+$/, "")
          setName(fileName.replace(/-/g, " ").replace(/_/g, " "))
        }
      } catch (error) {
        console.error("Error parsing YAML:", error)
        setError("Failed to parse YAML file. Please ensure it's a valid Swagger/OpenAPI specification.")
        setEndpointCount(0)
      }
    }
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!yamlFile) {
      setError("Please upload a YAML file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would upload the files to a server here
      // For now, we'll just simulate a successful upload

      const newApp: App = {
        id: `app-${Date.now()}`,
        name,
        description,
        logo: logoPreview || "/placeholder.svg?height=80&width=80",
        yamlFile: yamlFile.name,
        endpoints: endpointCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onUpload(newApp)
    } catch (error) {
      console.error("Error uploading app:", error)
      setError("Failed to upload app. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Add New API App</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a Swagger/OpenAPI YAML file to create a new API app. This will allow you to use the API endpoints in
          your workflows.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
        <div
          className="relative h-24 w-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
          onClick={() => logoInputRef.current?.click()}
        >
          {logoPreview ? (
            <Image
              src={logoPreview || "/placeholder.svg"}
              alt="App logo preview"
              fill
              className="object-cover rounded-md"
            />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add Logo</span>
            </>
          )}
          <Input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">App Name</Label>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., GitHub API"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-description">Description</Label>
            <Textarea
              id="app-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the API"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yaml-file">Swagger/OpenAPI YAML File</Label>
        <div className="flex space-x-2">
          <Input
            id="yaml-file"
            type="file"
            accept=".yaml,.yml"
            onChange={handleYamlFileChange}
            className="flex-1"
            required
          />
        </div>
        {endpointCount > 0 && (
          <p className="text-sm text-muted-foreground">{endpointCount} endpoints detected in the YAML file.</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!yamlFile || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload App
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

