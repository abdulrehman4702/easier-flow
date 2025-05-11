"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AuthFormGeneratorProps {
  onComplete: (authConfig: any) => void
  onCancel: () => void
  initialAuthType?: string
  serviceType?: string
}

export function AuthFormGenerator({
  onComplete,
  onCancel,
  initialAuthType = "none",
  serviceType,
}: AuthFormGeneratorProps) {
  const [authType, setAuthType] = useState(initialAuthType)

  // API Key configuration
  const [apiKeyName, setApiKeyName] = useState("X-API-Key")
  const [apiKeyLocation, setApiKeyLocation] = useState("header")
  const [apiKeyValue, setApiKeyValue] = useState("")

  // OAuth configuration
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [authUrl, setAuthUrl] = useState("")
  const [tokenUrl, setTokenUrl] = useState("")
  const [scopes, setScopes] = useState("")
  const [redirectUri, setRedirectUri] = useState("https://app.easierflow.com/oauth/callback")

  // Basic Auth configuration
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // JWT configuration
  const [jwtToken, setJwtToken] = useState("")

  // Set default values based on service type
  useState(() => {
    if (serviceType === "github") {
      setAuthUrl("https://github.com/login/oauth/authorize")
      setTokenUrl("https://github.com/login/oauth/access_token")
      setScopes("repo,user")
    } else if (serviceType === "google") {
      setAuthUrl("https://accounts.google.com/o/oauth2/auth")
      setTokenUrl("https://oauth2.googleapis.com/token")
      setScopes("https://www.googleapis.com/auth/drive")
    } else if (serviceType === "twitter") {
      setAuthUrl("https://twitter.com/i/oauth2/authorize")
      setTokenUrl("https://api.twitter.com/2/oauth2/token")
      setScopes("tweet.read,tweet.write,users.read")
    }
  }, [serviceType])

  const handleSubmit = () => {
    let authConfig = {}

    switch (authType) {
      case "apiKey":
        authConfig = {
          type: "apiKey",
          name: apiKeyName,
          location: apiKeyLocation,
          value: apiKeyValue,
        }
        break
      case "oauth2":
        authConfig = {
          type: "oauth2",
          clientId,
          clientSecret,
          authUrl,
          tokenUrl,
          scopes: scopes.split(",").map((s) => s.trim()),
          redirectUri,
        }
        break
      case "basic":
        authConfig = {
          type: "basic",
          username,
          password,
        }
        break
      case "jwt":
        authConfig = {
          type: "jwt",
          token: jwtToken,
        }
        break
      default:
        authConfig = {
          type: "none",
        }
    }

    onComplete(authConfig)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configure Authentication</CardTitle>
        <CardDescription>Set up authentication for your API node</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-type">Authentication Type</Label>
            <Select value={authType} onValueChange={setAuthType}>
              <SelectTrigger id="auth-type">
                <SelectValue placeholder="Select authentication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Authentication</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="jwt">JWT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {authType === "apiKey" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key-name">API Key Name</Label>
                <Input id="api-key-name" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key-location">Location</Label>
                <Select value={apiKeyLocation} onValueChange={setApiKeyLocation}>
                  <SelectTrigger id="api-key-location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="query">Query Parameter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key-value">API Key Value</Label>
                <Input
                  id="api-key-value"
                  value={apiKeyValue}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  type="password"
                />
              </div>
            </div>
          )}

          {authType === "oauth2" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input id="client-id" value={clientId} onChange={(e) => setClientId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-url">Authorization URL</Label>
                <Input id="auth-url" value={authUrl} onChange={(e) => setAuthUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-url">Token URL</Label>
                <Input id="token-url" value={tokenUrl} onChange={(e) => setTokenUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scopes">Scopes (comma separated)</Label>
                <Input id="scopes" value={scopes} onChange={(e) => setScopes(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirect-uri">Redirect URI</Label>
                <Input id="redirect-uri" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} />
              </div>
            </div>
          )}

          {authType === "basic" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
              </div>
            </div>
          )}

          {authType === "jwt" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jwt-token">JWT Token</Label>
                <Input id="jwt-token" value={jwtToken} onChange={(e) => setJwtToken(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Configuration</Button>
      </CardFooter>
    </Card>
  )
}

