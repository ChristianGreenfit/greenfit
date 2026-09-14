import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { useLanguage } from '../i18n/LanguageContext'
import { createOrder } from '../lib/api'
import './Checkout.css'

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

function validate(form, t) {
  const errors = {}
  const required = {
    member_marital1: t('civility'),
    member_lastname: t('lastName'),
    member_firstname: t('firstName'),
    member_email: t('email'),
    member_phone: t('phone'),
    member_dob: t('dob'),
    member_address: t('address'),
    member_npa: t('npa'),
    member_city: t('city'),
  }

  Object.entries(required).forEach(([key, label]) => {
    if (!form[key] || !String(form[key]).trim()) {
      errors[key] = t('required', { label })
    }
  })

  if (form.member_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.member_email)) {
    errors.member_email = t('emailInvalid')
  }

  const digits = (form.member_phone || '').replace(/\D/g, '')
  if (form.member_phone && (digits.length !== 9 || digits[0] === '0')) {
    errors.member_phone = t('phoneInvalid')
  }

  if (form.member_dob && !/^\d{2}\.\d{2}\.\d{4}$/.test(form.member_dob)) {
    errors.member_dob = t('dobInvalid')
  }

  if (!form.conditions_fitness) {
    errors.conditions_fitness = t('conditionsRequired')
  }

  return errors
}

