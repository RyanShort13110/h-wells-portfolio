# Helen Wells | SEO-only patch (V2.2)

This patch updates ONLY the Astro site URL, homepage head, and two new static routes. It does not replace content JSON, Pages CMS setup, the resume, writing samples, SEO results, or CSS/JavaScript.

## Install
1. Copy the files into the existing Astro project root, merging folders.
2. In `astro.config.mjs`, confirm `site: 'https://helen-wells.netlify.app'` matches the live canonical domain. If Helen later uses a custom domain, change ONLY this `site` URL and redeploy.
3. `npm run check:content` and `npm run build`.
4. Deploy on Netlify.
5. Verify source HTML contains `<link rel="canonical">`, JSON-LD Person markup, and social tags. Check `/sitemap.xml` and `/robots.txt` return correctly.
6. Claim the live site in Google Search Console and request indexing of the homepage. Submit the sitemap if you want to monitor discovery.

## New SEO features
- Canonical URL and Open Graph URL sourced from `astro.config.mjs`.
- Lightweight Person structured data from the existing CMS-managed name, role, bio description and LinkedIn URL.
- Twitter/X card text metadata (no image yet).
- `robots.txt` and one-URL `sitemap.xml` generated at build time from the same configured site URL.

## Not included
- Social preview image: needs a suitable PNG/JPG uploaded/design-approved; an image can be integrated without dependencies.
- Google Search Console verification: must be completed by the site owner. No extra libraries necessary.
- Production-vs-preview branch indexing policies: avoid sharing or indexing unpublished previews.
- A guarantee of ranking: neither metadata nor a sitemap guarantees placement.

## Notes
- This patch starts from the V2.1 source. It is deliberately safe if the deployed site.json has changed via Pages CMS, because site.json is NOT included.
- The sitemap includes one URL because Helen's Astro site is currently a single page. The 17 off-site writing samples are not sitemap entries.
- `robots.txt` allows crawling; it does not force Google to index the page or hide content.
