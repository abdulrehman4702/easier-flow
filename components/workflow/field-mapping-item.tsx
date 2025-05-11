"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FieldMapping {
  id: string
  sourceField: string
  targetField: string
  transformation?: string
}

interface FieldMappingItemProps {
  mapping: FieldMapping
  sourceFields: string[]
  targetFields: string[]
  onUpdate: (field: keyof FieldMapping, value: string) => void
  onRemove: () => void
}

export function FieldMappingItem({ mapping, sourceFields, targetFields, onUpdate, onRemove }: FieldMappingItemProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="grid grid-cols-9 gap-2 items-center">
          <div className="col-span-3">
            <Select value={mapping.sourceField} onValueChange={(value) => onUpdate("sourceField", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source field" />
              </SelectTrigger>
              <SelectContent>
                {sourceFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="col-span-3">
            <Select value={mapping.targetField} onValueChange={(value) => onUpdate("targetField", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select target field" />
              </SelectTrigger>
              <SelectContent>
                {targetFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <Input
              placeholder="Transform"
              value={mapping.transformation || ""}
              onChange={(e) => onUpdate("transformation", e.target.value)}
              title="Optional transformation (e.g., toUpperCase)"
            />
          </div>

          <div>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

