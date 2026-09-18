/* ============================================================
   Café Solace — interactions
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- image slots: try to load /assets/<key>.jpg, else keep labelled fallback ---------- */
  const LABELS = {
    hero: "Hero — café interior",
    "interior-1": "Interior · seating",
    "interior-2": "Interior · ceiling",
    exterior: "Exterior · facade",
    "italian-pizza": "Italian Pizza",
    "cold-coffee": "Cold Coffee w/ Icecream",
    "chilli-potato": "Honey Chilly Potato",
  };
  document.querySelectorAll("[data-img]").forEach((el) => {
    const key = el.getAttribute("data-img");
    el.setAttribute("data-label", LABELS[key] || key);
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url(assets/${key}.jpg)`;
      el.classList.add("has-photo");
    };
    img.src = `assets/${key}.jpg`;
  });

  /* ---------- reveal system (works with or without GSAP) ---------- */
  let io;
  function hookReveals(nodes) {
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- build the menu ---------- */
  const grid = document.getElementById("menuGrid");
  const filters = document.getElementById("menuFilters");
  const data = window.CAFE_MENU || [];

  function renderCols(list) {
    grid.innerHTML = list
      .map(
        (c) => `
      <div class="menucol reveal" data-cat="${c.cat}">
        <h3 class="menucol__title">${c.cat}</h3>
        ${c.items
          .map(
            (it) => `<div class="menurow">
              <span class="menurow__name">${it[0]}</span>
              <span class="menurow__dots"></span>
              <span class="menurow__price">${it[1]}</span>
            </div>`
          )
          .join("")}
      </div>`
      )
      .join("");
    hookReveals(grid.querySelectorAll(".reveal"));
  }

  const cats = ["All", ...data.map((c) => c.cat)];
  filters.innerHTML = cats
    .map((c, i) => `<button class="${i === 0 ? "active" : ""}" data-f="${c}">${c}</button>`)
    .join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filters.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const f = b.dataset.f;
    renderCols(f === "All" ? data : data.filter((c) => c.cat === f));
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  renderCols(data);

  hookReveals(document.querySelectorAll(".reveal"));

  /* ---------- animated counters ---------- */
  function runCount(el) {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || "0", 10);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * eased).toFixed(dec) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          reduce
            ? (en.target.textContent =
                parseFloat(en.target.dataset.to).toFixed(en.target.dataset.dec || 0) +
                (en.target.dataset.suffix || ""))
            : runCount(en.target);
          countIO.unobserve(en.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".count").forEach((c) => countIO.observe(c));

  /* ---------- nav solidify ---------- */
  const nav = document.getElementById("nav");
  const hero = document.getElementById("hero");
  new IntersectionObserver(
    ([e]) => nav.classList.toggle("solid", !e.isIntersecting),
    { rootMargin: "-70px 0px 0px 0px" }
  ).observe(hero);

  /* ---------- loader ---------- */
  const loader = document.getElementById("loader");
  const num = document.getElementById("loaderNum");
  const bar = document.getElementById("loaderBar");
  let n = 0;
  const li = setInterval(() => {
    n += Math.random() * 12 + 4;
    if (n >= 100) {
      n = 100;
      clearInterval(li);
      setTimeout(finish, 350);
    }
    num.textContent = Math.floor(n);
    bar.style.width = n + "%";
  }, 90);

  function finish() {
    loader.classList.add("done");
    document.body.style.overflow = "";
    startHero();
  }
  document.body.style.overflow = "hidden";

  /* ---------- hero entrance + smooth scroll + parallax (GSAP) ---------- */
  function startHero() {
    const lines = document.querySelectorAll(".hero__title .line span");
    if (reduce || !window.gsap) {
      lines.forEach((l) => (l.style.transform = "none"));
      document.querySelectorAll("#hero .reveal").forEach((r) => r.classList.add("is-in"));
      return;
    }
    gsap.set(lines, { yPercent: 115 });
    const tl = gsap.timeline();
    tl.to(lines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 })
      .add(() => document.querySelectorAll("#hero .reveal").forEach((r) => r.classList.add("is-in")), "-=0.6");

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".hero__bg", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__inner", {
        yPercent: -12,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  }

  /* ---------- Lenis smooth scroll ---------- */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    // anchor links through Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const t = document.querySelector(id);
          if (t) {
            e.preventDefault();
            lenis.scrollTo(t, { offset: -60 });
          }
        }
      });
    });
  }
})();
