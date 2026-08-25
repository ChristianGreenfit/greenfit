import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import PublicSite from './pages/PublicSite'
import Checkout from './pages/Checkout'
import Resultat from './pages/Resultat'
import AdminDashboard from './admin/AdminDashboard'

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/resultat" element={<Resultat />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  )
}
