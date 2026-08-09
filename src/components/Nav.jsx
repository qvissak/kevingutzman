// What: Sticky top navigation bar with same-page anchor links.
// Who calls it / when: rendered once by App.jsx, always visible at the top of the page.
// Gotchas: none.
const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#books', label: 'Books' },
  { href: '#field', label: 'Field of Study' },
  { href: '#articles', label: 'Articles' },
  { href: '#appearances', label: 'Appearances' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-[rgba(246,240,228,0.92)] backdrop-blur-[6px]">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-[clamp(16px,4vw,32px)] py-3.5">
        <a
          href="#top"
          className="whitespace-nowrap font-serif text-[clamp(16px,3vw,20px)] font-semibold tracking-[0.01em] text-ink no-underline hover:text-ink hover:no-underline"
        >
          Kevin R. C. Gutzman
        </a>
        <div className="flex flex-wrap justify-end gap-x-[clamp(10px,2.5vw,28px)] gap-y-2 text-[13px] font-medium tracking-[0.02em]">
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
      </div>
    </div>
  )
}

export default Nav
