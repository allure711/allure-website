/* ==========================
   ALLURE MENU LOGIC (CLEAN + SCOPED)
   Works with your exact HTML:
   - .daytab (data-day)
   - .daypanel (data-day)
   - .tierChip (data-tier) inside [data-scope="tier"]
   - .spiritChip (data-spirit) inside [data-scope="spiritTabs"]
   - .wbnaChip (data-wbna) inside [data-scope="wbna"]
   - .spiritList (data-spirit-list)
   - .wbnaList (data-wbna-list)
   - .jsPrice elements update based on tier
========================== */

(() => {
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  if (!dayTabs.length || !dayPanels.length) return;

  const panelByDay = (day) => dayPanels.find(p => p.dataset.day === day);

  // ---------------------------
  // 1) COPY MONDAY GRID INTO OTHER DAYS (if they still have .copyNote)
  // ---------------------------
  const mondayPanel = panelByDay("monday");
  if (mondayPanel) {
    const mondayGrid = mondayPanel.querySelector(".menuGrid");
    if (mondayGrid) {
      dayPanels.forEach(panel => {
        if (panel.dataset.day === "monday") return;
        const grid = panel.querySelector(".menuGrid");
        const copyNote = grid ? grid.querySelector(".copyNote") : null;

        // Only replace panels that still show placeholder note
        if (grid && copyNote) {
          grid.innerHTML = mondayGrid.innerHTML;
        }
      });
    }
  }

  // ---------------------------
  // 2) PER-DAY STATE (so each day "sticks" independently)
  // ---------------------------
  const defaultState = {
    tier: "shots",     // shots | drinks | cocktails
    spirit: "vodka",   // vodka/tequila/...
    wbna: "wine"       // wine/beer/na
  };

  // in-memory states (per day)
  const state = {};
  const getState = (day) => (state[day] ||= { ...defaultState });

  // ---------------------------
  // 3) APPLY STATE TO A PANEL
  // ---------------------------
  function applyTier(panel, tier) {
    // Update prices inside this panel only
    const prices = Array.from(panel.querySelectorAll(".jsPrice"));
    if (tier === "shots") prices.forEach(p => p.textContent = "$5");
    if (tier === "drinks") prices.forEach(p => p.textContent = "$10");

    const spiritTabs = panel.querySelector('[data-scope="spiritTabs"]');
    const spiritLists = panel.querySelector(".spiritLists");

    // Create cocktailBox once per panel if missing
    let cocktailBox = panel.querySelector(".cocktailBox");
    if (!cocktailBox) {
      // attach inside the LEFT spirits card if possible
      const leftCard = panel.querySelector(".menuCard");
      cocktailBox = document.createElement("div");
      cocktailBox.className = "cocktailBox";
      cocktailBox.innerHTML = `
        <div class="cocktailHead">Choose Your $10 Cocktails</div>
        <div class="chipWrap">
          <span class="chip">Allure Lemon Drop</span>
          <span class="chip">Long Island</span>
          <span class="chip">Manhattan</span>
          <span class="chip">Mint Julep</span>
          <span class="chip">Mojito</span>
          <span class="chip">Moscow Mule</span>
          <span class="chip">Old Fashioned</span>
          <span class="chip">Orange Martini</span>
          <span class="chip">Red/White Sangria</span>
          <span class="chip">Rum Punch</span>
          <span class="chip">Strawberry Henny</span>
        </div>
      `;
      if (spiritLists && spiritLists.parentElement) {
        spiritLists.parentElement.appendChild(cocktailBox);
      } else if (leftCard) {
        leftCard.appendChild(cocktailBox);
      } else {
        panel.appendChild(cocktailBox);
      }
    }

    if (tier === "cocktails") {
      if (spiritTabs) spiritTabs.style.display = "none";
      if (spiritLists) spiritLists.style.display = "none";
      cocktailBox.style.display = "block";
    } else {
      if (spiritTabs) spiritTabs.style.display = "";
      if (spiritLists) spiritLists.style.display = "";
      cocktailBox.style.display = "none";
    }
  }

  function applySpirit(panel, spirit) {
    const lists = Array.from(panel.querySelectorAll(".spiritList"));
    lists.forEach(list => {
      list.classList.toggle("active", list.dataset.spiritList === spirit);
    });
  }

  function applyWbna(panel, wbna) {
    const lists = Array.from(panel.querySelectorAll(".wbnaList"));
    lists.forEach(list => {
      list.classList.toggle("active", list.dataset.wbnaList === wbna);
    });
  }

  function applyState(panel, day) {
    const s = getState(day);

    // Tier chips
    const tierRow = panel.querySelector('[data-scope="tier"]');
    if (tierRow) {
      const tierBtns = Array.from(tierRow.querySelectorAll(".tierChip"));
      tierBtns.forEach(b => b.classList.toggle("active", b.dataset.tier === s.tier));
      applyTier(panel, s.tier);
    }

    // Spirit chips
    const spiritTabs = panel.querySelector('[data-scope="spiritTabs"]');
    if (spiritTabs) {
      const spiritBtns = Array.from(spiritTabs.querySelectorAll(".spiritChip"));
      spiritBtns.forEach(b => b.classList.toggle("active", b.dataset.spirit === s.spirit));
      applySpirit(panel, s.spirit);
    }

    // WBNA chips
    const wbnaRow = panel.querySelector('[data-scope="wbna"]');
    if (wbnaRow) {
      const wbnaBtns = Array.from(wbnaRow.querySelectorAll(".wbnaChip"));
      wbnaBtns.forEach(b => b.classList.toggle("active", b.dataset.wbna === s.wbna));
      applyWbna(panel, s.wbna);
    }
  }

  // ---------------------------
  // 4) DAY SWITCH (only one panel visible)
  // ---------------------------
  function activateDay(day, { scroll = true } = {}) {
    // Tabs UI
    dayTabs.forEach(btn => {
      const on = btn.dataset.day === day;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    // Panels UI
    dayPanels.forEach(panel => {
      const on = panel.dataset.day === day;
      panel.classList.toggle("active", on);
    });

    // Apply saved state to this day ONLY
    const panel = panelByDay(day);
    if (panel) applyState(panel, day);

    // Save active day
    try { localStorage.setItem("allureActiveDay", day); } catch(e) {}

    if (scroll && panel) {
      const title = panel.querySelector(".menuTitle") || panel;
      title.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ---------------------------
  // 5) EVENT DELEGATION (CRITICAL FIX)
  // Everything happens ONLY inside the clicked daypanel
  // ---------------------------
  document.addEventListener("click", (e) => {
    // Day click
    const dayBtn = e.target.closest(".daytab");
    if (dayBtn) {
      activateDay(dayBtn.dataset.day);
      return;
    }

    // Only operate inside the panel you clicked
    const panel = e.target.closest(".daypanel");
    if (!panel) return;

    const day = panel.dataset.day;
    const s = getState(day);

    // Tier click
    const tierBtn = e.target.closest(".tierChip");
    if (tierBtn) {
      s.tier = tierBtn.dataset.tier;

      const row = tierBtn.closest('[data-scope="tier"]');
      if (row) {
        Array.from(row.querySelectorAll(".tierChip")).forEach(b => b.classList.remove("active"));
        tierBtn.classList.add("active");
      }
      applyTier(panel, s.tier);
      return;
    }

    // Spirit click
    const spiritBtn = e.target.closest(".spiritChip");
    if (spiritBtn) {
      s.spirit = spiritBtn.dataset.spirit;

      const tabs = spiritBtn.closest('[data-scope="spiritTabs"]');
      if (tabs) {
        Array.from(tabs.querySelectorAll(".spiritChip")).forEach(b => b.classList.remove("active"));
        spiritBtn.classList.add("active");
      }
      applySpirit(panel, s.spirit);
      return;
    }

    // WBNA click
    const wbnaBtn = e.target.closest(".wbnaChip");
    if (wbnaBtn) {
      s.wbna = wbnaBtn.dataset.wbna;

      const row = wbnaBtn.closest('[data-scope="wbna"]');
      if (row) {
        Array.from(row.querySelectorAll(".wbnaChip")).forEach(b => b.classList.remove("active"));
        wbnaBtn.classList.add("active");
      }
      applyWbna(panel, s.wbna);
      return;
    }
  });

  // ---------------------------
  // 6) INITIAL LOAD
  // ---------------------------
  let start = "monday";
  try { start = localStorage.getItem("allureActiveDay") || "monday"; } catch(e) {}
  activateDay(start, { scroll: false });
})();