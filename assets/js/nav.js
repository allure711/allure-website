(() => {
  // ===== Day switching (isolated) + per-day state memory =====

  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  // State per day:
  // { tier: "shots"|"drinks"|"cocktails", spirit:"vodka"... , wbna:"wine"|"beer"|"na" }
  const state = {};

  function getPanel(day){
    return dayPanels.find(p => p.dataset.day === day) || null;
  }

  function setActiveDay(day){
    // deactivate tabs
    dayTabs.forEach(b => {
      const on = b.dataset.day === day;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    // show only that day panel
    dayPanels.forEach(p => p.classList.toggle("active", p.dataset.day === day));

    // apply saved state (or defaults)
    const panel = getPanel(day);
    if(panel) applyStateToPanel(panel, day);
  }

  function priceForTier(tier){
    if(tier === "shots") return "$5";
    if(tier === "drinks") return "$10";
    if(tier === "cocktails") return "$10";
    return "$5";
  }

  function applyStateToPanel(panel, day){
    const s = state[day] || { tier:"shots", spirit:"vodka", wbna:"wine" };

    // Tier chips
    const tierChips = Array.from(panel.querySelectorAll(".tierChip"));
    tierChips.forEach(ch => ch.classList.toggle("active", ch.dataset.tier === s.tier));

    // Update visible prices inside this day panel only
    panel.querySelectorAll(".jsPrice").forEach(el => {
      el.textContent = priceForTier(s.tier);
    });

    // Spirit tabs/lists
    const spiritChips = Array.from(panel.querySelectorAll(".spiritChip"));
    spiritChips.forEach(ch => ch.classList.toggle("active", ch.dataset.spirit === s.spirit));
    const spiritLists = Array.from(panel.querySelectorAll(".spiritList"));
    spiritLists.forEach(list => list.classList.toggle("active", list.dataset.spiritList === s.spirit));

    // Wine/Beer/NA
    const wbnaChips = Array.from(panel.querySelectorAll(".wbnaChip"));
    wbnaChips.forEach(ch => ch.classList.toggle("active", ch.dataset.wbna === s.wbna));
    const wbnaLists = Array.from(panel.querySelectorAll(".wbnaList"));
    wbnaLists.forEach(list => list.classList.toggle("active", list.dataset.wbnaList === s.wbna));
  }

  function savePanelState(panel, day){
    const tierActive = panel.querySelector(".tierChip.active");
    const spiritActive = panel.querySelector(".spiritChip.active");
    const wbnaActive = panel.querySelector(".wbnaChip.active");

    state[day] = {
      tier: tierActive ? tierActive.dataset.tier : "shots",
      spirit: spiritActive ? spiritActive.dataset.spirit : "vodka",
      wbna: wbnaActive ? wbnaActive.dataset.wbna : "wine"
    };
  }

  // Click handlers
  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const day = btn.dataset.day;

      // Save current day state BEFORE switching
      const current = dayPanels.find(p => p.classList.contains("active"));
      if(current){
        savePanelState(current, current.dataset.day);
      }

      setActiveDay(day);
    });
  });

  // Delegate menu clicks inside each day panel (so it never affects other days)
  dayPanels.forEach(panel => {
    panel.addEventListener("click", (e) => {
      const day = panel.dataset.day;

      const tierBtn = e.target.closest(".tierChip");
      const spiritBtn = e.target.closest(".spiritChip");
      const wbnaBtn = e.target.closest(".wbnaChip");

      if(tierBtn){
        panel.querySelectorAll(".tierChip").forEach(b => b.classList.remove("active"));
        tierBtn.classList.add("active");

        // Update prices in THIS panel only
        const tier = tierBtn.dataset.tier;
        panel.querySelectorAll(".jsPrice").forEach(el => el.textContent = priceForTier(tier));

        savePanelState(panel, day);
        return;
      }

      if(spiritBtn){
        panel.querySelectorAll(".spiritChip").forEach(b => b.classList.remove("active"));
        spiritBtn.classList.add("active");

        const spirit = spiritBtn.dataset.spirit;
        panel.querySelectorAll(".spiritList").forEach(list => {
          list.classList.toggle("active", list.dataset.spiritList === spirit);
        });

        savePanelState(panel, day);
        return;
      }

      if(wbnaBtn){
        panel.querySelectorAll(".wbnaChip").forEach(b => b.classList.remove("active"));
        wbnaBtn.classList.add("active");

        const which = wbnaBtn.dataset.wbna;
        panel.querySelectorAll(".wbnaList").forEach(list => {
          list.classList.toggle("active", list.dataset.wbnaList === which);
        });

        savePanelState(panel, day);
        return;
      }
    });
  });

  // init: set defaults for each day so it never inherits another day
  dayPanels.forEach(p => {
    const d = p.dataset.day;
    state[d] = { tier:"shots", spirit:"vodka", wbna:"wine" };
  });

  // start on Monday
  setActiveDay("monday");
})();