// What: Thin wrapper around window.gtag for firing custom GA4 events from components.
// Who calls it / when: Books.jsx (book card click) and BookModal.jsx (video link and buy-button clicks).
// Gotchas: no-ops if gtag hasn't loaded (blocked by an ad blocker, or in dev without network access), so callers never need to guard the call themselves.
export function trackEvent(name, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}
