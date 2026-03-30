document.addEventListener("DOMContentLoaded", () => {

  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const GAME_CONFIG = window.ALLURE_GAME_CONFIG || {};
  const GAME_REWARDS = GAME_CONFIG.rewards || {};

  /* =========================
     NAV
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

  /* =========================
     HELPERS
  ========================= */

  function isGameButton(button) {
    const action = (button.dataset.action || "").toLowerCase();
    const cat = (button.dataset.cat || "").toLowerCase();
    const text = (button.textContent || "").toLowerCase();

    return action === "game" || cat === "game" || text.includes("24 box");
  }

  function splitShotsAndDrinks(items = []) {
    const shots = [];
    const drinks = [];

    items.forEach(item => {
      const parts = String(item.price || "").split("/");

      if (parts.length === 2) {
        shots.push({ ...item, price: parts[0].trim() });
        drinks.push({ ...item, price: parts[1].trim() });
      } else {
        shots.push(item);
        drinks.push(item);
      }
    });

    return { shots, drinks };
  }

  function getContentByMode(content, mode) {
    if (!mode) return content;

    return {
      ...content,
      sections: content.sections.map(section => {
        if (section.layout === "grouped") return section;

        const split = splitShotsAndDrinks(section.items || []);

        return {
          ...section,
          items: mode === "shots" ? split.shots : split.drinks
        };
      })
    };
  }

  function normalizePhone(val) {
    return val.replace(/\D/g, "");
  }

  function pickReward(type) {
    let pool = [];

    if (type === "vip") pool = GAME_REWARDS.vip || [];
    else if (type === "phone") pool = GAME_REWARDS.phone || [];
    else if (type === "instagram") pool = GAME_REWARDS.instagram || [];

    if (!pool.length) pool = GAME_REWARDS.filler || [];

    return pool[Math.floor(Math.random() * pool.length)];
  }

  function detectType(ig, phone) {
    if (ig && phone) return "vip";
    if (phone) return "phone";
    if (ig) return "instagram";
    return "filler";
  }

  function saveLead(ig, phone, reward) {
    const existing = JSON.parse(localStorage.getItem("allure_leads") || "[]");

    existing.push({
      instagram: ig || "",
      phone: phone || "",
      reward,
      time: new Date().toISOString()
    });

    localStorage.setItem("allure_leads", JSON.stringify(existing));
  }

  /* =========================
     RENDER MENU
  ========================= */

  function renderFlatMenu(items = []) {
    return `
      <div class="menuList">
        ${items.map(item => `
          <div class="menuItem">
            <div>
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
        ${(section.groups || []).map(group => `
          <div class="menuGrouped__box">
            <div class="menuGrouped__boxTitle">${group.title}</div>
            ${renderFlatMenu(group.items)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderSectionedMenu(content) {
    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${content.sections.map((s, i) => `
            <button class="menuSubTab ${i === 0 ? "active" : ""}" data-title="${s.title}">
              ${s.title}
            </button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function renderSubSection(section) {
    if (!section) return "";
    if (section.layout === "grouped") return renderGroupedMenu(section);
    return renderFlatMenu(section.items);
  }

  function bindSubTabs(container, content) {
    const tabs = container.querySelectorAll(".menuSubTab");
    const body = container.querySelector(".menuSubBody");

    function activate(title) {
      const section = content.sections.find(s => s.title === title);
      body.innerHTML = renderSubSection(section);

      tabs.forEach(t => t.classList.remove("active"));
      container.querySelector(`[data-title="${title}"]`)?.classList.add("active");
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => activate(tab.dataset.title));
    });

    if (content.sections.length) {
      activate(content.sections[0].title);
    }
  }

  function renderMenu(panel, catKey, mode = "") {
    const body = panel.querySelector(".menuPanelBody");
    const content = CATEGORY_CONTENT[catKey];

    if (!content) {
      body.innerHTML = `<div class="menuEmpty">No menu found</div>`;
      return;
    }

    const finalContent = getContentByMode(content, mode);

    body.innerHTML = renderSectionedMenu(finalContent);
    bindSubTabs(body, finalContent);
  }

  /* =========================
     24 BOX GAME (FULL)
  ========================= */

  function openGame(panel) {
    const body = panel.querySelector(".menuPanelBody");

    body.innerHTML = `
      <div class="gameWrap">
        <h2>🎲 24 Box Game</h2>
        <input id="ig" placeholder="Instagram (@name)">
        <input id="phone" placeholder="Phone number">
        <button id="startGame">Play</button>
        <div id="grid"></div>
        <div id="result"></div>
      </div>
    `;

    const igInput = document.getElementById("ig");
    const phoneInput = document.getElementById("phone");
    const startBtn = document.getElementById("startGame");
    const grid = document.getElementById("grid");
    const result = document.getElementById("result");

    startBtn.onclick = () => {
      const ig = igInput.value.trim();
      const phone = normalizePhone(phoneInput.value);

      if (!ig && !phone) {
        alert("Enter info to play");
        return;
      }

      const type = detectType(ig, phone);

      grid.innerHTML = "";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(6,1fr)";
      grid.style.gap = "10px";

      const winIndex = Math.floor(Math.random() * 24);

      for (let i = 0; i < 24; i++) {
        const box = document.createElement("div");
        box.textContent = i + 1;
        box.style.padding = "15px";
        box.style.background = "#111";
        box.style.textAlign = "center";
        box.style.cursor = "pointer";

        box.onclick = () => {
          if (grid.classList.contains("played")) return;
          grid.classList.add("played");

          let reward = i === winIndex ? pickReward(type) : "Try Again";

          result.innerHTML = `<h3>${reward}</h3>`;
          saveLead(ig, phone, reward);
        };

        grid.appendChild(box);
      }

      startBtn.style.display = "none";
    };
  }

  /* =========================
     BUTTON INIT
  ========================= */

  function initPanels() {
    document.querySelectorAll(".dayPanel").forEach(panel => {
      const buttons = panel.querySelectorAll(".menuCenterBtn");
      const mainPanel = panel.querySelector(".menuBigPanel");

      buttons.forEach(btn => {
        btn.onclick = () => {
          buttons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          if (isGameButton(btn)) openGame(mainPanel);
          else renderMenu(mainPanel, btn.dataset.cat, btn.dataset.mode);
        };
      });

      if (buttons.length) buttons[0].click();
    });
  }

  /* =========================
     INIT
  ========================= */

  initPanels();

});