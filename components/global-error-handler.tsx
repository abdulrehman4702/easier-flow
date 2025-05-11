"use client"

import type React from "react"

import { useEffect } from "react"
import { handleResizeObserverError } from "@/lib/resize-observer-utils"

interface GlobalErrorHandlerProps {
  children: React.ReactNode
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResizeObserverError()
    }
  }, [])

  return <>{children}</>
}

