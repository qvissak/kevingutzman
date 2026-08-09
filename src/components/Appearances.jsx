// What: Appearances section (#appearances) — outlet tiles, tag row, addresses, and documentary credits.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: none.
const OUTLETS = ['CNN', 'Fox News', 'C-SPAN', 'NPR', 'BBC']

const OUTLET_TAGS = [
  'The National Post',
  'The New York Times',
  'The Washington Post Online',
  'WGN',
  'The John Gambling Show',
  'The Michael Medved Show',
  'The Gordon Liddy Show',
  'The Rubin Report',
  'The Tom Woods Show',
]

const ADDRESSES = [
  {
    title: 'Hazel and Fulton Chauncey Lecture',
    venue: 'Virginia Museum of History and Culture, 2023',
  },
  {
    title: 'Speech on The Jeffersonians',
    venue: 'National Archives, 2022',
  },
  {
    title: 'Kartch/Jefferson Lecture',
    venue: 'William Paterson University, 2018',
  },
  {
    title: 'Constitution Day Keynote Speaker',
    venue: 'The Citadel, 2015',
  },
]

const DOCUMENTARIES = [
  'Safeguard: An Electoral College Story (2020)',
  'Nullification: The Rightful Remedy (2012)',
  'John Marshall: Citizen, Statesman, Jurist (2004)',
]

function Appearances() {
  return (
    <div id="appearances" className="border-y border-border bg-card">
      <div className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,72px)]">
        <div className="sticky top-[60px] z-[5] mx-auto mb-12 bg-card pt-4 pb-6 text-center">
          <div className="mb-2.5 text-[13px] font-semibold tracking-[0.1em] text-accent uppercase">
            Appearances
          </div>
          <h2 className="m-0 mb-4 font-serif text-[32px] font-semibold">
            Hundreds of programs, national and local
          </h2>
          <p className="mx-auto max-w-[640px] text-base leading-[1.65] text-body-soft">
            Gutzman has appeared in over 500 media outlets in Canada, the UK,
            and the USA, and been interviewed by reporters from the AP, The
            Washington Post, and The New York Times, among others.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-4">
          {OUTLETS.map((outlet) => (
            <div
              key={outlet}
              className="border border-border px-2 py-5 text-center"
            >
              <div className="font-serif text-[15px] font-semibold">
                {outlet}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap gap-2.5 text-[13px] text-muted">
          {OUTLET_TAGS.map((tag) => (
            <div key={tag} className="border border-border px-3.5 py-2">
              {tag}
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="mb-3.5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Selected Invited Addresses
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-12 gap-y-1">
            {ADDRESSES.map((address) => (
              <div
                key={address.title}
                className="border-t border-border py-4 last:border-b"
              >
                <h3 className="m-0 mb-1 font-serif text-base font-semibold">
                  {address.title}
                </h3>
                <div className="text-[13px] text-muted">{address.venue}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
            Documentary Features
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-body">
            {DOCUMENTARIES.map((doc) => (
              <div key={doc} className="border border-border px-4 py-2.5">
                {doc}
              </div>
            ))}
          </div>
        </div>
        <div className="h-[72px]" />
      </div>
    </div>
  )
}

export default Appearances
