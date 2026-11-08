/* =====================================================================
   Reverse-scroll gallery (works.html, "すべて" tab, desktop only)

   1. Reads the 16 work rows that already exist in the list.
   2. Builds a gallery from them: three columns, rows dealt out 1-2-3-1-2-3…
   3. Shows the gallery only on the "すべて" tab (adds class .is-all to the section).
   The CSS (css/reverse-gallery.css) does the moving.
   ===================================================================== */
(() => {
  const section = document.querySelector(".works-showcase");
  const list = document.getElementById("worksGrid");
  const tabs = document.querySelectorAll(".filter-tab");
  if (!section || !list) return;

  const rows = [...list.querySelectorAll(".proj-row")];

  // The gallery: three columns inside one box. Left and right move up, middle moves down.
  const gallery = document.createElement("div");
  gallery.className = "rev-gallery";

  const cols = [0, 1, 2].map((i) => {
    const col = document.createElement("div");
    col.className = i === 1 ? "rev-col rev-col--down" : "rev-col rev-col--up";
    gallery.append(col);
    return col;
  });

  // One card per work row
  rows.forEach((row, n) => {
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

    const caption = document.createElement("span");
    caption.className = "rev-card__title";
    const title = row.querySelector(".proj-row__title");
    caption.textContent = title ? title.textContent : "";

    link.append(img, caption);

    // Works 1, 4, 7… go in the left column; 2, 5, 8… in the middle; 3, 6, 9… on the right
    cols[n % 3].append(link);
  });

  section.append(gallery);

  // Show the gallery only on the "すべて" tab
  const setFilter = (filter) => {
    section.classList.toggle("is-all", filter === "all");
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setFilter(tab.dataset.filter));
  });

  setFilter("all");   // works.html opens on "すべて"
})();
