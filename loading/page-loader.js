/* =====================================================================
   Page loader — NORDIC INDIGO × VANILLA MIST.
   The same loading screen as ../indigo-loading-vanilla/ (vanilla screen, bars → logo,
   vanilla N with indigo outline, indigo ring and top-right stroke, "000 %" counter), used on
   every inner page (profile, works, contact, work-*). It does not stay on screen:
   when the logo has finished, the page opens from the centre of the circle.

   Skip:  ?intro=off  ·  reduced-motion.   Speed:  window.PAGE_LOADING_CONFIG = { speed: 2.5 }  ·  ?speed=0.3
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (params.get("intro") === "off" || reduced) return;      // the page's own plain splash stays as the fallback
  root.classList.add("lvp-pending", "lvp-hold");              // covers the page from the first paint; "hold" keeps the home hero waiting until the circle opens

  /* all times in ms (÷ speed). Default schedule ≈ 3.7 s from the indigo screen to the finished logo. */
  var CFG = {
    speed: 2.2,
    intro: 800,           // 0.0–0.8  line draws; bars appear from 0.3
    turn: 800,            // 0.8–1.6  bars turn together
    build: 850,           // 1.6–2.45 bars → logo
    sweep: 650,           // 2.45–3.1 light sweep, glow peak, settle
    settle: 600,          // 3.1–3.7  glow eases down
    reveal: 900,          // the page opens from the centre of the circle
    maxWaitForLoad: 4000
  };
  var userCfg = window.PAGE_LOADING_CONFIG || {};
  for (var key in userCfg) if (Object.prototype.hasOwnProperty.call(userCfg, key)) CFG[key] = userCfg[key];
  var qSpeed = parseFloat(params.get("speed"));
  if (qSpeed > 0) CFG.speed = qSpeed;

  var MOBILE = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;

  function clearGates() {}                         // (no page underneath in this standalone file)


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
  var outCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var outQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
  var inOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var inOutSine = function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; };
  var raf = window.requestAnimationFrame.bind(window);

  var dead = false;       // set once the intro is finished or aborted
  var poster, parEls = [], overlay, fabric, light, stage, aura, disc, face, glowPath, sweepPath, sweepGrad, hint, markSvg;
  var faceGroups = [], sideGroups = [], shadowGroups = [], haloGroups = [], halo2Groups = [], extEls = [];
  var armPoly, spikePoly, spikeHalo, armStops;
  var ringMaskCircle, ringGroup;
  var discSize = 600;

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
  var countEl, sweepGradEl;
  function viewport() {
    var vv = window.visualViewport;
    return { w: vv ? vv.width : window.innerWidth, h: vv ? vv.height : window.innerHeight };
  }
  var ANCH = { x: 0, y: 0, W: 0, H: 0 };
  function fit() {
    var v = viewport(), W = v.w, H = v.h, R;
    if (W < 700 || W / H < 0.9) R = Math.min(W * 0.62, H * 0.3, 340);
    else R = Math.min(H * 0.44, W * 0.4, 460);
    var d = R / 0.945, cx = W / 2, cy = H * 0.47;
    ANCH = { x: cx, y: cy, W: W, H: H };
    var st = overlay.style;
    st.setProperty("--li-w", W + "px");
    st.setProperty("--li-h", H + "px");
    st.setProperty("--d", d.toFixed(1) + "px");
    st.setProperty("--dcx", cx.toFixed(1) + "px");
    st.setProperty("--dcy", cy.toFixed(1) + "px");
    st.setProperty("--hy", ((cy / H) * 100).toFixed(2) + "%");
    discSize = d;
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lvp";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="lvp__veil">' +
        '<div class="lvp__grid"></div>' +
        '<div class="lvp__hline"><i></i></div>' +
        '<div class="lvp__lip"></div>' +
        '<span class="lvp__mark lvp__mark--tl"></span><span class="lvp__mark lvp__mark--br"></span>' +
        '<div class="lvp__count"><b>000</b><span>%</span></div>' +
      '</div>' +
      '<div class="lvp__stage">' +
        '<div class="lvp__aura"></div>' +
        '<div class="lvp__logo">' +
            '<svg class="lvp__svg" viewBox="-3 -3 123.4 123.4" xmlns="http://www.w3.org/2000/svg">' +
              '<defs>' +
                '<linearGradient id="lvp-face" gradientUnits="userSpaceOnUse" x1="10" y1="6" x2="108" y2="112"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>' +
                '<linearGradient id="lvp-back" gradientUnits="userSpaceOnUse" x1="10" y1="6" x2="108" y2="112"><stop offset="0" stop-color="#4C60CF"/><stop offset="1" stop-color="#1E2F88"/></linearGradient>' +
                '<linearGradient id="lvp-arm" gradientUnits="userSpaceOnUse" x1="60" y1="64" x2="110" y2="17"><stop offset="0" stop-color="#263BAA"/><stop offset="0" stop-color="#263BAA"/><stop offset="0" stop-color="#8A9BF2"/><stop offset="0" stop-color="#263BAA" stop-opacity="0"/><stop offset="1" stop-color="#263BAA" stop-opacity="0"/></linearGradient>' +
                '<clipPath id="lvp-halo-clip"><path clip-rule="evenodd" d="M-5,-5H125V125H-5Z M58.7,4.5a54.2,54.2 0 1,0 0,108.4a54.2,54.2 0 1,0 0,-108.4Z"/></clipPath>' +
                '<linearGradient id="lvp-sweep" gradientUnits="userSpaceOnUse" x1="-60" y1="0" x2="-20" y2="40"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>' +
                '<clipPath id="lvp-ring-clip"><path clip-rule="evenodd" d="M-5,-5H125V125H-5Z M58.7,3.9a54.8,54.8 0 1,0 0,109.6a54.8,54.8 0 1,0 0,-109.6Z"/></clipPath>' +
                '<mask id="lvp-ring-mask" maskUnits="userSpaceOnUse" x="-5" y="-5" width="130" height="130"><circle cx="58.7" cy="58.7" r="57" fill="none" stroke="#fff" stroke-width="16" transform="rotate(-90 58.7 58.7)" stroke-dasharray="358.1" stroke-dashoffset="358.1"/></mask>' +
                '<filter id="lvp-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5"/></filter>' +
                '<filter id="lvp-glowblur" filterUnits="userSpaceOnUse" x="-30" y="-30" width="180" height="180"><feGaussianBlur stdDeviation="3.4"/></filter>' +
              '</defs>' +
              '<path class="lvp-glow" fill="#263BAA" opacity="0" filter="url(#lvp-glowblur)" d="' + LOGO_D + '"/>' +
              '<g mask="url(#lvp-ring-mask)"><path class="lvp-ring-halo" clip-path="url(#lvp-halo-clip)" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="1.6" stroke-linejoin="round" d="' + LOGO_D + '"/><path class="lvp-ring" clip-path="url(#lvp-ring-clip)" fill="#263BAA" d="' + LOGO_D + '"/></g>' +
              '<polygon class="lvp-spike-halo" points="96.0,21.44 102.79,20.42 108.6,19.56 105.5,23.6 102.26,26.78" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="3.1" stroke-linejoin="round" opacity="0"/>' +
              '<g class="lvp-shadow" filter="url(#lvp-blur)" fill="#263BAA" opacity="0"></g>' +
              '<g class="lvp-side" fill="#1E2F88"></g>' +
              '<g class="lvp-halo2" fill="#FFF4D6" stroke="#FFF4D6" stroke-width="3.1" stroke-linejoin="round"></g>' +
              '<g class="lvp-halo" fill="#263BAA" stroke="#263BAA" stroke-width="1.4" stroke-linejoin="round"></g>' +
              '<g class="lvp-face" fill="url(#lvp-face)"></g>' +
              '<polygon class="lvp-arm" points="" fill="url(#lvp-arm)" opacity="0"/>' +
              '<polygon class="lvp-spike" points="96.0,21.44 102.79,20.42 108.6,19.56 105.5,23.6 102.26,26.78" fill="url(#lvp-arm)" opacity="0"/>' +
              '<path class="lvp-sweeppath" fill="url(#lvp-sweep)" opacity="0" d="' + LOGO_D + '"/>' +
            '</svg>' +
        '</div>' +
      '</div>';

    aura = overlay.querySelector(".lvp__aura");
    glowPath = overlay.querySelector(".lvp-glow");
    sweepPath = overlay.querySelector(".lvp-sweeppath");
    sweepGrad = overlay.querySelector("#lvp-sweep");
    markSvg = overlay.querySelector(".lvp__svg");
    ringMaskCircle = overlay.querySelector("#lvp-ring-mask circle");
    countEl = overlay.querySelector(".lvp__count b");
    armPoly = overlay.querySelector("polygon.lvp-arm");
    spikePoly = overlay.querySelector(".lvp-spike");
    spikeHalo = overlay.querySelector(".lvp-spike-halo");
    armStops = [].slice.call(overlay.querySelectorAll("#lvp-arm stop"));
    armPoly.setAttribute("points", PIECES[2].map(function (q) { return q[0] + "," + q[1]; }).join(" "));

    var NS = "http://www.w3.org/2000/svg", i;
    var gShadow = overlay.querySelector(".lvp-shadow");
    var gSide = overlay.querySelector(".lvp-side");
    var gFace = overlay.querySelector(".lvp-face");
    var gHalo = overlay.querySelector(".lvp-halo");
    var gHalo2 = overlay.querySelector(".lvp-halo2");
    for (i = 0; i < 3; i++) {
      shadowGroups.push(gShadow.appendChild(document.createElementNS(NS, "polygon")));
      sideGroups.push(gSide.appendChild(document.createElementNS(NS, "polygon")));
      halo2Groups.push(gHalo2.appendChild(document.createElementNS(NS, "polygon")));
      haloGroups.push(gHalo.appendChild(document.createElementNS(NS, "polygon")));
      faceGroups.push(gFace.appendChild(document.createElementNS(NS, "polygon")));
    }
    // The ring's left and bottom points continue the N (same fill, same outline, one shape); they fade in as the logo locks.
    var EXT = [
      [[5.5, 22.27], [17.69, 22.27], [13.65, 24.6], [12.49, 29.13]],
      [[58.74, 113.55], [60.89, 115.15], [60.57, 116.99], [58.67, 119.9]]
    ];
    EXT.forEach(function (pp) {
      [gHalo2, gHalo, gFace].forEach(function (g) {
        var el = g.appendChild(document.createElementNS(NS, "polygon"));
        el.setAttribute("points", pts(pp));
        el.setAttribute("opacity", "0");
        extEls.push(el);
      });
    });
    document.body.appendChild(overlay);
    root.classList.add("lvp-active");
    root.classList.remove("lvp-pending");
    fit();
  }

  var G = 0;                       // glow strength
  function setGlow(g) { G = g; if (glowPath) glowPath.setAttribute("opacity", (Math.min(g, 1.1) * 0.16).toFixed(3)); }
  function setProgress(p) { countEl.textContent = ("00" + Math.round(clamp(p) * 100)).slice(-3); }

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
      var hop = (M.building ? 1 : clamp(M.grow[k] * 6)).toFixed(2);   // no outline on a bar that has not grown in yet
      haloGroups[k].setAttribute("opacity", hop);
      halo2Groups[k].setAttribute("opacity", hop);
      sideGroups[k].setAttribute("points", pts(shifted(poly, 1.9 * off, 2.3 * off)));
      shadowGroups[k].setAttribute("points", pts(shifted(poly, 5.5 * off, 7.5 * off)));
      // back of the slat is indigo, front is vanilla
      var front = Math.cos(M.phi[k]) >= 0;
      var want = front ? "url(#lvp-face)" : "url(#lvp-back)";
      if (faceGroups[k].__fill !== want) { faceGroups[k].setAttribute("fill", want); faceGroups[k].__fill = want; }
    }
    var eo = (M.building ? M.flat : 0).toFixed(3);
    for (var q = 0; q < extEls.length; q++) extEls[q].setAttribute("opacity", eo);
    markSvg.querySelector(".lvp-shadow").setAttribute("opacity", (0.2 * off).toFixed(3));
    markSvg.querySelector(".lvp-side").setAttribute("opacity", Math.min(1, off * 1.5).toFixed(3));
    ringMaskCircle.setAttribute("stroke-dashoffset", (358.1 * (1 - M.ring)).toFixed(2));
  }

  /* -------------------------------------------------------------------
     TIMELINE
     ------------------------------------------------------------------- */
  function outBack(t, c) { c = c || 1.4; var u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; }
  function buildEase(u) {                        // anticipation → travel → small overshoot → settle
    var A = 0.2;
    if (u < A) return -0.06 * Math.sin((Math.PI * u) / A);
    return outBack((u - A) / (1 - A), 1.05);
  }

  // 1 · INTRO — thin indigo line draws; the three bars appear from 0.3 s
  function phaseIntro() {
    overlay.classList.add("lvp--line");
    return tween(CFG.intro, function (t) {
      for (var i = 0; i < 3; i++) M.grow[i] = outBack(clamp((t - 0.37 - 0.07 * i) / 0.5), 1.1);
      M.raise = sstep(0.4, 0.95, t);
      setProgress(t * 0.18);
      drawMark();
    }).then(function () { M.grow = [1, 1, 1]; });
  }

  // 2 · TURN — the bars turn together (one full turn, ends facing front)
  function phaseTurn() {
    return tween(CFG.turn, function (t) {
      for (var i = 0; i < 3; i++) {
        var u = clamp((t - 0.07 * i) / (1 - 0.14)), e = inOutCubic(u);
        M.phi[i] = Math.PI * 2 * e;
        M.bob[i] = -2.0 * Math.sin(Math.PI * u) * (1 - 0.15 * i);
      }
      setProgress(0.18 + t * 0.34);
      drawMark();
    });
  }

  function waitForLoad() {
    if (document.readyState === "complete") return Promise.resolve();
    return new Promise(function (resolve) {
      window.addEventListener("load", function () { resolve(); }, { once: true });
      setTimeout(resolve, CFG.maxWaitForLoad);
    });
  }

  // 3 · BUILD — bars rotate and travel into the logo's strokes, then the ring draws on
  function phaseBuild() {
    for (var k = 0; k < 3; k++) {
      var rest = barCorners(k, 0, 0, 1);
      baseMorph[k] = pairs[k].fr.map(function (f) { return rectAt(rest, f); });
    }
    M.building = true;
    return tween(CFG.build, function (t) {
      for (var k = 0; k < 3; k++) { M.morph[k] = buildEase(clamp((t - 0.08 * k) / 0.8)); M.bob[k] = 0; }
      M.flat = sstep(0.62, 1, t);
      M.ring = inOutCubic(clamp((t - 0.34) / 0.66));
      setProgress(0.52 + t * 0.48);                       // reaches 100 when the logo is complete
      drawMark();
    }).then(function () { overlay.classList.add("lvp--solid"); });
  }

  // 4 · SWEEP — a thin light passes left → right while the top-right stroke fills indigo; glow peaks, then settles
  function mixHex(a, b, t) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
    var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return "rgb(" + pa.map(function (v, i) { return Math.round(lerp(v, pb[i], t)); }).join(",") + ")";
  }
  function setArm(p) {                           // p: 0 → ~1.3 (past 1 = settling)
    var f = function (x) { return clamp(lerp(0.1, 0.99, x), 0, 1); };
    var lead = clamp((p - 1) / 0.3);
    armStops[1].setAttribute("offset", f(p - 0.16).toFixed(3));
    armStops[2].setAttribute("offset", f(p).toFixed(3));
    armStops[2].setAttribute("stop-color", mixHex("#8a9bf2", "#263baa", lead));
    armStops[3].setAttribute("offset", f(p + 0.14).toFixed(3));
  }
  function phaseSweep() {
    sweepPath.setAttribute("opacity", "1");
    armPoly.setAttribute("opacity", "1");
    spikePoly.setAttribute("opacity", "1");
    setArm(0);
    return tween(CFG.sweep, function (t) {
      setArm(inOutCubic(t) * 1.3);
      spikeHalo.setAttribute("opacity", sstep(0.6, 1, t).toFixed(3));
      var c = lerp(-40, 165, inOutCubic(clamp(t / 0.85)));
      sweepGrad.setAttribute("x1", (c - 24).toFixed(1));
      sweepGrad.setAttribute("x2", (c + 24).toFixed(1));
      setGlow(t < 0.4 ? sstep(0, 0.4, t) * 0.9 : lerp(0.9, 0.5, sstep(0.4, 1, t)));
      drawAura(1, 1);
    }).then(function () {
      sweepPath.setAttribute("opacity", "0");
      // settle: the stroke itself becomes flat indigo; its crossing + tip stay above the ring
      faceGroups[2].setAttribute("fill", "#263BAA"); faceGroups[2].__fill = "#263BAA";
      armPoly.setAttribute("opacity", "0");
      spikePoly.setAttribute("fill", "#263BAA");
      spikePoly.setAttribute("stroke", "#263BAA"); spikePoly.setAttribute("stroke-width", "1.4"); spikePoly.setAttribute("stroke-linejoin", "round");
    });
  }

  function drawAura(scale, opacity) {
    aura.style.transform = "scale(" + scale.toFixed(3) + ")";
    aura.style.opacity = (G * opacity).toFixed(3);
  }

  // 5 · SETTLE — the glow eases down and everything stops on the finished logo
  function phaseSettle() {
    return tween(CFG.settle, function (t) { setGlow(lerp(0.5, 0.36, inOutCubic(t))); });
  }

  // 6 · REVEAL — the vanilla layer opens from the centre of the circle; the page appears inside it
  function phaseReveal() {
    root.classList.remove("lvp-hold");                      // the page behind the circle may start its own entrance now
    var veil = overlay.querySelector(".lvp__veil"), logoEl = overlay.querySelector(".lvp__logo");
    var W = ANCH.W, H = ANCH.H, cx = ANCH.x, cy = ANCH.y;
    var max = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) * 1.06;
    veil.style.setProperty("--soft", "2px");
    return tween(CFG.reveal, function (t) {
      veil.style.setProperty("--hole", (inOutCubic(t) * max).toFixed(1) + "px");
      logoEl.style.opacity = (1 - sstep(0, 0.22, t)).toFixed(3);          // the logo is gone as soon as the page starts to appear
      aura.style.opacity = (G * (1 - sstep(0, 0.22, t))).toFixed(3);
    });
  }

  /* -------------------------------------------------------------------
     RESIZE
     ------------------------------------------------------------------- */
  function onResize() { fit(); }
  function lock() {
    window.addEventListener("resize", onResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize);
  }

  /* -------------------------------------------------------------------
     lifecycle
     ------------------------------------------------------------------- */
  function release() { root.classList.remove("lvp-active", "lvp-pending", "lvp-hold"); }
  function finish() { dead = true; release(); if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }
  function abort() { dead = true; release(); if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }   // never trap the visitor

  function init() {
    try {
      build();
      for (var k = 0; k < 3; k++) pairs[k] = pairUp(PIECES[k], barCorners(k, 0, 0, 1));
      lock();
      drawMark(); drawAura(1, 1);
      setTimeout(function () { if (!dead) abort(); }, 30000 / Math.min(1, CFG.speed));      // failsafe

      phaseIntro()
        .then(function () { return dead ? null : phaseTurn(); })
        .then(function () { return dead ? null : waitForLoad(); })
        .then(function () { return dead ? null : phaseBuild(); })
        .then(function () { return dead ? null : phaseSweep(); })
        .then(function () { return dead ? null : phaseSettle(); })
        .then(function () { return dead ? null : phaseReveal(); })
        .then(function () { if (!dead) finish(); })
        .catch(function (e) { if (window.console) console.warn("[PageLoading] stopped:", e); abort(); });
    } catch (err) {
      if (window.console) console.warn("[PageLoading] disabled:", err);
      abort();
    }
  }

  window.PageLoading = { config: CFG, get done() { return dead; } };

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
