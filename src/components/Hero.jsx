import { useEffect } from 'react'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './Icon'
import './Hero.css'

export default function Hero() {
  const { content } = useLocalizedContent()
  const { t } = useLanguage()
  const { hero } = content

  return (
    <section className="hero" id="top">
      <div className="hero__media">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
        >
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="hero__overlay" />
        <div className="hero__grid" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <div className="hero__top">
          <h1 className="hero__title">
            {hero.titleLines.map((line, i) => (
              <span key={i}>
                {line.highlight ? (
                  <span className="gradient-text">{line.text}</span>
                ) : (
                  line.text
                )}
                {i < hero.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="hero__sub">{hero.subtitle}</p>

          <div className="hero__actions">
            <a href={hero.ctaPrimary.href} className="btn btn--light">
              {hero.ctaPrimary.label}
              <span className="arrow"><Icon name="arrow" size={15} stroke={2} /></span>
            </a>
            <a href={hero.ctaSecondary.href} className="btn btn--ghost">
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        <div className="hero__stats">
          {hero.stats.map((s) => (
            <div className="hero__stat" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#centre" className="hero__scroll" aria-label={t('scrollDown')}>
        <span />
      </a>
    </section>
  )
}
