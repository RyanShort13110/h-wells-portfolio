# Helen Wells | Writing Portfolio

A lightweight, one-page portfolio for **Helen Wells, SEO Copywriter & Marketing Specialist**. Editorial visual direction inspired by the simplicity of Elise Dopson's site, with Helen's own color palette and content.

## What is included

- A responsive Astro static website, no backend, database, or JavaScript framework.
- Original design with deep navy `#243B53`, dusty rose `#D9A7A0`, and warm ivory `#F7F5F0`.
- Hero, About, Skills, Writing, SEO results, Experience, and Contact sections.
- **All 17 supplied writing samples**, grouped into six publications, with a large Grayton Beach feature.
- **Three SEO results**, explicitly described as *team outcomes Helen contributed to*.
- Optional author photo support, with a typographic placeholder until she supplies one.
- Pages CMS configuration so Helen can update text, skills, samples, results, and contact details without editing code.
- Keyboard-accessible native details/summary writing archive, mobile navigation, reduced-motion support, basic SEO metadata.

## Start locally

Requires Node.js 20.19+ or a supported Node 22 release and npm.

```bash
npm install
npm run check:content
npm run dev
```

Open the localhost URL Astro prints in the terminal (usually `http://localhost:4321`). To generate the static site:

```bash
npm run build
```

Astro outputs to `dist/`. This repository intentionally has **no package-lock.json** yet because the development environment used to prepare this starter did not have access to the npm registry. Run `npm install` once locally, then commit the resulting `package-lock.json` for repeatable builds.

## Host with Netlify (free subdomain first)

1. Have Helen create **her own GitHub and Netlify accounts** so she retains ownership.
2. Create a **private or public** GitHub repository for this project, upload the source files, and connect it to Netlify using **Add new project > Import an existing project**.
3. Netlify build command: `npm run build`. Publish directory: `dist`. These are also in `netlify.toml`.
4. Netlify assigns a `*.netlify.app` site address; a custom domain is **optional**.
5. Future GitHub commits will rebuild the site automatically.

## Pages CMS content editing

1. Sign in at https://app.pagescms.org with the GitHub account that owns the project.
2. Allow the Pages CMS GitHub App to access **only this portfolio repository**.
3. Open the repository. It reads `.pages.yml` and should show:
   - **Introduction, About & Contact**, `src/data/site.json`
   - **Skills**, `src/data/skills.json`
   - **Writing samples**, `src/data/samples.json`
   - **SEO results**, `src/data/results.json`
4. Edit and save. Pages CMS writes files back to GitHub, prompting Netlify to deploy the update.

This isn't an inline WYSIWYG editor; changes are saved to GitHub first and appear after Netlify builds.

### Where to edit manually

All public text and links live in the four JSON files in `src/data/`.

- `site.json`: name, title, headlines, introduction, About, Experience, contact, optional `headshot`, SEO metadata.
- `skills.json`: named skill categories and item lists.
- `samples.json`: articles with `title`, `client`, `url`, `category`, `summary`, `featured`, and `spotlight`.
- `results.json`: SEO metric cards.

Keep **exactly one** article's `spotlight` set to `true` to define the large featured piece. `featured: true` creates one of the four smaller cards when not the spotlight. The writing archive always lists all articles, whether featured or not.

For an optional headshot, upload an image through Pages CMS and select its path in `headshot`. Otherwise the monogram is intentional.

## Before putting Helen's name on a public site

- **Confirm the wording with Helen.** The About and hero descriptions were drafted from her brief, not quoted as her own writing.
- **Get her approval to publish the SEO figures.** They came from a team shout-out, and the current site describes them as collaborative team results, not personal performance guarantees.
- **Click through all 17 links.** Third-party websites can change or remove published articles. A few links were checked when this starter was prepared, but not every page could be fetched automatically.
- **Confirm any additional work or dates** before adding them. This starter does not fabricate past roles, job dates, or client performance numbers.
- **Test production on mobile and desktop** and use the built output, not this repository ZIP, for manual drag-and-drop deploys.

## Implementation notes

The site relies on Astro build-time JSON imports, one stylesheet, and a small progressive enhancement script. It does not require GSAP, a backend, external image assets, cookies, analytics, or a tracking script. Only Google Fonts is loaded externally, with system fallbacks.

**Do not connect to a company-owned repository for this personal portfolio.** Keep the repository and hosting under Helen's control.
