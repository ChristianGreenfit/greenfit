import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import './Navbar.css'

export default function Navbar() {
  const { content } = useLocalizedContent()
  const { nav, site } = content
  const { lang, home, isHome, t, switchTo } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const linkHref = (href) => (isHome ? href : `${home}${href.startsWith('#') ? href : `#${href}`}`)

  const LangSwitch = () => (
    <div className="nav__langs" role="group" aria-label="Language">
      <Link
        to={lang === 'fr' ? `${home}${window.location.hash || ''}` : switchTo}
        className={lang === 'fr' ? 'is-active' : ''}
        onClick={() => setOpen(false)}
      >
        FR
      </Link>
      <Link
        to={lang === 'de' ? `${home}${window.location.hash || ''}` : switchTo}
        className={lang === 'de' ? 'is-active' : ''}
        onClick={() => setOpen(false)}
      >
        DE
      </Link>
    </div>
  )

  return (
    <header className={`nav ${scrolled || !isHome ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href={isHome ? '#top' : home} className="brand" onClick={() => setOpen(false)}>
          <span className="brand__logo" aria-hidden="true">
            <img src={site.logo} alt="" />
          </span>
          <span className="brand__word">{site.name}</span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {nav.links.map((l) => (
            <a key={l.href} href={linkHref(l.href)} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href={linkHref('#tarifs')}
            className="btn btn--primary nav__cta--mobile"
            onClick={() => setOpen(false)}
          >
            {nav.ctaMobile}
          </a>
          <div className="nav__langs nav__langs--mobile">
            <LangSwitch />
          </div>
        </nav>

        <div className="nav__right">
          <div className="nav__langs nav__langs--desktop">
            <LangSwitch />
          </div>
          <a href={linkHref('#tarifs')} className="nav__cta">
            {nav.ctaDesktop}
          </a>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label={t('menu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
