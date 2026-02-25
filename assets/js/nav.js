(() => {
  const btn = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav__list");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
})();
