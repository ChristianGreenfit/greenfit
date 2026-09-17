import { useEffect, useRef, useState } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './Icon'
import './BienEtre.css'

function visibleCardCount(track) {
  const card = track?.children?.[0]
  if (!card) return 1
  const gap = parseFloat(getComputedStyle(track).gap) || 0
  const width = card.getBoundingClientRect().width + gap
  if (width < 8) return 1
  return Math.max(1, Math.round((track.clientWidth + gap) / width))
}

function maxSlideIndex(track) {
  const n = track?.children?.length || 0
  if (n <= 1) return 0
  return Math.max(0, n - visibleCardCount(track))
}

function slideIndexFromScroll(track) {
  if (!track) return 0
  const cards = [...track.children]
  if (!cards.length) return 0
  const left = track.scrollLeft
  const max = maxSlideIndex(track)
  let best = 0
  let bestDist = Infinity
  cards.forEach((card, i) => {
    if (i > max) return
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
  const [maxIndex, setMaxIndex] = useState(0)

  const measure = () => {
    const track = trackRef.current
    if (!track) return
    const nextMax = maxSlideIndex(track)
    setMaxIndex(nextMax)
    setIndex((i) => Math.min(i, nextMax))
  }

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    const next = Math.max(0, Math.min(i, maxSlideIndex(track)))
    const card = track.children[next]
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    }
    setIndex(next)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    measure()
    const onScroll = () => setIndex(slideIndexFromScroll(track))
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ro.disconnect()
      track.removeEventListener('scroll', onScroll)
    }
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
            disabled={index >= maxIndex}
            aria-label={t('nextPartner')}
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>

        {maxIndex > 0 ? (
          <div className="bienetre__dots" role="tablist" aria-label={bienEtre.label}>
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={offers[i]?.title || i}
                type="button"
                className={`bienetre__dot ${i === index ? 'is-active' : ''}`}
                aria-label={offers[i]?.title || `${i + 1}`}
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
