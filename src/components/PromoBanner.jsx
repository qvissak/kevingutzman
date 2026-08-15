// What: Dismiss-free promo strip advertising a limited-time audiobook discount, linking out to the offer.
// Who calls it / when: rendered once by App.jsx, above Nav, on every page load.
// Gotchas: hides itself once PROMO_EXPIRES has passed — update both PROMO_EXPIRES and the copy together when a new promotion replaces this one.
import { trackEvent } from '../analytics'

const PROMO_NAME = 'jeffersonians_audiobook_60_off'
const PROMO_URL =
  'https://www.audiobooks.com/promotions/promotedBook/637352/jeffersonians-the-visionary-presidencies-of-jefferson-madison-and-monroe?refId=261178'
const PROMO_EXPIRES = new Date('2026-09-04T00:00:00')

function PromoBanner() {
  if (new Date() >= PROMO_EXPIRES) return null

  return (
    <a
      href={PROMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('select_promotion', { promotion_name: PROMO_NAME })}
      className="block bg-accent px-[clamp(16px,4vw,32px)] py-2.5 text-center text-[13px] font-medium tracking-[0.02em] text-card no-underline hover:text-card hover:underline"
    >
      Limited time: 60% off the audiobook of <em>The Jeffersonians</em> —
      ends 9/3. Get the deal &rarr;
    </a>
  )
}

export default PromoBanner
