import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import './Resultat.css'

const MESSAGES = {
  success: {
    icon: 'check',
    tone: 'success',
    title: 'Paiement confirmé',
    text: "Le paiement a bien été effectué, merci ! Vous allez recevoir un email de confirmation avec les prochaines étapes : venez à la réception pour récupérer votre carte d’accès. À bientôt chez GreenFit !",
  },
  fail: {
    icon: 'spark',
    tone: 'error',
    title: 'Paiement non abouti',
    text: "Malheureusement une erreur s'est produite lors du paiement. Vous pouvez réessayer ou choisir de venir régler directement au centre. Nous nous réjouissons de vous accueillir !",
  },
  error: {
    icon: 'spark',
    tone: 'error',
    title: 'Une erreur est survenue',
    text: "Malheureusement une erreur s'est produite lors du paiement. Vous pouvez réessayer ou choisir de venir régler directement au centre. Nous nous réjouissons de vous accueillir !",
  },
}

export default function Resultat() {
  const [params] = useSearchParams()
  const state = params.get('state') || 'error'
  const message = MESSAGES[state] || MESSAGES.error

  return (
    <>
      <Navbar />
      <main className="resultat">
        <div className="container resultat__inner">
          <div className={`resultat__card resultat__card--${message.tone}`}>
            <div className="resultat__icon">
              <Icon name={message.icon} size={32} stroke={2} />
            </div>
            <h1>{message.title}</h1>
            <p>{message.text}</p>
            <div className="resultat__actions">
              <Link to="/" className="btn btn--dark">Retour à l'accueil</Link>
              {message.tone === 'error' && (
                <Link to="/#tarifs" className="btn btn--primary">Réessayer</Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
