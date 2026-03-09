document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

  function renderFlatMenu(items) {
    return `
      <div class="menuList">
        ${items.map(i => `
          <div class="menuItem">
            <div>
              <div class="menuItem__name">${i.name}</div>
              <div class="menuItem__desc">${i.desc || ""}</div>
            </div>
            <div class="menuItem__price">${i.price || ""}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderSectionedMenu(data) {
    return `
      <div class="menuSectioned">
        ${data.sections.map(section => `
          <div class="menuSectionBlock">
            <div class="menuSectionBlock__title">${section.title}</div>
            <div class="menuList">
              ${section.items.map(i => `
                <div class="menuItem">
                  <div>
                    <div class="menuItem__name">${i.name}</div>
                    <div class="menuItem__desc">${i.desc || ""}</div>
                  </div>
                  <div class="menuItem__price">${i.price || ""}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
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

    if (content.sections) {
      return renderSectionedMenu(content);
    }

    return `
      <div class="menuPromo">
        <div class="menuPromoIcon">✨</div>
        <div class="menuPromoTitle">Coming Soon</div>
        <div class="menuPromoText">This section will be updated soon.</div>
      </div>
    `;
  }

  function setupCategoryBar(bar) {
    const scope = bar.dataset.scope;
    const panel = bar.closest(".dayPanel");
    const body = panel ? panel.querySelector(`[data-scopebody="${scope}"]`) : null;
    const buttons = [...bar.querySelectorAll(".cat")];

    if (!body || !buttons.length) return;

    function activate(cat) {
      buttons.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
      body.innerHTML = renderMenu(CATEGORY_CONTENT[cat]);
    }

    buttons.forEach(btn => {
      btn.onclick = () => activate(btn.dataset.cat);
    });

    activate(buttons[0].dataset.cat);
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const active = panel.dataset.daypanel === day;
      panel.classList.toggle("active", active);

      if (active) {
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