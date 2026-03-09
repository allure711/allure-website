document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};

  function renderFlatMenu(items) {
    return `
      <div class="menuList">
        ${items.map(item => `
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

  function renderSectionedMenu(content) {
    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${content.sections.map(section => `
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
    if (!content) return "";
    if (Array.isArray(content)) return renderFlatMenu(content);
    if (content.sections) return renderSectionedMenu(content);
    return "";
  }

  function renderHighlights(day, panel) {
    panel.querySelectorAll(".popularTonight").forEach(node => node.remove());

    const items = MENU_HIGHLIGHTS[day];
    if (!items || !items.length) return;

    const hero = panel.querySelector(".heroRow");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "popularTonight reveal";
    section.innerHTML = `
      <div class="popularTonight__title">🔥 Popular Tonight</div>
      <div class="popularTonight__grid">
        ${items.map(item => `
          <div class="popularCard">
            <span>${item.name}</span>
            <span class="price">${item.price}</span>
          </div>
        `).join("")}
      </div>
    `;

    hero.after(section);
  }

  function bindNestedTabs(body, content) {
    const tabs = body.querySelectorAll(".menuSubTab");
    const subBody = body.querySelector(".menuSubBody");
    if (!tabs.length || !subBody) return;

    function activate(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = content.sections.find(s => s.title === title);
      if (!section) return;

      subBody.innerHTML = `
        <div class="menuSectionBlock">
          <div class="menuSectionBlock__title">${section.title}</div>
          ${renderFlatMenu(section.items || [])}
        </div>
      `;
    }

    tabs.forEach(tab => {
      tab.onclick = () => activate(tab.dataset.subsection);
    });
  }

  function setupCategoryBar(bar) {
    const scope = bar.dataset.scope;
    const panel = bar.closest(".dayPanel");
    const body = panel ? panel.querySelector(`[data-scopebody="${scope}"]`) : null;
    const buttons = [...bar.querySelectorAll(".cat")];
    if (!body || !buttons.length) return;

    function activate(cat) {
      buttons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === cat);
      });

      const content = CATEGORY_CONTENT[cat];
      body.innerHTML = renderMenu(content);

      if (content && content.sections) {
        bindNestedTabs(body, content);
      }
    }

    buttons.forEach(btn => {
      btn.onclick = () => activate(btn.dataset.cat);
    });

    body.innerHTML = "";
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const active = panel.dataset.daypanel === day;
      panel.classList.toggle("active", active);

      if (active) {
        renderHighlights(day, panel);
        panel.querySelectorAll(".catBar").forEach(setupCategoryBar);
      }
    });
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
    tab.onclick = () => activateDay(tab.dataset.daytab);
  });

  activateDay(getTodayDay());
});