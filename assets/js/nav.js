/* assets/js/menu.js
   Controls:
   - Day tabs (Monday–Sunday)
   - Spirits tabs (Vodka/Tequila/etc) per day panel
   - Wine/Beer/NA tabs per day panel
   - Keeps selections per-day (remembers what you last opened on each day)
*/

(() => {
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- DAY TABS ----------
  const dayTabs = $$(".daytab");
  const dayPanels = $$(".daypanel");

  if (!dayTabs.length || !dayPanels.length) return;

  const stateByDay = {}; // remembers tier/spirit/wbna per day

  function getDayPanel(day) {
    return dayPanels.find(p => p.dataset.day === day);
  }

  function setActiveDay(day) {
    // activate tab
    dayTabs.forEach(t => {
      const on = t.dataset.day === day;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    // activate panel
    dayPanels.forEach(p => p.classList.toggle("active", p.dataset.day === day));

    // restore per-day saved state (if any)
    const panel = getDayPanel(day);
    if (!panel) return;

    const saved = stateByDay[day];
    if (saved) {
      if (saved.spirit) activateSpirit(panel, saved.spirit);
      if (saved.wbna) activateWBNA(panel, saved.wbna);
      if (saved.tier) activateTier(panel, saved.tier);
    } else {
      // ensure defaults exist
      initPanelDefaults(panel, day);
    }
  }

  // ---------- HELPERS: activate within a panel ----------
  function activateTier(panel, tier) {
    const chips = $$(".tierChip", panel);
    if (!chips.length) return;

    chips.forEach(c => c.classList.toggle("active", c.dataset.tier === tier));

    // Optional: if you later create tier-based lists, you can toggle them here.
  }

  function activateSpirit(panel, spirit) {
    const chips = $$(".spiritChip", panel);
    const lists = $$(".spiritList", panel);
    if (!chips.length || !lists.length) return;

    chips.forEach(c => c.classList.toggle("active", c.dataset.spirit === spirit));
    lists.forEach(l => l.classList.toggle("active", l.dataset.spiritList === spirit));
  }

  function activateWBNA(panel, wbna) {
    const chips = $$(".wbnaChip", panel);
    const lists = $$(".wbnaList", panel);
    if (!chips.length || !lists.length) return;

    chips.forEach(c => c.classList.toggle("active", c.dataset.wbna === wbna));
    lists.forEach(l => l.classList.toggle("active", l.dataset.wbnaList === wbna));
  }

  function initPanelDefaults(panel, day) {
    // Day default spirit
    const defaultSpiritChip = panel.querySelector(".spiritChip.active") || panel.querySelector(".spiritChip");
    if (defaultSpiritChip) activateSpirit(panel, defaultSpiritChip.dataset.spirit);

    // Day default WBNA
    const defaultWbnaChip = panel.querySelector(".wbnaChip.active") || panel.querySelector(".wbnaChip");
    if (defaultWbnaChip) activateWBNA(panel, defaultWbnaChip.dataset.wbna);

    // Day default tier
    const defaultTierChip = panel.querySelector(".tierChip.active") || panel.querySelector(".tierChip");
    if (defaultTierChip) activateTier(panel, defaultTierChip.dataset.tier);

    stateByDay[day] = {
      spirit: defaultSpiritChip ? defaultSpiritChip.dataset.spirit : null,
      wbna: defaultWbnaChip ? defaultWbnaChip.dataset.wbna : null,
      tier: defaultTierChip ? defaultTierChip.dataset.tier : null
    };
  }

  // ---------- WIRE UP PANEL INTERACTIONS ----------
  function bindPanel(panel) {
    const day = panel.dataset.day;

    // Tier chips
    $$(".tierChip", panel).forEach(chip => {
      chip.addEventListener("click", () => {
        activateTier(panel, chip.dataset.tier);
        stateByDay[day] = stateByDay[day] || {};
        stateByDay[day].tier = chip.dataset.tier;
      });
    });

    // Spirit chips
    $$(".spiritChip", panel).forEach(chip => {
      chip.addEventListener("click", () => {
        activateSpirit(panel, chip.dataset.spirit);
        stateByDay[day] = stateByDay[day] || {};
        stateByDay[day].spirit = chip.dataset.spirit;
      });
    });

    // WBNA chips
    $$(".wbnaChip", panel).forEach(chip => {
      chip.addEventListener("click", () => {
        activateWBNA(panel, chip.dataset.wbna);
        stateByDay[day] = stateByDay[day] || {};
        stateByDay[day].wbna = chip.dataset.wbna;
      });
    });

    // init defaults
    initPanelDefaults(panel, day);
  }

  // Bind all panels
  dayPanels.forEach(bindPanel);

  // Day tab click
  dayTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      setActiveDay(tab.dataset.day);
    });
  });

  // Initial day
  const initialTab = document.querySelector(".daytab.active") || dayTabs[0];
  setActiveDay(initialTab.dataset.day);
})();