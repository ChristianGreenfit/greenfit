import { useEffect } from 'react'

/**
 * Active une animation d'apparition sur tous les éléments .reveal
 * lorsqu'ils entrent dans le viewport.
 * Relancé à chaque changement de langue / page pour ne pas laisser
 * les nouvelles cartes invisibles (opacity: 0).
 */
export function useReveal(resetKey) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!els.length) return undefined

    const show = (el) => el.classList.add('is-visible')

    if (!('IntersectionObserver' in window)) {
      els.forEach(show)
      return undefined
    }

    const inView = (el) => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return rect.bottom > 0 && rect.top < vh
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    els.forEach((el) => {
      if (inView(el)) show(el)
      else observer.observe(el)
    })

    return () => observer.disconnect()
  }, [resetKey])
}
