/* =========================================================
   ALLURE MENU.JS
   Full clean ready-to-paste version
   Includes:
   - Full-screen Temu-style menu overlay
   - Uber-style category dropdown
   - Mobile-first luxury UI behavior
   - Uses window.MENU_CATEGORY_CONTENT if your menu data exists
   ========================================================= */

(function () {
  "use strict";

  const MENU_DATA =
    window.MENU_CATEGORY_CONTENT && Array.isArray(window.MENU_CATEGORY_CONTENT)
      ? window.MENU_CATEGORY_CONTENT
      : [
          {
            title: "Happy Hour",
            items: [
              { name: "$5 Shots", desc: "All night special", price: "$5" },
              { name: "Margarita Tower", desc: "Perfect for groups", price: "$30" },
              { name: "Allure House Favorite", desc: "Ask bartender", price: "Ask" }
            ]
          },
          {
            title: "Hookah",
            items: [
              { name: "Regular Hookah", desc: "Classic flavors", price: "$35" },
              { name: "Premium Hookah", desc: "Premium flavor upgrade", price: "$45" },
              { name: "Refill", desc: "Charcoal / flavor refresh", price: "Ask" }
            ]
          },
          {
            title: "Shots",
            items: [
              { name: "Tequila Shot", desc: "House tequila", price: "$8" },
              { name: "Hennessy Shot", desc: "Premium pour", price: "$12" },
              { name: "Casamigos Shot", desc: "Premium tequila", price: "$14" }
            ]
          },
          {
            title: "Towers",
            items: [
              { name: "Margarita Tower", desc: "Signature tower", price: "$30" },
              { name: "Blue Allure Tower", desc: "Sweet, bold, electric", price: "$35" },
              { name: "Peach Lemonade Tower", desc: "Smooth group favorite", price: "$35" }
            ]
          }
        ];

  const state = {
    activeCategory: 0,
    isMenuOpen: false,
    isDropdownOpen: false
  };

  document.addEventListener("DOMContentLoaded", initAllureMenu);

  function initAllureMenu() {
    injectMenuShell();
    bindEvents();
    renderCategoryButtons();
    renderDropdown();
    renderMenuItems();
  }

  function injectMenuShell() {
    if (document.querySelector(".allureMenuApp")) return;

    const app = document.createElement("section");
    app.className = "allureMenuApp";
    app.innerHTML = `
      <div class="allureHero">
        <div class="allureHero__badge">ALLURE BAR & LOUNGE</div>
        <h1 class="allureHero__title">Tonight’s Menu</h1>
        <p class="allureHero__text">Drinks, hookah, towers, specials, and group favorites.</p>

        <div class="allureHero__actions">
          <button class="allureMainBtn" type="button" data-open-menu>
            View Full Menu
          </button>

          <button class="allureGhostBtn" type="button" data-scroll-specials>
            See Specials
          </button>
        </div>
      </div>

      <div class="allureQuickBar" data-specials>
        <button class="allureQuickBar__item" type="button" data-open-menu>
          <span>FULL MENU</span>
          <strong>Open today’s menu →</strong>
        </button>

        <button class="allureQuickBar__item" type="button" data-category-shortcut="0">
          <span>POPULAR</span>
          <strong>Happy Hour</strong>
        </button>

        <button class="allureQuickBar__item" type="button" data-category-shortcut="1">
          <span>LOUNGE</span>
          <strong>Hookah</strong>
        </button>
      </div>

      <div class="allureInlineMenu">
        <div class="allureInlineMenu__top">
          <div>
            <span class="allureEyebrow">Browse</span>
            <h2>Menu Categories</h2>
          </div>
          <button class="allureSmallBtn" type="button" data-open-menu>Full Screen</button>
        </div>

        <div class="allureCategoryRow" data-category-row></div>
        <div class="allureCardsGrid" data-inline-items></div>
      </div>

      <div class="temuMenuOverlay" data-menu-overlay aria-hidden="true">
        <div class="temuMenu">
          <header class="temuMenu__header">
            <div>
              <span class="temuMenu__eyebrow">ALLURE</span>
              <h2>Full Menu</h2>
            </div>

            <button class="temuMenu__close" type="button" data-close-menu aria-label="Close menu">
              ×
            </button>
          </header>

          <div class="uberDropdown" data-uber-dropdown>
            <button class="uberDropdown__button" type="button" data-toggle-dropdown>
              <span data-dropdown-label>Categories</span>
              <b>⌄</b>
            </button>
            <div class="uberDropdown__panel" data-dropdown-panel></div>
          </div>

          <div class="temuMenu__body">
            <aside class="temuMenu__side" data-side-cats></aside>
            <main class="temuMenu__content">
              <div class="temuMenu__categoryTitle" data-overlay-title></div>
              <div class="temuMenu__grid" data-overlay-items></div>
            </main>
          </div>
        </div>
      </div>
    `;

    document.body.prepend(app);
  }

  function bindEvents() {
    document.addEventListener("click", function (e) {
      const openBtn = e.target.closest("[data-open-menu]");
      const closeBtn = e.target.closest("[data-close-menu]");
      const overlay = e.target.closest("[data-menu-overlay]");
      const menuBox = e.target.closest(".temuMenu");
      const toggleDropdown = e.target.closest("[data-toggle-dropdown]");
      const shortcut = e.target.closest("[data-category-shortcut]");
      const scrollSpecials = e.target.closest("[data-scroll-specials]");

      if (openBtn) {
        openMenu();
        return;
      }

      if (closeBtn) {
        closeMenu();
        return;
      }

      if (overlay && !menuBox) {
        closeMenu();
        return;
      }

      if (toggleDropdown) {
        toggleUberDropdown();
        return;
      }

      if (shortcut) {
        const index = Number(shortcut.dataset.categoryShortcut || 0);
        setActiveCategory(index);
        openMenu();
        return;
      }

      if (scrollSpecials) {
        const specials = document.querySelector("[data-specials]");
        if (specials) specials.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (!e.target.closest(".uberDropdown")) {
        closeUberDropdown();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeUberDropdown();
        closeMenu();
      }
    });
  }

  function renderCategoryButtons() {
    const row = document.querySelector("[data-category-row]");
    const side = document.querySelector("[data-side-cats]");
    if (!row || !side) return;

    row.innerHTML = "";
    side.innerHTML = "";

    MENU_DATA.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "allureCategoryPill";
      btn.textContent = getCategoryTitle(cat);
      btn.dataset.active = index === state.activeCategory ? "true" : "false";
      btn.addEventListener("click", () => setActiveCategory(index));
      row.appendChild(btn);

      const sideBtn = document.createElement("button");
      sideBtn.type = "button";
      sideBtn.className = "temuSideBtn";
      sideBtn.dataset.active = index === state.activeCategory ? "true" : "false";
      sideBtn.innerHTML = `
        <span>${escapeHTML(getCategoryTitle(cat))}</span>
        <b>${getItems(cat).length}</b>
      `;
      sideBtn.addEventListener("click", () => setActiveCategory(index));
      side.appendChild(sideBtn);
    });
  }

  function renderDropdown() {
    const panel = document.querySelector("[data-dropdown-panel]");
    const label = document.querySelector("[data-dropdown-label]");
    if (!panel || !label) return;

    label.textContent = getCategoryTitle(MENU_DATA[state.activeCategory]);

    panel.innerHTML = MENU_DATA.map((cat, index) => {
      return `
        <button class="uberDropdown__option" type="button" data-dropdown-cat="${index}" data-active="${index === state.activeCategory}">
          <span>${escapeHTML(getCategoryTitle(cat))}</span>
          <b>${getItems(cat).length}</b>
        </button>
      `;
    }).join("");

    panel.querySelectorAll("[data-dropdown-cat]").forEach((btn) => {
      btn.addEventListener("click", function () {
        setActiveCategory(Number(this.dataset.dropdownCat));
        closeUberDropdown();
      });
    });
  }

  function renderMenuItems() {
    const inline = document.querySelector("[data-inline-items]");
    const overlay = document.querySelector("[data-overlay-items]");
    const title = document.querySelector("[data-overlay-title]");

    const cat = MENU_DATA[state.activeCategory];
    const items = getItems(cat);

    if (title) {
      title.innerHTML = `
        <span>${escapeHTML(getCategoryTitle(cat))}</span>
        <strong>${items.length} items</strong>
      `;
    }

    const html = items.map(renderItemCard).join("");

    if (inline) inline.innerHTML = html;
    if (overlay) overlay.innerHTML = html;
  }

  function renderItemCard(item) {
    const name = item.name || item.title || "Menu Item";
    const desc = item.desc || item.description || item.details || "";
    const price = item.price || item.amount || "";

    return `
      <article class="allureItemCard">
        <div class="allureItemCard__main">
          <h3>${escapeHTML(name)}</h3>
          ${desc ? `<p>${escapeHTML(desc)}</p>` : ""}
        </div>
        ${price ? `<div class="allureItemCard__price">${escapeHTML(price)}</div>` : ""}
      </article>
    `;
  }

  function setActiveCategory(index) {
    if (!MENU_DATA[index]) return;
    state.activeCategory = index;
    renderCategoryButtons();
    renderDropdown();
    renderMenuItems();
  }

  function openMenu() {
    const overlay = document.querySelector("[data-menu-overlay]");
    if (!overlay) return;

    state.isMenuOpen = true;
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("allureMenuLocked");
  }

  function closeMenu() {
    const overlay = document.querySelector("[data-menu-overlay]");
    if (!overlay) return;

    state.isMenuOpen = false;
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("allureMenuLocked");
    closeUberDropdown();
  }

  function toggleUberDropdown() {
    state.isDropdownOpen = !state.isDropdownOpen;
    const dropdown = document.querySelector("[data-uber-dropdown]");
    if (dropdown) dropdown.dataset.open = state.isDropdownOpen ? "true" : "false";
  }

  function closeUberDropdown() {
    state.isDropdownOpen = false;
    const dropdown = document.querySelector("[data-uber-dropdown]");
    if (dropdown) dropdown.dataset.open = "false";
  }

  function getCategoryTitle(cat) {
    return cat.title || cat.name || cat.category || "Menu";
  }

  function getItems(cat) {
    if (!cat) return [];
    if (Array.isArray(cat.items)) return cat.items;
    if (Array.isArray(cat.menu)) return cat.menu;
    if (Array.isArray(cat.children)) return cat.children;
    return [];
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();