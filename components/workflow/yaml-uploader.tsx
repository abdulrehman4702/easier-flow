"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileUp, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { parseSwaggerYaml } from "@/lib/workflow/swagger-parser"

interface YamlUploaderProps {
  onEndpointsExtracted: (endpoints: any[]) => void
}

export function YamlUploader({ onEndpointsExtracted }: YamlUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const fileContent = await file.text()

      // Wrap the parsing in a try-catch block
      let endpoints
      try {
        endpoints = parseSwaggerYaml(fileContent)
      } catch (error) {
        console.error("Error parsing YAML:", error)
        setErrorMessage(error instanceof Error ? error.message : "Failed to parse YAML file")
        setUploadStatus("error")
        setIsUploading(false)
        return
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use a small delay before calling onEndpointsExtracted to prevent resize issues
      setTimeout(() => {
        onEndpointsExtracted(endpoints)
        setUploadStatus("success")
      }, 50)
    } catch (error) {
      console.error("Error processing YAML:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to process YAML file")
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="yaml-file">Upload Swagger YAML</Label>
        <div className="flex space-x-2">
          <Input id="yaml-file" type="file" accept=".yaml,.yml" onChange={handleFileChange} className="flex-1" />
          <Button onClick={handleUpload} disabled={!file || isUploading} className="whitespace-nowrap">
            {isUploading ? (
              <>
                <FileUp className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>

      {uploadStatus === "success" && (
        <Alert
          variant="default"
          className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
        >
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Swagger endpoints successfully extracted from {file?.name}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

