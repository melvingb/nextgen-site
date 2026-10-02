# Migration notes

## Preserved URLs
- `/designs/[slug]`
- `/extensions/phpbb-directory`
- `/portfolio`
- `/testimonials`
- `/custom-work` redirects to `/services/custom-development`

## New SEO landing pages
- `/services/phpbb`
- `/services/xenforo`
- `/services/vbulletin`
- `/services/migrations`
- `/services/custom-development`

## Intentional changes
- GitHub commit metadata is fetched server-side with one-hour revalidation.
- The old percentage/milestone display was removed from the primary UI because a raw `0%` is misleading without milestone context.
- The invalid site-wide `SearchAction` structured data was removed.
- The old monolithic Jekyll navigation/scripts were replaced with React components.
- Portfolio copy now describes technical work instead of only describing the site's subject matter.
