# Gweleni Construction — Website

A six-page, responsive website for Gweleni Construction, a Bellville-based
residential and light-commercial building company serving Cape Town's
northern suburbs. Built for **WEDE5020** (IIE Rosebank International).

- **Part 1** — semantic HTML foundation across five linked pages.
- **Part 2** — external CSS stylesheet, desktop styling and responsive
  design for tablet and mobile.
- **Part 3** — JavaScript interactivity (lightbox, tabs, accordion, modal,
  Leaflet maps, live search/filter/sort), validated forms, SEO and deployment
  (this update).

## Links

| | |
|---|---|
| **Live website** | https://ri-wede5020-gr4-p1-p2-p3.github.io/ri-pta-wede5020-part1-part2-part3-nokhaya2006/ |
| **YouTube video** | https://youtu.be/24OCpK01eXw |
| **GitHub repository** | https://github.com/RI-WEDE5020-GR4-P1-P2-P3/ri-pta-wede5020-part1-part2-part3-Nokhaya2006 |
| **Author** | Nokhaya2006 (GitHub username) |
| **Module** | WEDE5020 — Web Development, IIE Rosebank International |
| **Change history** | See [`CHANGELOG.md`](CHANGELOG.md) for every change, including the changes made in response to Part 2 feedback |

## How to run the site locally

1. Download or clone the repository.
2. Open `index.html` in a browser, or (recommended) open the folder in VS Code
   and use the **Live Server** extension so the pages are served over `http://`.
3. An internet connection is needed for Google Fonts, the Leaflet library and
   the OpenStreetMap tiles. Without it the maps show a text fallback and the
   fonts fall back to system fonts; everything else still works.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, services overview, "why choose us", featured projects, testimonials, quote CTA |
| About | `about.html` | Company story, vision, mission, key stats |
| Services | `services.html` | Six service categories with real project photos, FAQ |
| Projects | `projects.html` | Searchable, filterable, sortable project gallery with detail modal, lightbox and map |
| Get a Quote | `enquiry.html` | Validated quote request form with an instant estimate |
| Contact | `contact.html` | Office details, interactive map and a validated message form that compiles an email |

Every page shares the same `<header>` navigation and `<footer>`, so all six
pages are reachable from one another at all times.

## Folder structure

```
gweleni-site/
├── index.html
├── about.html
├── services.html
├── projects.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css            ← one external stylesheet, linked from every page
├── js/
│   ├── main.js              ← lightbox, tabs, accordion, animations, back-to-top
│   ├── projects-data.js     ← project data array (drives the Projects page)
│   ├── projects.js          ← dynamic cards, search/filter/sort, modal, map markers
│   ├── maps.js              ← Contact page office map
│   └── forms.js             ← validation, estimate processing, email compilation
├── images/                  ← each photo as .webp (used) and .png (original)
├── robots.txt
├── sitemap.xml
├── README.md
└── CHANGELOG.md
```

## Technologies

HTML5, CSS3 (custom properties/design tokens, Grid, Flexbox, `clamp()`
fluid typography, media queries, pseudo-classes/pseudo-elements), Google
Fonts (Oswald, Work Sans, IBM Plex Mono; Google Fonts, 2026) and, from Part 3, plain
JavaScript (ES5-style, no framework or build tools) plus **Leaflet 1.9.4**
with OpenStreetMap tiles for the interactive maps. The mobile navigation
menu is still the CSS-only "checkbox hack" (`:checked` + a sibling
selector); `main.js` only closes it after a link is tapped.

## CSS architecture (Part 2)

All styling lives in one external stylesheet, `css/style.css`, linked from
every page's `<head>`. It is organised top to bottom as:

1. Design tokens (`:root` custom properties for colour and type)
2. Reset / base style
3. Typography
4. Buttons
5. Header / navigation
6. Section-by-section component styles (hero, services, about, FAQ,
   contact/enquiry form, footer)
16. Focus-visibility (accessibility)
17. Responsive media queries (tablet, mobile, small phone)
18. Reduced-motion support

Colour and type are defined once as custom properties so the whole site's
palette can be changed from a single place, taking advantage of CSS's
cascading nature rather than repeating values throughout the sheet.

### Responsive breakpoints

| Breakpoint | Target | What changes |
|---|---|---|
| `max-width: 980px` | Tablet | Grids drop from 3–4 columns to 2, "why us" section stacks, About page stats switch from a column to a wrapped row, heading sizes step down |
| `max-width: 899px` | Tablet (narrow) | Contact/enquiry two-column layout stacks to one column, footer grid re-flows to two columns |
| `max-width: 760px` | Mobile | Header navigation switches to the hamburger/CSS-checkbox menu, all remaining multi-column grids and forms drop to one column, base body font size reduces slightly |
| `max-width: 520px` | Small phone | Grids fall to a single column everywhere, hero/gallery image aspect ratios shrink, heading sizes reduce a further step |

