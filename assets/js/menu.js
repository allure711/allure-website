(() => {
  // -------------------------
  // Day tabs
  // -------------------------
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  function setDay(day) {
    dayTabs.forEach(b => b.classList.toggle("active", b.dataset.day === day));
    dayPanels.forEach(p => p.classList.toggle("active", p.dataset.dayPanel === day));
    try { localStorage.setItem("menuDay", day); } catch (e) {}
  }

  function initDay() {
    let saved = null;
    try { saved = localStorage.getItem("menuDay"); } catch (e) {}
    const start = saved || "monday";
    setDay(start);
  }

  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => setDay(btn.dataset.day));
  });

  // -------------------------
  // Happy vs Late mode (per day panel)
  // -------------------------
  function autoModeByTime() {
    const hour = new Date().getHours(); // 0-23
    // Happy Hour = 5pm(17) to 8:59pm(20). At 9pm(21) switch to late.
    return (hour >= 17 && hour < 21) ? "happy" : "late";
  }

  function setupTimeModes() {
    dayPanels.forEach(panel => {
      const modeBtns = Array.from(panel.querySelectorAll(".timeModeBtn"));
      const timePanels = Array.from(panel.querySelectorAll(".timePanel"));

      if (!modeBtns.length || !timePanels.length) return;

      const key = `menuTimeMode_${panel.dataset.dayPanel}`;

      function setMode(mode) {
        modeBtns.forEach(b => b.classList.toggle("chip--active", b.dataset.mode === mode));
        timePanels.forEach(tp => tp.classList.toggle("active", tp.dataset.modePanel === mode));
        try { localStorage.setItem(key, mode); } catch(e) {}
      }

      let saved = null;
      try { saved = localStorage.getItem(key); } catch(e) {}

      const startMode = (saved === "happy" || saved === "late") ? saved : autoModeByTime();
      setMode(startMode);

      modeBtns.forEach(b => {
        b.addEventListener("click", () => setMode(b.dataset.mode));
      });
    });
  }

  // -------------------------
  // Bottle tiers (Standard/Premium/VIP) inside late card
  // -------------------------
  function setupTiers() {
    const tierBtns = Array.from(document.querySelectorAll(".tierBtn"));
    if (!tierBtns.length) return;

    tierBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".menuCard");
        if (!card) return;

        const allBtns = Array.from(card.querySelectorAll(".tierBtn"));
        const allPanels = Array.from(card.querySelectorAll(".tierPanel"));

        allBtns.forEach(b => b.classList.toggle("chip--active", b === btn));
        allPanels.forEach(p => p.classList.toggle("active", p.dataset.tierPanel === btn.dataset.tier));
      });
    });
  }

  initDay();
  setupTimeModes();
  setupTiers();
})();
document.querySelectorAll(".accordionMain").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const content = btn.nextElementSibling;
    const arrow = btn.querySelector(".arrow");
    const open = content.style.display === "block";
    content.style.display = open ? "none" : "block";
    arrow.textContent = open ? "+" : "−";
  });
});

document.querySelectorAll(".accordionSub").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const content = btn.nextElementSibling;
    const arrow = btn.querySelector(".arrow");
    const open = content.style.display === "block";
    content.style.display = open ? "none" : "block";
    arrow.textContent = open ? "+" : "−";
  });
});