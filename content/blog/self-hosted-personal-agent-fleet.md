---
title: "A personal agent fleet is just a small OS"
slug: "self-hosted-personal-agent-fleet"
brief: "I run messaging, memory, tools, and delegated agents on a VPS. Less sci-fi assistant, more private operating system for my own work."
publishedAt: "2025-05-14"
tags: ["AI Agents", "Infrastructure"]
author: "Mukul Chugh"
---

ChatGPT in a tab is a tool. What I wanted was closer to an OS for personal work: something that remembers, can message me, can call tools, and can hand jobs to narrower agents without a weekly re-brief.

So I run a self-hosted fleet on a VPS. Private by default. Messaging, long-term memory, tools, specialists with clear jobs.

## The pieces, not the mega-agent

One mega-agent that does everything becomes a confused intern: it can't hold a consistent persona across finance, health, and code, and every new capability risks breaking the last one. A small fleet with real boundaries works better:

- **One model gateway** in front of everything, so swapping or routing between models is a config change, not a rewrite across every specialist.
- **A memory service with per-domain tiers**, not one undifferentiated blob. What's relevant to a finance question shouldn't be the same slice the coding specialist pulls from: same substrate, different partitions, different write permissions.
- **A shared coordination board** every specialist reads from and writes to, so a handoff between domains doesn't lose context the way a fresh chat tab would. This is the part that actually makes it feel like one system instead of five bots that happen to share a login.
- **Narrow specialists with a stated job**, each scoped to its own tier and its own tools, confirmed by me for anything that isn't reversible.

## Proactive, not just reactive

A chat box only does something when you type into it. The fleet runs on cron, too, not to feel autonomous for its own sake, but because some jobs are genuinely better done on a schedule than on demand:

- A **nightly consolidation pass** that reflects on the day's raw memory writes and folds them into something denser, so the tier doesn't just grow linearly forever.
- A **periodic tick** that re-reads the shared board and re-broadcasts what's currently salient: the mechanism that keeps every specialist aware of what the others are mid-way through.
- A **calibration pass** that checks past predictions against what actually happened and adjusts confidence accordingly, instead of treating every guess as equally trustworthy forever.
- An **invalidation sweep** that expires memory once it's stopped being true, rather than letting contradictions pile up and leaving retrieval to guess which version is current.

## Boring ops, on purpose

None of the above matters if the box falls over. Backups run nightly and get verified before they leave the machine, not after. A heartbeat script pages on failure, not just logs it. The interesting part is the architecture; the operational discipline underneath it is deliberately unremarkable.

I won't list hostnames or schemas here. The idea is enough: personal AI gets interesting when you stop optimizing the chat box and start building a system you actually live in.