### Responsive testing evidence

The site was tested in Chromium at desktop, tablet and mobile widths. The
screenshots below were captured with the project's own CSS and JavaScript.
They were taken offline, so the web fonts are replaced by system fonts and
the map tiles are not shown; the live site shows the real fonts and maps.

| Desktop (1440 px) | Tablet (820 px) | Mobile (390 px) |
|---|---|---|
| ![Home page at desktop width](docs/screenshots/home-desktop-1440.jpg) | ![Home page at tablet width](docs/screenshots/home-tablet-820.jpg) | ![Home page at mobile width](docs/screenshots/home-mobile-390.jpg) |

**Navigation menu.** Above 760 px the links sit in a single row (checked at
770, 800, 860, 900, 980, 1040, 1100 and 1280 px with no wrapping or
horizontal scrolling). At 760 px and below it becomes a hamburger menu that
opens as a full-width panel:

![Mobile menu open at 390 px](docs/screenshots/mobile-menu-open-390.jpg)

## Part 3 — Functionality, SEO and deployment

### Interactive elements (`js/main.js`)

The tabs, dialogs and accordion follow the WAI-ARIA Authoring Practices patterns (W3C, 2026); scroll animations use the Intersection Observer API (MDN, 2026g).

| Feature | Where | How it works |
|---|---|---|
| Gallery lightbox | Home page gallery, Projects page | Any `<a data-lightbox="group">` opens a full-screen viewer with previous/next buttons, arrow keys, swipe, `Esc`, caption, image counter, focus trap and focus return. Built with DOM manipulation and event delegation, so cards added later by JavaScript work too. |
| Tabs | Services page, "How we work" | WAI-ARIA tab pattern (`role="tablist"/"tab"/"tabpanel"`), arrow-key / Home / End navigation. |
| Accordion | Services page FAQ | Native `<details>` elements enhanced so only one answer is open at a time, with a CSS slide/fade animation. |
| Modal | Projects page ("Details") | Accessible dialog (`role="dialog"`, `aria-modal`, focus trap, `Esc` and backdrop to close). |
| Animations | All pages | Scroll-reveal using `IntersectionObserver` and the CSS `translate`/`opacity` transitions; animated number counters on the About page; hover and lightbox transitions. All disabled when the visitor has "reduce motion" switched on. |
| Back-to-top button | All pages | Created with `document.createElement` and shown after scrolling. |

### Interactive maps (Leaflet + OpenStreetMap)

Maps use Leaflet (Agafonkin, 2023) with OpenStreetMap tiles (OpenStreetMap contributors, 2026).

- **Contact page** (`js/maps.js`): markers for the Bellville head office and
  Durbanville site office, with buttons that fly the map to each office.
- **Projects page** (`js/projects.js`): one marker per project, kept in sync
  with the search/filter/sort controls; each card has a "Show on map" link.
- Marker positions are approximate suburb centres, not exact street
  addresses. If Leaflet cannot load, a text fallback is shown instead.

### Dynamic content and search (`js/projects-data.js`, `js/projects.js`)

The Projects page builds its cards from one JavaScript array using DOM
methods (`textContent` only, so data can never inject HTML). The controls
provide:

- **Search** — live, multi-word search across title, suburb, category and summary (150 ms debounce).
- **Filter** — category dropdown, generated automatically from the data.
- **Sort** — newest, oldest, name A–Z, suburb A–Z.
- A live result count (`aria-live`), a "no results" message and a Reset button.

The cards are also written into `projects.html` so search engines and
visitors without JavaScript still see every project.

### Forms and validation (`js/forms.js`)

Validation follows the client-side validation approach described by MDN (2026f); the optional AJAX submission uses the Formspree service (Formspree, 2026).

Both forms use `novalidate` plus HTML5 attributes (`required`, `type`,
`minlength`, `maxlength`, `min`, `max`, `pattern`) as the baseline, and
JavaScript validation on top of that.

