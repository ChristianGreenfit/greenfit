import { useContent } from '../context/ContentContext'
import './Centre.css'

export default function Centre() {
  const { content } = useContent()
  const { centre } = content
  const titleLines = centre.title.split('\n')

  return (
    <section className="centre" id="centre">
      <div className="container centre__layout">
        <div className="centre__content">
          <span className="centre__label reveal">{centre.label}</span>

          <h2 className="centre__title reveal">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p className="centre__lead reveal">{centre.lead}</p>

          <ul className="centre__features reveal">
            {centre.features.map((f) => (
              <li key={f.title}>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="centre__metrics reveal">
            {centre.metrics.map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="centre__hero reveal">
          <img src={centre.photos[0].src} alt={centre.photos[0].alt} loading="lazy" />
        </div>
      </div>

      <div className="centre__strip">
        <div className="centre__strip-track">
          {centre.photos.slice(1).map((photo) => (
            <figure className="centre__strip-item reveal" key={photo.alt}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
