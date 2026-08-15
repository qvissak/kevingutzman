// What: Overlay showing a book's videos, full description, reviews, and accolades, with a buy-on-Amazon CTA.
// Who calls it / when: rendered by Books.jsx when a book card is clicked; closes on backdrop click, the close button, or Escape.
// Gotchas: locks page scroll while open and restores it on close — the Escape listener and scroll lock are DOM-coupled effects local to this component, not domain state. The Buy button sits in a footer outside the scrollable content div so it stays on screen regardless of scroll position. A `longDescription` entry may be a string (paragraph) or an array of strings (rendered as a bullet list); a review's `quote` may contain "\n\n" for multi-paragraph reviews (rendered via whitespace-pre-line) and may carry an optional `title`. The Buy button's icon is Amazon's smile-arrow mark (path lifted from the simple-icons "amazon" glyph) — used only as a recognizable "leads to Amazon" affiliate cue. A video entry renders as a real `<iframe>` when it has `embedUrl`, otherwise as a "watch" link card — most providers (e.g. C-SPAN) block automated fetches behind a paywall, so their embed URLs can't be verified programmatically and must be supplied by hand. Fades in on mount and fades out on close: `handleClose` flips `isVisible` off, then waits out the CSS transition duration (200ms) before calling the real `onClose` that unmounts this component — the parent's conditional render has no exit-animation hook of its own, so the delay has to live here.
import { useEffect, useState } from 'react'
import { trackEvent } from '../analytics'

const TRANSITION_MS = 200

