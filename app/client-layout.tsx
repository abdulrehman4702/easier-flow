"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { useEffect } from "react"
import { handleResizeObserverError } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

// Client component to handle ResizeObserver errors
function ErrorHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResizeObserverError()
    }
  }, [])

  return <>{children}</>
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorHandler>
            <AuthProvider>{children}</AuthProvider>
          </ErrorHandler>
        </ThemeProvider>
      </body>
    </html>
  )
}

