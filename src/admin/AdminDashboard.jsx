import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import AdminLogin from './AdminLogin'
import { clearAdminToken, verifyAdminSession } from './adminAuth'
import './Admin.css'

const SECTIONS = [
  {
    id: 'overview',
    label: 'Accueil',
    icon: '⌂',
    blurb: 'Vue d’ensemble',
    help: 'Choisissez une section à modifier',
  },
  {
    id: 'hero',
    label: 'Bandeau d’accueil',
    icon: '▶',
    blurb: 'Titre, vidéo, chiffres',
    help: 'Ce que les visiteurs voient en haut de la page',
  },
  {
    id: 'centre',
    label: 'Le centre',
    icon: '◫',
    blurb: 'Textes et photos',
    help: 'Présentation du centre et galerie photos',
  },
  {
    id: 'bienEtre',
    label: 'Bien-être',
    icon: '♡',
    blurb: 'Offres bien-être',
    help: 'Sauna, massages, et autres offres',
  },
  {
    id: 'planning',
    label: 'Planning des cours',
    icon: '▦',
    blurb: 'Horaires des cours',
    help: 'Types de cours et grille horaire',
  },
  {
    id: 'tarifs',
    label: 'Prix & abonnements',
    icon: 'CHF',
    blurb: 'Formules et options',
    help: 'Prix affichés sur le site (pas les contrats bancaires)',
  },
  {
    id: 'faq',
    label: 'Questions fréquentes',
    icon: '?',
    blurb: 'FAQ',
    help: 'Questions / réponses du bas de page',
  },
  {
    id: 'contact',
    label: 'Contact & horaires',
    icon: '✉',
    blurb: 'Coordonnées',
    help: 'Adresse, téléphone et horaires de l’accueil',
  },
  {
    id: 'footer',
    label: 'Pied de page',
    icon: '⚙',
    blurb: 'Liens et titre Google',
    help: 'Bas de page et infos pour Google',
  },
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
  const [authState, setAuthState] = useState('loading') // loading | guest | ok

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ok = await verifyAdminSession()
      if (!cancelled) setAuthState(ok ? 'ok' : 'guest')
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (authState === 'loading') {
    return (
      <div className="admin-login">
        <div className="admin-login__card admin-login__card--loading">
          <p>Vérification de l’accès…</p>
        </div>
      </div>
    )
  }

  if (authState === 'guest') {
    return <AdminLogin onSuccess={() => setAuthState('ok')} />
  }

  return <AdminShell onLogout={() => {
    clearAdminToken()
    setAuthState('guest')
  }} />
}

