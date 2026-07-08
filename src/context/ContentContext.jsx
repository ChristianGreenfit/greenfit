import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'

const ContentContext = createContext(null)
const STORAGE_KEY = 'greenfit-content-draft'

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function loadInitialContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore invalid draft */
  }
  return deepClone(defaultContent)
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
      next[section] = typeof updater === 'function' ? updater(prev[section]) : updater
      return next
    })
    setHasChanges(true)
  }, [])

  const resetContent = useCallback(() => {
    const fresh = deepClone(defaultContent)
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
