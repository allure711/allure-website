/* =========================================================
   ALLURE MENU — Menu JS
   File: assets/js/menu.js
========================================================= */

(function () {
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const panels = Array.from(document.querySelectorAll(".daypanel"));

  function setActiveDay(day) {
    dayTabs.forEach(btn => btn.classList.toggle("active", btn.dataset.day === day));
    panels.forEach(p => p.classList.toggle("active", p.dataset.dayPanel === day));
    // close accordions when switching days (clean UX)
    panels.forEach(p => closeAllAccordions(p));
  }

  function closeAllAccordions(scope) {
    const cards = scope.querySelectorAll(".menuCard");
    cards.forEach(card => {
      card.classList.remove("open");
      // close sub accordions too
      const subs = card.querySelectorAll(".accordionSub");
      subs.forEach(s => s.classList.remove("subOpen"));
      // reset arrow text
      const mainArrow = card.querySelector(".accordionMain .arrow");
      if (mainArrow) mainArrow.textContent = "+";
      subs.forEach(s => {
        const a = s.querySelector(".arrow");
        if (a) a.textContent = "+";
      });
    });
  }

  // Day switching
  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => setActiveDay(btn.dataset.day));
  });

  // Main accordion per card
  document.addEventListener("click", (e) => {
    const main = e.target.closest(".accordionMain");
    if (!main) return;

    const card = main.closest(".menuCard");
    if (!card) return;

    // toggle this card only
    card.classList.toggle("open");

    const arrow = main.querySelector(".arrow");
    if (arrow) arrow.textContent = card.classList.contains("open") ? "−" : "+";
  });

  // Sub accordion sections
  document.addEventListener("click", (e) => {
    const sub = e.target.closest(".accordionSub");
    if (!sub) return;

    const card = sub.closest(".menuCard");
    if (!card) return;

    sub.classList.toggle("subOpen");
    const a = sub.querySelector(".arrow");
    if (a) a.textContent = sub.classList.contains("subOpen") ? "−" : "+";
  });

  // default day
  setActiveDay("monday");
})();