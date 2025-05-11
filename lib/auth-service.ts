"use client"

import { jwtDecode } from "jwt-decode"

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
}

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "admin",
  },
]

class AuthService {
  private tokenKey = "auth_token"
  private userKey = "auth_user"

  // Login user
  async login({ email, password, rememberMe = false }: LoginCredentials): Promise<AuthResponse> {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

        if (user) {
          // Create a mock JWT token (in a real app, this would come from the server)
          const token = this.generateMockToken(user)

          // Store auth data
          this.setToken(token, rememberMe)
          this.setUser(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            rememberMe,
          )

          resolve({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          })
        } else {
          reject(new Error("Invalid email or password"))
        }
      }, 800) // Simulate network delay
    })
  }

  // Register new user
  async signup({ name, email, password }: SignupCredentials): Promise<AuthResponse> {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

        if (existingUser) {
          reject(new Error("User with this email already exists"))
          return
        }

        // Create new user
        const newUser = {
          id: `${MOCK_USERS.length + 1}`,
          name,
          email,
          password,
          role: "user",
        }

        // In a real app, we would save this to a database
        MOCK_USERS.push(newUser)

        // Create a mock JWT token
        const token = this.generateMockToken(newUser)

        // Store auth data
        this.setToken(token, false)
        this.setUser(
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          false,
        )

        resolve({
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        })
      }, 800) // Simulate network delay
    })
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.userKey)

    // In a real app, you might want to invalidate the token on the server
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const decoded: any = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch (error) {
      return null
    }
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
  }

  // Set token
  private setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.tokenKey, token)
    } else {
      sessionStorage.setItem(this.tokenKey, token)
    }
  }

  // Set user
  private setUser(user: User, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.userKey, JSON.stringify(user))
    } else {
      sessionStorage.setItem(this.userKey, JSON.stringify(user))
    }
  }

  // Generate a mock JWT token (for demo purposes only)
  private generateMockToken(user: any): string {
    const header = {
      alg: "HS256",
      typ: "JWT",
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))
    const signature = btoa(`${user.id}:${Date.now()}`) // Not a real signature, just for demo

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }
}

// Create a singleton instance
const authService = new AuthService()
export default authService

