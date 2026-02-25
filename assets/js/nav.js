/* =========================
   ALLURE MENU — CLEAN LOGIC
   - Day tabs switch panels (no state leaks)
   - All clicks scoped inside the current day panel
   - Reset each day panel to defaults when opened
========================= */

(() => {
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  if (!dayTabs.length || !dayPanels.length) return;

  // ---------- Helpers ----------
  const qs = (root, sel) => root.querySelector(sel);
  const qsa = (root, sel) => Array.from(root.querySelectorAll(sel));

  function setActive(groupEls, activeEl) {
    groupEls.forEach(el => el.classList.remove("active"));
    if (activeEl) activeEl.classList.add("active");
  }

  function showOnly(panel, listSelector, matchAttr, value) {
    const lists = qsa(panel, listSelector);
    lists.forEach(l => l.classList.remove("active"));
    const target = lists.find(l => l.getAttribute(matchAttr) === value);
    if (target) target.classList.add("active");
  }

  function setPrices(panel, priceText) {
    qsa(panel, ".jsPrice").forEach(p => (p.textContent = priceText));
  }

  // ---------- Default reset for each panel ----------
  function resetPanel(panel) {
    // Tier default = shots
    const tierChips = qsa(panel, ".tierChip");
    const spiritChips = qsa(panel, ".spiritChip");
    const wbnaChips = qsa(panel, ".wbnaChip");

    // If this panel doesn’t have the structure yet, skip safely
    if (tierChips.length) {
      setActive(tierChips, tierChips.find(x => x.dataset.tier === "shots") || tierChips[0]);
    }
    if (spiritChips.length) {
      setActive(spiritChips, spiritChips.find(x => x.dataset.spirit === "vodka") || spiritChips[0]);
    }
    if (wbnaChips.length) {
      setActive(wbnaChips, wbnaChips.find(x => x.dataset.wbna === "wine") || wbnaChips[0]);
    }

    // Show default lists
    showOnly(panel, ".spiritList", "data-spirit-list", "vodka");
    showOnly(panel, ".wbnaList", "data-wbna-list", "wine");

    // Default price for shots
    setPrices(panel, "$5");

    // Cocktails view off by default
    qsa(panel, ".cocktailBox").forEach(box => box.style.display = "none");

    // Make sure spirit tabs/lists are visible by default
    qsa(panel, ".spiritTabs").forEach(el => el.style.display = "");
    qsa(panel, ".spiritLists").forEach(el => el.style.display = "");
  }

  // ---------- Day switching ----------
  function activateDay(dayKey) {
    // tabs
    dayTabs.forEach(btn => {
      const isActive = btn.dataset.day === dayKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // panels
    dayPanels.forEach(panel => {
      const isActive = panel.dataset.day === dayKey;
      panel.classList.toggle("active", isActive);

      // IMPORTANT: when panel becomes active, reset it clean
      if (isActive) resetPanel(panel);
    });
  }

  // Click day tabs
  dayTabs.forEach(btn => {
    btn.addEventListener("click", () => activateDay(btn.dataset.day));
  });

  // ---------- Menu interaction (scoped per panel) ----------
  document.addEventListener("click", (e) => {
    // Find the day panel we’re interacting with
    const panel = e.target.closest(".daypanel");
    if (!panel) return;

    // ---- Tier clicks ($5 shots / $10 drinks / $10 cocktails)
    if (e.target.classList.contains("tierChip")) {
      const tierChips = qsa(panel, ".tierChip");
      setActive(tierChips, e.target);

      const tier = e.target.dataset.tier;

      // Cocktails mode: hide spirit tabs/lists, show cocktail box
      const spiritTabs = qs(panel, ".spiritTabs");
      const spiritLists = qs(panel, ".spiritLists");
      const cocktailBox = qs(panel, ".cocktailBox");

      if (tier === "cocktails") {
        if (spiritTabs) spiritTabs.style.display = "none";
        if (spiritLists) spiritLists.style.display = "none";

        // Create cocktail box if missing
        if (!cocktailBox) {
          const card = e.target.closest(".menuCard");
          const box = document.createElement("div");
          box.className = "cocktailBox";
          box.style.display = "block";
          box.innerHTML = `
            <p class="cocktailHead">$10 COCKTAILS</p>
            <div class="chipWrap">
              <span class="chip">Allure Lemon Drop</span>
              <span class="chip">Long Island</span>
              <span class="chip">Manhattan</span>
              <span class="chip">Mint Julep</span>
              <span class="chip">Mojito</span>
              <span class="chip">Moscow Mule</span>
              <span class="chip">Old Fashion</span>
              <span class="chip">Orange Martini</span>
              <span class="chip">Red / White Sangria</span>
              <span class="chip">Rum Punch</span>
              <span class="chip">Strawberry Henny</span>
            </div>
          `;
          if (card) card.appendChild(box);
        } else {
          cocktailBox.style.display = "block";
        }
        return;
      }

      // Not cocktails => show spirits + set price
      if (spiritTabs) spiritTabs.style.display = "";
      if (spiritLists) spiritLists.style.display = "";
      qsa(panel, ".cocktailBox").forEach(box => box.style.display = "none");

      if (tier === "shots") setPrices(panel, "$5");
      if (tier === "drinks") setPrices(panel, "$10");

      return;
    }

    // ---- Spirit category clicks (Vodka/Tequila/etc)
    if (e.target.classList.contains("spiritChip")) {
      const spiritChips = qsa(panel, ".spiritChip");
      setActive(spiritChips, e.target);

      const spirit = e.target.dataset.spirit;
      showOnly(panel, ".spiritList", "data-spirit-list", spirit);
      return;
    }

    // ---- Wine/Beer/NA clicks
    if (e.target.classList.contains("wbnaChip")) {
      const wbnaChips = qsa(panel, ".wbnaChip");
      setActive(wbnaChips, e.target);

      const wbna = e.target.dataset.wbna;
      showOnly(panel, ".wbnaList", "data-wbna-list", wbna);
      return;
    }
  });

  // ---------- First load ----------
  activateDay("monday");
})();