document.addEventListener("DOMContentLoaded", function () {

  const dayTabs = document.querySelectorAll(".daytab");
  const dayPanels = document.querySelectorAll(".daypanel");

  // ---------- DAY SWITCHING ----------
  dayTabs.forEach(tab => {
    tab.addEventListener("click", function () {

      const day = this.dataset.day;

      // Deactivate all tabs
      dayTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });

      // Hide all panels
      dayPanels.forEach(panel => {
        panel.classList.remove("active");
      });

      // Activate selected
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");

      const activePanel = document.querySelector(`.daypanel[data-day="${day}"]`);
      if (!activePanel) return;

      activePanel.classList.add("active");

      // Reset panel state
      resetPanel(activePanel);
    });
  });


  // ---------- RESET FUNCTION ----------
  function resetPanel(panel) {

    // Reset tier
    const tierChips = panel.querySelectorAll(".tierChip");
    tierChips.forEach(c => c.classList.remove("active"));
    const defaultTier = panel.querySelector('.tierChip[data-tier="shots"]');
    if (defaultTier) defaultTier.classList.add("active");

    // Reset spirit tabs
    const spiritChips = panel.querySelectorAll(".spiritChip");
    spiritChips.forEach(c => c.classList.remove("active"));
    const defaultSpirit = panel.querySelector('.spiritChip[data-spirit="vodka"]');
    if (defaultSpirit) defaultSpirit.classList.add("active");

    // Reset spirit lists
    const spiritLists = panel.querySelectorAll(".spiritList");
    spiritLists.forEach(l => l.classList.remove("active"));
    const defaultList = panel.querySelector('.spiritList[data-spirit-list="vodka"]');
    if (defaultList) defaultList.classList.add("active");

    // Reset Wine/Beer/NA
    const wbnaChips = panel.querySelectorAll(".wbnaChip");
    wbnaChips.forEach(c => c.classList.remove("active"));
    const defaultWbna = panel.querySelector('.wbnaChip[data-wbna="wine"]');
    if (defaultWbna) defaultWbna.classList.add("active");

    const wbnaLists = panel.querySelectorAll(".wbnaList");
    wbnaLists.forEach(l => l.classList.remove("active"));
    const defaultWbnaList = panel.querySelector('.wbnaList[data-wbna-list="wine"]');
    if (defaultWbnaList) defaultWbnaList.classList.add("active");

    // Reset prices to $5
    const prices = panel.querySelectorAll(".jsPrice");
    prices.forEach(p => p.textContent = "$5");
  }


  // ---------- TIER SWITCHING ----------
  document.addEventListener("click", function (e) {

    const tierBtn = e.target.closest(".tierChip");
    if (!tierBtn) return;

    const panel = tierBtn.closest(".daypanel");
    if (!panel) return;

    const tierChips = panel.querySelectorAll(".tierChip");
    tierChips.forEach(c => c.classList.remove("active"));
    tierBtn.classList.add("active");

    const prices = panel.querySelectorAll(".jsPrice");

    if (tierBtn.dataset.tier === "shots") {
      prices.forEach(p => p.textContent = "$5");
    }

    if (tierBtn.dataset.tier === "drinks") {
      prices.forEach(p => p.textContent = "$10");
    }
  });


  // ---------- SPIRIT SWITCHING ----------
  document.addEventListener("click", function (e) {

    const spiritBtn = e.target.closest(".spiritChip");
    if (!spiritBtn) return;

    const panel = spiritBtn.closest(".daypanel");
    if (!panel) return;

    const spiritChips = panel.querySelectorAll(".spiritChip");
    spiritChips.forEach(c => c.classList.remove("active"));
    spiritBtn.classList.add("active");

    const spiritLists = panel.querySelectorAll(".spiritList");
    spiritLists.forEach(l => l.classList.remove("active"));

    const targetList = panel.querySelector(
      `.spiritList[data-spirit-list="${spiritBtn.dataset.spirit}"]`
    );

    if (targetList) targetList.classList.add("active");
  });


  // ---------- WINE / BEER / NA SWITCHING ----------
  document.addEventListener("click", function (e) {

    const wbnaBtn = e.target.closest(".wbnaChip");
    if (!wbnaBtn) return;

    const panel = wbnaBtn.closest(".daypanel");
    if (!panel) return;

    const wbnaChips = panel.querySelectorAll(".wbnaChip");
    wbnaChips.forEach(c => c.classList.remove("active"));
    wbnaBtn.classList.add("active");

    const wbnaLists = panel.querySelectorAll(".wbnaList");
    wbnaLists.forEach(l => l.classList.remove("active"));

    const targetList = panel.querySelector(
      `.wbnaList[data-wbna-list="${wbnaBtn.dataset.wbna}"]`
    );

    if (targetList) targetList.classList.add("active");
  });

});
