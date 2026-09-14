import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import { LanguageProvider } from './i18n/LanguageContext'
import PublicSite from './pages/PublicSite'
import Checkout from './pages/Checkout'
import Resultat from './pages/Resultat'
import AdminDashboard from './admin/AdminDashboard'

function RedirectWithSearch({ to }) {
  const { search, hash } = useLocation()
  return <Navigate to={`${to}${search}${hash}`} replace />
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<RedirectWithSearch to="/fr" />} />
            <Route path="/fr" element={<PublicSite key="fr" />} />
            <Route path="/de" element={<PublicSite key="de" />} />
            <Route path="/checkout" element={<RedirectWithSearch to="/fr/checkout" />} />
            <Route path="/fr/checkout" element={<Checkout />} />
            <Route path="/de/checkout" element={<Checkout />} />
            <Route path="/resultat" element={<RedirectWithSearch to="/fr/resultat" />} />
            <Route path="/fr/resultat" element={<Resultat />} />
            <Route path="/de/resultat" element={<Resultat />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </ContentProvider>
  )
}
