document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

  const DAILY_PROMOS = {
    sunday: { label: "SOCIAL SUNDAY", text: "Chill vibes, hookah, drinks & music" },
    monday: { label: "FREE HOOKAH MONDAY", text: "With $50 bar tab — your choice of flavor" },
    tuesday: { label: "TACO TUESDAY", text: "Tacos, drinks & late night vibes" },
    wednesday: { label: "WEEKDAYS WEDNESDAY", text: "Midweek energy, cocktails & hookah" },
    thursday: { label: "KARAOKE THURSDAY", text: "Sing, drink & vibe all night" },
    friday: { label: "ALLURE FRIDAY", text: "Premium nightlife experience" },
    saturday: { label: "ALLURE SATURDAY", text: "VIP energy, bottles & music" }
  };

  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function getTodayName() {
    return ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
  }

  function updateDailyPromo(day) {
    const promoLabel = document.getElementById("promoLabel");
    const promoText = document.getElementById("promoText");
    const promo = DAILY_PROMOS[day];
    if (!promoLabel || !promoText || !promo) return;
    promoLabel.textContent = promo.label;
    promoText.textContent = promo.text;
  }

  function renderFlatMenu(items) {
    return `
      <div class="menuList">
        ${(items || []).map(item => `
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

  function renderSectionedMenu(content) {
    const sections = content?.sections || [];
    if (!sections.length) return `<div class="menuEmpty">Menu coming soon.</div>`;

    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${sections.map(s => `<button class="menuSubTab" data-subsection="${s.title}">${s.title}</button>`).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function bindSubTabs(panel, content) {
    const tabs = panel.querySelectorAll(".menuSubTab");
    const body = panel.querySelector(".menuSubBody");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const section = content.sections.find(s => s.title === tab.dataset.subsection);
        body.innerHTML = renderFlatMenu(section.items);
      });
    });

    tabs[0]?.click();
  }

  /* 🔥 BACKGROUND SWITCH */
  function setPanelBackground(panel, type) {
    panel.setAttribute("data-bg", type);
  }

  function renderLeadGate(panel) {
    setPanelBackground(panel, "game");

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">Unlock Your VIP Mystery Box</div>
        <button class="hybridBtn hybridBtn--gold" data-play>Start Game</button>
      </div>
    `;

    panel.querySelector("[data-play]").onclick = () => renderGame(panel);
  }

  function renderGame(panel) {
    setPanelBackground(panel, "game");

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Mystery Box</div>
        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_,i)=>`
            <button class="mysteryBox">Box ${i+1}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function setupWrap(wrap) {
    const panel = wrap.querySelector(".menuPanelBody");
    const buttons = wrap.querySelectorAll(".menuCenterBtn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (btn.dataset.action === "game") {
          renderLeadGate(panel);
          return;
        }

        const cat = btn.dataset.cat;
        const content = CATEGORY_CONTENT[cat];

        setPanelBackground(panel, cat);

        panel.innerHTML = renderSectionedMenu(content);
        bindSubTabs(panel, content);
      });
    });

    // 🔥 AUTO OPEN GAME INSTEAD OF FOOD
    const gameBtn = [...buttons].find(b => b.dataset.action === "game");
    gameBtn?.click();
  }

  function activateDay(day) {
    document.querySelectorAll(".dayPanel").forEach(panel => {
      panel.classList.toggle("active", panel.dataset.daypanel === day);
      if (panel.dataset.daypanel === day) {
        panel.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });
    updateDailyPromo(day);
  }

  activateDay(getTodayName());
});