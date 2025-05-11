"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { OverviewPanel } from "@/components/workflow/overview-panel"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface LayoutWithOverlayProps {
  children: React.ReactNode
}

export function LayoutWithOverlay({ children }: LayoutWithOverlayProps) {
  const [showOverview, setShowOverview] = useState(false)
  const [hasViewedOverview, setHasViewedOverview] = useState(false)

  // Check if user has viewed the overview before
  useEffect(() => {
    const hasViewed = localStorage.getItem("hasViewedOverview") === "true"
    setHasViewedOverview(hasViewed)

    // If user hasn't viewed the overview, show it automatically
    if (!hasViewed) {
      setShowOverview(true)
    }
  }, [])

  // Mark overview as viewed when closed
  const handleCloseOverview = () => {
    setShowOverview(false)
    if (!hasViewedOverview) {
      localStorage.setItem("hasViewedOverview", "true")
      setHasViewedOverview(true)
    }
  }

  return (
    <div className="relative">
      {children}

      {/* Help button to re-open overview */}
      {!showOverview && (
        <Button
          variant="secondary"
          size="sm"
          className="fixed bottom-4 left-4 z-50 shadow-md"
          onClick={() => setShowOverview(true)}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Overview
        </Button>
      )}

      {/* Overview panel */}
      {showOverview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <OverviewPanel onClose={handleCloseOverview} />
        </div>
      )}
    </div>
  )
}

