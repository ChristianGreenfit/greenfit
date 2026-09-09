import { useContent } from '../context/ContentContext'
import './Contact.css'

export default function Contact() {
  const { content } = useContent()
  const { contact } = content

  const titleParts = contact.title.split(contact.titleHighlight)

  return (
    <section className="section contact" id="contact">
      <div className="container contact__layout">
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
              {contact.addressLine1}
              <br />
              {contact.addressLine2}
            </a>
          </address>
        </div>

        <div className="contact__hours reveal">
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
    </section>
  )
}
