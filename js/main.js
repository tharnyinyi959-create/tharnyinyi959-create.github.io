/* =====================================================================
   Mobile nav toggle
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }
});

/* =====================================================================
   Reveal on scroll — robust: IntersectionObserver + timeout fallback
   so nothing can be left permanently invisible.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-reveal], [data-reveal-group], .skill-card");

  const show = (el) => el.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(show);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }

  // Safety net: force-reveal anything still hidden after 2s, in case the
  // observer never fires in some environment/viewport combination.
  setTimeout(() => {
    document.querySelectorAll("[data-reveal]:not(.is-visible), [data-reveal-group]:not(.is-visible), .skill-card:not(.is-visible)")
      .forEach(show);
  }, 2000);
});

/* =====================================================================
   Typing effect (hero role line)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("[data-typing]");
  if (!el) return;

  let phrases = [];
  try {
    phrases = JSON.parse(el.getAttribute("data-typing"));
  } catch (e) {
    return;
  }
  if (!phrases.length) return;

  const textSpan = document.createElement("span");
  const caret = document.createElement("span");
  caret.className = "caret";
  el.textContent = "";
  el.appendChild(textSpan);
  el.appendChild(caret);

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      textSpan.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      textSpan.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }

  setTimeout(tick, 600);
});

/* =====================================================================
   Cursor glow follower (desktop only)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.style.opacity = "0";
  document.body.appendChild(glow);

  let raf = null;
  window.addEventListener("mousemove", (e) => {
    glow.style.opacity = "1";
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      raf = null;
    });
  });

  document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
});

/* =====================================================================
   Hero visual parallax tilt (desktop only)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".hero-visual");
  if (!wrap) return;
  if (window.matchMedia("(max-width: 980px)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const tiltEls = wrap.querySelectorAll("[data-tilt]");
  if (!tiltEls.length) return;

  let raf = null;

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (raf) return;
    raf = requestAnimationFrame(() => {
      tiltEls.forEach((el) => {
        const depth = parseFloat(el.dataset.tilt) || 1;
        if (el.classList.contains("floater")) {
          el.style.transform = `translate(${px * 18 * depth}px, ${py * 18 * depth}px)`;
        } else {
          el.style.transform =
            `perspective(1400px) rotateY(${px * 12 * depth}deg) rotateX(${-py * 12 * depth}deg) translate(${px * 10 * depth}px, ${py * 10 * depth}px)`;
        }
      });
      raf = null;
    });
  });

  wrap.addEventListener("mouseleave", () => {
    tiltEls.forEach((el) => (el.style.transform = ""));
  });
});

/* =====================================================================
   Button ripple effect
   ===================================================================== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = e.clientX - rect.left - size / 2 + "px";
  ripple.style.top = e.clientY - rect.top - size / 2 + "px";
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

/* =====================================================================
   Magnetic buttons (desktop only) — buttons drift gently toward the cursor
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(max-width: 780px)").matches) return;

  document.querySelectorAll(".btn-primary, .btn-outline").forEach((btn) => {
    if (btn.classList.contains("btn-sm")) return;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35 - 2}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});

/* =====================================================================
   Works filter gallery (works.html) — smooth fade/scale/stagger swap
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".filter-tab");
  const grid = document.getElementById("worksGrid");
  if (!tabs.length || !grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-category]"));
  const emptyMsg = document.getElementById("filterEmpty");

  function applyFilter(filter) {
    let visibleIndex = 0;
    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      if (matches) {
        card.style.display = "";
        card.style.transitionDelay = visibleIndex * 70 + "ms";
        requestAnimationFrame(() => {
          card.classList.remove("card-out");
          card.classList.add("card-in");
        });
        visibleIndex++;
      } else {
        card.style.transitionDelay = "0ms";
        card.classList.remove("card-in");
        card.classList.add("card-out");
        setTimeout(() => {
          if (card.classList.contains("card-out")) card.style.display = "none";
        }, 350);
      }
    });
    if (emptyMsg) emptyMsg.style.display = visibleIndex === 0 ? "block" : "none";
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.dataset.filter);
    });
  });
});

/* =====================================================================
   Lightweight scroll parallax for decorative background layers
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll("[data-parallax]");
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(max-width: 980px)").matches) return;

  let raf = null;
  function update() {
    const y = window.scrollY;
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${y * speed}px)`;
    });
    raf = null;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    },
    { passive: true }
  );
});

/* =====================================================================
   Related Works carousel arrows (work detail pages)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("relatedTrack");
  const prev = document.getElementById("relatedPrev");
  const next = document.getElementById("relatedNext");
  if (!track || !prev || !next) return;

  const step = () => {
    const card = track.querySelector(".related-card");
    if (!card) return 300;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  // the arrows show only when there is something to scroll to
  new ResizeObserver(() => {
    prev.hidden = next.hidden = track.scrollWidth <= track.clientWidth + 1;
  }).observe(track);
});

/* =====================================================================
   Project showcase (home page + works.html)
   - pointing at / focusing a row puts that project on the sticky stage
   - when the pointer is not on the list, the row crossing the middle of the screen is the active one
   - works.html: after a filter click the active row moves to the first project that is still shown
   - mouse: a "View" disc follows the cursor over the rows
   One scroll listener (rAF-throttled), two small listeners per row, no libraries.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".proj-list");
  if (!list) return;
  const rows = [...list.querySelectorAll(".proj-row")];
  const items = [...document.querySelectorAll(".proj-stage__item")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchLike = matchMedia("(hover: none), (max-width: 1000px)");
  let current = -1, hovering = false, ticking = false;

  /* the video on the stage plays in place, and YouTube only loads on click.
     While it is open the stage stays on it: pointing at other rows must not stop the video. */
  const videoShot = document.querySelector(".proj-stage .pm-shot--video");
  const videoBtn = videoShot && videoShot.querySelector(".pm-video");
  const videoClose = videoShot && videoShot.closest(".proj-stage__item").querySelector(".proj-stage__close");
  let videoFrame = null;
  const stopVideo = () => {
    if (!videoFrame) return;
    videoFrame.remove();
    videoFrame = null;
    videoShot.classList.remove("is-playing");
    videoBtn.hidden = false;
    videoClose.hidden = true;
  };
  if (videoBtn) {
    videoBtn.addEventListener("click", () => {
      videoFrame = document.createElement("iframe");
      videoFrame.src = `https://www.youtube-nocookie.com/embed/${videoBtn.dataset.video}?autoplay=1`;
      videoFrame.title = videoBtn.title;
      videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      videoFrame.referrerPolicy = "strict-origin-when-cross-origin";
      videoFrame.allowFullscreen = true;
      videoShot.append(videoFrame);
      videoShot.classList.add("is-playing");
      videoBtn.hidden = true;
      videoClose.hidden = false;
    });
    videoClose.addEventListener("click", () => {
      stopVideo();
      videoBtn.focus();
    });
    touchLike.addEventListener("change", stopVideo);                   // the stage is hidden on narrow screens
  }

  const shown = () => rows.filter((r) => r.parentElement.style.display !== "none" && !r.parentElement.classList.contains("card-out"));
  const activate = (i) => {
    if (i === current || videoFrame) return;
    current = i;
    rows.forEach((r, n) => r.classList.toggle("is-active", n === i));
    items.forEach((s, n) => {
      s.classList.toggle("is-on", n === i);
      s.inert = n !== i;                                               // a stage that is wiped away can't be reached with Tab
    });
  };

  const spy = () => {
    ticking = false;
    if (hovering) return;
    const mark = innerHeight * 0.5;                                    // the reading line
    const vis = shown();
    if (!vis.length) return;
    let hit = vis[0];
    vis.forEach((row) => { if (row.getBoundingClientRect().top <= mark) hit = row; });
    activate(rows.indexOf(hit));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  addEventListener("resize", spy);

  rows.forEach((row, i) => {
    const on = () => { hovering = true; list.classList.add("is-hot"); activate(i); };
    row.addEventListener("mouseenter", on);
    row.addEventListener("focus", on);
  });
  const off = () => { hovering = false; list.classList.remove("is-hot"); spy(); };
  list.addEventListener("mouseleave", off);
  list.addEventListener("focusout", (e) => { if (!list.contains(e.relatedTarget)) off(); });

  /* works.html filters (the tabs themselves are handled by the "Works filter gallery" block above) */
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => setTimeout(() => {
      const vis = shown();
      if (vis.length && !vis.includes(rows[current])) { stopVideo(); current = -1; activate(rows.indexOf(vis[0])); }
    }, 400));
  });

  /* the aquarium "website" scrolls itself from top to bottom: measure how far (frame height − page height) */
  document.querySelectorAll(".pm-browser__view").forEach((view) => {
    const img = view.querySelector("img");
    if (!img) return;
    const measure = () => view.style.setProperty("--pm-shift", Math.min(0, view.clientHeight - img.offsetHeight) + "px");
    img.addEventListener("load", measure);
    if ("ResizeObserver" in window) { const ro = new ResizeObserver(measure); ro.observe(view); ro.observe(img); }
    measure();
  });

  const first = shown()[0];
  activate(first ? rows.indexOf(first) : 0);
  spy();
});

