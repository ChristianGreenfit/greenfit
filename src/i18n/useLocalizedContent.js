import { useMemo } from 'react'
import { useContent } from '../context/ContentContext'
import { useLanguage } from './LanguageContext'
import { localizeContent } from './localize'

export function useLocalizedContent() {
  const ctx = useContent()
  const { lang } = useLanguage()
  const content = useMemo(
    () => localizeContent(ctx.content, lang),
    [ctx.content, lang],
  )
  return { ...ctx, content, lang }
}
