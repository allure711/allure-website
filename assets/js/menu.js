document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

  function renderMenu(items) {
    return `
      <div class="menuList">
        ${items.map(i => `
          <div class="menuItem">
            <div>
              <div class="menuItem__name">${i.name}</div>
              <div class="menuItem__desc">${i.desc}</div>
            </div>
            <div class="menuItem__price">${i.price}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function setupCategoryBar(bar) {
    const scope = bar.dataset.scope;
    const body = document.querySelector(`[data-scopebody="${scope}"]`);
    const buttons = [...bar.querySelectorAll(".cat")];

    if (!body || !buttons.length) return;

    function activate(cat) {
      buttons.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
      body.innerHTML = renderMenu(CATEGORY_CONTENT[cat] || []);
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
