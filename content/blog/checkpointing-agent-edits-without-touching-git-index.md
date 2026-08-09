---
title: "Checkpointing agent edits without touching git's index"
slug: "checkpointing-agent-edits-without-touching-git-index"
brief: "A pattern worth stealing, found while reading T3 Code's internals: snapshot an agent's entire working tree per turn without ever touching the user's real index, HEAD, or branches."
seoTitle: "Git-Based Checkpointing for AI Agent Edits Without Touching HEAD"
seoDescription: "How to snapshot an AI coding agent's working tree — tracked and untracked files — per turn using a throwaway GIT_INDEX_FILE, invisible to the user's normal git workflow."
publishedAt: "2026-08-10"
tags: ["Developer Tools", "Git", "Architecture"]
author: "Mukul Chugh"
---

Coding agents need undo. Not "revert this one file" — a full snapshot of the working tree before and after every turn, so a bad run can be rolled back cleanly. The obvious options are a shadow workspace (a whole second checkout the agent edits instead of yours) or auto-committing to a side branch. Both work. Both also mean the agent's checkpoints are visible in `git branch`, or the agent isn't editing your actual files at all.

Reading through T3 Code's internals, I found a third option that avoids both costs.

## Borrow git's index, don't touch the user's

Git's index (the staging area) is just a file — `.git/index` by default — and `git` will happily use a different one if you point `GIT_INDEX_FILE` at it. The checkpoint mechanism does exactly that:

1. Resolve `git rev-parse --git-common-dir` and create a randomly-named temp index file there.
2. Set `GIT_INDEX_FILE` to that temp path, plus fixed bot author/committer env vars.
3. `git read-tree HEAD` (if `HEAD` exists) to seed the temp index, then `git add -A` — against the *temp* index, so this captures untracked files too, and never stages anything in the user's real one.
4. `git write-tree`, then `git commit-tree` to create a commit object from that tree.
5. `git update-ref <checkpoint-ref> <commit-oid>` to park the commit under a custom ref namespace — not a branch, never checked out.

The temp index file is deleted in a cleanup block regardless of whether the steps above succeeded. Restore, diff, and delete all operate purely on the ref afterward: `git rev-parse --verify <ref>^{commit}`, `git diff`, `git update-ref -d`. No working-tree checkout required for any of it.

## Why this beats the two obvious options

A shadow workspace means the agent is never actually touching your files — every edit has to be synced back, and "what the agent is looking at" and "what you're looking at" can drift. Auto-committing to a branch touches real git state a user might stumble into (`git branch`, `git log --all`) and complicates anything that assumes commits mean something.

A ref that isn't a branch is the sweet spot: real git objects, real content-addressed storage, zero visibility in the commands people normally run, and the working tree it's checkpointing *is* the real one. The custom index file is the whole trick — it lets `git add -A` build a complete tree (tracked and untracked) without ever writing to the index the user's own `git status` reads from.

## Worth remembering the general shape

Whenever a tool needs to snapshot state that overlaps with a system the user already owns, look for the layer *inside* that system built for exactly this — an alternate index file, a detached ref, a separate namespace — before reaching for a parallel structure bolted on top. Git already has the primitive for "commit that isn't in any branch." Most checkpoint systems don't need to invent one.
