"use client"

import React from "react"

/**
 * Utility to handle ResizeObserver errors
 * This prevents the "ResizeObserver loop completed with undelivered notifications" error
 */
export function handleResizeObserverError() {
  // Store the original error handler
  const originalOnError = window.onerror

  // Override the error handler to filter out ResizeObserver errors
  window.onerror = function (message, source, lineno, colno, error) {
    // Check if the error is related to ResizeObserver
    if (message && typeof message === "string" && message.includes("ResizeObserver")) {
      // Prevent the error from propagating
      return true
    }

    // Call the original error handler for other errors
    if (originalOnError) {
      return originalOnError.apply(this, [message, source, lineno, colno, error])
    }

    return false
  }

  // Also handle unhandled promise rejections
  const originalOnUnhandledRejection = window.onunhandledrejection
  window.onunhandledrejection = function (event) {
    if (
      event.reason &&
      event.reason.message &&
      typeof event.reason.message === "string" &&
      event.reason.message.includes("ResizeObserver")
    ) {
      event.preventDefault()
      return true
    }

    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.apply(this, [event])
    }
  }
}

/**
 * Custom hook to apply ResizeObserver error handling
 */
export function useResizeObserverErrorHandler() {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      handleResizeObserverError()
    }
    // No cleanup needed as we want this to persist
  }, [])
}

