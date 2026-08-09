// What: Contact section (#contact) — email/mailing address and social icon links.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: none.
const SOCIALS = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/KevinGutzman',
    path: 'M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-7.3L4.2 22H1l8.2-9.3L0.8 2h7.3l5 6.7L18.9 2zm-1.2 18h2L6.4 4h-2l13.3 16z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kevin-r-c-gutzman-4138137',
    path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05C19.98 8 21 10.13 21 13.5V23h-4v-8.24c0-1.97-.04-4.5-2.75-4.5-2.75 0-3.17 2.15-3.17 4.36V23h-4V8z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/kevin.gutzman/',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z',
  },
]

function Contact() {
  return (
    <div
      id="contact"
      className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,72px)] pb-[88px]"
    >
      <div>
        <div className="mb-2.5 text-[13px] font-semibold tracking-[0.1em] text-accent uppercase">
          Contact
        </div>
        <h2 className="m-0 mb-5 font-serif text-[32px] font-semibold">
          Get in touch
        </h2>
        <p className="m-0 mb-7 max-w-[42ch] text-base leading-[1.65] text-body-soft">
          For speaking engagements, interviews, or press inquiries.
        </p>
        <div className="text-base leading-[1.9] text-ink">
          <div>
            <a
              href="mailto:gutzmank@wcsu.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
            >
              gutzmank@wcsu.edu
            </a>
          </div>
          <div className="text-body-soft">
            Department of History
            <br />
            Western Connecticut State University
            <br />
            181 White Street, Danbury, CT 06810
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <div className="mb-4 text-[13px] font-semibold tracking-[0.1em] text-muted uppercase">
          Follow
        </div>
        <div className="flex gap-3.5">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-[46px] w-[46px] items-center justify-center border border-ink text-ink hover:text-ink hover:no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Contact
