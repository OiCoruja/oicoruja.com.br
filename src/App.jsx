import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Services from './components/Services'
import Equipe from './components/Equipe'
import Footer from './components/Footer'

// Below-fold sections with heavy third-party scripts (Instagram embed, Web3Forms)
// — split into their own chunks so they're fetched in parallel with main bundle.
const Portfolio = lazy(() => import('./components/Portfolio'))
const Contact = lazy(() => import('./components/Contact'))

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Sobre />
        <Services />
        <Suspense fallback={null}>
          <Portfolio />
        </Suspense>
        <Equipe />
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
