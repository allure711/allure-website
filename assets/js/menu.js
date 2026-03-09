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

  function animateBodyOpen(body) {
    body.classList.remove("menuBodyAnimated");
    void body.offsetWidth;
    body.classList.add("menuBodyAnimated");
  }

  function bindNestedTabs(body, content) {
    const subTabs = body.querySelectorAll(".menuSubTab");
    const subBody = body.querySelector(".menuSubBody");

    function activate(title) {
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

      animateBodyOpen(subBody);
    }

    subTabs.forEach(tab => {
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
      animateBodyOpen(body);

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
        panel.querySelectorAll(".catBar").forEach(setupCategoryBar);
      }
    });
  }

  function getTodayMenuDay() {
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    return dayNames[new Date().getDay()];
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.onclick = () => activateDay(tab.dataset.daytab);
  });

  activateDay(getTodayMenuDay());
});
window.MENU_HIGHLIGHTS = {
  sunday: [
    { name: "Salmon Dinner", price: "$20" },
    { name: "Hookah", price: "$23" },
    { name: "House Wine", price: "$6" },
    { name: "Fishbowl", price: "$23" }
  ],
  monday: [
    { name: "Salmon Sliders", price: "$12" },
    { name: "Hookah", price: "$23" },
    { name: "Allure Lemon Drop", price: "$10" },
    { name: "Fishbowl", price: "$23" }
  ],
  tuesday: [
    { name: "Chicken Tacos", price: "$14" },
    { name: "Shrimp Tacos", price: "$16" },
    { name: "Margarita", price: "$10" },
    { name: "Hookah", price: "$23" }
  ],
  wednesday: [
    { name: "Rasta Pasta", price: "$16+" },
    { name: "Vodka Mix", price: "$10" },
    { name: "High Noon", price: "$8" },
    { name: "Hookah", price: "$23" }
  ],
  thursday: [
    { name: "Wings", price: "$12+" },
    { name: "Long Island", price: "$10" },
    { name: "Fishbowl", price: "$23" },
    { name: "Hookah", price: "$23" }
  ],
  friday: [
    { name: "Bottles", price: "VIP" },
    { name: "Hookah", price: "$23" },
    { name: "Fishbowl", price: "$23" },
    { name: "Casamigos Mix", price: "$14" }
  ],
  saturday: [
    { name: "Bottles", price: "VIP" },
    { name: "Hookah", price: "$23" },
    { name: "Fishbowl", price: "$23" },
    { name: "Clase Azul", price: "Market" }
  ]
};