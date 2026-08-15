// What: Books section (#books) — dark sticky header plus the 6-book grid; clicking a card opens BookModal for full detail.
// Who calls it / when: rendered once by App.jsx.
// Gotchas: cover art and purchase links are pulled from Kevin's own Amazon affiliate links — update both together if a book's edition changes. All six books carry full longDescription/reviews content for BookModal.
import { useState } from 'react'
import coverPICG from '../assets/books/politically-incorrect-guide.jpg'
import coverVirginia from '../assets/books/virginia-american-revolution.jpg'
import coverWhoKilled from '../assets/books/who-killed-the-constitution.jpg'
import coverMadison from '../assets/books/james-madison.jpg'
import coverTJ from '../assets/books/thomas-jefferson-revolutionary.jpg'
import coverJeffersonians from '../assets/books/jeffersonians.jpg'
import BookModal from './BookModal'
import { trackEvent } from '../analytics'

const BOOKS = [
  {
    title: 'The Jeffersonians',
    subtitle: 'The Visionary Presidencies of Jefferson, Madison, and Monroe',
    meta: "2022 · St. Martin's Press · History Book Club Main Selection, Jan 2023",
    description:
      'The visionary presidencies of Jefferson, Madison, and Monroe.',
    videos: [
      {
        title: 'Revolution 250 Jeffersonians Interview',
        url: 'https://www.youtube.com/watch?v=pBf8xpTBIsE',
        embedUrl: 'https://www.youtube.com/embed/pBf8xpTBIsE',
      },
      {
        title: "Newt's World Jeffersonians Interview",
        url: 'https://gingrich360.com/2022/12/17/newts-world-episode-495-the-virginia-dynasty-jefferson-madison-and-monroe/',
      },
    ],
    longDescription: [
      'A lively and essential chronicle of the only consecutive trio of two-term presidencies of the same political party in American history, from the bestselling author of Thomas Jefferson - Revolutionary and James Madison.',
      'Before the consecutive two-term administrations of Presidents Bill Clinton, George W. Bush, and Barack Obama, there had only been one other trio of its type: Thomas Jefferson, James Madison, and James Monroe.',
      'Kevin R. C. Gutzman’s The Jeffersonians is a complete chronicle of the men, known as The Virginia Dynasty, who served as president from 1801 to 1825 and implemented the foreign policy, domestic, and constitutional agenda of the radical wing of the American Revolution, setting guideposts for later American liberals to follow.',
      'The three close political allies were tightly related: Jefferson and Madison were the closest of friends, and Monroe was Jefferson’s former law student. Their achievements were many, including the founding of the opposition Republican Party in the 1790s; the Louisiana Purchase; and the call upon Congress in 1806 to use its constitutional power to ban slave imports beginning on January 1, 1808.',
      'Of course, not everything the Virginia Dynasty undertook was a success: Its chief failure might have been the ineptly planned and led War of 1812. In general, however, when Monroe rode off into the sunset in 1825, his passing and the end of The Virginia Dynasty were much lamented. Kevin R. C. Gutzman’s new book details a time in America when three Presidents worked toward common goals to strengthen our Republic in a way we rarely see in American politics today.',
    ],
    reviews: [
      {
        quote:
          'A long, insightful look at three Founder presidents. … Political histories are rarely page-turners, but Gutzman, clearly a scholar who has read everything on his subjects, writes lively prose and displays a refreshingly opinionated eye for a huge cast of characters and their often unfortunate actions. Outstanding historical writing.',
        source: 'Kirkus (starred review)',
      },
    ],
    accolades: [
      'Named one of 5 new must-read books by USA Today',
      'Named a Best Book of the Month in the Memoir & Biography and History categories by Amazon',
    ],
    cover: coverJeffersonians,
    href: 'https://amzn.to/3UB6wxT',
    accolade: '★ Starred Review, Kirkus',
  },
  {
    title: 'Thomas Jefferson—Revolutionary',
    subtitle: "A Radical's Struggle to Remake America",
    meta: "2017 · St. Martin's Press · History, Science & Military Book Club Selection",
    description: "A radical's struggle to remake America.",
    videos: [
      {
        title: 'Book TV — C-SPAN',
        url: 'https://www.c-span.org/program/book-tv/thomas-jefferson-revolutionary/474477',
      },
    ],
    longDescription: [
      'Although remembered as the third president of the United States and chief author of the Declaration of Independence, Thomas Jefferson was also something more: the most successful constructive statesman in American history.',
      "Thomas Jefferson—Revolutionary: A Radical's Struggle to Remake America shows him formulating his radical plans to republicanize America and then working, with remarkable success, to implement them. Born into a monarchical society, Jefferson turned his great intellect and energy to making it highly egalitarian. Much of what we take for granted about America now was originally Jefferson's idea. It is a fascinating story.",
    ],
    reviews: [
      {
        quote:
          "In this lively and clearly written book, Kevin Gutzman makes a compelling case for the broad range and radical ambitions of Thomas Jefferson's commitment to human equality.",
        source:
          'Alan Taylor, Pulitzer Prize winning author of American Revolutions: A Continental History, 1750-1804',
      },
      {
        quote:
          'For those who think that everything has been said about Thomas Jefferson, Kevin Gutzman’s remarkable new book proves them wrong. Gutzman offers striking new insights into Jefferson’s views on federalism, the freedom of conscience, race relations, primary and secondary education, and the University of Virginia. Arguing that Jefferson was “the most significant statesman in American history,” Gutzman nonetheless points out what he believes are some of the critical flaws in Jefferson’s thoughts and actions. Written in a clear and direct style, Thomas Jefferson―Revolutionary will be of interest to historians, legal scholars, and students of American political thought.',
        source: 'James W. Ceaser, The University of Virginia',
      },
      {
        quote:
          'Perhaps no figure has cast a longer shadow across the American political landscape than Thomas Jefferson; and the political thought and legacy of few figures have been the subject of more debate. In his engaging examination of Jefferson’s public life, Kevin Gutzman takes his readers on a rip-roaring ride through the contests and controversies of the founding era and early republic, inviting readers along the way to challenge conventional interpretations of history and reconsider first principles. Brimming with keen insights, Thomas Jefferson ― Revolutionary focuses on Jefferson’s often radical views on federalism, the rights of conscience, race, slavery, and public education, casting light on the great political controversies that have long roiled the republic.',
        source:
          'Daniel L. Dreisbach, American University, and author of Thomas Jefferson and the Wall of Separation Between Church and State',
      },
      {
        quote:
          'No statesman of the United States’ founding years has suffered a more precipitous decline in his reputation than Thomas Jefferson. He has been one of the principal victims of our era’s small-minded rage against the very idea that imperfect men can still be heroes. It is time for a spirited corrective to this folly, and Kevin Gutzman has provided one in this book, reminding us of Jefferson’s astounding range of accomplishments, and his steadfast confidence in the dignity and unrealized potential in the minds and hearts of ordinary people. Whenever we search for the core of what is greatest in the American democratic experiment, we find the towering figure of Jefferson, and the abundant evidence of his influence.',
        source:
          'Wilfred M. McClay, G.T. and Libby Blankenship Chair in the History of Liberty, University of Oklahoma',
      },
      {
        quote:
          'When Jefferson wrote the inscription for his tombstone, he ignored the many offices he\'d held and instead listed as his signature achievements the Declaration of Independence, the Virginia Statute for Religious Freedom, and the University of Virginia. Kevin Gutzman\'s important new book connects the dots between these and other contributions to make a compelling case that Jefferson was neither an enigma nor a paradox. Instead, he was an American Revolutionary with a consistent and coherent agenda to make America a land of liberty and opportunity the likes of which the world had never seen.',
        source:
          'Robert M. S. McDonald, Professor of History, United States Military Academy, author of Confounding Father: Thomas Jefferson\'s Image in His Own Time',
      },
      {
        quote:
          "Kevin Gutzman's Thomas Jefferson--Revolutionary offers a provocative and original perspective on the great Virginian's radical vision of America's--and Virginia's--future. Sharply focused, powerfully argued, and engagingly written, Gutzman's book is sure to generate the kind of controversy that will guarantee Jefferson's continuing relevance.",
        source:
          'Peter S. Onuf, University of Virginia and the Thomas Jefferson Foundation, (Monticello), co-author, with Annette Gordon-Reed, of Most Blessed of the Patriarchs: Thomas Jefferson and the Empire of the Imagination',
      },
      {
        quote:
          "Kevin Gutzman has written a learned and combative book about one of the central figures in a transatlantic age of democratic revolution. In attempting to fathom the mind of Thomas Jefferson, his fears as well as his aspirations, Gutzman has fresh things to say not only about Jefferson himself, but on an entire period of American history.",
        source: 'Robert L. Paquette, Executive Director, Alexander Hamilton Institute',
      },
    ],
    cover: coverTJ,
    href: 'http://amzn.to/2nPGeJx',
  },
  {
    title: 'James Madison and the Making of America',
    meta: "2012 · St. Martin's Press · History Book Club & Freedom Book Club Main Selection",
    description:
      'A complex, sometimes contradictory portrait beyond “Father of the Constitution.”',
    videos: [
      {
        title: 'Who Was James Madison? — The Rubin Report',
        url: 'https://www.youtube.com/watch?v=fmC1t3F7OJA&t=8s',
        embedUrl: 'https://www.youtube.com/embed/fmC1t3F7OJA?start=8',
      },
      {
        title: 'Clemson University Constitution Day Madison Speech',
        url: 'https://www.youtube.com/watch?v=fJl6k1Mf3A0&t=148s',
        embedUrl: 'https://www.youtube.com/embed/fJl6k1Mf3A0?start=148',
      },
      {
        title: 'Furman University Religious Liberty Speech',
        url: 'https://www.youtube.com/watch?v=usWqr8cogtM&t=36s',
        embedUrl: 'https://www.youtube.com/embed/usWqr8cogtM?start=36',
      },
      {
        title: 'C-SPAN Religious Liberty Speech',
        url: 'https://www.youtube.com/watch?v=UTg50YcV6Dc&t=14s',
      },
    ],
    longDescription: [
      'In James Madison and the Making of America, historian Kevin Gutzman looks beyond the way James Madison is traditionally seen – as "The Father of the Constitution" – to find a more complex and sometimes contradictory portrait of this influential Founding Father and the ways in which he influenced the spirit of today\'s United States.',
      'Instead of an idealized portrait of Madison, Gutzman treats readers to the flesh-and-blood story of a man who often performed his founding deeds in spite of himself: Madison’s fame rests on his participation in the writing of The Federalist Papers and his role in drafting the Bill of Rights and Constitution.',
      'Today, his contribution to those documents is largely misunderstood. He thought that the Bill of Rights was unnecessary and insisted that it not be included in the Constitution, a document he found entirely inadequate and predicted would soon fail.',
      'Madison helped to create the first American political party, the first party to call itself “Republican”, but only after he had argued that political parties, in general, were harmful.',
      'Madison served as Secretary of State and then as President during the early years of the United States and the War of 1812; however, the American foreign policy he implemented in 1801-1817 ultimately resulted in the British burning down the Capitol and the White House.',
      'In so many ways, the contradictions both in Madison’s thinking and in the way he governed foreshadowed the conflicted state of our Union now. His greatest legacy—the disestablishment of Virginia’s state church and adoption of the libertarian Virginia Statute for Religious Freedom—is often omitted from discussion of his career.',
      'Yet, understanding the way in which Madison saw the relationship between the church and state is key to understanding the real man. Kevin Gutzman\'s James Madison and the Making of America promises to become the standard biography of our fourth President.',
    ],
    reviews: [
      {
        quote:
          "The serious reader who wants a detailed account of James Madison's long public career, drawn from primary sources, will find Kevin Gutzman's book deeply rewarding. The author's treatments of Virginia's ratification convention and the drafting of the Bill of Rights are particularly valuable.",
        source:
          'Daniel Walker Howe, Pulitzer-Prize-winning author of What Hath God Wrought: The Transformation of America, 1815-1848',
      },
      {
        quote:
          'Writing with authority and verve, Kevin Gutzman merges James Madison the practical Virginia politician and James Madison the world-class political theorist in this well-rounded biography of one of the most remarkably multifaceted founders of the republic.',
        source:
          'Jon Kukla, author of Mr. Jefferson’s Women and A Wilderness So Immense: The Louisiana Purchase and the Destiny of America',
      },
      {
        quote:
          "Kevin Gutzman's beautifully written and insightful account of James Madison's fascinating life promises to become the standard biography of this great Founding Father.",
        source:
          'Edward G. Lengel, Professor and Editor-in-Chief, The Papers of George Washington, University of Virginia, and author of Inventing George Washington: America\'s Founder, In Myth and Memory',
      },
      {
        quote:
          "Focusing on the fourth president's public life, Kevin Gutzman's James Madison and the Making of America recaptures the drama and excitement of the new nation's bold experiment in republican self-government. No one played a more important role than Madison in the drafting, ratification, and implementation of the federal Constitution. The power of the great Virginian's penetrating intelligence is amply evident on every page of this nicely balanced, well-written, and lucidly argued study.",
        source:
          'Peter S. Onuf, Thomas Jefferson Foundation Professor of History, University of Virginia and author of Jefferson\'s Empire: The Language of American Nationhood',
      },
      {
        quote:
          'Kevin R. C. Gutzman\'s new biography of James Madison tells the story of one of early America\'s most influential political thinkers and statesmen for general readers while offering fresh insights for specialists. Sympathetic without being sycophantic, the author covers all the major accomplishments of this notable founding figure and explains Madison\'s motives and perspectives with a clarity that will inform and challenge general readers. Gutzman clearly admires his subject but consistently maintains sufficient analytical distance to render fair and critical evaluations. Madison\'s internal inconsistencies and almost willful misrepresentations of some of his own positions are also wisely noted. Gutzman concludes that Madison "wanted to have been a Jeffersonian even when at his most nationalist. It is likely that he actually remembered events that way" (p. 350).',
        source: 'Darren Staloff, City College of New York, The Journal of Southern History',
      },
    ],
    cover: coverMadison,
    href: 'https://www.amazon.com/gp/product/125002319X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=125002319X&linkCode=as2&tag=kevingutcom-20&linkId=b01448a9384875126ecad5e0489134ba',
    accolade: 'Praised by WSJ',
  },
  {
    title: 'Who Killed the Constitution?',
    subtitle: 'The Federal Government vs. American Liberty from World War I to Barack Obama',
    meta: '2008 · Crown Forum · with Thomas E. Woods, Jr.',
    description:
      "The federal government's expansion at the expense of American liberty, from World War I onward.",
    videos: [
      {
        title: 'Cleveland, Texas Who Killed the Constitution Address',
        url: 'https://www.youtube.com/watch?v=TYvNH5uWhIA',
        embedUrl: 'https://www.youtube.com/embed/TYvNH5uWhIA',
      },
    ],
    longDescription: [
      'The United States Constitution—the bedrock of our country, the foundation of our federal republic—is... dead.',
      "You won't hear that from the politicians who endlessly pay lip service to the Constitution. It's the dirty little secret that bestselling authors Thomas E. Woods Jr. and Kevin R. C. Gutzman expose in this provocative new book.",
      "The fact is that government officials — Democrats and Republicans, presidents, judges, and congresses alike — long ago rejected the idea that the Constitution possesses a fixed meaning limiting the U.S. government's power. In case you've forgotten, this idea was not a minor aspect of the Constitution; it was the document's very purpose.",
      'Woods and Gutzman round up the suspects responsible for the death of the government the Founding Fathers designed. Going right to the scenes of the crimes, they dissect twelve of the most egregious assaults on the Constitution — some virtually unknown. In chronicling this "dirty dozen," the authors show that the attacks began long before presidents declared preemptive wars, congresses built pork-barrel bridges to nowhere, and Supreme Court justices began to behave as our supreme legislators.',
    ],
    reviews: [
      {
        quote:
          'As Thomas Woods and Kevin R. C. Gutzman show in "Who Killed the Constitution? The Fate of American Liberty from World War I to Barack Obama," even those who bewail our present constitutional crisis miss the much larger story.\n\nTracing the decline of the Constitution through the twentieth century and into the twenty-first, they demonstrate that the assaults on this great document have not been the work of one branch of government, or of one party, and they did not emerge overnight.\n\nWoods (author of "The Politically Incorrect Guide™ to American History") and Gutzman (author of "The Politically Incorrect Guide™ to the Constitution") prove that crisis we face today is the culmination of decades of offenses against the Constitution by Democrats and Republicans, justices, presidents, and congresses alike...',
        source: 'ConservativeBookClub.com',
      },
    ],
    cover: coverWhoKilled,
    href: 'https://www.amazon.com/gp/product/0307405761/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0307405761&linkCode=as2&tag=kevingutcom-20&linkId=042aa0a86d0173c0de989234d13f539c',
  },
  {
    title: "Virginia's American Revolution",
    subtitle: 'From Dominion to Republic, 1776–1840',
    meta: '2007 · Lexington Books',
    description:
      "What the Revolutionaries made of the Revolution in Jefferson's home state.",
    longDescription: [
      "Virginia's American Revolution follows the Virginia revolutionaries from their decision for independence on May 15, 1776, through the following sixty-four years—when the last of them finally passed from the scene.",
      'To their surprise, the decision to break with Great Britain entailed reconsideration of virtually all their major political and social institutions, from the established church, their aristocratic state government, and feudal land tenures, to slavery and their federal relations with the other American states.',
      'Some of these issues, such as the place of the Church of England in the newly republican Virginia, received quick resolutions; others, such as the nature of the relationship between the elite and other men, were not so easily decided.',
      "All of them were considered against the backdrop of Virginia's decline from preeminence in the Revolution and Early Republic to the position of just another state in the Age of Jackson.",
      "By following Virginia's American Revolution from start to finish, this account shows why so many revolutionaries in the Old Dominion died doubting that their great struggle had been worth the effort.",
    ],
    reviews: [
      {
        quote:
          "In recent years, Kevin Gutzman has earned rank as one of our finest young historians of the American Founding. In Virginia's American Revolution, he calls attention to 'the old reality of American political life that the state was the primary unit of political allegiance, the chief locus of political identity, and the level at which most significant political questions were decided in the Early Republic.' Pursuing the history of the most important of the first thirteen states in light of this neglected truth, Gutzman provides a new and valuable perspective on our origins.",
        source:
          'Clyde Wilson, Distinguished Professor Emeritus of History, University of South Carolina',
      },
      {
        quote:
          "In short, Virginia's American Revolution is not only an invaluable contribution to the scholarly literature, but it is also a treasure trove for those who would recapture the original American republic.",
        source: 'lewrockwell.com',
      },
      {
        quote:
          'Gutzman displays a detailed, even at times sympathetic (though not uncritical) understanding that many readers should find particularly worthwhile.',
        source: 'H-Net, May 2008',
      },
      {
        quote:
          "Kevin Gutzman's important new book shows how Virginian patriots sought to secure provincial liberties and create a new American union in the Old Dominion's image. Challenging the conventional nationalist bias in Revolutionary historiography, Gutzman points the way toward a broader, more compelling interpretation of the history of the federal republic in its formative decades. Lucidly written and powerfully argued, Virginia's American Revolution is a superb addition to the literature.",
        source:
          "Peter S. Onuf, Thomas Jefferson Foundation Professor, University of Virginia, and author of Jefferson's Empire: The Language of American Nationhood",
      },
    ],
    cover: coverVirginia,
    href: 'https://www.amazon.com/gp/product/0739121324/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0739121324&linkCode=as2&tag=kevingutcom-20&linkId=9b478edffb2f04dbe7bd4d950afc21e8',
  },
  {
    title: 'The Politically Incorrect Guide to the Constitution',
    subtitle: 'Put the Constitution back in "constitutional law"',
    meta: '2007 · Regnery · NYT Bestseller',
    description:
      'His debut book and the only Jeffersonian account of American constitutional history in print.',
    videos: [
      {
        title: 'America Talks Live Constitution Day Interview',
        url: 'https://www.youtube.com/watch?v=fAFc0k6Ynac&t=109s',
        embedUrl: 'https://www.youtube.com/embed/fAFc0k6Ynac?start=109',
      },
    ],
    longDescription: [
      'The Constitution of the United States created a representative republic marked by federalism and the separation of powers.',
      'Yet numerous federal judges–led by the Supreme Court–have used the Constitution as a blank check to substitute their own views on hot-button issues such as abortion, capital punishment, and same sex marriage for perfectly constitutional laws enacted by We the People through our elected representatives.',
      'Now, The Politically Incorrect Guide™ to the Constitution shows that there is very little relationship between the Constitution as ratified by the thirteen original states more than two centuries ago and the "constitutional law" imposed upon us since then. Instead of the system of state-level decision makers and elected officials the Constitution was intended to create, judges have given us a highly centralized system in which bureaucrats and appointed–not elected–officials make most of the important policies.',
      'In The Politically Incorrect Guide™ to the Constitution, Professor Kevin Gutzman, who holds advanced degrees in both law and American history:',
      [
        'Explains how the Constitution was understood by the founders who wrote it and the people who ratified it',
        'Follows the Supreme Court as it uses the fig leaf of the Constitution to cover its naked usurpation of the rights and powers the Constitution explicitly reserves to the states and to the people',
        'Shows how we slid from the Constitution\'s republican federal government, with its very limited powers, to an unrepublican "judgeocracy" with limitless powers',
        'Reveals how huge swaths of American law and society were remade in the wake of Supreme Court rulings',
        'Reveals how the Fourteenth Amendment has been twisted to use the Bill of Rights as a check on state power instead of on federal power, as originally intended',
        'Exposes the radical inconsistency between "constitutional law" and the rule of law',
        'Contends that the judges who receive the most attention in history books are celebrated for acting against the Constitution rather than for it',
      ],
      'As Professor Gutzman shows, constitutional law is supposed to apply the Constitution\'s plain meaning to prevent judges, presidents, and congresses from overstepping their authority. If we want to return to the founding fathers\' vision of the Republic, if we want the Constitution enforced in the way it was explained to the people at the time of its ratification, then we have to overcome the "received wisdom" about what constitutional law is. The Politically Incorrect Guide™ to the Constitution is an important step in that direction.',
    ],
    reviews: [
      {
        title: 'Nothing like it has ever been written',
        quote:
          'For what my opinion is worth, this is one of the most important books of the past 25 years. There is absolutely nothing like it, anywhere.\n\nThis is not another of the toothless and forgettable laments about the death of the Constitution at the hands of activist judges that we read from time to time from the right-wing pundit class, though of course author Kevin Gutzman decries both of these things. This is a far more sweeping, much more fundamentally devastating indictment of the Supreme Court, of the "legal training" that raises up ever more people to perpetuate its record of dishonesty and usurpation, and of the American regime at large -- which rests on the legal fictions Gutzman shreds in his book.\n\nTo those who weep over the Constitution\'s neglect these past 50 or 100 years, Gutzman shows that defiance of that document has gone on from the beginning, starting in the 1790s. An expert on colonial and early republican Virginia -- and who has been published in all the major professional journals -- Gutzman knows the Virginia ratifying convention inside and out. He knows the promises made to the people, and the assurances that Virginia\'s ratifiers inserted into that state\'s ratification instrument. And he shows that Jefferson and his allies were faithful to those principles and promises, and that the so-called Federalists and their present-day apologists (which includes just about everybody) were not.\n\nJohn Marshall, Chief Justice of the United States from 1801 to 1835, comes in for some serious scholarly thrashing as well. Marshall is all too typically held up as an idol before conservatives and even libertarians, and he remains a central icon of early American history. For Gutzman, Marshall is an outright opponent -- and a dishonest one at that -- of the legal principles on which the people of the states were promised their new government would be based. Where else can you find such an iconoclastic portrayal?\n\nGutzman also treats a great many politically incorrect subjects from a constitutional perspective. I won\'t spoil the surprise by giving everything away, but if you happen to have a thing for being told the truth rather than lies, you\'ll read and cheer.\n\nIt\'s going to be fun to watch the so-called constitutional lawyers try to attack Gutzman\'s book. Gutzman, who holds a law degree as well as a Ph.D. in history, is uniquely positioned to parry any such attacks: unlike his opponents he actually knows early American history, not just a string of unfounded Supreme Court decisions purporting to be "constitutional law." (This is one reason, Gutzman says, that "legal training should not be confused with an education.")\n\nAlthough I was revisiting much familiar ground as I read this book, even I was shocked at how dishonest the federal courts have been over the years. And Gutzman just eviscerates all of it, slashing and burning everything in sight, and holding up the ludicrous series of fictions that pass for "constitutional law" to hilarious derision.\n\nGutzman isn\'t supposed to do any of this, of course, since the continuation of the racket depends on popular ignorance. To the legal establishment he is like the man who shouts out in the middle of the show how the magician is really sawing the woman in half.\n\nThis book, the most Jeffersonian constitutional history ever written, is an absolute MUST. It will leave you gasping for air.',
        source: 'Thomas Woods',
      },
    ],
    cover: coverPICG,
    href: 'https://www.amazon.com/gp/product/1596985054/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1596985054&linkCode=as2&tag=kevingutcom-20&linkId=333904ebbb8d9203917195c6dbb55d3f',
  },
]

function Books() {
  const [selectedBook, setSelectedBook] = useState(null)

  return (
    <div id="books" className="bg-ink py-[72px]">
      <div className="mx-auto max-w-[1100px] px-[clamp(16px,4vw,32px)]">
        <div className="sticky top-[60px] z-[5] bg-ink py-2 md:py-4">
          <div className="mb-1 text-[13px] font-semibold tracking-[0.1em] text-gold uppercase md:mb-2.5">
            Books
          </div>
          <h2 className="m-0 font-serif text-[22px] font-semibold text-cream sm:text-[26px] md:text-[32px]">
            Biographies and Constitutional History
          </h2>
        </div>
        <p className="m-0 mb-10 max-w-[32ch] text-sm text-muted-on-dark">
          From his first New York Times bestseller in 2007 to his latest
          study of the Jeffersonian presidencies.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-8 gap-y-10">
          {BOOKS.map((book) => (
            <button
              key={book.title}
              type="button"
              onClick={() => {
                trackEvent('view_item', { item_name: book.title })
                setSelectedBook(book)
              }}
              className="flex cursor-pointer flex-col gap-3.5 text-left text-inherit hover:text-inherit"
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
            </button>
          ))}
        </div>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}

export default Books
