// What: Contact section (#contact) — email/mailing address and social icon links.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: the Amazon follow icon is Amazon's smile-arrow mark (path lifted from the simple-icons "amazon" glyph), matching the Buy button in BookModal.jsx.
import { trackEvent } from '../analytics'

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
      className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 px-[clamp(16px,4vw,32px)] pt-[clamp(28px,6vw,52px)] pb-[88px]"
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
              onClick={() => trackEvent('generate_lead', { lead_type: 'general_inquiry' })}
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
          <a
            href="https://www.amazon.com/stores/author/B001JP0Z0A/allbooks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Amazon author page"
            className="flex h-[46px] w-[46px] items-center justify-center border border-ink text-ink hover:text-ink hover:no-underline"
          >
            <svg width="18" height="18" viewBox="0 -1 20 20" fill="currentColor" aria-hidden="true">
              <g transform="translate(-164,-7319)">
                <path d="M181.251105,7332.71631 C181.644105,7332.61435 182.555105,7332.451 182.942105,7332.53614 C183.487105,7332.58465 183.815105,7332.67473 183.924105,7332.8064 C184.155105,7333.14894 183.809105,7334.3498 183.651105,7334.74084 C183.512105,7335.08536 182.861105,7336.19019 182.524105,7336.19019 C182.421105,7336.19019 182.343105,7336.11495 182.396105,7335.97437 C183.633105,7333.09449 183.080105,7333.17072 181.251105,7333.32813 C181.015105,7333.35684 180.149105,7333.53009 180.251105,7333.32813 C180.251105,7333.08954 181.012105,7332.77769 181.251105,7332.71631 M172.633105,7327.47828 C172.633105,7327.94654 172.751105,7328.32175 172.987105,7328.60291 C173.663105,7329.40876 174.897105,7328.97712 175.415105,7328.01881 C175.700105,7327.52976 175.996105,7326.57442 175.996105,7325.33594 C174.996105,7325.33594 174.678105,7325.38445 174.315105,7325.48048 C173.248105,7325.78045 172.633105,7326.44671 172.633105,7327.47828 M169.506105,7327.83864 C169.506105,7326.15169 170.414105,7324.96965 171.815105,7324.38258 C173.052105,7323.86086 174.759105,7323.7183 175.996105,7323.64405 C175.996105,7322.16104 175.793105,7320.97999 174.233105,7320.97999 C173.732105,7320.97999 172.837105,7321.53537 172.633105,7322.46101 C172.584105,7322.70059 172.463105,7322.87285 172.269105,7322.90849 L170.178105,7322.67386 C169.925105,7322.61446 169.827105,7322.47586 169.887105,7322.23628 C170.309105,7320.05039 172.145105,7319.11683 174.233105,7319.00001 C175.233105,7319.00001 176.745105,7318.98714 177.924105,7320.06227 C179.198105,7321.3245 178.996105,7322.91443 178.996105,7327.02882 C178.996105,7328.01683 179.011105,7328.11187 179.687105,7328.98999 C179.823105,7329.19195 179.835105,7329.38401 179.637105,7329.53053 C178.631105,7330.39479 178.084105,7330.86206 177.999105,7330.93433 C177.853105,7331.04224 177.676105,7331.05412 177.470105,7330.96997 C176.575105,7330.21065 176.790105,7330.25619 176.233105,7329.56617 C175.104105,7330.78385 174.217105,7331.11451 172.706105,7331.11451 C170.910105,7331.11451 169.506105,7330.00473 169.506105,7327.83864 M164.324105,7332.94995 C167.354105,7334.69035 170.651105,7335.56055 174.215105,7335.56055 C176.590105,7335.56055 178.936105,7335.12199 181.251105,7334.24585 C181.602105,7334.10725 181.972105,7333.83698 182.187105,7334.13794 C182.290105,7334.28248 182.257105,7334.41415 182.087105,7334.53394 C179.844105,7336.13772 176.718105,7337 173.996105,7337 C170.145105,7337 166.719105,7335.5853 164.106105,7333.25586 C163.873105,7333.06479 164.059105,7332.78363 164.324105,7332.94995" />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
