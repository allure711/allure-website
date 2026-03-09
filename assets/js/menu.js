document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

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

  function renderNestedSectionedMenu(content) {
    const firstSection = content.sections[0];

    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${content.sections.map((section, index) => `
            <button
              class="menuSubTab ${index === 0 ? "active" : ""}"
              type="button"
              data-subsection="${section.title}">
              ${section.title}
            </button>
          `).join("")}
        </div>

        <div class="menuSubBody">
          <div class="menuSectionBlock">
            <div class="menuSectionBlock__title">${firstSection.title}</div>
            ${renderFlatMenu(firstSection.items || [])}
          </div>
        </div>
      </div>
    `;
  }

  function renderMenu(content) {
    if (!content) {
      return `
        <div class="menuPromo">
          <div class="menuPromoIcon">✨</div>
          <div class="menuPromoTitle">Coming Soon</div>
          <div class="menuPromoText">This section will be updated soon.</div>
        </div>
      `;
    }

    if (Array.isArray(content)) {
      return renderFlatMenu(content);
    }

    if (content && Array.isArray(content.sections)) {
      return renderNestedSectionedMenu(content);
    }

    return `
      <div class="menuPromo">
        <div class="menuPromoIcon">✨</div>
        <div class="menuPromoTitle">Coming Soon</div>
        <div class="menuPromoText">This section will be updated soon.</div>
      </div>
    `;
  }

  function bindNestedSectionTabs(body, content) {
    const subTabs = body.querySelectorAll(".menuSubTab");
    const subBody = body.querySelector(".menuSubBody");

    if (!subTabs.length || !subBody || !content || !content.sections) return;

    function activateSubsection(title) {
      subTabs.forEach(tab => {
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

    subTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });
  }

  function setupCategoryBar(bar) {
    const scope = bar.dataset.scope;
    const panel = bar.closest(".dayPanel");
    const body = panel ? panel.querySelector(`[data-scopebody="${scope}"]`) : null;
    const buttons = [...bar.querySelectorAll(".cat")];

    if (!body || !buttons.length) return;

    function activate(cat) {
      buttons.forEach(button => {
        button.classList.toggle("active", button.dataset.cat === cat);
      });

      const content = CATEGORY_CONTENT[cat];
      body.innerHTML = renderMenu(content);

      if (content && content.sections) {
        bindNestedSectionTabs(body, content);
      }
    }

    buttons.forEach(button => {
      button.onclick = () => activate(button.dataset.cat);
    });

    activate(buttons[0].dataset.cat);
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const isActive = panel.dataset.daypanel === day;
      panel.classList.toggle("active", isActive);

      if (isActive) {
        panel.querySelectorAll(".catBar").forEach(setupCategoryBar);
      }
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });

  activateDay("monday");
});