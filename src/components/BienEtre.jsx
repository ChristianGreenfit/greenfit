import { useContent } from '../context/ContentContext'
import './BienEtre.css'

export default function BienEtre() {
  const { content } = useContent()
  const { bienEtre } = content

  return (
    <section className="bienetre" id="bien-etre">
      <div className="container">
        <div className="bienetre__head reveal">
          <div className="bienetre__intro">
            <span className="bienetre__label">{bienEtre.label}</span>
            <h2 className="bienetre__title">{bienEtre.title}</h2>
            <p className="bienetre__lead">{bienEtre.lead}</p>
          </div>
          <a href="#contact" className="btn btn--light bienetre__cta">{bienEtre.cta}</a>
        </div>

        <div className="bienetre__grid">
          {bienEtre.offers.map((item) => (
            <article className="bienetre__card reveal" key={item.title}>
              <figure className="bienetre__card-media">
                <img src={item.src} alt={item.alt} loading="lazy" />
              </figure>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
