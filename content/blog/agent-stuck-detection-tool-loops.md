---
title: "Agents don't fail quietly: they loop"
slug: "agent-stuck-detection-tool-loops"
brief: "Multi-step tool agents rarely crash. They repeat themselves until the budget dies. Stuck detection is the fix."
seoTitle: "How to Detect AI Agent Tool Loops and Stuck Steps"
seoDescription: "A practical pattern for noticing when multi-step AI agents stop making progress, and recovering without another prompt plea."
publishedAt: "2026-07-06"
tags: ["AI Agents", "Engineering", "LLM Ops"]
author: "Mukul Chugh"
---

An agent can look busy for a long time and still be stuck. The model isn't always confused. Sometimes it's looping: same tool, same arguments, same dead end, same polite filler.

A longer system prompt rarely fixes that. What helps is treating stuckness as a **control-plane concern**, sitting outside the model's own reasoning, that watches whether steps still change the state of the world.

## What "stuck" actually looks like

Three shapes cover most of it:

- **Exact repeats**: same tool, same arguments, twice in a row. No new information can come back.
- **No-op results**: the arguments change but the tool's output doesn't (a search that returns the same five links, a read that hits the same file). Motion without progress.
- **Oscillation**: A, then B, then A again, with the agent visibly re-deciding something it already decided two steps ago.

None of these need the model to say "I'm stuck." They're detectable from the outside, from the shape of the transcript alone.

## A cheap detector

Hash each tool call as `(tool_name, normalized_args)` and keep a short ring buffer of the last N call-signatures plus a rolling hash of their results:

```python
seen = {}
for step in recent_steps:
    key = hash(step.tool, normalize(step.args))
    seen[key] = seen.get(key, 0) + 1
    if seen[key] >= REPEAT_LIMIT:
        flag_stuck(reason="repeat", key=key)
    if step.result_hash == prev_result_hash_for(step.tool):
        flag_stuck(reason="no-op")
```

`REPEAT_LIMIT` of 2–3 catches real loops without flagging legitimate re-checks (polling a job status is supposed to repeat, so exclude those tools explicitly rather than tuning the threshold around them).

## What to do once you catch it

Detection is only useful if something acts on it. Three escalating responses work well together:

1. **Nudge**: inject a short system note ("you've called X three times with no new result; try a different approach or explain the blocker") and let the model self-correct once.
2. **Force a branch cut**: disable the looping tool for the rest of the turn.
3. **End the turn**: if the nudge doesn't land, stop calling tools and make the model answer with what it has, explicitly flagging the gap rather than hiding it.

Rate limits already get hard gates. Tool loops deserve the same honesty: a budget that runs out on purpose beats one that quietly bleeds to zero.
