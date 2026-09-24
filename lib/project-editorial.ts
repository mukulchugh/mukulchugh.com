// Editorial headings describe the existing public record, not outcomes or metrics.
export const overviewTitles: Record<string, string> = {
  altr: "Keep the intent with the work.",
  brik: "One codebase. Native surfaces.",
  "cryptomedia-cryptocurrency-tracker": "Markets and your watchlist.",
  ferry: "Your Watch. Your Mac microphone.",
  heroapp: "From concept to mobile app.",
  "moshi-health": "Reflection over time.",
  "moshi-personal-agent-fleet": "Memory, research, and reflection.",
  openkvm: "One keyboard. Two Macs.",
  pulse: "One gateway across the team’s tools.",
  "quivly-agents": "Customer context to team workflows.",
  "quivly-design-language": "A shared UI foundation.",
  "quivly-platform": "Product and the systems behind it.",
  "quivly-skills": "Agent skills for customer success.",
  "rca-tool-grafana-plugin": "Investigating incidents in Grafana.",
  tethr: "One plan. Built together.",
  "zendash-global-admin-dashboard": "One dashboard. Many teams.",
  zepeats: "From browsing to delivery.",
};

export const overviewBodies: Record<string, string> = {
  altr: "Requests lose context as they move between planning, implementation, and review. Altr is designed to preserve that trail: capture the original signal, draft acceptance criteria, work in isolated Git worktrees, and review changes against the initial goal. Its early-access direction keeps human approval in the loop rather than treating generated code as finished work.",
  tethr:
    "People contribute intent and constraints; connected agents bring back what implementation reveals. In the private alpha, an authorized agent proposes a section update against the version it read. A person reviews the source, rationale, and exact diff before accepting or rejecting it. Accepted sections form an immutable named release. Tethr runs no LLM of its own: it holds the shared plan and the record of who approved each change. Reusable skills and CLI hooks are planned, not current alpha features.",
};

export const focusPanels: Record<string, { title: string; body: string }> = {
  "cryptomedia-cryptocurrency-tracker": {
    body: "Live market data from CoinGecko. A personal watchlist backed by Firebase.",
    title: "Follow your watchlist.",
  },
  "moshi-personal-agent-fleet": {
    body: "Memory. Research. Reflection. A private workspace built for my own use.",
    title: "A workspace for reflection.",
  },
  tethr: {
    body: "A proposal is not the current plan. A named person reviews the exact change before it becomes part of a sealed release.",
    title: "Propose. Review. Release.",
  },
};
