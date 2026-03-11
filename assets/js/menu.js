document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};

  /* =========================
     MOBILE NAV TOGGLE
  ========================= */
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
              <div class="menuItem__desc">${item.desc || ""}</div>
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
        <div class="menuGrouped__title">${section.title || ""}</div>
        <div class="menuGrouped__grid">
          ${groups.map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${group.title || ""}</div>
              <div class="menuList">
                ${(group.items || []).map(item => `
                  <div class="menuItem">
                    <div class="menuItem__left">
                      <div class="menuItem__name">${item.name || ""}</div>
                    </div>
                    <div class="menuItem__price">${item.price || ""}</div>
                  </div>
                `).join("")}
              </div>
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

  function renderMenu(content) {
    if (!content) {
      return `
        <div class="menuEmpty">
          Click a category above or below to view menu items.
        </div>
      `;
    }

    if (Array.isArray(content)) {
      return renderFlatMenu(content);
    }

    if (content.sections) {
      return renderSectionedMenu(content);
    }

    return `
      <div class="menuEmpty">
        This section will be updated soon.
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
          <div class="popularCard ${item.special === "free-hookah" ? "popularCard--freeHookah" : ""}">
            <span class="${item.special === "free-hookah" ? "freeHookahText" : ""}">
              ${item.name || ""}
            </span>
          </div>
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

      if (section.layout === "wingsGrouped") {
        subBody.innerHTML = `
          <div class="menuSectionBlock">
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

  function bindMenuGame(panelBody) {
    const unlockGameBtn = panelBody.querySelector("#unlockGameBtn");
    const menuSpinWrap = panelBody.querySelector("#menuSpinWrap");
    const spinBottleBtn = panelBody.querySelector("#spinBottleBtn");
    const menuPrizeResult = panelBody.querySelector("#menuPrizeResult");
    const spinAgainBtn = panelBody.querySelector("#spinAgainBtn");
    const menuPrizeActions = panelBody.querySelector("#menuPrizeActions");

    const prizes = [
      "🥃 You won a Free Shot",
      "🍟 You won Free Fries",
      "💨 You won a Hookah Upgrade",
      "🍹 You won $2 Off a Fishbowl",
      "🎉 Lucky You — Ask Staff About Tonight’s Surprise"
    ];

    if (unlockGameBtn && menuSpinWrap) {
      unlockGameBtn.addEventListener("click", () => {
        menuSpinWrap.classList.remove("is-hidden");
        unlockGameBtn.classList.add("is-hidden");
      });
    }

    function runBottleSpin() {
      if (!spinBottleBtn || !menuPrizeResult || !menuPrizeActions) return;

      spinBottleBtn.disabled = true;
      spinBottleBtn.classList.remove("is-spinning");

      void spinBottleBtn.offsetWidth;
      spinBottleBtn.classList.add("is-spinning");

      menuPrizeResult.textContent = "Spinning…";
      menuPrizeActions.classList.add("is-hidden");

      const prize = prizes[Math.floor(Math.random() * prizes.length)];

      setTimeout(() => {
        menuPrizeResult.textContent = prize;
        menuPrizeActions.classList.remove("is-hidden");
        spinBottleBtn.disabled = false;
        spinBottleBtn.classList.remove("is-spinning");
      }, 1900);
    }

    if (spinBottleBtn) {
      spinBottleBtn.addEventListener("click", runBottleSpin);
    }

    if (spinAgainBtn) {
      spinAgainBtn.addEventListener("click", runBottleSpin);
    }
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
      if (text.includes("after 9")) {
        wrap.classList.add("vipNightMode");
      }
    });
  }

  function setupCenterWrap(wrap) {
    const buttons = [...wrap.querySelectorAll(".menuCenterBtn")];
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
        panelBody.innerHTML = `
          <div class="menuEmpty">
            This section will be updated soon.
          </div>
        `;
        return;
      }

      if (content.sections) {
        panelBody.innerHTML = renderMenu(content);
        bindSubTabs(panelBody, content, mode);
        return;
      }

      if (Array.isArray(content)) {
        panelBody.innerHTML = renderFlatMenu(mapItemsForMode(content, mode));
        return;
      }

      panelBody.innerHTML = `
        <div class="menuEmpty">
          This section will be updated soon.
        </div>
      `;
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        activateButton(button);
      });
    });

    panelBody.innerHTML = `
      <div class="menuGameGate" id="menuGameGate">
        <div class="menuGameGate__card" id="menuGameCard">

          <div class="menuGameGate__badge">Instagram Exclusive</div>
          <h3 class="menuGameGate__title">Spin the Bottle — Free Shot Game</h3>
          <p class="menuGameGate__text">
            Follow us on Instagram to unlock tonight’s lucky spin.
            Winners can reveal a surprise perk before ordering.
          </p>

          <div class="menuGameGate__actions" id="gameGateActions">
            <a
              class="menuGameBtn menuGameBtn--gold"
              href="https://www.instagram.com/allurehstdc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on Instagram
            </a>

            <button class="menuGameBtn menuGameBtn--ghost" id="unlockGameBtn" type="button">
              I Followed — Unlock Game
            </button>
          </div>

          <div class="menuSpinWrap is-hidden" id="menuSpinWrap">
            <div class="menuSpinHeader">
              <div class="menuSpinHeader__kicker">Tonight’s Lucky Spin</div>
              <div class="menuSpinHeader__sub">Tap the bottle and see what you win</div>
            </div>

            <div class="menuBottleZone">
              <div class="menuBottlePointer"></div>
              <button class="menuBottle" id="spinBottleBtn" type="button" aria-label="Spin the bottle">
                🍾
              </button>
            </div>

            <div class="menuPrizeResult" id="menuPrizeResult">
              Follow us, unlock the game, and spin for a surprise.
            </div>

            <div class="menuPrizeActions is-hidden" id="menuPrizeActions">
              <button class="menuGameBtn menuGameBtn--gold" id="spinAgainBtn" type="button">
                Spin Again
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    bindMenuGame(panelBody);
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

    applyVipNightMode(day);
  }

  function getTodayDay() {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    return days[new Date().getDay()];
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });

  activateDay(getTodayDay());
});