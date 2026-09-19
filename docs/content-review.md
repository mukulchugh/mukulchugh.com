# Content corrections for owner review

**DRAFT NOT APPLIED.** These are proposed edits, not verified replacement facts. Published Markdown, publication dates, and project data have not been changed by this review. Every passage below remains subject to owner review. The large editorial covers and existing visual identity are to be preserved.

Reviewed all 15 files in `content/blog/`, the shared blog/project page templates, and project records in `lib/data.ts`. Line references identify the text at review time and may shift after other edits. No external source, benchmark, infrastructure audit, or historical publication record was consulted. Statements about those subjects are verification questions, not findings that the author is wrong.

## Review priorities

1. Correct misleading technical guidance: scratchpad filtering, checkpoint restoration, and the loop-detection example.
2. Resolve chronology with the owner: the Swiggy retrospective and Quivly Skills announcement.
3. Verify benchmark and operational claims before retaining exact numbers or present-tense assertions.
4. Apply optional copy refinements only where they improve precision. Keep the short project notes short.

## 1. Checkpointing agent edits without touching git's index

**DRAFT NOT APPLIED** · `content/blog/checkpointing-agent-edits-without-touching-git-index.md` · Published date retained: `2026-08-10`.

The alternate-index explanation is useful. “Entire working tree,” “restore,” and “zero visibility” overstate what the listed commands establish. Ignored files are not ordinarily added by `git add -A`; an alternate index does not by itself capture every filesystem property or nested repository's working tree.

Proposed replacement for the brief (line 4):

> A pattern I found while reading T3 Code's internals: use a separate Git index to checkpoint tracked files and untracked files that Git does not ignore, without changing the user's staging area, HEAD, or branches.

Proposed replacement for numbered step 1 (line 20):

> Resolve `git rev-parse --git-common-dir` and choose a unique temporary index path there. Let Git initialize a valid index at that path; an empty file is not a valid Git index.

Proposed replacement for step 3 (line 22):

> Seed the temporary index with `git read-tree HEAD`, or `git read-tree --empty` in a repository without a commit, then run `git add -A` against that index. This stages tracked changes and untracked files that Git does not ignore without changing the user's index.

Proposed replacement for the restore paragraph (line 26):

> Clean up the temporary index whether checkpoint creation succeeds or fails. Once the checkpoint exists, `git rev-parse --verify <ref>^{commit}` can validate its ref, `git diff` can compare it, and `git update-ref -d` can remove the ref. Restoring file contents is a separate operation: it must define how to handle changes made after the checkpoint and files absent from the saved tree. These commands do not themselves restore the working tree.

Proposed replacement for the visibility paragraph (line 32):

> A custom ref keeps checkpoints out of the branch list while retaining normal Git objects and content-addressed storage. It is not invisible: commands such as `git log --all` can include it. The separate index lets `git add -A` assemble the checkpoint without changing the user's staging area. This captures Git-managed file content, not a complete filesystem backup.

Owner verification: Which public T3 Code revision and implementation was inspected? Is the claimed cleanup behavior verified there? Does its restore path protect later user edits, ignored files, and submodules? Add a source link only after locating the exact public implementation. Review the opening and SEO description for the same “full/entire” scope claim before publication.

## 2. Skip your own API when you own the database

**DRAFT NOT APPLIED** · `content/blog/skip-your-own-api-when-you-own-the-database.md` · Published date retained: `2026-07-28`.

The bottleneck and SQL make this one of the strongest pieces. Exact timings, schema ownership, and fallback behavior need different kinds of evidence.

If the author confirms the original measurements, proposed replacement for line 25:

> In this setup, one `GROUP BY` replaced roughly 1,230 sequential paged HTTP calls. I measured the overview endpoint at about 120 seconds through the REST path and about 90 milliseconds through the direct-query path. These are measurements from that workload, not a general speedup guarantee.

If the measurement cannot be substantiated, proposed replacement instead:

> One `GROUP BY` can replace the paginated crawl for this aggregation. The useful comparison is end-to-end response time for the same data and response shape, including connection setup and any fallback work.

Proposed replacement for the ownership paragraph (line 29):

> Direct access is an option only when you are authorized to query the database and can maintain the integration. Self-hosting does not make the schema stable or remove the API's authorization and filtering rules. A direct query must preserve those rules, return equivalent results, and be checked when the service changes.

Until implementation is verified, proposed replacement for the fallback paragraph (line 33):

