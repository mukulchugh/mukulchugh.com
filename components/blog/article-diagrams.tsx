import {
  IconArrowDown,
  IconArrowRight,
  IconArrowsSplit,
  IconBolt,
  IconBox,
  IconCheck,
  IconCode,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceWatch,
  IconFileText,
  IconFolder,
  IconGitBranch,
  IconKeyboard,
  IconLayersIntersect,
  IconLock,
  IconMouse,
  IconSearch,
  IconShieldCheck,
  IconUser,
  IconWaveSine,
  IconWifi,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import type { ReactNode } from "react";

export const articleSectionDiagrams: Record<string, Record<string, string>> = {
  "agent-suggested-actions-as-tools": {
    "A typed side channel": "side-channel",
    "Validate against what the turn actually touched": "ground-actions",
    "Why the JSON-in-markdown pattern breaks": "mixed-reply",
  },
  "agent-working-memory-injection-hygiene": {
    "Durable memory is a separate, slower boundary": "durable-memory",
    "Four rules that hold up": "memory-rules",
    "Where the trust hole opens": "trust-boundary",
  },
  "checkpointing-agent-edits-without-touching-git-index": {
    "Borrow git's index, don't touch the user's": "separate-index",
    "Why this beats the two obvious options": "checkpoint-options",
  },
  "phased-agent-turns-gather-analyze-synthesize": {
    "Three phases, one budget": "phases",
  },
  "progressive-tool-results-transcript-chunks": {
    "Search, summarize, then read": "progressive-results",
  },
  "self-hosted-personal-agent-fleet": {
    "The pieces, not the mega-agent": "fleet",
  },
};

export const shortArticleDiagrams: Record<
  string,
  { kind: string; anchor: string }
> = {
  "brik-react-to-native-widgets": {
    anchor: "it produces native view code ahead of time",
    kind: "compilation",
  },
  "ferry-apple-watch-mac-mic": {
    anchor: "Capture on watchOS, stream to the Mac",
    kind: "watch-audio",
  },
  "human-in-the-loop-agent-plans": {
    anchor: "agents **propose**, people **release**",
    kind: "human-review",
  },
  "mcp-gateway-for-team-tools": {
    anchor: "one **read-only MCP gateway**",
    kind: "gateway",
  },
  "openkvm-one-keyboard-two-macs": {
    anchor: "Keystrokes need a reliable channel (TCP)",
    kind: "transports",
  },
  "quivly-skills-agent-expertise": {
    anchor: "health reviews, churn checks, QBR prep",
    kind: "skills",
  },
};

function Figure({
  children,
  title,
  dark = false,
}: {
  children: ReactNode;
  title: string;
  dark?: boolean;
}) {
  return (
    <figure
      className={`not-prose m-0 min-w-0 rounded-[14px] p-5 ${dark ? "bg-[#101112] text-white" : "border border-border bg-muted/30 text-foreground"}`}
    >
      <figcaption className="mb-6 text-sm font-semibold leading-snug">
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

function Down() {
  return (
    <IconArrowDown
      aria-hidden="true"
      className="mx-auto my-3"
      size={20}
      stroke={1.5}
    />
  );
}

export function SupportingDiagram({ kind }: { kind: string }) {
  switch (kind) {
    case "mixed-reply":
      return (
        <Figure title="One reply carries two jobs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#101112] p-4 text-white">
              <p className="text-sm">An answer for a person…</p>
              <pre className="my-5 whitespace-pre-wrap break-all font-mono text-xs text-white/75">
                {'{"action":'}
              </pre>
              <span className="text-xs text-white/75">Stream cut short</span>
            </div>
            <ul className="space-y-4 text-xs leading-relaxed">
              {[
                "Truncation breaks the JSON fence",
                "Malformed data reaches the renderer",
                "Targets may never have been fetched",
              ].map((text) => (
                <li className="flex gap-2" key={text}>
                  <IconX aria-hidden="true" className="shrink-0" size={17} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </Figure>
      );
    case "side-channel":
      return (
        <Figure dark title="Separate prose from actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/25 p-4">
              <IconFileText aria-hidden="true" size={25} />
              <p className="mt-4 text-sm font-medium">Assistant reply</p>
              <p className="mt-2 text-xs leading-relaxed text-white/75">
                Natural language, streamed for the reader.
              </p>
            </div>
            <div className="rounded-xl bg-[#d2ff00] p-4 text-black">
              <IconCode aria-hidden="true" size={25} />
              <p className="mt-4 break-words font-mono text-xs">
                suggest_actions
              </p>
              <p className="mt-2 text-xs leading-relaxed">
                Required fields, known action, valid targetId.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/75">
            The server validates the tool call before the UI sees it.
          </p>
        </Figure>
      );
    case "ground-actions":
      return (
        <Figure title="Ground actions in this turn">
          <div className="rounded-xl border border-border bg-background p-4 text-sm">
            IDs fetched, created, or modified
          </div>
          <Down />
          <div className="rounded-xl bg-[#d2ff00] p-4 text-center text-sm font-medium text-black">
            Is targetId in that set?
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <IconCheck aria-hidden="true" size={18} />
              Yes: show action
            </div>
            <div className="flex items-center gap-2">
              <IconX aria-hidden="true" size={18} />
              No: reject it
            </div>
          </div>
        </Figure>
      );
    case "trust-boundary":
      return (
        <Figure title="Context is not an instruction">
          <div className="space-y-2 text-xs">
            {["Search result", "Fetched page", "Ticket body"].map((source) => (
              <div
                className="flex justify-between gap-3 border-b border-border py-2"
                key={source}
              >
                <span>{source}</span>
                <span className="text-muted-foreground">Untrusted</span>
              </div>
            ))}
          </div>
          <Down />
          <div className="rounded-xl bg-[#101112] p-4 text-white">
            <p className="text-sm font-medium">Scratchpad entry</p>
            <p className="mt-3 font-mono text-xs leading-relaxed">
              value · source · trust
            </p>
            <p className="mt-2 text-xs text-white/75">
              Quoted data, not commands.
            </p>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#d2ff00] p-4 text-black">
            <IconLock aria-hidden="true" className="shrink-0" size={22} />
            <p className="text-xs leading-relaxed">
              Standing instructions stay in a separate, protected slot.
            </p>
          </div>
        </Figure>
      );
    case "memory-rules":
      return (
        <Figure title="Four guards on working memory">
          <ol className="space-y-4">
            {[
              "Cap growth and evict oldest-first",
              "Neutralize instruction-shaped text",
              "Tag the source and trust of every entry",
              "Protect system and user instructions",
            ].map((text, index) => (
              <li className="flex gap-3 text-sm leading-relaxed" key={text}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#d2ff00] text-xs font-semibold text-black">
                  {index + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </Figure>
      );
    case "durable-memory":
      return (
        <Figure title="Different lifetimes, different scrutiny">
          <dl className="space-y-5">
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold">
                <IconBolt aria-hidden="true" size={20} />
                Within-turn scratchpad
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Fast writes. Bound size, tag provenance, filter untrusted input.
              </dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck aria-hidden="true" size={20} />
                Durable memory
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Deduplicate, flag contradictions, review changes to standing
                facts.
              </dd>
            </div>
          </dl>
        </Figure>
      );
    case "separate-index":
      return (
        <Figure title="One working tree, separate indexes">
          <div className="text-center">
            <IconFolder aria-hidden="true" className="mx-auto mb-3" size={36} />
            <p className="text-sm">The same real files</p>
          </div>
          <IconArrowsSplit
            aria-hidden="true"
            className="mx-auto my-5 rotate-180"
            size={30}
          />
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-muted p-3">
              <IconLayersIntersect
                aria-hidden="true"
                className="mx-auto mb-3"
                size={26}
              />
              <p className="font-mono text-xs">.git/index</p>
              <p className="mt-2 text-xs">Your staging stays intact</p>
            </div>
            <div className="rounded-xl bg-[#d2ff00] p-3 text-black">
              <IconLayersIntersect
                aria-hidden="true"
                className="mx-auto mb-3"
                size={26}
              />
              <p className="text-xs font-medium">Temporary index</p>
              <p className="mt-2 text-xs">Agent snapshot</p>
            </div>
          </div>
          <p className="mt-5 break-words font-mono text-xs text-muted-foreground">
            GIT_INDEX_FILE → write-tree → commit-tree → custom ref
          </p>
        </Figure>
      );
    case "checkpoint-options":
      return (
        <Figure title="The costs a custom ref avoids">
          <dl className="space-y-5">
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold">
                <IconFolder aria-hidden="true" size={20} />
                Shadow workspace
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                A second checkout needs synchronization. The agent and user can
                see different files.
              </dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="flex items-center gap-2 text-sm font-semibold">
                <IconGitBranch aria-hidden="true" size={20} />
                Automatic branch commits
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Checkpoints appear in ordinary Git history and branch workflows.
              </dd>
            </div>
          </dl>
        </Figure>
      );
    case "phases":
      return (
        <Figure title="A budgeted turn has a finish line">
          <ol className="space-y-6 px-2 pb-3">
            {[
              {
                detail: "Broad tool use; collect evidence.",
                title: "Gather",
                tone: "bg-gradient-to-br from-white via-[#e8e9eb] to-[#b7bbc0] text-[#101112] shadow-[0_8px_0_-2px_#969ba2,0_15px_18px_-10px_#10111255]",
              },
              {
                detail: "Targeted calls; fill specific gaps.",
                title: "Analyze",
                tone: "bg-gradient-to-br from-[#424548] to-[#101112] text-white shadow-[0_8px_0_-2px_#080909,0_15px_18px_-10px_#10111266]",
              },
              {
                detail: "Tools off. Answer from what you have.",
                title: "Synthesize",
                tone: "bg-gradient-to-br from-[#e4ff6e] to-[#c5ee00] text-black shadow-[0_8px_0_-2px_#98b900,0_15px_18px_-10px_#10111255]",
              },
            ].map((phase, index) => (
              <li
                className={index === 1 ? "ml-3" : index === 2 ? "ml-6" : ""}
                key={phase.title}
              >
                <div
                  className={`rounded-xl px-5 py-6 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] ${phase.tone}`}
                >
                  <p className="text-lg font-semibold">{phase.title}</p>
                  <p className="mt-2 text-xs leading-relaxed">{phase.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Figure>
      );
    case "progressive-results":
      return (
        <Figure dark title="Retrieve only what earns its place">
          <ol>
            {[
              {
                detail: "Matching excerpts with locations.",
                Icon: IconSearch,
                title: "Search",
              },
              {
                detail: "A condensed pass. Most turns stop here.",
                Icon: IconFileText,
                title: "Summarize",
              },
              {
                detail: "The exact chunk, only when needed.",
                Icon: IconFileText,
                title: "Read",
              },
            ].map(({ Icon, title, detail }, index) => (
              <li key={title}>
                {index > 0 && <Down />}
                <div
                  className={`flex gap-4 rounded-xl p-4 ${index === 2 ? "bg-[#d2ff00] text-black" : "border border-white/25"}`}
                >
                  <Icon aria-hidden="true" className="shrink-0" size={24} />
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-2 text-xs leading-relaxed">{detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Figure>
      );
    case "fleet":
      return (
        <figure className="not-prose m-0 min-w-0 space-y-3">
          <figcaption className="text-sm font-semibold leading-snug">
            A small system, with real boundaries
          </figcaption>
          <div className="rounded-[14px] border border-border bg-muted/30 p-5 text-foreground">
            <IconUser aria-hidden="true" className="mx-auto" size={32} />
            <Down />
            <div className="rounded-xl bg-[#d2ff00] p-4 text-center text-sm font-semibold text-black">
              One model gateway
            </div>
            <Down />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                {
                  detail: "Per-domain tiers",
                  Icon: IconDatabase,
                  title: "Memory",
                },
                {
                  detail: "Coordinate handoffs",
                  Icon: IconArrowsSplit,
                  title: "Shared board",
                },
                {
                  detail: "Scoped jobs and tools",
                  Icon: IconBox,
                  title: "Specialists",
                },
              ].map(({ Icon, title, detail }) => (
                <div className="min-w-0" key={title}>
                  <Icon aria-hidden="true" className="mx-auto mb-3" size={25} />
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <blockquote className="m-0 rounded-[14px] bg-[#d2ff00] p-6 text-xl font-semibold leading-snug text-black">
            Less sci-fi assistant, more private operating system for my own
            work.
          </blockquote>
        </figure>
      );
    case "compilation":
      return (
        <Figure title="From JSX to a native widget">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-5">
            <IconCode aria-hidden="true" size={28} />
            <p className="text-sm">Describe the widget in React / JSX</p>
          </div>
          <Down />
          <div className="rounded-xl bg-[#d2ff00] p-5 text-black">
            <IconBolt aria-hidden="true" size={30} />
            <p className="mt-3 text-lg font-semibold">
              Brik compiles ahead of time
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              SwiftUI on iOS
              <br />
              Jetpack Compose on Android
            </p>
          </div>
          <Down />
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-5">
            <IconBox aria-hidden="true" className="shrink-0" size={28} />
            <div>
              <p className="text-sm font-medium">Native widget on the device</p>
              <p className="mt-2 text-xs text-muted-foreground">
                No JavaScript runtime in the widget.
              </p>
            </div>
          </div>
        </Figure>
      );
    case "watch-audio":
      return (
        <Figure title="From wrist to system input">
          <div className="grid grid-cols-[1fr_.7fr_1fr] items-center gap-2 py-8 text-center">
            <div className="min-w-0">
              <IconDeviceWatch
                aria-hidden="true"
                className="mx-auto h-20 w-full max-w-20"
                stroke={1.25}
              />
              <p className="mt-4 text-xs leading-relaxed">Capture on watchOS</p>
            </div>
            <div className="min-w-0 text-lime-700 dark:text-[#d2ff00]">
              <IconWaveSine
                aria-hidden="true"
                className="h-10 w-full"
                stroke={1.5}
              />
              <IconArrowRight
                aria-hidden="true"
                className="mx-auto mt-2"
                size={24}
              />
            </div>
            <div className="min-w-0">
              <IconDeviceDesktop
                aria-hidden="true"
                className="mx-auto h-20 w-full max-w-20"
                stroke={1.25}
              />
              <p className="mt-4 text-xs leading-relaxed">
                Mac microphone input
              </p>
            </div>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <li>Battery</li>
            <li>Latency</li>
            <li>Sample-rate mismatches</li>
          </ul>
        </Figure>
      );
    case "human-review":
      return (
        <Figure title="Make the decision reviewable">
          <ol className="space-y-3">
            <li className="rounded-xl bg-[#101112] p-5 text-white">
              <p className="text-lg font-semibold">Agent draft</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Gather context. Draft options. Show evidence and what accepting
                the proposal does.
              </p>
            </li>
            <li>
              <Down />
              <div className="rounded-xl bg-[#d2ff00] p-5 text-black">
                <p className="text-lg font-semibold">Human review</p>
                <p className="mt-3 text-sm leading-relaxed">
                  Check the change, evidence, and consequences.
                </p>
              </div>
            </li>
            <li>
              <Down />
              <div className="rounded-xl bg-[#101112] p-5 text-white">
                <p className="text-lg font-semibold">Release</p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  A person owns sends, external communication, and the outcome.
                </p>
              </div>
            </li>
          </ol>
        </Figure>
      );
    case "gateway":
      return (
        <Figure title="Many tools, one governed door">
          <div className="grid grid-cols-3 gap-x-3 text-center text-xs">
            {["Tool A", "Tool B", "Dashboard"].map((label) => (
              <div className="min-w-0" key={label}>
                <div className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-2">
                  <IconBox aria-hidden="true" size={22} />
                  {label}
                </div>
                <div
                  aria-hidden="true"
                  className="mx-auto h-6 w-px bg-foreground/40"
                />
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="mx-auto w-2/3 border-t border-foreground/40"
          />
          <Down />
          <div className="rounded-xl bg-[#d2ff00] p-6 text-center text-black">
            <p className="text-2xl font-bold">MCP gateway</p>
            <p className="mt-3 text-sm">
              Read-only · Authentication · Policy · Audit
            </p>
          </div>
          <Down />
          <div className="flex items-center justify-center gap-3 py-3">
            <IconBox aria-hidden="true" size={28} />
            <span className="text-lg font-medium">Agents</span>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            A conceptual boundary, not a map of internal integrations.
          </p>
        </Figure>
      );
    case "transports":
      return (
        <Figure dark title="One keyboard, two Macs">
          <div className="mb-6 flex items-start justify-between gap-6 text-center text-xs">
            {["Source Mac", "Other Mac"].map((label) => (
              <div key={label}>
                <IconDeviceDesktop
                  aria-hidden="true"
                  className="mx-auto mb-3"
                  size={56}
                  stroke={1.25}
                />
                {label}
              </div>
            ))}
          </div>
          <dl className="space-y-5 border-x border-white/25 px-3">
            {[
              {
                Icon: IconKeyboard,
                note: "Reliable and ordered",
                protocol: "TCP",
                title: "Keystrokes",
              },
              {
                Icon: IconMouse,
                note: "Occasional dropped frames are acceptable",
                protocol: "UDP",
                title: "Pointer movement",
              },
              {
                Icon: IconWifi,
                note: "Find the other Mac on the local network",
                protocol: "Bonjour",
                title: "Discovery",
              },
            ].map(({ Icon, title, protocol, note }) => (
              <div key={title}>
                <dt className="flex items-center gap-3 text-sm">
                  <Icon aria-hidden="true" size={23} />
                  {title}
                  <span className="ml-auto font-mono text-xs text-[#d2ff00]">
                    {protocol}
                  </span>
                </dt>
                <dd className="mt-3 text-xs leading-relaxed text-white/75">
                  <span
                    aria-hidden="true"
                    className="mb-2 flex items-center text-[#d2ff00]"
                  >
                    <span className="h-px flex-1 bg-current" />
                    <IconArrowRight className="-ml-1 shrink-0" size={20} />
                  </span>
                  {note}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-7 border-t border-white/25 pt-5 text-xs leading-relaxed text-white/80">
            The forwarding-off hotkey must keep working while input is sent
            elsewhere.
          </p>
        </Figure>
      );
    case "skills":
      return (
        <Figure title="Expertise that travels across tools">
          <div className="rounded-xl bg-[#f0f1ed] px-5 pb-8 pt-5 text-[#101112]">
            <Image
              alt="Quivly"
              className="mb-7 h-12 w-12 rounded-xl bg-[#caff32] p-2"
              height={52}
              src="/design/brand/quivly-icon.ico"
              unoptimized
              width={52}
            />
            <ol className="space-y-3 px-2">
              {["Knowledge", "Tools", "Context", "Actions"].map(
                (layer, index) => (
                  <li
                    className={`rounded-xl px-5 py-4 text-sm font-semibold shadow-[0_6px_10px_-5px_#10111255] [transform:perspective(600px)_rotateX(12deg)_rotateY(-8deg)] ${index === 3 ? "bg-[#d2ff00]" : "bg-white/90"}`}
                    key={layer}
                  >
                    {layer}
                  </li>
                )
              )}
            </ol>
          </div>
          <dl className="mt-5 divide-y divide-border">
            {[
              ["Health reviews", "Workflow judgment"],
              ["Churn checks", "Signals worth noticing"],
              ["QBR prep", "Operational expertise"],
            ].map(([job, detail]) => (
              <div
                className="flex justify-between gap-4 py-4 text-sm"
                key={job}
              >
                <dt>{job}</dt>
                <dd className="text-right text-xs text-muted-foreground">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Specific to a job. Reviewable. Portable. Versioned.
          </p>
        </Figure>
      );
    default:
      return null;
  }
}
