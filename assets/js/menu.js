document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};
  const ALLURE_LIVE_STATUS = window.ALLURE_LIVE_STATUS || {};

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
          <div class="menuSectionBlock ${["Wings","Wing Flavors"].includes(section.title) ? "menuSectionBlock--bare" : ""}">
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

  function renderDashboard(panelBody) {
    panelBody.classList.remove("menuPanelBody--shots");
    panelBody.innerHTML = `
      <div class="spinGame">
        <div class="spinTitle">🎡 Spin to Win</div>
        <p class="spinSub">Tap to unlock your reward</p>

        <div class="wheel">
          <div class="wheelCenter">SPIN</div>
        </div>

        <button class="spinBtn" type="button">Spin Now</button>

        <div class="spinResult"></div>
      </div>
    `;

    const wheel = panelBody.querySelector(".wheel");
    const button = panelBody.querySelector(".spinBtn");
    const result = panelBody.querySelector(".spinResult");

    if (!wheel || !button || !result) return;

    let spinning = false;

    button.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;

      const rewards = [
        "🥃 Free Shot",
        "💸 $2 Off Drink",
        "🔥 10% Off Tab",
        "🍾 VIP Upgrade",
        "😏 Try Again",
        "🥂 Free Mixer Upgrade"
      ];

      const randomIndex = Math.floor(Math.random() * rewards.length);
      const baseRotation = 360 * 4;
      const sliceRotation = randomIndex * 60;
      const totalRotation = baseRotation + sliceRotation;

      wheel.style.transform = `rotate(${totalRotation}deg)`;
      result.textContent = "";

      setTimeout(() => {
        result.textContent = rewards[randomIndex];
        spinning = false;
      }, 2000);
    });
  }

  function setupCenterWrap(wrap) {
    if (wrap.dataset.bound === "true") return;
    wrap.dataset.bound = "true";

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
      button.addEventListener("click", () => {
        activateButton(button);
      });
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