// What: Field of Study section (#field) — sticky intro header plus a 3-card topic grid.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: the trailing spacer div lets the sticky header release cleanly at the section boundary instead of overlapping the next section.
const TOPICS = [
  {
    title: 'Constitutional History',
    description:
      'The original meaning of the Constitution and how federal power has expanded beyond it, from ratification through the modern era.',
  },
  {
    title: 'Jefferson & Madison',
    description:
      'Biographical and political studies of the two Virginians whose partnership shaped the republic, from the Declaration through the presidency.',
  },
  {
    title: "States' Rights & the Union",
    description:
      "Nullification, secession, and the Virginia and Kentucky Resolutions, from Calhoun's political thought through the Civil War era.",
  },
]

function FieldOfStudy() {
  return (
    <div
      id="field"
      className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,72px)]"
    >
      <div className="sticky top-[60px] z-[5] mx-auto bg-cream pt-2 pb-2 text-center md:pt-4 md:pb-4">
        <div className="mb-1 text-[13px] font-semibold tracking-[0.1em] text-accent uppercase md:mb-2.5">
          Field of Study
        </div>
        <h2 className="m-0 font-serif text-[22px] font-semibold sm:text-[26px] md:text-[32px]">
          The Constitution and the Jeffersonian founders
        </h2>
      </div>
      <p className="mx-auto mb-12 max-w-[640px] text-center text-base leading-[1.65] text-body-soft">
        Gutzman&rsquo;s work returns again and again to one question: what did
        the founding generation actually believe about the Constitution, the
        states, and liberty &mdash; and how does that differ from how we
        remember it today?
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="border border-border bg-card p-7">
            <h3 className="m-0 mb-2.5 font-serif text-[19px] font-semibold">
              {topic.title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-body-soft">
              {topic.description}
            </p>
          </div>
        ))}
      </div>
      <div className="h-[72px]" />
    </div>
  )
}

export default FieldOfStudy