function BookModal({ book, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, TRANSITION_MS)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const paragraphs = book.longDescription ?? [book.description]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={book.title}
      onClick={handleClose}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(33,26,20,0.7)] transition-opacity duration-200 sm:p-6 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`relative flex h-full w-full flex-col bg-card transition-opacity duration-200 sm:h-auto sm:max-h-[85vh] sm:max-w-[720px] sm:border sm:border-border ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center bg-card text-ink"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="mb-6 flex gap-5">
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              className="aspect-[2/3] w-[90px] shrink-0 border border-border object-cover"
            />
            <div className="pr-10">
              <div className="mb-1 text-[11px] font-semibold text-accent">
                {book.meta}
              </div>
              <h3 className="m-0 font-serif text-xl leading-[1.25] font-semibold text-ink">
                {book.title}
              </h3>
              {book.subtitle && (
                <div className="mt-1 font-serif text-[15px] leading-[1.3] text-body-soft italic">
                  {book.subtitle}
                </div>
              )}
            </div>
          </div>

          {book.videos && (
            <div className="mb-6">
              <div className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                Videos
              </div>
              <div className="flex flex-col gap-3">
                {book.videos.map((video) =>
                  video.embedUrl ? (
                    <div
                      key={video.url}
                      className="aspect-video w-full border border-border"
                    >
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      key={video.url}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent('select_content', {
                          content_type: 'video',
                          item_name: video.title,
                          book_title: book.title,
                        })
                      }
                      className="flex items-center gap-3 border border-border p-3 text-ink no-underline hover:text-ink hover:no-underline"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-card">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      <span className="text-[14px] font-semibold">
                        {video.title}
                      </span>
                    </a>
                  ),
                )}
              </div>
            </div>
          )}

          {paragraphs.map((paragraph, index) =>
            Array.isArray(paragraph) ? (
              <ul
                key={index}
                className="m-0 mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.6] text-body last:mb-6"
              >
                {paragraph.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            ) : (
              <p
                key={index}
                className="m-0 mb-4 text-[15px] leading-[1.65] text-body last:mb-6"
              >
                {paragraph}
              </p>
            ),
          )}

          {book.reviews && (
            <div className="mb-6">
              <div className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                Reviews
              </div>
              {book.reviews.map((review) => (
                <blockquote
                  key={review.source}
                  className="m-0 mb-4 border-l-2 border-accent pl-4 text-[15px] leading-[1.6] text-body italic whitespace-pre-line last:mb-0"
                >
                  {review.title && (
                    <div className="mb-1 font-semibold not-italic">
                      {review.title}
                    </div>
                  )}
                  &ldquo;{review.quote}&rdquo;
                  <footer className="mt-2 text-[13px] font-semibold text-muted not-italic">
                    &mdash; {review.source}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}

          {book.accolades && (
            <div className="mb-6">
              <div className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                Accolades
              </div>
              <ul className="m-0 list-none p-0">
                {book.accolades.map((accolade) => (
                  <li
                    key={accolade}
                    className="mb-2 border-t border-border pt-2 text-[14px] leading-[1.5] text-body last:mb-0"
                  >
                    {accolade}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card p-4 sm:p-6">
          <a
            href={book.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('select_content', {
                content_type: 'buy_link',
                item_name: book.title,
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e7ac0a] bg-[#f7ca00] px-6 py-3 text-[15px] font-bold text-[#0f1111] no-underline hover:bg-[#f4be0e] hover:text-[#0f1111] hover:no-underline active:bg-[#e2ab00]"
          >
            <svg width="20" height="20" viewBox="0 -1 20 20" fill="currentColor" aria-hidden="true">
              <g transform="translate(-164,-7319)">
                <path d="M181.251105,7332.71631 C181.644105,7332.61435 182.555105,7332.451 182.942105,7332.53614 C183.487105,7332.58465 183.815105,7332.67473 183.924105,7332.8064 C184.155105,7333.14894 183.809105,7334.3498 183.651105,7334.74084 C183.512105,7335.08536 182.861105,7336.19019 182.524105,7336.19019 C182.421105,7336.19019 182.343105,7336.11495 182.396105,7335.97437 C183.633105,7333.09449 183.080105,7333.17072 181.251105,7333.32813 C181.015105,7333.35684 180.149105,7333.53009 180.251105,7333.32813 C180.251105,7333.08954 181.012105,7332.77769 181.251105,7332.71631 M172.633105,7327.47828 C172.633105,7327.94654 172.751105,7328.32175 172.987105,7328.60291 C173.663105,7329.40876 174.897105,7328.97712 175.415105,7328.01881 C175.700105,7327.52976 175.996105,7326.57442 175.996105,7325.33594 C174.996105,7325.33594 174.678105,7325.38445 174.315105,7325.48048 C173.248105,7325.78045 172.633105,7326.44671 172.633105,7327.47828 M169.506105,7327.83864 C169.506105,7326.15169 170.414105,7324.96965 171.815105,7324.38258 C173.052105,7323.86086 174.759105,7323.7183 175.996105,7323.64405 C175.996105,7322.16104 175.793105,7320.97999 174.233105,7320.97999 C173.732105,7320.97999 172.837105,7321.53537 172.633105,7322.46101 C172.584105,7322.70059 172.463105,7322.87285 172.269105,7322.90849 L170.178105,7322.67386 C169.925105,7322.61446 169.827105,7322.47586 169.887105,7322.23628 C170.309105,7320.05039 172.145105,7319.11683 174.233105,7319.00001 C175.233105,7319.00001 176.745105,7318.98714 177.924105,7320.06227 C179.198105,7321.3245 178.996105,7322.91443 178.996105,7327.02882 C178.996105,7328.01683 179.011105,7328.11187 179.687105,7328.98999 C179.823105,7329.19195 179.835105,7329.38401 179.637105,7329.53053 C178.631105,7330.39479 178.084105,7330.86206 177.999105,7330.93433 C177.853105,7331.04224 177.676105,7331.05412 177.470105,7330.96997 C176.575105,7330.21065 176.790105,7330.25619 176.233105,7329.56617 C175.104105,7330.78385 174.217105,7331.11451 172.706105,7331.11451 C170.910105,7331.11451 169.506105,7330.00473 169.506105,7327.83864 M164.324105,7332.94995 C167.354105,7334.69035 170.651105,7335.56055 174.215105,7335.56055 C176.590105,7335.56055 178.936105,7335.12199 181.251105,7334.24585 C181.602105,7334.10725 181.972105,7333.83698 182.187105,7334.13794 C182.290105,7334.28248 182.257105,7334.41415 182.087105,7334.53394 C179.844105,7336.13772 176.718105,7337 173.996105,7337 C170.145105,7337 166.719105,7335.5853 164.106105,7333.25586 C163.873105,7333.06479 164.059105,7332.78363 164.324105,7332.94995" />
              </g>
            </svg>
            Buy on Amazon
          </a>
        </div>
      </div>
    </div>
  )
}

export default BookModal
