/* =====================================================================
   Opening animation — logo → HUD ring → shatter → first page   (Nordic Indigo #263BAA × Vanilla Mist #FFF4D6)

   Standalone and self-contained (loaded by index.html on a first visit). Every class is prefixed .lvi.

   PLAYS BY ITSELF (then stops and waits):
     1. thin lines draw in, then three bars grow and turn
     2. the bars become the logo (vanilla N with an indigo outline, indigo ring behind it)
     3. the right-hand stroke fills indigo with a light travelling along it
     4. the poster text arrives ("Building for the Web"); everything stops — nothing moves until the visitor scrolls

   DRIVEN BY SCROLL (wheel / touch / keys; scroll distance IS the progress, 0 → 1, fully reversible):
     0   – .5   the text leaves, the logo glides to the centre and a segmented HUD ring builds around it and turns ONE full turn
     .4  – .5   hairline cracks flash across the logo and the ring
     .5  – .95  logo + ring break into ~100 shards that fly apart (nearest pieces first) while the first page opens behind them
     1          the overlay is removed and normal page scrolling is released

   FILE MAP
     CONFIG ........ timings and the scroll distance
     LOGO GEOMETRY . the logo path, its three strokes and the three bars
     HUD RING ...... the ring that builds and turns during the scroll
     DOM ........... builds the overlay (poster, logo svg, scroll cue)
     INTRO PHASES .. lines → bars → logo → arm sweep → poster text
     SHATTER ....... clones the finished picture into triangular shards
     SCROLL ........ renderScroll(sp): the whole scroll timeline in one function
     INPUT / LIFECYCLE

   Tuning:  window.LOGO_LOADING_INDIGO_CONFIG = { speed: 1.2, scrollDistance: 650 }
            ?introSpeed=0.3 (slow motion)  ·  ?intro=off (skip)  ·  ?intro=poster (force the opening)
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var wantOff = params.get("intro") === "off";
  var forceOn = params.get("intro") === "on";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Skip rules: explicit opt-out, reduced-motion users, deep links (#contact…).
  if (wantOff || (!forceOn && (reduced || location.hash))) return;

  /* -------------------------------------------------------------------
     CONFIG — all times in ms, divided by `speed` (2 = twice as fast).
     ------------------------------------------------------------------- */
  var CFG = {
    speed: 2.2,           // the whole opening takes about 4 s when nobody scrolls
    lines: 550,           // 0  thin lines draw in on black
    hline: 450,           // 1  horizon line draws across
    load: 1100,           // 2  bars appear, then turn in sync
    build: 900,           // 3  bars → white logo
    sweep: 1000,          // 3b the right-hand stroke is filled indigo
    reveal: 950,          // 4  poster text + details arrive; then everything stops
    scrollDistance: 650,  // px of wheel travel for the whole opening (turn + shatter + reveal)
    autoPlay: 1500,       // when the poster is up and nobody scrolls for this long, the opening plays on by itself (0 = wait for a scroll)
    autoDuration: 2800,   // how long that self-play takes (ring turn + shatter + page reveal)
    maxWaitForLoad: 4000  // never wait longer than this for window "load"
  };
  var userCfg = window.LOGO_LOADING_INDIGO_CONFIG || {};
  for (var key in userCfg) if (Object.prototype.hasOwnProperty.call(userCfg, key)) CFG[key] = userCfg[key];
  var qSpeed = parseFloat(params.get("introSpeed"));
  if (qSpeed > 0) CFG.speed = qSpeed;

  var MOBILE = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;

  root.classList.add("lvi-pending");

  /* -------------------------------------------------------------------
     LOGO GEOMETRY (copied unchanged from "my logo.svg")
     ------------------------------------------------------------------- */
  var LOGO_D = "M105.21,23.49l3.1-3.81-5.52.83C92.1,8.17,76.31.38,58.7.38S23.84,8.92,13.15,22.27h-7.65l4.47,4.38C3.91,35.86.38,46.86.38,58.7c0,32.21,26.12,58.32,58.32,58.32l-.03,2.88,1.9-2.91c31.34-.99,56.46-26.7,56.46-58.29,0-13.22-4.4-25.42-11.82-35.2h0ZM58.74,113.54h-.04c-30.29,0-54.85-24.56-54.85-54.85,0-10.89,3.17-21.03,8.64-29.57l3.02,2.96-.54,37.35,13.4,7.72.61-33.03,30.25,26.6-.49,42.82ZM62.9,113.39l9.38-14.42v-34.94L25.65,22.27h-7.97C27.72,10.95,42.38,3.83,58.69,3.83s29.97,6.64,39.97,17.29l-6.71,1.01-25.85,32.09,8.11,7.36,28.73-35.31c6.67,9.08,10.61,20.29,10.61,32.42,0,28.87-22.32,52.54-50.65,54.69h0Z";

  // The logo = outer ring (+ its three spikes) + three strokes. The strokes
  // below are the exact regions of the logo between the ring and the two inner
  // halves; the ring is the logo path itself, clipped to r > 54.8.
  // (Points on the ring are pushed out to r≈56.4 so no hairline gap shows.)
  var PIECES = [
    // 1  left stem + foot
    [[15.51, 32.09], [28.98, 44.13], [28.37, 77.16], [14.97, 69.44]],
    // 2  long diagonal + descender (N diagonal / Y stem)
    [[12.49, 29.13], [13.65, 24.6], [17.69, 22.27], [25.66, 22.27], [72.29, 64.03], [72.29, 98.97],
     [62.9, 113.39], [60.89, 115.15], [58.74, 113.55], [59.23, 70.73], [28.98, 44.13], [15.51, 32.09]],
    // 3  Y arm
    [[91.96, 22.13], [98.67, 21.12], [102.15, 22.6], [102.95, 26.27], [74.22, 61.58], [66.11, 54.22]]
  ];

  // The three raised bars from the sketch (logo coordinate space).
  var TILT = (-15 * Math.PI) / 180;
  var BARS = [
    { cx: 36.0, cy: 57, hw: 7, hh: 33 },
    { cx: 58.7, cy: 60, hw: 7, hh: 30 },
    { cx: 81.4, cy: 63, hw: 7, hh: 26 }
  ];

  /* -------------------------------------------------------------------
     small helpers
     ------------------------------------------------------------------- */
  var clamp = function (v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var sstep = function (a, b, v) { var t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  var inOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var raf = window.requestAnimationFrame.bind(window);


  /* -------------------------------------------------------------------
     HUD RING — the segmented ring that the scroll builds around the logo and turns once.
     Independent SVG groups, each with its own rotation / scale / opacity:
       guide (thin broken circle) · outer (stepped blocks, lit from the top-left) · ticks · arcs · marks (3 triangles)
     render(p, pr): p = build progress 0..1 (fade/scale in, blocks grow), pr = turning progress 0..1 (one full turn).
     Logo units, centre 0,0; the logo's own ring (r 54.85–58.33) stays still underneath.
     ------------------------------------------------------------------- */
  var HUD = (function () {
    var NS = "http://www.w3.org/2000/svg", RAD = Math.PI / 180, seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var pol = function (r, deg) { return [r * Math.cos(deg * RAD), r * Math.sin(deg * RAD)]; };
    var f2 = function (n) { return Math.round(n * 100) / 100; };
    var xy = function (q) { return f2(q[0]) + "," + f2(q[1]); };
    var hmix = function (a, b, t) { var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), o = 0; for (var s = 16; s >= 0; s -= 8) o |= Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t) << s; return "#" + ("000000" + o.toString(16)).slice(-6); };
    function el(name, attrs, parent) { var n = document.createElementNS(NS, name); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
    function arcPts(r0, r1, a0, a1, n) {
      var v = [], q;
      for (q = 0; q <= n; q++) v.push(pol(r1, a0 + ((a1 - a0) * q) / n));
      for (q = n; q >= 0; q--) v.push(pol(r0, a0 + ((a1 - a0) * q) / n));
      return v.map(xy).join(" ");
    }
    var INDIGO = "#263BAA";
    var svg, world, gOuter, gTicks, gArcs, gMarks, gGuide, blocks = [], NB;

    function build(parent, before) {
      svg = el("svg", { "class": "lvi-hud", viewBox: "-200 -200 400 400" });
      world = el("g", {}, svg);
      gGuide = el("g", { opacity: 0 }, world);
      el("circle", { r: 70.4, fill: "none", stroke: INDIGO, "stroke-width": 0.32, "stroke-dasharray": "26 5 3 5", opacity: 0.8 }, gGuide);
      NB = MOBILE ? 12 : 16;
      var tot = 0, i;
      for (i = 0; i < NB; i++) { var w = 0.65 + rnd() * 0.9; blocks.push({ w: w }); tot += w; }
      var acc = -90;
      gOuter = el("g", { opacity: 0 }, world);
      blocks.forEach(function (b, idx) {
        b.a0 = acc; b.span = (b.w / tot) * 360; acc += b.span;
        b.outer = idx % 2 === 0; b.r0 = b.outer ? 76.6 : 73.4; b.th = 3.4; b.navy = idx % 5 === 3;
        b.g = el("g", {}, gOuter);
        b.body = el("polygon", {}, b.g); b.lit = el("polygon", {}, b.g); b.dark = el("polygon", {}, b.g);
        b.gloss = el("polygon", { fill: "rgba(255,255,255,0.14)" }, b.g);
      });
      gTicks = el("g", { opacity: 0 }, world);
      var T = MOBILE ? 120 : 220, gaps = [[18, 34], [138, 163], [246, 258]], td = "";
      for (i = 0; i < T; i++) {
        var ta = (i / T) * 360, skip = false;
        gaps.forEach(function (g) { if (ta >= g[0] && ta <= g[1]) skip = true; });
        if (skip) continue;
        var tl = i % 7 === 0 ? 3.6 : 2.2 + rnd() * 0.5;
        td += "M" + xy(pol(63.2, ta)) + "L" + xy(pol(63.2 + tl, ta));
      }
      el("path", { d: td, fill: "none", stroke: INDIGO, "stroke-width": 0.28 }, gTicks);
      el("circle", { r: 62.4, fill: "none", stroke: INDIGO, "stroke-width": 0.35, opacity: 0.7 }, gTicks);
      gArcs = el("g", { opacity: 0 }, world);
      [[8, 72], [128, 176], [236, 306]].forEach(function (a) {
        var s = pol(67.6, a[0]), e = pol(67.6, a[1]), s2 = pol(67.2, a[0] + 1), e2 = pol(67.2, a[1] - 1);
        el("path", { d: "M" + xy(s) + "A67.6,67.6 0 0,1 " + xy(e), fill: "none", stroke: "#5D73DB", "stroke-width": 1.5 }, gArcs);
        el("path", { d: "M" + xy(s2) + "A67.2,67.2 0 0,1 " + xy(e2), fill: "none", stroke: "rgba(255,255,255,0.75)", "stroke-width": 0.4 }, gArcs);
      });
      gMarks = el("g", { opacity: 0 }, world);
      [-90, 30, 150].forEach(function (a) {
        el("polygon", { points: [pol(66.8, a), pol(70.4, a - 2.6), pol(70.4, a + 2.6)].map(xy).join(" "), fill: "#1B2A85", stroke: "#6E84E0", "stroke-width": 0.3, "stroke-linejoin": "round" }, gMarks);
      });
      parent.insertBefore(svg, before);
    }

    function layer(g, rot, sc, op) {
      g.style.display = op < 0.003 ? "none" : "";
      g.setAttribute("opacity", f2(op));
      g.setAttribute("transform", "rotate(" + f2(rot) + ") scale(" + f2(sc) + ")");
    }

    function render(p, pr) {
      if (!svg) return;
      p = clamp(p); pr = pr > 0 ? pr : 0;
      world.setAttribute("transform", "scale(" + f2(1 + 0.02 * sstep(0, 0.3, p)) + ")");
      var oOut = sstep(0.02, 0.28, p), oTick = sstep(0.1, 0.38, p), oArc = sstep(0.18, 0.46, p), oMark = sstep(0.28, 0.56, p), oGuide = sstep(0.22, 0.5, p);
      var rotO = 360 * pr;                       // exactly ONE full turn while the logo glides to the centre
      layer(gOuter, rotO, lerp(0.9, 1, oOut), oOut);
      layer(gTicks, -270 * pr, lerp(0.93, 1, oTick), oTick);
      layer(gArcs, 360 * pr, lerp(0.95, 1, oArc), oArc);
      layer(gMarks, -180 * pr, lerp(0.95, 1, oMark), oMark);
      layer(gGuide, 90 * pr, 1, oGuide * 0.9);
      var grow = 0.4 + 0.5 * sstep(0.05, 0.45, p), step = sstep(0.6, 0.95, p);
      for (var i = 0; i < NB; i++) {
        var b = blocks[i], gap = 3 * (1 - sstep(0.1, 0.5, p)) + 1.6, a0 = b.a0 + gap / 2, a1 = Math.max(a0 + 1.2, b.a0 + b.span * grow - gap / 2);
        var r0 = b.r0 + (b.outer ? 1 : -1) * 1.1 * step;
        var lit = 0.5 + 0.5 * Math.cos(((a0 + a1) / 2 + rotO + 135) * RAD);       // light from the top-left
        b.body.setAttribute("points", arcPts(r0 + 0.6, r0 + b.th - 0.5, a0, a1, 6));
        b.lit.setAttribute("points", arcPts(r0, r0 + 0.6, a0, a1, 6));
        b.dark.setAttribute("points", arcPts(r0 + b.th - 0.5, r0 + b.th, a0, a1, 6));
        b.gloss.setAttribute("points", arcPts(r0 + 0.6, r0 + 0.6 + (b.th - 1.1) * 0.45, a0 + 0.4, a1 - 0.4, 6));
        b.body.setAttribute("fill", b.navy ? hmix("#0A0F22", "#2C3874", lit) : hmix("#1B2A85", "#4A5FD0", lit));
        b.lit.setAttribute("fill", b.navy ? hmix("#3A4780", "#8C9BD6", lit) : hmix("#6E84E0", "#E6ECFF", lit));
        b.dark.setAttribute("fill", b.navy ? "#05070F" : hmix("#0C1448", "#18236E", lit));
      }
      var sh = sstep(0.02, 0.3, p);
      svg.style.filter = sh < 0.01 ? "none" : "drop-shadow(" + f2(2 * sh) + "px " + f2(6 * sh) + "px " + f2(7 * sh) + "px rgba(16,23,43," + f2(0.3 * sh) + "))";
    }
    return { build: build, render: render, el: function () { return svg; } };
  })();

  var dead = false;       // set once the intro is finished or aborted
  var spikePoly, armPoly, armStops, poster, skipBtn, parEls = [], overlay, fabric, light, disc, face, hint, markSvg;
  var faceGroups = [], sideGroups = [], shadowGroups = [], haloGroups = [], halo2Groups = [], spikeHalo;
  var typeEl, extEls = [], ringMaskCircle;
  var discSize = 600;

  // the loading layer is done (or opening): release the page underneath
  function openPage() {
    root.classList.remove("lvi-active", "lvi-pending");
    root.classList.add("lvi-opened");
  }

  function tween(ms, fn) {
    ms = ms / CFG.speed;
    return new Promise(function (resolve) {
      var t0 = performance.now();
      (function frame(now) {
        if (dead) return resolve();
        var t = clamp((now - t0) / ms);
        fn(t);
        if (t < 1) raf(frame); else resolve();
      })(t0);
    });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms / CFG.speed); }); }

  /* -------------------------------------------------------------------
     DOM
     ------------------------------------------------------------------- */
  function build() {
    overlay = document.createElement("div");
    overlay.className = "lvi";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="lvi__fabric">' +
        '<div class="lvi__light"></div>' +
        '<div class="lvi__lip"></div>' +
      '</div>' +
      '<div class="lvi__poster">' +
        '<div class="lvi__p lvi__grid" data-depth="0.3"></div>' +
        '<div class="lvi__p lvi__hline" data-depth="0.5"><i></i></div>' +
        '<div class="lvi__p lvi__vline" data-depth="0.8"><i></i><u></u><em>01</em></div>' +
        '<span class="lvi__mark lvi__mark--tl"></span><span class="lvi__mark lvi__mark--br"></span>' +
        '<div class="lvi__small">ポートフォリオ <b>2026</b></div>' +
        '<div class="lvi__jp">ウェブを、つくる。</div>' +
        '<div class="lvi__type">' +
          '<div class="lvi__p lvi__tl lvi__tl--1" data-depth="1.5"><span style="--t:0s">Building</span></div>' +
          '<div class="lvi__p lvi__tl lvi__tl--x" data-depth="2.0"><span style="--t:.2s">for the</span></div>' +
          '<div class="lvi__p lvi__tl lvi__tl--2" data-depth="1.1"><span style="--t:.34s">Web</span></div>' +
          '<div class="lvi__p lvi__cap" data-depth="0.7"><span>HTML · CSS · JavaScript</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="lvi__stage">' +
        '<div class="lvi-disc">' +
          '<div class="lvi-disc__face">' +
            '<svg class="lvi-disc__mark" viewBox="-3 -3 123.4 123.4" xmlns="http://www.w3.org/2000/svg">' +
              '<defs>' +
                '<linearGradient id="lvi-face" gradientUnits="userSpaceOnUse" x1="10" y1="6" x2="108" y2="112"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>' +
                '<linearGradient id="lvi-arm" gradientUnits="userSpaceOnUse" x1="60" y1="64" x2="110" y2="17"><stop offset="0" stop-color="#263BAA"/><stop offset="0" stop-color="#263BAA"/><stop offset="0" stop-color="#8A9BF2"/><stop offset="0" stop-color="#263BAA" stop-opacity="0"/><stop offset="1" stop-color="#263BAA" stop-opacity="0"/></linearGradient>' +
                '<linearGradient id="lvi-back" gradientUnits="userSpaceOnUse" x1="10" y1="6" x2="108" y2="112"><stop offset="0" stop-color="#4C60CF"/><stop offset="1" stop-color="#1E2F88"/></linearGradient>' +
                '<clipPath id="lvi-halo-clip"><path clip-rule="evenodd" d="M-5,-5H125V125H-5Z M58.7,4.5a54.2,54.2 0 1,0 0,108.4a54.2,54.2 0 1,0 0,-108.4Z"/></clipPath>' +
                '<clipPath id="lvi-ring-clip"><path clip-rule="evenodd" d="M-5,-5H125V125H-5Z M58.7,3.9a54.8,54.8 0 1,0 0,109.6a54.8,54.8 0 1,0 0,-109.6Z"/></clipPath>' +
                '<mask id="lvi-ring-mask" maskUnits="userSpaceOnUse" x="-5" y="-5" width="130" height="130"><circle cx="58.7" cy="58.7" r="57" fill="none" stroke="#fff" stroke-width="16" transform="rotate(-90 58.7 58.7)" stroke-dasharray="358.1" stroke-dashoffset="358.1"/></mask>' +
                '<filter id="lvi-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5"/></filter>' +
              '</defs>' +
              '<g mask="url(#lvi-ring-mask)"><path class="lvi-ring-halo" clip-path="url(#lvi-halo-clip)" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="1.6" stroke-linejoin="round" d="' + LOGO_D + '"/><path class="lvi-ring" clip-path="url(#lvi-ring-clip)" fill="#263BAA" d="' + LOGO_D + '"/></g>' +
              '<polygon class="lvi-spike-halo" points="96.0,21.44 102.79,20.42 108.6,19.56 105.5,23.6 102.26,26.78" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="3.1" stroke-linejoin="round" opacity="0"/>' +
              '<g class="lvi-shadow" filter="url(#lvi-blur)" fill="#263BAA" opacity="0"></g>' +
              '<g class="lvi-side" fill="#1E2F88"></g>' +
              '<g class="lvi-halo2" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="3.1" stroke-linejoin="round"></g>' +
              '<g class="lvi-halo" fill="#263BAA" stroke="#263BAA" stroke-width="1.4" stroke-linejoin="round"></g>' +
              '<g class="lvi-face" fill="url(#lvi-face)"></g>' +
              '<polygon class="lvi-arm" points="" fill="url(#lvi-arm)" opacity="0"/>' +
              '<polygon class="lvi-spike" points="96.0,21.44 102.79,20.42 108.6,19.56 105.5,23.6 102.26,26.78" fill="url(#lvi-arm)" opacity="0"/>' +
            '</svg>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="lvi__hint" type="button" tabindex="-1"><span>スクロール</span><i></i></button>' +
      '<button class="lvi__skip" type="button" aria-label="オープニングをスキップ（Esc）">スキップ</button>';

    fabric = overlay.querySelector(".lvi__fabric");
    light = overlay.querySelector(".lvi__light");
    disc = overlay.querySelector(".lvi-disc");
    face = overlay.querySelector(".lvi-disc__face");
    armPoly = overlay.querySelector("polygon.lvi-arm");
    spikePoly = overlay.querySelector(".lvi-spike");
    spikeHalo = overlay.querySelector(".lvi-spike-halo");
    armStops = [].slice.call(overlay.querySelectorAll("#lvi-arm stop"));
    armPoly.setAttribute("points", PIECES[2].map(function (q) { return q[0] + "," + q[1]; }).join(" "));
    hint = overlay.querySelector(".lvi__hint");
    skipBtn = overlay.querySelector(".lvi__skip");
    skipBtn.addEventListener("click", function () { skip(); });
    poster = overlay.querySelector(".lvi__poster");
    parEls = [].slice.call(overlay.querySelectorAll("[data-depth]"));
    markSvg = overlay.querySelector(".lvi-disc__mark");
    ringMaskCircle = overlay.querySelector("#lvi-ring-mask circle");
    HUD.build(disc, face);

    var NS = "http://www.w3.org/2000/svg";
    var i;

    // The ring's left and bottom points continue the N (same fill, same outline, one shape). They are
    // static, so they stay with the N while the ring turns; they fade in as the logo locks.
    var EXT = [
      [[5.5, 22.27], [17.69, 22.27], [13.65, 24.6], [12.49, 29.13]],          // left point + N's top-left tip
      [[58.74, 113.55], [60.89, 115.15], [60.57, 116.99], [58.67, 119.9]]     // N's foot + bottom point
    ];
    // three polygons per piece: soft shadow, extruded side, top face
    var gShadow = overlay.querySelector(".lvi-shadow");
    var gSide = overlay.querySelector(".lvi-side");
    var gFace = overlay.querySelector(".lvi-face");
    var gHalo = overlay.querySelector(".lvi-halo");
    var gHalo2 = overlay.querySelector(".lvi-halo2");
    for (i = 0; i < 3; i++) {
      shadowGroups.push(gShadow.appendChild(document.createElementNS(NS, "polygon")));
      sideGroups.push(gSide.appendChild(document.createElementNS(NS, "polygon")));
      halo2Groups.push(gHalo2.appendChild(document.createElementNS(NS, "polygon")));
      haloGroups.push(gHalo.appendChild(document.createElementNS(NS, "polygon")));
      faceGroups.push(gFace.appendChild(document.createElementNS(NS, "polygon")));
    }

    EXT.forEach(function (pp) {
      [gHalo2, gHalo, gFace].forEach(function (g) {
        var el = g.appendChild(document.createElementNS(NS, "polygon"));
        el.setAttribute("points", pts(pp));
        el.setAttribute("opacity", "0");
        extEls.push(el);
      });
    });

    document.body.appendChild(overlay);
    fit();
  }

  function mixHex(a, b, t) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
    var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return "rgb(" + pa.map(function (v, i) { return Math.round(lerp(v, pb[i], t)); }).join(",") + ")";
  }
  function measure() { discSize = disc.offsetWidth || 600; }

  // The overlay is pinned to the *visible* viewport, not the layout viewport.
  // If any page section is wider than a phone screen, mobile browsers enlarge
  // the layout viewport and a plain `inset:0` overlay would drift off-centre.
  function viewport() {
    var vv = window.visualViewport;
    return { w: vv ? vv.width : window.innerWidth, h: vv ? vv.height : window.innerHeight };
  }
  // Where the disc lives (overlay pixels). Landscape: off-centre left, type to its right.
  // Portrait / phone: disc on top, type stacked underneath.
  var HOLE_MAX = 1000;
  var ANCH = { x: 0, y: 0, W: 0, H: 0, land: true };
  function fit() {
    var v = viewport(), W = v.w, H = v.h, d, cx, cy;
    var land = W >= 860 && W / H >= 1.1;
    var R;                                   // diameter of the logo's own ring on screen
    if (land) { R = Math.min(H * 0.4, W * 0.3, 400); cx = W * 0.34; cy = H * 0.53; }
    else { R = Math.min(W * 0.5, H * 0.25, 400); cx = W * 0.47; cy = Math.max(R / 2 + 64, H * 0.3); }
    d = R / 0.945;                           // svg box that contains it
    ANCH = { x: cx, y: cy, W: W, H: H, land: land };
    HOLE_MAX = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) * 1.08;
    var st = overlay.style;
    st.setProperty("--li-w", W + "px");
    st.setProperty("--li-h", H + "px");
    st.setProperty("--W", W + "px");
    st.setProperty("--H", H + "px");
    st.setProperty("--d", d.toFixed(1) + "px");
    st.setProperty("--dcx", cx.toFixed(1) + "px");
    st.setProperty("--dcy", cy.toFixed(1) + "px");
    st.setProperty("--cx", (cx - W / 2).toFixed(1) + "px");
    st.setProperty("--cy", (cy - H / 2).toFixed(1) + "px");
    // the cloth layer is 1.3× the screen (inset -15%): express the disc centre in its own %
    st.setProperty("--hx", (((cx + 0.15 * W) / (1.3 * W)) * 100).toFixed(2) + "%");
    st.setProperty("--hy", (((cy + 0.15 * H) / (1.3 * H)) * 100).toFixed(2) + "%");
    overlay.setAttribute("data-layout", land ? "land" : "port");
    measure();
  }

  /* -------------------------------------------------------------------
     BAR → LOGO-PIECE MORPH
     Each logo piece has n vertices. The bar (a 4-corner rectangle) is sampled
     at the same perimeter fractions, so each vertex has a partner and the
     shape can be interpolated point by point.
     ------------------------------------------------------------------- */
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  function rectAt(rect, f) {
    var L = [], tot = 0, k;
    for (k = 0; k < 4; k++) { L[k] = dist(rect[k], rect[(k + 1) % 4]); tot += L[k]; }
    var d = f * tot;
    for (k = 0; k < 4; k++) {
      if (d <= L[k] || k === 3) {
        var u = L[k] ? d / L[k] : 0, a = rect[k], b = rect[(k + 1) % 4];
        return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
      }
      d -= L[k];
    }
  }
  function fractionsOf(poly) {
    var acc = [0], tot = 0, i;
    for (i = 0; i < poly.length; i++) tot += dist(poly[i], poly[(i + 1) % poly.length]);
    var run = 0;
    for (i = 1; i < poly.length; i++) { run += dist(poly[i - 1], poly[i]); acc.push(run / tot); }
    return acc;
  }
  // choose the starting vertex that makes the bar→piece travel shortest
  function pairUp(target, restRect) {
    var best = null, s, j;
    for (s = 0; s < target.length; s++) {
      var t = target.slice(s).concat(target.slice(0, s));
      var fr = fractionsOf(t), cost = 0;
      for (j = 0; j < t.length; j++) { var p = rectAt(restRect, fr[j]), q = t[j]; cost += (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]); }
      if (!best || cost < best.cost) best = { cost: cost, tgt: t, fr: fr };
    }
    return best;
  }
  function barCorners(i, phi, bob, g) {
    g = g === undefined ? 1 : g;                           // g: 0..1 how far the bar has grown in
    var b = BARS[i], c = Math.cos(phi), s = Math.sin(phi);
    if (Math.abs(c) < 0.05) c = c < 0 ? -0.05 : 0.05;     // never fully vanish
    var ct = Math.cos(TILT), st = Math.sin(TILT), out = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
      var lx = q[0] * b.hw * c * (0.35 + 0.65 * g);
      var ly = q[1] * b.hh * g * (1 + 0.12 * s * q[0]);    // near edge is taller → reads as 3D
      out.push([b.cx + lx * ct - ly * st, b.cy + lx * st + ly * ct + bob]);
    });
    return out;
  }
  var MORPH_TWIST = [-16, 11, -9];   // degrees each bar is turned at the start of the build
  var pairs = [];       // per piece: { tgt, fr }
  var baseMorph = [];   // per piece: bar sampled at the piece's fractions (set when BUILD starts)

  function pts(arr) {
    var s = "";
    for (var i = 0; i < arr.length; i++) s += (i ? " " : "") + arr[i][0].toFixed(2) + "," + arr[i][1].toFixed(2);
    return s;
  }
  function shifted(arr, dx, dy) { return arr.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }

  // Mark state
  var M = {
    phi: [0, 0, 0],       // slat angle (rad)
    bob: [0, 0, 0],
    raise: 0,             // 0 = bars flat on the disc, 1 = fully raised
    grow: [0, 0, 0],      // bars grow in one after another (0 = not there yet)
    building: false,      // true once the bars start becoming the logo
    morph: [0, 0, 0],     // 0 = bar, 1 = logo piece
    flat: 0,              // 1 = extrusion and shadow gone (final flat logo)
    ring: 0               // ring draw-on
  };

  function drawMark() {
    var off = M.raise * (1 - M.flat);
    for (var k = 0; k < 3; k++) {
      var poly;
      if (M.building && baseMorph[k]) {
        // each bar travels to its place while turning: rotation about its own centre
        // eases to 0 as it arrives (e may dip below 0 = anticipation, above 1 = overshoot)
        var e = M.morph[k], tgt = pairs[k].tgt, base = baseMorph[k];
        poly = [];
        var cx = 0, cy = 0, j;
        for (j = 0; j < tgt.length; j++) {
          var px = lerp(base[j][0], tgt[j][0], e), py = lerp(base[j][1], tgt[j][1], e);
          poly.push([px, py]); cx += px; cy += py;
        }
        cx /= tgt.length; cy /= tgt.length;
        var ang = ((1 - e) * MORPH_TWIST[k] * Math.PI) / 180, ca = Math.cos(ang), sa = Math.sin(ang);
        for (j = 0; j < poly.length; j++) {
          var dx = poly[j][0] - cx, dy = poly[j][1] - cy;
          poly[j] = [cx + dx * ca - dy * sa, cy + dx * sa + dy * ca];
        }
      } else {
        poly = barCorners(k, M.phi[k], M.bob[k], M.grow[k]);
      }
      faceGroups[k].setAttribute("points", pts(poly));
      haloGroups[k].setAttribute("points", pts(poly));
      halo2Groups[k].setAttribute("points", pts(poly));
      var hop = (M.building ? 1 : clamp(M.grow[k] * 6)).toFixed(2);
      haloGroups[k].setAttribute("opacity", hop);
      halo2Groups[k].setAttribute("opacity", hop);   // no outline on a bar that has not grown in yet
      sideGroups[k].setAttribute("points", pts(shifted(poly, 1.9 * off, 2.3 * off)));
      shadowGroups[k].setAttribute("points", pts(shifted(poly, 5.5 * off, 7.5 * off)));
      // back of the slat is indigo, front is white
      var front = Math.cos(M.phi[k]) >= 0;
      var want = front ? "url(#lvi-face)" : "url(#lvi-back)";
      if (faceGroups[k].__fill !== want) { faceGroups[k].setAttribute("fill", want); faceGroups[k].__fill = want; }
    }
    var eo = (M.building ? M.flat : 0).toFixed(3);
    for (var q = 0; q < extEls.length; q++) extEls[q].setAttribute("opacity", eo);
    markSvg.querySelector(".lvi-shadow").setAttribute("opacity", (0.2 * off).toFixed(3));
    markSvg.querySelector(".lvi-side").setAttribute("opacity", Math.min(1, off * 1.5).toFixed(3));
    ringMaskCircle.setAttribute("stroke-dashoffset", (358.1 * (1 - M.ring)).toFixed(2));
  }

  /* -------------------------------------------------------------------
     DISC + CLOTH rendering
     ------------------------------------------------------------------- */
  var G = 0;                            // glow strength 0..1
  var PAR = { dx: 0, dy: 0, k: 1 };     // mouse parallax (px offset for the disc, k = strength 0..1)
  var D = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, op: 1, light: 0 };   // the logo disc: position, tilt, scale, opacity (+ the vignette light)

  function drawDisc() {
    disc.style.transform =
      "translate3d(" + (D.x + PAR.dx).toFixed(1) + "px," + (D.y + PAR.dy).toFixed(1) + "px," + D.z.toFixed(1) + "px) " +
      "rotateX(" + D.rx.toFixed(2) + "deg) rotateY(" + D.ry.toFixed(2) + "deg) rotateZ(" + D.rz.toFixed(2) + "deg) scale(" + D.s.toFixed(4) + ")";
    disc.style.opacity = D.op.toFixed(3);

    light.style.opacity = D.light.toFixed(3);
  }

  var F = { scale: 1, hole: 0 };       // the vanilla sheet: its scale and the radius of the opening
  function drawFabric() {
    fabric.style.transform = "scale(" + F.scale.toFixed(4) + ")";
    fabric.style.setProperty("--hole", F.hole.toFixed(1) + "px");
  }

  /* -------------------------------------------------------------------
     PHASES 1–4
     ------------------------------------------------------------------- */
  // 0 · LINES — hairline, orbit, crop marks and grid draw in on the black screen
  function phaseLines() {
    overlay.classList.add("is-lines");
    return tween(CFG.lines, function (t) { D.light = t; drawDisc(); });
  }

  // 4 · REVEAL — type and small details arrive around the finished logo
  function phaseReveal() {
    overlay.classList.add("is-poster");
    return sleep(CFG.reveal).then(function () { if (!dead) overlay.classList.add("is-settled"); });
  }

  /* -------------------------------------------------------------------
     PARALLAX — each layer moves a different small amount (data-depth)
     ------------------------------------------------------------------- */
  /* -------------------------------------------------------------------
     GRID HOVER — the cell under the cursor lifts off the grid (desktop mouse only)
     The grid itself is unchanged: it is still the CSS background of .lvi__grid (72px cells).
     Nothing is added per cell. A small pool of 8 "tile" elements is placed over whichever cell the
     cursor is in; the tile for the cell being left drops back (CSS transition) while the next one
     rises, which leaves a short fading trail. One passive pointermove listener, work done in rAF,
     only transforms/opacity are animated. No touch devices, no reduced-motion, never touches scrolling.
     ------------------------------------------------------------------- */
  function bindGridHover() {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var grid = overlay.querySelector(".lvi__grid");
    if (!grid) return;
    var CELL = 72, POOL = 8, tiles = [], next = 0, current = null, key = "", px = 0, py = 0, queued = false, i;
    // the tiles live in their own layer right above the grid (same parallax depth, so they stay locked to its cells)
    var layer = document.createElement("div");
    layer.className = "lvi__p lvi__tiles";
    layer.setAttribute("data-depth", "0.3");
    grid.insertAdjacentElement("afterend", layer);
    parEls.push(layer);
    for (i = 0; i < POOL; i++) {
      var t = document.createElement("i");
      t.className = "lvi__tile";
      layer.appendChild(t);
      tiles.push(t);
    }
    function drop() { if (current) current.classList.remove("is-up"); current = null; key = ""; }
    function update() {
      queued = false;
      if (dead || S.sp > 0.02) { drop(); return; }               // only while the poster is at rest
      var r = layer.getBoundingClientRect();                      // includes the grid's own parallax offset
      var ox = ANCH.x - CELL / 2, oy = ANCH.y - CELL / 2;         // same origin as the CSS background-position
      var col = Math.floor((px - r.left - ox) / CELL), row = Math.floor((py - r.top - oy) / CELL);
      var k = col + "," + row;
      if (k === key) return;                                      // still in the same cell: nothing to do
      if (current) current.classList.remove("is-up");             // cell A goes back down
      var tile = tiles[next]; next = (next + 1) % POOL;
      tile.style.translate = (ox + col * CELL) + "px " + (oy + row * CELL) + "px";
      tile.classList.add("is-up");                                // cell B rises
      current = tile; key = k;
    }
    overlay.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      px = e.clientX; py = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    overlay.addEventListener("pointerleave", drop);
  }

  function bindParallax() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function loop() {
      var k = PAR.k;
      cx += (tx * k - cx) * 0.07; cy += (ty * k - cy) * 0.07;
      for (var i = 0; i < parEls.length; i++) {
        var dep = parseFloat(parEls[i].getAttribute("data-depth")) || 1;
        parEls[i].style.transform = "translate3d(" + (cx * dep * 9).toFixed(2) + "px," + (cy * dep * 7).toFixed(2) + "px,0)";
      }
      raf = Math.abs(tx * k - cx) < 0.002 && Math.abs(ty * k - cy) < 0.002 ? 0 : requestAnimationFrame(loop);
    }
    overlay.addEventListener("pointermove", function (e) {
      if (dead || S.phase === "done") return;
      tx = (e.clientX / ANCH.W - 0.5) * 2;
      ty = (e.clientY / ANCH.H - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    overlay.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  // 1 · HORIZON — a thin indigo line draws across; the bars will stand on it
  function phaseLine() {
    overlay.classList.add("is-hline");
    return sleep(CFG.hline);
  }

  // 2 · LOAD — the three bars grow in one after another, then turn together
  function outBack(t, c) { c = c || 1.4; var u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; }
  function phaseLoad() {
    return tween(CFG.load, function (t) {
      M.raise = sstep(0.04, 0.3, t);
      for (var i = 0; i < 3; i++) M.grow[i] = outBack(clamp((t - 0.07 * i) / 0.2), 1.1);
      var g = clamp((t - 0.24) / 0.76);
      for (i = 0; i < 3; i++) {
        var u = clamp((g - 0.07 * i) / (1 - 0.14));
        var e = inOutCubic(u);
        M.phi[i] = Math.PI * 4 * e;                       // two full turns, ends facing front
        M.bob[i] = -2.0 * Math.sin(Math.PI * u) * (1 - 0.15 * i);
      }
      drawMark();
    }).then(function () { M.grow = [1, 1, 1]; });
  }

  function waitForLoad() {
    if (document.readyState === "complete") return Promise.resolve();
    return new Promise(function (resolve) {
      var done = function () { resolve(); };
      window.addEventListener("load", done, { once: true });
      setTimeout(done, CFG.maxWaitForLoad);
    });
  }

  // 3 · BUILD — anticipation (bars draw back and twist), travel, small overshoot, settle
  function buildEase(u) {
    var A = 0.2;                                          // anticipation share of the time
    if (u < A) return -0.06 * Math.sin((Math.PI * u) / A);
    return outBack((u - A) / (1 - A), 1.05);
  }
  function phaseBuild() {
    M.grow = [1, 1, 1];
    for (var k = 0; k < 3; k++) {
      var rest = barCorners(k, 0, 0, 1);
      baseMorph[k] = pairs[k].fr.map(function (f) { return rectAt(rest, f); });
    }
    M.building = true;
    return tween(CFG.build, function (t) {
      for (var k = 0; k < 3; k++) {
        M.morph[k] = buildEase(clamp((t - 0.08 * k) / 0.8));
        M.bob[k] = 0;
      }
      M.flat = sstep(0.62, 1, t);
      M.ring = inOutCubic(clamp((t - 0.34) / 0.66));
      D.s = 1 + 0.012 * Math.sin(Math.PI * sstep(0.78, 1, t));    // tiny "lock" pulse
      drawMark();
      drawDisc();
    }).then(function () {
      if (dead) return;
      overlay.classList.add("is-solid");       // thickness slices become visible; horizon line steps back
    });
  }

  // 3b · RIGHT-HAND STROKE — the diagonal toward the upper right turns indigo.
  // A thin lighter front travels along that stroke only, then settles into the flat indigo.
  function setArm(p) {                           // p: 0 → ~1.3 (past 1 = settling)
    var f = function (x) { return clamp(lerp(0.1, 0.99, x), 0, 1); };
    var lead = clamp((p - 1) / 0.3);
    armStops[1].setAttribute("offset", f(p - 0.16).toFixed(3));
    armStops[2].setAttribute("offset", f(p).toFixed(3));
    armStops[2].setAttribute("stop-color", mixHex("#8a9bf2", "#263baa", lead));
    armStops[3].setAttribute("offset", f(p + 0.14).toFixed(3));
  }
  function phaseSweep() {
    armPoly.setAttribute("opacity", "1");
    spikePoly.setAttribute("opacity", "1");
    setArm(0);
    return tween(CFG.sweep, function (t) { setArm(inOutCubic(t) * 1.3); spikeHalo.setAttribute("opacity", sstep(0.6, 1, t).toFixed(3)); })
      .then(function () {
        if (dead) return;
        // settle: the stroke itself becomes flat indigo (no overlay fringe)
        faceGroups[2].setAttribute("fill", "#263BAA"); faceGroups[2].__fill = "#263BAA";
        armPoly.setAttribute("opacity", "0");
        spikePoly.setAttribute("fill", "#263BAA");      // the stroke's crossing + tip stay: static, flat indigo, ABOVE the turning ring (one unbroken stroke)
        spikePoly.setAttribute("stroke", "#263BAA"); spikePoly.setAttribute("stroke-width", "1.4"); spikePoly.setAttribute("stroke-linejoin", "round");
      });
  }


  /* -------------------------------------------------------------------
     SHATTER — after the ring has made its one turn, the whole thing (logo AND ring) breaks into shards that fly apart.
     The finished logo + finished HUD ring are cloned once per shard; every clone is clipped to one triangle of an irregular
     mesh (1.4× the logo's size so it reaches the ring), so together they rebuild the picture exactly. Hairline cracks show
     along the mesh just before it breaks. Each shard then drifts outward from the centre (nearest pieces first), tumbling,
     shrinking and fading. Everything is a pure function of scroll progress.
     ------------------------------------------------------------------- */
  var SH = { built: false, wrap: null, box: null, cracks: null, shards: [] };
  function buildShards() {
    if (SH.built || !markSvg) return;
    SH.built = true;
    var NS = "http://www.w3.org/2000/svg";
    var seed = 5, rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var N = MOBILE ? 6 : 8, pts = [], i, j;
    for (j = 0; j <= N; j++) {
      pts[j] = [];
      for (i = 0; i <= N; i++) {
        var x = i / N, y = j / N, edge = i === 0 || j === 0 || i === N || j === N;
        if (!edge) { x += (rnd() - 0.5) * 0.7 / N; y += (rnd() - 0.5) * 0.7 / N; }
        pts[j][i] = [x, y];
      }
    }
    var tris = [];
    for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
      var a = pts[j][i], b = pts[j][i + 1], c = pts[j + 1][i + 1], d = pts[j + 1][i];
      if (rnd() < 0.5) { tris.push([a, b, c]); tris.push([a, c, d]); } else { tris.push([a, b, d]); tris.push([b, c, d]); }
    }
    // the finished picture: the ring fully built (it is turned back to its resting state by the caller afterwards)
    var hudEl = HUD.el();
    SH.wrap = document.createElement("div");
    SH.wrap.className = "lvi-shards";
    SH.box = document.createElement("div");
    SH.box.className = "lvi-shards__box";
    SH.wrap.appendChild(SH.box);
    var cr = document.createElementNS(NS, "svg");
    cr.setAttribute("class", "lvi-cracks"); cr.setAttribute("viewBox", "0 0 1 1"); cr.setAttribute("preserveAspectRatio", "none");
    SH.cracks = cr;
    var cd = "";
    tris.forEach(function (t) {
      var ds = t.map(function (q) { return Math.hypot(q[0] - 0.5, q[1] - 0.5); }), dmin = Math.min.apply(null, ds), dmax = Math.max.apply(null, ds);
      if (dmin > 0.5) return;                                     // wholly outside the ring
      var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
      var grow = 1.07, poly = t.map(function (q) { return ((cx + (q[0] - cx) * grow) * 100).toFixed(2) + "% " + ((cy + (q[1] - cy) * grow) * 100).toFixed(2) + "%"; }).join(",");
      var el = document.createElement("div");
      el.className = "lvi-shard";
      el.style.clipPath = el.style.webkitClipPath = "polygon(" + poly + ")";
      el.style.transformOrigin = (cx * 100).toFixed(1) + "% " + (cy * 100).toFixed(1) + "%";
      // the logo only reaches 0.34 of the box from its centre, the ring only starts at 0.35: copy just what each shard needs
      if (dmin < 0.37) el.appendChild(markSvg.cloneNode(true));
      if (dmax > 0.33 && hudEl) el.appendChild(hudEl.cloneNode(true));
      SH.box.appendChild(el);
      var dx = cx - 0.5, dy = cy - 0.5, dist = Math.hypot(dx, dy) || 0.001;
      SH.shards.push({
        el: el, dx: dx / dist, dy: dy / dist, dn: Math.min(1, dist / 0.5),
        mag: 90 + rnd() * 260, rz: (rnd() - 0.5) * 240, rx: (rnd() - 0.5) * 110, ry: (rnd() - 0.5) * 110, sc: 0.55 + rnd() * 0.3
      });
      cd += "M" + t[0][0].toFixed(4) + "," + t[0][1].toFixed(4) + "L" + t[1][0].toFixed(4) + "," + t[1][1].toFixed(4) + "L" + t[2][0].toFixed(4) + "," + t[2][1].toFixed(4) + "Z";
    });
    var p1 = document.createElementNS(NS, "path"), p2 = document.createElementNS(NS, "path");
    [p1, p2].forEach(function (q) { q.setAttribute("d", cd); q.setAttribute("fill", "none"); q.setAttribute("vector-effect", "non-scaling-stroke"); q.setAttribute("stroke-linejoin", "round"); cr.appendChild(q); });
    p1.setAttribute("stroke", "#263BAA"); p1.setAttribute("stroke-width", "2"); p1.setAttribute("opacity", "0.85");
    p2.setAttribute("stroke", "#FFF4D6"); p2.setAttribute("stroke-width", "0.7");
    SH.wrap.appendChild(cr);
    disc.appendChild(SH.wrap);
    SH.box.style.display = "none";
    SH.wrap.style.display = "none";
  }
  var easeOut3 = function (t) { return 1 - Math.pow(1 - t, 3); };
  function renderShards(sp) {
    if (!SH.built) return;
    var tt = clamp((sp - 0.5) / 0.45);                                               // break-up progress (starts when the ring has finished its turn)
    var crack = sstep(0.4, 0.49, sp) * (1 - sstep(0.51, 0.6, sp));                   // hairline cracks flash up, then the pieces let go
    SH.cracks.style.opacity = crack.toFixed(3);
    SH.wrap.style.display = (crack > 0.003 || tt > 0) ? "" : "none";
    var live = tt > 0 ? "hidden" : "";
    face.style.visibility = live;                                                    // the clones take over from the real logo + ring
    var hudEl = HUD.el(); if (hudEl) hudEl.style.visibility = live;
    SH.box.style.display = tt > 0 ? "" : "none";
    if (tt <= 0) return;
    var u = discSize / 600, maxDelay = 0.4;
    for (var q = 0; q < SH.shards.length; q++) {
      var s = SH.shards[q];
      var local = clamp((tt - s.dn * maxDelay) / (1 - maxDelay));
      var e = easeOut3(local);
      s.el.style.opacity = (1 - sstep(0.6, 1, local)).toFixed(3);
      s.el.style.transform =
        "translate3d(" + (s.dx * s.mag * u * e).toFixed(1) + "px," + (s.dy * s.mag * u * e).toFixed(1) + "px," + (e * 60).toFixed(1) + "px) " +
        "rotateX(" + (s.rx * e).toFixed(1) + "deg) rotateY(" + (s.ry * e).toFixed(1) + "deg) rotateZ(" + (s.rz * e).toFixed(1) + "deg) scale(" + (1 - (1 - s.sc) * e).toFixed(3) + ")";
    }
  }

  /* -------------------------------------------------------------------
     SCROLL — renderScroll(sp) is the whole scroll timeline; the rest is input + smoothing
     ------------------------------------------------------------------- */
  var S = { phase: "intro", target: 0, sp: 0, loop: false, gated: false };

  // sp is the user's scroll progress 0 → 1. Everything below is a pure function of it.
  function renderScroll(sp) {
    // sp = scroll progress 0 → 1.  Two clocks run from it:
    //   sp  : the HUD ring and the shatter (0–.5 build + one turn, .4–.5 cracks, .5–.95 shards fly apart)
    //   so  : the poster / glide / page-opening timeline (text + glide 0–.35, page opens .4–1).
    //         The page opens just as the shatter begins, so  so = .38  when  sp = .5.
    var so = sp < 0.5 ? sp * (0.38 / 0.5) : 0.38 + ((sp - 0.5) / 0.5) * 0.62;

    // 1 · the ring builds and makes ONE full turn, then the logo + ring break into shards
    HUD.render(sp / 0.5, Math.min(sp / 0.5, 1));
    renderShards(sp);

    // 2 · the text slides off to the right and fades; the logo glides to the centre of the screen
    var mv = inOutCubic(clamp(so / 0.35));
    var W = ANCH.W, H = ANCH.H;
    var shiftX = (W / 2 - ANCH.x) * mv, shiftY = (H / 2 - ANCH.y) * mv;
    var ccx = ANCH.x + shiftX, ccy = ANCH.y + shiftY;           // where the logo is now
    PAR.k = 1 - sstep(0, 0.1, so);
    if (!typeEl) typeEl = poster.querySelector(".lvi__type");
    poster.style.opacity = (1 - sstep(0.04, 0.36, so)).toFixed(3);
    var skipLeft = 1 - sstep(0.15, 0.32, so);                   // gone before the page and its header open (from .4)
    skipBtn.style.opacity = skipLeft < 1 ? (0.8 * skipLeft).toFixed(3) : "";
    skipBtn.style.pointerEvents = skipLeft === 0 ? "none" : "";
    poster.style.transform = "translate3d(" + shiftX.toFixed(1) + "px," + shiftY.toFixed(1) + "px,0)";   // grid + hairlines follow the logo
    typeEl.style.transform = "translate3d(" + (inOutCubic(clamp(so / 0.33)) * W * 0.55).toFixed(1) + "px,0,0)";

    D.x = shiftX; D.y = shiftY; D.rx = D.ry = D.rz = D.z = 0; D.s = 1;
    D.op = 1;                                                    // the shards fade on their own
    drawDisc();

    // 3 · the vanilla layer opens from the logo (at its new centre) and the first page shows through
    overlay.style.setProperty("--hx", (((ccx + 0.15 * W) / (1.3 * W)) * 100).toFixed(2) + "%");
    overlay.style.setProperty("--hy", (((ccy + 0.15 * H) / (1.3 * H)) * 100).toFixed(2) + "%");
    var hmax = Math.max(Math.hypot(ccx, ccy), Math.hypot(W - ccx, ccy), Math.hypot(ccx, H - ccy), Math.hypot(W - ccx, H - ccy)) * 1.08;
    F.hole = inOutCubic(clamp((so - 0.4) / 0.6)) * hmax;
    drawFabric();

    // the first page starts its own entrance once the opening is actually visible
    if (!S.gated && so > 0.46) { S.gated = true; openPage(); }
  }

  function nudge(delta) {
    if (S.phase !== "ready") return;
    S.auto = false;                                  // the visitor took over: stop playing by itself
    S.target = clamp(S.target + delta);
    startLoop();
  }

  // sp eases toward the scroll target, so the ring feels like a weighted dial rather than a jump
  // Nobody scrolled: play the rest of the opening by itself, so a visitor who doesn't know to scroll still gets in.
  // Any wheel / touch / key (nudge) stops it and hands control back.
  function autoPlay() {
    if (!(CFG.autoPlay > 0)) return;
    S.auto = true;
    setTimeout(function () {
      if (dead || !S.auto || S.target > 0) return;   // already scrolling on their own
      var from = S.target;
      tween(CFG.autoDuration, function (t) {
        if (!S.auto || dead) return;
        S.target = Math.max(S.target, from + (1 - from) * (t * t * (3 - 2 * t)));   // smoothstep: soft start and end
        startLoop();
      });
    }, CFG.autoPlay / CFG.speed);
  }
  function startLoop() {
    if (S.loop) return;
    S.loop = true;
    var prev = performance.now();
    (function frame(now) {
      if (dead || S.phase !== "ready") { S.loop = false; return; }
      var dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      S.sp += (S.target - S.sp) * (1 - Math.exp(-dt * 6));
      if (Math.abs(S.target - S.sp) < 0.0005) S.sp = S.target;
      renderScroll(S.sp);
      if (S.target >= 0.999 && S.sp >= 0.997) { S.loop = false; complete(); return; }
      if (S.sp === S.target) { S.loop = false; return; }     // at rest: nothing runs
      raf(frame);
    })(prev);
  }

  // 100 %: finish the last bit, free the page, drop the overlay
  function complete() {
    S.phase = "done";
    renderScroll(1);
    finish();
  }

  /* -------------------------------------------------------------------
     INPUT — owns scrolling while the intro is up
     ------------------------------------------------------------------- */
  function onWheel(e) {
    e.preventDefault();
    var px = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * viewport().h : e.deltaY;
    nudge(px / CFG.scrollDistance);                 // scroll distance = progress (reversible)
  }
  var touchY = null;
  function onTouchStart(e) { touchY = e.touches[0].clientY; }
  function onTouchMove(e) {
    e.preventDefault();
    if (touchY === null) return;
    var y = e.touches[0].clientY;
    nudge((touchY - y) / (viewport().h * 0.8));
    touchY = y;
  }
  function onTouchEnd() { touchY = null; }
  function onKey(e) {
    var k = e.key;
    if (k === "Escape") { e.preventDefault(); skip(); return; }
    var down = k === "ArrowDown" || k === "PageDown" || k === " ";
    var up = k === "ArrowUp" || k === "PageUp";
    if (down || up || k === "Home" || k === "End" || k === "Tab") e.preventDefault();
    if (S.phase !== "ready") return;
    if (down) nudge(0.3);
    else if (up) nudge(-0.3);
    else if (k === "End") nudge(1);
    else if (k === "Home") nudge(-1);
  }
  function onScrollGuard() { if (window.scrollY !== 0) window.scrollTo(0, 0); }
  function onResize() { fit(); if (S.phase === "ready") renderScroll(S.sp); }

  function bind() {
    overlay.addEventListener("wheel", onWheel, { passive: false });
    overlay.addEventListener("touchstart", onTouchStart, { passive: true });
    overlay.addEventListener("touchmove", onTouchMove, { passive: false });
    overlay.addEventListener("touchend", onTouchEnd, { passive: true });
    overlay.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWindowWheel, { passive: false });
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScrollGuard, { passive: true });
    window.addEventListener("resize", onResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize);
    hint.addEventListener("click", function () { nudge(0.34); });      // a click on the cue is the visitor's own action
  }
  function onWindowWheel(e) { if (!dead) e.preventDefault(); }
  function unbind() {
    window.removeEventListener("wheel", onWindowWheel);
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("scroll", onScrollGuard);
    window.removeEventListener("resize", onResize);
    if (window.visualViewport) window.visualViewport.removeEventListener("resize", onResize);
  }

  /* -------------------------------------------------------------------
     lifecycle
     ------------------------------------------------------------------- */
  function finish() {
    if (dead) return;
    dead = true;
    S.phase = "done";
    unbind();
    openPage();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    window.dispatchEvent(new Event("lvi:done"));
  }

  // Escape key / failsafe: fade the overlay out quickly
  function skip() {
    if (dead) return;
    S.phase = "release";
    openPage();
    overlay.style.transition = "opacity .25s ease";
    overlay.style.opacity = "0";
    setTimeout(finish, 260);
  }

  function abort() {                    // any unexpected error → never trap the visitor
    dead = true;
    unbind();
    openPage();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  function init() {
    try {
      build();
      for (var k = 0; k < 3; k++) pairs[k] = pairUp(PIECES[k], barCorners(k, 0, 0));
      root.classList.add("lvi-active");
      root.classList.remove("lvi-pending");
      bind();
      bindParallax();
      bindGridHover();

      // initial pose: disc parked above the screen, bars flat, ring undrawn
      D.y = 0;
      drawDisc(); drawMark(); drawFabric();
      window.scrollTo(0, 0);

      var failsafe = setTimeout(function () { if (!dead) skip(); }, 25000 / Math.min(1, CFG.speed));

      phaseLines()
        .then(function () { return dead ? null : phaseLine(); })
        .then(function () { return dead ? null : phaseLoad(); })
        .then(function () { return dead ? null : waitForLoad(); })
        .then(function () { return dead ? null : phaseBuild(); })
        .then(function () { return dead ? null : phaseSweep(); })
        .then(function () { return dead ? null : phaseReveal(); })
        .then(function () {
          if (dead) return;
          S.phase = "ready";
          HUD.render(1, 1); buildShards(); HUD.render(0, 0);
          clearTimeout(failsafe);                // the safety timeout only guards the animation, not the wait for a scroll
          hint.classList.add("is-on");
          autoPlay();
        })
        .catch(abort);

      window.addEventListener("lvi:done", function () { clearTimeout(failsafe); }, { once: true });
    } catch (err) {
      abort();
      if (window.console) console.warn("[LoadingIndigo] disabled:", err);
    }
  }

  window.LoadingIndigo = {
    skip: skip,
    config: CFG,
    get phase() { return S.phase; },
    get progress() { return S.sp; },
    // dev helper: freeze the opening at v (0..1) to inspect a single frame
    scrub: function (v) { if (S.phase === "ready") { S.sp = S.target = clamp(v); renderScroll(S.sp); } }
  };

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
