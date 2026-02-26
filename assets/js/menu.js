(() => {
  // Helpers
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // State per day (so Tuesday choices don't affect Wednesday)
  const dayState = new Map();

  // Elements
  const dayTabs = $$(".daytab");
  const dayPanels = $$(".daypanel");

  if (!dayTabs.length || !dayPanels.length) return;

  // ---- Panel utilities ----
  function setActive(list, activeEl, cls = "active") {
    list.forEach(el => el.classList.remove(cls));
    if (activeEl) activeEl.classList.add(cls);
  }

  function getDayPanel(day) {
    return dayPanels.find(p => p.dataset.day === day);
  }

  // Save the current UI state of a day panel
  function capturePanelState(day, panel) {
    const tier = panel.querySelector(".tierChip.active")?.dataset.tier || null;
    const spirit = panel.querySelector(".spiritChip.active")?.dataset.spirit || null;
    const wbna = panel.querySelector(".wbnaChip.active")?.dataset.wbna || null;

    dayState.set(day, { tier, spirit, wbna });
  }

  // Restore UI state of a day panel
  function restorePanelState(day, panel) {
    const st = dayState.get(day);

    // If we've never visited this day yet, keep whatever your HTML default says
    if (!st) return;

    // Restore tier
    if (st.tier) {
      const tierBtns = $$(".tierChip", panel);
      const match = tierBtns.find(b => b.dataset.tier === st.tier);
      if (match) setActive(tierBtns, match);
    }

    // Restore spirit tabs + lists
    if (st.spirit) {
      const spiritBtns = $$(".spiritChip", panel);
      const spiritLists = $$("[data-spirit-list]", panel);

      const btnMatch = spiritBtns.find(b => b.dataset.spirit === st.spirit);
      if (btnMatch) setActive(spiritBtns, btnMatch);

      const listMatch = spiritLists.find(l => l.dataset.spiritList === st.spirit);
      if (listMatch) setActive(spiritLists, listMatch);
    }

    // Restore wine/beer/na
    if (st.wbna) {
      const wbnaBtns = $$(".wbnaChip", panel);
      const wbnaLists = $$("[data-wbna-list]", panel);

      const btnMatch = wbnaBtns.find(b => b.dataset.wbna === st.wbna);
      if (btnMatch) setActive(wbnaBtns, btnMatch);

      const listMatch = wbnaLists.find(l => l.dataset.wbnaList === st.wbna);
      if (listMatch) setActive(wbnaLists, listMatch);
    }
  }

  // Switch day panels (ONLY one visible)
  function activateDay(day) {
    // Save current active day state before switching
    const currentTab = dayTabs.find(t => t.classList.contains("active"));
    const currentDay = currentTab?.dataset.day;
    if (currentDay) {
      const currentPanel = getDayPanel(currentDay);
      if (currentPanel) capturePanelState(currentDay, currentPanel);
    }

    // Activate tab
    setActive(dayTabs, dayTabs.find(t => t.dataset.day === day));
    dayTabs.forEach(t => t.setAttribute("aria-selected", t.classList.contains("active") ? "true" : "false"));

    // Activate panel
    setActive(dayPanels, getDayPanel(day));

    // Restore that day’s own choices (so no carry-over)
    const panel = getDayPanel(day);
    if (panel) restorePanelState(day, panel);

    // Update URL hash without jumping
    history.replaceState(null, "", `#${day}`);
  }

  // ---- Click handlers ----
  dayTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const day = tab.dataset.day;
      if (!day) return;
      activateDay(day);
    });
  });

  // Delegate clicks inside panels (spirit tabs + wbna tabs + tier tabs)
  document.addEventListener("click", (e) => {
    const tierBtn = e.target.closest(".tierChip");
    const spiritBtn = e.target.closest(".spiritChip");
    const wbnaBtn = e.target.closest(".wbnaChip");

    if (!tierBtn && !spiritBtn && !wbnaBtn) return;

    // Find the panel we're inside
    const panel = e.target.closest(".daypanel");
    if (!panel) return;

    const day = panel.dataset.day;
    if (!day) return;

    // Tier buttons
    if (tierBtn) {
      const tierBtns = $$(".tierChip", panel);
      setActive(tierBtns, tierBtn);
      capturePanelState(day, panel);
      return;
    }

    // Spirit buttons -> also switch spirit list
    if (spiritBtn) {
      const spirit = spiritBtn.dataset.spirit;

      const spiritBtns = $$(".spiritChip", panel);
      const spiritLists = $$("[data-spirit-list]", panel);

      setActive(spiritBtns, spiritBtn);

      const list = spiritLists.find(l => l.dataset.spiritList === spirit);
      if (list) setActive(spiritLists, list);

      capturePanelState(day, panel);
      return;
    }

    // Wine/Beer/NA buttons -> also switch wbna list
    if (wbnaBtn) {
      const wbna = wbnaBtn.dataset.wbna;

      const wbnaBtns = $$(".wbnaChip", panel);
      const wbnaLists = $$("[data-wbna-list]", panel);

      setActive(wbnaBtns, wbnaBtn);

      const list = wbnaLists.find(l => l.dataset.wbnaList === wbna);
      if (list) setActive(wbnaLists, list);

      capturePanelState(day, panel);
      return;
    }
  });

  // ---- Initial load ----
  // If URL has #tuesday etc, open that day
  const hashDay = (location.hash || "").replace("#", "").trim();
  const initialDay =
    hashDay && getDayPanel(hashDay) ? hashDay :
    dayTabs.find(t => t.classList.contains("active"))?.dataset.day ||
    dayTabs[0].dataset.day;

  activateDay(initialDay);
})();