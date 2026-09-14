import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from './ui'

const LanguageContext = createContext(null)
const LANGS = ['fr', 'de']

export function langFromPath(pathname) {
  const first = pathname.split('/').filter(Boolean)[0]
  return first === 'de' ? 'de' : 'fr'
}

export function homePath(lang) {
  return lang === 'de' ? '/de' : '/fr'
}

function splitPath(path) {
  const raw = path.startsWith('/') ? path : `/${path}`
  const q = raw.indexOf('?')
  const pathname = q >= 0 ? raw.slice(0, q) : raw
  const search = q >= 0 ? raw.slice(q) : ''
  return { pathname, search }
}

export function stripLangPrefix(pathname) {
  const parts = pathname.split('/')
  if (LANGS.includes(parts[1])) {
    const rest = `/${parts.slice(2).join('/')}`.replace(/\/$/, '')
    return rest || '/'
  }
  return pathname || '/'
}

export function localizePath(path, lang) {
  const { pathname, search } = splitPath(path)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return pathname + search
  }
  const stripped = stripLangPrefix(pathname)
  const prefix = `/${lang}`
  const localized = stripped === '/' ? prefix : `${prefix}${stripped}`
  return localized + search
}

export function LanguageProvider({ children }) {
  const { pathname, hash, search } = useLocation()
  const lang = langFromPath(pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => {
    const home = homePath(lang)
    const isHome = pathname === '/fr' || pathname === '/de'
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
      home: '/fr',
      isHome: true,
      t: (key, vars) => t('fr', key, vars),
      to: (path) => localizePath(path, 'fr'),
      switchTo: '/de',
    }
  }
  return ctx
}
