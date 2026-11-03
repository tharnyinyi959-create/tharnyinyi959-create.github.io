/* =====================================================================
   MOTION SYSTEM — behaviour for css/motion.css. Loaded after main.js on every page.
   No libraries. Every block is independent and exits early when its markup is absent.

   1 helpers · ready gate          6 skills (bars + counters)
   2 headings, groups, rules       7 magnetic buttons
   3 reveal observer               8 cursor
   4 aquarium auto-scroll measure  9 the deck (flick-through cards)
   5 about / profile
   Reduced motion: nothing moves; content is simply shown.
   ===================================================================== */
(() => {
  "use strict";

  /* ------------------------------------------------------------------ 1 · helpers · ready gate */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // "ready" = the loading screen has handed over (circle opening) — see loading/*.js class names
  const GATES = ["lvi-pending", "lvi-active", "lvp-pending", "lvp-hold"];
  const blocked = () => GATES.some((c) => root.classList.contains(c));
  let isReady = false;
  const ready = () => { if (isReady) return; isReady = true; root.classList.add("is-ready"); };
  if (!blocked()) requestAnimationFrame(ready);
  else {
    const mo = new MutationObserver(() => { if (!blocked()) { mo.disconnect(); ready(); } });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    setTimeout(ready, 30000);                                       // never stay hidden
  }

  /* ------------------------------------------------------------------ 2 · headings, groups, rules */
  const io = "IntersectionObserver" in window && !reduced
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("mo-in"); io.unobserve(en.target); } });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" })
    : null;
  const watch = (el) => { if (io) io.observe(el); else el.classList.add("mo-in"); };

  // section headings (not the hero, not the reel's own title): wrap the content so it can rise out of a mask
  $$("main .h2").forEach((h) => {
    if (h.closest(".ch, .feat, .hero") || h.querySelector(".mo-mask")) return;
    h.innerHTML = '<span class="mo-mask"><span class="mo-mask__in">' + h.innerHTML + "</span></span>";
    watch($(".mo-mask", h));
  });
  $$(".feat__title").forEach((h) => { if (!h.querySelector(".mo-mask")) { h.innerHTML = '<span class="mo-mask"><span class="mo-mask__in">' + h.innerHTML + "</span></span>"; watch($(".mo-mask", h)); } });

  // eyebrows pop their dot in with the block they introduce
  $$(".eyebrow").forEach(watch);

  // staggered groups
  $$(".tag-row, .skills-preview-row, .footer-links, .cta-row, .hero-stats").forEach((g) => {
    if (g.closest(".ch, .feat, .proj-list")) return;
    g.classList.add("mo-stagger");
    [...g.children].forEach((c, i) => c.style.setProperty("--i", i));
    watch(g);
  });

  /* ------------------------------------------------------------------ 3 · rules (line expansion) */
  $$(".about-preview > div:last-child, .detail-hero .container > div:first-child").forEach((blk) => {
    if (blk.querySelector(".mo-rule")) return;
    const r = document.createElement("span");
    r.className = "mo-rule";
    r.setAttribute("aria-hidden", "true");
    blk.insertBefore(r, blk.firstChild);
    watch(r);
  });

  /* ------------------------------------------------------------------ 4 · aquarium "website" auto-scroll: measure the distance */
  $$(".pm-browser__view").forEach((view) => {
    const img = view.querySelector("img");
    if (!img) return;
    const measure = () => view.style.setProperty("--pm-shift", Math.min(0, view.clientHeight - img.offsetHeight) + "px");
    img.addEventListener("load", measure);
    if ("ResizeObserver" in window) { const ro = new ResizeObserver(measure); ro.observe(view); ro.observe(img); }
    measure();
  });

  /* ------------------------------------------------------------------ 5 · about / profile */
  // the frame is clipped away until revealed, and an element clipped to nothing is never "intersecting",
  // so the reveal is triggered by the frame's parent instead
  $$(".avatar-frame").forEach((f) => {
    f.classList.add("mo-clip");
    if (!io) { f.classList.add("mo-in"); return; }
    const pio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { f.classList.add("mo-in"); pio.disconnect(); } }), { threshold: 0.25 });
    pio.observe(f.parentElement);
  });

  // home: the student ID drops in once, when its panel comes into view (the profile page's drops on entry — CSS only, see motion.css 1b)
  $$(".idl--home").forEach(watch);

  /* ------------------------------------------------------------------ 5b · student ID — drag the card, the straps follow
     Geometry, in the rig's own pixels (origin = the rig's top-left; the rig itself never moves after the entrance):
       T  the top of each strap — fixed, the "neck" above the screen
       B  the bottom of each strap — two points on the buckle that move and turn with the card
     Each strap is a chain of short slices of the real strap artwork laid along a curve from T to B, so it leaves the
     neck straight and bends toward the card (and bows a little when the card is pushed up). The artwork keeps its
     scale: it is pinned to the buckle and repeats past the top, never stretched.
     Physics: while held, the card follows the pointer; on release it keeps a little of its speed and a damped spring
     (gravity) brings it back under the neck — a small swing, then still. The card leans along the strap.
     Dragging starts once the entrance has finished. Keyboard: focus the card, arrows move it (Shift = further). */
  $$(".idl").forEach((idl) => {
    const rig = $(".idl__rig", idl), hang = $(".idl__hang", idl), web = $(".idl__web", idl), card = $(".idl__card", idl);
    if (!rig || !hang || !web || !card) return;
    const host = idl.closest(".idl-host");
    const SEG = 18;                                         // slices per strap
    const K = 70, C = 6.5;                                  // spring back under the neck (ζ ≈ 0.4: one or two small swings)
    const KA = 140, CA = 15;                                // the card turning toward the strap
    const st = { x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0 };
    let sw, L, O, B0, T, raf = 0, last = 0, held = false, live = false, grab = null, lastP = null;
    const vel = { x: 0, y: 0 };

    const slices = [0, 1].map(() => Array.from({ length: SEG }, () => web.appendChild(document.createElement("i"))));

    const measure = () => {
      const cs = getComputedStyle(idl);
      sw = parseFloat(cs.getPropertyValue("--sw")) || 32;
      const tilt = (parseFloat(cs.getPropertyValue("--tilt")) || 7) * Math.PI / 180;
      L = sw * 10;                                           // the strap artwork is 1:10
      O = { x: rig.clientWidth / 2, y: sw * 0.3 };           // where the straps meet the buckle (= .idl__hang's transform-origin)
      const d = 2 + sw / 2;
      B0 = [{ x: O.x - d, y: O.y }, { x: O.x + d, y: O.y }];
      T = [{ x: B0[0].x - L * Math.sin(tilt), y: O.y - L * Math.cos(tilt) }, { x: B0[1].x + L * Math.sin(tilt), y: O.y - L * Math.cos(tilt) }];
      web.style.setProperty("--art", L + "px");
    };

    // one strap: a quadratic curve T → B, cut into SEG slices, artwork measured from the bottom
    const strap = (k, B) => {
      const t = T[k], el = slices[k];
      const dx = B.x - B0[k].x;
      let qx = (t.x + B.x) / 2 - dx * 0.5, qy = (t.y + B.y) / 2;       // pulled back toward the neck: straight at the top, bending toward the card
      const ch = Math.hypot(B.x - t.x, B.y - t.y);
      if (ch < L) {                                                     // slack: closer than the strap is long → it bows outward
        const sl = Math.sqrt(L * L - ch * ch) * 0.5, side = k ? 1 : -1;
        qx += side * sl * (B.y - t.y) / ch; qy -= side * sl * (B.x - t.x) / ch;
      }
      const P = [];
      for (let i = 0; i <= SEG; i++) { const u = i / SEG, v = 1 - u; P.push([v * v * t.x + 2 * v * u * qx + u * u * B.x, v * v * t.y + 2 * v * u * qy + u * u * B.y]); }
      let fromBottom = 0;
      for (let i = SEG - 1; i >= 0; i--) {
        const [x0, y0] = P[i], [x1, y1] = P[i + 1];
        const len = Math.hypot(x1 - x0, y1 - y0), h = len + 1.5;      // 1.5px overlap hides the joins
        fromBottom += len;
        const s = el[i].style;
        s.height = h.toFixed(2) + "px";
        s.backgroundPositionY = (fromBottom - L + 0.75).toFixed(2) + "px";
        s.transform = `translate(${((x0 + x1) / 2 - sw / 2).toFixed(2)}px,${((y0 + y1) / 2 - h / 2).toFixed(2)}px) rotate(${Math.atan2(x0 - x1, y1 - y0).toFixed(4)}rad)`;
      }
    };

    const apply = () => {
      hang.style.transform = st.x || st.y || st.a ? `translate(${st.x.toFixed(2)}px,${st.y.toFixed(2)}px) rotate(${st.a.toFixed(4)}rad)` : "";
      const c = Math.cos(st.a), s = Math.sin(st.a);
      B0.forEach((b, k) => { const lx = b.x - O.x; strap(k, { x: O.x + st.x + lx * c, y: O.y + st.y + lx * s }); });
    };

    // keep the card's centre inside the screen (and inside its panel on the home page); the strap can't pull out forever
    const limit = (x, y) => {
      const r = rig.getBoundingClientRect(), cw = card.offsetWidth, chh = card.offsetHeight;
      const cx0 = r.left + r.width / 2, cy0 = r.top + hang.offsetTop + card.offsetTop + chh / 2;
      let l = 0, t = 0, rr = innerWidth, b = innerHeight;
      if (host) { const hr = host.getBoundingClientRect(); l = Math.max(l, hr.left); t = Math.max(t, hr.top); rr = Math.min(rr, hr.right); b = Math.min(b, hr.bottom); }
      const mx = cw * 0.45, my = chh * 0.35;
      x = clamp(x, Math.min(0, l + mx - cx0), Math.max(0, rr - mx - cx0));
      y = clamp(y, Math.min(0, t + my - cy0), Math.max(0, b - my - cy0));
      const reach = L * 0.7, dist = Math.hypot(x, y);                  // at most ~70% of a strap length away from where it hangs
      if (dist > reach) { x *= reach / dist; y *= reach / dist; }
      return [x, y];
    };

    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      if (!held) {
        st.vx += (-K * st.x - C * st.vx) * dt; st.vy += (-K * st.y - C * st.vy) * dt;
        st.x += st.vx * dt; st.y += st.vy * dt;
      }
      // lean: along the strap (from the neck to the buckle), plus a little lag against the card's own motion
      const nx = (T[0].x + T[1].x) / 2, ny = T[0].y;
      const along = Math.atan2(nx - (O.x + st.x), O.y + st.y - ny);
      const aim = clamp(along * 0.6 + st.vx * 0.00012, -0.2, 0.2);
      st.va += (KA * (aim - st.a) - CA * st.va) * dt; st.a += st.va * dt;
      if (!held) { vel.x *= 0.9; vel.y *= 0.9; }
      const still = !held && Math.abs(st.x) < 0.3 && Math.abs(st.y) < 0.3 && Math.hypot(st.vx, st.vy) < 3 && Math.abs(st.a) < 0.0015 && Math.abs(st.va) < 0.02;
      if (still) { st.x = st.y = st.vx = st.vy = st.a = st.va = 0; apply(); raf = 0; return; }
      apply();
      raf = requestAnimationFrame(step);
    };
    const run = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };

    // pointer: mouse, pen and touch alike
    hang.addEventListener("pointerdown", (e) => {
      if (!live || e.button > 0) return;
      e.preventDefault();
      hang.setPointerCapture(e.pointerId);
      const r = rig.getBoundingClientRect();
      grab = { px: e.clientX, py: e.clientY, x: st.x, y: st.y, rx: r.left, ry: r.top };
      lastP = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      vel.x = vel.y = 0; st.vx = st.vy = 0;
      held = true;
      idl.classList.add("is-dragging", "idl--moved");
      run();
    });
    hang.addEventListener("pointermove", (e) => {
      if (!grab) return;
      const r = rig.getBoundingClientRect();                            // the page may scroll (mouse wheel) while holding
      [st.x, st.y] = limit(grab.x + e.clientX - grab.px - (r.left - grab.rx), grab.y + e.clientY - grab.py - (r.top - grab.ry));
      const dt = Math.max(8, e.timeStamp - lastP.t) / 1000;
      vel.x = vel.x * 0.5 + ((e.clientX - lastP.x) / dt) * 0.5;
      vel.y = vel.y * 0.5 + ((e.clientY - lastP.y) / dt) * 0.5;
      lastP = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      st.vx = vel.x; st.vy = vel.y;                                     // feeds the lean while held
      run();
    });
    const release = () => {
      if (!grab) return;
      grab = null; held = false;
      idl.classList.remove("is-dragging");
      st.vx = clamp(vel.x, -1400, 1400) * 0.6;                          // a little momentum, not a throw
      st.vy = clamp(vel.y, -1400, 1400) * 0.6;
      run();
    };
    hang.addEventListener("pointerup", release);
    hang.addEventListener("pointercancel", release);
    hang.addEventListener("lostpointercapture", release);
    hang.addEventListener("dragstart", (e) => e.preventDefault());

    // keyboard: arrows move the focused card while held down; on key-up it swings back like after a drag
    const KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    idl.addEventListener("keydown", (e) => {
      const k = KEYS[e.key];
      if (!k || !live || grab || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const d = e.shiftKey ? 48 : 18;
      held = true;
      idl.classList.add("idl--moved");
      [st.x, st.y] = limit(st.x + k[0] * d, st.y + k[1] * d);
      st.vx = k[0] * 500; st.vy = 0;
      run();
    });
    const keyRelease = () => { if (held && !grab) { held = false; st.vx = st.vy = 0; run(); } };
    idl.addEventListener("keyup", (e) => { if (KEYS[e.key]) keyRelease(); });
    idl.addEventListener("blur", keyRelease);

    // first paint: the bendable straps replace the plain ones (identical at rest)
    measure(); apply();
    idl.classList.add("idl--js");
    addEventListener("resize", () => { measure(); apply(); });

    // ready to drag once the card has finished its entrance (right away with reduced motion)
    const ready = () => {
      if (live) return;
      live = true;
      idl.classList.add("idl--ready");
      idl.tabIndex = 0;
      hang.setAttribute("data-cursor", "Drag");
      idl.setAttribute("aria-label", idl.getAttribute("aria-label") + "（ドラッグ、または矢印キーで動かせます）");
    };
    if (reduced) ready();
    else {
      card.addEventListener("animationend", (e) => { if (e.animationName === "idl-sway" && e.target === card) ready(); });
      // fallback in case "animationend" never arrives (it can be held back, e.g. in a background tab)
      card.addEventListener("animationstart", (e) => {
        if (e.animationName === "idl-sway" && e.target === card) setTimeout(ready, parseFloat(getComputedStyle(card).animationDuration) * 1000 + 150);
      });
    }
  });

  /* ------------------------------------------------------------------ 6 · skills — each number counts up once, when its card is revealed */
  const cards = $$(".skill-card");
  if (cards.length) {
    const count = (el) => {
      const m = /^(\d+)%$/.exec(el.textContent.trim());
      if (!m || reduced) return;
      const end = +m[1], t0 = performance.now(), dur = 1400;
      el.textContent = "0%";
      const step = (now) => {
        const t = clamp((now - t0) / dur, 0, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + "%";
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const sio = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { const p = $(".skill-pct", en.target); if (p) count(p); sio.unobserve(en.target); } });
      }, { threshold: 0.35 });
      cards.forEach((c) => sio.observe(c));
    }
  }

  /* ------------------------------------------------------------------ 7 · magnetic buttons (fine pointers) */
  if (fine && !reduced) {
    $$(".cta-row .btn, .nav-cta .btn, .section-label-row .btn, .feat .btn").forEach((btn) => {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const loop = () => {
        cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
        btn.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
        raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(loop) : 0;
      };
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 12, -6, 6);
        ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 12, -5, 5);
        if (!raf) raf = requestAnimationFrame(loop);
      });
      btn.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    });
  }

  /* ------------------------------------------------------------------ 8 · cursor
     A 10px follower; over any [data-cursor] it grows into a labelled disc. */
  if (fine && !reduced) {
    const dot = document.createElement("div");
    dot.className = "mo-cursor";
    dot.setAttribute("aria-hidden", "true");
    dot.innerHTML = "<span></span>";
    document.body.appendChild(dot);
    root.classList.add("has-cursor");
    const label = $("span", dot);
    let mx = 0, my = 0, cx = 0, cy = 0, running = false, shown = false;
    const tick = () => {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
      dot.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) requestAnimationFrame(tick); else running = false;
    };
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (!shown) { cx = mx; cy = my; shown = true; dot.classList.add("is-on"); }
      const t = e.target.closest && e.target.closest("[data-cursor]");
      dot.classList.toggle("is-label", !!t);
      if (t) label.textContent = t.getAttribute("data-cursor");
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
    document.addEventListener("pointerleave", () => { shown = false; dot.classList.remove("is-on", "is-label"); });
  }

  /* ------------------------------------------------------------------ 9 · the deck
     `order` is the stack, order[0] = top card. Each card's depth (--d) is its index in `order`;
     CSS turns depth into position, so reordering `order` moves everything.
     Flick: drag the top card (distance > 110px or a fast flick) and it flies off, then rejoins
     at the back. Prev brings the back card in from the side. Dots jump straight to a project. */
  const deckEl = $("[data-deck]");
  if (deckEl) {
    const section = deckEl.closest(".dk");
    const cards = $$(".dk__card", deckEl);
    const infos = $$(".dk__info", section);
    const dots = $$(".dk__go", section);
    const cur = $("[data-dcur]", section);
    const n = cards.length;
    section.style.setProperty("--dk-n", n);                 // the pinned scroll track is as long as the deck needs
    let order = cards.map((_, i) => i), busy = false, drag = null;
    const W = () => Math.min(innerWidth, 900);
    const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

    const apply = () => {
      order.forEach((ci, d) => {
        const c = cards[ci];
        c.style.setProperty("--d", d);
        c.classList.toggle("is-top", d === 0);
        c.setAttribute("aria-hidden", d ? "true" : "false");
        const a = $("a", c); if (a) a.tabIndex = d ? -1 : 0;
      });
      const top = order[0];
      infos.forEach((el, i) => el.classList.toggle("is-on", i === top));
      dots.forEach((b, i) => { b.classList.toggle("is-active", i === top); if (i === top) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      if (cur) { cur.textContent = String(top + 1).padStart(2, "0"); cur.classList.remove("is-tick"); void cur.offsetWidth; cur.classList.add("is-tick"); }
    };
    const settle = (ms, fn) => setTimeout(fn, reduced ? 0 : ms);

    // top card flies off in direction dir (-1 left, +1 right), the rest move forward, the card rejoins at the back
    const next = (dir = -1, fromDrag = false) => {
      if (busy) return;
      busy = true;
      const c = cards[order[0]];
      c.classList.remove("is-drag");
      if (!reduced) {
        c.classList.add("is-flying");
        const dy = fromDrag && drag ? drag.dy * 0.5 : -30;
        c.style.translate = `${dir * W() * 0.75}px ${dy}px`;
        c.style.rotate = `${dir * 20}deg`;
        c.style.opacity = "0";
      }
      order.push(order.shift());
      apply();
      settle(650, () => {
        c.classList.add("is-resetting");
        c.classList.remove("is-flying");
        c.style.translate = ""; c.style.rotate = ""; c.style.opacity = "0";
        void c.offsetWidth;
        c.classList.remove("is-resetting");
        nextFrame(() => { c.style.opacity = ""; });
        busy = false;
      });
    };
    // previous: the back card comes in from the left and lands on top
    const prev = () => {
      if (busy) return;
      busy = true;
      const c = cards[order[n - 1]];
      c.classList.add("is-resetting");
      if (!reduced) { c.style.translate = `${-W() * 0.75}px -20px`; c.style.rotate = "-18deg"; c.style.opacity = "0"; }
      order.unshift(order.pop());
      apply();
      void c.offsetWidth;
      c.classList.remove("is-resetting");
      c.style.translate = ""; c.style.rotate = ""; c.style.opacity = "";
      settle(700, () => { busy = false; });
    };
    const goTo = (k) => {
      const pos = order.indexOf(k);
      if (pos <= 0 || busy) return;
      order = order.slice(pos).concat(order.slice(0, pos));
      apply();
    };

    $(".dk__btn--next", section).addEventListener("click", () => next(-1));
    $(".dk__btn--prev", section).addEventListener("click", prev);
    dots.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
    section.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(-1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });

    // flick with the pointer
    if (!reduced) {
      deckEl.addEventListener("pointerdown", (e) => {
        const c = e.target.closest(".dk__card");
        if (!c || !c.classList.contains("is-top") || busy || e.button) return;
        drag = { c, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, t: performance.now(), lx: e.clientX, lt: performance.now(), vx: 0, moved: 0 };
        c.classList.add("is-drag");
        try { c.setPointerCapture(e.pointerId); } catch (_) {}
      });
      deckEl.addEventListener("pointermove", (e) => {
        if (drag) {
          drag.dx = e.clientX - drag.x0; drag.dy = e.clientY - drag.y0;
          drag.moved = Math.max(drag.moved, Math.abs(drag.dx) + Math.abs(drag.dy));
          const now = performance.now();
          drag.vx = (e.clientX - drag.lx) / Math.max(1, now - drag.lt); drag.lx = e.clientX; drag.lt = now;
          if (drag.moved > 6) {
            drag.c.style.translate = `${drag.dx}px ${drag.dy * 0.5}px`;
            drag.c.style.rotate = `${drag.dx * 0.05}deg`;
          }
          return;
        }
        // 3D tilt under the mouse
        if (e.pointerType !== "mouse") return;
        const top = cards[order[0]], r = top.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        if (Math.abs(px) < 0.9 && Math.abs(py) < 0.9) { top.style.setProperty("--ry", (px * 10).toFixed(2) + "deg"); top.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg"); }
      });
      const end = () => {
        if (!drag) return;
        const d = drag; drag = null;
        d.c.classList.remove("is-drag");
        if (d.moved <= 6) return;                                                      // a tap: let the link open
        if (Math.abs(d.dx) > 110 || Math.abs(d.vx) > 0.7) { drag = d; next(d.dx < 0 ? -1 : 1, true); drag = null; }
        else { d.c.style.translate = ""; d.c.style.rotate = ""; }                      // not far enough: spring back
        d.c.dataset.dragged = "1"; setTimeout(() => { delete d.c.dataset.dragged; }, 50);
      };
      deckEl.addEventListener("pointerup", end);
      deckEl.addEventListener("pointercancel", end);
      deckEl.addEventListener("pointerleave", () => { const top = cards[order[0]]; top.style.removeProperty("--rx"); top.style.removeProperty("--ry"); });
      deckEl.addEventListener("click", (e) => { if (e.target.closest(".dk__card[data-dragged]")) e.preventDefault(); });
      deckEl.addEventListener("dragstart", (e) => e.preventDefault());
    }

    // aquarium card: measure how far its page can scroll
    $$(".hg__photo--tall img", deckEl).forEach((im) => {
      const box = im.parentElement;
      const m = () => box.style.setProperty("--pm-shift", Math.min(0, box.clientHeight - im.offsetHeight) + "px");
      im.addEventListener("load", m); addEventListener("resize", m); m();
    });

    // pinned scroll mode: the section is a tall track and its content sticks; scrolling through the track
    // flicks the cards one by one (and back when scrolling up). Wide, tall screens without reduced motion only.
    const pin = $(".dk__pin", section), bar = $(".dk__progress i", section);
    const pinMQ = matchMedia("(min-width: 901px) and (min-height: 560px)");
    let lastK = 0, pumping = false;
    const pinned = () => section.classList.contains("is-pinned");
    const pump = () => {                                    // walk the stack to project `lastK`, one flick at a time
      if (pumping) return;
      pumping = true;
      const tick = () => {
        if (busy) { setTimeout(tick, 60); return; }
        const top = order[0], want = lastK;
        if (top === want) { pumping = false; return; }
        const fwd = (want - top + n) % n;
        if (fwd === 1) next(-1); else if (fwd === n - 1) prev(); else goTo(want);
        setTimeout(tick, 60);
      };
      tick();
    };
    const layer = section.closest(".v2-layer");             // js/v2-motion.js §10 wraps the section in a stacking layer
    const onScroll = () => {
      if (!pinned()) return;
      // while the next section slides over the deck, the deck's layer shrinks a little; that would read as scrolling
      // back and flick a card back — so the deck keeps its last card until it is uncovered again
      if (layer && parseFloat(layer.style.getPropertyValue("--c")) > 0.001) return;
      const total = section.offsetHeight - pin.offsetHeight;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
      if (bar) bar.parentElement.style.setProperty("--p", p.toFixed(3));
      if (bar) bar.style.setProperty("--p", p.toFixed(3));
      const k = Math.min(n - 1, Math.floor(p * n));
      if (k !== lastK) { lastK = k; pump(); }
    };
    const setPin = () => {
      const on = !reduced && pinMQ.matches;
      section.classList.toggle("is-pinned", on);
      if (on) { lastK = order[0]; onScroll(); }
    };
    setPin();
    pinMQ.addEventListener ? pinMQ.addEventListener("change", setPin) : pinMQ.addListener(setPin);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    apply();
    // arrival: the stack rises in when the section is reached
    if ("IntersectionObserver" in window && !reduced) {
      const ao = new IntersectionObserver(([en]) => { if (en.isIntersecting) { section.classList.add("is-live"); ao.disconnect(); } }, { threshold: 0.25 });
      ao.observe(deckEl);
    } else section.classList.add("is-live");
  }
})();
