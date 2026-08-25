import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { normalizePlanning } from '../lib/planning'
import { getAdminToken } from '../admin/adminAuth'

const ContentContext = createContext(null)

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== 'object' || Array.isArray(overlay)) {
    return overlay === undefined ? base : overlay
  }
  const out = { ...base }
  for (const key of Object.keys(overlay)) {
    const b = base?.[key]
    const o = overlay[key]
    if (
      b &&
      o &&
      typeof b === 'object' &&
      typeof o === 'object' &&
      !Array.isArray(b) &&
      !Array.isArray(o)
    ) {
      out[key] = deepMerge(b, o)
    } else if (o !== undefined) {
      out[key] = o
    }
  }
  return out
}

function normalizeContent(raw) {
  const content = deepClone(raw)
  if (content.planning) {
    content.planning = normalizePlanning(content.planning)
  }
  return content
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => normalizeContent(defaultContent))
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError('')
      try {
        const res = await fetch('/api/content')
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Chargement impossible')
        if (cancelled) return
        if (data.content) {
          setContent(normalizeContent(deepMerge(defaultContent, data.content)))
          setUpdatedAt(data.updatedAt || null)
        } else {
          setContent(normalizeContent(defaultContent))
          setUpdatedAt(null)
        }
        setHasChanges(false)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Erreur de chargement')
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

  const saveContent = useCallback(async () => {
    const token = getAdminToken()
    if (!token) {
      throw new Error('Connectez-vous à l’admin pour enregistrer')
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
      if (!res.ok) throw new Error(data.error || 'Enregistrement impossible')
      setHasChanges(false)
      setUpdatedAt(data.updatedAt || new Date().toISOString())
      return true
    } finally {
      setSaving(false)
    }
  }, [content])

  const resetContent = useCallback(async () => {
    const fresh = normalizeContent(defaultContent)
    setContent(fresh)
    setHasChanges(true)
  }, [])

  const value = useMemo(
    () => ({
      content,
      hasChanges,
      loading,
      saving,
      loadError,
      updatedAt,
      updateSection,
      saveContent,
      resetContent,
    }),
    [
      content,
      hasChanges,
      loading,
      saving,
      loadError,
      updatedAt,
      updateSection,
      saveContent,
      resetContent,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
