// What: Site footer — copyright line.
// Who calls it / when: rendered once by App.jsx as the last element.
// Gotchas: none.
function Footer() {
  return (
    <div className="border-t border-border px-8 py-7 text-center text-[13px] text-muted">
      &copy; {new Date().getFullYear()} Kevin R. C. Gutzman
    </div>
  )
}

export default Footer
