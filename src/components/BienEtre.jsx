import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './Icon'
import './BienEtre.css'

function cardIndexFromScroll(track) {
  if (!track) return 0
  const cards = [...track.children]
  if (!cards.length) return 0
  const left = track.scrollLeft
  let best = 0
  let bestDist = Infinity
  cards.forEach((card, i) => {
    const dist = Math.abs(card.offsetLeft - left)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  return best
}

export default function BienEtre() {
  const { content } = useLocalizedContent()
  const { t } = useLanguage()
  const { bienEtre } = content
  const offers = bienEtre.offers || []
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.children
    const next = Math.max(0, Math.min(i, cards.length - 1))
    const card = cards[next]
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    }
    setIndex(next)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const onScroll = () => setIndex(cardIndexFromScroll(track))
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [offers.length])

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

        <div className="bienetre__carousel reveal">
          <button
            type="button"
            className="bienetre__nav"
            onClick={() => goTo(index - 1)}
            disabled={index <= 0}
            aria-label={t('prevPartner')}
          >
            <Icon name="arrow" size={18} className="flip" />
          </button>

          <div className="bienetre__viewport">
            <div className="bienetre__track" ref={trackRef}>
              {offers.map((item) => (
                <article className="bienetre__card" key={item.title}>
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

          <button
            type="button"
            className="bienetre__nav"
            onClick={() => goTo(index + 1)}
            disabled={index >= offers.length - 1}
            aria-label={t('nextPartner')}
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>

        {offers.length > 1 ? (
          <div className="bienetre__dots" role="tablist" aria-label={bienEtre.label}>
            {offers.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`bienetre__dot ${i === index ? 'is-active' : ''}`}
                aria-label={item.title}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
