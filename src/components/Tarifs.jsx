import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Icon from './Icon'
import { useRecentSubscriptions } from '../hooks/useRecentSubscriptions'
import InscriptionModal from './InscriptionModal'
import './Tarifs.css'

export default function Tarifs() {
  const { content } = useContent()
  const { tarifs } = content
  const { plans: PLANS, addons: ADDONS, features: FEATURES, extras } = tarifs

  const recentCount = useRecentSubscriptions()
  const [selectedPlan, setSelectedPlan] = useState(null)

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
                    <strong>{recentCount} personne{recentCount > 1 ? 's' : ''}</strong>
                    {' '}ont choisi cet abonnement au cours des dernières 24 h
                  </span>
                </p>
              )}
              <button
                type="button"
                className={`btn ${p.featured ? 'btn--primary' : 'btn--light'} tarifs__cta`}
                onClick={() => setSelectedPlan(p)}
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

      {selectedPlan && (
        <InscriptionModal
          plan={selectedPlan}
          addons={ADDONS}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  )
}
