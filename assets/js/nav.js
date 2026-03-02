(() => {
  const btn = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav__list");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();