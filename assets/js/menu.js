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

  /* =========================
     DAY PROMO CARD
  ========================= */

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

  function injectMenuEnhancementStyles() {
    if (document.getElementById("allureMenuEnhancementStyles")) return;

    const style = document.createElement("style");
    style.id = "allureMenuEnhancementStyles";
    style.textContent = `
      .promoDayCard{
        position:relative;
        overflow:hidden;
        border-radius:18px;
        padding:14px 16px;
        margin-bottom:12px;
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
        gap:14px;
      }

      .promoDayCard__copy{
        min-width:0;
      }

      .promoDayCard__title{
        font-size:12px;
        font-weight:950;
        letter-spacing:.15em;
        text-transform:uppercase;
        color:#f2d38a;
        text-shadow:
          0 0 8px rgba(242,211,138,.22),
          0 0 20px rgba(215,180,106,.12);
      }

      .promoDayCard__text{
        margin-top:5px;
        color:rgba(255,255,255,.82);
        font-size:12px;
        line-height:1.4;
      }

      .promoDayCard__icon{
        flex:0 0 auto;
        font-size:24px;
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

      @keyframes promoSmokeFloat{
        0%,100%{ transform:translate(0,0) scale(1); opacity:.82; }
        50%{ transform:translate(8px,-8px) scale(1.06); opacity:1; }
      }

      .leadModalOverlay{
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.72);
        backdrop-filter: blur(4px);
        z-index:9999;
        padding:20px;
      }

      .leadModal{
        width:100%;
        max-width:420px;
        border-radius:18px;
        border:1px solid rgba(215,180,106,.26);
        background:
          radial-gradient(circle at top right, rgba(215,180,106,.12), transparent 35%),
          linear-gradient(180deg, rgba(23,23,25,.98), rgba(12,12,14,.98));
        box-shadow:
          0 24px 60px rgba(0,0,0,.55),
          inset 0 1px 0 rgba(255,255,255,.04);
        padding:18px;
        position:relative;
      }

      .leadModal__close{
        position:absolute;
        top:10px;
        right:12px;
        border:none;
        background:transparent;
        color:rgba(255,255,255,.7);
        font-size:22px;
        cursor:pointer;
      }

      .leadModal__title{
        font-size:12px;
        font-weight:950;
        letter-spacing:.16em;
        text-transform:uppercase;
        color:#f2d38a;
        margin-bottom:8px;
      }

      .leadModal__sub{
        color:rgba(255,255,255,.76);
        font-size:13px;
        line-height:1.45;
        margin-bottom:12px;
      }

      .leadModal__grid{
        display:grid;
        gap:10px;
      }

      .leadModal__grid .staffInput{
        min-height:46px;
        padding:12px 14px;
      }

      .leadModal__grid .hybridBtn{
        min-height:46px;
      }

      .mysteryGameShell{
        position:relative;
      }

      .mysteryGameTopbar{
        display:flex;
        align-items:center;
        justify-content:flex-start;
        margin-bottom:6px;
      }

      .mysteryBackBtn{
        border:1px solid rgba(215,180,106,.28);
        background:rgba(255,255,255,.03);
        color:#f2d38a;
        border-radius:999px;
        padding:6px 10px;
        font-size:10px;
        font-weight:900;
        letter-spacing:.12em;
        text-transform:uppercase;
        cursor:pointer;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
      }

      .mysteryGameShell .hybridTitle{
        font-size:20px;
        margin-bottom:6px;
      }

      .mysteryCompactSub{
        color:rgba(255,255,255,.72);
        font-size:11px;
        line-height:1.25;
        margin-bottom:8px;
      }

      .mysteryGrid{
        display:grid;
        grid-template-columns:repeat(8, minmax(0, 1fr));
        gap:6px;
      }

      .mysteryBox{
        min-height:36px;
        border-radius:10px;
        padding:5px 4px;
        font-size:10px;
        font-weight:900;
        line-height:1.05;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        white-space:normal;
        word-break:break-word;
        overflow:hidden;
      }

      .mysteryBox.is-open{
        font-size:8px;
        line-height:1.05;
      }

      .mysteryReveal{
        margin-top:6px;
      }

      .mysteryRevealText{
        min-height:18px;
        font-size:12px;
        line-height:1.25;
      }

      .menuBigPanel,
      .menuPanelBody,
      .hybridGame{
        overflow:hidden;
      }

      @media (max-width: 1100px){
        .mysteryGrid{
          grid-template-columns:repeat(6, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px){
        .mysteryGrid{
          grid-template-columns:repeat(4, minmax(0, 1fr));
          gap:6px;
        }

        .mysteryBox{
          min-height:38px;
          font-size:10px;
          padding:6px 4px;
        }
      }

      @media (max-width: 520px){
        .mysteryGrid{
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:6px;
        }

        .mysteryBox{
          min-height:40px;
          font-size:10px;
          padding:6px 4px;
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
     LEAD MODAL
  ========================= */

  function closeLeadModal() {
    document.querySelector(".leadModalOverlay")?.remove();
  }

  function openLeadModal(type, panel, day) {
    injectMenuEnhancementStyles();
    closeLeadModal();

    const overlay = document.createElement("div");
    overlay.className = "leadModalOverlay";

    const titleMap = {
      ig: "Instagram Entry",
      phone: "Phone Entry",
      vip: "VIP Entry"
    };

    const subMap = {
      ig: "Enter your Instagram to unlock the mystery boxes.",
      phone: "Enter your phone number to unlock the mystery boxes.",
      vip: "Enter both Instagram and phone number to unlock VIP."
    };

    overlay.innerHTML = `
      <div class="leadModal">
        <button class="leadModal__close" type="button" data-close-modal>×</button>
        <div class="leadModal__title">${titleMap[type] || "Entry"}</div>
        <div class="leadModal__sub">${subMap[type] || ""}</div>

        <div class="leadModal__grid">
          ${type !== "phone" ? `<input class="staffInput" type="text" placeholder="@instagram" data-modal-ig>` : ""}
          ${type !== "ig" ? `<input class="staffInput" type="tel" placeholder="Phone number" data-modal-phone>` : ""}
          <button class="hybridBtn hybridBtn--gold" type="button" data-modal-submit>Unlock Boxes</button>
          <div class="staffState" data-modal-state>Please complete the required field${type === "vip" ? "s" : ""}.</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLeadModal();
    });

    overlay.querySelector("[data-close-modal]").addEventListener("click", closeLeadModal);

    overlay.querySelector("[data-modal-submit]").addEventListener("click", () => {
      const ig = normalizeInstagram(overlay.querySelector("[data-modal-ig]")?.value || "");
      const phone = normalizePhone(overlay.querySelector("[data-modal-phone]")?.value || "");
      const state = overlay.querySelector("[data-modal-state]");

      if (type === "ig" && !isValidInstagram(ig)) {
        state.textContent = "Please enter your Instagram to continue.";
        return;
      }

      if (type === "phone" && !isValidPhone(phone)) {
        state.textContent = "Please enter your phone number to continue.";
        return;
      }

      if (type === "vip" && (!isValidInstagram(ig) || !isValidPhone(phone))) {
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
        return;
      }

      closeLeadModal();

      renderGame(panel, {
        entryType: type,
        instagram: type === "phone" ? "" : ig,
        phone: type === "ig" ? "" : phone,
        day
      });
    });
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
    injectMenuEnhancementStyles();

    panel.innerHTML = `
      <div class="hybridGame">
        ${getPromoCard(day)}

        <div class="hybridTitle">Unlock Your VIP Mystery Box</div>
        <div class="hybridSub">
          Enter your Instagram or phone number to play.<br>
          Enter both for VIP reward odds.
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="ig">Instagram</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="phone">Phone</button>
          <button class="hybridBtn hybridBtn--gold" type="button" data-entry="vip">VIP</button>
        </div>
      </div>
    `;

    panel.querySelectorAll("[data-entry]").forEach(btn => {
      btn.addEventListener("click", () => {
        openLeadModal(btn.dataset.entry, panel, day);
      });
    });
  }

  function renderGame(panel, leadInfo) {
  const { entryType = "ig", instagram = "", phone = "", day = getTodayName() } = leadInfo || {};
  const items = getGameItems(entryType);

  panel.innerHTML = `
    <div class="hybridGame mysteryGameShell">
      <div class="mysteryGameTopbar">
        <button class="mysteryBackBtn" type="button" data-back>Back</button>
      </div>

      <div class="hybridTitle">🎁 Mystery Box Game</div>

      <div class="mysteryCompactSub">
        ${entryType === "ig" ? `Instagram: ${instagram}` : ""}
        ${entryType === "phone" ? `Phone: ${phone}` : ""}
        ${entryType === "vip" ? `Instagram: ${instagram} • Phone: ${phone}` : ""}
      </div>

      <div class="mysteryGrid">
        ${Array.from({ length: 24 }).map((_, i) => `
          <button class="mysteryBox" type="button" data-box="${i}">
            ${i + 1}
          </button>
        `).join("")}
      </div>

      <div class="mysteryReveal">
        <div class="mysteryRevealText" id="revealText">Pick a box to reveal your reward</div>
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

      revealText.textContent = `You won: ${reward}`;

      boxes.forEach((b, idx) => {
        if (idx === i) {
          b.textContent = "OPEN";
          b.classList.add("is-open");
        } else {
          b.classList.add("is-locked");
          b.disabled = true;
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
