import { useEffect, useState } from 'react'
import Icon from './Icon'
import { createOrder } from '../lib/api'

function formatChf(amount) {
  return `${amount} CHF`
}

const EMPTY_FORM = {
  member_marital1: '',
  member_firstname: '',
  member_lastname: '',
  member_email: '',
  member_phone: '',
  member_dob: '',
  member_address: '',
  member_npa: '',
  member_city: '',
  conditions_fitness: false,
}

function validate(form) {
  const errors = {}
  const required = {
    member_marital1: 'Civilité',
    member_lastname: 'Nom',
    member_firstname: 'Prénom',
    member_email: 'Email',
    member_phone: 'Téléphone',
    member_dob: 'Date de naissance',
    member_address: 'Adresse',
    member_npa: 'NPA',
    member_city: 'Ville',
  }

  Object.entries(required).forEach(([key, label]) => {
    if (!form[key] || !String(form[key]).trim()) {
      errors[key] = `${label} obligatoire`
    }
  })

  if (form.member_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.member_email)) {
    errors.member_email = "Format d'email invalide"
  }

  const digits = (form.member_phone || '').replace(/\D/g, '')
  if (form.member_phone && (digits.length !== 9 || digits[0] === '0')) {
    errors.member_phone = '9 chiffres sans le 0 (ex : 79 123 45 67)'
  }

  if (form.member_dob && !/^\d{2}\.\d{2}\.\d{4}$/.test(form.member_dob)) {
    errors.member_dob = 'Format jj.mm.aaaa'
  }

  if (!form.conditions_fitness) {
    errors.conditions_fitness = 'Vous devez accepter les conditions'
  }

  return errors
}

