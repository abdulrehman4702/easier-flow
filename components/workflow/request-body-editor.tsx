"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { JsonEditor } from "@/components/workflow/json-editor"

interface RequestBodyEditorProps {
  value: any
  onChange: (value: any) => void
  method: string
}

export function RequestBodyEditor({ value, onChange, method }: RequestBodyEditorProps) {
  const [bodyType, setBodyType] = useState<"json" | "form-data" | "x-www-form-urlencoded">("json")
  const [jsonBody, setJsonBody] = useState<string>(
    typeof value === "object" && value !== null ? JSON.stringify(value, null, 2) : JSON.stringify({}, null, 2),
  )
  const [formData, setFormData] = useState<Array<{ key: string; value: string }>>(
    Array.isArray(value) ? value : [{ key: "", value: "" }],
  )

  useEffect(() => {
    if (typeof value === "object" && value !== null) {
      setJsonBody(JSON.stringify(value, null, 2))
    }
  }, [value])

  const handleJsonChange = (newJsonBody: string) => {
    setJsonBody(newJsonBody)
    try {
      const parsed = JSON.parse(newJsonBody)
      onChange(parsed)
    } catch (error) {
      // Don't update parent if JSON is invalid
    }
  }

  const handleFormDataChange = (index: number, field: "key" | "value", newValue: string) => {
    const newFormData = [...formData]
    newFormData[index][field] = newValue
    setFormData(newFormData)

    // Convert form data to appropriate format based on type
    if (bodyType === "form-data") {
      // For multipart/form-data, we keep the array format
      onChange(newFormData.filter((item) => item.key.trim() !== ""))
    } else {
      // For x-www-form-urlencoded, convert to object
      const formObject = newFormData.reduce(
        (obj, item) => {
          if (item.key.trim() !== "") {
            obj[item.key] = item.value
          }
          return obj
        },
        {} as Record<string, string>,
      )
      onChange(formObject)
    }
  }

  const addFormField = () => {
    setFormData([...formData, { key: "", value: "" }])
  }

  const removeFormField = (index: number) => {
    const newFormData = [...formData]
    newFormData.splice(index, 1)
    setFormData(newFormData)
  }

  return (
    <div className="space-y-4">
      <Label>Request Body</Label>

      <Tabs defaultValue="json" onValueChange={(value) => setBodyType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="form-data">Form Data</TabsTrigger>
          <TabsTrigger value="x-www-form-urlencoded">URL Encoded</TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="space-y-4 mt-4">
          <JsonEditor value={jsonBody} onChange={handleJsonChange} height="250px" />
        </TabsContent>

        <TabsContent value="form-data" className="space-y-4 mt-4">
          <div className="space-y-2">
            {formData.map((field, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Key"
                  value={field.key}
                  onChange={(e) => handleFormDataChange(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFormDataChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFormField(index)}
                  disabled={formData.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFormField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="x-www-form-urlencoded" className="space-y-4 mt-4">
          <div className="space-y-2">
            {formData.map((field, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Key"
                  value={field.key}
                  onChange={(e) => handleFormDataChange(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFormDataChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFormField(index)}
                  disabled={formData.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFormField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

