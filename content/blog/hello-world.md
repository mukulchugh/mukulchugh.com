---
title: "Hello, world — the blog runs from code now"
slug: "hello-world"
brief: "This blog is now a set of Markdown files in the repo. No CMS, no external API — just write a file and ship."
publishedAt: "2026-07-05"
tags: ["Meta", "Engineering"]
author: "Mukul Chugh"
---

This blog no longer depends on any external service. Each post is a Markdown
file in `content/blog/`, parsed at build time. To publish, add a file, commit,
deploy. That's the whole workflow.

## Frontmatter

Every post starts with a small block of metadata:

```md
---
title: "Your title"
slug: "custom-slug"        # optional, defaults to the filename
brief: "One-line summary." # optional, auto-derived if omitted
publishedAt: "2026-07-05"
tags: ["Engineering", "macOS"]
coverImage: "https://..."  # optional
author: "Mukul Chugh"      # optional
draft: true                # optional, hides the post
---
```

## Writing

Everything below the frontmatter is plain Markdown — headings, lists, links,
and code blocks all work:

```ts
export function hello(name: string) {
  return `hello, ${name}`;
}
```

> Delete this file whenever you're ready to write the real thing.
