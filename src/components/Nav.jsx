// What: Sticky top navigation bar with same-page anchor links.
// Who calls it / when: rendered once by App.jsx, always visible at the top of the page.
// Gotchas: below the md breakpoint, links collapse into a hamburger-triggered dropdown instead of wrapping to multiple rows. The row is pinned to a fixed 60px height (rather than sized by padding) so every section's `top-[60px]` sticky sub-header lines up flush against it with no gap.
import { useState } from 'react'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#field', label: 'Field of Study' },
  { href: '#books', label: 'Books' },
  { href: '#articles', label: 'Articles' },
  { href: '#appearances', label: 'Appearances' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-[rgba(246,240,228,0.92)] backdrop-blur-[6px]">
      <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between gap-4 px-[clamp(16px,4vw,32px)]">
        <a
          href="#top"
          className="whitespace-nowrap font-serif text-[clamp(16px,3vw,20px)] font-semibold tracking-[0.01em] text-ink no-underline hover:text-ink hover:no-underline"
        >
          Kevin R. C. Gutzman
        </a>
        <div className="hidden flex-wrap justify-end gap-x-[clamp(10px,2.5vw,28px)] gap-y-2 text-[13px] font-medium tracking-[0.02em] md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink no-underline hover:text-ink hover:no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink md:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col border-t border-border px-[clamp(16px,4vw,32px)] text-[13px] font-medium tracking-[0.02em] md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-border py-3 text-ink no-underline last:border-b-0 hover:text-ink hover:no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default Nav
