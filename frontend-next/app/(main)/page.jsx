'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, initialized } = useSelector(s => s.auth)

  useEffect(() => {
    if (!initialized) return
    if (isAuthenticated) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [initialized, isAuthenticated, router])

  return null
}
