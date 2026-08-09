// What: Books section (#books) — dark sticky header plus the 6-book grid.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: cover art and purchase links are pulled from Kevin's own Amazon affiliate links — update both together if a book's edition changes.
import coverPICG from '../assets/books/politically-incorrect-guide.jpg'
import coverVirginia from '../assets/books/virginia-american-revolution.jpg'
import coverWhoKilled from '../assets/books/who-killed-the-constitution.jpg'
import coverMadison from '../assets/books/james-madison.jpg'
import coverTJ from '../assets/books/thomas-jefferson-revolutionary.jpg'
import coverJeffersonians from '../assets/books/jeffersonians.jpg'

const BOOKS = [
  {
    title: 'The Jeffersonians',
    meta: "2022 · St. Martin's Press · History Book Club Main Selection, Jan 2023",
    description:
      'The visionary presidencies of Jefferson, Madison, and Monroe.',
    cover: coverJeffersonians,
    href: 'https://amzn.to/3UB6wxT',
    accolade: '★ Starred Review, Kirkus',
  },
  {
    title: 'Thomas Jefferson—Revolutionary',
    meta: "2017 · St. Martin's Press · History, Science & Military Book Club Selection",
    description: "A radical's struggle to remake America.",
    cover: coverTJ,
    href: 'http://amzn.to/2nPGeJx',
  },
  {
    title: 'James Madison and the Making of America',
    meta: "2012 · St. Martin's Press · History Book Club & Freedom Book Club Main Selection",
    description:
      'A complex, sometimes contradictory portrait beyond “Father of the Constitution.”',
    cover: coverMadison,
    href: 'https://www.amazon.com/gp/product/125002319X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=125002319X&linkCode=as2&tag=kevingutcom-20&linkId=b01448a9384875126ecad5e0489134ba',
    accolade: 'Praised by WSJ',
  },
  {
    title: 'Who Killed the Constitution?',
    meta: '2008 · Crown Forum · with Thomas E. Woods, Jr.',
    description:
      "The federal government's expansion at the expense of American liberty, from World War I onward.",
    cover: coverWhoKilled,
    href: 'https://www.amazon.com/gp/product/0307405761/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0307405761&linkCode=as2&tag=kevingutcom-20&linkId=042aa0a86d0173c0de989234d13f539c',
  },
  {
    title: "Virginia's American Revolution: From Dominion to Republic, 1776–1840",
    meta: '2007 · Lexington Books',
    description:
      "What the Revolutionaries made of the Revolution in Jefferson's home state.",
    cover: coverVirginia,
    href: 'https://www.amazon.com/gp/product/0739121324/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0739121324&linkCode=as2&tag=kevingutcom-20&linkId=9b478edffb2f04dbe7bd4d950afc21e8',
  },
  {
    title: 'The Politically Incorrect Guide to the Constitution',
    meta: '2007 · Regnery · NYT Bestseller',
    description:
      'His debut book and the only Jeffersonian account of American constitutional history in print.',
    cover: coverPICG,
    href: 'https://www.amazon.com/gp/product/1596985054/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1596985054&linkCode=as2&tag=kevingutcom-20&linkId=333904ebbb8d9203917195c6dbb55d3f',
  },
]

function Books() {
  return (
    <div id="books" className="bg-ink py-[72px]">
      <div className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)]">
        <div className="sticky top-[76px] z-[5] bg-ink py-4">
          <div className="mb-2.5 text-[13px] font-semibold tracking-[0.1em] text-gold uppercase">
            Books
          </div>
          <h2 className="m-0 font-serif text-[32px] font-semibold text-cream">
            Six books, one throughline
          </h2>
        </div>
        <p className="m-0 mb-10 max-w-[32ch] text-sm text-muted-on-dark">
          From his first New York Times bestseller in 2007 to his latest
          study of the Jeffersonian presidencies.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-8 gap-y-10">
          {BOOKS.map((book) => (
            <a
              key={book.title}
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3.5 text-inherit no-underline hover:text-inherit hover:no-underline"
            >
              <div className="relative w-full">
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="aspect-[2/3] w-full border border-border-on-dark object-cover"
                />
                {book.accolade && (
                  <div className="pointer-events-none absolute top-2.5 left-2.5 bg-ink px-[9px] py-1 text-[10px] font-semibold tracking-[0.03em] text-gold">
                    {book.accolade}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold text-gold">
                  {book.meta}
                </div>
                <h3 className="m-0 mb-1.5 font-serif text-base leading-[1.3] font-semibold text-cream">
                  {book.title}
                </h3>
                <p className="m-0 text-[13px] leading-[1.5] text-muted-on-dark">
                  {book.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Books
