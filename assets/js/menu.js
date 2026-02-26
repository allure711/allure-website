(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // -------- Day tabs (Mon–Sun) --------
  const dayTabs = $$(".daytab");
  const dayPanels = $$(".daypanel");

  function setActiveDay(day) {
    dayTabs.forEach(btn => {
      const isActive = btn.dataset.day === day;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    dayPanels.forEach(panel => {
      panel.classList.toggle("active", panel.dataset.day === day);
    });

    // Update URL hash (#monday etc) so refresh keeps same day
    if (day) history.replaceState(null, "", `#${day}`);

    // Reset reveals on day switch (then reveal again)
    requestAnimationFrame(() => {
      setupReveals(true);
      revealVisible();
    });
  }

  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => setActiveDay(btn.dataset.day));
  });

  // Load day from hash if present
  const hashDay = (location.hash || "").replace("#", "").trim();
  if (hashDay && dayTabs.some(b => b.dataset.day === hashDay)) {
    setActiveDay(hashDay);
  }

  // -------- Inside a panel: Spirit chips --------
  function wireSpiritTabs(panel) {
    const chips = $$("[data-scope='spiritTabs'] .spiritChip", panel);
    const lists = $$("[data-spirit-list]", panel);

    if (!chips.length || !lists.length) return;

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const key = chip.dataset.spirit;

        chips.forEach(c => c.classList.toggle("active", c === chip));
        lists.forEach(list => list.classList.toggle("active", list.dataset.spiritList === key));
      });
    });
  }

  // -------- Bottle tier chips --------
  function wireBottleTiers(panel) {
    const chips = $$("[data-scope='bottleTier'] .bottleTierChip", panel);
    const lists = $$("[data-bottle-list]", panel);

    if (!chips.length || !lists.length) return;

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const key = chip.dataset.bottleTier;

        chips.forEach(c => c.classList.toggle("active", c === chip));
        lists.forEach(list => list.classList.toggle("active", list.dataset.bottleList === key));
      });
    });
  }

  // Wire current active panel + future panels
  function wireAllPanels() {
    dayPanels.forEach(panel => {
      wireSpiritTabs(panel);
      wireBottleTiers(panel);
    });
  }
  wireAllPanels();

  // -------- Reveal on scroll (nightclub animation) --------
  let revealObserver = null;

  function setupReveals(reset = false) {
    const nodes = $$(".reveal");

    if (reset) nodes.forEach(n => n.classList.remove("is-visible"));

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });

    nodes.forEach(n => revealObserver.observe(n));
  }

  function revealVisible() {
    // ensures above-the-fold shows immediately
    $$(".reveal").forEach(n => {
      const rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) n.classList.add("is-visible");
    });
  }

  setupReveals(false);
  revealVisible();

  // Safety: if user resizes, recalc
  window.addEventListener("resize", () => {
    setupReveals(false);
    revealVisible();
  });
})();