> Keep an explicit configuration switch for direct database access and preserve the original API path. If the direct connection is unavailable, the fallback should return the same response shape. Give both paths clear time limits: a two-minute fallback is a different user experience from a fast response, and the caller should not wait indefinitely.

Owner verification: Are 123k rows, 100 rows/page, 120 seconds, and 90 milliseconds from the same workload? Were timings cold or warm, one sample or repeated, and did they measure the complete endpoint? Is the service schema actually controlled by the author or owned by an upstream package? Does the current implementation enforce equivalent scope and bounded fallback behavior? Retain or replace the matching numbers in the brief/SEO copy consistently; do not invent benchmark conditions.

## 3. Agents don't fail quietly: they loop

**DRAFT NOT APPLIED** · `content/blog/agent-stuck-detection-tool-loops.md` · Published date retained: `2026-07-06`.

Keep the observable failure patterns. Repetition is a signal, not proof, and the code block is not executable Python as written.

Proposed replacement for the exact-repeat bullet (line 20):

> **Exact repeats:** the same tool and arguments recur without an explained reason or useful change in results. Repetition can signal a loop, but polling, retries, and changing external state can make repeated calls legitimate.

Proposed replacement for the detector introduction and code block (lines 28–39):

> Keep a short window of tool names, canonicalized arguments, and result signatures. Exclude expected polling and apply tool-specific retry rules. The following is pseudocode for the repeat signal, not a complete detector:

```text
counts = empty map
for step in recent_steps:
    if expected_poll_or_retry(step):
        continue
    signature = (step.tool, canonicalize(step.args))
    counts[signature] += 1
    if counts[signature] >= repeat_limit:
        flag_for_review("repeated call", signature)
```

Proposed replacement for the threshold claim (line 41):

> A repeat limit of two or three is an illustrative starting point, not a validated threshold. Tune it against traces from the workflow, including legitimate retries and polls. Compare results and task progress before deciding to interrupt the run.

Owner verification: Were these thresholds tested, and on which workflows? If no evaluation exists, retain the illustrative framing. The pseudocode intentionally leaves canonicalization, windowing, and per-tool retry policy unspecified and must stay labeled pseudocode.

## 4. Give multi-step agents a finish line

**DRAFT NOT APPLIED** · `content/blog/phased-agent-turns-gather-analyze-synthesize.md` · Published date retained: `2026-06-14`.

The three-phase structure is easy to understand. Scope it to research-and-answer turns rather than all autonomous work.

Proposed replacement for lines 12–14:

> A research agent can spend its entire turn collecting information and leave no budget for an answer. One useful default is to phase that kind of turn: gather evidence, resolve important gaps, then synthesize what the evidence supports.

Proposed replacement for the Synthesize bullet (line 20):

> **Synthesize.** For a bounded research turn, stop routine retrieval and write from the evidence already collected. State unresolved gaps. Tasks that require implementation or verification need their own completion rules; a budget limit should not turn unfinished work into a completion claim.

Proposed replacement for the table introduction (line 26):

> These allocations are illustrative starting points, not measured optima. Adjust them to the cost of each step and the evidence the task requires.

Proposed replacement for line 34:

> Reserve enough budget to produce a useful answer, but do not assume that a fixed number of steps means the same amount of work across models or tasks.

Proposed replacement for the closing paragraph (line 38):

> Enforce the budget in the orchestration layer rather than relying only on a reminder to wrap up. When a research turn reaches its limit, return the supported findings and remaining uncertainty. When an execution task reaches its limit, report what is complete and what still needs work.

Owner verification: Are the ratios based on experiments or simply a proposed policy? Keep the latter explicit unless results are available.

## 5. Agent scratchpads need sanitation, not vibes

**DRAFT NOT APPLIED** · `content/blog/agent-working-memory-injection-hygiene.md` · Published date retained: `2026-05-11`.

The trust-boundary problem is worth explaining. Imperative filtering and provenance labels must not be presented as sufficient protection against prompt injection.

Proposed replacement for rule 2 (line 23):

> **Keep retrieved text as data.** Preserve source text and identify it as untrusted evidence, not an instruction. Phrase filters can miss attacks or alter useful evidence, so they are not a security boundary. Any filtering is a secondary measure; authorization and tool permissions must be enforced outside the model.

Proposed replacement for rule 3 (line 24):

> **Record provenance on every entry.** Store the source and trust classification alongside the value. This supports inspection and policy decisions, but a label alone does not guarantee that the model will handle the content safely.

