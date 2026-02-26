(() => {
  // ---------- Day tabs ----------
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  function setActiveDay(day) {
    dayTabs.forEach(btn => {
      const on = btn.dataset.day === day;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    dayPanels.forEach(panel => {
      const on = panel.dataset.daypanel === day;
      panel.classList.toggle("active", on);
    });
  }

  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => setActiveDay(btn.dataset.day));
  });

  // ---------- Tier chips ($5 shots / $10 drinks / spirits) ----------
  const tierChips = Array.from(document.querySelectorAll(".tierChip"));
  const tierPanels = Array.from(document.querySelectorAll(".wbnaList"));

  function setTier(tier) {
    tierChips.forEach(btn => {
      const on = btn.dataset.tier === tier;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    tierPanels.forEach(p => {
      p.classList.toggle("active", p.dataset.tierpanel === tier);
    });
  }

  tierChips.forEach(btn => {
    btn.addEventListener("click", () => setTier(btn.dataset.tier));
  });

  // ---------- Spirit tabs (Vodka / Tequila / etc) ----------
  const spiritChips = Array.from(document.querySelectorAll(".spiritChip"));
  const spiritLists = Array.from(document.querySelectorAll(".spiritList[data-spiritlist]"));

  function setSpirit(key) {
    spiritChips.forEach(btn => {
      const on = btn.dataset.spirit === key;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    spiritLists.forEach(list => {
      list.classList.toggle("active", list.dataset.spiritlist === key);
    });
  }

  spiritChips.forEach(btn => {
    btn.addEventListener("click", () => setSpirit(btn.dataset.spirit));
  });

  // Defaults (safe)
  if (dayTabs.length) setActiveDay(dayTabs.find(b => b.classList.contains("active"))?.dataset.day || "monday");
  if (tierChips.length) setTier(tierChips.find(b => b.classList.contains("active"))?.dataset.tier || "shots");
  if (spiritChips.length) setSpirit(spiritChips.find(b => b.classList.contains("active"))?.dataset.spirit || "vodka");
})();