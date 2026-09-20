# DAFTRIFY

DAFTRIFY is a static public website for **Document Operations & Pre-Submission Auditing**.

The production site is the root **`index.html`**. There is no Next.js runtime or server-side application.

## Local development

Requirements:

- Node.js 18+
- Network access for the external CDN, font, and video assets used by the page

Run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Verification

Run the repository checks:

```bash
npm run check
```

The check validates the HTML source, required section order, accessibility references, demonstration structure, external media reference, public-language restrictions, and inline JavaScript syntax.

## Production build

```bash
npm run build
```

This creates:

```text
dist/index.html
```

Preview the production artifact with:

```bash
npm run preview
```

Then open `http://localhost:4173`.

The build is intentionally static. External fonts, the Motion browser module, Tailwind browser CDN, and the remote video remain external dependencies.

## Cloudflare Pages

Use these settings when importing this GitHub repository:

- **Production branch:** `main`
- **Root directory:** `/`
- **Build command:** `npm run build`
- **Build output directory:** `dist`

Do **not** select a Next.js framework preset. The deployed artifact is `dist/index.html`.

After the first deployment, pushes to `main` can trigger new deployments through the Git integration.

## Repository architecture

The repository previously contained a second, unused Next.js/React implementation alongside the real static site. That created an ambiguous deployment target and included stale "Studio Footer" content and a missing local video dependency.

The production source of truth is now:

```text
index.html
scripts/build.mjs
package.json
public/
design-system/
```

The unused Next.js scaffold and stale setup script were removed rather than leaving two competing application architectures.

## External assets

The website currently references external fonts/CDNs and a remote R2 video. The build does not download, transcode, or bundle those assets.

If an external asset is unavailable, the page should retain its underlying content and navigation rather than depending on a server-side runtime.

## Content integrity

Demonstration material must remain explicitly simulated where applicable. Do not introduce unsupported client counts, testimonials, logos, revenue, accuracy rates, approval rates, certifications, partnerships, or guaranteed outcomes.
