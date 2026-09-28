export const FIRST_YEAR = 2004;
export const LAST_YEAR = 2026;

export const chapters = [
  { position: 0, title: "A door opens", years: "2004" },
  { position: 0.1, title: "Years inside that computer", years: "2004–2010" },
  { position: 0.28, title: "People on the other side", years: "2011–2012" },
  { position: 0.36, title: "From exploring to publishing", years: "2013–2014" },
  { position: 0.46, title: "Making things for others", years: "2015–2017" },
  { position: 0.54, title: "Beyond one room", years: "2017–2018" },
  { position: 0.62, title: "A bigger canvas", years: "2019–2020" },
  { position: 0.7, title: "Design meets product", years: "2021" },
  { position: 0.75, title: "Building with a team", years: "2022" },
  { position: 0.8, title: "Passing it on", years: "2023–2024" },
  { position: 0.9, title: "Different scales, same curiosity", years: "2025" },
  { position: 0.95, title: "The screen stayed on", years: "2026" },
] as const;

type Beat = {
  id: string;
  duration?: number;
  position: number;
  chapter: number;
  title: string;
  caption: string;
  text: string;
  reading: string;
  artifact?: number;
  project?: string;
};

export const beats: readonly Beat[] = [
  {
    caption: "2004 · Rudrapur, Uttarakhand",
    chapter: 0,
    duration: 10_000,
    id: "dad-open",
    position: 0,
    reading:
      "Rudrapur, Uttarakhand. I was four when my dad sat me down at our white computer and showed me how to use the internet.",
    text: "Rudrapur, 2004. I was four. My dad showed me the internet.",
    title: "My dad opened\nmy world.",
  },
  {
    caption: "2004",
    chapter: 0,
    id: "google",
    position: 0.04,
    reading:
      "In 2004 my dad sat me down with this computer: a white CRT/TFT monitor, a white TVS keyboard, a cabinet. He unlocked my world by teaching me how to Google, and I just never left the computer since then.",
    text: "A white computer. My dad beside me. He taught me how to Google. I never really switched it off.",
    title: "He showed me\nhow to Google.",
  },
  {
    caption: "Early childhood",
    chapter: 0,
    id: "search-games",
    position: 0.077,
    reading:
      "One of the first things I remember doing online was downloading video games. A search could lead to something new to play, try or learn.",
    text: "One of the first things I remember doing online was downloading video games.",
    title: "The search\nkept going.",
  },
  {
    caption: "2004–2010 · Childhood memories",
    chapter: 1,
    id: "games-windows",
    position: 0.1,
    reading:
      "IGI, GTA, Commandos, Civilization, Total Overdose. I spent years playing games, exploring the internet and learning my way around Windows. Between games, I kept finding another setting, another question, another thing to try.",
    text: "Games, Windows, the internet. There was always something else to explore.",
    title: "Whole worlds.\nOne computer.",
  },

  {
    caption: "2004–2010 · Childhood memories",
    chapter: 1,
    id: "cousin-tv",
    position: 0.151,
    reading:
      "My cousin brother and I spent a lot of time tinkering together. I also watched Backyard Science, the television show I remember from Discovery. Curiosity followed me away from the screen.",
    text: "My cousin brother and I tinkered together. I watched Backyard Science on Discovery, too.",
    title: "Curiosity\nhad company.",
  },
  {
    caption: "2004–2010 · Uttaranchal Computer",
    chapter: 1,
    id: "repair-store",
    position: 0.18,
    reading:
      "When our PC broke, I went to Uttaranchal Computer. Mandal uncle worked there. I sat with him among machines being repaired and new PCs being prepared for delivery. I returned for repairs, replacement parts and monitors. The showroom fascinated me, too.",
    text: "At Uttaranchal Computer, I watched Mandal uncle work. He understood the nerves of a computer.",
    title: "A different\nkind of classroom.",
  },
  {
    caption: "2004–2010 · Learning at the repair store",
    chapter: 1,
    id: "dismantling",
    position: 0.215,
    reading:
      "The case opened, and the computer became something I could begin to understand. Sitting beside Mandal uncle, I watched how its parts fitted together and learned a little more with each visit.",
    text: "Mandal uncle knew his way around every part. I kept watching and learning.",
    title: "Then I looked\ninside.",
  },
  {
    caption: "2011–2012 · Finding communities",
    chapter: 2,
    id: "communities",
    position: 0.28,
    reading:
      "My Facebook record begins in 2011; my Blogger profile dates to June 2012. I followed blogging pioneers and learned through DMs, groups and communities. I was fascinated by online businesses, and watched the Indian blogosphere grow and change as video rose.",
    text: "Facebook groups, blogger communities, conversations that kept going. There were people to learn from behind the pages.",
    title: "People behind\nthe pages.",
  },

  {
    artifact: 0,
    caption: "2013 · The early blogs",
    chapter: 3,
    id: "teen-making",
    position: 0.36,
    reading:
      "Tech Knowledge Providers, BloggingGuys, Android articles, experiments with websites. Through my teens, writing, visual design, UI/UX and web development grew together. Android tutorials, interviews and guest articles gave me reasons to keep learning. Tech Knowledge Providers and BloggingGuys grew into Blogging Orb, Gyaanify, Gizmozzi and other experiments.",
    text: "Writing, designing and learning how to build the web for myself.",
    title: "I started\nmaking things.",
  },
  {
    artifact: 1,
    caption: "2014 · Blogging Orb",
    chapter: 3,
    id: "blog-rebuild",
    position: 0.41,
    reading:
      "Blogging Orb brought writing, interviews and more experiments. When hosting broke in 2014, I rebuilt on Blogger. Gyaanify followed later that year. Every version taught me something the previous one had not.",
    text: "The site changed. Hosting broke. I kept rebuilding.",
    title: "Make. Learn.\nMake it again.",
  },
  {
    caption: "Teenage blogging years",
    chapter: 3,
    id: "interviews",
    position: 0.433,
    reading:
      "I interviewed other bloggers, and was interviewed about my own work. I wrote about Android and contributed guest articles, including for GoogieHost. The conversations were becoming part of what I published.",
    text: "I interviewed bloggers, wrote about Android and contributed guest articles. Then people began asking about my work, too.",
    title: "From asking questions\nto answering them.",
  },
  {
    caption: "Early blogging years",
    chapter: 3,
    id: "adsense",
    position: 0.447,
    reading:
      "I remember an early AdSense payout of roughly US$100 from blogging. I cannot place its exact date. People also bought my themes. Some Facebook design jobs paid in dongle recharges. These were different ways my work began to pay for more work.",
    text: "I remember an early AdSense payout of roughly $100. Something I had made was beginning to earn.",
    title: "Making things\nbegan to pay.",
  },
  {
    artifact: 2,
    caption: "2015 · Themes and small jobs",
    chapter: 4,
    id: "themes",
    position: 0.46,
    reading:
      "I made WordPress themes, including Octane and Duke. People bought Octane in July 2015. Duke appears in a July demo and an October store record. Something I had built could become the starting point for somebody else.",
    text: "I made WordPress themes, including Octane and Duke. People bought a theme I had made.",
    title: "Something others\ncould build on.",
  },
  {
    caption: "Around 2015–2016 · Class 9",
    chapter: 4,
    id: "local-businesses",
    position: 0.477,
    reading:
      "Around Class 9, I started small web projects for neighbouring businesses. I was learning to listen to what somebody needed, then turn it into a website.",
    text: "I began small web projects for neighbouring businesses, learning design, UI/UX and code together.",
    title: "Websites for\npeople nearby.",
  },
  {
    caption: "School years · Design for dongle recharges",
    chapter: 4,
    id: "dongle",
    position: 0.489,
    reading:
      "Some design work came through Facebook. Payment sometimes meant an internet dongle recharge: more time online to keep learning and making.",
    text: "Some Facebook design jobs paid in dongle recharges. Making things helped keep me online.",
    title: "Design paid\nfor more internet.",
  },
  {
    caption: "2016–2017 · Beximo",
    chapter: 4,
    id: "beximo",
    position: 0.5,
    reading:
      "I co-founded Beximo, a multi-author website. I wrote, edited contributors and worked on the WordPress site alongside school. Alongside technology articles, I published a poem. Writing was becoming a way to explore more than technology.",
    text: "I co-founded Beximo. Writing, editing contributors and running the site became a shared effort.",
    title: "More than\nmy own projects.",
  },
  {
    caption: "Class 10 · HuntIT · Around 2016–2017",
    chapter: 4,
    duration: 10_000,
    id: "huntit",
    position: 0.522,
    reading:
      "I was part of the core team organising HuntIT, a live treasure hunt across a mall and two townships. Seventy teams, usually two or three people each, followed four trails of riddles to find the treasure. We were organising something people would experience together, in person.",
    text: "Our core team organised HuntIT across a mall and two townships. Seventy teams. Four riddle trails. People out there, playing.",
    title: "A town became\na treasure hunt.",
  },
  {
    caption: "2017–2018 · Class 11",
    chapter: 5,
    id: "first-laptop",
    position: 0.54,
    reading:
      "My first laptop arrived in Class 11, around 2017–2018. After so much time at the white desktop, I could carry my work with me. Phones had been part of the journey too: a Galaxy Young in Class 6, a Galaxy Grand around Class 8 or 9, then a Motorola E4, Redmi Note 7 and Realme X7.",
    text: "In Class 11, I got my first laptop. The computer no longer had to stay in one room.",
    title: "I could take\nit with me.",
  },
  {
    caption: "Class 11 · TheTechSire",
    chapter: 5,
    id: "youtube",
    position: 0.565,
    reading:
      "During Class 11, I ran a YouTube channel called TheTechSire. Writing and building had already given me ways to share; I wanted to try video, too.",
    text: "For a while, I ran a channel called TheTechSire. Another way to make and share.",
    title: "I tried\nYouTube, too.",
  },
  {
    caption: "March 2018 · QSolve",
    chapter: 5,
    id: "qsolve",
    position: 0.58,
    reading:
      "Before college, I made QSolve, a question-and-answer project with an Android app. In March 2018, it passed Amazon Appstore review. I was still at school, learning another way to turn an idea into something people could install.",
    text: "Before college, I made an Android app called QSolve. In March 2018, it reached the Amazon Appstore.",
    title: "An idea became\nan app.",
  },
  {
    caption: "Start of Class 12 · SPARK · DPS Rudrapur",
    chapter: 5,
    duration: 10_000,
    id: "spark",
    position: 0.6,
    reading:
      "People who had played HuntIT asked us to do more. At the start of Class 12, our core team organised SPARK across the DPS Rudrapur campus. We brought in sponsors and put together laser tag, HuntIT, games and contests. A live youth festival grew from that earlier treasure hunt.",
    text: "HuntIT participants wanted more. Our core team built SPARK: sponsors, laser tag, games and a treasure hunt across a whole campus.",
    title: "Then came\nSPARK.",
  },
  {
    caption: "2019 · Rudrapur → Gurgaon",
    chapter: 6,
    duration: 12_000,
    id: "car-to-college",
    position: 0.62,
    reading:
      "College meant moving from Rudrapur to Gurgaon. I remember sitting in the car, curious about the place I was heading towards.",
    text: "College meant moving from Rudrapur to Gurgaon. There was a new world beyond the car window.",
    title: "Leaving\nRudrapur.",
  },
  {
    caption: "2019 · College begins",
    chapter: 6,
    id: "college-ecell",
    position: 0.647,
    reading:
      "I finished Class 12 in 2019 and joined college. I brought years of experimenting on the web with me. School invitations and family-business branding had already given me real things to design. In 2019, I began E-Cell design work at college. There were more people to make things with.",
    text: "I brought years of making things to college. Designing for the college entrepreneurship club gave that impulse a new place to go.",
    title: "New place.\nSame impulse.",
  },
  {
    artifact: 3,
    caption: "2020 · Digital Moshai",
    chapter: 6,
    id: "digital-moshai",
    position: 0.66,
    reading:
      "Digital Moshai was my freelance web and design practice. I worked on responsive sites for businesses and startups, from the first conversation through design and development. I worked on event and registration experiences for Guby Rogers, and frontend work with Social Disqus. For Amity Online Fest in June 2020, I worked on certificate mail-merge. The studio’s 2020 page said “We Make Digital Experiences For Humans”.",
    text: "I started Digital Moshai, my freelance web and design practice. I took on websites for businesses and startups, from a client’s brief through design and development.",
    title: "The brief\nwas real.",
  },
  {
    caption: "College lockdown · Around 2020–2021",
    chapter: 6,
    id: "avalon-voices",
    position: 0.68,
    reading:
      "During college lockdown, I managed a voice community of about 200 people on the app I remember as Avalon Scenes. I was the main speaker and host, with conversations every other day.",
    text: "A voice community of about 200 people. I hosted conversations every other day.",
    title: "A room made\nof voices.",
  },
  {
    caption: "College years · Product experiments",
    chapter: 7,
    id: "product-experiments",
    position: 0.7,
    reading:
      "Hostville, CryptoMedia, ZepEats and ProductVerse were part of a run of product experiments. I was trying different problems and learning what it took to connect design with development. Not every experiment became a launched product.",
    text: "Hostville, CryptoMedia, ZepEats, ProductVerse. I kept trying ideas and learning how design and development fitted together.",
    title: "More ideas\nworth trying.",
  },
  {
    caption: "2021–2022 · HeroApp",
    chapter: 7,
    id: "heroapp",
    position: 0.722,
    reading:
      "I co-founded HeroApp, a volunteering and goodwill venture. I worked across product design, technical direction and a working React Native app. My personal portfolio brought these different kinds of work together.",
    text: "I co-founded HeroApp and took on product design and development. We built a working React Native app.",
    title: "Designing it.\nBuilding it.",
  },

  {
    caption: "2022 · Gurgaon → Bangalore",
    chapter: 8,
    duration: 14_000,
    id: "bangalore-flight",
    position: 0.75,
    reading:
      "I moved from Gurgaon to Bangalore to join Zenduty as an intern in June 2022. The journey took me from college life into another city and a new team.",
    text: "From Gurgaon to Bangalore, to join Zenduty. Another city to find my feet in.",
    title: "Another city.\nA new beginning.",
  },
  {
    caption: "June 2022 · Joining Zenduty",
    chapter: 8,
    id: "zenduty-team",
    position: 0.787,
    reading:
      "I joined Zenduty in June 2022. Over nearly three years, my work spanned the mobile app, UI components, web tools, APIs and documentation. Earlier, I had worked on the Instahomes web app.",
    text: "At Zenduty, I was learning how to build mobile and web products with a team.",
    title: "Building\nwith a team.",
  },
  {
    caption: "2023 · Engineer, writer, speaker",
    chapter: 9,
    id: "engineer",
    position: 0.8,
    reading:
      "At Zenduty, I grew from intern to software engineer in 2023. I worked across the React Native app and tools that supported the product. Around this time, I got my MacBook Air; my iPhone 14 arrived in 2023.",
    text: "I grew from intern to engineer at Zenduty, working across the mobile app, UI components and product tools.",
    title: "More to learn.\nMore to own.",
  },
  {
    caption: "4 November 2023 · React Native security",
    chapter: 9,
    id: "talk",
    position: 0.825,
    reading:
      "On 4 November 2023, I gave a talk on React Native security. Writing on Hashnode had given me another place to share what I was learning. Preparing to explain the work out loud made me look at it again.",
    text: "I gave a talk on React Native security. Learning something and explaining it became part of the same practice.",
    title: "What I learned,\nout loud.",
  },
  {
    caption: "July 2024 · Mentoring interns at Zenduty",
    chapter: 9,
    duration: 7000,
    id: "mentoring",
    position: 0.85,
    reading:
      "In July 2024, I was among the people mentoring interns at Zenduty. I remembered how much I had learned by sitting beside someone who knew more.",
    text: "At Zenduty, I helped interns work through the questions I had once needed help with.",
    title: "Someone had\nshown me once.",
  },
  {
    caption: "11–12 December 2024 · KubeCon India",
    chapter: 9,
    id: "kubecon",
    position: 0.88,
    reading:
      "At KubeCon India on 11–12 December 2024, I represented Zenduty at its booth. It was a chance to meet people around the product we were building.",
    text: "I represented Zenduty at its KubeCon India booth, meeting people around the product.",
    title: "Beyond\nmy own screen.",
  },
  {
    caption: "May–November 2025 · Swiggy",
    chapter: 10,
    id: "swiggy",
    position: 0.9,
    reading:
      "After nearly three years at Zenduty, I joined Swiggy as a software development engineer on Pyng. I built seller onboarding and self-service tools, worked on moderation, and helped with mobile updates and rollout controls.",
    text: "At Swiggy, I worked on Pyng: seller onboarding, self-service and the systems that helped the product run.",
    title: "The work\nkept widening.",
  },
  {
    caption: "November 2025 onward · Quivly",
    chapter: 10,
    id: "quivly",
    position: 0.923,
    reading:
      "I joined Quivly as its founding engineer and first engineering hire. The role spans product direction, architecture and full-stack implementation for an AI product serving post-sales teams.",
    text: "I joined Quivly as its first engineering hire, taking on product decisions, architecture and the code connecting them.",
    title: "First engineer.\nDay one again.",
  },
  {
    caption: "2026 · OpenKVM and ctxr",
    chapter: 11,
    id: "public-tools",
    position: 0.95,
    reading:
      "OpenKVM shares a keyboard and mouse between Macs. ctxr turns video into structured context for coding agents. Both have public releases in 2026. They grew from practical problems I wanted to solve in my own work.",
    text: "OpenKVM connects my Macs. ctxr turns video into context for coding agents. Everyday problems keep becoming things to build.",
    title: "Tools I\nwished I had.",
  },
  {
    artifact: 5,
    caption: "2026 · Altr · Early access",
    chapter: 11,
    id: "altr",
    position: 0.963,
    project: "/projects/altr",
    reading:
      "Altr is my Mac-native workspace, now in early access. The page shown here is its public portfolio page.",
    text: "With Altr, I’m building a Mac-native workspace. It is in early access.",
    title: "A workspace\nof my own.",
  },
  {
    artifact: 6,
    caption: "2026 · Tethr · Private alpha",
    chapter: 11,
    id: "tethr",
    position: 0.975,
    project: "/projects/tethr",
    reading:
      "Tethr keeps people and their existing AI agents working from the same plan, with versioned sections, reviewable proposals and human-approved releases. It is in private alpha.",
    text: "Tethr is a shared planning workspace for people and their AI agents. It is in private alpha.",
    title: "An idea,\ntaking shape.",
  },
  {
    caption: "2004–2026 · And still going",
    chapter: 11,
    duration: 18_000,
    id: "still-building",
    position: 0.985,
    reading:
      "The machines changed. The places changed. The line stayed: Creating digital experiences for humans. It still begins with my dad showing a four-year-old how to Google.",
    text: "Creating digital experiences for humans.",
    title: "Still\nbuilding.",
  },
];

