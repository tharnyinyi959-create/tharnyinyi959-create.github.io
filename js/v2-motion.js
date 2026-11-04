/* =====================================================================
   V2 MOTION LAYER — behaviour for css/v2-motion.css. Loaded after js/motion.js on every page.
   Adds motion only; no markup, colour, type or layout of the portfolio is changed.
   No libraries. One scroll loop (rAF, only when scrolling) drives every scroll-linked effect.

   1 helpers + one scroll loop        6 scroll-lit paragraph (home about text)
   2 header hides on scroll down      7 parallax · horizontal drift
   3 hero scroll (home)               8 pointer pull on cards
   4 eased anchor scrolling           9 reveal variants (inner blocks, footer)
   5 page titles rise out of a mask
  10 stacking layers (sections slide over each other)
   Skipped entirely with prefers-reduced-motion.
   ===================================================================== */
(() => {
  "use strict";
  const root = document.documentElement;
  if (!root.classList.contains("js-motion")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.classList.add("v2m");

  /* ------------------------------------------------------------------ 1 · helpers + one scroll loop */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const frames = [];
  let queued = false;
  const tick = () => { queued = false; const y = scrollY, vh = innerHeight; frames.forEach((fn) => fn(y, vh)); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  const progress = (el, vh) => { const r = el.getBoundingClientRect(); return clamp((vh - r.top) / (vh + r.height)); };   // 0 when it enters, 1 when it has left
  // wait for the loading screen to hand over (motion.js sets html.is-ready)
  const whenReady = (fn) => {
    if (root.classList.contains("is-ready")) { fn(); return; }
    const mo = new MutationObserver(() => { if (root.classList.contains("is-ready")) { mo.disconnect(); fn(); } });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    setTimeout(() => { mo.disconnect(); fn(); }, 30000);
  };

  /* ------------------------------------------------------------------ 2 · header hides while you read down, returns when you scroll up */
  const header = $(".site-header");
  if (header) {
    let last = scrollY;
    frames.push((y) => {
      const dy = y - last;
      if (Math.abs(dy) < 6) return;
      const navOpen = $(".nav-links.open");
      header.classList.toggle("v2-hide", dy > 0 && y > 260 && !navOpen && !header.matches(":focus-within"));
      last = y;
    });
  }

  /* ------------------------------------------------------------------ 3 · hero scroll (home): content drifts and fades, code window drifts the other way */
  let hero = null;                           // .ch (the coding hero) is inserted by hero/coding-hero.js after this file runs, so it is looked up lazily
  frames.push((y) => {
    if (!hero) { hero = $(".ch") || (document.readyState === "complete" ? $(".hero") : null); if (!hero) return; }
    hero.style.setProperty("--hp", clamp(y / (hero.offsetHeight * 0.95 || 600)).toFixed(3));
  });
  addEventListener("load", queue);

  // where an element would sit if no layer were stuck (stuck layers report their stuck position)
  let layers = [];
  const naturalTop = (el) => {
    const layer = el.closest(".v2-layer");
    if (!layer || !root.classList.contains("v2-stacked")) return el.getBoundingClientRect().top + scrollY;
    return layer.previousElementSibling.getBoundingClientRect().top + (layer._gap || 0) + scrollY + (el.getBoundingClientRect().top - layer.getBoundingClientRect().top);
  };

  /* ------------------------------------------------------------------ 4 · eased anchor scrolling */
  let scrollRaf = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const scrollToY = (y) => {
    cancelAnimationFrame(scrollRaf);
    const y0 = scrollY, dist = y - y0, dur = clamp(Math.abs(dist) * 0.45, 700, 1600);
    let t0 = 0;
    const stop = () => cancelAnimationFrame(scrollRaf);
    ["wheel", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, stop, { once: true, passive: true }));
    const step = (t) => {
      if (!t0) t0 = t;
      const p = clamp((t - t0) / dur);
      scrollTo(0, y0 + dist * ease(p));
      if (p < 1) scrollRaf = requestAnimationFrame(step);
    };
    scrollRaf = requestAnimationFrame(step);
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.getAttribute("href") === "#") return;
    const t = $(decodeURIComponent(a.getAttribute("href")));
    if (!t) return;
    e.preventDefault();
    scrollToY(naturalTop(t) - (header ? header.offsetHeight : 0) + 8);
    history.replaceState(null, "", a.getAttribute("href"));
  });

  /* ------------------------------------------------------------------ 5 · page titles rise out of a mask (same mask the section headings use) */
  $$("main .detail-title, main .profile-name, main h1.h1").forEach((h) => {
    if (h.closest(".hero") || h.querySelector(".mo-mask") || h.querySelector("[data-typing]")) return;
    h.innerHTML = '<span class="mo-mask"><span class="mo-mask__in">' + h.innerHTML + "</span></span>";
    const m = $(".mo-mask", h);
    whenReady(() => {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { m.classList.add("mo-in"); io.disconnect(); } }), { threshold: 0.2 });
      io.observe(m);
    });
  });

  /* ------------------------------------------------------------------ 6 · scroll-lit paragraph: the home "about" text lights up as you read down */
  const about = $(".about-preview .lead");
  if (about) {
    const text = about.textContent.trim();
    about.textContent = "";
    const sr = document.createElement("span"); sr.className = "v2-sr"; sr.textContent = text; about.appendChild(sr);   // what screen readers read (the letters below are aria-hidden)
    const chars = [...text].map((c) => { const s = document.createElement("span"); s.className = "v2-ch"; s.setAttribute("aria-hidden", "true"); s.textContent = c; about.appendChild(s); return s; });
    let lit = 0;
    frames.push((y, vh) => {
      const r = about.getBoundingClientRect();
      const p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.22));
      const k = Math.round(p * chars.length);
      if (k === lit) return;
      if (k > lit) for (let i = lit; i < k; i++) chars[i].classList.add("on");
      else for (let i = k; i < lit; i++) chars[i].classList.remove("on");
      lit = k;
    });
  }

  /* ------------------------------------------------------------------ 7 · parallax + horizontal drift */
  const par = [["avatar-frame", 22], ["profile-photo", 22], ["browser-frame", 16], ["pm-browser", 0]];
  const parEls = [];
  par.forEach(([cls, amt]) => { if (amt) $$("." + cls).forEach((el) => { if (el.closest(".proj-stage, .dk")) return; el.classList.add("v2-par"); parEls.push([el, amt]); }); });
  const driftEls = $$(".contact-cta .h2, .related-title, .jr-title").map((el) => { el.classList.add("v2-drift"); return el; });
  if (parEls.length || driftEls.length) {
    frames.push((y, vh) => {
      parEls.forEach(([el, amt]) => el.style.setProperty("--par", ((0.5 - progress(el, vh)) * amt * 2).toFixed(1)));
      driftEls.forEach((el) => el.style.setProperty("--dx", ((1 - clamp(progress(el, vh) * 1.8)) * -4).toFixed(2)));
    });
  }

  /* ------------------------------------------------------------------ 8 · cards lean a few pixels toward the pointer */
  if (fine) {
    $$(".skill-card, .related-card, .contact-info-card, .process-step").forEach((el) => {
      el.classList.add("v2-pull");
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const loop = () => {
        cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
        el.style.setProperty("--px", cx.toFixed(3)); el.style.setProperty("--py", cy.toFixed(3));
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.004 ? requestAnimationFrame(loop) : 0;
      };
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5); ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    });
  }

  /* ------------------------------------------------------------------ 9 · reveal variants for things the base reveals don't stagger */
  const settle = (el) => setTimeout(() => { el.classList.remove("v2r", "v2-in"); el.removeAttribute("data-v2"); el.style.removeProperty("--i"); }, 2200);
  const prep = (el, variant, i) => { el.classList.add("v2r"); el.setAttribute("data-v2", variant); el.style.setProperty("--i", i); };
  const groups = [];            // [parent, children]
  const group = (parentSel, childSel, variant) => $$(parentSel).forEach((p) => {
    if (p.closest(".hero, .dk, .proj-stage")) return;
    const kids = childSel ? $$(childSel, p) : [...p.children];
    kids.forEach((k, i) => prep(k, variant, i));
    groups.push([p, kids]);
  });
  group(".process-steps", ".process-step", "slide");
  group(".swatch-row", ".swatch", "scale");
  group(".detail-info-list", ".detail-info-row", "up");
  group(".footer-top", null, "up");
  group(".contact-info-card", ".contact-info-item", "up");
  const blurs = $$("main .d-body > p, main .lead").filter((p) => !p.closest(".hero, .dk, .about-preview, .contact-cta"));
  blurs.forEach((p) => prep(p, "blur", 0));
  whenReady(() => {
    if (!("IntersectionObserver" in window)) { [...groups.flatMap((g) => g[1]), ...blurs].forEach((el) => { el.classList.remove("v2r"); el.removeAttribute("data-v2"); }); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const g = groups.find((x) => x[0] === en.target);
      (g ? g[1] : [en.target]).forEach((el) => { el.classList.add("v2-in"); settle(el); });
    }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    groups.forEach((g) => io.observe(g[0]));
    blurs.forEach((p) => io.observe(p));
  });

  /* ------------------------------------------------------------------ 10 · stacking layers: each section stays put while the next one slides over it
     The covered section recedes (scale + a veil, css/v2-motion.css §8). The footer is not a layer: <main> is the
     containing block of the sticky layers, so they all let go where <main> ends and the footer scrolls in normally. */
  (() => {
    const main = $("main");
    if (!main) return;
    if ($(".detail-hero")) return;                                    // case studies are for reading: no sections sliding over each other
    const items = [...main.children].filter((el) => !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName));
    if (items.length < 2) return;
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    // Group very short sections (a filter bar, a prev/next row…) with the section before them: on their own they would
    // stick to the top of the screen and cover the heading above.
    const shortH = innerHeight * 0.3;
    const groups = [];
    items.forEach((el) => {
      const g = groups[groups.length - 1];
      if (g && el.offsetHeight < shortH) g.push(el); else groups.push([el]);
    });
    if (groups.length < 2) return;
    groups.forEach((els, i) => {
      const first = els[0];
      const bg = getComputedStyle(first).backgroundColor;
      const wrap = document.createElement("div");
      wrap.className = "v2-layer" + (i === groups.length - 1 ? " v2-last" : "");
      wrap.style.setProperty("--z", i + 1);
      wrap.style.setProperty("--lbg", /rgba\(.*,\s*0\)$|transparent/.test(bg) ? bodyBg : bg);
      const mark = document.createElement("div"); mark.className = "v2-mark"; mark.setAttribute("aria-hidden", "true");
      first.parentNode.insertBefore(mark, first);
      first.parentNode.insertBefore(wrap, first);
      els.forEach((el) => wrap.appendChild(el));
      layers.push(wrap);
    });
    const n = layers.length, last = layers[n - 1];
    const mq = matchMedia("(min-width: 861px)");
    let on = false, endGap = 0;
    // Layout is read here (on resize / load / size change), never in the scroll loop.
    const measure = () => {
      const vh = innerHeight;
      layers.forEach((l) => l.classList.add("v2-measure"));
      // natural offset between a layer and its marker (margins that collapse through the layer sit in between)
      layers.forEach((l) => { l._gap = l.getBoundingClientRect().top - l.previousElementSibling.getBoundingClientRect().top; });
      // where the sticking ends: the bottom of <main>'s content box, measured from the last layer's natural top
      const ms = getComputedStyle(main);
      endGap = main.getBoundingClientRect().bottom - parseFloat(ms.paddingBottom) - parseFloat(ms.borderBottomWidth) - last.getBoundingClientRect().top;
      layers.forEach((l) => l.classList.remove("v2-measure"));
      layers.forEach((l, i) => {
        const h = l.offsetHeight;
        l._h = h;
        l._stuck = l === last ? -Infinity : Math.min(0, vh - h);      // the last layer does not stick
        // how far the next layer can slide over this one. Normally a full screen (or the whole layer if it is shorter);
        // under the last section it is cut short where the sticking ends, so the receding still completes.
        l._span = Math.max(1, Math.min(h, vh, i === n - 2 ? endGap : Infinity));
        l.style.setProperty("--top", Math.min(0, vh - h) + "px");
        l.style.setProperty("--oy", (h > vh ? h - vh / 2 : h / 2) + "px");
      });
    };
    const clear = () => layers.forEach((l) => {
      l._c = l._k = undefined;
      l.classList.remove("v2-moving");
      ["--c", "border-radius", "box-shadow", "overflow"].forEach((p) => l.style.removeProperty(p));
    });
    const sync = () => {
      on = mq.matches;
      root.classList.toggle("v2-stacked", on);
      if (on) measure(); else clear();
      queue();
    };
    mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);
    if ("ResizeObserver" in window) { const ro = new ResizeObserver(() => { if (on) { measure(); queue(); } }); layers.forEach((l) => ro.observe(l)); }
    addEventListener("resize", () => { if (on) measure(); });
    addEventListener("load", () => { if (on) { measure(); queue(); } });
    const tops = new Array(n), cs = new Array(n);
    frames.push(() => {
      if (!on) return;
      // 1 · read: one rect per layer (its zero-height marker; the layer's own rect is distorted by its scale)
      // (where it would stick if <main> went on: once the sticking ends at the bottom of <main>, a covered layer
      // stays receded instead of winding back while everything scrolls away together)
      for (let i = 0; i < n; i++) tops[i] = Math.max(layers[i].previousElementSibling.getBoundingClientRect().top + (layers[i]._gap || 0), layers[i]._stuck);
      // progress of layer i = how much of it the next layer covers, 0 → 1 (the first pixel is ignored: sub-pixel
      // rounding between neighbours must not count as "being covered")
      for (let i = 0; i < n - 1; i++) cs[i] = clamp((tops[i] + layers[i]._h - tops[i + 1] - 1) / layers[i]._span);
      // 2 · write (only what changed)
      for (let i = 0; i < n - 1; i++) {
        const a = layers[i], b = layers[i + 1], c = Math.round(cs[i] * 1000) / 1000;
        if (c !== a._c) { a._c = c; a.style.setProperty("--c", c.toFixed(3)); a.classList.toggle("v2-moving", c > 0 && c < 1); }
        // the covering layer gets rounded top corners and a shadow only while it is sliding in
        const k = Math.round(Math.min(1, c * 14) * Math.min(1, (1 - c) * 14) * 100) / 100;
        if (k === b._k) continue;
        b._k = k;
        if (k > 0) { b.style.borderRadius = (22 * k).toFixed(1) + "px " + (22 * k).toFixed(1) + "px 0 0"; b.style.overflow = "clip"; b.style.boxShadow = "0 -18px 44px rgba(17,17,17," + (0.22 * k).toFixed(3) + ")"; }
        else { b.style.borderRadius = ""; b.style.overflow = ""; b.style.boxShadow = ""; }
      }
    });
    sync();
  })();

  queue();
})();
