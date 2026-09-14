import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import './Resultat.css'

export default function Resultat() {
  const [params] = useSearchParams()
  const { t, home } = useLanguage()
  const state = params.get('state') || 'error'
  const messages = {
    success: {
      icon: 'check',
      tone: 'success',
      title: t('payOkTitle'),
      text: t('payOkText'),
    },
    fail: {
      icon: 'spark',
      tone: 'error',
      title: t('payFailTitle'),
      text: t('payFailText'),
    },
    error: {
      icon: 'spark',
      tone: 'error',
      title: t('payErrTitle'),
      text: t('payFailText'),
    },
  }
  const message = messages[state] || messages.error

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
              <Link to={home} className="btn btn--dark">{t('backHome')}</Link>
              {message.tone === 'error' && (
                <Link to={`${home}#tarifs`} className="btn btn--primary">{t('retry')}</Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
