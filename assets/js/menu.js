document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};
  const ALLURE_LIVE_STATUS = window.ALLURE_LIVE_STATUS || {};
  const STAFF_PIN = "2024";

  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function renderFlatMenu(items) {
    return `
      <div class="menuList">
        ${(items || []).map(item => `
          <div class="menuItem">
            <div class="menuItem__left">
              <div class="menuItem__name">${item.name || ""}</div>
              ${item.desc ? `<div class="menuItem__desc">${item.desc}</div>` : ""}
            </div>
            <div class="menuItem__price">${item.price || ""}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderGroupedMenu(section) {
    const groups = section.groups || [];
    return `
      <div class="menuGrouped">
        ${section.title ? `<div class="menuGrouped__title">${section.title}</div>` : ""}
        <div class="menuGrouped__grid">
          ${groups.map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${group.title || ""}</div>
              ${renderFlatMenu(group.items || [])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function mapItemsForMode(items, mode) {
    if (!mode) return items || [];

    return (items || []).map(item => {
      const rawPrice = String(item.price || "");
      if (!rawPrice.includes("/")) return item;

      const parts = rawPrice.split("/").map(p => p.trim());

      if (mode === "shots") {
        return { ...item, price: parts[0] || rawPrice };
      }

      if (mode === "drinks") {
        return { ...item, price: parts[1] || parts[0] || rawPrice };
      }

      return item;
    });
  }

  function renderSectionedMenu(content) {
    const sections = content.sections || [];
    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${sections.map(section => `
            <button class="menuSubTab" type="button" data-subsection="${section.title}">
              ${section.title}
            </button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function renderHighlights(day, panel) {
    panel.querySelectorAll(".popularTonight").forEach(node => node.remove());

    const items = MENU_HIGHLIGHTS[day];
    if (!items || !items.length) return;

    const hero = panel.querySelector(".heroRow");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "popularTonight";
    section.innerHTML = `
      <div class="popularTonight__title">🔥 Popular Tonight</div>
      <div class="popularTonight__grid">
        ${items.map(item => `
          <div class="popularCard">${item.name || ""}</div>
        `).join("")}
      </div>
    `;

    hero.after(section);
  }

  function renderVipNightBanner(day, panel) {
    panel.querySelectorAll(".vipNightBannerFloating").forEach(node => node.remove());

    if (day !== "friday" && day !== "saturday") return;

    const hero = panel.querySelector(".heroRow");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "vipNightBannerFloating";
    section.innerHTML = `
      <div class="vipNightBannerFloating__badge">VIP NIGHT ACTIVE</div>
      <div class="vipNightBannerFloating__title">Late Night Energy • Bottle Service • DJ Vibes</div>
      <div class="vipNightBannerFloating__meta">Premium cocktails • VIP tables • Hookah • Fishbowls</div>
    `;

    hero.after(section);
  }

  function updateLiveIndicator(day) {
    const liveTitle = document.getElementById("liveTitle");
    const liveTags = document.getElementById("liveTags");
    const info = ALLURE_LIVE_STATUS[day];

    if (!liveTitle || !liveTags || !info) return;

    liveTitle.textContent = info.title || "Live Tonight";
    liveTags.innerHTML = (info.tags || []).map(tag => `<span class="liveTag">${tag}</span>`).join("");
  }

  function bindSubTabs(panelBody, content, mode = null) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);
      if (!section) return;

      if (section.layout === "grouped") {
        subBody.innerHTML = `
          <div class="menuSectionBlock ${["Wings", "Wing Flavors"].includes(section.title) ? "menuSectionBlock--bare" : ""}">
            ${renderGroupedMenu(section)}
          </div>
        `;
        return;
      }

      const items = mapItemsForMode(section.items || [], mode);
      subBody.innerHTML = `
        <div class="menuSectionBlock">
          ${renderFlatMenu(items)}
        </div>
      `;
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);
  }

  function applyVipNightMode(day) {
    document.querySelectorAll(".menuCenterWrap").forEach(wrap => {
      wrap.classList.remove("vipNightMode");
    });

    if (day !== "friday" && day !== "saturday") return;

    const activePanel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
    if (!activePanel) return;

    activePanel.querySelectorAll(".menuCenterWrap").forEach(wrap => {
      const titleEl = wrap.querySelector(".menuPanelTitle");
      if (!titleEl) return;

      const text = titleEl.textContent.toLowerCase();
      if (text.includes("after 9") || text.includes("vip night")) {
        wrap.classList.add("vipNightMode");
      }
    });
  }

  function getTableNumber() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("table") || "Walk-In").trim();
  }

  function promoCode(table, label) {
    const safeTable = String(table).replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "BAR";
    const safeLabel = String(label).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8) || "ALLURE";
    const stamp = String(Date.now()).slice(-6);
    return `ALR-${safeTable}-${safeLabel}-${stamp}`;
  }

  function savePromoQueue(payload) {
    const key = "allurePromoQueue";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push(payload);
    localStorage.setItem(key, JSON.stringify(current));
  }

  function getMysteryItems(staffMode) {
    const infoItems = [
      { type: "info", label: "Allure Instagram", value: "@alluredc" },
      { type: "info", label: "Allure Address", value: "Washington, DC" },
      { type: "info", label: "Owner Phone", value: "202-297-4949" },
      { type: "info", label: "Reserve Now", value: "Call tonight" },
      { type: "info", label: "House Special", value: "Ask bartender" },
      { type: "info", label: "After 9 Vibes", value: "Stay late" }
    ];

    const guestRewards = [
      { type: "reward", label: "Free Shot", value: "Free Shot" },
      { type: "reward", label: "$2 Off Drink", value: "$2 Off Drink" },
      { type: "reward", label: "10% Off Tab", value: "10% Off Tab" },
      { type: "reward", label: "Free Mixer", value: "Free Mixer Upgrade" },
      { type: "reward", label: "VIP Line Skip", value: "VIP Line Skip" }
    ];

    const staffRewards = [
      { type: "reward", label: "Free Shot", value: "Free Shot" },
      { type: "reward", label: "$4 Off Drink", value: "$4 Off Drink" },
      { type: "reward", label: "15% Off Tab", value: "15% Off Tab" },
      { type: "reward", label: "VIP Upgrade", value: "VIP Upgrade" },
      { type: "reward", label: "Hookah Upgrade", value: "Free Hookah Upgrade" },
      { type: "reward", label: "Reserved Table", value: "Reserved Table Perk" }
    ];

    const neutral = [
      { type: "neutral", label: "Try Again", value: "Try Again" },
      { type: "neutral", label: "Come Back After 9", value: "Come Back After 9" },
      { type: "neutral", label: "Ask Your Server", value: "Ask Your Server" },
      { type: "neutral", label: "Tonight’s Vibe", value: "Enjoy the vibe" }
    ];

    const rewards = staffMode ? staffRewards : guestRewards;

    const full = [
      rewards[0], rewards[1], rewards[2], rewards[3], rewards[4],
      infoItems[0], infoItems[1], infoItems[2], infoItems[3], infoItems[4], infoItems[5],
      neutral[0], neutral[1], neutral[2], neutral[3],
      rewards[0], neutral[0], infoItems[0], neutral[1], rewards[1],
      infoItems[1], neutral[2], rewards[2], neutral[3]
    ];

    return shuffle(full);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderDashboard(panelBody) {
    panelBody.classList.remove("menuPanelBody--shots");

    const table = getTableNumber();

    panelBody.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTop">
          <div>
            <div class="hybridTitle">Allure Mystery Boxes</div>
            <div class="hybridSub">Pick a mystery box and reveal rewards, specials, Allure info, or VIP perks. Bonus puzzle unlocks after your reveal.</div>
          </div>
          <div class="hybridMeta">
            <span class="hybridBadge hybridBadge--gold">Table ${table}</span>
            <span class="hybridBadge" data-role-badge>1 Chance</span>
            <span class="hybridBadge">24 Boxes</span>
          </div>
        </div>

        <div class="mysteryGrid" data-mystery-grid>
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox" type="button" data-box-index="${i + 1}">Box ${i + 1}</button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div class="mysteryRevealLabel">Revealed</div>
          <div class="mysteryRevealText" data-reveal-text>Choose 1 mystery box.</div>
          <div class="mysteryRevealCode" data-reveal-code></div>
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--gold" type="button" data-new-round>New Round</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-save-reward disabled>Save Reward</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-copy-code disabled>Copy Code</button>
        </div>

        <div class="hybridHint" data-hint>Pick 1 box. Staff mode unlocks 2 chances.</div>

        <div class="hybridSection">
          <div class="hybridSectionTitle">Bonus Puzzle</div>
          <div class="puzzleWrap">
            <div class="puzzleGrid">
              <button class="puzzlePiece" type="button" data-piece="A">A</button>
              <button class="puzzlePiece" type="button" data-piece="L">L</button>
              <button class="puzzlePiece" type="button" data-piece="L">L</button>
              <button class="puzzlePiece" type="button" data-piece="U">U</button>
              <button class="puzzlePiece" type="button" data-piece="R">R</button>
              <button class="puzzlePiece" type="button" data-piece="E">E</button>
            </div>
            <div class="puzzleText" data-puzzle-text>
              Unlock a reward first, then tap the letters in the correct order to spell ALLURE: A → L → L → U → R → E.
            </div>
          </div>
        </div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Staff PIN" data-staff-pin>
            <button class="hybridBtn hybridBtn--ghost" type="button" data-staff-unlock>Unlock Staff Mode</button>
          </div>
          <div class="staffState" data-staff-state>Guest mode active. One chance only.</div>
          <div class="promoQueueNote">POS mode: rewards save into a local promo queue on this device. Your developer can later sync this queue to a real POS API.</div>
        </div>
      </div>
    `;

    const boxes = [...panelBody.querySelectorAll(".mysteryBox")];
    const revealText = panelBody.querySelector("[data-reveal-text]");
    const revealCode = panelBody.querySelector("[data-reveal-code]");
    const hint = panelBody.querySelector("[data-hint]");
    const saveRewardBtn = panelBody.querySelector("[data-save-reward]");
    const copyCodeBtn = panelBody.querySelector("[data-copy-code]");
    const newRoundBtn = panelBody.querySelector("[data-new-round]");
    const staffPin = panelBody.querySelector("[data-staff-pin]");
    const staffUnlock = panelBody.querySelector("[data-staff-unlock]");
    const staffState = panelBody.querySelector("[data-staff-state]");
    const roleBadge = panelBody.querySelector("[data-role-badge]");
    const puzzlePieces = [...panelBody.querySelectorAll(".puzzlePiece")];
    const puzzleText = panelBody.querySelector("[data-puzzle-text]");

    let staffMode = false;
    let chancesAllowed = 1;
    let picksUsed = 0;
    let items = getMysteryItems(false);
    let currentWin = null;
    let currentCode = "";
    let puzzleStep = 0;
    const puzzleAnswer = ["A", "L", "L", "U", "R", "E"];

    function resetPuzzle() {
      puzzleStep = 0;
      puzzlePieces.forEach(btn => btn.classList.remove("is-correct"));
      puzzleText.textContent = "Unlock a reward first, then tap the letters in the correct order to spell ALLURE: A → L → L → U → R → E.";
    }

    function startRound() {
      items = getMysteryItems(staffMode);
      picksUsed = 0;
      currentWin = null;
      currentCode = "";
      revealText.textContent = `Choose ${chancesAllowed} mystery box${chancesAllowed > 1 ? "es" : ""}.`;
      revealCode.textContent = "";
      hint.textContent = `Pick ${chancesAllowed} box${chancesAllowed > 1 ? "es" : ""}. ${staffMode ? "Staff mode is active." : "Guest mode is active."}`;
      saveRewardBtn.disabled = true;
      copyCodeBtn.disabled = true;

      boxes.forEach((box, i) => {
        box.classList.remove("is-open", "is-locked");
        box.textContent = `Box ${i + 1}`;
      });

      resetPuzzle();
    }

    function lockRemainingBoxes() {
      boxes.forEach(box => {
        if (!box.classList.contains("is-open")) {
          box.classList.add("is-locked");
        }
      });
    }

    boxes.forEach((box, index) => {
      box.addEventListener("click", () => {
        if (box.classList.contains("is-open") || box.classList.contains("is-locked")) return;
        if (picksUsed >= chancesAllowed) return;

        const item = items[index];
        box.classList.add("is-open");
        picksUsed += 1;
        box.textContent = item.label;

        if (item.type === "reward") {
          currentWin = item.value;
          currentCode = promoCode(table, item.value);
          revealText.textContent = item.value;
          revealCode.textContent = currentCode;
          saveRewardBtn.disabled = false;
          copyCodeBtn.disabled = false;
          hint.textContent = `Reward unlocked. ${picksUsed < chancesAllowed ? "You still have another pick." : "Bonus puzzle now available."}`;
        } else if (!currentWin) {
          revealText.textContent = item.value;
          revealCode.textContent = "";
          hint.textContent = picksUsed < chancesAllowed
            ? "You can pick one more box."
            : "Round complete. Start a new round to play again.";
        }

        if (picksUsed >= chancesAllowed) {
          lockRemainingBoxes();
        }
      });
    });

    newRoundBtn.addEventListener("click", () => {
      startRound();
    });

    saveRewardBtn.addEventListener("click", () => {
      if (!currentWin || !currentCode) return;

      savePromoQueue({
        code: currentCode,
        reward: currentWin,
        table,
        staffMode,
        redeemed: false,
        created_at: new Date().toISOString(),
        source: "24-box-hybrid"
      });

      hint.textContent = `Saved to promo queue: ${currentCode}`;
    });

    copyCodeBtn.addEventListener("click", async () => {
      if (!currentCode) return;

      try {
        await navigator.clipboard.writeText(`${currentWin} | ${currentCode} | Table ${table}`);
        hint.textContent = `Copied: ${currentCode}`;
      } catch {
        hint.textContent = `Copy failed. Use code: ${currentCode}`;
      }
    });

    staffUnlock.addEventListener("click", () => {
      const entered = (staffPin.value || "").trim();
      if (entered !== STAFF_PIN) {
        staffState.textContent = "Invalid staff PIN.";
        return;
      }

      staffMode = !staffMode;
      chancesAllowed = staffMode ? 2 : 1;
      roleBadge.textContent = staffMode ? "2 Chances" : "1 Chance";
      staffState.textContent = staffMode
        ? "Staff mode active. Two chances unlocked and upgraded rewards loaded."
        : "Guest mode active. One chance only.";

      staffPin.value = "";
      startRound();
    });

    puzzlePieces.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!currentWin) {
          puzzleText.textContent = "Reveal a reward first before playing the bonus puzzle.";
          return;
        }

        const needed = puzzleAnswer[puzzleStep];
        const chosen = btn.dataset.piece;

        if (chosen === needed) {
          btn.classList.add("is-correct");
          puzzleStep += 1;

          if (puzzleStep >= puzzleAnswer.length) {
            puzzleText.textContent = `Puzzle solved. Bonus unlocked: Show code ${currentCode} plus mention BONUS ALLURE to staff.`;
          } else {
            puzzleText.textContent = `Correct. Next letter: ${puzzleAnswer[puzzleStep]}`;
          }
        } else {
          puzzleStep = 0;
          puzzlePieces.forEach(p => p.classList.remove("is-correct"));
          puzzleText.textContent = "Wrong order. Start again: A → L → L → U → R → E.";
        }
      });
    });

    startRound();
  }

  function getButtonsForWrap(wrap) {
    const ownButtons = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outsideBottom = wrap.parentElement?.querySelector(".outsideBottom");
    const outsideButtons = outsideBottom ? [...outsideBottom.querySelectorAll(".menuCenterBtn")] : [];
    return [...ownButtons, ...outsideButtons];
  }

  function setupCenterWrap(wrap) {
    if (wrap.dataset.bound === "true") return;
    wrap.dataset.bound = "true";

    const buttons = getButtonsForWrap(wrap);
    const panelBody = wrap.querySelector(".menuPanelBody");
    if (!buttons.length || !panelBody) return;

    function activateButton(button) {
      const cat = button.dataset.cat;
      const mode = button.dataset.mode || null;
      const content = CATEGORY_CONTENT[cat];

      buttons.forEach(btn => {
        btn.classList.toggle("active", btn === button);
      });

      if (!content) {
        panelBody.classList.remove("menuPanelBody--shots");
        panelBody.innerHTML = `<div class="menuEmpty">This section will be updated soon.</div>`;
        return;
      }

      panelBody.innerHTML = renderSectionedMenu(content);

      if (["shots5", "shots7", "premium"].includes(cat)) {
        panelBody.classList.add("menuPanelBody--shots");
      } else {
        panelBody.classList.remove("menuPanelBody--shots");
      }

      bindSubTabs(panelBody, content, mode);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => activateButton(button));
    });

    renderDashboard(panelBody);
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const isActive = panel.dataset.daypanel === day;
      panel.classList.toggle("active", isActive);

      if (isActive) {
        renderVipNightBanner(day, panel);
        renderHighlights(day, panel);
        panel.querySelectorAll(".menuCenterWrap").forEach(setupCenterWrap);
      }
    });

    updateLiveIndicator(day);
    applyVipNightMode(day);
  }

  function getTodayDay() {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return days[new Date().getDay()];
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });

  if (document.querySelector(".dayTab")) {
    activateDay(getTodayDay());
  }
});
