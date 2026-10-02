# nextgen.gt — Next.js rebuild

A Next.js App Router + TypeScript rebuild of nextgen.gt.

## Goals

- Preserve existing public URLs where practical.
- Give services, designs and extensions indexable pages.
- Render GitHub project activity server-side instead of showing `Loading…` in initial HTML.
- Keep most pages as Server Components; only navigation, forms and support UI are client-side.
- Generate metadata, `robots.txt` and `sitemap.xml` from Next.js.
- Reuse the existing repository's `/assets` directory.

## Running inside the existing repository

This folder is designed to live as `nextjs/` next to the current Jekyll `assets/` directory.

```bash
cd nextjs
npm install
npm run dev
```

`predev` and `prebuild` copy `../assets` to `public/assets`, so the existing images and favicons are reused without modifying them.

## Production

Recommended: deploy the Next.js project with Vercel or another Node-compatible host and point `nextgen.gt` at that deployment after review.

Optional `GITHUB_TOKEN` can be configured to raise GitHub API rate limits for repository activity. The site works without it and gracefully falls back if GitHub is unavailable.

## Current contact form

The existing Formspree endpoint is preserved so contact remains functional. For a later hardening pass, move submission and captcha verification to a Next.js Route Handler/server action and add server-side rate limiting.

## Migration checklist

1. Put this project in `nextjs/` in the existing repo.
2. Run `npm install && npm run build`.
3. Deploy `nextjs/` as a preview project.
4. Review all legacy URLs and redirects.
5. Move Next.js to repository root only after production preview approval.
6. Keep a rollback tag/branch for the current Jekyll site.