/* =====================================================================
   Journey route (profile.html): a vanilla line is drawn down the left as you scroll,
   each stop fills in when it passes the reading line, and its title wipes to full colour.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const route = document.querySelector(".jr-route");
  if (!route) return;
  const stops = [...route.querySelectorAll(".jr-stop")];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let ticking = false;
  const update = () => {
    ticking = false;
    const mark = innerHeight * 0.6;                                    // the reading line
    const r = route.getBoundingClientRect();
    route.style.setProperty("--p", clamp((mark - r.top) / r.height, 0, 1).toFixed(4));
    stops.forEach((s) => s.classList.toggle("is-seen", s.getBoundingClientRect().top < mark));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
});

/* =====================================================================
   Contact form (contact.html): sent in the background to Formspree,
   so the visitor stays on the page and sees the result under the button.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form || !window.fetch) return;
  const status = form.querySelector(".form-status");
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  const t = (s) => (window.I18N ? window.I18N.t(s) : s);           // English when EN is on (js/i18n.js)
  const say = (text, kind) => {
    status.textContent = t(text);
    status.classList.toggle("is-ok", kind === "ok");
    status.classList.toggle("is-error", kind === "error");
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();                                               // the hidden _gotcha field is checked by Formspree, not here
    btn.disabled = true;
    btn.textContent = "Sending…";
    say("送信中です…");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(15000),                           // don't leave the visitor waiting if the service is down
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.status);
      form.reset();
      say("送信しました。お問い合わせありがとうございます！内容を確認して、ご返信いたします。", "ok");
    } catch (err) {
      console.warn("Contact form:", err.message);
      say("送信できませんでした。お手数ですが tharnyinyi959@gmail.com まで直接メールでご連絡ください。", "error");
      // the service failed: offer the visitor's own mail app, with what they typed already filled in
      const f = new FormData(form);
      const mail = document.createElement("a");
      mail.href = `mailto:tharnyinyi959@gmail.com?subject=${encodeURIComponent(f.get("Subject") || f.get("_subject"))}`
        + `&body=${encodeURIComponent(`${f.get("Message")}\n\n${f.get("Name")}\n${f.get("email")}`)}`;
      mail.textContent = t("メールアプリで送る");
      status.append(" ", mail);
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
});
