---
title: "Skip your own API when you own the database"
slug: "skip-your-own-api-when-you-own-the-database"
brief: "A paginated REST endpoint took 120 seconds to aggregate 123k rows. One raw SQL query against the same self-hosted Postgres took 90 milliseconds."
seoTitle: "When to Bypass Your Own REST API for a Direct SQL Query"
seoDescription: "A self-hosted service's own REST API paginates at 100 rows/page with no server-side filters. The fix: query its Postgres directly, with the REST path kept as a fallback."
publishedAt: "2026-07-28"
tags: ["Infrastructure", "PostgreSQL", "Performance"]
author: "Mukul Chugh"
---

A dashboard I built pages through a memory service's REST API to aggregate facts for an overview screen. The endpoint caps at 100 rows per page and has no server-side filters or grouping, so aggregating around 123k rows meant roughly 1,230 sequential HTTP calls, all the way through Python. About two minutes for a screen that should load instantly.

## The fix wasn't a bigger cache

Caching would have hidden the problem, not solved it: the first load, and every load after data changed, would still pay the full cost. The actual fix was smaller than that: skip the app-layer API entirely and run one query against the database underneath it.

```sql
SELECT observer, observed, level, count(*)
FROM documents
WHERE workspace_name = $1 AND deleted_at IS NULL
GROUP BY observer, observed, level
```

One `GROUP BY` replaces roughly 1,230 sequential paged HTTP calls. The overview endpoint went from ~120 seconds to ~90 milliseconds.

## This only works because you own both ends

The move only exists because the service is self-hosted: I control the schema, the Postgres instance is on the same box, and there's no API contract with a third party to respect. Against someone else's hosted service, this is exactly the kind of "just hit the database directly" shortcut that breaks the first time they change a column without telling you. Against your own self-hosted stack, the schema *is* the contract, and the REST layer's pagination limit is a self-imposed constraint you're allowed to route around.

## Keep the slow path as a fallback

The direct-query path only activates when a `HONCHO_DB_URL`-style connection string is actually set. If it's missing, or the database is unreachable, the code falls back to the original paged HTTP crawl. Both paths return the identical response shape, so the caller never knows which one ran. That matters more than the speedup itself: a self-hosted service you depend on daily should degrade to *slow*, never to *broken*, when the fast path isn't available.

The general shape: know where you're allowed to reach past your own abstraction, and never remove the door you came in through.
