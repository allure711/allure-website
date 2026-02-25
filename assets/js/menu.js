/* assets/js/menu.js */
(() => {
  // Helpers
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root = document) => root.querySelector(sel);

  const STORAGE_KEY = "allure_menu_state_v1";

  const defaultState = {
    activeDay: "monday",
    days: {} // dayName -> { tier, spirit, wbna }
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(defaultState),
        ...parsed,
        days: parsed.days || {}
      };
    } catch {
      return structuredClone(defaultState);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getDayState(state, day) {
    if (!state.days[day]) {
      state.days[day] = { tier: "shots", spirit: "vodka", wbna: "wine" };
    }
    return state.days[day];
  }

  // DOM
  const dayTabs   = $$(".daytab");
  const dayPanels = $$(".daypanel");

  if (!dayTabs.length || !dayPanels.length) return;

  let state = loadState();

  // If URL has #tuesday etc, use it
  const hashDay = (location.hash || "").replace("#", "").trim();
  if (hashDay) state.activeDay = hashDay;

  function setActiveDay(day) {
    state.activeDay = day;
    saveState(state);

    // Tabs UI
    dayTabs.forEach(btn => {
      const on = btn.dataset.day === day;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    // Panels UI
    dayPanels.forEach(panel => {
      panel.classList.toggle("active", panel.dataset.day === day);
    });

    // Restore this day's internal selections
    const panel = $(`.daypanel[data-day="${day}"]`);
    if (panel) applyDaySelections(panel, day);

    // Keep URL in sync (nice for sharing)
    if (location.hash !== `#${day}`) history.replaceState(null, "", `#${day}`);
  }

  function applyDaySelections(panel, day) {
    const ds = getDayState(state, day);

    // Tier chips (shots/drinks/cocktails)
    const tierChips = $$('[data-scope="tier"] .tierChip', panel);
    tierChips.forEach(c => c.classList.toggle("active", c.dataset.tier === ds.tier));

    // Spirit tabs (vodka/tequila/...)
    const spiritChips = $$('[data-scope="spiritTabs"] .spiritChip', panel);
    spiritChips.forEach(c => c.classList.toggle("active", c.dataset.spirit === ds.spirit));

    const spiritLists = $$("[data-spirit-list]", panel);
    spiritLists.forEach(list => list.classList.toggle("active", list.dataset.spiritList === ds.spirit));

    // Wine/Beer/NA
    const wbnaChips = $$('[data-scope="wbna"] .wbnaChip', panel);
    wbnaChips.forEach(c => c.classList.toggle("active", c.dataset.wbna === ds.wbna));

    const wbnaLists = $$("[data-wbna-list]", panel);
    wbnaLists.forEach(list => list.classList.toggle("active", list.dataset.wbnaList === ds.wbna));
  }

  // Day tab click
  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => setActiveDay(btn.dataset.day));
  });

  // Delegated click for chips inside panels (keeps things isolated per day)
  document.addEventListener("click", (e) => {
    const activeDay = state.activeDay;
    const panel = $(`.daypanel.active[data-day="${activeDay}"]`);
    if (!panel) return;

    const ds = getDayState(state, activeDay);

    // Tier
    const tierBtn = e.target.closest(".tierChip");
    if (tierBtn && panel.contains(tierBtn)) {
      ds.tier = tierBtn.dataset.tier;
      saveState(state);
      applyDaySelections(panel, activeDay);
      return;
    }

    // Spirit
    const spiritBtn = e.target.closest(".spiritChip");
    if (spiritBtn && panel.contains(spiritBtn)) {
      ds.spirit = spiritBtn.dataset.spirit;
      saveState(state);
      applyDaySelections(panel, activeDay);
      return;
    }

    // WBNA
    const wbnaBtn = e.target.closest(".wbnaChip");
    if (wbnaBtn && panel.contains(wbnaBtn)) {
      ds.wbna = wbnaBtn.dataset.wbna;
      saveState(state);
      applyDaySelections(panel, activeDay);
      return;
    }
  });

  // First paint
  setActiveDay(state.activeDay);
})();