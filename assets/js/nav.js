(() => {
  // ============ MOBILE NAV ============
  const btn = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__list");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  // Helper: activate one button in a group inside a specific card
  function activateWithin(card, selector, activeBtn) {
    card.querySelectorAll(selector).forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  // Helper: show one matching panel (hide rest)
  function showOnly(card, panelSelector, attr, value) {
    card.querySelectorAll(panelSelector).forEach(p => {
      p.classList.toggle("hidden", p.getAttribute(attr) !== value);
    });
  }

  // ============ BASIC TIER CARDS (can be multiple: Monday, Sunday, etc.) ============
  document.querySelectorAll('[data-card="tier-basic"]').forEach((card) => {
    const spiritTabs = card.querySelector(".jsSpiritTabs");
    const cocktailsPanel = card.querySelector(".jsCocktails");

    function setTier(tier) {
      // cocktails
      if (tier === "cocktails") {
        spiritTabs?.classList.add("hidden");
        cocktailsPanel?.classList.remove("hidden");
        card.querySelectorAll(".jsSpiritPanel").forEach(p => p.classList.add("hidden"));
        return;
      }

      // spirits
      cocktailsPanel?.classList.add("hidden");
      spiritTabs?.classList.remove("hidden");

      const priceText = tier === "10" ? "$10" : "$5";
      card.querySelectorAll(".jsPrice").forEach(el => (el.textContent = priceText));

      const activeSpirit = card.querySelector(".jsSpiritBtn.active")?.dataset.spirit || "vodka";
      showOnly(card, ".jsSpiritPanel", "data-panel", activeSpirit);
    }

    // click handler
    card.addEventListener("click", (e) => {
      const tierBtn = e.target.closest(".jsTierBtn");
      const spiritBtn = e.target.closest(".jsSpiritBtn");

      if (tierBtn) {
        activateWithin(card, ".jsTierBtn", tierBtn);
        setTier(tierBtn.dataset.tier);
        return;
      }

      if (spiritBtn) {
        activateWithin(card, ".jsSpiritBtn", spiritBtn);
        // ensure we are in spirits mode when clicking spirits
        cocktailsPanel?.classList.add("hidden");
        spiritTabs?.classList.remove("hidden");
        showOnly(card, ".jsSpiritPanel", "data-panel", spiritBtn.dataset.spirit);
        return;
      }
    });

    // init
    setTier(card.querySelector(".jsTierBtn.active")?.dataset.tier || "5");
  });

  // ============ WINE/BEER CARDS (multiple allowed) ============
  document.querySelectorAll('[data-card="wineBeer"]').forEach((card) => {
    card.addEventListener("click", (e) => {
      const wbBtn = e.target.closest(".jsWBBtn");
      if (!wbBtn) return;
      activateWithin(card, ".jsWBBtn", wbBtn);
      showOnly(card, ".jsWBPanel", "data-wbpanel", wbBtn.dataset.wb);
    });

    // init
    const initVal = card.querySelector(".jsWBBtn.active")?.dataset.wb || "wine";
    showOnly(card, ".jsWBPanel", "data-wbpanel", initVal);
  });

  // ============ TOP SHELF CARDS (multiple allowed) ============
  document.querySelectorAll('[data-card="tier-top"]').forEach((card) => {
    function setTopTier(tier) {
      const priceText = tier === "14" ? "$14" : "$7";
      card.querySelectorAll(".jsTopPrice").forEach(el => (el.textContent = priceText));

      const activeSpirit = card.querySelector(".jsTopSpiritBtn.active")?.dataset.spirit || "tequila";
      showOnly(card, ".jsTopPanel", "data-panel", activeSpirit);
    }

    card.addEventListener("click", (e) => {
      const tierBtn = e.target.closest(".jsTopTierBtn");
      const spiritBtn = e.target.closest(".jsTopSpiritBtn");

      if (tierBtn) {
        activateWithin(card, ".jsTopTierBtn", tierBtn);
        setTopTier(tierBtn.dataset.tier);
        return;
      }

      if (spiritBtn) {
        activateWithin(card, ".jsTopSpiritBtn", spiritBtn);
        showOnly(card, ".jsTopPanel", "data-panel", spiritBtn.dataset.spirit);
        return;
      }
    });

    // init
    setTopTier(card.querySelector(".jsTopTierBtn.active")?.dataset.tier || "7");
  });
})();