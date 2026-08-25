import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Icon from './Icon'
import { useRecentSubscriptions } from '../hooks/useRecentSubscriptions'
import './Tarifs.css'

function TarifReduitWarning({ plan, onContinue, onClose }) {
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
        aria-label="Fermer"
      />
      <div className="tarifs-modal__panel tarifs-warn-panel">
        <button type="button" className="tarifs-modal__close" onClick={onClose} aria-label="Fermer">
          ×
        </button>

        <div className="tarifs-warn-panel__head">
          <p className="tarifs-warn-panel__plan">{plan.name}</p>
          <h3 id="tarif-warn-title">Comment souhaitez-vous vous abonner&nbsp;?</h3>
          <p className="tarifs-warn-panel__lead">
            La réduction de 10&nbsp;% (AVS, étudiant, AI) n’est disponible qu’à la
            réception, pas en paiement en ligne.
          </p>
        </div>

        <div className="tarifs-warn-panel__choices">
          <button type="button" className="tarifs-warn-choice" onClick={onClose}>
            <span className="tarifs-warn-choice__icon" aria-hidden="true">
              <Icon name="pin" size={20} stroke={1.8} />
            </span>
            <span className="tarifs-warn-choice__body">
              <strong>À la réception</strong>
              <span>−10&nbsp;% avec justificatif</span>
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
              <strong>En ligne</strong>
              <span>Tarif plein · {plan.price} CHF</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tarifs() {
  const navigate = useNavigate()
  const { content } = useContent()
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
              {p.featured && <span className="tarifs__ribbon">Populaire</span>}
              <h3>{p.name}</h3>
              <p className="tarifs__tagline">{p.tagline}</p>
              <div className="tarifs__price">
                <span className="tarifs__amount">{p.price} CHF</span>
              </div>
              <p className="tarifs__equiv">
                soit {Math.round(p.price / p.months)} CHF / mois
              </p>
              {p.featured && (
                <p className="tarifs__social">
                  <span className="tarifs__social-dot" aria-hidden="true" />
                  <span>
                    <strong>
                      {recentCount} personne{recentCount > 1 ? 's' : ''}
                    </strong>{' '}
                    ont choisi cet abonnement au cours des dernières 24 h
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
          onClose={() => setPendingPlan(null)}
          onContinue={() => {
            const months = pendingPlan.months
            setPendingPlan(null)
            navigate(`/checkout?plan=${months}`)
          }}
        />
      )}
    </section>
  )
}
