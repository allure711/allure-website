document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const GAME_CONFIG = window.ALLURE_GAME_CONFIG || {};
  const GAME_REWARDS = GAME_CONFIG.rewards || {};
  const LEADS_STORAGE_KEY = "allure_vip_leads";
  const SHEETS_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwQLxbu0MUJgAeDVbEcoiNzgGUJJxw1or37j7O3kUMciqTZv1odLCP5SIgfLrk3Dfuq/exec";

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
      theme: "vip",
      rewardBoost: "vip"
    },
    teachers: {
      key: "teachers",
      badge: "TEACHERS ONLY",
      title: "TEACHERS APPRECIATION",
      text: "Special appreciation rewards for teachers. Enter your phone or Instagram to unlock your teacher-only box.",
      icon: "🍎",
      theme: "teachers",
      rewardBoost: "teachers"
    },
    dc: {
      key: "dc",
      badge: "DC LOCALS",
      title: "DC RESIDENT SPECIAL",
      text: "Exclusive local rewards for DC residents. Scan, unlock, and enjoy a locals-only Allure experience.",
      icon: "📍",
      theme: "dc",
      rewardBoost: "dc"
    }
  };

  const PANEL_BG_MAP = {
    food: "food",
    hookah23: "hookah23",
    game: "game"
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
    const offerKey = getOfferFromUrl();
    return offerKey ? OFFER_EXPERIENCES[offerKey] : null;
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
    return normalizePhone(value).length >= 10;
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

  function getPanelBackground(catKey, isGame = false) {
    if (isGame) return PANEL_BG_MAP.game;
    return PANEL_BG_MAP[catKey] || "";
  }

  function setPanelBackground(panel, bgKey) {
    if (!panel) return;
    if (bgKey) {
      panel.dataset.bg = bgKey;
    } else {
      delete panel.dataset.bg;
    }
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

  function getHeroProofNumber(day, offerKey = "") {
    const base = {
      sunday: 31,
      monday: 37,
      tuesday: 34,
      wednesday: 29,
      thursday: 42,
      friday: 64,
      saturday: 71
    };

    const bonus = {
      vip: 12,
      teachers: 6,
      dc: 8
    };

    return (base[day] || 37) + (bonus[offerKey] || 0);
  }

  function getGameHeroContent(day, offerConfig) {
    if (offerConfig?.key === "vip") {
      return {
        title: "VIP Rewards Are Live",
        text: "Enter your Instagram or phone, play the 24 Box Game, and unlock stronger VIP-only rewards tonight.",
        proof: `🔥 ${getHeroProofNumber(day, "vip")} VIP guests played tonight`
      };
    }

    if (offerConfig?.key === "teachers") {
      return {
        title: "Teachers Appreciation Rewards",
        text: "Enter your Instagram or phone, play the 24 Box Game, and unlock exclusive teacher appreciation perks.",
        proof: `🔥 ${getHeroProofNumber(day, "teachers")} teachers played tonight`
      };
    }

    if (offerConfig?.key === "dc") {
      return {
        title: "DC Locals Rewards Are Live",
        text: "Enter your Instagram or phone, play the 24 Box Game, and unlock DC residents-only rewards tonight.",
        proof: `🔥 ${getHeroProofNumber(day, "dc")} DC locals played tonight`
      };
    }

    const map = {
      sunday: {
        title: "Social Sunday Rewards",
        text: "Play the 24 Box Game for Sunday drink perks, hookah rewards, and surprise offers for tonight."
      },
      monday: {
        title: "Unlock Monday Rewards",
        text: "Play tonight’s 24 Box Game for Free Hookah Monday perks, food offers, and premium surprise rewards."
      },
      tuesday: {
        title: "Taco Tuesday Rewards",
        text: "Play the 24 Box Game to unlock late-night taco perks, drink rewards, and surprise upgrades."
      },
      wednesday: {
        title: "Midweek Rewards Are Live",
        text: "Enter your Instagram or phone, play to win, and unlock premium midweek rewards for tonight."
      },
      thursday: {
        title: "Karaoke Thursday Rewards",
        text: "Play the 24 Box Game for karaoke-night perks, drink rewards, and surprise upgrades."
      },
      friday: {
        title: "Friday VIP Rewards Are Live",
        text: "Tonight’s 24 Box Game is loaded with stronger VIP rewards, bottle perks, and premium wins."
      },
      saturday: {
        title: "Saturday Prime-Time Rewards",
        text: "Play tonight’s 24 Box Game for high-energy weekend rewards, VIP perks, and premium surprise offers."
      }
    };

    const current = map[day] || map.monday;

    return {
      title: current.title,
      text: current.text,
      proof: `🔥 ${getHeroProofNumber(day)} people played tonight`
    };
  }

  function updateGameHero(day) {
    const hero = document.getElementById("gameHero");
    const title = document.getElementById("gameHeroTitle");
    const text = document.getElementById("gameHeroText");
    const plays = document.getElementById("gameHeroPlays");
    const offerConfig = getOfferConfig();

    if (!hero || !title || !text || !plays) return;

    const content = getGameHeroContent(day, offerConfig);

    title.textContent = content.title;
    text.textContent = content.text;
    plays.textContent = content.proof;

    hero.classList.remove(
      "gameHero--sunday",
      "gameHero--monday",
      "gameHero--tuesday",
      "gameHero--wednesday",
      "gameHero--thursday",
      "gameHero--friday",
      "gameHero--saturday",
      "gameHero--pulse"
    );

    hero.classList.add(`gameHero--${day}`);

    if (
      day === "monday" ||
      day === "friday" ||
      day === "saturday" ||
      offerConfig?.key === "vip"
    ) {
      hero.classList.add("gameHero--pulse");
    }
  }

  /* =========================
     STORAGE
  ========================= */

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

  /* =========================
     OFFER BANNER
  ========================= */

  function injectOfferBanner() {
    const offerConfig = getOfferConfig();
    if (!offerConfig) return;
    if (document.getElementById("offerExperienceBanner")) return;

    const target = document.querySelector(".menuWelcomeStrip");
    if (!target || !target.parentNode) return;

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
     MENU RENDER
  ========================= */

  function renderFlatMenu(items = []) {
    return `
      <div class="menuList">
        ${items.map(item => `
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

  function splitShotsAndDrinks(items = []) {
    const shots = [];
    const drinks = [];

    items.forEach(item => {
      const rawPrice = String(item.price || "");
      const parts = rawPrice.split("/").map(part => part.trim()).filter(Boolean);

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
    if (!content || !Array.isArray(content.sections)) return content;
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
          ${sections.map((section, index) => `
            <button
              class="menuSubTab${index === 0 ? " active" : ""}"
              type="button"
              data-subsection="${section.title}"
            >
              ${section.title}
            </button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function renderSubsection(section) {
    if (!section) {
      return `<div class="menuEmpty">Section not found.</div>`;
    }

    if (section.layout === "grouped") {
      return renderGroupedMenu(section);
    }

    return renderFlatMenu(section.items || []);
  }

  function bindSubTabs(panelBody, content) {
    const