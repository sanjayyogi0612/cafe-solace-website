/* ============================================================
   Café Solace — scroll-scrubbed image sequence (canvas)
   Same technique as the reference site: frames extracted from a
   short video are painted onto a pinned <canvas>, one frame per
   scroll step. Drop frames into /frames as frame_0001.jpg …
   and set FRAME_COUNT below (or leave auto-detect on).

   The section stays hidden (no broken UI) until frame_0001 loads.
   ============================================================ */
(function () {
  "use strict";

  // ---- CONFIG (updated automatically when frames are added) ----
  const CONFIG = {
    dir: "frames/",
    prefix: "frame_",
    ext: ".jpg",
    pad: 4,          // frame_0001 -> pad 4
    count: 0,        // 0 = auto-detect by probing; set exact number for speed
    scrollLength: 300, // % of viewport height the pin lasts (longer = slower scrub)
  };

  const section = document.getElementById("scrub");
  if (!section) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = (n) => String(n).padStart(CONFIG.pad, "0");
  const url = (n) => `${CONFIG.dir}${CONFIG.prefix}${pad(n)}${CONFIG.ext}`;

  function load(n) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = url(n);
    });
  }

  // Probe: does frame 1 exist? If not, leave the section hidden.
  load(1).then(async (first) => {
    if (!first) return; // no frames yet — keep the section hidden, site stays clean

    // Determine frame count (exponential probe then binary search) unless configured.
    let count = CONFIG.count;
    if (!count) {
      let hi = 1;
      while (await load(hi * 2)) hi *= 2;
      let lo = hi;
      hi = hi * 2;
      while (lo + 1 < hi) {
        const mid = (lo + hi) >> 1;
        if (await load(mid)) lo = mid;
        else hi = mid;
      }
      count = lo;
    }
    if (count < 2) return;

    section.hidden = false;
    section.querySelector(".scrub__spacer").style.height = CONFIG.scrollLength + "vh";

    const canvas = document.getElementById("scrubCanvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const frames = new Array(count + 1).fill(null);
    frames[1] = first;

    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // draw covering the canvas (object-fit: cover)
    function draw(img) {
      if (!img) return;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      const r = Math.max(cw / img.width, ch / img.height);
      const w = img.width * r, h = img.height * r;
      ctx.fillStyle = "#16212e";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    fit();
    draw(first);

    // Preload the rest (in order) so scrubbing is smooth.
    (async () => {
      for (let i = 2; i <= count; i++) {
        frames[i] = await load(i);
      }
    })();

    let current = 1;
    function show(i) {
      i = Math.max(1, Math.min(count, Math.round(i)));
      if (i === current && frames[i]) return;
      current = i;
      draw(frames[i] || frames[nearest(i)]);
    }
    function nearest(i) {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return 1;
    }

    window.addEventListener("resize", () => {
      fit();
      draw(frames[current] || first);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });

    if (reduce || !window.gsap || !window.ScrollTrigger) {
      // Reduced motion / no GSAP: just show the last frame, no pin.
      show(count);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const state = { f: 1 };
    gsap.to(state, {
      f: count,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: ".scrub__sticky",
        pinSpacing: false,
        onUpdate: () => show(state.f),
      },
    });

    // Caption fades out over the first third of the scrub.
    const cap = section.querySelector(".scrub__caption");
    gsap.fromTo(
      cap,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        scrollTrigger: { trigger: section, start: "top 70%", end: "top 20%", scrub: true },
      }
    );
    gsap.to(cap, {
      autoAlpha: 0,
      scrollTrigger: { trigger: section, start: "center center", end: "bottom bottom", scrub: true },
    });
  });
})();
