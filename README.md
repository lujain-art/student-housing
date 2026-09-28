# Student Housing Website Prototype

A portfolio prototype of a student-housing website, built to demonstrate front-end work:
a six-page bilingual (Arabic RTL / English LTR) site with a full design system.

**This is not a real residence, and it is not affiliated with any university or
organisation.** Every identifying detail from the source project has been replaced with
generic or deliberately fictional values.

---

## What was changed, and what was not

**Kept exactly as-is — the design.** All six pages, the stylesheet, the language system and
the interaction layer are the original work. Markup structure, class names, CSS, spacing,
typography, colour palette (`#02091c` / `#051c43` navy with `#f3bf5b` gold), radii, shadows
and every animation are untouched. `Style.css` is byte-identical apart from the deletion of
one dead `#userwayWidgetIcon` rule.

**Replaced — the content.**

| Original | Now |
|---|---|
| Organisation name | *Student Housing* / سكن الطالبات |
| University name | *the University* / الجامعة |
| City and country | removed — *near the campus* |
| Two Jordan phone numbers | the project's own number, `+962 7 754 44643` |
| Gmail address | the project's own address |
| Facebook / Instagram profiles | the project's own profiles |
| Google Maps embed (exact coordinates) | a styled map placeholder |
| Accessibility widget account | removed |
| Three named partner companies | GuardPro / Nova Agency / EquipCo, with original marks |
| "70 rooms", "5-star" | removed — *varied rooms*, *premium* |
| Cloudflare email-obfuscation script | removed |

Two pre-existing path bugs were also fixed: `Photos/Logo.pngq` in the favicon link and
`Pictures/Logo.png` in the `og:image` meta tag.

### What is still deliberately generic

The contact details are real, but three links have no real destination yet and still point at
`example.com`, which is reserved for documentation and never resolves:

- the map / location link (three places)
- the three fictional partner cards

The partners are invented names, so their cards are placeholders until real partner pages exist.

---

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, features, vision, partners |
| `Rooms_Page.html` | Rooms — single, double, triple |
| `Services_Page.html` | Services and facilities — eight sections |
| `News_Page.html` | News and events |
| `Guide_Page.html` | Residency guide — steps, checklist, FAQ |
| `Contact_Page.html` | Contact — details, form, map |

## Features

- Bilingual Arabic / English with direction flipping, persisted in `localStorage`
- Anti-flash: the saved language is applied inside `<head>` before first paint
- Room tabs, news filter, FAQ accordion
- Background music with a mute toggle, remembered between pages
- Photo galleries, lightbox with keyboard support
- Contact form with client-side validation
- Responsive down to small phones, with a mobile navigation drawer

## Media

- **89 photographs** and **17 videos** from Pexels, under the Pexels License — one distinct
  asset per slot, nothing reused in two places. Full manifest with per-file IDs, durations and
  source links in [`CREDITS.md`](CREDITS.md).
- **Original SVG artwork** for the logo, the building illustration and the three partner marks.
- Every `<video>` element in the markup is **byte-identical to the original**; only the two
  renamed event paths differ. The hero clip is 720p, the cards and service panels 360p.

## Running it

Open `index.html` directly, or serve the folder:

```
python -m http.server 8000
```

Then visit <http://localhost:8000>.

No build step, no dependencies, no framework. Deploying to GitHub Pages means uploading the
folder as-is.

---

## A note on review

The 89 photos and 17 clips were selected by search relevance and licence metadata, and every
one is a real Pexels file, but they have not been eyeballed one by one. If an asset looks off
in a given slot, swap it: keep the filename and extension, drop another Pexels image or clip
in its place, and update that row in `CREDITS.md`.