export const artifacts = [
  {
    date: "Archived 21 July 2013",
    description:
      "An original archive capture. The early blog already mixes technology, tutorials and design experiments.",
    image: "/story/tech-knowledge-providers.webp",
    source:
      "https://web.archive.org/web/20130721083448/http://techknowledgeproviders.blogspot.com",
    title: "Tech Knowledge Providers",
  },
  {
    date: "Archived 19 March 2014",
    description:
      "An original archive capture. This is the March version, before the later hosting disruption and rebuild.",
    image: "/story/blogging-orb.webp",
    source:
      "https://web.archive.org/web/20140319113142/http://www.bloggingorb.com:80/",
    title: "Blogging Orb",
  },
  {
    date: "Archived 28 July 2015",
    description:
      "The Gyaanify Duke theme post as it survived in the archive. This capture date is not the theme's creation date.",
    image: "/story/duke-2015.webp",
    source:
      "https://web.archive.org/web/20150728020857/http://www.gyaanify.org:80/454/duke-theme-wordpress-genesis",
    title: "Duke on Gyaanify",
  },
  {
    date: "Archived 13 November 2020",
    description:
      "Digital Moshai's original studio page, with the line We Make Digital Experiences For Humans.",
    image: "/story/digital-moshai.webp",
    source:
      "https://web.archive.org/web/20201113160441/https://digitalmoshai.com/",
    title: "Digital Moshai",
  },
  {
    date: "Archived 1 April 2021",
    description:
      "The personal portfolio where Creating Digital Experiences For Humans survives. Contact details are obscured in this capture.",
    image: "/story/portfolio-2021.webp",
    source: "https://web.archive.org/web/20210401191432/http://mukulchugh.com/",
    title: "My portfolio in 2021",
  },
  {
    date: "Public portfolio · 2026",
    description:
      "Altr's current project page. The project artwork is illustrative; this is not an application UI capture. Altr is in early access.",
    image: "/story/altr-2026.webp",
    source: "https://mukulchugh.com/projects/altr",
    title: "Altr",
  },
  {
    date: "Public portfolio · 2026",
    description:
      "Tethr's current project page with illustrative project artwork. The product is in private alpha.",
    image: "/story/tethr-2026.webp",
    source: "https://mukulchugh.com/projects/tethr",
    title: "Tethr",
  },
] as const;

