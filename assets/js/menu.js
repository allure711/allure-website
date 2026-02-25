/* assets/js/menu.js
   Menu logic (day tabs + scoped toggles)
   Fix: keep state inside each daypanel (no bleed between days)
*/

(() => {
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  if (!dayTabs.length || !dayPanels.length) return;

  const panelByDay = new Map(dayPanels.map(p => [p.dataset.day, p]));

  // --- helpers
  const setActive = (els, activeEl) => {
    els.forEach(el => el.classList.toggle("active", el === activeEl));
  };

  const showOnly = (panels, activePanel) => {
    panels.forEach(p => p.classList.toggle("active", p === activePanel));
  };

  // Initialize defaults *inside each panel* so each day has its own state.
  const initPanelDefaults = (panel) => {
    // Tier chips inside THIS panel only
    const tierChips = panel.querySelectorAll("[data-tier]");
    if (tierChips.length && !panel.querySelector("[data-tier].active")) {
      tierChips[0].classList.add("active");
    }

    // Spirit chips inside THIS panel only
    const spiritChips = panel.querySelectorAll(".spiritChip[data-spirit]");
    const spiritLists = panel.querySelectorAll(".spiritList[data-spirit-list]");
    if (spiritChips.length && spiritLists.length) {
      const activeSpirit = panel.querySelector(".spiritChip.active") || spiritChips[0];
      activeSpirit.classList.add("active");
      const spiritKey = activeSpirit.dataset.spirit;
      spiritLists.forEach(list => {
        list.classList.toggle("active", list.dataset.spiritList === spiritKey);
      });
    }

    // Wine/Beer/NA inside THIS panel only
    const wbnaChips = panel.querySelectorAll(".wbnaChip[data-wbna]");
    const wbnaLists = panel.querySelectorAll(".wbnaList[data-wbna-list]");
    if (wbnaChips.length && wbnaLists.length) {
      const activeWbna = panel.querySelector(".wbnaChip.active") || wbnaChips[0];
      activeWbna.classList.add("active");
      const wbnaKey = activeWbna.dataset.wbna;
      wbnaLists.forEach(list => {
        list.classList.toggle("active", list.dataset.wbnaList === wbnaKey);
      });
    }
  };

  // Run defaults on all panels once
  dayPanels.forEach(initPanelDefaults);

  // --- Day switching (NO STATE BLEED)
  const activateDay = (day) => {
    const panel = panelByDay.get(day);
    if (!panel) return;

    dayTabs.forEach(btn => {
      const isActive = btn.dataset.day === day;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    showOnly(dayPanels, panel);

    // Ensure this panel is internally consistent
    initPanelDefaults(panel);

    // Optional: update URL hash without jumping
    const newHash = `#${day}`;
    if (location.hash !== newHash) history.replaceState(null, "", newHash);
  };

  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => activateDay(btn.dataset.day));
  });

  // --- Click handling inside panels ONLY (event delegation)
  dayPanels.forEach(panel => {
    panel.addEventListener("click", (e) => {
      const tierBtn = e.target.closest("[data-tier]");
      if (tierBtn && panel.contains(tierBtn)) {
        const row = tierBtn.closest(".tierRow");
        if (!row) return;
        const btns = Array.from(row.querySelectorAll("[data-tier]"));
        setActive(btns, tierBtn);
        return;
      }

      const spiritBtn = e.target.closest(".spiritChip[data-spirit]");
      if (spiritBtn && panel.contains(spiritBtn)) {
        const allSpiritBtns = Array.from(panel.querySelectorAll(".spiritChip[data-spirit]"));
        setActive(allSpiritBtns, spiritBtn);

        const key = spiritBtn.dataset.spirit;
        const lists = Array.from(panel.querySelectorAll(".spiritList[data-spirit-list]"));
        lists.forEach(list => list.classList.toggle("active", list.dataset.spiritList === key));
        return;
      }

      const wbnaBtn = e.target.closest(".wbnaChip[data-wbna]");
      if (wbnaBtn && panel.contains(wbnaBtn)) {
        const allWbnaBtns = Array.from(panel.querySelectorAll(".wbnaChip[data-wbna]"));
        setActive(allWbnaBtns, wbnaBtn);

        const key = wbnaBtn.dataset.wbna;
        const lists = Array.from(panel.querySelectorAll(".wbnaList[data-wbna-list]"));
        lists.forEach(list => list.classList.toggle("active", list.dataset.wbnaList === key));
        return;
      }
    });
  });

  // --- Initial day on load (hash wins, else current .active, else monday)
  const hashDay = (location.hash || "").replace("#", "").trim();
  const initial =
    (hashDay && panelByDay.has(hashDay) && hashDay) ||
    (document.querySelector(".daytab.active")?.dataset.day) ||
    "monday";

  activateDay(initial);
})();