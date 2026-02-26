(() => {
  const btn = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav__list");
  if (!btn || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
})();
(function () {
  const toggle = document.querySelector(".navToggle");
  const nav = document.querySelector(".navList");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
