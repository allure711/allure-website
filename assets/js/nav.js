(() => {
  const btn = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__list');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();
