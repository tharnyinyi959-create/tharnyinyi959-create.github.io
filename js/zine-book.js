/* =====================================================================
   A Bite of Myanmar — the ZINE as a book you can turn (work-zine.html)

   js/zine-book.js takes the page gallery that is already in the HTML and builds a book from its images.
   Without JavaScript the gallery simply stays as it is.

   Two-page spreads on every screen: each "leaf" of paper has a page on both sides and turns on the spine.
   The closed book sits in the middle; as the cover opens the book moves right, so the whole spread shows.

   On wide screens the book opens by itself the first time it scrolls into view. After that a page turns every 1.5 s
   until the last page, unless the pointer is on the book, the book is off screen or the visitor is on a touch screen.
   On narrow screens nothing turns by itself: the cover waits for the Next button or a swipe,
   and tapping a page shows it large, because the text is small in a two-page spread.
   ===================================================================== */
(() => {
  const root = document.querySelector("[data-zine-book]");
  if (!root) return;
  const gallery = root.querySelector(".concept-gallery");
  const items = [...gallery.querySelectorAll(".concept-item")];
  if (items.length !== 12) return;

  const AUTO_DELAY = 1500;   // ms the visitor gets to look at a page before the next automatic turn
  const TURN_MS = 1050;
  const OPEN_DELAY = 500;    // ms between the closed book arriving and its cover opening
  const LEAVES = items.length / 2;

  const pages = items.map((item) => ({ img: item.querySelector("img"), cap: item.querySelector(".concept-cap").textContent }));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)");
  const narrow = matchMedia("(max-width: 760px)");
  const t = (s) => (window.I18N ? window.I18N.t(s) : s);          // English when EN is on (js/i18n.js)
  const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

  /* ------------------------------------------------------------- state */
  let at = 0;              // how many leaves have been turned (0–6)
  let busy = false;        // a turn is running: other turns wait for it to finish
  let entered = false;     // the book has opened once
  let hovering = false;
  let inView = false;
  let timer = 0;
  const atEnd = () => at === LEAVES;

  /* ------------------------------------------------------------- the elements around the book */
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html) node.innerHTML = html;
    return node;
  };
  const arrow = (points, line) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="${line[0]}" y1="12" x2="${line[1]}" y2="12"></line><polyline points="${points}"></polyline></svg>`;

  const stage = el("div", "zb-stage");
  const prevBtn = el("button", "zb-nav zb-nav--prev", arrow("12 19 5 12 12 5", [19, 5]));
  const nextBtn = el("button", "zb-nav zb-nav--next", arrow("12 5 19 12 12 19", [5, 19]));
  prevBtn.type = nextBtn.type = "button";
  prevBtn.setAttribute("aria-label", t("前のページへ"));
  nextBtn.setAttribute("aria-label", t("次のページへ"));
  const scene = el("div", "zb-scene");
  const floor = el("div", "zb-floor");
  const foot = el("div", "zb-foot");
  const status = el("p", "zb-status");
  status.setAttribute("aria-live", "polite");
  const bar = el("div", "zb-progress", "<i></i>");
  bar.setAttribute("aria-hidden", "true");
  const end = el("div", "zb-end");
  const thanks = el("p", "zb-end__text");
  // <wbr> marks where the Japanese may break, so a line never ends inside a word (word-break in the CSS). English has none of these.
  thanks.innerHTML = t("「ミャンマーの一口」をご覧いただき、ありがとうございました。").replace(/(」を|、|ありがとう)/g, "$1<wbr>");
  const restartBtn = el("button", "zb-restart");
  restartBtn.type = "button";
  restartBtn.textContent = t("最初から読む");
  end.append(thanks, restartBtn);
  const hint = el("p", "zb-hint");                                // shown on touch phones only, while the cover is showing (CSS)
  hint.textContent = t("スワイプでめくる・タップで拡大");
  foot.append(status, bar, hint);
  stage.append(prevBtn, scene, nextBtn);

  /* ------------------------------------------------------------- the book itself */
  let book, leaves, castL, castR;

  const face = (page, side) => {
    const node = el("div", `zb-face zb-face--${side}`);
    node.append(page.img, el("span", "zb-shade"));
    page.face = node;
    return node;
  };
  // the place of a leaf in the stack: turned leaves lie on the left, the last one turned on top
  const leafTransform = (i, turned, lift = "") => (turned
    ? `translateZ(${((i - LEAVES) * 0.6).toFixed(1)}px) rotateY(-180deg) skewY(0deg)${lift}`
    : `translateZ(${(-i * 0.6).toFixed(1)}px) rotateY(0deg) skewY(0deg)${lift}`);
  const placeLeaf = (leaf, i, turned) => {
    leaf.style.transform = leafTransform(i, turned);
    leaf.style.zIndex = turned ? i + 1 : LEAVES - i;
  };

  const build = () => {
    if (book) book.remove();
    book = el("div", "zb-book");
    book.append(el("span", "zb-edge zb-edge--l"), el("span", "zb-edge zb-edge--r"));
    leaves = [];
    for (let i = 0; i < LEAVES; i++) {
      const leaf = el("div", "zb-leaf" + (i === 0 || i === LEAVES - 1 ? " zb-leaf--cover" : ""));
      leaf.append(face(pages[i * 2], "front"), face(pages[i * 2 + 1], "back"));
      placeLeaf(leaf, i, i < at);
      leaves.push(leaf);
      book.append(leaf);
    }
    castL = el("span", "zb-cast zb-cast--l");
    castR = el("span", "zb-cast zb-cast--r");
    book.append(castL, castR);
    scene.append(book);
    refresh();
  };

  /* ------------------------------------------------------------- everything that follows from `at` */
  const label = () => {
    if (at === 0) return { pageText: "1", caps: [pages[0].cap] };
    if (at === LEAVES) return { pageText: String(pages.length), caps: [pages[pages.length - 1].cap] };
    return { pageText: `${at * 2}–${at * 2 + 1}`, caps: [pages[at * 2 - 1].cap, pages[at * 2].cap] };
  };
  const showing = (i) => {
    return at === 0 ? i === 0 : at === LEAVES ? i === pages.length - 1 : i === at * 2 - 1 || i === at * 2;
  };
  const refresh = () => {
    const { pageText, caps } = label();
    status.innerHTML = `<b>${pageText} / ${pages.length}</b><span>${caps.join(" · ")}</span>`;
    bar.firstChild.style.transform = `scaleX(${(at / LEAVES).toFixed(3)})`;
    prevBtn.disabled = at === 0;
    nextBtn.disabled = atEnd();
    root.classList.toggle("is-final", atEnd());
    root.classList.toggle("is-first", at === 0);
    pages.forEach((page, i) => {
      page.face.setAttribute("aria-hidden", String(!showing(i)));        // the visible pages are what a screen reader reads
    });
    book.style.setProperty("--left", `${(at * 1.1).toFixed(1)}px`);
    book.style.setProperty("--right", `${((LEAVES - at) * 1.1).toFixed(1)}px`);
    const place = at === 0 ? "closed" : at === LEAVES ? "back" : "open";
    book.dataset.place = place;
    scene.dataset.place = place;
  };

  /* ------------------------------------------------------------- turning */
  const shadeKeyframes = [{ opacity: 0 }, { opacity: 0.42, offset: 0.5 }, { opacity: 0 }];

  const turnLeaf = async (dir, ms, delay = 0) => {
    const i = dir > 0 ? at : at - 1;
    const leaf = leaves[i];
    const from = leafTransform(i, dir < 0), to = leafTransform(i, dir > 0);
    const mid = `translateZ(36px) rotateY(-90deg) skewY(${dir > 0 ? -1.4 : 1.4}deg)`;
    leaf.style.zIndex = 50;
    const options = { duration: ms, delay, easing: "cubic-bezier(.45,.05,.3,1)", fill: "both" };
    const motion = leaf.animate([{ transform: from }, { transform: mid, offset: 0.5 }, { transform: to }], options);
    leaf.querySelectorAll(".zb-shade").forEach((shade) => shade.animate(shadeKeyframes, options));
    // the shadow only falls where there is paper to fall on
    const low = Math.min(at, at + dir), high = Math.max(at, at + dir);
    if (low > 0) castL.animate(shadeKeyframes, options);
    if (high < LEAVES) castR.animate(shadeKeyframes, options);
    at += dir;
    refresh();
    await motion.finished;
    placeLeaf(leaf, i, dir > 0);
    motion.cancel();
  };

  const turn = async (dir) => {
    if (busy || (dir > 0 && atEnd()) || (dir < 0 && at === 0)) return;
    busy = true;
    clearTimeout(timer);
    root.classList.add("is-turning");
    await turnLeaf(dir, reduced ? 1 : TURN_MS);
    root.classList.remove("is-turning");
    busy = false;
    schedule();
  };

  /* ------------------------------------------------------------- the 1.5-second timer: only ever one, and only when nobody is reading */
  const mayAutoTurn = () => entered && !narrow.matches && !busy && !reduced && !touch.matches && !hovering && inView && !atEnd() && !document.hidden;
  const schedule = () => {
    clearTimeout(timer);
    if (mayAutoTurn()) timer = setTimeout(() => { if (mayAutoTurn()) turn(1); }, AUTO_DELAY);
  };

  /* ------------------------------------------------------------- opening, restarting */
  const ready = (count) => Promise.race([
    Promise.all(pages.slice(0, count).map((page) => (page.img.decode ? page.img.decode().catch(() => {}) : null))),
    sleep(1500),
  ]);
  const open = async () => {
    await ready(3);
    root.classList.add("is-in");
    if (reduced || narrow.matches) { entered = true; return; }
    await sleep(OPEN_DELAY + 500);
    entered = true;
    await turn(1);
  };
  const restart = async () => {
    if (busy) return;
    busy = true;
    clearTimeout(timer);
    root.classList.add("is-turning");
    if (reduced) {
      at = 0;
      build();
    } else {
      const running = [];
      let delay = 0;
      while (at > 0) { running.push(turnLeaf(-1, 620, delay)); delay += 80; }
      await Promise.all(running);
      await sleep(OPEN_DELAY);
    }
    root.classList.remove("is-turning");
    busy = false;
    if (reduced || narrow.matches) { schedule(); return; }
    await turn(1);
  };

  /* ------------------------------------------------------------- listeners */
  prevBtn.addEventListener("click", () => turn(-1));
  nextBtn.addEventListener("click", () => turn(1));
  restartBtn.addEventListener("click", restart);

  scene.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "touch") return;
    hovering = true;
    clearTimeout(timer);
  });
  scene.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "touch") return;
    hovering = false;
    schedule();
  });

  // the left and right keys work while the book fills most of the screen, and never while typing
  let readable = false;
  addEventListener("keydown", (e) => {
    if (!readable || !entered || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
  });

  // swipe sideways to turn; scrolling up and down and zooming with two fingers stay with the page (touch-action in the CSS)
  let startX = 0, startY = 0, zooming = false;
  scene.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) { startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY; }
    zooming = e.touches.length > 1 || (window.visualViewport && visualViewport.scale > 1.01);
  }, { passive: true });
  scene.addEventListener("touchend", (e) => {
    if (zooming) return;
    const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
  }, { passive: true });

  // narrow screens: tap a page to see it large (<dialog> brings Esc and focus handling with it)
  const viewer = el("dialog", "zb-viewer", '<button class="zb-viewer__close" type="button"></button><img alt="">');
  const viewerImg = viewer.querySelector("img");
  viewer.firstChild.textContent = t("閉じる");
  viewer.firstChild.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });     // the dark area around the page
  root.append(viewer);
  scene.addEventListener("click", (e) => {
    if (!narrow.matches || busy || zooming) return;
    const face = e.target.closest(".zb-face");
    const page = face && pages.find((p) => p.face === face);
    if (!page) return;
    viewerImg.src = page.img.currentSrc || page.img.src;
    viewerImg.alt = page.img.alt;
    viewer.showModal();
    viewer.scrollTop = 0;
  });

  document.addEventListener("visibilitychange", schedule);
  touch.addEventListener("change", schedule);
  const placeEnd = () => (narrow.matches ? root : stage).append(end);    // the ending: under the page number, or beside the closed book
  narrow.addEventListener("change", () => { placeEnd(); schedule(); });

  /* ------------------------------------------------------------- start */
  root.append(stage, foot);
  placeEnd();
  gallery.hidden = true;
  root.classList.add("is-ready");
  build();

  // the pictures load as the book comes near, all together, so no page is blank when it turns
  const near = new IntersectionObserver((entries) => {
    if (!entries[entries.length - 1].isIntersecting) return;
    pages.forEach((page) => { page.img.loading = "eager"; });
    near.disconnect();
  }, { rootMargin: "800px 0px" });
  near.observe(stage);

  new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    readable = entry.intersectionRatio >= 0.5;
    inView = entry.intersectionRatio >= 0.25;
    if (inView && !root.classList.contains("is-started")) {
      root.classList.add("is-started");
      open();
    } else {
      inView ? schedule() : clearTimeout(timer);
    }
  }, { threshold: [0, 0.25, 0.5, 0.75] }).observe(stage);
})();
