import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Faq.css'

export default function Faq() {
  const { content } = useContent()
  const { faq } = content
  const [open, setOpen] = useState(-1)

  const titleParts = faq.title.split(faq.titleHighlight)

  return (
    <section className="section faq" id="faq">
      <div className="container faq__grid">
        <div className="faq__intro reveal">
          <span className="eyebrow">{faq.eyebrow}</span>
          <h2>
            {titleParts[0]}
            <span className="gradient-text">{faq.titleHighlight}</span>
            {titleParts[1] ?? ''}
          </h2>
          <p>{faq.intro}</p>
          <a href="#contact" className="btn btn--dark">{faq.cta}</a>
        </div>

        <div className="faq__list">
          {faq.items.map((item, i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={item.q}>
              <button
                className="faq__q"
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__a">
                <div className="faq__a-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
