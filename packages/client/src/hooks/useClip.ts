import { useState } from 'react'

interface ClipResult {
  content: string
  hasPassword: boolean
  createdAt: number
}

export function useClip() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createClip(content: string, password?: string): Promise<string | null> {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, password: password || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return null
      }
      return data.code
    } catch {
      setError('网络错误')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function fetchClip(code: string, password?: string): Promise<ClipResult | null> {
    setLoading(true)
    setError(null)
    try {
      const needPassword = !!password
      const res = await fetch(`/api/clip/${code}`, {
        method: needPassword ? 'POST' : 'GET',
        headers: needPassword ? { 'Content-Type': 'application/json' } : {},
        body: needPassword ? JSON.stringify({ password }) : undefined,
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.hasPassword) {
          setError('需要密码')
          return null
        }
        setError(data.error)
        return null
      }
      return data
    } catch {
      setError('网络错误')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function deleteClip(code: string, password?: string): Promise<boolean> {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/clip/${code}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return false
      }
      return true
    } catch {
      setError('网络错误')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { createClip, fetchClip, deleteClip, loading, error, setError }
}
