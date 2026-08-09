// What: Articles section (#articles) — sticky header plus four cited-entry subsections.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: citations are sourced verbatim from Gutzman's CV — do not edit copy without checking the source.
const PEER_REVIEWED = [
  {
    title: '"Edmund Randolph and Virginia Constitutionalism"',
    citation: 'The Review of Politics 66 (2004)',
  },
  {
    title: '"Paul to Jeremiah: Calhoun\'s Abandonment of Nationalism"',
    citation: 'Journal of Libertarian Studies 16, no. 2 (2002)',
  },
  {
    title:
      '"Jefferson\'s Draft Declaration of Independence, Richard Bland, and the Revolutionary Legacy"',
    citation: 'The Journal of the Historical Society 1 (2001)',
  },
  {
    title: '"The Virginia and Kentucky Resolutions Reconsidered"',
    citation: 'The Journal of Southern History 66 (2000)',
  },
  {
    title:
      '"Oh, What a Tangled Web We Weave…: James Madison and the Compound Republic"',
    citation: 'Continuity: A Journal of History 22 (1998)',
  },
  {
    title:
      '"Preserving the Patrimony: William Branch Giles and Virginia versus the Federal Tariff"',
    citation: 'The Virginia Magazine of History and Biography 104 (1996)',
  },
  {
    title: '"A Troublesome Legacy: James Madison and \'The Principles of \'98\'"',
    citation: 'Journal of the Early Republic 15 (1995)',
  },
]

const BOOK_CHAPTERS = [
  {
    title: '"Thomas Jefferson\'s Virginian Revolution"',
    citation: 'in Jeffersonians in Power, University of Virginia Press (2019)',
  },
  {
    title:
      '"James Madison and the Ratification of the Constitution: A Triumph over Adversity"',
    citation:
      'in A Companion to James Madison and James Monroe, Wiley-Blackwell (2012)',
  },
  {
    title: '"Lincoln as Jeffersonian: The Colonization Chimera"',
    citation: 'in Lincoln Emancipated, Northern Illinois University Press (2007)',
  },
  {
    title: 'Foreword to Anthony Gregory, The Power of Habeas Corpus in America',
    citation: 'Cambridge University Press (2013)',
  },
]

const ADDITIONAL_SCHOLARSHIP = [
  {
    title: '"What Is Still American in the Thought of Thomas Jefferson?"',
    citation: 'Modern Age (2018)',
  },
  {
    title: '"The Jeffersonian Republicans vs. The Federalist Courts"',
    citation: 'University of St. Thomas Law Journal 14, no. 1 (2018)',
  },
  {
    title: '"Thomas Jefferson\'s Federalism, 1774–1825"',
    citation: 'Modern Age (2011)',
  },
  {
    title: 'Hillary Clinton qualifications op-ed',
    citation: 'Richmond Times-Dispatch (2016)',
  },
  {
    title: '"We Should Be Cheering the Likely End of the Senate Filibuster"',
    citation: 'Fox News Online (2017)',
  },
  {
    title: '"Lincoln, Kennedy, Obama and the Value of Compromise"',
    citation: 'The National Post (2013)',
  },
]

const BOOK_REVIEWS = [
  {
    title: 'Review of William F. Hartford, Adams and Calhoun',
    citation: 'The Journal of American History (Dec. 2024)',
  },
  {
    title: 'Review of Richard Brookhiser, Glorious Lessons',
    citation: 'Law & Liberty (2024)',
  },
  {
    title: "Review of Brook Poston, The Founders' Curse",
    citation: 'Modern Age (Summer 2024)',
  },
  {
    title: 'Review of H.W. Brands, Founding Partisans',
    citation: 'Modern Age (Fall 2022)',
  },
]

function EntryList({ entries }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-12 gap-y-1">
      {entries.map((entry) => (
        <div
          key={entry.title}
          className="border-t border-border py-[18px] last:border-b"
        >
          <h3 className="m-0 mb-1 font-serif text-[17px] font-semibold">
            {entry.title}
          </h3>
          <div className="text-[13px] text-muted">{entry.citation}</div>
        </div>
      ))}
    </div>
  )
}

function Articles() {
  return (
    <div
      id="articles"
      className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,72px)]"
    >
      <div className="sticky top-[60px] z-[5] bg-cream py-4">
        <div className="mb-2.5 text-[13px] font-semibold tracking-[0.1em] text-accent uppercase">
          Articles
        </div>
        <h2 className="m-0 font-serif text-[32px] font-semibold">
          Scholarly &amp; popular writing
        </h2>
      </div>
      <p className="m-0 mb-10 max-w-[34ch] text-sm text-muted">
        Peer-reviewed scholarship, book chapters, and commentary spanning
        three decades.
      </p>

      <div className="mb-11">
        <div className="mb-4 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
          Peer-Reviewed Articles
        </div>
        <EntryList entries={PEER_REVIEWED} />
      </div>

      <div className="mb-11">
        <div className="mb-4 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
          Book Chapters &amp; Foreword
        </div>
        <EntryList entries={BOOK_CHAPTERS} />
      </div>

      <div className="mb-11">
        <div className="mb-4 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
          Selected Additional Scholarship &amp; Commentary
        </div>
        <EntryList entries={ADDITIONAL_SCHOLARSHIP} />
      </div>

      <div>
        <div className="mb-4 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
          Scholarly Book Reviews
        </div>
        <p className="m-0 mb-4 max-w-[70ch] text-[15px] leading-[1.6] text-body-soft">
          Gutzman has written dozens of book reviews for scholarly journals
          since 1994, including The Journal of American History, The Journal
          of Southern History, The William and Mary Quarterly, and The
          Virginia Magazine of History and Biography. Recent examples:
        </p>
        <EntryList entries={BOOK_REVIEWS} />
      </div>
      <div className="h-[72px]" />
    </div>
  )
}

export default Articles
