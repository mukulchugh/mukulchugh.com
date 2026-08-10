---
title: "Don't parse follow-ups out of the reply"
slug: "agent-suggested-actions-as-tools"
brief: "Streaming chat truncates. Markdown JSON fences rot. Suggested next steps belong in a typed side channel."
seoTitle: "AI Chat Suggested Actions as Structured Tools"
seoDescription: "Why AI chat follow-up buttons should be structured outputs, not parsed from markdown JSON in the assistant stream."
publishedAt: "2026-03-30"
tags: ["AI Chat", "UX Engineering", "AI Agents"]
author: "Mukul Chugh"
---

Chat products love "suggested next steps." Teams often stuff them into a fenced JSON blob inside the assistant message. Then the stream truncates, the fence breaks, and the UI shows nothing, or a half-parsed ghost.

## Why the JSON-in-markdown pattern breaks

The assistant's reply is a stream meant for a human to read, and it gets edited in flight: markdown renderers reflow it, streaming can cut off mid-token, and some UIs summarize or truncate long replies before showing them. A JSON fence surviving all of that intact is a coincidence, not a guarantee. When it breaks, the failure is silent: no error, just a button that never appears or a stray `{"action":` leaking into the visible text.

There's a second problem underneath the parsing one: a JSON blob the model wrote from scratch has no relationship to what actually happened in the turn. Nothing stops it from suggesting an action against a record the turn never looked up.

## A typed side channel

Emit suggestions as a real tool call, not prose:

```ts
suggest_actions({
  actions: [
    { label: "Open ticket #4821", action: "open_ticket", targetId: "4821" },
    { label: "Retry the failed sync", action: "retry_sync", targetId: "sync_9f2" }
  ]
})
```

The server validates the schema before the UI ever sees it: required fields, known `action` enum, `targetId` shaped right. A malformed call fails the tool invocation, not the render.

## Validate against what the turn actually touched

The schema check catches shape; a second check catches truth. Keep a set of IDs the turn actually fetched, created, or modified, and reject any suggested action whose `targetId` isn't in that set. This kills the class of bug where the model suggests acting on something it never actually saw: hallucinated ticket numbers, IDs from a previous turn, records that don't exist.

Fewer, clearer suggestions beat three clones of "look into this." Structured side channels survive streaming. Prose parsers don't.
