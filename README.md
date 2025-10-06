# Next.js Blog Template

Modern, fast, and accessible blog template built with Next.js App Router. Ships with animated page transitions, automatic table of contents, and auto-generated reading time.

## Tech Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- GSAP 3 (page transition animation, dynamically imported client-side)
- remark + gray-matter (Markdown to HTML)

## Features
- Automatic Table of Contents (from post headings)
- Auto-generated reading time (200 wpm, overridable in frontmatter)
- GSAP-powered page transition cover with reduced-motion fallback
- Search, tag filtering, basic pagination
- Light/Dark theme with persistent toggle
- Markdown-based content in `blog/`

## Getting Started
Prerequisites: Node.js 18+ and npm

Install dependencies:
```bash
npm install
```

Run in development:
```bash
npm run dev
```
Visit `http://localhost:3000`.

Build for production:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

## Project Structure
```
app/
  blog/
    [slug]/page.tsx     # Single post page (TOC + read time shown)
    page.tsx            # Blog index: search, tags, pagination
  layout.tsx            # Theme + PageTransition
  globals.css           # Global styles, TOC + layout styles
blog/                   # Markdown posts
components/
  AnimatedLink.tsx      # Link with transition pre-nav behavior
  PageTransition.tsx    # GSAP transition overlay (client-only)
  TableOfContents.tsx   # Sticky, interactive TOC
utils/
  blog.ts               # Markdown parsing, read time, TOC extraction
```

## Content Authoring (Markdown)
Create a file in `blog/`, e.g. `my-post.md`:
```md
---
title: "My Post Title"
date: "2024-10-01"
description: "Optional short summary"
tags: "tag1, tag2"
# readTime: "3 min read"  # optional override
---

# Main Heading

Intro paragraph...

## Section One

Content...

## Section Two

More content...
```

Notes:
- Table of contents is auto-generated from headings and requires no manual IDs.
- Reading time is computed from the raw markdown if `readTime` is not set.

## Configuration
- `NEXT_PUBLIC_BASE_URL`: Used for absolute post URLs in social sharing. Example:
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Performance Details
- GSAP is dynamically imported on the client in `PageTransition` to avoid SSR issues and reduce initial bundle size.
- Animated navigation uses a pre-cover event (`AnimatedLink`) and disables Next.js prefetch on animated links to avoid wasted bandwidth.
- Reduced motion respected via `prefers-reduced-motion` (crossfade).

## Deployment
This project deploys well to Vercel or any Node-capable host.
```bash
npm run build
npm start
```

## License
MIT