// A year is an address, not an invented annual milestone. Childhood stays a span.
const calendar = [
  [0, 2004],
  [0.1, 2004],
  [0.265, 2010],
  [0.28, 2011],
  [0.325, 2012],
  [0.36, 2013],
  [0.41, 2014],
  [0.46, 2015],
  [0.5, 2016],
  [0.54, 2017],
  [0.58, 2018],
  [0.62, 2019],
  [0.66, 2020],
  [0.7, 2021],
  [0.75, 2022],
  [0.8, 2023],
  [0.85, 2024],
  [0.9, 2025],
  [0.95, 2026],
  [1, 2026],
] as const;

export function clampProgress(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
export function yearAt(position: number) {
  const p = clampProgress(position);
  for (let i = 1; i < calendar.length; i++) {
    const [end, year] = calendar[i];
    const [start, previous] = calendar[i - 1];
    if (p <= end)
      return Math.floor(
        previous + ((p - start) / (end - start)) * (year - previous) + 1e-7
      );
  }
  return LAST_YEAR;
}
function calendarPositionForYear(year: number) {
  if (!Number.isInteger(year) || year < FIRST_YEAR || year > LAST_YEAR)
    return null;
  if (year === FIRST_YEAR) return 0;
  for (let i = 1; i < calendar.length; i++) {
    const [end, next] = calendar[i];
    const [start, previous] = calendar[i - 1];
    if (year <= next && next !== previous)
      return start + ((year - previous) / (next - previous)) * (end - start);
  }
  return 1;
}
// Navigation addresses the composed hold; native scrolling still visits every pose.
export function readingPosition(position: number) {
  const index = beatAt(position);
  const start = beats[index].position;
  const span = (beats[index + 1]?.position ?? 1) - start;
  return start + span * (index === 0 ? 0.75 : 0.5);
}
export function positionForYear(year: number) {
  const start = calendarPositionForYear(year);
  if (start === null) return null;
  const end = calendarPositionForYear(year + 1) ?? 1;
  // A childhood year can begin during travel. Find its next hold without
  // assigning a new milestone or changing the selected year.
  for (let i = beatAt(start); i < beats.length; i++) {
    const beatStart = beats[i].position;
    const span = (beats[i + 1]?.position ?? 1) - beatStart;
    const low = Math.max(start, beatStart + span * 0.22);
    const high = Math.min(end - 0.0001, beatStart + span * 0.78);
    if (low <= high)
      return Math.max(low, Math.min(high, readingPosition(beatStart)));
  }
  return start;
}
export function beatAt(position: number) {
  const p = clampProgress(position);
  let index = 0;
  for (let i = 1; i < beats.length; i++)
    if (p + 1e-7 >= beats[i].position) index = i;
  return index;
}

// Native scroll and autoplay share the same per-beat weights.
export function scrollForPosition(position: number) {
  return playbackTimeForPosition(position) / PLAYBACK_DURATION;
}
export function positionForScroll(scroll: number) {
  return positionForPlaybackTime(clampProgress(scroll) * PLAYBACK_DURATION);
}

// A beat holds its shot for 60%. Travel spans the neighbouring 20% on each side.
export function beatPhase(position: number, index = beatAt(position)) {
  const start = beats[index].position;
  return clampProgress(
    (position - start) / ((beats[index + 1]?.position ?? 1) - start)
  );
}
export function sceneAt(position: number) {
  const index = beatAt(position);
  const phase = beatPhase(position, index);
  let from = index,
    to = index,
    blend = 0;
  if (phase < 0.2 - 1e-7 && index > 0) {
    from = index - 1;
    blend = 0.5 + phase * 2.5;
  } else if (phase > 0.8 + 1e-7 && index < beats.length - 1) {
    to = index + 1;
    blend = (phase - 0.8) * 2.5;
  }
  blend = blend * blend * (3 - 2 * blend);
  return { blend, from, index, phase, to };
}

// Each passage gets reading time plus travel. Resume maps back to the same pose.
const playbackStops = [0];
for (const beat of beats) {
  const words = `${beat.title} ${beat.text}`.trim().split(/\s+/).length;
  playbackStops.push(
    playbackStops.at(-1)! + (beat.duration ?? Math.max(3500, words * 200 + 800))
  );
}
export const PLAYBACK_DURATION = playbackStops.at(-1)!;
export function playbackTimeForPosition(position: number) {
  const p = clampProgress(position);
  const index = beatAt(p);
  const start = beats[index].position;
  const end = beats[index + 1]?.position ?? 1;
  return (
    playbackStops[index] +
    ((p - start) / (end - start)) *
      (playbackStops[index + 1] - playbackStops[index])
  );
}
export function positionForPlaybackTime(time: number) {
  const t = Number.isFinite(time) ? Math.max(0, time) : 0;
  if (t >= PLAYBACK_DURATION) return 1;
  const index = Math.max(0, playbackStops.findIndex((stop) => stop > t) - 1);
  const fraction =
    (t - playbackStops[index]) /
    (playbackStops[index + 1] - playbackStops[index]);
  const start = beats[index].position;
  return start + fraction * ((beats[index + 1]?.position ?? 1) - start);
}
