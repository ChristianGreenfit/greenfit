import { useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useContent } from '../context/ContentContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Centre from '../components/Centre'
// import BienEtre from '../components/BienEtre'
import Planning from '../components/Planning'
import Tarifs from '../components/Tarifs'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function PublicSite() {
  const { content } = useContent()
  useReveal()

  useEffect(() => {
    document.title = content.site.seo.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', content.site.seo.description)
  }, [content.site.seo])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Centre />
        {/* <BienEtre /> */}
        <Planning />
        <Tarifs />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
