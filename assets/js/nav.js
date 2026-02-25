/* ==========================
   MENU PAGE JS (CLEAN)
   - Mobile nav toggle
   - Day scroll offset
   - Tier buttons switch (shots/drinks/cocktails)
   - Spirit category buttons show ONLY their panel
   - Wine/Beer/NA selector panels
   - Hookah/Tower/Fishbowl selector panels
========================== */

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
    const dayBtn = e.target.closest(".dayTab");
    if (!dayBtn) return;

    const targetSel = dayBtn.dataset.target;
    const sec = document.querySelector(targetSel);
    if (!sec) return;

    document.querySelectorAll(".dayTab").forEach((b) => b.classList.remove("active"));
    dayBtn.classList.add("active");

    const y = sec.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  // Helpers
  const setActive = (buttons, activeBtn) => {
    buttons.forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
  };

  const showOnlyPanel = (wrap, panelAttr, key) => {
    const panels = wrap.querySelectorAll(`[${panelAttr}]`);
    panels.forEach((p) => {
      p.classList.toggle("hidden", p.getAttribute(panelAttr) !== key);
    });
  };

  // All menu interactions
  document.addEventListener("click", (e) => {
    // Tier card click scope
    const card = e.target.closest(".tierCard, .selectorCard");
    if (!card) return;

    // 1) Tier buttons ($5 shots / $10 drinks / $10 cocktails)
    const tierBtn = e.target.closest(".tierBtn");
    if (tierBtn && card.classList.contains("tierCard")) {
      const tierButtons = card.querySelectorAll(".tierBtn");
      setActive(tierButtons, tierBtn);

      const tier = tierBtn.dataset.tier;
      const price = tierBtn.dataset.price;

      // toggle wraps
      const spiritsWrap = card.querySelector('[data-tier-wrap="spirits"]');
      const cocktailsWrap = card.querySelector('[data-tier-wrap="cocktails"]');

      if (tier === "cocktails") {
        if (spiritsWrap) spiritsWrap.classList.add("hidden");
        if (cocktailsWrap) cocktailsWrap.classList.remove("hidden");
      } else {
        if (cocktailsWrap) cocktailsWrap.classList.add("hidden");
        if (spiritsWrap) spiritsWrap.classList.remove("hidden");

        // update displayed prices in this card
        card.querySelectorAll(".jsPrice").forEach((el) => {
          el.textContent = `$${price}`;
        });
      }
      return;
    }

    // 2) Spirit category buttons (Vodka/Tequila/...)
    const spiritBtn = e.target.closest(".spiritBtn");
    if (spiritBtn && card.classList.contains("tierCard")) {
      const wrap = card.querySelector('[data-tier-wrap="spirits"]');
      if (!wrap) return;

      const buttons = wrap.querySelectorAll(".spiritBtn");
      setActive(buttons, spiritBtn);

      const key = spiritBtn.dataset.spirit;
      showOnlyPanel(wrap, "data-panel", key);
      return;
    }

    // 3) Selector cards (Wine/Beer/NA) and (Hookah/Refill/Tower/Fishbowl)
    const selectBtn = e.target.closest(".selectBtn");
    if (selectBtn && card.classList.contains("selectorCard")) {
      const key = selectBtn.dataset.select;

      const buttons = card.querySelectorAll(".selectBtn");
      setActive(buttons, selectBtn);

      showOnlyPanel(card, "data-select-panel", key);
      return;
    }
  });
})();