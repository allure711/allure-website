/* =========================
   MENU PAGE JS (CLEAN)
   - Mobile nav toggle
   - Day scroll offset
   - Tier buttons open their panels
   - Spirit buttons show ONLY their panel
   - Wine/Beer fixed (lists hidden until click)
========================= */

(() => {
  // Mobile nav
  const btn = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__list");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  // Day scroll with header offset
  const header = document.querySelector(".header");
  const getOffset = () => (header ? header.offsetHeight + 18 : 140);

  document.addEventListener("click", (e) => {
    const dayBtn = e.target.closest(".dayBtn");
    if (!dayBtn) return;

    const sel = dayBtn.getAttribute("data-target");
    const sec = document.querySelector(sel);
    if (!sec) return;

    const y = sec.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({ top: y, behavior: "smooth" });

    document.querySelectorAll(".dayBtn").forEach((b) => b.classList.remove("active"));
    dayBtn.classList.add("active");
  });

  // Tier system: open ONLY tier panel inside the clicked card
  document.addEventListener("click", (e) => {
    const tierBtn = e.target.closest(".tierBtn");
    if (!tierBtn) return;

    const card = tierBtn.closest(".menuCard");
    if (!card) return;

    const tier = tierBtn.dataset.tier;

    // Highlight tier buttons only in this card
    card.querySelectorAll(".tierBtn").forEach((b) => b.classList.toggle("active", b === tierBtn));

    // Show only the selected tier panel
    card.querySelectorAll(".tierPanel").forEach((p) => {
      p.classList.toggle("hidden", p.dataset.panel !== tier);
    });

    // Reset spirit panels when tier changes
    card.querySelectorAll(".spiritBtn").forEach((b) => b.classList.remove("active"));
    card.querySelectorAll(".spiritPanel").forEach((p) => p.classList.add("hidden"));
  });

  // Spirit system: inside currently visible tierPanel, show ONLY that spirit list
  document.addEventListener("click", (e) => {
    const spiritBtn = e.target.closest(".spiritBtn");
    if (!spiritBtn) return;

    const card = spiritBtn.closest(".menuCard");
    if (!card) return;

    // find active tier panel in this card
    const activeTierPanel = Array.from(card.querySelectorAll(".tierPanel")).find(
      (p) => !p.classList.contains("hidden")
    );
    if (!activeTierPanel) return;

    const spirit = spiritBtn.dataset.spirit;

    // highlight only in this active tier panel
    activeTierPanel.querySelectorAll(".spiritBtn").forEach((b) => b.classList.toggle("active", b === spiritBtn));

    // hide all spirit panels in this active panel, show selected
    activeTierPanel.querySelectorAll(".spiritPanel").forEach((p) => {
      p.classList.toggle("hidden", p.dataset.spiritPanel !== spirit);
    });
  });

  // Default open Non-Alcoholic in Wine/Beer card (optional)
  const wineCard = document.querySelector(".wineBeerCard");
  if (wineCard) {
    const defaultBtn = wineCard.querySelector('.tierBtn[data-tier="na"]');
    if (defaultBtn) defaultBtn.click();
  }
})();