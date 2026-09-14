import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from './ui'

const LanguageContext = createContext(null)

export function langFromPath(pathname) {
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de'
  return 'fr'
}

export function homePath(lang) {
  return lang === 'de' ? '/de' : '/'
}

export function localizePath(path, lang) {
  const raw = path.startsWith('/') ? path : `/${path}`
  if (raw === '/admin' || raw.startsWith('/admin/')) return raw
  const stripped = raw === '/de' || raw.startsWith('/de/') ? raw.slice(3) || '/' : raw
  if (lang === 'de') {
    return stripped === '/' ? '/de' : `/de${stripped}`
  }
  return stripped
}

export function LanguageProvider({ children }) {
  const { pathname, hash, search } = useLocation()
  const lang = langFromPath(pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => {
    const home = homePath(lang)
    const isHome = pathname === '/' || pathname === '/de'
    const otherLang = lang === 'de' ? 'fr' : 'de'
    const switchTo = `${localizePath(`${pathname}${search}`, otherLang)}${hash || ''}`

    return {
      lang,
      home,
      isHome,
      t: (key, vars) => t(lang, key, vars),
      to: (path) => localizePath(path, lang),
      switchTo,
    }
  }, [lang, pathname, hash, search])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      lang: 'fr',
      home: '/',
      isHome: true,
      t: (key, vars) => t('fr', key, vars),
      to: (path) => path,
      switchTo: '/de',
    }
  }
  return ctx
}
