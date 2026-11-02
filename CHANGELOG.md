# Changelog

All notable changes to the Gweleni Construction website are recorded here,
in chronological order.

## 2026-08-14 — Part 1: initial build

- Created project folder structure (`css/`, `images/`) and a first shared
  stylesheet, `css/style.css`.
- Built `index.html`, `about.html`, `services.html`, `projects.html` and
  `contact.html` with semantic `header`/`nav`/`main`/`footer` on every page.
- Linked navigation across all pages with `aria-current="page"` on the
  active link.
- Added descriptive `alt` text to all images and HTML comments explaining
  each major section.
- Sourced placeholder project photography from Unsplash and added
  `README.md`.

## 2026-08-21 — Part 1 feedback implementation

Implements the corrections requested after Part 1 marking.

- **Fixed incorrect location details**: the site previously referenced
  Pretoria/Gauteng in error; all copy, the hero, the about page and the
  contact details were corrected to Gweleni Construction's real location,
  Bellville, Cape Town.
- **Replaced placeholder photography** with six real project photos,
  renamed from messy uploaded filenames (spaces, inconsistent casing) to
  descriptive lowercase-hyphenated names (`new-home-build.png`,
  `kitchen-renovation.png`, `bathroom-renovation.png`,
  `home-extension.png`, `roof-replacement.png`, `retail-fitout.png`), each
  captioned with the Cape Town suburb the project was completed in
  (Durbanville, Bellville, Brackenfell, Tyger Valley, Parow, Century City).
- **Restructured the site** from a single anchor-linked `index.html` with
  broken image references into five properly linked pages: `index.html`,
  `about.html`, `services.html` (six service categories + FAQ),
  `enquiry.html` (dedicated quote-request form, replacing `projects.html`),
  and `contact.html` (two real locations: Bellville head office and
  Durbanville site office).
- Updated all contact details across the site to the client's real phone,
  alternate phone and email.

## 2026-09-05 — Home page visual redesign

- Redesigned `index.html` to a navy/gold palette with a full hero, "why
  choose us" section, featured-projects gallery and client testimonials,
  matching an agreed design reference.
- At this stage the new design was implemented as an embedded `<style>`
  block on `index.html` only, while the other four pages still linked the
  older `css/style.css` — flagged below as the first item corrected for
  Part 2.

## 2026-09-17 — Part 2: CSS styling and responsive design

- **Consolidated to one external stylesheet.** Removed the embedded
  `<style>` block from `index.html` (Part 1/interim feedback: an external
  stylesheet must be correctly implemented on *every* page, not just some)
  and rebuilt `css/style.css` around the navy/gold design, so all five
  pages now share exactly one stylesheet and one consistent look.
- **Design tokens**: added a full set of CSS custom properties for colour
  and typography (`--navy`, `--gold`, `--paper`, `--font-display`, etc.)
  so the palette/type pairing is defined once and reused everywhere.
- **Default/base style**: global box-sizing reset, base font, line-height,
  background and link/heading defaults applied consistently across pages.
- **Typography**: fluid `clamp()`-based heading sizes, a mono/display/body
  three-font system, plus explicit responsive typography overrides at each
  breakpoint (heading size and letter-spacing on tablet, base body font
  size on mobile, a further heading reduction on small phones).
- **Layout structure**: CSS Grid for all major grids (services, service
  tiles, gallery, testimonials, about/stats, contact/quote form, footer —
  the footer specifically uses `grid-template-areas`) and Flexbox for the
  header, hero actions, nav and card internals.
- **Decoration and colour**: consistent card/button/border treatment,
  rounded corners, hover elevation on cards, and background colour blocks
  (navy/paper/white) used to separate sections.
- **Pseudo-classes/pseudo-elements**: `:hover`, `:active` and
  `:focus-visible` on all interactive elements, `:not()` to exclude the
  CTA button from the plain nav-link hover style, `:first-child`/
  `:last-child` on nav links, `:checked` (the CSS-only mobile menu),
  `details[open]` and `::marker` for the new FAQ styling.
