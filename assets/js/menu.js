document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};

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
          Click a category on the left to view menu items.
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

  function bindSubTabs(panelBody, content) {
    const tabs = panelBody.querySelectorAll(".menuSubTab");
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);
      if (!section) return;

      subBody.innerHTML = `
        <div class="menuSectionBlock">
          <div class="menuSectionBlock__title">${section.title}</div>
          ${renderFlatMenu(section.items || [])}
        </div>
      `;
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });
  }

  function setupSidebarLayout(layout) {
    const buttons = [...layout.querySelectorAll(".menuSideBtn")];
    const panelBody = layout.querySelector(".menuPanelBody");

    if (!buttons.length || !panelBody) return;

    function activateCategory(cat) {
      buttons.forEach(button => {
        button.classList.toggle("active", button.dataset.cat === cat);
      });

      const content = CATEGORY_CONTENT[cat];
      panelBody.innerHTML = renderMenu(content);

      if (content && content.sections) {
        bindSubTabs(panelBody, content);
      }
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        activateCategory(button.dataset.cat);
      });
    });

    panelBody.innerHTML = `
      <div class="menuEmpty">
        Click a category on the left to view menu items.
      </div>
    `;
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const isActive = panel.dataset.daypanel === day;
      panel.classList.toggle("active", isActive);

      if (isActive) {
        renderHighlights(day, panel);
        panel.querySelectorAll(".menuSidebarLayout").forEach(setupSidebarLayout);
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
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });

  activateDay(getTodayDay());
});