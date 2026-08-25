import { useContent } from '../context/ContentContext'
import './Footer.css'

export default function Footer() {
  const { content } = useContent()
  const { footer, contact, site } = content

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="brand brand--footer">
              <span className="brand__logo" aria-hidden="true">
                <img src={site.logo} alt="" />
              </span>
              <span className="brand__word">{site.name}</span>
            </a>
            <p>{footer.tagline}</p>
            <address className="footer__contact">
              {contact.addressLine1}<br />
              {contact.addressLine2}<br />
              <a href={contact.phoneHref}>{contact.phone}</a><br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          </div>

          <div className="footer__cols">
            {footer.columns.map((c) => (
              <div className="footer__col" key={c.title}>
                <h4>{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
          <div className="footer__legal">
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
            <a href="#">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
