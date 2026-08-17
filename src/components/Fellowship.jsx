// What: Time-boxed announcement card for the AIER Summer 2026 Visiting Research Fellowship.
// Who calls it / when: rendered once by App.jsx, between Hero and About.
// Gotchas: hides itself once FELLOWSHIP_EXPIRES has passed — remove this component (and fold the
// credential into About.jsx's bio/stats) once the fellowship is over.
import fellowshipPhoto from '../assets/aier-fellowship.jpg'
import { trackEvent } from '../analytics'

const FELLOWSHIP_EXPIRES = new Date('2026-08-29T00:00:00')

function Fellowship() {
  if (new Date() >= FELLOWSHIP_EXPIRES) return null

  return (
    <div className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)] pb-16">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] items-center gap-6 border border-border bg-card p-7">
        <img
          src={fellowshipPhoto}
          alt="AIER campus — Visiting Research Fellow, Summer '26"
          className="aspect-square w-full max-w-[200px] object-cover"
        />
        <div>
          <p className="m-0 mb-2 font-serif text-lg leading-[1.5]">
            Kevin has been named a Visiting Research Fellow at the American
            Institute for Economic Research for Summer 2026.
          </p>
          <a
            href="https://aier.org/visiting-research-fellowships/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('select_content', { content_type: 'aier_fellowship' })}
            className="text-[13px] font-semibold tracking-[0.02em] text-accent no-underline hover:text-accent hover:underline"
          >
            Learn more about the program &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}

export default Fellowship
