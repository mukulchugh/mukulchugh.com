export const privacySections = [
  {
    body: "This is Mukul Chugh’s personal portfolio and writing site. You can read the public pages without an account. The site is hosted on Vercel, which processes requests to deliver pages and operate its hosting service. This notice describes the services used by this site and the choices available to visitors.",
    title: "About this site",
  },
  {
    body: "Email links open your mail application. If you send a message, your email address and the information you include are used to respond to your enquiry. Opening the booking calendar loads Cal.com, which handles the contact details, appointment time and other information you choose to submit. Please avoid sending confidential project information in an initial enquiry.",
    title: "Messages and bookings",
  },
  {
    body: "The site uses Google Analytics, PostHog, Vercel Web Analytics and Vercel Speed Insights to understand page visits, interactions and performance. These services may process device information and browser identifiers; some use cookies or local storage. PostHog is configured to remove URL query strings and fragments and disable session recording. Contact and booking form contents are not included in the site’s explicit interaction events.",
    title: "Analytics and browser storage",
  },
  {
    body: "The site’s client analytics are disabled when your browser sends a supported Do Not Track or Global Privacy Control preference. This does not stop the requests needed to deliver the site or load a booking service you open. You can also manage cookies and storage in your browser. For questions about this notice or information you have sent directly, email contact@mukulchugh.com. Service providers describe their own processing in the policies linked below.",
    title: "Your choices and questions",
  },
] as const;

export const privacyProviders = [
  ["Vercel", "https://vercel.com/legal/privacy-policy"],
  ["Google", "https://policies.google.com/privacy"],
  ["PostHog", "https://posthog.com/privacy"],
  ["Cal.com", "https://cal.com/privacy"],
] as const;
