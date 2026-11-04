/* =====================================================================
   CodingHero — Nordic Indigo × Vanilla Mist: "designer × coder".

   What it does
     1. builds a new <section class="ch"> and inserts it just before the
        existing <section class="hero"> (which is hidden, never deleted)
     2. waits until the loader / logo intro are finished, then plays:
        orange line → code window opens → three files type themselves
        (index.html → style.css → main.js) while a live preview is built
        from that code → labels settle in
     3. leaves a calm interactive state: mouse parallax, hoverable labels,
        clickable file tabs, a preview card that tilts under the cursor

   Switch back to the old hero:  ?hero=classic   or remove the <script> tag.
   ===================================================================== */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.get("hero") === "classic") return;

  var root = document.documentElement;
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* -------------------------------------------------------------------
     TUNING — typing speed in ms per character (lower = faster)
     ------------------------------------------------------------------- */
  var CFG = { charMs: 9, lineMs: 70, fileGapMs: 380, startDelayMs: 750 };
  var userCfg = window.CODING_HERO_CONFIG || {};
  for (var k in userCfg)
    if (Object.prototype.hasOwnProperty.call(userCfg, k)) CFG[k] = userCfg[k];

  /* -------------------------------------------------------------------
     THE CODE (as design). Token classes: k tag/keyword · a attribute/property
     · s value · p punctuation · c comment · x text.  `steps` act on the
     preview when that line has finished typing.
     ------------------------------------------------------------------- */
  var FILES = [
    {
      name: "index.html",
      lines: [
        [
          ["p", "<"],
          ["k", "section"],
          ["p", " "],
          ["a", "class"],
          ["p", "="],
          ["s", '"card"'],
          ["p", ">"],
        ],
        [
          ["p", "  <"],
          ["k", "h3"],
          ["p", ">"],
          ["x", "Thar Nyi Nyi"],
          ["p", "</"],
          ["k", "h3"],
          ["p", ">"],
        ],
        [
          ["p", "  <"],
          ["k", "p"],
          ["p", ">"],
          ["x", "HTML · CSS · JavaScript"],
          ["p", "</"],
          ["k", "p"],
          ["p", ">"],
        ],
        [
          ["p", "  <"],
          ["k", "button"],
          ["p", ">"],
          ["x", "View work"],
          ["p", "</"],
          ["k", "button"],
          ["p", ">"],
        ],
        [
          ["p", "</"],
          ["k", "section"],
          ["p", ">"],
        ],
      ],
      steps: { 0: "card", 1: "h", 2: "p", 3: "b" },
    },
    {
      name: "style.css",
      lines: [
        [
          ["k", ".card"],
          ["p", " {"],
        ],
        [
          ["a", "  display"],
          ["p", ": "],
          ["s", "flex"],
          ["p", ";"],
        ],
        [
          ["a", "  border-radius"],
          ["p", ": "],
          ["s", "20px"],
          ["p", ";"],
        ],
        [
          ["a", "  background"],
          ["p", ": "],
          ["s", "#FFF4D6"],
          ["p", ";"],
        ],
        [
          ["a", "  color"],
          ["p", ": "],
          ["s", "#263BAA"],
          ["p", ";"],
        ],
        [
          ["a", "  transform"],
          ["p", ": "],
          ["s", "rotate(-3deg)"],
          ["p", ";"],
        ],
        [["p", "}"]],
      ],
      steps: { 1: "flex", 2: "radius", 3: "bg", 4: "color", 5: "rot" },
    },
    {
      name: "main.js",
      lines: [
        [
          ["k", "const"],
          ["x", " card "],
          ["p", "= "],
          ["a", "$"],
          ["p", "("],
          ["s", '".card"'],
          ["p", ");"],
        ],
        [
          ["k", "const"],
          ["x", " tilt "],
          ["p", "= "],
          ["p", "(e) => "],
          ["a", "card"],
          ["p", "."],
          ["a", "rotate"],
          ["p", "(e);"],
        ],
        [
          ["x", "card"],
          ["p", "."],
          ["a", "onmousemove"],
          ["p", " = "],
          ["x", "tilt"],
          ["p", ";"],
        ],
        [["c", "// designer × coder"]],
        [
          ["a", "build"],
          ["p", "("],
          ["s", '"portfolio"'],
          ["p", ");"],
        ],
      ],
      steps: { 2: "live" },
    },
  ];

  /* -------------------------------------------------------------------
     MARKUP
     ------------------------------------------------------------------- */
  function html() {
    var tabs = FILES.map(function (f, i) {
      return (
        '<button class="ch__tab" type="button" role="tab" data-file="' +
        i +
        '">' +
        f.name +
        "</button>"
      );
    }).join("");
    var files = FILES.map(function (f, i) {
      return (
        '<div class="ch__file" data-file="' +
        i +
        '" role="tabpanel" aria-label="' +
        f.name +
        '"></div>'
      );
    }).join("");

    return (
      '<div class="ch__grid"></div>' +
      '<span class="ch__mark ch__mark--tl"></span><span class="ch__mark ch__mark--tr"></span>' +
      '<span class="ch__mark ch__mark--bl"></span><span class="ch__mark ch__mark--br"></span>' +
      '<div class="ch__big" aria-hidden="true">&lt;/&gt;</div>' +
      '<div class="ch__meta ch__meta--tl">< Portfolio 2026</div>' +
      '<div class="ch__meta ch__meta--tr" aria-hidden="true">x <span data-x>0000</span> &nbsp; y <span data-y>0000</span></div>' +
      '<div class="ch__meta ch__meta--bl">Thar Nyi Nyi <b>/</b> Design → Code</div>' +
      '<div class="ch__meta ch__meta--br" aria-hidden="true">Scroll <i></i></div>' +
      '<div class="ch__jp" aria-hidden="true">コードで、つくる。</div>' +
      '<div class="ch__cross" aria-hidden="true"></div>' +
      '<div class="ch__stage">' +
      '<div class="ch__rule"></div>' +
      '<div class="ch__tilt">' +
      '<span class="ch__tag ch__tag--html" style="--i:0" data-depth="1.6">&lt; HTML &gt;</span>' +
      '<span class="ch__tag ch__tag--fe" style="--i:5" data-depth="1.1">Front-end</span>' +
      '<span class="ch__tag ch__tag--css" style="--i:1" data-depth="1.9">CSS</span>' +
      '<span class="ch__tag ch__tag--js ch__tag--l" style="--i:2" data-depth="1.4">JavaScript</span>' +
      '<span class="ch__tag ch__tag--web ch__tag--r" style="--i:3" data-depth="1.8">Web</span>' +
      '<span class="ch__tag ch__tag--ui" style="--i:4" data-depth="1.2">UI</span>' +
      '<span class="ch__glyph ch__glyph--a" aria-hidden="true" data-depth="2.2">{ }</span>' +
      '<span class="ch__glyph ch__glyph--b" aria-hidden="true" data-depth="1.3">01</span>' +
      '<div class="ch__win">' +
      '<div class="ch__bar">' +
      '<div class="ch__dots" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="ch__tabs" role="tablist">' +
      tabs +
      "</div>" +
      '<div class="ch__status">Front-end</div>' +
      "</div>" +
      '<div class="ch__body">' +
      '<div class="ch__code">' +
      files +
      "</div>" +
      '<div class="ch__prev" aria-hidden="true">' +
      '<div class="ch__url"><span>localhost:5500</span><span class="ch__live">Live</span></div>' +
      '<div class="ch__canvas">' +
      '<div class="pv-card"><h3 class="pv-h">Thar Nyi Nyi</h3><p class="pv-p">HTML · CSS · JavaScript</p><button class="pv-b" type="button" tabindex="-1">View work</button></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="ch__foot">' +
      '<h1 class="ch__title">' +
      (window.I18N && window.I18N.lang === "en" // EN / JP (js/i18n.js): the word order differs, so the whole line is swapped
        ? '<span class="ch__nb">With a designer\'s eye,</span> <span class="ch__nb">I write <em>code</em>.</span>'
        : '<span class="ch__nb">デザインの目で、</span><span class="ch__nb"><em>コード</em>を書く。</span>') +
      "<small>A front-end student with a designer\'s eye — HTML / CSS / JavaScript</small></h1>" +
      '<div class="cta-row"><a class="btn btn-primary" href="works.html">View My Work</a><a class="btn btn-outline" href="profile.html">About Me</a></div>' +
      "</div>"
    );
  }

  /* -------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------- */
  var oldHero,
    hero,
    caret,
    preview,
    session = 0,
    current = -1,
    typed = [false, false, false],
    started = false;
  var fileEls = [],
    tabEls = [],
    card;

  function init() {
    oldHero = document.querySelector("section.hero");
    if (!oldHero) return;

    hero = document.createElement("section");
    hero.className = "ch container ch--pre";
    hero.setAttribute("aria-label", "Front-end coding hero");
    hero.innerHTML = html();
    oldHero.parentNode.insertBefore(hero, oldHero);
    oldHero.classList.add("ch-replaced"); // hidden, not removed

    fileEls = [].slice.call(hero.querySelectorAll(".ch__file"));
    tabEls = [].slice.call(hero.querySelectorAll(".ch__tab"));
    card = hero.querySelector(".pv-card");
    caret = document.createElement("span");
    caret.className = "ch__caret";
    caret.setAttribute("aria-hidden", "true");

    buildFiles();
    tabEls.forEach(function (t) {
      t.addEventListener("click", function () {
        openFile(+t.getAttribute("data-file"));
      });
    });
    showFile(0);
    whenReady(start);
  }

  // Build empty line/token elements for every file up front → no layout shift while typing.
  function buildFiles() {
    FILES.forEach(function (f, i) {
      var box = fileEls[i];
      f.lineEls = f.lines.map(function (toks, n) {
        var ln = document.createElement("div");
        ln.className = "ch__ln";
        ln.innerHTML =
          '<i class="ln">' + (n + 1) + '</i><span class="tx"></span>';
        var tx = ln.lastChild;
        toks.forEach(function (t) {
          var s = document.createElement("span");
          s.className = "tk-" + t[0];
          tx.appendChild(s);
        });
        box.appendChild(ln);
        return ln;
      });
    });
  }

  function showFile(i) {
    current = i;
    fileEls.forEach(function (el, n) {
      el.classList.toggle("is-on", n === i);
    });
    tabEls.forEach(function (el, n) {
      el.classList.toggle("is-on", n === i);
      el.setAttribute("aria-selected", n === i ? "true" : "false");
    });
  }

  /* -------------------------------------------------------------------
     PREVIEW — the code builds a real little card
     ------------------------------------------------------------------- */
  var STEP = {
    card: function () {
      card.classList.add("s-card");
    },
    h: function () {
      card.querySelector(".pv-h").classList.add("on");
    },
    p: function () {
      card.querySelector(".pv-p").classList.add("on");
    },
    b: function () {
      card.querySelector(".pv-b").classList.add("on");
    },
    flex: function () {
      card.classList.add("s-flex");
    },
    radius: function () {
      card.classList.add("s-radius");
    },
    bg: function () {
      card.classList.add("s-bg");
    },
    color: function () {
      card.classList.add("s-color");
    },
    rot: function () {
      card.classList.add("s-rot");
    },
    live: function () {
      hero.classList.add("is-live");
      card.classList.add("is-live");
    },
  };
  function applyStep(name) {
    if (name && STEP[name]) STEP[name]();
  }
  function applyAllSteps(i) {
    var st = FILES[i].steps;
    for (var l in st) applyStep(st[l]);
  }

  function bindCardTilt() {
    var cardEl = hero.querySelector(".pv-card");
    cardEl.addEventListener("pointermove", function (e) {
      if (!cardEl.classList.contains("is-live")) return;
      var r = cardEl.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5,
        ny = (e.clientY - r.top) / r.height - 0.5;
      cardEl.style.setProperty("--ty", (nx * 16).toFixed(1) + "deg");
      cardEl.style.setProperty("--tx", (-ny * 16).toFixed(1) + "deg");
    });
    cardEl.addEventListener("pointerleave", function () {
      cardEl.style.setProperty("--ty", "0deg");
      cardEl.style.setProperty("--tx", "0deg");
    });
  }

  /* -------------------------------------------------------------------
     TYPING
     ------------------------------------------------------------------- */
  function fillFile(i) {
    // instant: full text, no animation
    var f = FILES[i];
    f.lines.forEach(function (toks, n) {
      var spans = f.lineEls[n].lastChild.children;
      toks.forEach(function (t, j) {
        spans[j].textContent = t[1];
      });
    });
    typed[i] = true;
    applyAllSteps(i);
  }

  function typeFile(i, token) {
    // animated; resolves when finished or cancelled
    var f = FILES[i],
      l = 0,
      t = 0,
      c = 0;
    return new Promise(function (resolve) {
      function place() {
        var tx = f.lineEls[l].lastChild;
        tx.appendChild(caret);
      }
      function tick() {
        if (token !== session) return resolve(false);
        if (l >= f.lines.length) {
          typed[i] = true;
          return resolve(true);
        }
        var toks = f.lines[l];
        if (t >= toks.length) {
          // line done
          applyStep(f.steps[l]);
          l++;
          t = 0;
          c = 0;
          if (l < f.lines.length) place();
          return setTimeout(tick, CFG.lineMs);
        }
        var span = f.lineEls[l].lastChild.children[t];
        var text = toks[t][1];
        c++;
        span.textContent = text.slice(0, c);
        if (c >= text.length) {
          t++;
          c = 0;
        }
        var ch = text.charAt(c - 1 < 0 ? 0 : c - 1);
        setTimeout(tick, /[<>{}.;,]/.test(ch) ? CFG.charMs * 2.6 : CFG.charMs);
      }
      place();
      tick();
    });
  }

  function settle() {
    // caret rests at the end of the open file
    var f = FILES[current];
    f.lineEls[f.lines.length - 1].lastChild.appendChild(caret);
    hero.classList.add("ch--settled");
  }

  // user clicks a tab: finish everything up to that file instantly, show it
  function openFile(i) {
    session++; // cancels any running typing
    for (var n = 0; n <= i; n++) if (!typed[n] || n === i) fillFile(n);
    showFile(i);
    settle();
  }

  function sequence(token) {
    var chain = Promise.resolve(true);
    FILES.forEach(function (f, i) {
      chain = chain.then(function (ok) {
        if (!ok || token !== session) return false;
        showFile(i);
        return typeFile(i, token).then(function (done) {
          if (!done) return false;
          return new Promise(function (r) {
            setTimeout(function () {
              r(true);
            }, CFG.fileGapMs);
          });
        });
      });
    });
    return chain.then(function (ok) {
      if (ok && token === session) settle();
    });
  }

  /* -------------------------------------------------------------------
     START — after the existing loader / logo intro
     ------------------------------------------------------------------- */
  function start() {
    if (started) return;
    started = true;
    if (reduced) {
      // no motion: show the finished scene
      hero.classList.remove("ch--pre");
      hero.classList.add("ch--run", "ch--settled");
      for (var i = 0; i < FILES.length; i++) fillFile(i);
      showFile(FILES.length - 1);
      settle();
      return;
    }
    void hero.offsetWidth; // commit the hidden state first
    hero.classList.remove("ch--pre");
    hero.classList.add("ch--run");
    var token = ++session;
    setTimeout(function () {
      if (token === session) sequence(token);
    }, CFG.startDelayMs);
    setTimeout(function () {
      hero.classList.add("ch--settled");
    }, 3200);
  }

  function whenReady(cb) {
    function blocked() {
      return (
        root.classList.contains("lvi-pending") ||
        root.classList.contains("lvi-active") ||
        root.classList.contains("lvp-hold")
      );
    }
    if (!blocked()) {
      if (document.readyState === "complete") setTimeout(cb, 300);
      else
        window.addEventListener(
          "load",
          function () {
            setTimeout(cb, 450);
          },
          { once: true },
        );
      return;
    }
    var mo = new MutationObserver(function () {
      if (!blocked()) {
        mo.disconnect();
        cb();
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    setTimeout(function () {
      mo.disconnect();
      cb();
    }, 30000); // never stay hidden
  }

  /* -------------------------------------------------------------------
     INTERACTION — lightweight parallax + crosshair (desktop pointers only)
     ------------------------------------------------------------------- */
  function bindPointer() {
    if (!fine || reduced) return;
    var tilt = hero.querySelector(".ch__tilt"),
      big = hero.querySelector(".ch__big"),
      cross = hero.querySelector(".ch__cross"),
      xo = hero.querySelector("[data-x]"),
      yo = hero.querySelector("[data-y]");
    var layers = [].slice.call(hero.querySelectorAll("[data-depth]"));
    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      mx = 0,
      my = 0,
      px = 0,
      py = 0,
      raf = 0,
      inside = false;

    function loop() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09; // parallax follows with inertia
      px += (mx - px) * 0.22;
      py += (my - py) * 0.22; // crosshair follows tighter
      tilt.style.transform =
        "translate3d(" +
        (cx * 10).toFixed(2) +
        "px," +
        (cy * 8).toFixed(2) +
        "px,0) rotateY(" +
        (cx * 2.2).toFixed(2) +
        "deg) rotateX(" +
        (-cy * 1.8).toFixed(2) +
        "deg)";
      big.style.transform =
        "translate3d(" +
        (-cx * 22).toFixed(1) +
        "px," +
        (-cy * 14).toFixed(1) +
        "px,0)";
      for (var i = 0; i < layers.length; i++) {
        var d = parseFloat(layers[i].getAttribute("data-depth")) || 1;
        layers[i].style.transform =
          "translate3d(" +
          (cx * d * 9).toFixed(2) +
          "px," +
          (cy * d * 7).toFixed(2) +
          "px,0)";
      }
      cross.style.transform =
        "translate3d(" + px.toFixed(1) + "px," + py.toFixed(1) + "px,0)";
      var settledNow =
        Math.abs(tx - cx) < 0.002 &&
        Math.abs(ty - cy) < 0.002 &&
        Math.abs(mx - px) < 0.3 &&
        Math.abs(my - py) < 0.3;
      raf = settledNow && !inside ? 0 : requestAnimationFrame(loop);
    }
    function kick() {
      if (!raf) raf = requestAnimationFrame(loop);
    }

    hero.addEventListener(
      "pointermove",
      function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        if (!inside) {
          inside = true;
          px = mx;
          py = my;
          hero.classList.add("is-hover");
        }
        xo.textContent = ("0000" + Math.round(e.clientX)).slice(-4);
        yo.textContent = ("0000" + Math.round(e.clientY)).slice(-4);
        kick();
      },
      { passive: true },
    );
    hero.addEventListener("pointerleave", function () {
      inside = false;
      tx = 0;
      ty = 0;
      hero.classList.remove("is-hover");
      kick();
    });
  }

  function boot() {
    init();
    if (!hero) return;
    bindCardTilt();
    bindPointer();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
