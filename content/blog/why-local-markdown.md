---
title: "Why I moved my blog to local Markdown"
slug: "why-local-markdown"
brief: "No CMS login, no API calls, no vendor lock-in — just text files and a build step. Here's why that's the right call for a personal blog."
publishedAt: "2026-06-20"
tags: ["Engineering", "Meta"]
author: "Mukul Chugh"
---

> **Starter post** — this is placeholder content you can replace whenever you're ready to write the real thing.

There's a certain irony in spending more time configuring your writing tool than actually writing. I've been guilty of this. Hashnode, Ghost, Notion exports, MDX with remote data — I've tried most of them. Each one added a dependency I had to maintain.

## The core problem with external CMSes

Every CMS introduces a network call at read time, an API key to rotate, a webhook to debug, and a login page to forget the password to. For a personal blog that publishes a few times a month, that's too much surface area.

The real cost isn't the monthly fee. It's the cognitive overhead. When you have to remember how your blog works before you can write, you write less.

### What breaks at the worst moments

- The API is down when you're trying to preview a draft
- The auth token expires mid-deploy and your CI silently produces empty pages
- The CMS vendor changes their pricing model or shuts down

These aren't hypotheticals. They've each happened to someone I know.

## The local Markdown approach

Every post is a `.md` file in `content/blog/`. Frontmatter handles metadata. `gray-matter` parses it. `marked` renders it. The whole pipeline is:

```ts
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";

const raw = fs.readFileSync("content/blog/my-post.md", "utf8");
const { data, content } = matter(raw);
const html = marked.parse(content);
```

That's it. No environment variables beyond what Next.js already needs.

### What you get for free

- **Version control**: your posts are in git, with full history
- **Offline authoring**: write on a plane with no internet
- **Zero vendor dependency**: the only lock-in is the Markdown format itself
- **Instant search**: just `grep` the `content/` directory
- **Deploy = publish**: push to main, Vercel builds it

## The one real tradeoff

You don't get a visual editor or an image upload UI. Images go in `public/` or on a CDN you already use. For a developer writing mostly technical content, that's fine. For someone who wants a polished editing experience, it might not be.

If you write code for a living, you probably already live in your editor. The blog should live there too.

## How to add a post

```bash
# 1. Create the file
touch content/blog/my-new-post.md

# 2. Add frontmatter + write
# 3. Commit and deploy
git add content/blog/my-new-post.md
git commit -m "post: my new post"
git push
```

That's the whole workflow. No CMS dashboard, no publish button, no waiting for a sync.
