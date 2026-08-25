import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginAdmin } from './adminAuth'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginAdmin(password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__brand">
          <img src="/logo-mark.png" alt="" width={56} height={56} />
          <h1>Espace GreenFit</h1>
          <p>Connectez-vous pour modifier le contenu du site.</p>
        </div>

        <label className="admin-login__field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            autoFocus
          />
        </label>

        {error && <div className="admin-login__error">{error}</div>}

        <button type="submit" className="admin__btn admin__btn--primary admin-login__submit" disabled={loading}>
          {loading ? 'Connexion…' : 'Entrer'}
        </button>

        <Link to="/" className="admin-login__back">
          ← Retour au site
        </Link>
      </form>
    </div>
  )
}
