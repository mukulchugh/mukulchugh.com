---
title: "Give multi-step agents a finish line"
slug: "phased-agent-turns-gather-analyze-synthesize"
brief: "Unbounded tool loops burn tokens and never commit. Budget the turn: gather, think, then answer with tools off."
seoTitle: "Phased AI Agent Workflows: Gather, Analyze, Synthesize"
seoDescription: "How to structure multi-step AI agent turns so tools eventually stop and the model actually answers."
publishedAt: "2026-06-14"
tags: ["AI Agents", "Architecture", "Product Engineering"]
author: "Mukul Chugh"
---

"Keep calling tools until you're done" sounds flexible. In practice it means the model never finishes — it spends the whole budget gathering and never commits.

A better default: **phase the turn**. Early steps collect. Middle steps make sense of what came back. Late steps answer with tools turned off.

## Three phases, one budget

- **Gather.** Tools are cheap here, breadth is the goal. The model is allowed to be redundant — two searches that half-overlap beat one search that missed the answer.
- **Analyze.** Fewer, more targeted calls. The model should be filling specific gaps it noticed in the gathered material, not exploring anymore.
- **Synthesize.** Tools off. The model writes the answer from what it already has. No exceptions — if it's missing something at this point, it says so instead of reaching for one more call.

The phase boundary isn't a suggestion in the system prompt; it's enforced by which tools are actually available to the model at each step. A model can't loop through "just one more search" if search isn't in its tool list anymore.

## Sizing the phases to the budget

The ratio, not the absolute count, is what transfers across turn lengths:

| Step budget | Gather | Analyze | Synthesize |
|---|---|---|---|
| 6 steps | 3 | 2 | 1 |
| 20 steps | 12 | 6 | 2 |
| 40 steps | 22 | 14 | 4 |

Synthesize barely grows — past a couple of steps of pure writing, more steps there means the model is stalling, not improving the answer. Gather and Analyze absorb almost all of the extra budget on longer turns.

## The forced last mile

Reserve the last slice of the budget — by step count, not by a soft "wrap up soon" instruction — and hard-disable tools once the turn enters it. Unbounded autonomy is a research vibe; product agents need a forced last mile that puts an answer on the page even when the investigation feels unfinished. A committed, caveated answer beats a turn that times out mid-search.
