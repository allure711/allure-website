document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const LEADS_STORAGE_KEY = "allure_vip_leads";
  const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz8rBH9bdREDbWWElN4lN6zKKKVch3f1FhEqFY-maTmU-BATcSmZXUF3AzNNIBxY3zt/exec";

  const DAILY_PROMOS = {
    sunday: {
      label: "SOCIAL SUNDAY",
      text: "Chill vibes, drinks, hookah & music",
      icon: "✨",
      theme: "social"
    },
    monday: {
      label: "FREE HOOKAH MONDAY",
      text: "With $50 bar tab — your choice of flavor",
      icon: "💨",
      theme: "hookah"
    },
    tuesday: {
      label: "TACO TUESDAY",
      text: "Tacos, drinks & late-night vibes",
      icon: "🌮",
      theme: "taco"
    },
    wednesday: {
      label: "WEEKDAYS WEDNESDAY",
      text: "Midweek energy, cocktails & hookah",
      icon: "🍸",
      theme: "midweek"
    },
    thursday: {
      label: "KARAOKE THURSDAY",
      text: "Sing, sip & vibe all night",
      icon: "🎤",
      theme: "karaoke"
    },
    friday: {
      label: "ALLURE FRIDAY",
      text: "VIP energy, bottles & late-night music",
      icon: "🥂",
      theme: "vip"
    },
    saturday: {
      label: "ALLURE SATURDAY",
      text: "Weekend prime time, hookah & VIP tables",
      icon: "🔥",
      theme: "weekend"
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

  function getTableFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("table") ||
      params.get("tab") ||
      params.get("seat") ||
      params.get("station") ||
      "walk-in"
    );
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

  function isGameButton(button) {
    if (!button) return false;

    const action = (button.dataset.action || "").toLowerCase();
    const cat = (button.dataset.cat || "").toLowerCase();
    const text = (button.textContent || "").toLowerCase().trim();

    return (
      action === "game" ||
      cat === "game" ||
      cat === "24box" ||
      cat === "24boxgame" ||
      text.includes("24 box game")
    );
  }

  function getStoredLeads() {
    try {
      const raw = localStorage.getItem(LEADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function saveLead(lead) {
    try {
      const current = getStoredLeads();
      current.push(lead);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      console.error("Could not save lead:", error);
    }
  }

  async function sendLeadToGoogleSheet(lead) {
    if (!SHEETS_WEB_APP_URL) return;

    try {
      await fetch(SHEETS_WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(lead)
      });
    } catch (error) {
      console.error("Could not send lead to Google Sheet:", error);
    }
  }

  function normalizeInstagram(value) {
    const clean = String(value || "").trim();
    if (!clean) return "";
    return clean.startsWith("@") ? clean : `@${clean}`;
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function isValidInstagram(value) {
    const clean = String(value || "").trim().replace(/^@/, "");
    return /^[a-zA-Z0-9._]{2,30}$/.test(clean);
  }

  function isValidPhone(value) {
    const digits = normalizePhone(value);
    return digits.length >= 10;
  }

  function getPromoCard(day) {
    const promo = DAILY_PROMOS[day] || DAILY_PROMOS.monday;

    return `
      <div class="promoDayCard promoDayCard--${promo.theme}">
        <div class="promoDayCard__smoke"></div>
        <div class="promoDayCard__inner">
          <div class="promoDayCard__copy">
            <div class="promoDayCard__title">${promo.label}</div>
            <div class="promoDayCard__text">${promo.text}</div>
          </div>
          <div class="promoDayCard__icon">${promo.icon}</div>
        </div>
      </div>
    `;
  }

  function injectPromoCardStyles() {
    if (document.getElementById("promoDayCardStyles")) return;

    const style = document.createElement("style");
    style.id = "promoDayCardStyles";
    style.textContent = `
      .promoDayCard{
        position:relative;
        overflow:hidden;
        border-radius:18px;
        padding:16px 18px;
        margin-bottom:14px;
        border:1px solid rgba(215,180,106,.22);
        background:
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
        box-shadow:
          0 0 0 1px rgba(255,255,255,.02),
          0 16px 34px rgba(0,0,0,.22),
          inset 0 1px 0 rgba(255,255,255,.04);
      }

      .promoDayCard__smoke{
        position:absolute;
        inset:0;
        pointer-events:none;
        opacity:.95;
        background:
          radial-gradient(circle at 18% 30%, rgba(255,255,255,.10), transparent 28%),
          radial-gradient(circle at 78% 72%, rgba(215,180,106,.12), transparent 34%);
        filter:blur(16px);
        animation:promoSmokeFloat 8s ease-in-out infinite;
      }

      .promoDayCard__inner{
        position:relative;
        z-index:2;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:16px;
      }

      .promoDayCard__copy{
        min-width:0;
      }

      .promoDayCard__title{
        font-size:13px;
        font-weight:950;
        letter-spacing:.16em;
        text-transform:uppercase;
        color:#f2d38a;
        text-shadow:
          0 0 8px rgba(242,211,138,.22),
          0 0 20px rgba(215,180,106,.12);
      }

      .promoDayCard__text{
        margin-top:6px;
        color:rgba(255,255,255,.82);
        font-size:13px;
        line-height:1.5;
      }

      .promoDayCard__icon{
        flex:0 0 auto;
        font-size:28px;
        line-height:1;
        filter:drop-shadow(0 0 10px rgba(215,180,106,.20));
        opacity:.96;
      }

      .promoDayCard--hookah{
        border-color:rgba(215,180,106,.28);
        background:
          radial-gradient(circle at top right, rgba(215,180,106,.10), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--taco{
        border-color:rgba(255,180,80,.26);
        background:
          radial-gradient(circle at top right, rgba(255,180,80,.12), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--midweek{
        border-color:rgba(155,120,255,.24);
        background:
          radial-gradient(circle at top right, rgba(155,120,255,.12), transparent 38%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--karaoke{
        border-color:rgba(255,120,190,.24);
        background:
          radial-gradient(circle at top right, rgba(255,120,190,.10), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--vip{
        border-color:rgba(215,180,106,.34);
        background:
          radial-gradient(circle at top right, rgba(155,70,255,.16), transparent 38%),
          radial-gradient(circle at top left, rgba(215,180,106,.10), transparent 34%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--weekend{
        border-color:rgba(255,120,120,.24);
        background:
          radial-gradient(circle at top right, rgba(255,120,120,.12), transparent 36%),
          radial-gradient(circle at top left, rgba(215,180,106,.08), transparent 32%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoDayCard--social{
        border-color:rgba(120,190,255,.22);
        background:
          radial-gradient(circle at top right, rgba(120,190,255,.10), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .leadGateLayout{
        display:grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
        gap:16px;
        align-items:start;
      }

      .leadGateLeft{
        min-width:0;
      }

      .leadGateRight{
        min-width:0;
      }

      .leadSidePanel{
        display:none;
        border:1px solid rgba(215,180,106,.24);
        border-radius:16px;
        background:
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
        box-shadow:
          0 0 0 1px rgba(255,255,255,.02),
          0 16px 34px rgba(0,0,0,.18),
          inset 0 1px 0 rgba(255,255,255,.04);
        padding:14px;
      }

      .leadSidePanel.is-open{
        display:block;
      }

      .leadSidePanel__title{
        font-size:12px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:#f2d38a;
        margin-bottom:10px;
      }

      .leadSidePanel__grid{
        display:grid;
        gap:10px;
      }

      .leadHint{
        font-size:12px;
        color:rgba(255,255,255,.68);
        line-height:1.45;
      }

      @keyframes promoSmokeFloat{
        0%,100%{ transform:translate(0,0) scale(1); opacity:.82; }
        50%{ transform:translate(8px,-8px) scale(1.06); opacity:1; }
      }

      @media (max-width: 820px){
        .leadGateLayout{
          grid-template-columns:1fr;
        }

        .leadSidePanel{
          display:block;
        }
      }
    `;
    document.head.appendChild(style);
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

  function renderLeadGate(panel, day = getTodayName()) {
    injectPromoCardStyles();

    panel.innerHTML = `
      <div class="hybridGame">
        ${getPromoCard(day)}

        <div class="leadGateLayout">
          <div class="leadGateLeft">
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
          </div>

          <div class="leadGateRight">
            <div class="leadSidePanel" data-side-panel>
              <div class="leadSidePanel__title" data-side-title>Select an option</div>
              <div class="leadSidePanel__grid">
                <input class="staffInput" type="text" placeholder="@instagram" data-ig-input style="display:none;">
                <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input style="display:none;">
                <button class="hybridBtn hybridBtn--gold" type="button" data-unlock>Unlock Boxes</button>
                <div class="staffState" data-state>Please select Instagram, Phone, or VIP to continue.</div>
              </div>
            </div>

            <div class="leadHint" data-side-hint>
              Tap Instagram, Phone, or VIP and the input box will open here.
            </div>
          </div>
        </div>
      </div>
    `;

    const igInput = panel.querySelector("[data-ig-input]");
    const phoneInput = panel.querySelector("[data-phone-input]");
    const state = panel.querySelector("[data-state]");
    const entryButtons = [...panel.querySelectorAll("[data-entry]")];
    const sidePanel = panel.querySelector("[data-side-panel]");
    const sideTitle = panel.querySelector("[data-side-title]");
    const sideHint = panel.querySelector("[data-side-hint]");

    let entryType = "";

    function setEntry(type) {
      entryType = type;

      entryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.entry === type);
      });

      sidePanel.classList.add("is-open");
      sideHint.style.display = "none";

      if (type === "ig") {
        sideTitle.textContent = "Instagram entry";
        igInput.style.display = "";
        phoneInput.style.display = "none";
        phoneInput.value = "";
        state.textContent = "Please enter your Instagram to continue.";
      } else if (type === "phone") {
        sideTitle.textContent = "Phone entry";
        igInput.style.display = "none";
        phoneInput.style.display = "";
        igInput.value = "";
        state.textContent = "Please enter your phone number to continue.";
      } else if (type === "vip") {
        sideTitle.textContent = "VIP entry";
        igInput.style.display = "";
        phoneInput.style.display = "";
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
      }
    }

    entryButtons.forEach(btn => {
      btn.addEventListener("click", () => setEntry(btn.dataset.entry));
    });

    panel.querySelector("[data-unlock]").addEventListener("click", () => {
      const ig = normalizeInstagram(igInput.value);
      const phone = normalizePhone(phoneInput.value);

      if (!entryType) {
        state.textContent = "Please select Instagram, Phone, or VIP first.";
        return;
      }

      if (entryType === "ig" && !isValidInstagram(ig)) {
        state.textContent = "Please enter your Instagram to play.";
        return;
      }

      if (entryType === "phone" && !isValidPhone(phone)) {
        state.textContent = "Please enter your phone number to play.";
        return;
      }

      if (entryType === "vip" && (!isValidInstagram(ig) || !isValidPhone(phone))) {
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
        return;
      }

      renderGame(panel, {
        entryType,
        instagram: entryType === "phone" ? "" : ig,
        phone: entryType === "ig" ? "" : phone,
        day
      });
    });
  }

  function renderGame(panel, leadInfo) {
    const { entryType = "ig", instagram = "", phone = "", day = getTodayName() } = leadInfo || {};
    const items = getGameItems(entryType);

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Mystery Box Game</div>

        <div class="hybridSub">
          ${entryType === "ig" ? `Instagram: ${instagram}` : ""}
          ${entryType === "phone" ? `Phone: ${phone}` : ""}
          ${entryType === "vip" ? `Instagram: ${instagram} • Phone: ${phone}` : ""}
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
      box.addEventListener("click", async () => {
        if (used) return;
        used = true;

        const reward = items[i];
        revealText.textContent = reward;

        boxes.forEach((b, idx) => {
          if (idx === i) {
            b.textContent = reward;
            b.classList.add("is-open");
          } else {
            b.classList.add("is-locked");
          }
        });

        const lead = {
          createdAt: new Date().toISOString(),
          day,
          table: getTableFromUrl(),
          entryType,
          instagram,
          phone,
          reward,
          boxNumber: i + 1
        };

        saveLead(lead);
        await sendLeadToGoogleSheet(lead);
      });
    });

    panel.querySelector("[data-back]").addEventListener("click", () => {
      renderLeadGate(panel, day);
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

    const gameBtn = buttons.find(isGameButton);
    const firstFoodBtn = buttons.find(btn => btn.dataset.cat === "food");
    const firstAnyCategoryBtn = buttons.find(btn => btn.dataset.cat);

    const targetBtn = gameBtn || firstFoodBtn || firstAnyCategoryBtn;

    if (!panel || !targetBtn) {
      if (panel) renderLeadGate(panel);
      return;
    }

    buttons.forEach(btn => btn.classList.remove("active"));
    targetBtn.classList.add("active");

    if (isGameButton(targetBtn)) {
      const dayPanel = wrap.closest(".dayPanel");
      const day = dayPanel?.dataset.daypanel || getTodayName();
      renderLeadGate(panel, day);
      return;
    }

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

          if (isGameButton(button)) {
            const dayPanel = wrap.closest(".dayPanel");
            const day = dayPanel?.dataset.daypanel || getTodayName();
            renderLeadGate(panel, day);
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

  window.getAllureLeads = () => getStoredLeads();
});