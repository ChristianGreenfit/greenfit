import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import './Admin.css'

const SECTIONS = [
  { id: 'overview', label: 'Vue d’ensemble', icon: '◉' },
  { id: 'hero', label: 'Hero & vidéo', icon: '▶' },
  { id: 'centre', label: 'Le centre', icon: '◫' },
  { id: 'bienEtre', label: 'Bien-être', icon: '♡' },
  { id: 'planning', label: 'Planning', icon: '▦' },
  { id: 'tarifs', label: 'Tarifs', icon: 'CHF' },
  { id: 'faq', label: 'FAQ', icon: '?' },
  { id: 'contact', label: 'Contact', icon: '✉' },
  { id: 'footer', label: 'Footer & SEO', icon: '⚙' },
]

const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

function Field({ label, hint, children }) {
  return (
    <div className="admin__field">
      {label && <label>{label}</label>}
      {children}
      {hint && <small>{hint}</small>}
    </div>
  )
}

function Panel({ title, description, children }) {
  return (
    <section className="admin__panel">
      {(title || description) && (
        <div className="admin__panel-head">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="admin__toast" role="status">
      <strong>{message.title}</strong>
      <p>{message.text}</p>
      <button
        type="button"
        className="admin__btn admin__btn--ghost admin__btn--sm"
        style={{ marginTop: '0.75rem', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
        onClick={onClose}
      >
        Fermer
      </button>
    </div>
  )
}

export default function AdminDashboard() {
  const { content, hasChanges, updateSection, resetContent, markSaved } = useContent()
  const [active, setActive] = useState('overview')
  const [toast, setToast] = useState(null)

  const current = SECTIONS.find((s) => s.id === active)

  const showToast = (title, text) => {
    setToast({ title, text })
    setTimeout(() => setToast(null), 5000)
  }

  const handleSave = () => {
    showToast(
      'Sauvegarde cloud non disponible',
      'Les modifications sont enregistrées localement dans votre navigateur. Firebase ou Supabase sera connecté prochainement pour une persistance serveur.'
    )
    markSaved()
  }

  const handleReset = () => {
    if (window.confirm('Réinitialiser tout le contenu aux valeurs par défaut ?')) {
      resetContent()
      showToast('Contenu réinitialisé', 'Toutes les valeurs ont été remises par défaut.')
    }
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <img src={content.site.logo} alt="" />
          <div>
            <strong>GreenFit Admin</strong>
            <span>Panneau de gestion</span>
          </div>
        </div>

        <nav className="admin__nav">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`admin__nav-btn ${active === section.id ? 'is-active' : ''}`}
              onClick={() => setActive(section.id)}
            >
              <span className="admin__nav-icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <div className="admin__sidebar-foot">
          <Link to="/" target="_blank" rel="noopener noreferrer">
            Voir le site →
          </Link>
          <button type="button" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__topbar">
          <div>
            <h1>{current?.label}</h1>
            <p>Gérez le contenu du site GreenFit</p>
          </div>
          <div className="admin__topbar-actions">
            <span className={`admin__badge ${hasChanges ? '' : 'is-clean'}`}>
              {hasChanges ? '● Modifications non sauvegardées' : '● À jour (local)'}
            </span>
            <button type="button" className="admin__btn admin__btn--ghost" onClick={handleReset}>
              Annuler
            </button>
            <button type="button" className="admin__btn admin__btn--primary" onClick={handleSave}>
              Enregistrer
            </button>
          </div>
        </header>

        <div className="admin__content">
          {active === 'overview' && <OverviewSection content={content} onNavigate={setActive} />}
          {active === 'hero' && <HeroSection content={content} updateSection={updateSection} />}
          {active === 'centre' && <CentreSection content={content} updateSection={updateSection} />}
          {active === 'bienEtre' && <BienEtreSection content={content} updateSection={updateSection} />}
          {active === 'planning' && <PlanningSection content={content} updateSection={updateSection} />}
          {active === 'tarifs' && <TarifsSection content={content} updateSection={updateSection} />}
          {active === 'faq' && <FaqSection content={content} updateSection={updateSection} />}
          {active === 'contact' && <ContactSection content={content} updateSection={updateSection} />}
          {active === 'footer' && <FooterSection content={content} updateSection={updateSection} />}
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function OverviewSection({ content, onNavigate }) {
  return (
    <>
      <div className="admin__info">
        <h3>Mode démo — sans backend</h3>
        <p>
          Ce dashboard permet de modifier tous les contenus du site en temps réel. Les changements
          sont enregistrés localement dans votre navigateur (localStorage) pour prévisualisation.
          La prochaine étape sera de connecter Firebase ou Supabase pour une sauvegarde permanente
          et multi-utilisateurs.
        </p>
      </div>

      <div className="admin__overview">
        <div className="admin__stat">
          <strong>{content.faq.items.length}</strong>
          <span>Questions FAQ</span>
        </div>
        <div className="admin__stat">
          <strong>{content.tarifs.plans.length}</strong>
          <span>Abonnements</span>
        </div>
        <div className="admin__stat">
          <strong>{content.centre.photos.length}</strong>
          <span>Photos centre</span>
        </div>
        <div className="admin__stat">
          <strong>{Object.keys(content.planning.types).length}</strong>
          <span>Types de cours</span>
        </div>
      </div>

      <Panel title="Sections éditables" description="Cliquez pour accéder à l’éditeur">
        <div className="admin__grid admin__grid--3">
          {SECTIONS.filter((s) => s.id !== 'overview').map((section) => (
            <button
              key={section.id}
              type="button"
              className="admin__card"
              style={{ cursor: 'pointer', textAlign: 'left' }}
              onClick={() => onNavigate(section.id)}
            >
              <strong>{section.label}</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: '0.35rem' }}>
                Modifier →
              </p>
            </button>
          ))}
        </div>
      </Panel>
    </>
  )
}

function HeroSection({ content, updateSection }) {
  const { hero, site } = content

  const updateHero = (patch) => updateSection('hero', (prev) => ({ ...prev, ...patch }))
  const updateStat = (index, field, value) =>
    updateSection('hero', (prev) => {
      const stats = [...prev.stats]
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, stats }
    })
  const updateTitleLine = (index, field, value) =>
    updateSection('hero', (prev) => {
      const titleLines = [...prev.titleLines]
      titleLines[index] = { ...titleLines[index], [field]: value }
      return { ...prev, titleLines }
    })

  return (
    <>
      <Panel title="Textes principaux">
        <div className="admin__grid">
          {hero.titleLines.map((line, i) => (
            <div key={i} className="admin__grid admin__grid--2">
              <Field label={`Titre ligne ${i + 1}`}>
                <input
                  value={line.text}
                  onChange={(e) => updateTitleLine(i, 'text', e.target.value)}
                />
              </Field>
              <Field label="Mise en avant (dégradé)">
                <label className="admin__field--check">
                  <input
                    type="checkbox"
                    checked={line.highlight}
                    onChange={(e) => updateTitleLine(i, 'highlight', e.target.checked)}
                  />
                  Ligne en couleur dégradée
                </label>
              </Field>
            </div>
          ))}
          <Field label="Sous-titre">
            <textarea value={hero.subtitle} onChange={(e) => updateHero({ subtitle: e.target.value })} />
          </Field>
          <div className="admin__grid admin__grid--2">
            <Field label="Bouton principal">
              <input
                value={hero.ctaPrimary.label}
                onChange={(e) =>
                  updateHero({ ctaPrimary: { ...hero.ctaPrimary, label: e.target.value } })
                }
              />
            </Field>
            <Field label="Bouton secondaire">
              <input
                value={hero.ctaSecondary.label}
                onChange={(e) =>
                  updateHero({ ctaSecondary: { ...hero.ctaSecondary, label: e.target.value } })
                }
              />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel title="Statistiques">
        <div className="admin__grid">
          {hero.stats.map((stat, i) => (
            <div key={i} className="admin__card">
              <div className="admin__grid admin__grid--2">
                <Field label="Valeur">
                  <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
                </Field>
                <Field label="Label">
                  <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Médias" description="Chemins relatifs vers le dossier public/">
        <div className="admin__grid admin__grid--2">
          <Field label="Vidéo hero" hint="Ex: /videos/gym.mp4">
            <input value={hero.video} onChange={(e) => updateHero({ video: e.target.value })} />
          </Field>
          <Field label="Image poster (fallback)" hint="Ex: /images/salle/salle.jpg">
            <input value={hero.poster} onChange={(e) => updateHero({ poster: e.target.value })} />
          </Field>
          <Field label="Logo">
            <input
              value={site.logo}
              onChange={(e) => updateSection('site', (prev) => ({ ...prev, logo: e.target.value }))}
            />
          </Field>
        </div>
        <div className="admin__grid admin__grid--2" style={{ marginTop: '1rem' }}>
          <img className="admin__preview" src={hero.poster} alt="Aperçu poster" />
          <img className="admin__preview" src={site.logo} alt="Aperçu logo" />
        </div>
      </Panel>
    </>
  )
}

function CentreSection({ content, updateSection }) {
  const { centre } = content

  const update = (patch) => updateSection('centre', (prev) => ({ ...prev, ...patch }))

  const updateFeature = (index, field, value) =>
    updateSection('centre', (prev) => {
      const features = [...prev.features]
      features[index] = { ...features[index], [field]: value }
      return { ...prev, features }
    })

  const updateMetric = (index, field, value) =>
    updateSection('centre', (prev) => {
      const metrics = [...prev.metrics]
      metrics[index] = { ...metrics[index], [field]: value }
      return { ...prev, metrics }
    })

  const updatePhoto = (index, field, value) =>
    updateSection('centre', (prev) => {
      const photos = [...prev.photos]
      photos[index] = { ...photos[index], [field]: value }
      return { ...prev, photos }
    })

  return (
    <>
      <Panel title="Textes">
        <div className="admin__grid">
          <Field label="Label section">
            <input value={centre.label} onChange={(e) => update({ label: e.target.value })} />
          </Field>
          <Field label="Titre" hint="Utilisez Entrée pour un retour à la ligne">
            <textarea value={centre.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Texte d’introduction">
            <textarea value={centre.lead} onChange={(e) => update({ lead: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Points forts">
        {centre.features.map((feature, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid admin__grid--2">
              <Field label="Titre">
                <input
                  value={feature.title}
                  onChange={(e) => updateFeature(i, 'title', e.target.value)}
                />
              </Field>
              <Field label="Description">
                <input value={feature.text} onChange={(e) => updateFeature(i, 'text', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="Chiffres clés">
        <div className="admin__grid admin__grid--3">
          {centre.metrics.map((metric, i) => (
            <div key={i} className="admin__card">
              <Field label="Valeur">
                <input
                  value={metric.value}
                  onChange={(e) => updateMetric(i, 'value', e.target.value)}
                />
              </Field>
              <Field label="Label">
                <input
                  value={metric.label}
                  onChange={(e) => updateMetric(i, 'label', e.target.value)}
                />
              </Field>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Photos">
        {centre.photos.map((photo, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid admin__grid--2">
              <Field label={`Image ${i + 1} — URL`}>
                <input value={photo.src} onChange={(e) => updatePhoto(i, 'src', e.target.value)} />
              </Field>
              <Field label="Texte alternatif">
                <input value={photo.alt} onChange={(e) => updatePhoto(i, 'alt', e.target.value)} />
              </Field>
            </div>
            <img className="admin__preview" src={photo.src} alt={photo.alt} style={{ marginTop: '0.75rem' }} />
          </div>
        ))}
      </Panel>
    </>
  )
}

function BienEtreSection({ content, updateSection }) {
  const { bienEtre } = content
  const update = (patch) => updateSection('bienEtre', (prev) => ({ ...prev, ...patch }))

  const updateOffer = (index, field, value) =>
    updateSection('bienEtre', (prev) => {
      const offers = [...prev.offers]
      offers[index] = { ...offers[index], [field]: value }
      return { ...prev, offers }
    })

  return (
    <>
      <Panel title="Textes">
        <div className="admin__grid">
          <Field label="Label">
            <input value={bienEtre.label} onChange={(e) => update({ label: e.target.value })} />
          </Field>
          <Field label="Titre">
            <input value={bienEtre.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Introduction">
            <textarea value={bienEtre.lead} onChange={(e) => update({ lead: e.target.value })} />
          </Field>
          <Field label="Bouton CTA">
            <input value={bienEtre.cta} onChange={(e) => update({ cta: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Offres">
        {bienEtre.offers.map((offer, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid">
              <Field label="Titre">
                <input value={offer.title} onChange={(e) => updateOffer(i, 'title', e.target.value)} />
              </Field>
              <Field label="Description">
                <textarea value={offer.text} onChange={(e) => updateOffer(i, 'text', e.target.value)} />
              </Field>
              <div className="admin__grid admin__grid--2">
                <Field label="Image URL">
                  <input value={offer.src} onChange={(e) => updateOffer(i, 'src', e.target.value)} />
                </Field>
                <Field label="Alt">
                  <input value={offer.alt} onChange={(e) => updateOffer(i, 'alt', e.target.value)} />
                </Field>
              </div>
              <img className="admin__preview" src={offer.src} alt={offer.alt} />
            </div>
          </div>
        ))}
      </Panel>
    </>
  )
}

function PlanningSection({ content, updateSection }) {
  const { planning } = content
  const typeKeys = Object.keys(planning.types)

  const update = (patch) => updateSection('planning', (prev) => ({ ...prev, ...patch }))

  const updateSession = (dayIndex, slotKey, field, value) =>
    updateSection('planning', (prev) => {
      const schedule = prev.schedule.map((day, di) => {
        if (di !== dayIndex) return day
        const slot = day[slotKey]
        if (field === 'type' && value === '') {
          return { ...day, [slotKey]: null }
        }
        if (!slot) {
          return {
            ...day,
            [slotKey]: { type: value, start: '09:30', end: '10:30' },
          }
        }
        return { ...day, [slotKey]: { ...slot, [field]: value } }
      })
      return { ...prev, schedule }
    })

  const updateType = (key, field, value) =>
    updateSection('planning', (prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: { ...prev.types[key], [field]: value },
      },
    }))

  return (
    <>
      <Panel title="Textes">
        <div className="admin__grid admin__grid--2">
          <Field label="Eyebrow">
            <input value={planning.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Titre">
            <input value={planning.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Sous-titre">
            <textarea value={planning.subtitle} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <Field label="Note de bas de page">
            <textarea value={planning.note} onChange={(e) => update({ note: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Types de cours">
        <div className="admin__grid">
          {typeKeys.map((key) => (
            <div key={key} className="admin__card">
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{key}</strong>
              <div className="admin__grid admin__grid--3">
                <Field label="Nom affiché">
                  <input
                    value={planning.types[key].label}
                    onChange={(e) => updateType(key, 'label', e.target.value)}
                  />
                </Field>
                <Field label="Couleur">
                  <select
                    value={planning.types[key].tone}
                    onChange={(e) => updateType(key, 'tone', e.target.value)}
                  >
                    <option value="green">Vert</option>
                    <option value="purple">Violet</option>
                    <option value="slate">Gris</option>
                  </select>
                </Field>
                <Field label="Icône">
                  <select
                    value={planning.types[key].icon}
                    onChange={(e) => updateType(key, 'icon', e.target.value)}
                  >
                    {['pulse', 'strength', 'person', 'wellness', 'spark', 'clock', 'check'].map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Grille hebdomadaire" description="Modifiez les cours pour chaque jour et créneau">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin__schedule-table">
            <thead>
              <tr>
                <th>Jour / Créneau</th>
                {planning.slots.map((slot) => (
                  <th key={slot.key}>{slot.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planning.schedule.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <th>{DAY_NAMES[dayIndex]}</th>
                  {planning.slots.map((slot) => {
                    const session = day[slot.key]
                    return (
                      <td key={slot.key}>
                        <div className="admin__schedule-cell">
                          <select
                            value={session?.type ?? ''}
                            onChange={(e) => updateSession(dayIndex, slot.key, 'type', e.target.value)}
                          >
                            <option value="">— Aucun —</option>
                            {typeKeys.map((key) => (
                              <option key={key} value={key}>
                                {planning.types[key].label}
                              </option>
                            ))}
                          </select>
                          {session && (
                            <>
                              <input
                                type="time"
                                value={session.start}
                                onChange={(e) =>
                                  updateSession(dayIndex, slot.key, 'start', e.target.value)
                                }
                              />
                              <input
                                type="time"
                                value={session.end}
                                onChange={(e) => updateSession(dayIndex, slot.key, 'end', e.target.value)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function TarifsSection({ content, updateSection }) {
  const { tarifs } = content
  const update = (patch) => updateSection('tarifs', (prev) => ({ ...prev, ...patch }))

  const updatePlan = (index, field, value) =>
    updateSection('tarifs', (prev) => {
      const plans = [...prev.plans]
      plans[index] = {
        ...plans[index],
        [field]: field === 'price' || field === 'months' ? Number(value) : value,
      }
      if (field === 'featured' && value) {
        plans.forEach((p, i) => {
          if (i !== index) plans[i] = { ...p, featured: false }
        })
      }
      return { ...prev, plans }
    })

  const updateAddon = (index, field, value) =>
    updateSection('tarifs', (prev) => {
      const addons = [...prev.addons]
      addons[index] = {
        ...addons[index],
        [field]: field === 'price' ? Number(value) : value,
      }
      return { ...prev, addons }
    })

  const updateFeature = (index, value) =>
    updateSection('tarifs', (prev) => {
      const features = [...prev.features]
      features[index] = value
      return { ...prev, features }
    })

  const updateExtra = (index, field, value) =>
    updateSection('tarifs', (prev) => {
      const extras = [...prev.extras]
      extras[index] = { ...extras[index], [field]: value }
      return { ...prev, extras }
    })

  return (
    <>
      <Panel title="En-tête">
        <div className="admin__grid admin__grid--2">
          <Field label="Eyebrow">
            <input value={tarifs.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Mot en dégradé dans le titre">
            <input
              value={tarifs.titleHighlight}
              onChange={(e) => update({ titleHighlight: e.target.value })}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Abonnements">
        {tarifs.plans.map((plan, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid admin__grid--3">
              <Field label="Nom">
                <input value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} />
              </Field>
              <Field label="Prix (CHF)">
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => updatePlan(i, 'price', e.target.value)}
                />
              </Field>
              <Field label="Durée (mois)">
                <input
                  type="number"
                  value={plan.months}
                  onChange={(e) => updatePlan(i, 'months', e.target.value)}
                />
              </Field>
              <Field label="Accroche">
                <input value={plan.tagline} onChange={(e) => updatePlan(i, 'tagline', e.target.value)} />
              </Field>
              <Field label="Bouton CTA">
                <input value={plan.cta} onChange={(e) => updatePlan(i, 'cta', e.target.value)} />
              </Field>
              <Field label="Populaire">
                <label className="admin__field--check">
                  <input
                    type="checkbox"
                    checked={plan.featured}
                    onChange={(e) => updatePlan(i, 'featured', e.target.checked)}
                  />
                  Mettre en avant
                </label>
              </Field>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="Options supplémentaires">
        {tarifs.addons.map((addon, i) => (
          <div key={addon.id} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid admin__grid--2">
              <Field label="Description">
                <input value={addon.label} onChange={(e) => updateAddon(i, 'label', e.target.value)} />
              </Field>
              <Field label="Prix (CHF)">
                <input
                  type="number"
                  value={addon.price}
                  onChange={(e) => updateAddon(i, 'price', e.target.value)}
                />
              </Field>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="Avantages inclus">
        {tarifs.features.map((feature, i) => (
          <Field key={i} label={`Point ${i + 1}`}>
            <input value={feature} onChange={(e) => updateFeature(i, e.target.value)} />
          </Field>
        ))}
      </Panel>

      <Panel title="Encarts informatifs">
        {tarifs.extras.map((extra, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__grid admin__grid--2">
              <Field label="Titre">
                <input value={extra.title} onChange={(e) => updateExtra(i, 'title', e.target.value)} />
              </Field>
              <Field label="Texte">
                <textarea value={extra.text} onChange={(e) => updateExtra(i, 'text', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </Panel>
    </>
  )
}

function FaqSection({ content, updateSection }) {
  const { faq } = content
  const update = (patch) => updateSection('faq', (prev) => ({ ...prev, ...patch }))

  const updateItem = (index, field, value) =>
    updateSection('faq', (prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })

  const addItem = () =>
    updateSection('faq', (prev) => ({
      ...prev,
      items: [...prev.items, { q: 'Nouvelle question', a: 'Réponse…' }],
    }))

  const removeItem = (index) =>
    updateSection('faq', (prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))

  return (
    <>
      <Panel title="En-tête">
        <div className="admin__grid">
          <Field label="Eyebrow">
            <input value={faq.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Mot en dégradé">
            <input
              value={faq.titleHighlight}
              onChange={(e) => update({ titleHighlight: e.target.value })}
            />
          </Field>
          <Field label="Introduction">
            <textarea value={faq.intro} onChange={(e) => update({ intro: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Questions / réponses"
        description={`${faq.items.length} entrée(s)`}
      >
        {faq.items.map((item, i) => (
          <div key={i} className="admin__card" style={{ marginBottom: '0.75rem' }}>
            <div className="admin__card-head">
              <h3>Question {i + 1}</h3>
              <button
                type="button"
                className="admin__btn admin__btn--danger admin__btn--sm"
                onClick={() => removeItem(i)}
              >
                Supprimer
              </button>
            </div>
            <div className="admin__grid">
              <Field label="Question">
                <input value={item.q} onChange={(e) => updateItem(i, 'q', e.target.value)} />
              </Field>
              <Field label="Réponse">
                <textarea value={item.a} onChange={(e) => updateItem(i, 'a', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" className="admin__btn admin__btn--ghost" onClick={addItem}>
          + Ajouter une question
        </button>
      </Panel>
    </>
  )
}

function ContactSection({ content, updateSection }) {
  const { contact } = content
  const update = (patch) => updateSection('contact', (prev) => ({ ...prev, ...patch }))

  const updateHour = (index, field, value) =>
    updateSection('contact', (prev) => {
      const receptionHours = [...prev.receptionHours]
      receptionHours[index] = { ...receptionHours[index], [field]: value }
      return { ...prev, receptionHours }
    })

  return (
    <>
      <Panel title="Textes">
        <div className="admin__grid">
          <Field label="Introduction">
            <textarea value={contact.intro} onChange={(e) => update({ intro: e.target.value })} />
          </Field>
          <Field label="Titre formulaire">
            <input value={contact.formTitle} onChange={(e) => update({ formTitle: e.target.value })} />
          </Field>
          <Field label="Message de succès">
            <textarea
              value={contact.successMessage}
              onChange={(e) => update({ successMessage: e.target.value })}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Coordonnées">
        <div className="admin__grid admin__grid--2">
          <Field label="Téléphone">
            <input value={contact.phone} onChange={(e) => update({ phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <input value={contact.email} onChange={(e) => update({ email: e.target.value })} />
          </Field>
          <Field label="Adresse ligne 1">
            <input
              value={contact.addressLine1}
              onChange={(e) => update({ addressLine1: e.target.value })}
            />
          </Field>
          <Field label="Adresse ligne 2">
            <input
              value={contact.addressLine2}
              onChange={(e) => update({ addressLine2: e.target.value })}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Horaires réception">
        {contact.receptionHours.map((slot, i) => (
          <div key={i} className="admin__grid admin__grid--2" style={{ marginBottom: '0.75rem' }}>
            <Field label="Jours">
              <input value={slot.days} onChange={(e) => updateHour(i, 'days', e.target.value)} />
            </Field>
            <Field label="Heures">
              <input value={slot.hours} onChange={(e) => updateHour(i, 'hours', e.target.value)} />
            </Field>
          </div>
        ))}
        <Field label="Note complémentaire">
          <textarea value={contact.hoursNote} onChange={(e) => update({ hoursNote: e.target.value })} />
        </Field>
      </Panel>
    </>
  )
}

function FooterSection({ content, updateSection }) {
  const { footer, site, nav } = content

  return (
    <>
      <Panel title="SEO & site">
        <div className="admin__grid">
          <Field label="Titre de la page (SEO)">
            <input
              value={site.seo.title}
              onChange={(e) =>
                updateSection('site', (prev) => ({
                  ...prev,
                  seo: { ...prev.seo, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Meta description">
            <textarea
              value={site.seo.description}
              onChange={(e) =>
                updateSection('site', (prev) => ({
                  ...prev,
                  seo: { ...prev.seo, description: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Footer">
        <Field label="Texte de présentation">
          <textarea
            value={footer.tagline}
            onChange={(e) =>
              updateSection('footer', (prev) => ({ ...prev, tagline: e.target.value }))
            }
          />
        </Field>
      </Panel>

      <Panel title="Navigation">
        {nav.links.map((link, i) => (
          <div key={i} className="admin__grid admin__grid--2" style={{ marginBottom: '0.5rem' }}>
            <Field label={`Lien ${i + 1}`}>
              <input
                value={link.label}
                onChange={(e) =>
                  updateSection('nav', (prev) => {
                    const links = [...prev.links]
                    links[i] = { ...links[i], label: e.target.value }
                    return { ...prev, links }
                  })
                }
              />
            </Field>
          </div>
        ))}
        <div className="admin__grid admin__grid--2">
          <Field label="CTA desktop">
            <input
              value={nav.ctaDesktop}
              onChange={(e) =>
                updateSection('nav', (prev) => ({ ...prev, ctaDesktop: e.target.value }))
              }
            />
          </Field>
          <Field label="CTA mobile">
            <input
              value={nav.ctaMobile}
              onChange={(e) =>
                updateSection('nav', (prev) => ({ ...prev, ctaMobile: e.target.value }))
              }
            />
          </Field>
        </div>
      </Panel>
    </>
  )
}
