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

  function filterSectionItemsByMode(section, mode) {
    if (!mode) return section.items || [];

    if (mode === "drinks") {
      return (section.items || []).filter(item => {
        const price = String(item.price || "");
        return price.includes("/"); // "$5 / $10" or "$7 / $14"
      }).map(item => {
        const parts = String(item.price).split("/");
        return {
          ...item,
          price: (parts[1] || parts[0] || "").trim()
        };
      });
    }

    return section.items || [];
  }

  function renderSectionedMenu(content, mode = null) {
    const sections = content.sections || [];
    const filteredSections = sections
      .map(section => ({
        ...section,
        items: filterSectionItemsByMode(section, mode)
      }))
      .filter(section => (section.items || []).length > 0);

    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${filteredSections.map(section => `
            <button class="menuSubTab" type="button" data-subsection="${section.title}">
              ${section.title}
            </button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function renderSingleListFromSections(content, mode = null) {
    const sections = content.sections || [];
    const allItems = sections.flatMap(section => filterSectionItemsByMode(section, mode));

    if (!allItems.length) {
      return `
        <div class="menuEmpty">
          No items found in this section.
        </div>
      `;
    }

    return renderFlatMenu(allItems);
  }

  function renderMenu(content, mode = null) {
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
      return renderSectionedMenu(content, mode);
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
          <div class="popularCard">
            <span>${item.name}</span>
            <span class="price">${item.price}</span>
          </div>
        `).join("")}
      </div>
    `;

    hero.after(section);
  }

  function bindSubTabs(panelBody, content, mode = null) {
    const tabs = panelBody.querySelectorAll(".menuSubTab");
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = (content.sections || [])
      .map(section => ({
        ...section,
        items: filterSectionItemsByMode(section, mode)
      }))
      .filter(section => (section.items || []).length > 0);

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

  function setupCenterWrap(wrap) {
    const buttons = [...wrap.querySelectorAll(".menuCenterBtn")];
    const panelBody = wrap.querySelector(".menuPanelBody");

    if (!buttons.length || !panelBody) return;

    function activateButton(clickedButton) {
      const cat = clickedButton.dataset.cat;
      const mode = clickedButton.dataset.mode || null;

      buttons.forEach(button => {
        button.classList.toggle("active", button === clickedButton);
      });

      const content = CATEGORY_CONTENT[cat];

      if (!content) {
        panelBody.innerHTML = `
          <div class="menuEmpty">
            This section will be updated soon.
          </div>
        `;
        return;
      }

      // Food / grouped categories keep subsection tabs
      if (content.sections) {
        panelBody.innerHTML = renderMenu(content, mode);
        bindSubTabs(panelBody, content, mode);
        return;
      }

      // Fallback
      panelBody.innerHTML = renderMenu(content, mode);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        activateButton(button);
      });
    });

    panelBody.innerHTML = `
      <div class="menuEmpty">
        Click a category above or below to view menu items.
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
        panel.querySelectorAll(".menuCenterWrap").forEach(setupCenterWrap);
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
