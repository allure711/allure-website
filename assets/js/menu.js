document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
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
    return `
      <div class="menuGrouped">
        ${section.title ? `<div class="menuGrouped__title">${section.title}</div>` : ""}
        <div class="menuGrouped__grid">
          ${(section.groups || []).map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${group.title || ""}</div>
              ${renderFlatMenu(group.items || [])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function splitShotsAndDrinks(items) {
    const shots = [];
    const drinks = [];

    (items || []).forEach(item => {
      const price = item.price || "";
      const parts = price.split("/").map(p => p.trim());

      if (parts.length === 2) {
        shots.push({ ...item, price: parts[0] });
        drinks.push({ ...item, price: parts[1] });
      } else {
        shots.push({ ...item });
        drinks.push({ ...item });
      }
    });

    return { shots, drinks };
  }

  function getContentByMode(content, mode) {
    if (!content || !content.sections) return content;
    if (!mode || (mode !== "shots" && mode !== "drinks")) return content;

    return {
      ...content,
      sections: content.sections.map(section => {
        const split = splitShotsAndDrinks(section.items || []);
        return {
          ...section,
          items: mode === "shots" ? split.shots : split.drinks
        };
      })
    };
  }

  function renderSectionedMenu(content) {
    const sections = content?.sections || [];

    if (!sections.length) {
      return `<div class="menuEmpty">Menu coming soon.</div>`;
    }

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

  function bindSubTabs(panelBody, content) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content?.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);

      if (!section) {
        subBody.innerHTML = `<div class="menuEmpty">Section not found.</div>`;
        return;
      }

      if (section.layout === "grouped") {
        subBody.innerHTML = renderGroupedMenu(section);
      } else {
        subBody.innerHTML = renderFlatMenu(section.items || []);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);
  }

  function getButtons(wrap) {
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outsideWrap = wrap.parentElement.querySelector(".outsideBottom");
    const outside = outsideWrap ? [...outsideWrap.querySelectorAll(".menuCenterBtn")] : [];
    return [...inside, ...outside];
  }

  function getTableLabel() {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("table") ||
      params.get("tableno") ||
      params.get("tableNo") ||
      params.get("seat") ||
      "walk-in"
    ).trim();
  }

  function getTodayStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function getGameKey(day) {
    const table = getTableLabel().toLowerCase();
    return `allure24box:${getTodayStamp()}:${day}:${table}`;
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getRewardPool(day) {
    const commonRewards = [
      { label: "Free Shot", code: "ALLURE-SHOT", kind: "reward" },
      { label: "$2 Off Hookah", code: "ALLURE-HOOKAH2", kind: "reward" },
      { label: "10% Off Food", code: "ALLURE-FOOD10", kind: "reward" },
      { label: "VIP Line Skip", code: "ALLURE-VIP", kind: "reward" },
      { label: "Free Refill Mixer", code: "ALLURE-MIX", kind: "reward" },
      { label: "Buy 1 Get 1 Half Off Shot", code: "ALLURE-BOGO", kind: "reward" },
      { label: "Free Wing Flavor Upgrade", code: "ALLURE-WING", kind: "reward" },
      { label: "Try Again", code: "NEXT-TIME", kind: "neutral" },
      { label: "Good Vibes Only", code: "ALLURE-VIBES", kind: "neutral" },
      { label: "Ask About VIP Tables", code: "ALLURE-TABLE", kind: "promo" },
      { label: "Reserve Next Visit", code: "ALLURE-BOOK", kind: "promo" },
      { label: "Follow @Allure", code: "ALLURE-IG", kind: "promo" }
    ];

    const dayBonuses = {
      monday: [
        { label: "Free Hookah Upgrade", code: "MON-HOOKAH", kind: "reward" },
        { label: "Happy Hour Bonus", code: "MON-HH", kind: "reward" }
      ],
      tuesday: [
        { label: "Fishbowl Upgrade", code: "TUE-BOWL", kind: "reward" },
        { label: "$4 Off Premium", code: "TUE-PREM", kind: "reward" }
      ],
      wednesday: [
        { label: "High Noon Bonus", code: "WED-NOON", kind: "reward" },
        { label: "Late Night Perk", code: "WED-LATE", kind: "reward" }
      ],
      thursday: [
        { label: "Karaoke Bonus", code: "THU-KARAOKE", kind: "reward" },
        { label: "Free Hookah Flavor Switch", code: "THU-FLAVOR", kind: "reward" }
      ],
      friday: [
        { label: "VIP Upgrade", code: "FRI-VIP", kind: "reward" },
        { label: "$5 Off Premium Drink", code: "FRI-PREM5", kind: "reward" }
      ],
      saturday: [
        { label: "Table Priority", code: "SAT-TABLE", kind: "reward" },
        { label: "$5 Off Hookah", code: "SAT-HOOKAH5", kind: "reward" }
      ],
      sunday: [
        { label: "Social Sunday Bonus", code: "SUN-SOCIAL", kind: "reward" },
        { label: "Free Shot Upgrade", code: "SUN-UPGRADE", kind: "reward" }
      ]
    };

    const filler = [
      { label: "Allure Energy", code: "ALLURE", kind: "neutral" },
      { label: "Good Luck Next Time", code: "NEXT", kind: "neutral" },
      { label: "Ask Server for VIP", code: "VIP-ASK", kind: "promo" },
      { label: "Come Back This Weekend", code: "WEEKEND", kind: "promo" }
    ];

    const pool = [
      ...commonRewards,
      ...(dayBonuses[day] || []),
      ...commonRewards,
      ...filler,
      ...filler
    ];

    return shuffle(pool).slice(0, 24);
  }

  function saveGameState(day, state) {
    localStorage.setItem(getGameKey(day), JSON.stringify(state));
  }

  function loadGameState(day) {
    const raw = localStorage.getItem(getGameKey(day));
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearGameState(day) {
    localStorage.removeItem(getGameKey(day));
  }

  function renderIdleState(panel, day) {
    const prettyDay = day.charAt(0).toUpperCase() + day.slice(1);
    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${prettyDay} Menu</div>
        <div class="menuStart__text">
          Select a category to view menu items, or tap the 24 Box Game for a reward chance.
        </div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" type="button" data-start-game>Play 24 Box Game</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-food>Open Food Menu</button>
        </div>
        <div class="menuStartMeta">
          One reveal per device/table per day. Manager reset available.
        </div>
      </div>
    `;

    const startGame = panel.querySelector("[data-start-game]");
    const startFood = panel.querySelector("[data-start-food]");

    if (startGame) {
      startGame.addEventListener("click", () => {
        renderGame(panel, day);
      });
    }

    if (startFood) {
      const wrap = panel.closest(".menuCenterWrap");
      if (!wrap) return;

      const foodBtn = wrap.querySelector('.menuCenterBtn[data-cat="food"]');
      if (foodBtn) {
        startFood.addEventListener("click", () => {
          foodBtn.click();
        });
      }
    }
  }

  function renderGame(panel, day) {
    const tableLabel = getTableLabel();
    const existing = loadGameState(day);
    const rewards = existing?.rewards || getRewardPool(day);
    const revealedIndex = typeof existing?.revealedIndex === "number" ? existing.revealedIndex : null;
    const revealedReward = revealedIndex !== null ? rewards[revealedIndex] : null;

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">24 Box Game</div>
            <div class="gameSub">
              Pick one box and reveal your result. One play per table/device each day.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge gameBadge--gold">${day.toUpperCase()}</span>
            <span class="gameBadge">Table: ${tableLabel}</span>
          </div>
        </div>

        <div class="boxGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="boxCell" type="button" data-box-index="${i}">
              Box ${i + 1}
            </button>
          `).join("")}
        </div>

        <div class="gameReveal">
          <div class="gameRevealLabel">Your Reveal</div>
          <div class="gameRevealText">${revealedReward ? revealedReward.label : "Choose one box"}</div>
          <div class="gameRevealCode">${revealedReward ? revealedReward.code : "One reveal per day"}</div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" type="button" data-back-menu>Back to Menu</button>
          <button class="gameBtn gameBtn--gold" type="button" data-reset-game ${revealedReward ? "" : "disabled"}>Manager Reset</button>
        </div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Manager PIN">
            <button class="gameBtn gameBtn--ghost" type="button" data-confirm-reset>Unlock Reset</button>
          </div>
          <div class="staffState">Manager reset clears this table/device result for today.</div>
        </div>

        <div class="gameHint">
          Guests can reveal one box. After a reveal, the result stays saved on this browser for this table today.
        </div>
      </div>
    `;

    const buttons = [...panel.querySelectorAll(".boxCell")];
    const revealText = panel.querySelector(".gameRevealText");
    const revealCode = panel.querySelector(".gameRevealCode");
    const backBtn = panel.querySelector("[data-back-menu]");
    const resetBtn = panel.querySelector("[data-reset-game]");
    const confirmResetBtn = panel.querySelector("[data-confirm-reset]");
    const pinInput = panel.querySelector(".staffInput");
    const staffState = panel.querySelector(".staffState");

    function lockBoard(activeIndex) {
      buttons.forEach((btn, index) => {
        if (index === activeIndex) {
          btn.classList.add("is-revealed");
          btn.textContent = rewards[index].kind === "reward" ? "Winner" : "Reveal";
        } else {
          btn.classList.add("is-locked");
        }
      });
    }

    if (revealedIndex !== null) {
      lockBoard(revealedIndex);
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const state = loadGameState(day);

        if (state?.revealedIndex !== null && typeof state?.revealedIndex === "number") {
          return;
        }

        const reward = rewards[index];
        revealText.textContent = reward.label;
        revealCode.textContent = reward.code;

        lockBoard(index);

        saveGameState(day, {
          day,
          table: tableLabel,
          rewards,
          revealedIndex: index,
          revealedAt: Date.now()
        });

        if (resetBtn) resetBtn.disabled = false;
      });
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        renderIdleState(panel, day);
      });
    }

    if (confirmResetBtn) {
      confirmResetBtn.addEventListener("click", () => {
        const pin = (pinInput?.value || "").trim();

        if (pin !== STAFF_PIN) {
          if (staffState) {
            staffState.textContent = "Incorrect PIN.";
          }
          return;
        }

        clearGameState(day);
        if (staffState) {
          staffState.textContent = "Reset complete. Game reopened for this table/device.";
        }
        renderGame(panel, day);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (staffState) {
          staffState.textContent = "Enter manager PIN, then tap Unlock Reset.";
        }
      });
    }
  }

  function setupWrap(wrap) {
    if (wrap.dataset.done === "true") return;
    wrap.dataset.done = "true";

    const buttons = getButtons(wrap);
    const panel = wrap.querySelector(".menuPanelBody");
    const dayPanel = wrap.closest(".dayPanel");
    const day = dayPanel?.dataset.daypanel || "monday";

    if (!panel || !buttons.length) return;

    function clearActive() {
      buttons.forEach(btn => btn.classList.remove("active"));
    }

    function activateCategory(button) {
      clearActive();
      button.classList.add("active");

      const catKey = button.dataset.cat;
      const mode = button.dataset.mode || "";
      const baseContent = CATEGORY_CONTENT[catKey];

      if (!baseContent) {
        panel.innerHTML = `<div class="menuEmpty">Coming soon.</div>`;
        return;
      }

      const content = getContentByMode(baseContent, mode);
      panel.innerHTML = renderSectionedMenu(content);
      bindSubTabs(panel, content);
    }

    function activateGame(button) {
      clearActive();
      button.classList.add("active");
      renderGame(panel, day);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "game") {
          activateGame(button);
          return;
        }

        activateCategory(button);
      });
    });

    clearActive();
    renderIdleState(panel, day);
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const active = panel.dataset.daypanel === day;
      panel.classList.toggle("active", active);

      if (active) {
        panel.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => activateDay(tab.dataset.daytab));
  });

  const today = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  activateDay(hasTodayTab ? today : fallbackDay);
});