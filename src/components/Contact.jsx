import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Icon from './Icon'
import './Contact.css'

export default function Contact() {
  const { content } = useContent()
  const { contact } = content
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const titleParts = contact.title.split(contact.titleHighlight)

  return (
    <section className="section contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__intro reveal">
          <span className="eyebrow">{contact.eyebrow}</span>
          <h2>
            {titleParts[0]}
            <span className="gradient-text">{contact.titleHighlight}</span>
            {titleParts[1] ?? ''}
          </h2>
          <p>{contact.intro}</p>

          <div className="contact__reach">
            <a className="contact__phone" href={contact.phoneHref}>
              {contact.phone}
            </a>
            <a className="contact__email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>

          <address className="contact__addr">
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
              {contact.addressLine1}<br />
              {contact.addressLine2}
            </a>
          </address>

          <div className="contact__hours">
            <h3 className="contact__hours-title">Horaires réception</h3>
            <ul>
              {contact.receptionHours.map((slot) => (
                <li key={slot.days}>
                  <span>{slot.days}</span>
                  <span>{slot.hours}</span>
                </li>
              ))}
            </ul>
            <p>{contact.hoursNote}</p>
          </div>
        </div>

        <div className="contact__main reveal">
          {sent ? (
            <div className="contact__card contact__success">
              <div className="contact__success-ic"><Icon name="check" size={28} stroke={2} /></div>
              <h3>{contact.successTitle}</h3>
              <p>{contact.successMessage}</p>
              <button className="btn btn--dark" type="button" onClick={() => setSent(false)}>
                Nouveau message
              </button>
            </div>
          ) : (
            <form className="contact__card contact__form" onSubmit={handleSubmit}>
              <div className="contact__form-head">
                <h3>{contact.formTitle}</h3>
                <p>{contact.formSubtitle}</p>
              </div>

              <div className="contact__fields">
                <div className="contact__row">
                  <label>
                    Prénom
                    <input type="text" required placeholder="Camille" autoComplete="given-name" />
                  </label>
                  <label>
                    Nom
                    <input type="text" required placeholder="Durand" autoComplete="family-name" />
                  </label>
                </div>
                <label>
                  Email
                  <input type="email" required placeholder="camille@email.ch" autoComplete="email" />
                </label>
                <label>
                  Téléphone
                  <input type="tel" placeholder="079 123 45 67" autoComplete="tel" />
                </label>
                <label>
                  Objectif
                  <select defaultValue="">
                    <option value="" disabled>Choisir…</option>
                    <option>Perte de poids</option>
                    <option>Prise de muscle</option>
                    <option>Remise en forme</option>
                    <option>Bien-être & mobilité</option>
                  </select>
                </label>
                <label>
                  Message <span className="contact__optional">(optionnel)</span>
                  <textarea rows="3" placeholder="Une question, une disponibilité…" />
                </label>
              </div>

              <div className="contact__form-foot">
                <button type="submit" className="btn btn--primary contact__submit">
                  Envoyer <span className="arrow"><Icon name="arrow" size={15} stroke={2} /></span>
                </button>
                <small className="contact__legal">
                  En envoyant ce formulaire, vous acceptez d’être recontacté·e par GreenFit.
                </small>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
