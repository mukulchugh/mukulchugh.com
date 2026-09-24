@AGENTS.md

## Agent skills

### Issue tracker

Local Markdown in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default roles. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.

### Ponytail

Use the installed Ponytail skill in `full` mode for coding tasks unless the user changes or disables it. Understand the affected flow first, reuse existing components and dependencies, and choose the smallest correct implementation. Preserve accessibility, security, error handling, and requested behavior. Leave a runnable check for non-trivial logic. Do not install another library or create an abstraction when the existing system suffices.