export default function Checkout() {
  const [params] = useSearchParams()
  const months = Number(params.get('plan'))
  const { content } = useLocalizedContent()
  const { t, home } = useLanguage()
  const { plans, addons } = content.tarifs

  const plan = useMemo(
    () => plans.find((p) => p.months === months) ?? null,
    [plans, months]
  )

  const [selectedAddons, setSelectedAddons] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!plan) {
    return <Navigate to={home} replace />
  }

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
    const found = validate(form, t)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById('checkout-infos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

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
        t('checkoutError'),
    )
  }

  return (
    <>
      <Navbar />
      <main className="checkout">
        <div className="container checkout__wrap">
          <Link to={`${home}#tarifs`} className="checkout__back">
            <Icon name="arrow" size={16} stroke={2} />
            {t('checkoutBack')}
          </Link>

          <header className="checkout__header">
            <span className="eyebrow">{t('checkoutEyebrow')}</span>
            <h1>{t('checkoutTitle')}</h1>
            <p>
              {t('checkoutPlan', { name: plan.name, price: plan.price })}
            </p>
          </header>

          <form className="checkout__layout" onSubmit={handleSubmit} noValidate>
            <div className="checkout__main">
              <section className="checkout__block" aria-labelledby="checkout-options-title">
                <h2 id="checkout-options-title">{t('checkoutOptions')}</h2>
                <p className="checkout__block-lead">
                  {t('checkoutOptionsLead')}
                </p>
                <ul className="checkout__options">
                  {addons.map((addon) => {
                    const checked = selectedAddons.includes(addon.id)
                    return (
                      <li key={addon.id}>
                        <label className={`checkout__option ${checked ? 'is-checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddon(addon.id)}
                          />
                          <span className="checkout__option-box" aria-hidden="true">
                            {checked && <Icon name="check" size={14} stroke={2.5} />}
                          </span>
                          <span className="checkout__option-text">{addon.label}</span>
                          <span className="checkout__option-price">{formatChf(addon.price)}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section
                className="checkout__block"
                id="checkout-infos"
                aria-labelledby="checkout-infos-title"
              >
                <h2 id="checkout-infos-title">{t('checkoutInfos')}</h2>
                <p className="checkout__block-lead">
                  {t('checkoutInfosLead')}
                </p>

                <div className="checkout__form">
                  <div className="checkout__marital">
                    <label
                      className={`checkout__radio ${form.member_marital1 === 'Monsieur' ? 'is-on' : ''}`}
                    >
                      <input
                        type="radio"
                        name="marital"
                        checked={form.member_marital1 === 'Monsieur'}
                        onChange={() => setField('member_marital1', 'Monsieur')}
                      />
                      M.
                    </label>
                    <label
                      className={`checkout__radio ${form.member_marital1 === 'Madame' ? 'is-on' : ''}`}
                    >
                      <input
                        type="radio"
                        name="marital"
                        checked={form.member_marital1 === 'Madame'}
                        onChange={() => setField('member_marital1', 'Madame')}
                      />
                      Mme
                    </label>
                  </div>
                  {errors.member_marital1 && (
                    <span className="checkout__err">{errors.member_marital1}</span>
                  )}

                  <div className="checkout__grid">
                    <Field label={t('firstName')} error={errors.member_firstname}>
                      <input
                        value={form.member_firstname}
                        onChange={(e) => setField('member_firstname', e.target.value)}
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field label={t('lastName')} error={errors.member_lastname}>
                      <input
                        value={form.member_lastname}
                        onChange={(e) => setField('member_lastname', e.target.value)}
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <div className="checkout__grid">
                    <Field label={t('email')} error={errors.member_email}>
                      <input
                        type="email"
                        value={form.member_email}
                        onChange={(e) => setField('member_email', e.target.value)}
                        autoComplete="email"
                      />
                    </Field>
                    <Field
                      label={t('phone')}
                      error={errors.member_phone}
                      hint={t('phoneHint')}
                    >
                      <input
                        value={form.member_phone}
                        onChange={(e) => setField('member_phone', e.target.value)}
                        placeholder="79 123 45 67"
                        autoComplete="tel"
                      />
                    </Field>
                  </div>

                  <Field label={t('dob')} error={errors.member_dob} hint={t('dobHint')}>
                    <input
                      value={form.member_dob}
                      onChange={(e) => setField('member_dob', e.target.value)}
                      placeholder="01.01.1990"
                    />
                  </Field>

                  <Field label={t('address')} error={errors.member_address}>
                    <input
                      value={form.member_address}
                      onChange={(e) => setField('member_address', e.target.value)}
                      autoComplete="street-address"
                    />
                  </Field>

                  <div className="checkout__grid">
                    <Field label={t('npa')} error={errors.member_npa}>
                      <input
                        value={form.member_npa}
                        onChange={(e) => setField('member_npa', e.target.value)}
                        autoComplete="postal-code"
                      />
                    </Field>
                    <Field label={t('city')} error={errors.member_city}>
                      <input
                        value={form.member_city}
                        onChange={(e) => setField('member_city', e.target.value)}
                        autoComplete="address-level2"
                      />
                    </Field>
                  </div>

                  <label
                    className={`checkout__conditions ${errors.conditions_fitness ? 'is-error' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.conditions_fitness}
                      onChange={(e) => setField('conditions_fitness', e.target.checked)}
                    />
                    <span>
                      {t('conditionsAccept')}{' '}
                      <a href="/pdf/condition.pdf" target="_blank" rel="noopener noreferrer">
                        {t('conditionsLink')}
                      </a>
                    </span>
                  </label>
                  {errors.conditions_fitness && (
                    <span className="checkout__err">{errors.conditions_fitness}</span>
                  )}
                </div>
              </section>
            </div>

            <aside className="checkout__aside">
              <div className="checkout__summary">
                <h2>{t('summary')}</h2>
                <div className="checkout__summary-row">
                  <span>{t('subscription', { name: plan.name })}</span>
                  <span>{formatChf(plan.price)}</span>
                </div>
                {selectedAddons.map((id) => {
                  const addon = addons.find((a) => a.id === id)
                  if (!addon) return null
                  return (
                    <div className="checkout__summary-row" key={id}>
                      <span>{addon.label}</span>
                      <span>{formatChf(addon.price)}</span>
                    </div>
                  )
                })}
                <div className="checkout__summary-row checkout__summary-row--total">
                  <span>{t('total')}</span>
                  <span>{formatChf(total)}</span>
                </div>

                <p className="checkout__summary-note">
                  {t('checkoutNote')}
                </p>

                {submitError && <div className="checkout__submit-error">{submitError}</div>}

                <button type="submit" className="btn btn--primary checkout__pay" disabled={loading}>
                  {loading ? t('redirecting') : t('pay')}
                  {!loading && (
                    <span className="arrow">
                      <Icon name="arrow" size={15} stroke={2} />
                    </span>
                  )}
                </button>
              </div>
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Field({ label, error, hint, children }) {
  return (
    <label className={`checkout__field ${error ? 'is-error' : ''}`}>
      <span className="checkout__field-label">{label}</span>
      {children}
      {error ? (
        <span className="checkout__err">{error}</span>
      ) : (
        hint && <span className="checkout__hint">{hint}</span>
      )}
    </label>
  )
}
