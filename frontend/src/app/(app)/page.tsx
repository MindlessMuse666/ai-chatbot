'use client'

import { useAuthStore } from '@/features/auth/model/auth-store'

export default function HomePage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-foreground-secondary">
          Start a new chat or continue your previous conversations.
        </p>
      </div>

      {/* Placeholder for chat list */}
      <div className="grid gap-4">
        <div className="p-4 border border-border rounded-lg bg-background/50">
          <p className="text-center text-foreground-secondary">
            No chats yet. Start a new conversation!
          </p>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        className="mt-6 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        onClick={() => {
          // TODO: Implement new chat creation
          console.log('Create new chat')
        }}
      >
        Start New Chat
      </button>
    </div>
  )
} 