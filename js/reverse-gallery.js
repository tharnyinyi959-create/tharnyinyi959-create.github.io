/* =====================================================================
   Reverse-scroll gallery (works.html, "すべて" tab, desktop only)

   1. Reads the 16 work rows that already exist in the list.
   2. Builds a gallery from them: two columns, odd rows left, even rows right.
   3. Shows the gallery only on the "すべて" tab (adds class .is-all to the section).
   The CSS (css/reverse-gallery.css) does the moving.
   ===================================================================== */
(() => {
  const section = document.querySelector(".works-showcase");
  const list = document.getElementById("worksGrid");
  const tabs = document.querySelectorAll(".filter-tab");
  if (!section || !list) return;

  const rows = [...list.querySelectorAll(".proj-row")];

  // The gallery: two columns inside one box
  const gallery = document.createElement("div");
  gallery.className = "rev-gallery";

  const colUp = document.createElement("div");
  colUp.className = "rev-col rev-col--up";
  const colDown = document.createElement("div");
  colDown.className = "rev-col rev-col--down";
  gallery.append(colUp, colDown);

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
    }
    img.loading = "lazy";
    img.decoding = "async";

    const caption = document.createElement("span");
    caption.className = "rev-card__title";
    const title = row.querySelector(".proj-row__title");
    caption.textContent = title ? title.textContent : "";

    link.append(img, caption);

    // Row 1, 3, 5… go left; row 2, 4, 6… go right (reading order stays zig-zag)
    (n % 2 === 0 ? colUp : colDown).append(link);
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
