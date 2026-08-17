// What: Root layout for the single-page site — composes every in-page section in scroll order.
// Who calls it / when: rendered once by main.jsx at app startup.
// Gotchas: navigation is same-page anchor scrolling only; no router is involved.
import PromoBanner from './components/PromoBanner'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Fellowship from './components/Fellowship'
import About from './components/About'
import FieldOfStudy from './components/FieldOfStudy'
import Books from './components/Books'
import Articles from './components/Articles'
import Appearances from './components/Appearances'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <PromoBanner />
      <Nav />
      <Hero />
      <Fellowship />
      <About />
      <FieldOfStudy />
      <Books />
      <Articles />
      <Appearances />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