- **Added missing component styles**: brought the About page
  (`.about-grid`, `.mission-vision`, `.about-stats`), the Services page's
  photo cards (renamed to `.service-tile` to avoid clashing with the home
  page's icon cards) and the FAQ `<details>` elements into the shared
  stylesheet with the new palette — previously unstyled or styled only in
  the old palette.
- **Responsive design**: added tablet (`980px`, `899px`), mobile (`760px`)
  and small-phone (`520px`) breakpoints covering layout, typography,
  navigation-menu and image adjustments (see the breakpoint table in
  `README.md`).
- **Responsive images**: added `srcset`/`sizes` to the home page hero image
  so phones download a smaller file than desktop.
- **Navigation consistency**: added the missing "Projects" link (pointing
  to `index.html#projects`) and matched the gold "Request a Quote" button
  style across all five pages' navigation, which had drifted to an
  outline style on four of the five pages.
- **Footer consistency**: added the contact-details column to the footer
  on About, Services, Enquiry and Contact (previously only on the home
  page), and unified the footer sign-off text across all pages.
- Updated `README.md` (CSS architecture, breakpoint table, references) and
  this changelog.

## 2026-09-17 — Checked against CSS Fundamentals Part 2 course material

Cross-checked the existing `css/style.css` against the module's *CSS
Fundamentals Part 2: Layouts, responsive design & polished interfaces*
slides (display, Flexbox, Grid, positioning, interface styling, responsive
units/media queries, polish, debugging). No missing techniques were found —
everything the slides cover is already present in the stylesheet:

- **display**: block/inline/inline-block used correctly across nav links,
  buttons and inline tags (no layout change needed).
- **Flexbox**: header/nav, hero actions, card internals and the mobile nav
  menu all use `display: flex` with `justify-content`/`align-items`/
  `flex-wrap`/`gap`, matching the slides' row-vs-column guidance.
- **Grid**: `.services-grid`, `.service-tiles`, `.gallery-grid`,
  `.testimonial-grid`, `.about-grid`, `.mission-vision`, `.contact-grid`,
  `.form-row-split` and the footer (`grid-template-areas`) all use CSS
  Grid for two-dimensional layout, as recommended over Flexbox for that
  case.
- **Positioning**: `position: sticky` on the header, `position: relative`
  + `position: absolute` used correctly for the hero background/overlay
  and the mobile nav panel (the "reference box + badge" pattern from the
  slides) — no layout-by-`position: absolute` anti-pattern present.
- **Interfaces**: consistent `input`/`select`/`textarea` styling on the
  quote form, with `:focus` outlines kept rather than removed.
- **Responsive**: relative units (`rem`, `%`, `clamp()`), `@media` breakpoints
  at 980/899/760/520px, and a responsive nav that switches from a row to a
  stacked/collapsible menu on small screens.
- **Polish**: `box-shadow` on cards, `transition`/`transform` on hover and
  focus states, used selectively rather than on every element.
- Added the course slide deck to References below.

## 2026-10-24 — Part 3: feedback from Part 2

Part 2 result: 91/100. Four criteria were marked below full marks; each is
answered below with the exact feedback and the change made.

### 1. Responsive Design: Adjustment – Navigation Menu (4/5)
**Feedback:** "Navigation menu adjustments are present but could be improved.
The navigation menu adapts mostly correctly, but there may be minor issues."

**Changes** (`css/style.css`, `js/main.js`, all six HTML pages):
- **Fixed a CSS specificity bug in the mobile menu.** The desktop rules
  `.main-nav a:first-child` and `.main-nav a.nav-cta:last-child` were more
  specific than the mobile rules, so on phones the "Home" link lost its left
  padding (it sat against the screen edge) and the "Get a Free Quote" button was
  pushed off the right edge. Both are now restated inside the mobile media query.
- **Keyboard access.** The hidden checkbox that powers the menu used
  `display: none`, which made the menu impossible to open with a keyboard. It is
  now visually hidden but focusable at mobile widths, has an `aria-label`, and
  shows a visible focus ring on the hamburger button.
- **Hamburger animates into an X** when the menu is open, and the touch target
  was increased from 26 px to 44 px wide and high.
- **Closing behaviour** (`js/main.js`): the menu closes when a link is tapped,
  when Esc is pressed (focus returns to the toggle), when the user taps outside
  the header, and when the window is resized to desktop width.
- **Current page indicator**: added `aria-current="page"` to the matching link on
  every page, styled in gold (with an underline on desktop).
- **Tablet widths (761–1040 px)**: tightened the link gap and font size so the
  header never wraps. Checked at 770, 800, 860, 900, 980, 1040, 1100 and 1280 px.
- **Sticky header**: added `scroll-padding-top` so anchor links are not hidden
  under the header.
- **New Projects link** added to the navigation and footer of every page.

### 2. GitHub: Project Pushed with Multiple Descriptive Commits (2/5)
**Feedback:** "Few commits made, lacking descriptions."

**Change:** Part 3 is being committed as separate, single-purpose commits with
descriptive messages instead of one large upload. Messages used:
1. Add robots.txt and sitemap.xml with live site URLs
2. Convert project photos to WebP for faster page loading
3. Add shared JavaScript for lightbox, tabs, accordion and animations
4. Add project data and dynamic search, filter and sort script
5. Add Leaflet office map script for the contact page
6. Add form validation, estimate calculator and email compiler
7. Add Part 3 styles and improve mobile navigation CSS
8. Create projects page with searchable gallery and project map
9. Rebuild enquiry form with validation and instant estimate
10. Add contact form and office map to contact page
11. Update home, about and services pages with SEO tags and lightbox gallery
12. Add README screenshots and rewrite README sections
13. Update CHANGELOG with Part 2 feedback and Part 3 changes

### 3. GitHub: README Contains All Relevant Information (4/5)
**Feedback:** "README document is present but could be improved."

**Changes** (`README.md`, `docs/screenshots/`):
- Replaced the unfinished "Responsive testing evidence" section (it contained
  "..." placeholders) with real screenshots at desktop, tablet and mobile widths,
  plus the open mobile menu, form validation, estimate response, project search
  and contact form.
- Added a **Links** table (live site, repository, author, module, link to the changelog).
- Added **How to run the site locally**, including what needs an internet connection.
- Added a full **Part 3** section: interactive elements, maps, dynamic content and
  search, forms and validation, SEO, page speed and security, accessibility,
  deployment steps, form endpoint setup and a list of what was tested.
- Updated the page table, folder structure and technologies list for the new
  pages, scripts and images; corrected "five pages" to "six pages".
- Added in-text citations to each Part 3 section.

### 4. References (3/5)
**Feedback:** "Good progress is evident in the completeness and formatting of
references. Minor improvements in consistency, detail, or implementation are
still needed."

**Changes** (`README.md`):
- Rewrote the list in one consistent Harvard format: Author (Year) *Title*.
  Available at: URL (Accessed: Month Year).
- Sorted the list alphabetically by author and used 2026a, 2026b… for several
  MDN pages by the same author in the same year.
- Split combined entries (for example "CSS Grid Layout and Flexbox") into
  one reference per page, each with its own full URL.
- Added the sources used in Part 3 (Leaflet, OpenStreetMap, Formspree, GitHub
  Pages, Google's SEO Starter Guide, the W3C ARIA Authoring Practices, MDN pages on
  form validation, Intersection Observer and Content Security Policy).
- Added in-text citations in the README so each reference is used in the text.

## 2026-10-24 — Part 3: JavaScript, forms, SEO and deployment

### New files
- Added `js/main.js`, `js/projects-data.js`, `js/projects.js`, `js/maps.js`
  and `js/forms.js` (plain JavaScript, loaded with `defer`).
- Added `projects.html`, a sixth page for the dynamic project gallery.
- Added `robots.txt` and `sitemap.xml`.

### Interactive elements
- **Gallery lightbox** on the home page gallery and the Projects page:
  full-screen viewer, previous/next, keyboard (arrows/Esc), swipe, caption,
  image counter, focus trap and focus return to the clicked thumbnail.
- **Tabs** ("How we work") added to `services.html` using the WAI-ARIA tab
  pattern with arrow-key support.
- **Accordion**: the FAQ `<details>` elements now close each other so only one
  answer is open, with a slide/fade animation.
- **Modal** for project details on the Projects page.
- **Animations**: scroll-reveal on cards, animated counters on the About
  statistics, lightbox/modal/tab transitions, and a back-to-top button. All
  respect `prefers-reduced-motion`.
- **Interactive maps**: Leaflet + OpenStreetMap map of both offices on
  `contact.html` (with "fly to" buttons) and a map of project locations on
  `projects.html` that updates with the filters.

### Dynamic content and search
- Projects page cards are generated from the array in `js/projects-data.js`
  with DOM manipulation, plus live search, category filter, four sort orders,
  a live result count, a no-results message and a reset button. Static copies
  of the cards remain in the HTML for SEO and no-JavaScript visitors.
- The home page gallery now uses the six real project photos from `images/`
  (previously Unsplash stock images whose captions did not match the photos)
  and links to the new Projects page instead of the services page.

### Forms
- **`enquiry.html`**: rebuilt as a validated quote form with name, email, SA
  phone, service, property type, area, start date, budget, site-visit option,
  details and consent fields. On submit, JavaScript validates every field,
  shows inline errors, calculates an indicative cost range, earliest start
  date and budget comparison, issues a reference number and displays the
  response without reloading the page. If a form endpoint is set in the
  form's `action`, the data is also sent with `fetch()` (AJAX).
- **`contact.html`**: added the missing contact form (message type, subject,
  message, reply preference, consent). Valid input is compiled into an email
  addressed to the company; the visitor previews it and sends it from their
  email app (`mailto:`), or copies the text.
- Added character counters, a hidden honeypot field, `aria-invalid` /
  `aria-describedby` error wiring and an error summary that focuses the first
  invalid field.
- Removed the old unvalidated quote form (`action="#"`) from the home page;
  the section now links to the quote and contact pages so there is a single
  validated place for each type of submission.

### SEO
- Rewrote every `<title>` and meta description to be unique, keyword-led and
  an appropriate length; added page-specific `<meta name="keywords">`, author,
  robots and Open Graph tags to every page.
- Switched all page images to WebP with descriptive file names, explicit
  `width`/`height` and lazy loading; alt text kept descriptive.
- Added the Projects link to the navigation and footer of every page and added
  contextual internal links (About, Services, Contact, quote page).
- Added `robots.txt` and `sitemap.xml` (replace the placeholder address after
  deployment).

### Performance, security and accessibility
- Converted project photos from PNG to WebP (about 90 % smaller); original
  PNGs kept in `images/`.
- Added a Content-Security-Policy meta tag, referrer policy and Subresource
  Integrity hashes for Leaflet; all dynamic text is inserted with `textContent`.
- Added a skip-to-content link and `id="main"` on every page's `<main>`.
- Added CSS for the new components (lightbox, modal, tabs, toolbar, project
  cards, maps, form validation states, result panels, print styles).

### Documentation
- Updated `README.md` (see item 3 under Part 2 feedback above).
- Replaced the "Planned for later parts" items below as completed.

## Known limitations and remaining to-do

- The enquiry form's `action` still contains the placeholder `YOUR_FORM_ID`.
  Until a real Formspree form ID is added in `enquiry.html`, the indicative
  estimate is calculated and shown in the browser but the enquiry is not
  delivered by email. The contact form is unaffected: it opens the visitor's
  email app addressed to the company.
- The estimate rates in `js/forms.js` and the project years in
  `js/projects-data.js` are demonstration figures and must be replaced with
  the company's real pricing and dates before commercial use.
- Map pins are approximate suburb centres, not exact street addresses.

## 2026-10-29 — Part 3: clean-up before submission

- Corrected an out-of-date HTML comment in `index.html` that still described
  the contact form as static (`action="#"`) and "planned for later parts".
  The comment now explains that the forms live on `enquiry.html` and
  `contact.html`.
- Replaced the outdated "Planned for later parts" list in this changelog with
  the accurate list of known limitations above.
- Added a YouTube video row to the Links table in `README.md` and a note on
  the placeholder project years in `js/projects-data.js`.
- Added the final YouTube video link (https://youtu.be/24OCpK01eXw) to the
  Links table in `README.md`, replacing the placeholder text.
