/* =====================================================================
   Reverse-scroll gallery (works.html, "すべて" tab, desktop only)
   Idea from https://scroll-driven-animations.style/demos/reverse-scroll/css/

   1. Reads the work rows that already exist in the list.
   2. Builds a gallery from them: three columns of about the same height.
   3. The middle column scrolls normally. The two outer columns are stacked
      the other way round (column-reverse) and the CSS moves them DOWN while
      the page scrolls, so on screen they travel in the opposite direction.
   4. Works out where the outer columns start and stop (--rev-from / --rev-to).
   5. Shows the gallery only on the "すべて" tab (class .is-all on the section).
   ===================================================================== */
(() => {
  const section = document.querySelector(".works-showcase");
  const list = document.getElementById("worksGrid");
  const tabs = document.querySelectorAll(".filter-tab");
  if (!section || !list) return;

  const rows = [...list.querySelectorAll(".proj-row")];

  // Category names, the same as on the filter buttons
  const CATEGORY = { web: "Webデザイン", graphic: "グラフィックデザイン", video: "動画編集" };

  // The gallery: three columns inside one box
  const gallery = document.createElement("div");
  gallery.className = "rev-gallery";

  const cols = [0, 1, 2].map((i) => {
    const col = document.createElement("div");
    col.className = i === 1 ? "rev-col" : "rev-col rev-col--reverse";
    col.dataset.h = 0;
    gallery.append(col);
    return col;
  });
  const outerCols = [cols[0], cols[2]];

  // Rough height of a card, counted in card widths (1 = as tall as the card is wide)
  const cardHeight = (link, img) => {
    const picture = link.classList.contains("rev-card--page") ? 5 / 4 : (img.height / img.width || 1);
    return picture + 0.3;                                      // + title and gap
  };
  const shortest = () => cols.reduce((a, b) => (Number(a.dataset.h) <= Number(b.dataset.h) ? a : b));

  // One card per work row
  rows.forEach((row) => {
    const link = document.createElement("a");
    link.className = "rev-card";
    link.href = row.getAttribute("href");

    const img = document.createElement("img");
    const source = row.querySelector(".proj-row__media img");
    if (source) {
      img.src = source.getAttribute("src");
      img.alt = source.getAttribute("alt") || "";
      img.width = Number(source.getAttribute("width"));     // so the card has the right height before the picture loads
      img.height = Number(source.getAttribute("height"));
    }

    // Website screenshots are long pages: the CSS shows only their top part
    if (row.parentElement.dataset.category === "web") {
      link.classList.add("rev-card--page");
    }
    img.loading = "lazy";
    img.decoding = "async";

    // Bottom row of the card: title on the left, category tag on the right
    const foot = document.createElement("span");
    foot.className = "rev-card__foot";

    const caption = document.createElement("span");
    caption.className = "rev-card__title";
    const title = row.querySelector(".proj-row__title");
    caption.textContent = title ? title.textContent : "";

    const tag = document.createElement("span");
    tag.className = "rev-card__tag";
    tag.textContent = CATEGORY[row.parentElement.dataset.category] || "";   // i18n.js turns it into English in EN mode

    foot.append(caption, tag);
    link.append(img, foot);

    // Each card goes in the column that is shortest so far, so the three columns end at about the same height
    const col = shortest();
    col.append(link);
    col.dataset.h = Number(col.dataset.h) + cardHeight(link, img);
  });

  section.append(gallery);

  /* Where the outer columns start and stop (in px, as --rev-from / --rev-to).
     Start: a card's top edge lines up with the first card of the middle column,
            and the column's first work (at the bottom, because of column-reverse) is near the bottom of the screen.
     Stop:  the column's last work (at its top) has just come into view, and a card's bottom edge
            lines up with the bottom of the gallery.
     In between, the column moves down while the page moves up — the "reverse" scroll.
     Because both ends are worked out from the column's own height, the column never
     runs out of cards on screen, even when it is shorter than the middle one. */
  const measure = () => {
    if (!section.classList.contains("is-all")) return;
    const screen = window.innerHeight;
    const cardsBottom = Math.max(...cols.map((col) => col.offsetTop + col.offsetHeight)) - cols[1].offsetTop;  // height of the card area

    outerCols.forEach((col) => {
      // A card's top inside its column. (The column has will-change: transform, so in some
      // browsers the card's offsetTop is already counted from the column, in others from further up.)
      const topIn = (card) => (card.offsetParent === col ? card.offsetTop : card.offsetTop - col.offsetTop);
      const cards = [...col.children].map((card) => ({
        top: topIn(card),
        bottom: topIn(card) + card.offsetHeight,
      }));
      // Start: the highest card top that still keeps the column's bottom at or below the screen bottom
      const startLimit = col.offsetHeight - screen;
      const from = -Math.max(0, ...cards.map((c) => c.top).filter((top) => top <= startLimit));
      // Stop: the lowest card bottom that still keeps the column's top at or above the screen top
      const bottoms = cards.map((c) => c.bottom).filter((bottom) => bottom >= screen);
      const to = cardsBottom - (bottoms.length ? Math.min(...bottoms) : col.offsetHeight);
      col.style.setProperty("--rev-from", `${from}px`);
      col.style.setProperty("--rev-to", `${Math.max(from, to)}px`);
    });
  };

  // Show the gallery only on the "すべて" tab
  const setFilter = (filter) => {
    section.classList.toggle("is-all", filter === "all");
    measure();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setFilter(tab.dataset.filter));
  });

  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);      // after the fonts and pictures, when the heights are final
  setFilter("all");                              // works.html opens on "すべて"
})();
