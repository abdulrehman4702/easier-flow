"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
}

export function JsonEditor({ value, onChange, height = "200px" }: JsonEditorProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    setInternalValue(value)
    validateJson(value)
  }, [value])

  const validateJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString)
      setIsValid(true)
      setErrorMessage("")
      return true
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON")
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    validateJson(newValue)
    setShowValidation(false)
  }

  const handleBlur = () => {
    setShowValidation(true)
    if (isValid) {
      onChange(internalValue)
    }
  }

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(internalValue), null, 2)
      setInternalValue(formatted)
      onChange(formatted)
      setIsValid(true)
      setErrorMessage("")
      setShowValidation(true)
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error instanceof Error ? error.message : "Invalid JSON")
      setShowValidation(true)
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="font-mono text-sm resize-none"
          style={{ height }}
        />
      </div>
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" size="sm" onClick={handleFormat}>
          Format JSON
        </Button>
        {showValidation && (
          <div className="text-sm">
            {isValid ? (
              <span className="text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" /> Valid JSON
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Invalid JSON
              </span>
            )}
          </div>
        )}
      </div>
      {showValidation && !isValid && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

