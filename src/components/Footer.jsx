import { useLocation } from 'react-router-dom'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import './Footer.css'

function resolveHref(href, isHome, home) {
  if (!href || href === '#') return '#'
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href
  }
  if (href.startsWith('#') && !isHome) {
    return `${home}${href}`
  }
  return href
}

function normalizeLink(link) {
  if (typeof link === 'string') {
    return { label: link, href: '#' }
  }
  return { label: link.label, href: link.href || '#' }
}

export default function Footer() {
  const { content } = useLocalizedContent()
  const { footer, contact, site } = content
  const { home, isHome, t } = useLanguage()
  const { pathname } = useLocation()
  const onHome = pathname === '/' || pathname === '/de' || isHome

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href={onHome ? '#top' : home} className="brand brand--footer">
              <span className="brand__logo" aria-hidden="true">
                <img src={site.logo} alt="" />
              </span>
              <span className="brand__word">{site.name}</span>
            </a>
            <p>{footer.tagline}</p>
            <address className="footer__contact">
              {contact.addressLine1}
              <br />
              {contact.addressLine2}
              <br />
              <a href={contact.phoneHref}>{contact.phone}</a>
              <br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          </div>

          <div className="footer__cols">
            {footer.columns.map((c) => (
              <div className="footer__col" key={c.title}>
                <h4>{c.title}</h4>
                <ul>
                  {c.links.map((raw) => {
                    const link = normalizeLink(raw)
                    return (
                      <li key={link.label}>
                        <a href={resolveHref(link.href, onHome, home)}>{link.label}</a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