| | `enquiry.html` | `contact.html` |
|---|---|---|
| Purpose | Ask about a service and get an indicative response | Send a general message to the organisation |
| Fields | Name, email, SA phone, service, property type (radio), area (m²), start date, budget, site-visit checkbox, project details, consent | Name, email, optional SA phone, message type, subject, message, reply preference (radio), consent |
| Validation | Name pattern, email format, SA phone format (`0xx…` / `+27…`), numeric range 5–5000 m², date not in the past and within two years, message 20–1000 characters, consent required | Same shared rules; phone optional but checked if given; subject 3–80 characters |
| Processing | Calculates an indicative cost range, earliest start date and availability, compares against the stated budget, issues a reference number and shows the response without reloading | Compiles the validated data into an email (To / Subject / body), shows a preview and a **Send email** button that opens the visitor's mail app addressed to the recipient set in `forms.js` (`CONTACT_RECIPIENT`) |
| AJAX | If the form's `action` is a real endpoint (e.g. Formspree), the data is also POSTed with `fetch()` without a page reload | — |

Error handling: inline messages under each field (`aria-invalid` +
`aria-describedby`), an error summary that moves focus to the first invalid
field, live re-validation after a field has been visited, and a hidden
honeypot field that silently ignores bots.

> **Important:** the rates and lead times in the estimate calculator
> (`SERVICES` in `forms.js`) and the project years in `projects-data.js` are
> placeholder figures for demonstration and should be replaced with the
> company's real pricing and dates before the site is used commercially. The
> estimate is clearly labelled "indicative" on screen.

### SEO

The on-page and off-page measures follow Google's SEO Starter Guide (Google, 2026).

- **Title tags** — unique, keyword-led and under ~60 characters on every page.
- **Meta descriptions** — unique, ~150 characters, on every page.
- **Meta keywords** — page-specific keyword lists on every page, based on the
  services and Cape Town suburbs the company works in. (Major search engines
  largely ignore this tag; it is included because the brief asks for it, and
  the real SEO value comes from the visible content, headings and links.)
- **Header tags** — one `<h1>` per page, with `<h2>`/`<h3>` in order.
- **Images** — descriptive lowercase-hyphenated file names
  (`kitchen-renovation.webp`), descriptive `alt` text naming the work and
  suburb, explicit `width`/`height`, and lazy loading below the fold.
- **URL structure** — short, readable file names (`projects.html`, `enquiry.html`).
- **Internal linking** — Projects page linked from every navigation bar and
  footer, plus contextual links between About, Services, Projects and the quote page.
- **Mobile-friendliness** — responsive layouts from Part 2, viewport meta tag,
  checked for horizontal scrolling at 390 px.
- **Local SEO** — Bellville, Durbanville, Brackenfell, Parow, Tyger Valley and
  Century City appear in titles, headings, alt text and the map.
- **Off-page SEO plan** — claim a Google Business Profile for the Bellville
  office; build backlinks from local directories and supplier/partner sites;
  share project photos on social media (Facebook/Instagram) linking back to
  `projects.html`; ask satisfied clients for Google reviews.
- **robots.txt** and **sitemap.xml** are in the project root and use the live
  site address. Once the site is live, submit the sitemap in Google Search Console.

### Page speed and security

The security measures follow MDN guidance on Content Security Policy (MDN, 2026h).

- Project photos converted from PNG to WebP (about 90 % smaller; e.g. 217 KB → 13 KB).
- Scripts are loaded with `defer`; images are lazy-loaded; fonts use `display=swap`.
- A Content-Security-Policy `<meta>` tag limits scripts, styles, images and
  network requests to the site itself and the few services it uses (Leaflet
  from unpkg, OpenStreetMap tiles, Google Fonts, Unsplash images, Formspree).
- Leaflet files are loaded with Subresource Integrity (`integrity=`) hashes.
- All user-supplied and data-driven text is inserted with `textContent`, never
  `innerHTML`, to prevent cross-site scripting.
- Referrer policy, honeypot spam field and input length limits on every form.
- Note: static hosts such as GitHub Pages cannot send HTTP security headers
  (HSTS, X-Frame-Options); HTTPS is provided automatically.

### Accessibility additions

Skip-to-content link, `aria-live` result counts, dialog roles with focus
trapping and focus return, labelled fieldsets for radio groups, visible focus
rings, keyboard support for tabs, lightbox and modal, and
`prefers-reduced-motion` support for all new animations.

### Deployment

The site is deployed on **GitHub Pages** (GitHub, 2026):

- Live site: https://ri-wede5020-gr4-p1-p2-p3.github.io/ri-pta-wede5020-part1-part2-part3-nokhaya2006/
- Repository: https://github.com/RI-WEDE5020-GR4-P1-P2-P3/ri-pta-wede5020-part1-part2-part3-Nokhaya2006

