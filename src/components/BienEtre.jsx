import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import './BienEtre.css'

export default function BienEtre() {
  const { content } = useLocalizedContent()
  const { t } = useLanguage()
  const { bienEtre } = content

  return (
    <section className="bienetre" id="partenaires">
      <div id="bien-etre" className="bienetre__anchor" aria-hidden="true" />
      <div className="container">
        <div className="bienetre__head reveal">
          <div className="bienetre__intro">
            <span className="bienetre__label">{bienEtre.label}</span>
            <h2 className="bienetre__title">{bienEtre.title}</h2>
            <p className="bienetre__lead">{bienEtre.lead}</p>
          </div>
          {bienEtre.cta ? (
            <a href="#contact" className="btn btn--light bienetre__cta">
              {bienEtre.cta}
            </a>
          ) : null}
        </div>

        <div className="bienetre__grid">
          {bienEtre.offers.map((item) => (
            <article className="bienetre__card reveal" key={item.title}>
              <figure
                className={`bienetre__card-media${item.logo ? ' bienetre__card-media--logo' : ''}${item.logoLarge ? ' bienetre__card-media--logo-lg' : ''}`}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
              </figure>
              <div className="bienetre__card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.url ? (
                  <a
                    className="bienetre__card-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.url.includes('instagram.com') ? t('instagram') : t('website')}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
