document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

  const DAILY_PROMOS = {
    sunday: {
      label: "SOCIAL SUNDAY",
      text: "Chill vibes, hookah, drinks & music"
    },
    monday: {
      label: "FREE HOOKAH MONDAY",
      text: "With $50 bar tab — your choice of flavor"
    },
    tuesday: {
      label: "TACO TUESDAY",
      text: "Tacos, drinks & late night vibes"
    },
    wednesday: {
      label: "WEEKDAYS WEDNESDAY",
      text: "Midweek energy, cocktails & hookah"
    },
    thursday: {
      label: "KARAOKE THURSDAY",
      text: "Sing, drink & vibe all night"
    },
    friday: {
      label: "ALLURE FRIDAY",
      text: "Premium nightlife experience"
    },
    saturday: {
      label: "ALLURE SATURDAY",
      text: "VIP energy, bottles & music"
    }
  };

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
     HELPERS
  ========================= */

  function getTodayName() {
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
  }

  function updateDailyPromo(day) {
    const promoLabel = document.getElementById("promoLabel");
    const promoText = document.getElementById("promoText");
    const promo = DAILY_PROMOS[day];

    if (!promoLabel || !promoText || !promo) return;

    promoLabel.textContent = promo.label;
    promoText.textContent = promo.text;
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
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
              <div class="menuGrouped__boxTitle">${group.title || ""}</div>
              ${renderFlatMenu(group.items || [])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function splitShotsAndDrinks(items) {
    const shots = [];
    const drinks = [];

    (items || []).forEach(item => {
      const price = item.price || "";
      const parts = price.split("/").map(p => p.trim());

      if (parts.length === 2) {
        shots.push({ ...item, price: parts[0] });
        drinks.push({ ...item, price: parts[1] });
      } else {
        shots.push({ ...item });
        drinks.push({ ...item });
      }
    });

    return { shots, drinks };
  }

  function getContentByMode(content, mode) {
    if (!content || !content.sections) return content;
    if (!mode || (mode !== "shots" && mode !== "drinks")) return content;

    return {
      ...content,
      sections: content.sections.map(section => {
        if (section.layout === "grouped") return section;
        const split = splitShotsAndDrinks(section.items || []);
        return {
          ...section,
          items: mode === "shots" ? split.shots : split.drinks
        };
      })
    };
  }

  function renderSectionedMenu(content) {
    const sections = content?.sections || [];

    if (!sections.length) {
      return `<div class="menuEmpty">Menu coming soon.</div>`;
    }

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

  function bindSubTabs(panelBody, content) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content?.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);

      if (!section) {
        subBody.innerHTML = `<div class="menuEmpty">Section not found.</div>`;
        return;
      }

      if (section.layout === "grouped") {
        subBody.innerHTML = renderGroupedMenu(section);
      } else {
        subBody.innerHTML = renderFlatMenu(section.items || []);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);
  }

  /* =========================
     24 BOX GAME
  ========================= */

  function getGameItems(type) {
    const igRewards = [
      "Free Mixer",
      "$2 Off Hookah",
      "$3 Off Fishbowl",
      "$3 Off Tower",
      "10% Off Food",
      "Free Red Bull w/ Drink",
      "Hookah Flavor Upgrade",
      "High Noon Discount"
    ];

    const phoneRewards = [
      "$5 Off Hookah",
      "Free Shot w/ $30 Tab",
      "$5 Off Premium Drink",
      "$5 Off Bottle Service",
      "VIP Line Skip",
      "$3 Off Tower",
      "Taco Discount",
      "Wine Upgrade"
    ];

    const vipRewards = [
      "Free Hookah (Min $50 Tab)",
      "$10 Off Bottle",
      "Premium Shot Upgrade",
      "VIP Table Priority",
      "Premium Hookah Flavor",
      "Fishbowl Discount",
      "Reserved Seating",
      "Weekend VIP Perk"
    ];

    const fillers = [
      "Try Again",
      "Good Vibes",
      "Ask Server",
      "Come Back",
      "Next Time Lucky",
      "Enjoy The Night",
      "Ask About VIP",
      "House Favorite"
    ];

    let pool = [];

    if (type === "phone") {
      pool = [...phoneRewards, ...igRewards, ...fillers];
    } else if (type === "vip") {
      pool = [...vipRewards, ...phoneRewards, ...fillers];
    } else {
      pool = [...igRewards, ...fillers, ...fillers];
    }

    while (pool.length < 24) {
      pool.push("Try Again");
    }

    return shuffle(pool).slice(0, 24);
  }

  function renderLeadGate(panel) {
    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">Unlock Your VIP Mystery Box</div>
        <div class="hybridSub">
          Enter your Instagram or phone number to play.<br>
          Enter both for VIP reward odds.
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="ig">Instagram</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="phone">Phone</button>
          <button class="hybridBtn hybridBtn--gold" type="button" data-entry="vip">VIP (Both)</button>
        </div>

        <div class="staffBox">
          <div style="display:grid;gap:10px;">
            <input class="staffInput" type="text" placeholder="@instagram" data-ig-input style="display:none;">
            <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input style="display:none;">
            <button class="hybridBtn hybridBtn--gold" type="button" data-unlock>Unlock Boxes</button>
          </div>
          <div class="staffState" data-state>Please select Instagram, Phone, or VIP to continue.</div>
        </div>
      </div>
    `;

    const igInput = panel.querySelector("[data-ig-input]");
    const phoneInput = panel.querySelector("[data-phone-input]");
    const state = panel.querySelector("[data-state]");
    const entryButtons = [...panel.querySelectorAll("[data-entry]")];

    let entryType = "";

    function setEntry(type) {
      entryType = type;

      entryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.entry === type);
      });

      if (type === "ig") {
        igInput.style.display = "";
        phoneInput.style.display = "none";
        phoneInput.value = "";
        state.textContent = "Please enter your Instagram to continue.";
      } else if (type === "phone") {
        igInput.style.display = "none";
        phoneInput.style.display = "";
        igInput.value = "";
        state.textContent = "Please enter your phone number to continue.";
      } else if (type === "vip") {
        igInput.style.display = "";
        phoneInput.style.display = "";
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
      }
    }

    entryButtons.forEach(btn => {
      btn.addEventListener("click", () => setEntry(btn.dataset.entry));
    });

    panel.querySelector("[data-unlock]").addEventListener("click", () => {
      const ig = igInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!entryType) {
        state.textContent = "Please select Instagram, Phone, or VIP first.";
        return;
      }

      if (entryType === "ig" && !ig) {
        state.textContent = "Please enter your Instagram to play.";
        return;
      }

      if (entryType === "phone" && !phone) {
        state.textContent = "Please enter your phone number to play.";
        return;
      }

      if (entryType === "vip" && (!ig || !phone)) {
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
        return;
      }

      renderGame(panel, entryType, ig, phone);
    });
  }

  function renderGame(panel, type = "ig", ig = "", phone = "") {
    const items = getGameItems(type);

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Mystery Box Game</div>

        <div class="hybridSub">
          ${type === "ig" ? `Instagram: ${ig}` : ""}
          ${type === "phone" ? `Phone: ${phone}` : ""}
          ${type === "vip" ? `Instagram: ${ig} • Phone: ${phone}` : ""}
        </div>

        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox" type="button" data-box="${i}">
              Box ${i + 1}
            </button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div class="mysteryRevealText" id="revealText">Pick a box</div>
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-back>Back</button>
        </div>
      </div>
    `;

    const boxes = [...panel.querySelectorAll(".mysteryBox")];
    const revealText = panel.querySelector("#revealText");
    let used = false;

    boxes.forEach((box, i) => {
      box.addEventListener("click", () => {
        if (used) return;
        used = true;

        revealText.textContent = items[i];

        boxes.forEach((b, idx) => {
          if (idx === i) {
            b.textContent = items[i];
            b.classList.add("is-open");
          } else {
            b.classList.add("is-locked");
          }
        });
      });
    });

    panel.querySelector("[data-back]").addEventListener("click", () => {
      renderLeadGate(panel);
    });
  }

  /* =========================
     WRAP SETUP
  ========================= */

  function getButtons(wrap) {
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outsideWrap = wrap.parentElement.querySelector(".outsideBottom");
    const outside = outsideWrap ? [...outsideWrap.querySelectorAll(".menuCenterBtn")] : [];
    return [...inside, ...outside];
  }

  function openDefaultCategory(wrap) {
    const panel = wrap.querySelector(".menuPanelBody");
    const buttons = getButtons(wrap);
    const firstFoodBtn = buttons.find(btn => btn.dataset.cat === "food");
    const firstAnyCategoryBtn = buttons.find(btn => btn.dataset.cat);

    const targetBtn = firstFoodBtn || firstAnyCategoryBtn;
    if (!panel || !targetBtn) {
      renderLeadGate(panel);
      return;
    }

    buttons.forEach(btn => btn.classList.remove("active"));
    targetBtn.classList.add("active");

    const catKey = targetBtn.dataset.cat;
    const mode = targetBtn.dataset.mode || "";
    const baseContent = CATEGORY_CONTENT[catKey];

    if (!baseContent) {
      panel.innerHTML = `<div class="menuEmpty">Coming soon.</div>`;
      return;
    }

    const content = getContentByMode(baseContent, mode);
    panel.innerHTML = renderSectionedMenu(content);
    bindSubTabs(panel, content);
  }

  function setupWrap(wrap) {
    const panel = wrap.querySelector(".menuPanelBody");
    if (!panel) return;

    const buttons = getButtons(wrap);

    if (!wrap.dataset.bound) {
      wrap.dataset.bound = "true";

      buttons.forEach(button => {
        button.addEventListener("click", () => {
          buttons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");

          if (button.dataset.action === "game") {
            renderLeadGate(panel);
            return;
          }

          const catKey = button.dataset.cat;
          const mode = button.dataset.mode || "";
          const baseContent = CATEGORY_CONTENT[catKey];

          if (!baseContent) {
            panel.innerHTML = `<div class="menuEmpty">Coming soon.</div>`;
            return;
          }

          const content = getContentByMode(baseContent, mode);
          panel.innerHTML = renderSectionedMenu(content);
          bindSubTabs(panel, content);
        });
      });
    }

    openDefaultCategory(wrap);
  }

  /* =========================
     DAY SWITCH
  ========================= */

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const active = panel.dataset.daypanel === day;
      panel.classList.toggle("active", active);

      if (active) {
        panel.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });

    updateDailyPromo(day);
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => activateDay(tab.dataset.daytab));
  });

  const today = getTodayName();
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  activateDay(hasTodayTab ? today : fallbackDay);
});