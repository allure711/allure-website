(() => {
  const btn = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__list');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();
// Fade-in on scroll (IntersectionObserver)
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
});
