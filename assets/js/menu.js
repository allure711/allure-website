document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

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
     MENU RENDER
  ========================= */

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
              <div class="menuGrouped__boxTitle">${group.title}</div>
              ${renderFlatMenu(group.items)}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderSectionedMenu(content) {
    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${(content.sections || []).map(s => `
            <button class="menuSubTab" data-subsection="${s.title}">${s.title}</button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function bindSubTabs(panelBody, content) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");

    function activate(title) {
      tabs.forEach(t => t.classList.toggle("active", t.dataset.subsection === title));
      const section = content.sections.find(s => s.title === title);

      if (section.layout === "grouped") {
        subBody.innerHTML = renderGroupedMenu(section);
      } else {
        subBody.innerHTML = renderFlatMenu(section.items);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => activate(tab.dataset.subsection));
    });

    activate(content.sections[0].title);
  }

  /* =========================
     🔥 24 BOX GAME (RESTORED)
  ========================= */

  function getItems() {
    const rewards = ["Free Shot","$5 Off","10% Off","VIP Skip","Hookah Upgrade"];
    const filler = ["Try Again","Come Back","Ask Server","Next Time"];

    return [...rewards, ...filler, ...rewards].sort(() => Math.random() - 0.5).slice(0, 24);
  }

  function renderGame(panel) {
    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Pick Your Box</div>

        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox">Box ${i + 1}</button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div id="reveal">Pick a box</div>
        </div>
      </div>
    `;

    const boxes = panel.querySelectorAll(".mysteryBox");
    const reveal = panel.querySelector("#reveal");

    const items = getItems();
    let used = false;

    boxes.forEach((box, i) => {
      box.onclick = () => {
        if (used) return;
        used = true;

        box.textContent = items[i];
        reveal.textContent = items[i];
      };
    });
  }

  /* =========================
     CENTER WRAP
  ========================= */

  function getButtons(wrap) {
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outside = [...wrap.parentElement.querySelectorAll(".outsideBottom .menuCenterBtn")];
    return [...inside, ...outside];
  }

  function setupWrap(wrap) {
    if (wrap.dataset.done) return;
    wrap.dataset.done = true;

    const buttons = getButtons(wrap);
    const panel = wrap.querySelector(".menuPanelBody");

    // 👇 SHOW GAME FIRST (NOTHING AUTO MENU)
    renderGame(panel);

    buttons.forEach(btn => {
      btn.onclick = () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const content = CATEGORY_CONTENT[btn.dataset.cat];

        if (!content) {
          panel.innerHTML = "Coming soon";
          return;
        }

        panel.innerHTML = renderSectionedMenu(content);
        bindSubTabs(panel, content);
      };
    });
  }

  /* =========================
     DAY SWITCH (NO AUTO OPEN)
  ========================= */

  function activateDay(day) {
    document.querySelectorAll(".dayPanel").forEach(p => {
      const active = p.dataset.daypanel === day;
      p.classList.toggle("active", active);

      if (active) {
        p.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });

    // highlight tab
    document.querySelectorAll(".dayTab").forEach(t => {
      t.classList.toggle("active", t.dataset.daytab === day);
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.onclick = () => activateDay(tab.dataset.daytab);
  });

  // default = today BUT no menu auto open
  const today = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
  activateDay(today);
});