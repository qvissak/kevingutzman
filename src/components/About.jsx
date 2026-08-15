// What: About section (#about) — bio copy and career stat tiles.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: the label column uses `position: sticky; top: 60px`, matching the nav's fixed height, so it sits flush below the nav while the bio scrolls.
const STATS = [
  { value: '6', label: 'Books published' },
  { value: '7', label: 'Peer-reviewed articles' },
  {
    value: 'BA · M.P.Aff. · JD · MA · PhD',
    label: 'University of Texas · University of Virginia',
    small: true,
  },
  { value: '500+', label: 'Media appearances' },
  { value: '27', label: 'Years of teaching experience' },
]

function About() {
  return (
    <div id="about" className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 px-[clamp(16px,4vw,32px)] py-[clamp(40px,8vw,72px)]">
        <div className="sticky top-[60px] self-start bg-card py-2 md:py-4">
          <div className="mb-1 text-[13px] font-semibold tracking-[0.1em] text-accent uppercase md:mb-2.5">
            About
          </div>
          <h2 className="m-0 font-serif text-[22px] font-semibold sm:text-[26px] md:text-[32px]">
            A career built on the founding era
          </h2>
        </div>
        <div className="text-[17px] leading-[1.75] text-body">
          <p className="m-0 mb-5">
            Kevin R. C. Gutzman is Professor of History at Western
            Connecticut State University, where he has taught since 2001 and
            served as Department Chairman from 2015 to 2017 and Director of
            Graduate Studies from 2012 to 2014. Before entering academia full
            time, he practiced law in Chicago and Roswell, New Mexico. He
            holds a PhD (1999) and MA (1994) in history from the University
            of Virginia, and a JD (1990) and Master of Public Affairs (1990)
            from the University of Texas, where he also earned his BA in
            Plan II/History Honors, Cum Laude, With Special Honors in History
            (1985).
          </p>
          <p className="m-0 mb-6">
            His scholarship centers on the constitutional and political
            history of the founding generation &mdash; particularly Thomas
            Jefferson, James Madison, and the states&rsquo; role in the early
            republic. His peer-reviewed articles have appeared in{' '}
            <em>The Review of Politics</em>, <em>The Journal of Southern History</em>,{' '}
            <em>The Journal of the Early Republic</em>,{' '}
            <em>The Virginia Magazine of History and Biography</em>, and{' '}
            <em>The Journal of the Historical Society</em>, and he has written
            dozens of scholarly book reviews and encyclopedia essays. He
            served on the editorial board of{' '}
            <em>The Virginia Magazine of History and Biography</em> from 2020
            to 2023.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-8 gap-y-6 border-t border-border pt-7">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div
                  className={
                    stat.small
                      ? 'font-serif text-[15px] leading-[1.7] font-semibold text-accent'
                      : 'font-serif text-[28px] font-semibold text-accent'
                  }
                >
                  {stat.value}
                </div>
                <div className="text-[13px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
