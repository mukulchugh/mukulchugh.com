---
title: "Don't dump the whole document into the context window"
slug: "progressive-tool-results-transcript-chunks"
brief: "Long tool results crowd out the answer. Search, summarize, then read pieces: progressive disclosure for the model."
seoTitle: "Progressive Disclosure for AI Tool Results and Long Documents"
seoDescription: "Context-window management for AI agents: retrieve first, summarize second, and only read the slice that matters."
publishedAt: "2026-03-02"
tags: ["AI Agents", "RAG", "Context Engineering"]
author: "Mukul Chugh"
---

Long documents make terrible default tool payloads. They burn the result budget, shove synthesis out of the window, and still leave the model skimming.

## The document-dump failure mode

A single "read this 40-page transcript" tool call looks convenient: one call, all the context. In practice it front-loads the entire artifact into the window whether or not most of it matters, and it does so before the model knows what it's looking for. The model ends up skimming inside its own context the same way a human skims a page they were handed with no table of contents: slowly, and with a real chance of missing the one paragraph that mattered.

## Search, summarize, then read

Three tools instead of one, used in sequence:

1. **Search** the artifact for the query at hand and return matching excerpts with locations, not the whole thing.
2. **Summarize** the excerpts: a condensed pass the model reasons over first, cheap to re-read, cheap to compare against other summaries.
3. **Read** the specific chunk in full, only when the summary shows that chunk is load-bearing for the answer.

Most turns stop at step 2. Step 3 is for when the summary itself says "there's a decision buried here" and the model needs the exact wording.

## Budget tool output like a scarce resource

Cap how much accumulated tool output a single turn is allowed to hold, and evict oldest-or-least-relevant first when a new result would exceed it. This forces the same discipline a size limit forces on working memory: the agent has to actively decide what's worth keeping instead of passively keeping everything it touched.

It's the same idea as progressive UI disclosure (collapsed by default, expand on demand) applied to context instead of pixels. The goal isn't "more tokens in." It's the right tokens left when it's time to answer.