function AdminShell({ onLogout }) {
  const { content, hasChanges, updateSection, resetContent, markSaved } = useContent()
  const [active, setActive] = useState('overview')
  const [toast, setToast] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const current = SECTIONS.find((s) => s.id === active)

  const showToast = (title, text) => {
    setToast({ title, text })
    setTimeout(() => setToast(null), 5000)
  }

  const handleSave = () => {
    markSaved()
    showToast(
      'Modifications enregistrées',
      'Elles sont sauvées sur cet ordinateur. Ouvrez le site dans le même navigateur pour les voir. La sauvegarde cloud arrive bientôt.',
    )
  }

  const handleReset = () => {
    if (window.confirm('Remettre tout le contenu comme au départ ? Les changements locaux seront perdus.')) {
      resetContent()
      showToast('Contenu remis à zéro', 'Tout a été remis aux valeurs d’origine.')
    }
  }

  const goSection = (id) => {
    setActive(id)
    setNavOpen(false)
  }

  return (
    <div className={`admin ${navOpen ? 'is-nav-open' : ''}`}>
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <img src={content.site.logo} alt="" />
          <div>
            <strong>GreenFit</strong>
            <span>Modifier le site</span>
          </div>
        </div>

        <nav className="admin__nav" aria-label="Sections du site">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`admin__nav-btn ${active === section.id ? 'is-active' : ''}`}
              onClick={() => goSection(section.id)}
            >
              <span className="admin__nav-icon">{section.icon}</span>
              <span className="admin__nav-text">
                <strong>{section.label}</strong>
                <em>{section.blurb}</em>
              </span>
            </button>
          ))}
        </nav>

        <div className="admin__sidebar-foot">
          <Link to="/" target="_blank" rel="noopener noreferrer">
            Voir le site →
          </Link>
          <button type="button" onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      </aside>

      {navOpen && (
        <button
          type="button"
          className="admin__nav-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="admin__main">
        <header className="admin__topbar">
          <div className="admin__topbar-left">
            <button
              type="button"
              className="admin__menu-btn"
              aria-label="Ouvrir le menu"
              onClick={() => setNavOpen((v) => !v)}
            >
              ☰
            </button>
            <div>
              <h1>{current?.label}</h1>
              <p>{current?.help || 'Modifiez le contenu, puis cliquez sur Enregistrer.'}</p>
            </div>
          </div>
          <div className="admin__topbar-actions">
            <span className={`admin__badge ${hasChanges ? '' : 'is-clean'}`}>
              {hasChanges ? '● Pas encore enregistré' : '● Enregistré'}
            </span>
            <button type="button" className="admin__btn admin__btn--ghost" onClick={handleReset}>
              Tout annuler
            </button>
            <button type="button" className="admin__btn admin__btn--primary" onClick={handleSave}>
              Enregistrer
            </button>
          </div>
        </header>

        <div className="admin__content">
          {active === 'overview' && <OverviewSection content={content} onNavigate={goSection} />}
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
      <div className="admin__info admin__info--friendly">
        <h3>Bienvenue dans l’espace de modification</h3>
        <ol>
          <li>Choisissez une section à gauche (ou ci-dessous).</li>
          <li>Modifiez les textes, prix ou horaires.</li>
          <li>Cliquez sur <strong>Enregistrer</strong> en haut à droite.</li>
          <li>
            Ouvrez <strong>Voir le site</strong> pour vérifier le résultat.
          </li>
        </ol>
        <p className="admin__info-note">
          Astuce : restez sur le même ordinateur et le même navigateur pour voir vos changements.
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
          <span>Photos</span>
        </div>
        <div className="admin__stat">
          <strong>{Object.keys(content.planning.types).length}</strong>
          <span>Types de cours</span>
        </div>
      </div>

      <Panel title="Que voulez-vous modifier ?" description="Cliquez sur une carte pour commencer">
        <div className="admin__grid admin__grid--3">
          {SECTIONS.filter((s) => s.id !== 'overview').map((section) => (
            <button
              key={section.id}
              type="button"
              className="admin__card admin__card--nav"
              onClick={() => onNavigate(section.id)}
            >
              <span className="admin__card-icon">{section.icon}</span>
              <strong>{section.label}</strong>
              <p>{section.help}</p>
              <span className="admin__card-cta">Modifier →</span>
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
  const [activeDay, setActiveDay] = useState(0)

  const update = (patch) => updateSection('planning', (prev) => ({ ...prev, ...patch }))

  const updateType = (key, field, value) =>
    updateSection('planning', (prev) => {
      const types = {
        ...prev.types,
        [key]: { ...prev.types[key], [field]: value },
      }
      const categories = prev.categories.map((cat) =>
        cat.key === key ? { ...cat, label: field === 'label' ? value : cat.label } : cat,
      )
      return { ...prev, types, categories }
    })

  const addType = () => {
    const label = window.prompt('Nom du nouveau cours ?', 'Nouveau cours')
    if (!label || !label.trim()) return
    const clean = label.trim()
    let base = clean
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 20)
    if (!base) base = 'cours'
    let key = base
    let n = 2
    while (planning.types[key]) {
      key = `${base}${n}`
      n += 1
    }

    updateSection('planning', (prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: { label: clean, tone: 'green', icon: 'pulse' },
      },
      categories: [...prev.categories, { key, label: clean }],
    }))
  }

  const removeType = (key) => {
    const name = planning.types[key]?.label || key
    if (
      !window.confirm(
        `Supprimer le cours « ${name} » ?\nIl sera aussi retiré du planning de la semaine.`,
      )
    ) {
      return
    }
    updateSection('planning', (prev) => {
      const types = { ...prev.types }
      delete types[key]
      const categories = prev.categories.filter((c) => c.key !== key)
      const schedule = prev.schedule.map((day) =>
        (Array.isArray(day) ? day : []).filter((s) => s.type !== key),
      )
      return { ...prev, types, categories, schedule }
    })
  }

  const daySessions = Array.isArray(planning.schedule[activeDay])
    ? planning.schedule[activeDay]
    : []

  const updateDaySession = (sessionIndex, field, value) =>
    updateSection('planning', (prev) => {
      const schedule = prev.schedule.map((day, di) => {
        if (di !== activeDay) return day
        const list = (Array.isArray(day) ? day : []).map((s, i) =>
          i === sessionIndex ? { ...s, [field]: value } : s,
        )
        return list.sort((a, b) => String(a.start).localeCompare(String(b.start)))
      })
      return { ...prev, schedule }
    })

  const addDaySession = () => {
    const firstType = typeKeys[0]
    if (!firstType) {
      window.alert('Ajoutez d’abord un cours dans « Mes cours ».')
      return
    }
    updateSection('planning', (prev) => {
      const schedule = prev.schedule.map((day, di) => {
        if (di !== activeDay) return day
        const list = Array.isArray(day) ? [...day] : []
        list.push({ type: firstType, start: '18:30', end: '19:30' })
        return list.sort((a, b) => String(a.start).localeCompare(String(b.start)))
      })
      return { ...prev, schedule }
    })
  }

  const removeDaySession = (sessionIndex) =>
    updateSection('planning', (prev) => {
      const schedule = prev.schedule.map((day, di) => {
        if (di !== activeDay) return day
        return (Array.isArray(day) ? day : []).filter((_, i) => i !== sessionIndex)
      })
      return { ...prev, schedule }
    })

  return (
    <>
      <div className="admin__info admin__info--friendly">
        <h3>Comment gérer le planning</h3>
        <ol>
          <li>
            Créez vos <strong>cours</strong> (Yoga, Body Pump…).
          </li>
          <li>
            Choisissez un <strong>jour</strong>, puis ajoutez ou retirez des créneaux librement.
          </li>
        </ol>
      </div>

      <Panel title="Textes de la section" description="Ce que les visiteurs lisent au-dessus du calendrier">
        <div className="admin__grid admin__grid--2">
          <Field label="Petit titre au-dessus" hint="Ex. Cours collectifs">
            <input value={planning.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Titre principal">
            <input value={planning.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Texte d’introduction">
            <textarea value={planning.subtitle} onChange={(e) => update({ subtitle: e.target.value })} rows={3} />
          </Field>
          <Field label="Note sous le calendrier">
            <textarea value={planning.note} onChange={(e) => update({ note: e.target.value })} rows={3} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Mes cours"
        description="Catalogue des activités. Créez-les ici avant de les placer dans la semaine."
      >
        <div className="admin__type-list">
          {typeKeys.map((key) => (
            <div key={key} className="admin__type-row">
              <div className="admin__type-main">
                <Field label="Nom du cours">
                  <input
                    value={planning.types[key].label}
                    onChange={(e) => updateType(key, 'label', e.target.value)}
                  />
                </Field>
                <Field label="Couleur sur le calendrier">
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
                    <option value="pulse">Cardio</option>
                    <option value="strength">Force</option>
                    <option value="person">Personne</option>
                    <option value="wellness">Bien-être</option>
                    <option value="spark">Énergie</option>
                    <option value="clock">Horloge</option>
                    <option value="check">Check</option>
                  </select>
                </Field>
              </div>
              <button
                type="button"
                className="admin__btn admin__btn--danger admin__btn--sm"
                onClick={() => removeType(key)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="admin__btn admin__btn--primary" onClick={addType} style={{ marginTop: '0.85rem' }}>
          + Ajouter un cours
        </button>
      </Panel>

      <Panel
        title="Planning de la semaine"
        description="Choisissez un jour, puis ajoutez autant de cours que vous voulez (ou retirez-en)."
      >
        <div className="admin__day-tabs" role="tablist" aria-label="Jour de la semaine">
          {DAY_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={activeDay === i}
              className={`admin__day-tab ${activeDay === i ? 'is-active' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              {name}
              {Array.isArray(planning.schedule[i]) && planning.schedule[i].length > 0 && (
                <span className="admin__day-count">{planning.schedule[i].length}</span>
              )}
            </button>
          ))}
        </div>

        {daySessions.length === 0 ? (
          <div className="admin__empty-day">
            <p>Aucun cours ce jour-là.</p>
          </div>
        ) : (
          <div className="admin__day-slots">
            {daySessions.map((session, index) => (
              <div key={`${session.type}-${session.start}-${index}`} className="admin__slot-card has-course">
                <div className="admin__slot-head">
                  <strong>Cours {index + 1}</strong>
                  <button
                    type="button"
                    className="admin__btn admin__btn--danger admin__btn--sm"
                    onClick={() => removeDaySession(index)}
                  >
                    Retirer
                  </button>
                </div>
                <div className="admin__slot-fields">
                  <Field label="Quel cours ?">
                    <select
                      value={session.type}
                      onChange={(e) => updateDaySession(index, 'type', e.target.value)}
                    >
                      {typeKeys.map((key) => (
                        <option key={key} value={key}>
                          {planning.types[key].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Début">
                    <input
                      type="time"
                      value={session.start}
                      onChange={(e) => updateDaySession(index, 'start', e.target.value)}
                    />
                  </Field>
                  <Field label="Fin">
                    <input
                      type="time"
                      value={session.end}
                      onChange={(e) => updateDaySession(index, 'end', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="admin__btn admin__btn--primary"
          onClick={addDaySession}
          style={{ marginTop: '0.85rem' }}
        >
          + Ajouter un cours ce jour
        </button>
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
