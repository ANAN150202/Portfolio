/* =========================
   Arafat Portfolio - script.js
   - Mobile nav toggle
   - Theme toggle (with localStorage)
   - Scroll progress bar
   - Reveal on scroll
   - Project filters
   - Footer year
   - Demo contact button
   ========================= */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Scroll progress
  const progress = $("#progress");
  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ---- Theme toggle (default: dark)
  const themeBtn = $("#themeBtn");
  const iconEl = $(".theme__icon");
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (iconEl) iconEl.textContent = theme === "light" ? "☀" : "☾";
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  } else {
    // Keep default (dark) unless user prefers light
    const prefersLight = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---- Mobile nav toggle
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const closeMenu = () => {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close menu when clicking a link
    $$(".nav__link", navLinks).forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("is-open")) return;
      const clickedInside = navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ---- Reveal on scroll
  const reveals = $$(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ---- Project filters
  const filterButtons = $$(".filter");
  const projectCards = $$(".project");
  const setActiveFilter = (btn) => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  };

  const applyFilter = (tag) => {
    projectCards.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
      const show = tag === "all" || tags.includes(tag);
      card.classList.toggle("is-hidden", !show);
    });
  };

  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.getAttribute("data-filter") || "all";
        setActiveFilter(btn);
        applyFilter(tag);
      });
    });
  }

  // ---- Demo contact button
  const fakeSendBtn = $("#fakeSendBtn");
  const fakeSendMsg = $("#fakeSendMsg");
  if (fakeSendBtn && fakeSendMsg) {
    fakeSendBtn.addEventListener("click", () => {
      fakeSendMsg.textContent =
        "Demo only: Please use the Email button to contact me.";
      fakeSendMsg.style.opacity = "1";
      setTimeout(() => (fakeSendMsg.style.opacity = "0.9"), 800);
    });
  }
})();
