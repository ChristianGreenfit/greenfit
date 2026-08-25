import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultContent } from '../data/defaultContent'
import { normalizePlanning } from '../lib/planning'
import { getAdminToken } from '../admin/adminAuth'

const ContentContext = createContext(null)

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function normalizeContent(raw) {
  const content = deepClone(raw || defaultContent)
  if (content.planning) {
    content.planning = normalizePlanning(content.planning)
  }
  return content
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => normalizeContent(defaultContent))
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)

  // Charge le contenu depuis Supabase (via /api/content)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/content')
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Chargement impossible')
        if (!cancelled && data.content) {
          setContent(normalizeContent(data.content))
          setHasChanges(false)
          setLoadError('')
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[content] load:', err)
          setLoadError(String(err.message || err))
          // Fallback : défauts du code
          setContent(normalizeContent(defaultContent))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const updateSection = useCallback((section, updater) => {
    setContent((prev) => {
      const next = deepClone(prev)
      let value = typeof updater === 'function' ? updater(prev[section]) : updater
      if (section === 'planning') value = normalizePlanning(value)
      next[section] = value
      return next
    })
    setHasChanges(true)
  }, [])

  const resetContent = useCallback(() => {
    setContent(normalizeContent(defaultContent))
    setHasChanges(true)
  }, [])

  const saveContent = useCallback(async () => {
    const token = getAdminToken()
    if (!token) {
      throw new Error('Session admin expirée — reconnectez-vous.')
    }
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Sauvegarde impossible')
      }
      setHasChanges(false)
      return true
    } finally {
      setSaving(false)
    }
  }, [content])

  const value = useMemo(
    () => ({
      content,
      hasChanges,
      loading,
      loadError,
      saving,
      updateSection,
      resetContent,
      saveContent,
    }),
    [
      content,
      hasChanges,
      loading,
      loadError,
      saving,
      updateSection,
      resetContent,
      saveContent,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
