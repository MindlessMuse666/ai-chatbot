'use client'

import { useAuthStore } from '@/features/auth/model/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    console.log('Home page useEffect: isAuthenticated =', isAuthenticated)
    if (isAuthenticated) {
      console.log('Redirecting to /chat')
      router.replace('/chat')
    } else {
      console.log('Redirecting to /login')
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  return null
}