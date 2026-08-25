import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { normalizePlanning } from '../lib/planning'

const ContentContext = createContext(null)
const STORAGE_KEY = 'greenfit-content-draft'

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function normalizeContent(raw) {
  const content = deepClone(raw)
  if (content.planning) {
    content.planning = normalizePlanning(content.planning)
  }
  return content
}

function loadInitialContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return normalizeContent(JSON.parse(saved))
  } catch {
    /* ignore invalid draft */
  }
  return normalizeContent(defaultContent)
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadInitialContent)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  }, [content])

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
    const fresh = normalizeContent(defaultContent)
    setContent(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setHasChanges(false)
  }, [])

  const markSaved = useCallback(() => {
    setHasChanges(false)
  }, [])

  const value = useMemo(
    () => ({
      content,
      hasChanges,
      updateSection,
      resetContent,
      markSaved,
    }),
    [content, hasChanges, updateSection, resetContent, markSaved]
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
