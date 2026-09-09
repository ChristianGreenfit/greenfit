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

  if (content.bienEtre?.offers) {
    content.bienEtre.offers = content.bienEtre.offers.map((offer) => ({
      url: '',
      logo: false,
      ...offer,
    }))
  }

  if (content.footer?.columns) {
    content.footer.columns = content.footer.columns.map((col) => ({
      ...col,
      links: (col.links || []).map((link) =>
        typeof link === 'string' ? { label: link, href: '#' } : link,
      ),
    }))
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
      const raw = await res.text()
      let data = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        throw new Error(
          res.status === 404
            ? 'API indisponible (404). Relancez le serveur local après la mise à jour, ou utilisez l’admin en production.'
            : `Réponse invalide du serveur (${res.status}).`,
        )
      }
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expirée ou non autorisée — reconnectez-vous.')
        }
        throw new Error(data.error || `Sauvegarde impossible (${res.status})`)
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
