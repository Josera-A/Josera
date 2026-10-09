# Josera — Animal Food Shop Website

A small, static, Armenian-language website for a shop selling **Josera** dog and cat food. It is an informational catalog, not an online store: there is no cart, checkout, login or backend. Customers usually open it from a **QR code** in the shop or a **direct link**.

- **Repository:** https://github.com/Josera-A/Josera (branch `main`)
- **Expected live URL (GitHub Pages project site):** https://josera-a.github.io/Josera/
  (inferred from the repository name; confirm it under *Settings → Pages* in the repository)
- **Language of the site:** Armenian (`<html lang="hy">`). Product names are kept in English/Latin.

---

## Contents

1. [Purpose and target users](#1-purpose-and-target-users)
2. [How customers reach the site (QR / direct link)](#2-how-customers-reach-the-site-qr--direct-link)
3. [Technology stack](#3-technology-stack)
4. [Architecture](#4-architecture)
5. [Folder structure](#5-folder-structure)
6. [Pages and functionality](#6-pages-and-functionality)
7. [Product and content organization](#7-product-and-content-organization)
8. [Running the project locally](#8-running-the-project-locally)
9. [Editing content](#9-editing-content)
10. [Deployment (GitHub Pages)](#10-deployment-github-pages)
11. [QR codes](#11-qr-codes)
12. [Responsive design](#12-responsive-design)
13. [SEO](#13-seo)
14. [Accessibility](#14-accessibility)
15. [Known issues](#15-known-issues)
16. [Recommended improvements](#16-recommended-improvements)
17. [Future possibilities](#17-future-possibilities)

---

## 1. Purpose and target users

**Purpose:** let shop customers quickly see which Josera products the shop carries, what each one is for (age, breed size, health need), what it contains, and the bag size.

**Target users:**

- Shop visitors scanning a QR code on a shelf, poster or bag — almost always on a **phone**, often on mobile data.
- Customers who received a link (messenger, social media).
- Shop staff showing products to customers.

**Main user flow:**

```
QR code / link
   └─> index.html (home)  ──or──  a category page directly
          └─> category page (shun / katu / josi / bjshkakan)
                 └─> product-detail.html?id=<product_id>
                        └─> "← Վերադառնալ" (back) button
```

---

## 2. How customers reach the site (QR / direct link)

Every page is a plain URL, so any of them can be the target of a QR code:

| Target | URL (relative to the site root) |
|---|---|
| Home | `index.html` (or just the root `/`) |
| Dog food | `shun.html` |
| Cat food | `katu.html` |
| Josi line | `josi.html` |
| Veterinary / medical | `bjshkakan.html` |
| One specific product | `product-detail.html?id=josera_kids` |

> ⚠️ **Printed QR codes depend on these file names and product IDs.** Renaming a page, moving the site to another repository/URL, or changing a product ID will break QR codes that are already printed. See [QR codes](#11-qr-codes).

---

## 3. Technology stack

| Area | What is used |
|---|---|
| Markup | Hand-written HTML5 (6 pages) |
| Styling | One plain CSS file, `css/styles.css` (CSS variables, Flexbox, Grid, media queries). No preprocessor, no framework. |
| Scripts | Vanilla JavaScript (no framework, no jQuery, no modules) |
| Product data | A JavaScript object (`productsData`) in `js/data.js` |
| Images | WebP files in `pictures/` (1200 px wide, ~85–235 KB each) |
| Fonts | System fonts only (`Segoe UI`, Tahoma, Geneva, Verdana, sans-serif) — nothing loaded from the network |
| Icons / illustrations | Emoji and inline SVG drawn directly in `index.html`; `favicon.svg` |
| Build tools | **None.** No `package.json`, no npm, no bundler. |
| External services / CDNs | **None.** The site makes no network requests other than to its own files. |
| Hosting | GitHub Pages (static hosting from the repository) |

---

## 4. Architecture

### Static site — no backend

The project is a **fully static website**. Verified in the code:

- No server code, no API calls (`fetch`, `XMLHttpRequest`), no forms, no database, no cookies or `localStorage`.
- The only dynamic part is `product-detail.html`, which reads `?id=` from the URL **in the browser** and fills the page from `js/data.js`.
- Contact is a `mailto:` link in the footer.

Because there is no backend, the site works on GitHub Pages as-is, and it also works when opened directly from disk (`file://`), because data is loaded with a normal `<script>` tag instead of `fetch()`.

### How the pieces fit together

```
                 css/styles.css ............ all pages
                 js/script.js .............. all pages (menu, small animations)

index.html       static content only

shun.html  ┐
katu.html  ├──── js/data.js     (productsData = { id: {..., category, card, ...} })
josi.html  │     js/catalog.js  builds the cards for this page's category
bjshkakan  ┘          │           <div class="product-cards-grid" data-category="dog">
                      ▼
product-detail.html?id=<id>
                 ── js/data.js
                 ── js/product-detail.js  (reads ?id=, fills the page, sets the tab title)
```

**`js/data.js` is the single source of product information.** Category pages contain no product HTML; `js/catalog.js` creates one card per product whose `category` matches the page, in the order of `data.js`. Card text comes from the `card` field.

---

## 5. Folder structure

```
Josera_Jivan/                     (local clone of github.com/Josera-A/Josera)
├── index.html                    Home page
├── shun.html                     Dog food category (15 products)
├── katu.html                     Cat food category (5 products)
├── josi.html                     Josi line category (4 cat + 5 dog products)
├── bjshkakan.html                Veterinary "Help" category (9 products)
├── product-detail.html           Single template for every product's detail page
├── PRODUCT_DETAIL_GUIDE.md       Short developer note on the product detail system
├── README.md                     This file
├── favicon.svg                   Browser tab icon (black square, yellow "J")
├── robots.txt                    Allows all search engines
├── .nojekyll                     Tells GitHub Pages to serve files as-is (no Jekyll)
│
├── css/
│   └── styles.css                All styles for all pages (~1080 lines)
│
├── js/
│   ├── script.js                 Shared UI behaviour (mobile menu, animations)
│   ├── data.js                   All product data (productsData object, 38 products)
│   ├── catalog.js                Builds category page cards from data.js
│   └── product-detail.js         Fills product-detail.html from data.js
│
├── pictures/                     Product photos (WebP)
│   ├── dog/                      dog-josera_<name>.webp       (15)
│   ├── cat/                      cat-josera_<name>.webp       (5)
│   ├── josi/                     josi&<cat|dog>_<name>.webp   (9)
│   └── help/                     help&josera_<name>.webp      (9)
│
└── text/                         Source texts (Armenian) the product data was written from
    ├── dog.txt                   Not used by the website, but publicly downloadable
    ├── cat.txt                   once deployed (GitHub Pages serves every file).
    ├── JOSI.txt
    └── Help.txt
```

### Important files

| File | Role | Notes |
|---|---|---|
| `css/styles.css` | Every style on the site | Colour palette is in `:root` (`--primary-yellow: #FFD700`, `--dark-black: #1a1a1a`, …). Sections: header, hero, about, features, product sections, footer, responsive rules, product cards, product detail. |
| `js/script.js` | Shared behaviour | `toggleMenu()` (mobile ☰ menu, called from `onclick` in each header; also closes on outside click, link click and Escape; keeps `aria-expanded` in sync), current-page highlight (`.active` + `aria-current="page"`), fade-in of feature cards, ripple on `.cta-button`, a short page fade-in on `DOMContentLoaded`. Animations are skipped when the system "reduce motion" setting is on. |
| `js/data.js` | Product database | Global `const productsData = { '<id>': { name, category, card, type, mini, description, packaging, image } }`. Field reference in the comment at the top of the file. |
| `js/catalog.js` | Category cards | Finds `.product-cards-grid[data-category]`, creates an `<a class="product-card">` for each matching product (lazy-loaded image). |
| `js/product-detail.js` | Detail page logic | Reads `?id=`, fills `#productName`, `#productType`, `#productMini`, `#productDesc`, `#productPackaging`, `#productImage`, and sets the tab title and meta description to the product. Unknown/missing id → "Ապրանքը չի գտնվել։" with a button back to the home page. Back button: `history.back()` when the visitor came from this site, otherwise `index.html` (e.g. opened from a QR code). |

---

## 6. Pages and functionality

All pages share the same **header** (logo → `index.html`, a short tagline, four category buttons, ☰ toggle on mobile) and **footer** (logo, the same four links, © line, `info@Josera.am`). Header and footer are **copied into every HTML file** — there is no include system — so a change to navigation or contact info must be made in all six files.

| Page | File | Content |
|---|---|---|
| Home | `index.html` | Hero with headline and "Ավելին Իմացեք" button (scrolls to About), an inline SVG illustration; "About Josera" text; four "advantages" cards; a dog-food and a cat-food section with benefit lists, simple SVG drawings and a button to `shun.html` / `katu.html`. |
| Dog food (Շուն) | `shun.html` | 15 product cards (puppy → adult → mini breeds). |
| Cat food (Կատու) | `katu.html` | 5 cards. |
| Josi (Ջոսի) | `josi.html` | Josi line: 4 cat + 5 dog cards on one page. |
| Medical (Բժշկական) | `bjshkakan.html` | Josera Help veterinary diets: 9 cards (4 cat, 5 dog). |
| Product detail | `product-detail.html?id=…` | Name, type, short description, full description, packaging badge and large photo. Back button. |

Each category page has a visually hidden `<h1>` (for screen readers and search engines) and an empty grid that `js/catalog.js` fills. Without JavaScript a short Armenian message is shown instead.

**Category grid layout:** 3 columns on desktop, 2 columns ≤ 992 px, 1 column ≤ 520 px. Each card is an `<a class="product-card">` containing a title, a short line and the image.

---

## 7. Product and content organization

### Categories and product IDs

IDs are the keys of `productsData` in `js/data.js` and the value of `?id=` in URLs.

| Category | Page | IDs |
|---|---|---|
| Dog (15) | `shun.html` | `josera_family_plus_mother_puppy`, `josera_surf_turf_junior`, `josera_kids`, `josera_sensi_junior`, `josera_mini_junior`, `josera_lamb_sweet_potato`, `josera_duck_sweet_potato`, `josera_poultry_trout`, `josera_sensi_adult`, `josera_lamb_rice`, `josera_festival`, `josera_large_breed`, `josera_mini_lamb`, `josera_mini_duck_potato`, `josera_mini_salmon_chicken` |
| Cat (5) | `katu.html` | `josera_kitten_grainfree`, `josera_naturecat`, `josera_catelux`, `josera_dailycat`, `josera_leger` |
| Josi cat (4) | `josi.html` | `josi_cat_kitten`, `josi_cat_sterilised_classic`, `josi_cat_crispy_duck`, `josi_cat_tasty_beef` |
| Josi dog (5) | `josi.html` | `josi_dog_family`, `josi_dog_junior`, `josi_dog_mini`, `josi_dog_active`, `josi_dog_regular` |
| Help / medical (9) | `bjshkakan.html` | `josera_help_urinary_cat`, `josera_help_renal_cat`, `josera_help_gastrointestinal_cat`, `josera_help_hypoallergenic_cat`, `josera_help_gastrointestinal_dog`, `josera_help_hypoallergenic_dog`, `josera_help_renal_dog`, `josera_help_weight_diabetic_dog`\*, `josera_help_liver_dog`\* |

\* Added to `bjshkakan.html` in October 2026 (they existed in `data.js` before but had no card).

### Product record format (`js/data.js`)

```js
'josera_kids': {
  name: 'Josera Kids',                                   // card title + detail <h1>
  category: 'dog',                                       // dog | cat | josi | help
  card: 'Նախատեսված է միջին և մեծ չափի ձագուկների համար (2–15 ամսական)', // card line
  type: 'Գերմանական սուպեր պրեմիում դասի կեր',           // product class line
  mini: 'Նախատեսված է ... ձագուկների համար (2–15 ամսական)։', // who it is for
  description: 'Պարունակում է թռչնամիս։ ...',             // full text (plain text, no HTML)
  packaging: '12.5 kg',                                  // badge text
  image: 'pictures/dog/dog-josera_kids.webp'             // relative path, case-sensitive
},
```

All values are inserted with `textContent`, so HTML tags inside them are shown literally (safe, but no formatting/line breaks).

### Card text vs. detail text

`card` (shown on the category page) and `mini` (shown on the detail page) are separate fields so the card can be shorter. They were copied from the old hand-written cards and some still use different wording (e.g. card "միջին և մեծ չափի", `mini` "միջին և մեծ ցեղատեսակի"). Keep them consistent when editing. If `card` is empty, `mini` is used.

### `text/` folder

`text/*.txt` holds the original Armenian product texts (longer descriptions, packaging, image names). They are **not loaded by the site**. Some image names inside them (`cat/cat&…`) no longer match the real file names (`cat/cat-…`). Treat `js/data.js` as the source of truth.

---

## 8. Running the project locally

**Requirements:** a web browser. Optionally Git and Python or Node for a local server.

```bash
git clone https://github.com/Josera-A/Josera.git
cd Josera
```

**Option A — open the file:** double-click `index.html`. Everything works from `file://`, including product detail pages, because no `fetch()` is used.

**Option B — local web server (recommended, closest to GitHub Pages):**

```bash
python -m http.server 8000          # or: python3 -m http.server 8000
# open http://localhost:8000/
```

or `npx serve .` if Node.js is installed.

There is no install or build step. Edit a file, save, refresh the browser.

**Test on a phone:** run the local server, make sure the phone is on the same Wi-Fi, and open `http://<your-computer-IP>:8000/`. Also use the browser DevTools device toolbar (375 px, 768 px, 1280 px widths).

---

## 9. Editing content

Only `js/data.js` needs to change for products. All values are JavaScript strings in single quotes: if a text contains `'`, write `\'`.

### Change an existing product

Edit its record in `js/data.js`. The card and the detail page both update.

### Add a product

1. Put the photo in the right `pictures/<category>/` folder, following the naming pattern of that folder (see §5). Use **lowercase, no spaces**. WebP, 1200 px wide, ideally under ~200–250 KB.
2. Copy an existing record in `js/data.js`, paste it where the card should appear (order in the file = order on the page), give it a new unique ID (lowercase, `_` separated) and fill in all fields, including `category`. Keep the comma between records.
3. Open the category page and `product-detail.html?id=NEW_ID` and check both.

### Move a product to another page

Change its `category`.

### Remove a product

Delete its record from `data.js`. If a printed QR code may point to `product-detail.html?id=<that id>`, consider keeping the record and only changing `category` to something unused (e.g. `'hidden'`) — the card disappears but the QR link still works.

### Change images

Replace the file in `pictures/…` **with the same file name** — nothing else needs to change. If the name changes, update the `image` field in `data.js`.

To shrink a large photo (Python + Pillow):

```bash
python -c "from PIL import Image; im=Image.open('in.webp'); im.thumbnail((1200,4000)); im.save('out.webp','WEBP',quality=80,method=6)"
```

> GitHub Pages runs on Linux and is **case-sensitive**: `Dog/` ≠ `dog/`, `.WEBP` ≠ `.webp`. A path that works on Windows can 404 online.
> File names in `josi/` and `help/` contain `&`. They work, but for new images prefer `-` or `_`.

### Change shop / contact information

The header, footer, tagline, copyright and e-mail are duplicated in **all six HTML files**. To change the e-mail, search the project for `info@Josera.am` and replace every occurrence (there is one per page). Same for nav labels and the © year.

Home page texts (hero, About, advantages, dog/cat sections) are in `index.html` only.

The site currently has **no address, phone number, opening hours or map**. If they are added, add them to the footer of every page (see recommended improvements for reducing this duplication).

### Change colours / styles

Edit the variables at the top of `css/styles.css` (`:root`). The visual identity is black/white with gold-yellow (`#FFD700`) accents and the "José**ra**" text logo.

---

## 10. Deployment (GitHub Pages)

### How it is deployed

- There is no build and no GitHub Actions workflow (`.github/` does not exist), so the site is served directly from the repository using GitHub Pages "**Deploy from a branch**".
- Expected setting: *Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`*.
- Publishing = pushing to `main`:

  ```bash
  git add .
  git commit -m "Update product texts"
  git push origin main
  ```

  GitHub Pages republishes within a minute or two. Hard-refresh (Ctrl+F5) or use a private window if you still see the old version.

### GitHub Pages compatibility (checked)

| Check | Status |
|---|---|
| `index.html` in repository root | ✅ |
| All links and asset paths are **relative** (`css/…`, `js/…`, `pictures/…`, `shun.html`) — works under the `/Josera/` sub-path of a project site | ✅ |
| No absolute `/…` paths | ✅ |
| Every referenced file exists with the exact same letter case | ✅ (verified) |
| Every product ID linked from a page exists in `data.js` | ✅ (verified) |
| No server-side code, no API | ✅ |
| `.nojekyll` present — files are served as-is | ✅ |
| Custom domain (`CNAME`) | Not configured |

### GitHub Pages limitations to keep in mind

- Static files only: no server code, databases, form handling or server-side redirects.
- Repository should stay under 1 GB; published site ≤ 1 GB; soft bandwidth limit 100 GB/month. Large images count toward these.
- No custom HTTP headers or caching control.
- Everything in the repository (including `text/` and `*.md`) is publicly downloadable.
- Changing the repository name, owner or moving to a custom domain changes the URL and breaks printed QR codes (unless the old URL redirects).

---

## 11. QR codes

- Encode the **full HTTPS URL**, e.g. `https://josera-a.github.io/Josera/` or `https://josera-a.github.io/Josera/product-detail.html?id=josera_kids`.
- Prefer pointing general QR codes to the **home page** or a **category page**; use product QR codes only on shelf labels for that product.
- Before printing, scan the code with at least one Android and one iPhone.
- **Never rename** `index.html`, `shun.html`, `katu.html`, `josi.html`, `bjshkakan.html`, `product-detail.html` or existing product IDs once QR codes are printed.
- If you expect the URL to change (new domain, new repo), consider a custom domain now, so future moves don't break printed codes.
- QR visitors are on phones, often on mobile data — keep image sizes small (see Known issues).

---

## 12. Responsive design

Breakpoints used in `css/styles.css`:

| Width | Behaviour |
|---|---|
| > 1024 px | Desktop. Detail page: text left, sticky image right (420 px column). |
| ≤ 1024 px | Home dog/cat sections stack; detail page becomes one column. |
| ≤ 992 px | Product grid: 2 columns. |
| ≤ 768 px | Header nav hidden, ☰ button shown; menu opens as a full-width panel. Header tagline hidden. Cards stack image above text. |
| ≤ 520 px | Product grid: 1 column. |
| ≤ 480 px | Header fixed at 60 px height, smaller headings and buttons. |

Verified in a headless browser at 375, 800 and 1280 px: no horizontal scrolling, menu opens/closes, footer links visible on all widths.

---

## 13. SEO

Present:

- `lang="hy"`, `charset`, `viewport`, `theme-color` on every page.
- A unique `<title>` and an Armenian `<meta name="description">` on each page.
- Open Graph tags (`og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`) for link previews.
- `favicon.svg`, `robots.txt`.
- One `<h1>` per page (visually hidden on category pages).
- Product detail page sets its tab title and description to the product with JavaScript.

Still missing:

- `og:image` and `sitemap.xml` — both need the final absolute URL; add them once the live URL/domain is confirmed.
- Product and card content is built by JavaScript. Google renders JavaScript, but some link-preview bots don't, so previews of `product-detail.html?id=…` show the generic description.

---

## 14. Accessibility

In place:

- Semantic `header` / `nav` / `main` / `footer` on every page; one `<h1>` per page.
- ☰ button: `type="button"`, Armenian `aria-label="Մենյու"`, `aria-expanded`, `aria-controls="headerMenu"`; Escape closes the menu.
- Navigation landmarks have Armenian labels; current page link has `aria-current="page"`.
- Visible keyboard focus outline (`:focus-visible`).
- Decorative SVGs and emoji have `aria-hidden="true"`.
- Animations are disabled when the system "reduce motion" setting is on.
- Product cards are real links; all product text is inserted with `textContent`.

Remaining:

- Yellow (`#FFD700`) text on white (hero highlight word, logo "ra") has low contrast. Not changed because it is part of the visual identity.

---

## 15. Known issues

1. **Armenian text quality.** Several home-page texts are grammatically broken or machine-translated, and some product texts have errors or inconsistent terms. A full list was reviewed with the owner in October 2026; fixes need a native speaker's approval.
2. **Header and footer are copied into all 6 HTML files** — navigation, e-mail and © line must be changed in every file.
3. **No shop address, phone, hours or map** anywhere on the site.
4. **Content claims to verify:** "more than 20 years" (About), "organic / no artificial substances" (advantages), "© Josera" (the shop is a reseller, not the manufacturer).
5. **`text/*.txt` and the `.md` files are publicly downloadable** from the live site.
6. Image file names in `josi/` and `help/` contain `&` (they work, but avoid it for new files).
7. Live URL / Pages settings could not be verified from the code; confirm in the repository settings.

## 16. Recommended improvements

**Done (October 2026)**

- Large images recompressed (pictures folder ~30 MB → ~5 MB; cat page ~12.7 MB → ~1 MB); unused PNG removed.
- Page no longer waits for every image before appearing.
- Footer links visible on phones.
- Cards generated from `data.js` (single source of truth); 2 missing medical products now shown.
- 4th menu item unified to "Բժշկական".
- Lazy-loaded images; per-product tab title; "not found" message with a link home.
- Meta description, Open Graph, favicon, `robots.txt`, `.nojekyll`.
- Accessibility fixes (see §14); dead JavaScript removed and JS-injected CSS moved into `styles.css`; duplicated CSS merged.
- Home dog/cat sections link to their category pages; home SVG drawings no longer overlap the text on phones.

**Next**

- Proofread and correct the Armenian texts (index.html and `js/data.js`).
- Add shop address, phone, opening hours and a map link to the footer.
- Add a line on medical products such as "Օգտագործել անասնաբույժի խորհրդով".
- After the live URL is confirmed: `og:image`, `sitemap.xml`, optionally a custom domain.
- Optionally inject the shared header/footer from one JS file to remove duplication.

## 17. Future possibilities

The recommended architecture is to **stay static**: HTML + CSS + vanilla JS, with all products in `js/data.js`. A backend is not needed for an informational catalog.

- **Single source of product data** — `data.js` already holds everything; category pages can render their cards from it with a few lines of JS. A `data.js` file is preferred over `products.json` because JSON needs `fetch()`, which does not work when opening files from disk and adds a loading step.
- **Search / filter** (by age, size, health need) — client-side, on `data.js`.
- **Shared header/footer** — inject from one JS function, or use a tiny static site generator (e.g. Eleventy) with a GitHub Actions deploy, only if the team is comfortable with a build step.
- **Prices / availability** — can stay in `data.js`; if non-developers must edit them often, a headless CMS or a published Google Sheet could be considered later.
- **Multi-language (hy / ru / en)** — per-language fields in `data.js`.
- **Analytics** — a privacy-friendly script to measure QR scans (with UTM parameters in QR URLs).
