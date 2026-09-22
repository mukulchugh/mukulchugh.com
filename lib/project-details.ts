// Public repository/site evidence and owner-supplied scope. No inferred impact metrics.
export const projectDetails: Record<
  string,
  {
    heading: string;
    problem: string;
    workflow: string[];
    implementation: string;
    boundary: string;
    sources: string[];
  }
> = {
  "agent-workflow-skills": {
    boundary:
      "GitHub writes are separate, explicit actions. A generated review is evidence to inspect, not a guarantee that the code is correct. This is a personal toolkit, distinct from Quivly Skills.",
    heading: "Make the work easier to review.",
    implementation:
      "Python standard-library scripts handle branch planning, diff parsing, and HTML rendering. Host-specific manifests package the same plugins for Codex, Claude Code, and Cursor. The walkthrough accounts for diff hunks in logical modules; the brief explains user-facing implications. Package validation checks the scripts and manifest wiring.",
    problem:
      "A pull request needs more than a summary. Reviewers need to understand the intent, inspect the actual changes, and distinguish verified findings from plausible concerns. This toolkit covers both starting a change and explaining it once code exists.",
    sources: ["https://github.com/mukulchugh/skills"],
    workflow: [
      "Start work in an isolated branch and worktree",
      "Review diff hunks with cited evidence",
      "Generate a readable walkthrough and product brief",
    ],
  },
  altr: {
    boundary:
      "Early access. Pilot results, customer testimonials, deployment promises, and performance claims are deliberately excluded from this portfolio account.",
    heading: "Carry context through the handoff.",
    implementation:
      "The early-access site describes a Mac-native workspace, isolated Git worktrees, on-device storage, bring-your-own model providers, and human approval gates. These are product-site descriptions, not an independent audit of the shipped implementation.",
    problem:
      "A request can lose its reasoning between discussion, planning, implementation, and review. Altr's public product direction keeps the original signal attached throughout that sequence.",
    sources: ["https://altr.run"],
    workflow: [
      "Capture the request and its context",
      "Draft a spec with acceptance criteria",
      "Build and review against the original intent",
    ],
  },
  brik: {
    boundary:
      "The public README marks the project beta and testing in progress. Platform capabilities and OS requirements differ; planned watchOS support is not represented as shipped. Native build toolchains are still part of integration.",
    heading: "React in. Native widget code out.",
    implementation:
      "The documented pipeline compiles a typed, Zod-validated intermediate representation into SwiftUI and Android Glance/Compose. A CLI and Expo plugin handle code generation and project wiring. The repository includes preview components and example integrations.",
    problem:
      "Widgets and Live Activities use different native frameworks from the main React Native app. Brik explores a shared authoring layer that generates those native surfaces rather than embedding another JavaScript runtime in them.",
    sources: ["https://github.com/mukulchugh/brik"],
    workflow: [
      "Author a widget in JSX or TSX",
      "Validate an intermediate representation",
      "Generate and integrate native platform code",
    ],
  },
  "cryptomedia-cryptocurrency-tracker": {
    boundary:
      "Historical project. Data freshness and availability depend on external services. The interface is a tracker, not investment advice or a trading platform; no current uptime or financial outcome is claimed.",
    heading: "Market information with a personal watchlist.",
    implementation:
      "The React source separates coin tables, charts, detail routes, authentication, and a user sidebar. CoinGecko supplies market data; Chart.js supports price visualization and Firebase supports the account/watchlist flow.",
    problem:
      "A market overview and a personal list answer different questions: what is moving, and what matters to this user. CryptoMedia combines coin discovery with a saved watchlist.",
    sources: ["https://github.com/mukulchugh/CryptoMedia"],
    workflow: [
      "Browse and search coin rankings",
      "Inspect a coin's price history",
      "Sign in and maintain a watchlist",
    ],
  },
  ctxr: {
    boundary:
      "Repository documentation reviewed, not independently runtime-tested. YouTube is the documented source platform. Automatic transcripts can mishear names, and source availability and rate limits affect processing. No accuracy or throughput guarantee is claimed.",
    heading: "Give agents the context inside a video.",
    implementation:
      "The public README describes a Python pipeline using yt-dlp for downloads, ffmpeg for scene-based frame extraction, and captions with optional local Whisper transcription. Transcript segments are aligned to frames and written as Markdown and structured manifests. An MCP server exposes processing and focused queries over the output.",
    problem:
      "Useful product knowledge often lives in demos, tutorials, and talks. A transcript alone loses the interface being shown; isolated screenshots lose the explanation. ctxr aligns the two into material an agent can read.",
    sources: ["https://github.com/mukulchugh/ctxr"],
    workflow: [
      "Choose a YouTube video, playlist, or page of embedded videos",
      "Extract captions or a local transcript and representative keyframes",
      "Read or query timestamped walkthroughs through the CLI and MCP server",
    ],
  },
  "eil-conference": {
    boundary:
      "This case study covers the website implementation. Speaker attendance, conference outcomes, registration processing, and conversion results are not independently verified and are not presented as portfolio achievements.",
    heading: "Make an event worth understanding.",
    implementation:
      "The public repository contains a single HTML implementation with Tailwind, custom CSS, and section-based navigation. The work is primarily information hierarchy and web presentation rather than an application backend.",
    problem:
      "An event page needs to explain who it is for, what happens there, and how to take part. The EIL site organizes a summit's programme, speakers, learning formats, passes, and contact paths into an editorial landing page.",
    sources: ["https://github.com/mukulchugh/eil-website"],
    workflow: [
      "Understand the audience and programme",
      "Browse sessions and speakers",
      "Review pass options and contact the organizers",
    ],
  },
  ferry: {
    boundary:
      "An experiment. The repository was not returned by the current public inventory, so compatibility, latency, installation, and release readiness are not newly verified here.",
    heading: "A wearable input for the Mac.",
    implementation:
      "The existing project record describes Swift, watchOS, macOS, and Core Audio work across capture, transport, and system input. These are the three boundaries that distinguish it from a simple voice-note recorder.",
    problem:
      "Ferry explores using an Apple Watch as a microphone for a Mac, with the output presented as an audio input rather than confined to one recording app.",
    sources: [],
    workflow: [
      "Capture audio on the Watch",
      "Stream audio to the Mac",
      "Expose the stream as a system audio input",
    ],
  },
  "github-profile-explorer": {
    boundary:
      "The repository calls the app GitBook; the portfolio uses GitHub Profile Explorer to describe it without confusion with the documentation service. GitHub API limits still apply. The linked demo has not been functionally audited in this pass.",
    heading: "Explore people behind the repositories.",
    implementation:
      "React and TypeScript provide the interface, with TanStack Query managing remote data and local storage retaining watchlists and search history. Dedicated components cover activity, repositories, organizations, followers, comparisons, and language charts.",
    problem:
      "Comparing GitHub profiles usually means opening multiple tabs and reconstructing the same information. This interface puts search, repository activity, comparison, and saved profiles into one browsing flow.",
    sources: ["https://github.com/mukulchugh/github-profile-explorer"],
    workflow: [
      "Search for a GitHub user",
      "Explore repositories, activity, and connections",
      "Compare profiles and keep a watchlist",
    ],
  },
  "gym-center": {
    boundary:
      "Historical implementation in a public repository. Backend availability, live transactions, individual contribution boundaries, and production use are not verified. No client outcome or sole-authorship claim is made.",
    heading: "Public website meets daily operations.",
    implementation:
      "React Router organizes public pages and dashboard branches. The source includes account income and expense screens, member profiles and workouts, and trainer packages and schedules. Account and user route wrappers are present; this is not a claim of a completed security model.",
    problem:
      "A gym's public website and its member, trainer, and accounts interfaces serve different needs. This project contains both programme discovery and role-oriented dashboard surfaces.",
    sources: ["https://github.com/mukulchugh/GymCenter--RIZIQ-IT-Solutions"],
    workflow: [
      "Explore programmes, trainers, and shop pages",
      "Enter member or accounts dashboard routes",
      "Access workouts, schedules, and operational screens",
    ],
  },
  "hermes-memory": {
    boundary:
      "The plugin depends on a configured Hermes/Honcho environment. Chat and dream scheduling are explicit write actions. Repository documentation and source differ on caching details, so no latency or scale guarantees are claimed here.",
    heading: "See what the agent remembers.",
    implementation:
      "A FastAPI router connects the dashboard to Honcho. The implementation can aggregate directly from PostgreSQL, with a paginated HTTP fallback. The frontend uses the host's React and UI primitives, while peers and relationship counts come from current memory rather than fixed examples.",
    problem:
      "Persistent agent memory becomes difficult to inspect when conclusions, relationships, and background processing are scattered across an API. Hermes Memory brings those views into the existing agent dashboard.",
    sources: [
      "https://github.com/mukulchugh/hermes-memory",
      "https://github.com/mukulchugh/hermes-memory/blob/main/dashboard/plugin_api.py",
    ],
    workflow: [
      "Inspect the memory pipeline and relationship graph",
      "Filter facts by peer, level, and search query",
      "Ask memory questions or request consolidation",
    ],
  },
  heroapp: {
    boundary:
      "Private venture. Customer adoption, launch status, revenue, and detailed ownership boundaries are not asserted here.",
    heading: "From a product idea to a mobile application.",
    implementation:
      "The owner-supplied scope links design and engineering rather than presenting a detached visual concept. The application's private features and implementation are not expanded beyond that record.",
    problem:
      "HeroApp was a co-founded mobile venture spanning product design, technical direction, and a working React Native application.",
    sources: [],
    workflow: [
      "Shape the product and interaction design",
      "Translate the direction into mobile screens",
      "Build the React Native application",
    ],
  },
  hostville: {
    boundary:
      "Presented as a prototype, not a verified operating rental business. Payment correctness, booking conflicts, security, and deployment readiness have not been audited. This entry uses hostville-app rather than duplicating the older Hostville repository.",
    heading: "A marketplace from both sides.",
    implementation:
      "The Next.js code includes server actions for listings and reservations, API routes for favorites and reviews, and Prisma-backed reservation creation. The interface separates listing details, calendars, search, authentication, and host input into dedicated components.",
    problem:
      "A lodging marketplace has two connected journeys: guests find and reserve a place, while hosts publish and manage it. Hostville explores both within a single web application.",
    sources: ["https://github.com/mukulchugh/hostville-app"],
    workflow: [
      "Browse and filter property listings",
      "Save favorites and choose reservation dates",
      "Manage listings and reservations",
    ],
  },
  memo: {
    boundary:
      "This is document-generation software, not a guarantee of tax or legal compliance. Receipt accuracy depends on the supplied information. No unverified claim about cloud storage or receipt-management services is included.",
    heading: "From rent details to a printable receipt.",
    implementation:
      "React and TypeScript manage the form and preview. The receipt component uses React PDF and date-fns to generate month-specific entries and group three receipts per page. Separate signature and sheet components keep the input and output flows distinct.",
    problem:
      "Preparing receipts for several months repeats the same tenant and property information. Memo collects those inputs once and turns them into a consistent set of receipt pages.",
    sources: [
      "https://github.com/mukulchugh/memo",
      "https://github.com/mukulchugh/memo/blob/main/src/components/RentReceipt.tsx",
    ],
    workflow: [
      "Enter property, tenant, and payment details",
      "Choose the receipt period and add a signature",
      "Preview the generated PDF",
    ],
  },
  "moshi-health": {
    boundary:
      "Private wellness project. It does not diagnose, provide medical advice, or claim clinical outcomes. The displayed artwork is illustrative rather than a real patient record.",
    heading: "Review health data over time.",
    implementation:
      "The existing record identifies SwiftUI and Apple health-device integrations. The public page describes the purpose and platform scope, not personal health records or a clinically validated analysis system.",
    problem:
      "This Moshi surface supports retrospective reflection on personal HealthKit, Apple Watch, and glucose information.",
    sources: [],
    workflow: [
      "Bring personal health records into view",
      "Review changes over time",
      "Use the history for personal reflection",
    ],
  },
  "moshi-personal-agent-fleet": {
    boundary:
      "Personal infrastructure. Private messages, memory contents, credentials, and operational topology are not portfolio material. No public-service availability is implied.",
    heading: "A personal workspace for ongoing thought.",
    implementation:
      "The owner-supplied record identifies a private VPS-based multi-agent system with long-term memory and tools. Hermes Memory is a separate public project that makes one memory system explorable; it is not a disclosure of the whole Moshi deployment.",
    problem:
      "Moshi brings personal research, reflection, memory, messaging, and agentic work into an ongoing workspace rather than treating each question as an isolated session.",
    sources: [],
    workflow: [
      "Collect questions and working context",
      "Use agents for research and reflection",
      "Carry useful context into later work",
    ],
  },
  openkvm: {
    boundary:
      "Both Macs need installation, network reachability, and macOS input permissions. This is input sharing, not remote display streaming. Signing and first-launch setup remain part of the installation experience.",
    heading: "Explicit control across two Macs.",
    implementation:
      "The owner Mac captures keyboard and pointer events and sends them over TCP/UDP for replay on the receiving Mac. Bonjour supports discovery, and pairing requires approval. The toggle remains local so control can be brought back to the source machine.",
    problem:
      "A work Mac and a personal Mac may use different Apple IDs. OpenKVM provides an explicit local-network way to share physical input without depending on Handoff or iCloud.",
    sources: ["https://github.com/mukulchugh/OpenKVM"],
    workflow: [
      "Run the menu-bar app on both Macs",
      "Discover and approve a paired peer",
      "Toggle input forwarding with a local hotkey",
    ],
  },
  pulse: {
    boundary:
      "Private infrastructure. This page is a scope statement, not a public architecture case study or a claim that unrestricted tool access is safe.",
    heading: "A shared access point for team tools.",
    implementation:
      "The portfolio identifies the integration boundary, not the internal topology. Protocol choices beyond MCP, access controls, deployment design, and operational details remain confidential.",
    problem:
      "Pulse is described in the existing project record as Quivly's private unified MCP gateway across team tools and systems.",
    sources: [],
    workflow: [
      "Connect approved tools",
      "Make tool capabilities available through MCP",
      "Use those capabilities in team workflows",
    ],
  },
  "quivly-agents": {
    boundary:
      "Private company infrastructure. This summary does not imply autonomous execution, specific safeguards, or measured results that have not been publicly documented.",
    heading: "Context that supports operational work.",
    implementation:
      "The existing record identifies backend and TypeScript work. Model configuration, execution design, integrations, and customer data are intentionally not described in the public portfolio.",
    problem:
      "This private project concerns the infrastructure behind Quivly's agent-powered workflows, using customer and product context to support team operations.",
    sources: [],
    workflow: [
      "Bring relevant context into a workflow",
      "Support agent-powered operational tasks",
      "Return work to the product surface",
    ],
  },
  "quivly-design-language": {
    boundary:
      "Private company work. No adoption counts, delivery-speed improvements, or accessibility certifications are claimed without evidence.",
    heading: "A common foundation for product UI.",
    implementation:
      "The owner-supplied scope covers React, TypeScript, reusable components, and a shared visual language for Quivly surfaces. Internal component APIs and product examples are not disclosed.",
    problem:
      "A fast-moving product needs reusable interface patterns so each feature does not introduce a separate visual and interaction vocabulary.",
    sources: [],
    workflow: [
      "Identify repeated interface needs",
      "Build reusable React components",
      "Apply consistent interaction patterns",
    ],
  },
  "quivly-platform": {
    boundary:
      "Private company work. No customer data, internal diagrams, unapproved screenshots, or inferred business results are included.",
    heading: "Product surfaces and the systems behind them.",
    implementation:
      "The owner-supplied record identifies TypeScript, full-stack work, and agent-powered product surfaces. Detailed implementation decisions are not published here because the underlying work is private.",
    problem:
      "This entry covers founding-team product and engineering work at Quivly. The public scope is deliberately broader than a single feature and narrower than a disclosure of internal architecture.",
    sources: [],
    workflow: [
      "Shape product-facing workflows",
      "Connect interface and application behavior",
      "Iterate within the product team",
    ],
  },
  "quivly-skills": {
    boundary:
      "A skill does not establish the accuracy or completeness of the underlying customer data. Private customer examples and company-internal implementation details are excluded.",
    heading: "Domain workflows an agent can reuse.",
    implementation:
      "The existing project record covers customer health reviews, churn signals, and QBR preparation. The project is a skills collection, distinct from the private Quivly platform and its agent infrastructure.",
    problem:
      "Customer-success work combines account context with repeatable preparation and review tasks. Quivly Skills packages that domain work as reusable agent instructions.",
    sources: ["https://github.com/quivly/skills"],
    workflow: [
      "Select a customer-success workflow",
      "Bring the relevant account context",
      "Review the agent's prepared output",
    ],
  },
  "rca-tool-grafana-plugin": {
    boundary:
      "No public source or demo is currently listed. Detection accuracy, incident-resolution time, and production scale are not claimed.",
    heading: "Bring incident evidence into the investigation.",
    implementation:
      "The existing project record identifies React, TypeScript, Grafana, and Go. The interface is framed as investigation support, not proof that a detected correlation is the root cause.",
    problem:
      "Root-cause investigation requires moving from a detected anomaly to the relevant service telemetry. This Grafana plugin focuses on that investigation step.",
    sources: [],
    workflow: [
      "Identify an anomaly or service disruption",
      "Surface the relevant telemetry",
      "Support an engineer's investigation",
    ],
  },
  setu: {
    boundary:
      "Private Quivly-related work. No repository link, internal screenshots, setup instructions, operational details, or unverified productivity metrics are published here.",
    heading: "A clearer way to manage development workspaces.",
    implementation:
      "Private developer tooling for worktree and development-environment management. This portfolio shares only the owner-approved purpose and team context; implementation details, configuration, infrastructure, and internal interfaces are intentionally omitted.",
    problem:
      "Working across branches and development environments creates coordination overhead. Setu brings workspace management into a tool built for the Quivly engineering team.",
    sources: [],
    workflow: [
      "Organize work around development workspaces",
      "Manage worktrees and their development environments",
      "Move between active work with a shared workspace tool",
    ],
  },
  tethr: {
    boundary:
      "Private alpha, not a general-purpose agent harness. Reusable skills, CLI alignment hooks, and broader evidence loops are marked as planned or directional on the product site.",
    heading: "Make the approved plan explicit.",
    implementation:
      "The private alpha connects authorized external agents through supported MCP clients. Proposals preserve their source, rationale, base version, and exact diff. A named person accepts or rejects the change; the release retains the approval record. Tethr itself runs no LLM.",
    problem:
      "People and coding agents can work from different understandings of the same plan. Tethr gives them versioned sections and a shared, reviewable current state.",
    sources: ["https://tethr.cc"],
    workflow: [
      "Create structured plan sections",
      "Review an agent proposal against its base version",
      "Seal accepted changes into a named release",
    ],
  },
  "zendash-global-admin-dashboard": {
    boundary:
      "Company project with no public source or demo listed. Internal data, permission design, screenshots, and measured outcomes are not disclosed.",
    heading: "A shared operational view.",
    implementation:
      "The owner-supplied project record identifies React, Next.js, Tailwind, GraphQL, and Apollo. It describes a cross-functional admin surface rather than a customer-facing product.",
    problem:
      "Zendash brought platform health, user activity, and issue-resolution information into an admin dashboard for Engineering, Customer Success, and Marketing at Zenduty.",
    sources: [],
    workflow: [
      "Review platform and user activity",
      "Locate information relevant to a team",
      "Support operational follow-up",
    ],
  },
  zepeats: {
    boundary:
      "Presented as a mobile project, not an operating delivery service. Live payment processing, order fulfillment, and backend availability are not verified. No order-volume or conversion claims are included.",
    heading: "An ordering flow on mobile.",
    implementation:
      "The public repository includes reusable category, cart-item, and checkout-modal components alongside the mobile app. The existing project record identifies Firebase and Stripe integrations; their current service configuration has not been exercised here.",
    problem:
      "Food ordering crosses several small interactions: browsing categories, choosing items, checking a cart, and confirming the next step. ZepEats brings those screens into a React Native application.",
    sources: ["https://github.com/mukulchugh/ZepEats"],
    workflow: [
      "Browse food categories and items",
      "Review the cart",
      "Continue through checkout screens",
    ],
  },
};