Proposed replacement for rule 1 (line 22):

> **Bound the scratchpad.** Limit entry count or size and define an eviction policy. Preserve evidence needed for the current task or make it retrievable again. Size limits control resource use; they do not prevent prompt injection.

Proposed replacement for the durable-memory paragraph (line 29):

> Durable memory can affect future sessions, so writes deserve explicit policy: source attribution, conflict handling, appropriate authorization, and a way to correct or remove entries. Within-turn scratchpads need those trust boundaries too. Neither speed nor persistence makes retrieved text an instruction.

Optional title replacement: “Agent scratchpads need a trust boundary.”

Owner verification: Is this a design proposal or a description of deployed controls? Which controls are enforced in code, and which only instruct the model? Do not imply that any private system has passed a security evaluation.

## 6. Don't parse follow-ups out of the reply

**DRAFT NOT APPLIED** · `content/blog/agent-suggested-actions-as-tools.md` · Published date retained: `2026-03-30`.

Preserve the separation between human prose and structured UI data. Add authorization and incomplete-stream handling.

Proposed replacement for line 33:

> Validate completed suggestion payloads before the UI treats them as actions: required fields, a known action type, and a valid target identifier. Keep incomplete streamed calls out of the actionable UI, and handle validation failures explicitly.

Proposed replacement for line 37:

> Schema validation catches shape, not truth or permission. A set of records fetched or changed during the turn can help reject invented targets. It does not authorize the suggested action. Recheck the user's permission and the target's current state when the action is executed, and require confirmation where the action warrants it.

Proposed replacement for the closing paragraph (line 39):

> Fewer, clearer suggestions beat three versions of “look into this.” A structured channel makes validation and rendering more predictable, provided incomplete calls and execution failures are handled explicitly.

Owner verification: Is the snippet illustrative or implemented? No additional factual claim is needed if it remains a recommended pattern.

## 7. Don't dump the whole document into the context window

**DRAFT NOT APPLIED** · `content/blog/progressive-tool-results-transcript-chunks.md` · Published date retained: `2026-03-02`.

Keep the progressive retrieval pattern. Avoid letting summary quality become an unexamined gate for primary evidence.

Proposed replacement for line 26:

> Summaries can be enough for initial orientation. Read the underlying passage when the answer depends on exact wording, a disputed claim, or evidence the user needs to verify. A summary's failure to flag a passage is not proof that the passage is irrelevant.

Proposed replacement for line 30:

> Bound accumulated tool output and keep source locations so discarded text can be retrieved again. Before eviction, protect the evidence and constraints the current answer depends on; oldest-first removal is not always the right policy.

Owner verification: Is “Most turns stop at step 2” backed by usage data? If not, remove the frequency claim rather than supplying a number.

## 8. One keyboard, two Macs

**DRAFT NOT APPLIED** · `content/blog/openkvm-one-keyboard-two-macs.md` · Published date retained: `2026-01-18`.

Keep the short first-person account. The desk setup, TCP/UDP tradeoff, Bonjour discovery, and escape hotkey are concrete and distinctive. No correction is necessary based solely on this editorial review.

Optional replacement for the introductory claim in the brief, if the author wants a narrower compatibility statement:

> I wanted to share a keyboard and mouse between a work Mac and a personal Mac using different Apple IDs. OpenKVM is the small macOS app I built for that setup.

Owner verification: If adding a release link or current compatibility details, confirm the relevant release first. Do not add claims about security, reliability, or supported OS versions from inference.

## 9. Native widgets from React, without leaving JSX

**DRAFT NOT APPLIED** · `content/blog/brik-react-to-native-widgets.md` · Published date retained: `2025-12-20`.

Keep this a compact project note. Replace the universal opening with the actual use case.

Proposed replacement for line 10:

> When a React Native app needs an iOS widget or Live Activity, the work can extend into SwiftUI and a separate extension target. That is the boundary Brik is designed to make easier to cross.

Proposed replacement for line 16:

> The intended tradeoff is to keep supported cases in JSX while leaving a path to native code for features outside that scope.

Owner verification: Which iOS and Android features were supported at publication? Keep compiler/platform claims only where the public implementation supports them. Do not infer full feature parity from the project description.

## 10. Ferry: Apple Watch as a Mac mic

**DRAFT NOT APPLIED** · `content/blog/ferry-apple-watch-mac-mic.md` · Published date retained: `2025-11-15`.