Steps used: push the project to the GitHub repository → **Settings → Pages**
→ Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
`robots.txt` and `sitemap.xml` already contain the live address.

### Setting up the enquiry form endpoint (optional)

1. Create a free form at https://formspree.io and copy the form ID.
2. In `enquiry.html`, replace `YOUR_FORM_ID` in the form's `action` attribute.
3. Until this is done, the estimate is still calculated and shown in the
   browser but the enquiry is not sent anywhere.

### Testing

Automated browser tests (Playwright / Chromium, desktop 1280 px and mobile
390 px) and manual checks covered:

- every page loads with no JavaScript errors and no horizontal scrolling;
- lightbox (open, next/previous, wrap-around, Esc, caption and counter);
- tabs (click and arrow keys) and the single-open accordion;
- project search, category filter, four sort orders, reset, empty-results message, modal and map markers;
- enquiry form: every error message, a valid submission, the estimate response, the honeypot and the reset button;
- contact form: every error message, email compilation, the `mailto:` link and the edit button;
- mobile menu: opens by tap and by keyboard (Space), closes with Esc, after a link is chosen, and shows the current page.

| Enquiry form — validation errors | Enquiry form — estimate response |
|---|---|
| ![Enquiry form showing validation errors](docs/screenshots/enquiry-validation-errors.jpg) | ![Enquiry form estimate response](docs/screenshots/enquiry-estimate-response.jpg) |

| Projects page — search for "roof" | Contact form on a phone |
|---|---|
| ![Projects page filtered by a search](docs/screenshots/projects-search-desktop.jpg) | ![Contact form at mobile width](docs/screenshots/contact-form-mobile-390.jpg) |

## Content notes

Project photos in `images/` are real project photography with the
location each project was completed in. The home page uses a small number
of additional Unsplash stock photos (hero background, testimonials
background, "why us" portrait) — see References below for the licence.
Phone numbers and the email address on the Contact and Enquiry pages are
the client's actual current contact details.

## Accessibility & responsiveness

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Meaningful `alt` text on every content image, describing the project and
  location; purely decorative images use an empty `alt` with
  `aria-hidden="true"`
- Visible focus states on all interactive elements via `:focus-visible`
- Responsive from small phones up to desktop, with a collapsible mobile menu
- Respects `prefers-reduced-motion`
- `srcset`/`sizes` on the hero image so phones download a smaller file
  than desktop

## References

All sources are in Harvard style, listed alphabetically, with the date each
page was accessed. In-text citations in this README use the author and year
(for example, MDN, 2026b).

- Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for interactive maps*, version 1.9.4. Available at: https://leafletjs.com/reference.html (Accessed: October 2026).
- Formspree (2026) *Formspree help documentation*. Available at: https://help.formspree.io (Accessed: October 2026).
- GitHub (2026) *GitHub Pages documentation*. Available at: https://docs.github.com/en/pages (Accessed: October 2026).
- Google (2026) *Search Engine Optimization (SEO) Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: October 2026).
- Google Fonts (2026) *Oswald, Work Sans and IBM Plex Mono*. Available at: https://fonts.google.com (Accessed: September 2026).
- Mozilla Developer Network (MDN) (2026a) *CSS: Cascading Style Sheets*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS (Accessed: September 2026).
- Mozilla Developer Network (MDN) (2026b) *CSS grid layout*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout (Accessed: September 2026).
- Mozilla Developer Network (MDN) (2026c) *CSS flexible box layout*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: September 2026).
- Mozilla Developer Network (MDN) (2026d) *Using media queries*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: September 2026).
- Mozilla Developer Network (MDN) (2026e) *JavaScript guide*. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide (Accessed: October 2026).
- Mozilla Developer Network (MDN) (2026f) *Client-side form validation*. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: October 2026).
- Mozilla Developer Network (MDN) (2026g) *Intersection Observer API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: October 2026).
- Mozilla Developer Network (MDN) (2026h) *Content Security Policy (CSP)*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP (Accessed: October 2026).
- OpenStreetMap contributors (2026) *Copyright and license*. Available at: https://www.openstreetmap.org/copyright (Accessed: October 2026).
- Rosebank International (2026) *CSS Fundamentals Part 2: Layouts, responsive design and polished interfaces*. Web Development module lecture slides. Rosebank International, Pretoria Campus. Unpublished lecture material.
- Unsplash (2026) *Unsplash License*. Available at: https://unsplash.com/license (Accessed: August 2026).
- W3C (2026) *WAI-ARIA Authoring Practices Guide*. Available at: https://www.w3.org/WAI/ARIA/apg/ (Accessed: October 2026).
