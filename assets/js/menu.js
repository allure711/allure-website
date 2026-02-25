/* assets/js/menu.js
   Clean menu logic:
   - Day tabs switch panels
   - Each day panel remembers its own selections
   - Tier buttons / Spirit tabs / WBNA tabs work independently per day
*/

(() => {
  const dayTabs = Array.from(document.querySelectorAll(".daytab"));
  const dayPanels = Array.from(document.querySelectorAll(".daypanel"));

  if (!dayTabs.length || !dayPanels.length) return;

  // ----------------------------
  // Helpers
  // ----------------------------
  const qsa = (root, sel) => Array.from(root.querySelectorAll(sel));
  const qs = (root, sel) => root.querySelector(sel);

  const setActive = (items, activeEl, activeClass = "active") => {
    items.forEach(el => el.classList.remove(activeClass));
    if (activeEl) activeEl.classList.add(activeClass);
  };

  const setAriaSelected = (tabs, activeTab) => {
    tabs.forEach(t => t.setAttribute("aria-selected", t === activeTab ? "true" : "false"));
  };

  // ----------------------------
  // Per-day state store
  // ----------------------------
  // state[day] = { tier, spirit, wbna }
  const state = Object.create(null);

  const getDay = (panel) => panel?.dataset?.day;

  const ensureDefaultState = (panel) => {
    const day = getDay(panel);
    if (!day) return;

    if (!state[day]) {
      // Defaults based on what exists in HTML
      const tierBtn = qs(panel, ".tierChip.active") || qs(panel, ".tierChip");
      const spiritBtn = qs(panel, ".spiritChip.active") || qs(panel, ".spiritChip");
      const wbnaBtn = qs(panel, ".wbnaChip.active") || qs(panel, ".wbnaChip");

      state[day] = {
        tier: tierBtn ? tierBtn.dataset.tier : null,
        spirit: spiritBtn ? spiritBtn.dataset.spirit : null,
        wbna: wbnaBtn ? wbnaBtn.dataset.wbna : null
      };
    }
  };

  const applyStateToPanel = (panel) => {
    const day = getDay(panel);
    if (!day) return;

    ensureDefaultState(panel);
    const s = state[day];

    // --- Tier chips ($5 shots / $10 drinks / $10 cocktails)
    const tierBtns = qsa(panel, ".tierChip");
    if (tierBtns.length && s.tier) {
      const activeTierBtn = tierBtns.find(b => b.dataset.tier === s.tier) || tierBtns[0];
      setActive(tierBtns, activeTierBtn);
    }

    // --- Spirit tabs (Vodka/Tequila/etc)
    const spiritBtns = qsa(panel, ".spiritChip");
    const spiritLists = qsa(panel, ".spiritList");
    if (spiritBtns.length && spiritLists.length && s.spirit) {
      const activeSpiritBtn = spiritBtns.find(b => b.dataset.spirit === s.spirit) || spiritBtns[0];
      setActive(spiritBtns, activeSpiritBtn);

      const activeSpirit = activeSpiritBtn.dataset.spirit;
      spiritLists.forEach(list => {
        list.classList.toggle("active", list.dataset.spiritList === activeSpirit);
      });
    }

    // --- Wine/Beer/Non-Alcoholic
    const wbnaBtns = qsa(panel, ".wbnaChip");
    const wbnaLists = qsa(panel, ".wbnaList");
    if (wbnaBtns.length && wbnaLists.length && s.wbna) {
      const activeWbnaBtn = wbnaBtns.find(b => b.dataset.wbna === s.wbna) || wbnaBtns[0];
      setActive(wbnaBtns, activeWbnaBtn);

      const activeWbna = activeWbnaBtn.dataset.wbna;
      wbnaLists.forEach(list => {
        list.classList.toggle("active", list.dataset.wbnaList === activeWbna);
      });
    }
  };

  const showDay = (day) => {
    // Activate correct tab + panel
    const tab = dayTabs.find(t => t.dataset.day === day);
    const panel = dayPanels.find(p => p.dataset.day === day);
    if (!tab || !panel) return;

    setActive(dayTabs, tab);
    setAriaSelected(dayTabs, tab);

    dayPanels.forEach(p => p.classList.remove("active"));
    panel.classList.add("active");

    // Apply ONLY that day's stored state (prevents carry-over)
    applyStateToPanel(panel);

    // Optional: update URL hash without jumping
    const newHash = `#${day}`;
    if (location.hash !== newHash) {
      history.replaceState(null, "", newHash);
    }
  };

  // ----------------------------
  // Day tab click
  // ----------------------------
  dayTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const day = tab.dataset.day;
      // Save current panel state before switching
      const current = dayPanels.find(p => p.classList.contains("active"));
      if (current) {
        ensureDefaultState(current);
        const d = getDay(current);
        if (d) {
          // capture current selections
          const tierActive = qs(current, ".tierChip.active");
          const spiritActive = qs(current, ".spiritChip.active");
          const wbnaActive = qs(current, ".wbnaChip.active");
          state[d] = {
            tier: tierActive ? tierActive.dataset.tier : state[d]?.tier ?? null,
            spirit: spiritActive ? spiritActive.dataset.spirit : state[d]?.spirit ?? null,
            wbna: wbnaActive ? wbnaActive.dataset.wbna : state[d]?.wbna ?? null
          };
        }
      }

      showDay(day);
    });
  });

  // ----------------------------
  // Panel internal clicks (delegation)
  // ----------------------------
  dayPanels.forEach(panel => {
    ensureDefaultState(panel);

    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const day = getDay(panel);
      if (!day) return;

      ensureDefaultState(panel);

      // Tier
      if (btn.classList.contains("tierChip")) {
        const tierBtns = qsa(panel, ".tierChip");
        setActive(tierBtns, btn);
        state[day].tier = btn.dataset.tier || state[day].tier;
        return;
      }

      // Spirit
      if (btn.classList.contains("spiritChip")) {
        const spiritBtns = qsa(panel, ".spiritChip");
        setActive(spiritBtns, btn);
        state[day].spirit = btn.dataset.spirit || state[day].spirit;

        const spiritLists = qsa(panel, ".spiritList");
        const activeSpirit = btn.dataset.spirit;
        spiritLists.forEach(list => {
          list.classList.toggle("active", list.dataset.spiritList === activeSpirit);
        });
        return;
      }

      // WBNA
      if (btn.classList.contains("wbnaChip")) {
        const wbnaBtns = qsa(panel, ".wbnaChip");
        setActive(wbnaBtns, btn);
        state[day].wbna = btn.dataset.wbna || state[day].wbna;

        const wbnaLists = qsa(panel, ".wbnaList");
        const activeWbna = btn.dataset.wbna;
        wbnaLists.forEach(list => {
          list.classList.toggle("active", list.dataset.wbnaList === activeWbna);
        });
        return;
      }
    });
  });

  // ----------------------------
  // Initial load: hash or default active
  // ----------------------------
  const initialFromHash = location.hash ? location.hash.replace("#", "") : null;
  const initialDay =
    (initialFromHash && dayTabs.some(t => t.dataset.day === initialFromHash) && initialFromHash) ||
    (qs(document, ".daytab.active")?.dataset?.day) ||
    dayTabs[0].dataset.day;

  showDay(initialDay);
})();