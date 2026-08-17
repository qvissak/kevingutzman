// What: Hero section (#top) — intro copy, CTAs, and headshot.
// Who calls it / when: rendered once by App.jsx as the first in-page section.
// Gotchas: none.
import headshot from '../assets/krg.jpg'
import { trackEvent } from '../analytics'

function Hero() {
  return (
    <div
      id="top"
      className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-10 px-[clamp(16px,4vw,32px)] pt-[clamp(28px,6vw,52px)] pb-16 scroll-mt-[60px]"
    >
      <div>
        <div className="mb-[18px] text-[13px] font-semibold tracking-[0.12em] text-accent uppercase">
          New York Times Best-Selling Author &middot; Historian
        </div>
        <h1 className="m-0 mb-5 font-serif text-[clamp(34px,6vw,56px)] leading-[1.05] font-semibold">
          Kevin R. C. Gutzman
        </h1>
        <p className="m-0 mb-7 max-w-[46ch] text-lg leading-[1.6] text-body-soft">
          Historian of the American founding and the U.S. Constitution.
          Professor of History at Western Connecticut State University, and
          author of six books on Jefferson, Madison, and the republic they
          built.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#books"
            className="rounded-[2px] bg-accent px-[26px] py-[13px] text-sm font-semibold tracking-[0.03em] text-card no-underline hover:text-card hover:no-underline"
          >
            Browse the Books
          </a>
          <a
            href="mailto:gutzmank@wcsu.edu?subject=Speaking%20Inquiry"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('generate_lead', { lead_type: 'speaking_inquiry' })}
            className="rounded-[2px] border border-ink px-[26px] py-[13px] text-sm font-semibold tracking-[0.03em] text-ink no-underline hover:text-ink hover:no-underline"
          >
            Inquire about Speaking
          </a>
        </div>
      </div>
      <div className="aspect-[4/5] w-full max-w-[380px]">
        <img
          src={headshot}
          alt="Portrait of Kevin R. C. Gutzman"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

export default Hero
