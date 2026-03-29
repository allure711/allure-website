document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const LEADS_STORAGE_KEY = "allure_vip_leads";
  const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwQLxbu0MUJgAeDVbEcoiNzgGUJJxw1or37j7O3kUMciqTZv1odLCP5SIgfLrk3Dfuq/exec";

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

  const OFFER_EXPERIENCES = {
    vip: {
      key: "vip",
      badge: "VIP ACCESS",
      title: "VIP ACCESS UNLOCKED",
      text: "Exclusive rewards, premium offers, and stronger odds inside the 24 Box Game.",
      icon: "🥂",
      theme: "vip"
    },
    teachers: {
      key: "teachers",
      badge: "TEACHERS ONLY",
      title: "TEACHERS APPRECIATION",
      text: "Special appreciation rewards for teachers. Enter your phone or Instagram to unlock your teacher-only box.",
      icon: "🍎",
      theme: "teachers"
    },
    dc: {
      key: "dc",
      badge: "DC LOCALS",
      title: "DC RESIDENT SPECIAL",
      text: "Exclusive local rewards for DC residents. Scan, unlock, and enjoy a locals-only Allure experience.",
      icon: "📍",
      theme: "dc"
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

  function getOfferFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const offer = String(params.get("offer") || "").toLowerCase().trim();
    return OFFER_EXPERIENCES[offer] ? offer : "";
  }

  function getOfferConfig() {
    const offer = getOfferFromUrl();
    return offer ? OFFER_EXPERIENCES[offer] : null;
  }

  function updateDailyPromo(day) {
    const promoLabel = document.getElementById("promoLabel");
    const promoText = document.getElementById("promoText");
    const promo = DAILY_PROMOS[day];
    const offerConfig = getOfferConfig();

    if (!promoLabel || !promoText) return;

    if (offerConfig) {
      promoLabel.textContent = offerConfig.badge;
      promoText.textContent = offerConfig.text;
      return;
    }

    if (!promo) return;
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
     OFFER BANNER
  ========================= */

  function injectOfferBanner() {
    const offerConfig = getOfferConfig();
    if (!offerConfig) return;
    if (document.getElementById("offerExperienceBanner")) return;

    const target = document.querySelector(".menuWelcomeStrip");
    if (!target) return;

    const banner = document.createElement("section");
    banner.id = "offerExperienceBanner";
    banner.className = `offerExperienceBanner offerExperienceBanner--${offerConfig.theme}`;
    banner.innerHTML = `
      <div class="offerExperienceBanner__glow"></div>
      <div class="offerExperienceBanner__inner">
        <div class="offerExperienceBanner__copy">
          <div class="offerExperienceBanner__eyebrow">${offerConfig.badge}</div>
          <div class="offerExperienceBanner__title">${offerConfig.title}</div>
          <div class="offerExperienceBanner__text">${offerConfig.text}</div>
        </div>
        <div class="offerExperienceBanner__icon">${offerConfig.icon}</div>
      </div>
    `;

    target.parentNode.insertBefore(banner, target);
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

  function getLeadModalContent(type, offerConfig) {
    const defaultTitleMap = {
      ig: "Instagram Entry",
      phone: "Phone Entry",
      vip: "VIP Entry"
    };

    const defaultSubMap = {
      ig: "Enter your Instagram to unlock the mystery boxes.",
      phone: "Enter your phone number to unlock the mystery boxes.",
      vip: "Enter both Instagram and phone number to unlock VIP."
    };

    if (!offerConfig) {
      return {
        title: defaultTitleMap[type] || "Entry",
        sub: defaultSubMap[type] || ""
      };
    }

    if (offerConfig.key === "vip") {
      if (type === "ig") return { title: "VIP Instagram Entry", sub: "Enter your Instagram to unlock VIP-only rewards." };
      if (type === "phone") return { title: "VIP Phone Entry", sub: "Enter your phone number to unlock VIP-only rewards." };
      return { title: "VIP Full Access", sub: "Enter both Instagram and phone number for premium VIP reward odds." };
    }

    if (offerConfig.key === "teachers") {
      if (type === "ig") return { title: "Teacher Instagram Entry", sub: "Enter your Instagram to unlock teacher appreciation rewards." };
      if (type === "phone") return { title: "Teacher Phone Entry", sub: "Enter your phone number to unlock teacher appreciation rewards." };
      return { title: "Teacher Full Access", sub: "Enter both Instagram and phone number for stronger teacher-only offers." };
    }

    if (offerConfig.key === "dc") {
      if (type === "ig") return { title: "DC Instagram Entry", sub: "Enter your Instagram to unlock DC residents rewards." };
      if (type === "phone") return { title: "DC Phone Entry", sub: "Enter your phone number to unlock DC residents rewards." };
      return { title: "DC Local Access", sub: "Enter both Instagram and phone number for stronger DC locals-only offers." };
    }

    return {
      title: defaultTitleMap[type] || "Entry",
      sub: defaultSubMap[type] || ""
    };
  }

  /* =========================
     LEAD MODAL
  ========================= */

  function closeLeadModal() {
    document.querySelector(".leadModalOverlay")?.remove();
  }

  function openLeadModal(type, panel, day) {
    closeLeadModal();

    const offerConfig = getOfferConfig();
    const content = getLeadModalContent(type, offerConfig);

    const overlay = document.createElement("div");
    overlay.className = "leadModalOverlay";

    overlay.innerHTML = `
      <div class="leadModal">
        <button class="leadModal__close" type="button" data-close-modal>×</button>
        <div class="leadModal__title">${content.title}</div>
        <div class="leadModal__sub">${content.sub}</div>

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
        state.textContent = "Please enter both Instagram and phone number to continue.";
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

  function getGameItems(type, offerKey = "") {
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

    const teacherRewards = [
      "Teacher Free Mixer",
      "15% Off Food",
      "$5 Off Hookah",
      "Free Shot w/ Purchase",
      "Teacher VIP Line Skip",
      "$5 Off Fishbowl",
      "Priority Seating",
      "Teacher Appreciation Reward"
    ];

    const dcRewards = [
      "DC Local Discount",
      "15% Off Food",
      "$5 Off Hookah",
      "$5 Off Tower",
      "Free Mixer",
      "Locals VIP Line Skip",
      "Reserved Seating",
      "DC Resident Reward"
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

    if (offerKey === "vip") {
      pool = [...vipRewards, ...vipRewards, ...phoneRewards, ...fillers];
    } else if (offerKey === "teachers") {
      pool = [...teacherRewards, ...teacherRewards, ...igRewards, ...fillers];
    } else if (offerKey === "dc") {
      pool = [...dcRewards, ...dcRewards, ...phoneRewards, ...fillers];
    } else if (type === "phone") {
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

  function getLeadGateCopy(offerConfig) {
    if (!offerConfig) {
      return {
        title: "Unlock Your VIP Mystery Box",
        text: "Enter your Instagram or phone number to play.<br>Enter both for VIP reward odds.",
        igLabel: "Instagram",
        phoneLabel: "Phone",
        vipLabel: "VIP"
      };
    }

    if (offerConfig.key === "vip") {
      return {
        title: "Unlock Your VIP Mystery Box",
        text: "VIP access is active. Enter your Instagram or phone number to unlock premium rewards.<br>Enter both for stronger VIP odds.",
        igLabel: "VIP Instagram",
        phoneLabel: "VIP Phone",
        vipLabel: "Full VIP"
      };
    }

    if (offerConfig.key === "teachers") {
      return {
        title: "Teachers Appreciation Box",
        text: "Teachers-only rewards are active. Enter your Instagram or phone number to play.<br>Enter both for stronger appreciation rewards.",
        igLabel: "Teacher Instagram",
        phoneLabel: "Teacher Phone",
        vipLabel: "Teacher VIP"
      };
    }

    return {
      title: "DC Locals Mystery Box",
      text: "DC residents rewards are active. Enter your Instagram or phone number to play.<br>Enter both for stronger local rewards.",
      igLabel: "DC Instagram",
      phoneLabel: "DC Phone",
      vipLabel: "DC VIP"
    };
  }

  function renderLeadGate(panel, day = getTodayName()) {
    const offerConfig = getOfferConfig();
    const copy = getLeadGateCopy(offerConfig);

    panel.innerHTML = `
      <div class="hybridGame">
        ${offerConfig ? `
          <div class="mysteryOfferBadge">${offerConfig.badge}</div>
        ` : ""}
        ${getPromoCard(day)}

        <div class="hybridTitle">${copy.title}</div>
        <div class="hybridSub">
          ${copy.text}
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="ig">${copy.igLabel}</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="phone">${copy.phoneLabel}</button>
          <button class="hybridBtn hybridBtn--gold" type="button" data-entry="vip">${copy.vipLabel}</button>
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
    const offerConfig = getOfferConfig();
    const offerKey = offerConfig?.key || "";
    const items = getGameItems(entryType, offerKey);

    panel.innerHTML = `
      <div class="hybridGame mysteryGameShell">
        <div class="mysteryGameTopbar">
          <button class="mysteryBackBtn" type="button" data-back>Back</button>
        </div>

        ${offerConfig ? `
          <div class="mysteryOfferBadge">${offerConfig.badge}</div>
        ` : ""}

        <div class="mysteryMetaTop">
          ${entryType === "ig" ? `Instagram: ${instagram}` : ""}
          ${entryType === "phone" ? `Phone: ${phone}` : ""}
          ${entryType === "vip" ? `Instagram: ${instagram} • Phone: ${phone}` : ""}
        </div>

        <div class="mysteryRewardTop" id="rewardTop">
          <div class="mysteryRewardTop__label">You Won</div>
          <div class="mysteryRewardTop__text" id="rewardTopText">Pick a box to reveal your reward</div>
        </div>

        <div class="hybridTitle">🎁 Mystery Box Game</div>

        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox" type="button" data-box="${i}">
              ${i + 1}
            </button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div class="mysteryRevealText" id="revealText">Pick a box</div>
        </div>
      </div>
    `;

    const boxes = [...panel.querySelectorAll(".mysteryBox")];
    const revealText = panel.querySelector("#revealText");
    const rewardTop = panel.querySelector("#rewardTop");
    const rewardTopText = panel.querySelector("#rewardTopText");
    let used = false;

    boxes.forEach((box, i) => {
      box.addEventListener("click", async () => {
        if (used) return;
        used = true;

        const reward = items[i];
        revealText.textContent = reward;
        rewardTop.classList.add("is-visible");
        rewardTopText.textContent = reward;

        boxes.forEach((b, idx) => {
          if (idx === i) {
            b.textContent = "OPEN";
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
          boxNumber: i + 1,
          offer: offerKey || ""
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
    const offerConfig = getOfferConfig();

    const gameBtn = buttons.find(isGameButton);
    const firstFoodBtn = buttons.find(btn => btn.dataset.cat === "food");
    const firstAnyCategoryBtn = buttons.find(btn => btn.dataset.cat);

    const targetBtn = offerConfig
      ? gameBtn
      : (gameBtn || firstFoodBtn || firstAnyCategoryBtn);

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

  injectOfferBanner();

  const today = getTodayName();
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  activateDay(hasTodayTab ? today : fallbackDay);

  window.getAllureLeads = () => getStoredLeads();
});