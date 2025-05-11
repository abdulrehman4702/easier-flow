"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export interface FilterCondition {
  id: string
  field: string
  operator: "equals" | "notEquals" | "exists" | "notExists"
  value?: string
}

interface FieldFilterProps {
  fields: string[]
  conditions: FilterCondition[]
  onConditionsChange: (conditions: FilterCondition[]) => void
}

export function FieldFilter({ fields, conditions, onConditionsChange }: FieldFilterProps) {
  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: `condition-${Date.now()}`,
      field: fields.length > 0 ? fields[0] : "",
      operator: "equals",
      value: "",
    }
    onConditionsChange([...conditions, newCondition])
  }

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    onConditionsChange(conditions.map((condition) => (condition.id === id ? { ...condition, ...updates } : condition)))
  }

  const removeCondition = (id: string) => {
    onConditionsChange(conditions.filter((condition) => condition.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filter Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No filter conditions. Add one to start filtering.
          </div>
        ) : (
          conditions.map((condition) => (
            <div key={condition.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Select
                  value={condition.field}
                  onValueChange={(value) => updateCondition(condition.id, { field: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    updateCondition(condition.id, {
                      operator: value as FilterCondition["operator"],
                      // Clear value if switching to exists/notExists
                      value: value === "exists" || value === "notExists" ? undefined : condition.value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="notEquals">Not equals</SelectItem>
                    <SelectItem value="exists">Exists</SelectItem>
                    <SelectItem value="notExists">Not exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(condition.operator === "equals" || condition.operator === "notEquals") && (
                <div className="col-span-4">
                  <Input
                    value={condition.value || ""}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    placeholder="Value"
                  />
                </div>
              )}

              {(condition.operator === "exists" || condition.operator === "notExists") && (
                <div className="col-span-4 flex items-center">
                  <Label className="text-muted-foreground text-sm">
                    {condition.operator === "exists" ? "Field must exist" : "Field must not exist"}
                  </Label>
                </div>
              )}

              <div className="col-span-1">
                <Button variant="ghost" size="icon" onClick={() => removeCondition(condition.id)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </CardFooter>
    </Card>
  )
}

