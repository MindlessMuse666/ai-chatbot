'use client'

import { useAuthStore } from '@/features/auth/model/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (!isAuthenticated) {
    return null // Middleware will handle redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold text-foreground">
              AI Chatbot
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-foreground-secondary">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 