The personal motivation and battery/latency caveats are strong. Keep “experiment” explicit and avoid a blanket application-compatibility guarantee.

Proposed replacement for line 12:

> [Ferry](https://github.com/mukulchugh/ferry) is a small experiment with a simple goal: capture audio on watchOS, stream it to the Mac, and expose it as a system audio input that other apps can select.

Owner verification: Were Zoom and Voice Memos tested, on which OS versions and devices? Restore explicit compatibility wording only with that context; no test result has been invented here.

## 11. Agent Skills aren't just prompts

**DRAFT NOT APPLIED** · `content/blog/quivly-skills-agent-expertise.md` · Published date retained: `2025-10-21`.

The public artifact is a useful anchor. The date and “We open-sourced” attribution need review against the portfolio's November 2025 Quivly start date. An earlier contribution is possible; the mismatch alone proves neither date nor authorship is wrong.

Proposed brief without an unverified release-role assertion:

> Quivly Skills packages reusable agent workflows for customer engineering and post-sales, from health reviews to quarterly business review preparation.

Proposed replacement for line 10:

> An agent can write a polished quarterly business review and still miss a churn signal. Useful output depends on the workflow judgment a customer-success lead brings to the task.

Proposed replacement for line 14:

> A saved prompt can be versioned too. A skill adds value when it packages the instructions and supporting material for a specific job in a form that can be reviewed and reused across compatible tools.

Owner verification: Is October 21, 2025 the actual publication date, a draft date, or an import date? What was the author's contribution and relationship to the release at that time? Preserve the date until this is answered; do not silently move it to match the role timeline.

## 12. One MCP gateway beats twelve tool logins

**DRAFT NOT APPLIED** · `content/blog/mcp-gateway-for-team-tools.md` · Published date retained: `2025-09-08`.

Preserve the private-system boundary. “Twelve” reads as a count and centralized authentication does not eliminate downstream authorization.

Optional title replacement if twelve is rhetorical:

> One governed gateway for team tools

Proposed replacement for line 12:

> One useful architecture is a read-only MCP gateway in front of the team's tools: a common entrypoint for access policy and an audit trail of what the agent reads. Each integration still needs its own authorization scope and credential handling.

Proposed replacement for line 14:

> Start read-only to limit the effects of mistakes, while still enforcing permissions for sensitive reads. Add write capabilities only when their authorization, confirmation, and recovery behavior are defined.

Owner verification: Does the article describe a system already running in September 2025 or a proposed architecture? Was it twelve tools? Keep internal wiring private and avoid suggesting the gateway's governance has been independently verified.

## 13. Agents draft. Humans release.

**DRAFT NOT APPLIED** · `content/blog/human-in-the-loop-agent-plans.md` · Published date retained: `2025-07-19`.

The short opinion format works. Ground the opening in the author's preference rather than a claim about most demos.

Proposed replacement for line 10:

> A demo that ends with an agent merging a PR or sending an email leaves me with a question: who reviewed the action, and who owns the outcome?

The rest can remain a personal policy. No product features, adoption claims, or case-study outcomes need to be added.

Owner verification: None required for the proposed opinion wording. If connecting this to a named product, confirm which capabilities exist before describing them.

## 14. What Swiggy-scale mobile actually taught me

**DRAFT NOT APPLIED** · `content/blog/mobile-lessons-from-swiggy-scale.md` · Published date retained: `2025-06-02`.

The lessons are clear, but the retrospective framing conflicts with the displayed timeline: Swiggy runs May–November 2025 and founding-engineer work begins November 2025. A later revision is possible; do not assume a corrected date.

Proposed chronology-neutral brief:

> Lessons from mobile engineering at Swiggy: unreliable networks, older devices, and releases that remain on users' phones long after rollout.

Proposed replacement for line 10:

> Mobile engineering at Swiggy put everyday constraints in focus: unreliable networks, older devices, and release schedules that leave little room for unnecessary complexity.

Proposed replacement for line 16:

> Abstraction layers need to justify their cost. A shared layer that hides important iOS and Android differences can make production behavior harder to understand.

Owner verification: Was this published June 2, 2025 and revised after the role ended, or is the publication date incorrect? Confirm before changing the date or using retrospective language. If a non-confidential concrete example is available, it would make the lessons more distinctive; do not invent an incident, scale figure, or outcome.

## 15. A personal agent fleet is just a small OS

**DRAFT NOT APPLIED** · `content/blog/self-hosted-personal-agent-fleet.md` · Published date retained: `2025-05-14`.

The architecture narrative is coherent. Present-tense operational claims need confirmation, especially because the article has a historical date. Self-hosting alone does not establish that all data stays private or local.

Until deployment status is confirmed, proposed replacement for the brief:

> A design for personal AI work: messaging, memory, tools, and specialists with explicit boundaries, supported by ordinary operational checks.

Proposed replacement for line 12:

> The architecture brings messaging, long-term memory, tools, and narrowly scoped agents together. Self-hosting is only part of the privacy boundary; any external model, messaging service, or integration needs an explicit decision about what data it receives.

Proposed replacement for the proactive introduction and list (lines 25–30):

> Scheduled maintenance is a useful design option when it has a clear purpose and observable results:
>
> - Consolidation can reduce repeated memory entries while retaining their sources.
> - A coordination pass can refresh the shared view of active work.
> - Calibration can compare recorded predictions with later outcomes.
> - Invalidation can mark information that has expired or been superseded.
>
> These are proposed responsibilities, not a claim that each job is currently deployed or effective.

Proposed replacement for the operations paragraph (line 34):

> The operational requirements are ordinary: backups with tested restoration, checks that report failures to someone who can act, and clear ownership of maintenance. A scheduled job or a successful backup command does not by itself prove that recovery works.

Owner verification: Which services and jobs ran on May 14, 2025, which were added later, and which remain plans? Are there recent restoration results, alert-delivery checks, and evidence for consolidation, calibration, and invalidation? What leaves the VPS for model or messaging providers? The proposed conditional version avoids inventing answers, but the owner may prefer an accurately dated account of verified behavior instead.

## Project-content proposals

**DRAFT NOT APPLIED.** These concern `lib/data.ts` and shared project/card templates. Preserve all private-work boundaries and the intentionally hidden project records. Keep the large typographic project covers.

| Target | Proposed wording | Verification boundary |
| --- | --- | --- |
| OpenKVM release link currently called “Demo” / “Live demo available” | “Releases” / “Download a release” | Destination is a GitHub release page; do not imply a browser demo. Confirm current availability before claiming installation support. |
| Brik npm link currently called “Demo” / “Live demo available” | “npm package” / “View package” | A package listing is not an interactive demo. |
| Project-preview “View full project” | “Project overview” | Detail pages currently reuse the same description and tags; avoid promising a case study that is not present. |
| Quivly Skills description | “A collection of Agent Skills for customer engineering, post-sales, and customer-success workflows, including health reviews, churn checks, and QBR preparation.” | Removes unsubstantiated “production-ready”; verify public contents before adding supported-workflow guarantees. |
| Mixed technology/context tag section “Stack” | “Technologies & context” | Tags include “Private product work,” “Open Source,” and “Customer Success,” not just a technical stack. |
| OpenKVM category “Mobile & Platform” | “macOS utility” | Match the project described; do not change taxonomy for unrelated projects blindly. |
| Brik “no Swift or Kotlin required” | “Generate native widget code from supported JSX components.” | Confirm supported cases first; do not imply every native capability is covered. |

Private project overviews should remain concise. The absence of public screenshots, implementation details, or metrics is not permission to invent them. Existing relevant articles may be linked as further reading, but they do not establish confidential product capabilities. Older demo destinations need a separate availability check before being advertised as live; this editorial draft has not tested them.

## Owner decisions before any publication

The same factual review must include search metadata, not only visible prose. `components/json-ld.tsx` currently asserts US occupation/work locations, Staff Engineer and Tech Lead occupations, professional credentials, and an xurrent alumni relationship. Confirm each against the intended public biography before retaining or revising it. Draft direction: derive roles and employers from the approved experience records, separate employer location from personal location, and omit unverified credentials. `app/layout.tsx` also contains superlative and geographic keywords that deserve the same review. No factual metadata changes were applied in this pass.

The WebSite schema advertises `/blog?q=...` search, while the current archive has no search control or query handling. Proposed correction: remove `potentialAction.SearchAction` unless actual archive search is implemented. Do not build search merely to justify metadata.

- Confirm the two chronology questions and whether revised-date metadata is needed; preserve current dates until then.
- Choose evidence-backed benchmark wording or the nonnumeric alternative.
- Classify fleet capabilities as historical, current, or proposed, with no private operational details added to the public site.
- Confirm source attribution for the T3 Code discussion before adding a link or quoting implementation.
- Approve specific passages individually or as a set. Nothing in this file changes published content automatically.
