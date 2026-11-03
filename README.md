# Thar Nyi Nyi — portfolio (opening: logo → HUD ring → shatter → first page)

Nordic Indigo `#263BAA` × Vanilla Mist `#FFF4D6` (all colours are tokens at the top of `css/style.css`). Open `index.html`.

## Structure
- `index.html` — home. The **first page** is the code-window hero `<section class="ch">`, built by `hero/coding-hero.js` in front of the empty `<section class="hero">` anchor (keep that anchor).
- `loading/loading.js` + `loading.css` — the opening: bars → logo → scroll turns a HUD ring once → logo + ring shatter → the first page opens. A map of the file is at the top of `loading.js`.
- `loading/page-loader.js` + `page-loader.css` — the quick loader shown on every other page (and on the Home button).
- `hero/` — the code-window hero. `css/` + `js/` — shared styles, `main.js` (nav, typing…), `motion.js` / `v2-motion.js` (reveals, stacking sections).
- `profile / works / contact / work-*.html` — the other pages. `assets/works/` — project images.

## Flags
`?intro=poster` force the opening · `?intro=off` skip it · `?introSpeed=0.3` slow motion.
Tuning: `window.LOGO_LOADING_INDIGO_CONFIG = { speed: 1.2, scrollDistance: 650 }`.
