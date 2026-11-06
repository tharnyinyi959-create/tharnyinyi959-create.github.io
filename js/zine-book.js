/* =====================================================================
   A Bite of Myanmar — the ZINE as a book you can turn (work-zine.html)

   js/zine-book.js takes the page gallery that is already in the HTML and builds a book from its images.
   Without JavaScript the gallery simply stays as it is.

     wide screens    two-page spreads: each "leaf" of paper has a page on both sides and turns on the spine
     narrow screens  one page at a time: the page slides away to the left, and Previous brings it back from there

   On wide screens the book opens by itself the first time it scrolls into view. After that a page turns every 1.5 s
   until the last page, unless the pointer is on the book, the book is off screen or the visitor is on a touch screen.
   On narrow screens nothing turns by itself: the cover waits for the Next button or a swipe.
   ===================================================================== */
(() => {
  const root = document.querySelector("[data-zine-book]");
  if (!root) return;
  const gallery = root.querySelector(".concept-gallery");
  const items = [...gallery.querySelectorAll(".concept-item")];
  if (items.length !== 12) return;

  const AUTO_DELAY = 1500;   // ms the visitor gets to look at a page before the next automatic turn
  const TURN_MS = 1050;
  const SLIDE_MS = 700;      // one page sliding away on a narrow screen
  const OPEN_DELAY = 500;    // ms between the closed book arriving and its cover opening
  const LEAVES = items.length / 2;

  const pages = items.map((item) => ({ img: item.querySelector("img"), cap: item.querySelector(".concept-cap").textContent }));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)");
  const narrow = matchMedia("(max-width: 760px)");
  const t = (s) => (window.I18N ? window.I18N.t(s) : s);          // English when EN is on (js/i18n.js)
  const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

  /* ------------------------------------------------------------- state */
  let mode = narrow.matches ? "single" : "spread";
  let at = 0;              // spread mode: how many leaves have been turned (0–6). single mode: which page is showing (0–11)
  let busy = false;        // a turn is running: other turns wait for it to finish
  let entered = false;     // the book has opened once
  let hovering = false;
  let inView = false;
  let timer = 0;
  const last = () => (mode === "spread" ? LEAVES : pages.length - 1);
  const atEnd = () => at === last();

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
  thanks.textContent = t("「ミャンマーの一口」をご覧いただき、ありがとうございました。");
  const restartBtn = el("button", "zb-restart");
  restartBtn.type = "button";
  restartBtn.textContent = t("最初から読む");
  end.append(thanks, restartBtn);
  const hint = el("p", "zb-hint");                                // shown on touch phones only, while the cover is showing (CSS)
  hint.textContent = t("スワイプでめくる");
  foot.append(status, bar, hint);
  stage.append(prevBtn, scene, nextBtn);

  /* ------------------------------------------------------------- the book itself */
  let book, leaves, sheets, castL, castR;

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
    book = el("div", `zb-book zb-book--${mode}`);
    if (mode === "spread") {
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
    } else {
      sheets = pages.map((page, i) => {
        const sheet = el("div", "zb-sheet");
        sheet.append(face(page, "front"));
        sheet.style.zIndex = pages.length - i;
        book.append(sheet);
        return sheet;
      });
    }
    scene.append(book);
    (mode === "spread" ? stage : root).append(end);                     // the ending: beside the closed book, or under the page number
    refresh();
  };

  /* ------------------------------------------------------------- everything that follows from `at` */
  const label = () => {
    if (mode === "single") return { pageText: String(at + 1), caps: [pages[at].cap] };
    if (at === 0) return { pageText: "1", caps: [pages[0].cap] };
    if (at === LEAVES) return { pageText: String(pages.length), caps: [pages[pages.length - 1].cap] };
    return { pageText: `${at * 2}–${at * 2 + 1}`, caps: [pages[at * 2 - 1].cap, pages[at * 2].cap] };
  };
  const showing = (i) => {
    if (mode === "single") return i === at;
    return at === 0 ? i === 0 : at === LEAVES ? i === pages.length - 1 : i === at * 2 - 1 || i === at * 2;
  };
  const refresh = () => {
    const { pageText, caps } = label();
    status.innerHTML = `<b>${pageText} / ${pages.length}</b><span>${caps.join(" · ")}</span>`;
    bar.firstChild.style.transform = `scaleX(${(at / last()).toFixed(3)})`;
    prevBtn.disabled = at === 0;
    nextBtn.disabled = atEnd();
    root.classList.toggle("is-final", atEnd());
    root.classList.toggle("is-first", at === 0);
    pages.forEach((page, i) => {
      page.face.setAttribute("aria-hidden", String(!showing(i)));        // the visible pages are what a screen reader reads
    });
    if (mode === "spread") {
      book.style.setProperty("--left", `${(at * 1.1).toFixed(1)}px`);
      book.style.setProperty("--right", `${((LEAVES - at) * 1.1).toFixed(1)}px`);
      const place = at === 0 ? "closed" : at === LEAVES ? "back" : "open";
      book.dataset.place = place;
      scene.dataset.place = place;
    } else {
      scene.dataset.place = "single";
      sheets.forEach((sheet, i) => { sheet.style.visibility = i === at || i === at + 1 ? "visible" : "hidden"; });
    }
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

  const turnSheet = async (dir, ms) => {
    const sheet = sheets[dir > 0 ? at : at - 1];
    at += dir;
    refresh();                                                          // the page number changes as the turn starts
    sheet.style.zIndex = 50;
    sheet.style.visibility = "visible";                                 // refresh() hides a page once it is no longer the current one
    // the page stays face-on with a slight tilt and leaves the screen, so it never goes edge-on and vanishes
    const keyframes = [
      { transform: "perspective(1400px) translateX(0) rotateY(0deg) rotateZ(0deg)" },
      { transform: "perspective(1400px) translateX(-48%) rotateY(-16deg) rotateZ(-2deg)", offset: 0.5 },
      { transform: "perspective(1400px) translateX(-120vw) rotateY(-24deg) rotateZ(-4deg)" },
    ];
    const motion = sheet.animate(keyframes, { duration: ms, easing: "cubic-bezier(.45,.05,.3,1)", fill: "both", direction: dir > 0 ? "normal" : "reverse" });
    sheet.querySelector(".zb-shade").animate(shadeKeyframes, { duration: ms, fill: "both" });
    await motion.finished;
    motion.cancel();
    sheet.style.zIndex = pages.length - sheets.indexOf(sheet);
    refresh();
  };

  const turn = async (dir) => {
    if (busy || (dir > 0 && atEnd()) || (dir < 0 && at === 0)) return;
    busy = true;
    clearTimeout(timer);
    root.classList.add("is-turning");
    await (mode === "spread" ? turnLeaf(dir, reduced ? 1 : TURN_MS) : turnSheet(dir, reduced ? 1 : SLIDE_MS));
    root.classList.remove("is-turning");
    busy = false;
    schedule();
  };

  /* ------------------------------------------------------------- the 1.5-second timer: only ever one, and only when nobody is reading */
  const mayAutoTurn = () => entered && mode === "spread" && !busy && !reduced && !touch.matches && !hovering && inView && !atEnd() && !document.hidden;
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
    if (reduced || mode === "single") { entered = true; return; }
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
    } else if (mode === "spread") {
      const running = [];
      let delay = 0;
      while (at > 0) { running.push(turnLeaf(-1, 620, delay)); delay += 80; }
      await Promise.all(running);
      await sleep(OPEN_DELAY);
    } else {
      book.style.opacity = 0;
      await sleep(260);
      at = 0;
      build();
      book.style.opacity = "";
      await sleep(OPEN_DELAY);
    }
    root.classList.remove("is-turning");
    busy = false;
    if (reduced || mode === "single") { schedule(); return; }
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

  // swipe sideways to turn; scrolling up and down stays with the page (touch-action: pan-y in the CSS)
  let startX = 0, startY = 0;
  scene.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY; }, { passive: true });
  scene.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("visibilitychange", schedule);
  touch.addEventListener("change", schedule);
  narrow.addEventListener("change", async () => {
    while (busy) await sleep(60);                                       // let a running turn finish before changing layout
    const nextMode = narrow.matches ? "single" : "spread";
    at = nextMode === "single"
      ? (at === 0 ? 0 : Math.min(at * 2 - 1, pages.length - 1))
      : (at + 1) >> 1;
    mode = nextMode;
    build();
    schedule();
  });

  /* ------------------------------------------------------------- start */
  root.append(stage, foot);
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