export default function InscriptionModal({ plan, addons, onClose }) {
  const [step, setStep] = useState('options') // 'options' | 'form'
  const [selectedAddons, setSelectedAddons] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, loading])

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addons.find((a) => a.id === id)
    return sum + (addon?.price ?? 0)
  }, 0)
  const total = plan.price + addonsTotal

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setLoading(true)
    const result = await createOrder({
      months: plan.months,
      optionIds: selectedAddons,
      client: { ...form, conditions_fitness: true },
    })
    setLoading(false)

    if (result.redirectUrl) {
      window.location.href = result.redirectUrl
      return
    }
    setSubmitError(
      (result.errors && result.errors.join(' ')) ||
        'Une erreur est survenue, réessayez.'
    )
  }

  return (
    <div className="tarifs-modal" role="dialog" aria-modal="true" aria-labelledby="insc-title">
      <button
        type="button"
        className="tarifs-modal__backdrop"
        onClick={() => !loading && onClose()}
        aria-label="Fermer"
      />

      <div className="tarifs-modal__panel">
        <button
          type="button"
          className="tarifs-modal__close"
          onClick={() => !loading && onClose()}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="tarifs-modal__head">
          <span className="eyebrow">
            {step === 'options' ? 'Votre sélection' : 'Vos informations'}
          </span>
          <h3 id="insc-title">Abonnement {plan.name}</h3>
          <p className="tarifs-modal__plan-price">{formatChf(plan.price)}</p>
        </div>

        {step === 'options' && (
          <>
            <p className="tarifs-modal__lead">
              Ajoutez des options à votre abonnement (facultatif) :
            </p>

            <ul className="tarifs-modal__options">
              {addons.map((addon) => {
                const checked = selectedAddons.includes(addon.id)
                return (
                  <li key={addon.id}>
                    <label className={`tarifs-modal__option ${checked ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                      />
                      <span className="tarifs-modal__option-box" aria-hidden="true">
                        {checked && <Icon name="check" size={14} stroke={2.5} />}
                      </span>
                      <span className="tarifs-modal__option-text">{addon.label}</span>
                      <span className="tarifs-modal__option-price">{formatChf(addon.price)}</span>
                    </label>
                  </li>
                )
              })}
            </ul>

            <div className="tarifs-modal__summary">
              <div className="tarifs-modal__summary-row">
                <span>Abonnement</span>
                <span>{formatChf(plan.price)}</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="tarifs-modal__summary-row">
                  <span>Options ({selectedAddons.length})</span>
                  <span>{formatChf(addonsTotal)}</span>
                </div>
              )}
              <div className="tarifs-modal__summary-row tarifs-modal__summary-row--total">
                <span>Total</span>
                <span>{formatChf(total)}</span>
              </div>
            </div>

            <div className="tarifs-modal__actions">
              <button type="button" className="btn btn--light" onClick={onClose}>
                Annuler
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setStep('form')}>
                Continuer
                <span className="arrow"><Icon name="arrow" size={15} stroke={2} /></span>
              </button>
            </div>
          </>
        )}

        {step === 'form' && (
          <form className="insc-form" onSubmit={handleSubmit} noValidate>
            <div className="insc-form__marital">
              <label className={`insc-radio ${form.member_marital1 === 'Monsieur' ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="marital"
                  checked={form.member_marital1 === 'Monsieur'}
                  onChange={() => setField('member_marital1', 'Monsieur')}
                />
                M.
              </label>
              <label className={`insc-radio ${form.member_marital1 === 'Madame' ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="marital"
                  checked={form.member_marital1 === 'Madame'}
                  onChange={() => setField('member_marital1', 'Madame')}
                />
                Mme
              </label>
            </div>
            {errors.member_marital1 && <span className="insc-err">{errors.member_marital1}</span>}

            <div className="insc-grid">
              <Field label="Prénom" error={errors.member_firstname}>
                <input
                  value={form.member_firstname}
                  onChange={(e) => setField('member_firstname', e.target.value)}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Nom" error={errors.member_lastname}>
                <input
                  value={form.member_lastname}
                  onChange={(e) => setField('member_lastname', e.target.value)}
                  autoComplete="family-name"
                />
              </Field>
            </div>

            <div className="insc-grid">
              <Field label="Email" error={errors.member_email}>
                <input
                  type="email"
                  value={form.member_email}
                  onChange={(e) => setField('member_email', e.target.value)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Téléphone" error={errors.member_phone} hint="Sans le 0, ex : 79 123 45 67">
                <input
                  value={form.member_phone}
                  onChange={(e) => setField('member_phone', e.target.value)}
                  placeholder="79 123 45 67"
                  autoComplete="tel"
                />
              </Field>
            </div>

            <Field label="Date de naissance" error={errors.member_dob} hint="jj.mm.aaaa">
              <input
                value={form.member_dob}
                onChange={(e) => setField('member_dob', e.target.value)}
                placeholder="01.01.1990"
              />
            </Field>

            <Field label="Adresse" error={errors.member_address}>
              <input
                value={form.member_address}
                onChange={(e) => setField('member_address', e.target.value)}
                autoComplete="street-address"
              />
            </Field>

            <div className="insc-grid">
              <Field label="NPA" error={errors.member_npa}>
                <input
                  value={form.member_npa}
                  onChange={(e) => setField('member_npa', e.target.value)}
                  autoComplete="postal-code"
                />
              </Field>
              <Field label="Ville" error={errors.member_city}>
                <input
                  value={form.member_city}
                  onChange={(e) => setField('member_city', e.target.value)}
                  autoComplete="address-level2"
                />
              </Field>
            </div>

            <label className={`insc-conditions ${errors.conditions_fitness ? 'is-error' : ''}`}>
              <input
                type="checkbox"
                checked={form.conditions_fitness}
                onChange={(e) => setField('conditions_fitness', e.target.checked)}
              />
              <span>
                J'accepte les{' '}
                <a href="/pdf/condition.pdf" target="_blank" rel="noopener noreferrer">
                  Conditions de GreenFit
                </a>
              </span>
            </label>
            {errors.conditions_fitness && <span className="insc-err">{errors.conditions_fitness}</span>}

            <div className="tarifs-modal__summary">
              <div className="tarifs-modal__summary-row tarifs-modal__summary-row--total">
                <span>Total à payer</span>
                <span>{formatChf(total)}</span>
              </div>
            </div>

            {submitError && <div className="insc-submit-error">{submitError}</div>}

            <div className="tarifs-modal__actions">
              <button
                type="button"
                className="btn btn--light"
                onClick={() => setStep('options')}
                disabled={loading}
              >
                Retour
              </button>
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? 'Redirection…' : 'Procéder au paiement'}
                {!loading && <span className="arrow"><Icon name="arrow" size={15} stroke={2} /></span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, error, hint, children }) {
  return (
    <label className={`insc-field ${error ? 'is-error' : ''}`}>
      <span className="insc-field__label">{label}</span>
      {children}
      {error ? (
        <span className="insc-err">{error}</span>
      ) : (
        hint && <span className="insc-hint">{hint}</span>
      )}
    </label>
  )
}
