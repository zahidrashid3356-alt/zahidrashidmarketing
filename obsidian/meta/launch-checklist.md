# Launch checklist — Marketing Pro AI

Build stage: the site is `noindex` and robots.txt disallows everything. Nothing below is optional before launch.

- [ ] `siteConfig.indexing` → `true` in `src/lib/site.ts` (robots + page metadata flip together).
- [ ] Real logo replaces the placeholder wordmark in `src/components/site/logo.tsx`; regenerate favicons and `public/open-graph.png`.
- [ ] Real photos replace placeholder graphics; every image has real `alt` text and a recorded licence source.
- [ ] Replace every SAMPLE block: hero copy (`src/data/content.ts`), the shared "What you get" / "How we work" text on service pages (`src/views/services/service-views.tsx`) — each service page needs its own copy.
- [ ] No invented reviews, client names, numbers or awards anywhere.
- [ ] Contact details (email, phone, address if any) in `siteConfig.organization`; contact form wired (`CONTACT_ENDPOINT` or an email service).
- [ ] Terms, Privacy and Refund text reviewed by someone qualified for the USA, UK, UAE, Australia and Pakistan. Remove the `TODO:` text in `src/data/mocks/legal.ts`.
- [ ] Stub pages (About, Our Work, Blog, Contact, Terms, Refund) built; their routes set to `indexable: true` and `noIndex` removed.
- [ ] `NEXT_PUBLIC_SITE_URL` set on Vercel to the final domain; Search Console and Bing verified.
