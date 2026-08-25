import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import './Navbar.css'

function homeHref(hash) {
  const path = hash.startsWith('#') ? hash : `#${hash}`
  return `/${path}`
}

export default function Navbar() {
  const { content } = useContent()
  const { nav, site } = content
  const { pathname } = useLocation()
  const onHome = pathname === '/'
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

  const linkHref = (href) => (onHome ? href : homeHref(href))

  return (
    <header className={`nav ${scrolled || !onHome ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href={onHome ? '#top' : '/'} className="brand" onClick={() => setOpen(false)}>
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
        </nav>

        <div className="nav__right">
          <a href={linkHref('#tarifs')} className="nav__cta">
            {nav.ctaDesktop}
          </a>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
