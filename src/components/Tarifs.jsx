import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './Icon'
import { useRecentSubscriptions } from '../hooks/useRecentSubscriptions'
import './Tarifs.css'

function TarifReduitWarning({ plan, onContinue, onClose, t }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="tarifs-modal" role="dialog" aria-modal="true" aria-labelledby="tarif-warn-title">
      <button
        type="button"
        className="tarifs-modal__backdrop"
        onClick={onClose}
        aria-label={t('close')}
      />
      <div className="tarifs-modal__panel tarifs-warn-panel">
        <button type="button" className="tarifs-modal__close" onClick={onClose} aria-label={t('close')}>
          ×
        </button>

        <div className="tarifs-warn-panel__head">
          <p className="tarifs-warn-panel__plan">{plan.name}</p>
          <h3 id="tarif-warn-title">{t('warnTitle')}</h3>
          <p className="tarifs-warn-panel__lead">{t('warnLead')}</p>
        </div>

        <div className="tarifs-warn-panel__choices">
          <button type="button" className="tarifs-warn-choice" onClick={onClose}>
            <span className="tarifs-warn-choice__icon" aria-hidden="true">
              <Icon name="pin" size={20} stroke={1.8} />
            </span>
            <span className="tarifs-warn-choice__body">
              <strong>{t('warnReception')}</strong>
              <span>{t('warnReceptionSub')}</span>
            </span>
          </button>

          <button
            type="button"
            className="tarifs-warn-choice tarifs-warn-choice--online"
            onClick={onContinue}
          >
            <span className="tarifs-warn-choice__icon" aria-hidden="true">
              <Icon name="arrow" size={20} stroke={1.8} />
            </span>
            <span className="tarifs-warn-choice__body">
              <strong>{t('warnOnline')}</strong>
              <span>{t('warnOnlineSub', { price: plan.price })}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tarifs() {
  const navigate = useNavigate()
  const { content } = useLocalizedContent()
  const { t, to, lang } = useLanguage()
  const { tarifs } = content
  const { plans: PLANS, features: FEATURES, extras } = tarifs

  const recentCount = useRecentSubscriptions()
  const [pendingPlan, setPendingPlan] = useState(null)

  const titleParts = tarifs.title.split(tarifs.titleHighlight)

  return (
    <section className="section tarifs" id="tarifs">
      <div className="container">
        <div className="section-head tarifs__head reveal">
          <span className="eyebrow">{tarifs.eyebrow}</span>
          <h2>
            {titleParts[0]}
            <span className="gradient-text">{tarifs.titleHighlight}</span>
            {titleParts[1] ?? ''}
          </h2>
        </div>

        <div className="tarifs__grid">
          {PLANS.map((p) => (
            <article
              className={`tarifs__card reveal ${p.featured ? 'is-featured' : ''}`}
              key={p.name}
            >
              {p.featured && <span className="tarifs__ribbon">{t('popular')}</span>}
              <h3>{p.name}</h3>
              <p className="tarifs__tagline">{p.tagline}</p>
              <div className="tarifs__price">
                <span className="tarifs__amount">{p.price} CHF</span>
              </div>
              <p className="tarifs__equiv">
                {t('perMonth', { n: Math.round(p.price / p.months) })}
              </p>
              {p.featured && (
                <p className="tarifs__social">
                  <span className="tarifs__social-dot" aria-hidden="true" />
                  <span>
                    {t('recentSubs', {
                      n: recentCount,
                      s: recentCount > 1 ? (lang === 'de' ? 'en' : 's') : '',
                    })}
                  </span>
                </p>
              )}
              <button
                type="button"
                className={`btn ${p.featured ? 'btn--primary' : 'btn--light'} tarifs__cta`}
                onClick={() => setPendingPlan(p)}
              >
                {p.cta}
              </button>
              <ul className="tarifs__features">
                {FEATURES.map((f) => (
                  <li key={f}>
                    <span className="check">
                      <Icon name="check" size={13} stroke={2.4} />
                    </span>{' '}
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="tarifs__extras reveal">
          {extras.map((extra) => (
            <div className="tarifs__extra" key={extra.title}>
              <span className="tarifs__extra-icon" aria-hidden="true">
                <Icon name={extra.icon ?? 'users'} size={20} stroke={1.8} />
              </span>
              <div className="tarifs__extra-text">
                <strong>{extra.title}</strong>
                <p>{extra.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pendingPlan && (
        <TarifReduitWarning
          plan={pendingPlan}
          t={t}
          onClose={() => setPendingPlan(null)}
          onContinue={() => {
            const months = pendingPlan.months
            setPendingPlan(null)
            navigate(`${to('/checkout')}?plan=${months}`)
          }}
        />
      )}
    </section>
  )
}
