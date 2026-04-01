document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const GAME_CONFIG = window.ALLURE_GAME_CONFIG || {};
  const _TOP_SELLERS = window.ALLURE_TOP_SELLERS || {};
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

    if (day === "monday" || day === "friday" || day === "saturday" || offerConfig?.key === "vip") {
      hero.classList.add("gameHero--pulse");
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
     DAY PROMO CARD + STYLES
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
      .offerExperienceBanner{
        position:relative;
        overflow:hidden;
        border-radius:22px;
        margin:2px 0 16px;
        padding:16px 18px;
        border:1px solid rgba(215,180,106,.22);
        background:
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
        box-shadow:
          0 0 0 1px rgba(255,255,255,.02),
          0 20px 46px rgba(0,0,0,.26),
          inset 0 1px 0 rgba(255,255,255,.04);
      }

      .offerExperienceBanner__glow{
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          radial-gradient(circle at 18% 28%, rgba(255,255,255,.08), transparent 28%),
          radial-gradient(circle at 86% 72%, rgba(215,180,106,.12), transparent 30%);
        filter:blur(16px);
      }

      .offerExperienceBanner__inner{
        position:relative;
        z-index:2;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:16px;
      }

      .offerExperienceBanner__eyebrow{
        font-size:11px;
        font-weight:950;
        letter-spacing:.18em;
        text-transform:uppercase;
        color:#f2d38a;
        margin-bottom:6px;
      }

      .offerExperienceBanner__title{
        font-size:26px;
        font-weight:950;
        line-height:1.05;
        color:#fff;
        letter-spacing:-.02em;
      }

      .offerExperienceBanner__text{
        margin-top:8px;
        color:rgba(255,255,255,.82);
        font-size:14px;
        line-height:1.5;
        max-width:760px;
      }

      .offerExperienceBanner__icon{
        flex:0 0 auto;
        font-size:34px;
        line-height:1;
        filter:drop-shadow(0 0 10px rgba(215,180,106,.22));
      }

      .offerExperienceBanner--vip{
        border-color:rgba(215,180,106,.34);
        background:
          radial-gradient(circle at top right, rgba(155,70,255,.16), transparent 38%),
          radial-gradient(circle at top left, rgba(215,180,106,.10), transparent 34%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .offerExperienceBanner--teachers{
        border-color:rgba(255,210,90,.26);
        background:
          radial-gradient(circle at top right, rgba(255,210,90,.12), transparent 36%),
          radial-gradient(circle at top left, rgba(120,180,255,.08), transparent 34%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .offerExperienceBanner--dc{
        border-color:rgba(120,190,255,.24);
        background:
          radial-gradient(circle at top right, rgba(120,190,255,.10), transparent 36%),
          radial-gradient(circle at top left, rgba(215,180,106,.08), transparent 32%),
          linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

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

      .leadModalOverlay{
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(4px);
        z-index:9999;
        padding:20px;
      }

      .leadModal{
        width:100%;
        max-width:430px;
        border-radius:20px;
        border:1px solid rgba(215,180,106,.26);
        background:
          radial-gradient(circle at top right, rgba(215,180,106,.12), transparent 35%),
          linear-gradient(180deg, rgba(23,23,25,.98), rgba(12,12,14,.98));
        box-shadow:
          0 24px 60px rgba(0,0,0,.55),
          inset 0 1px 0 rgba(255,255,255,.04);
        padding:20px;
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
        min-height:48px;
        padding:12px 14px;
      }

      .leadModal__grid .hybridBtn{
        min-height:48px;
      }

      .mysteryGameShell{
        position:relative;
      }

      .mysteryGameTopbar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin-bottom:6px;
      }

      .mysteryTopHint{
        color:rgba(255,255,255,.58);
        font-size:10px;
        letter-spacing:.12em;
        text-transform:uppercase;
        font-weight:800;
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

      .mysteryMetaTop{
        color:rgba(255,255,255,.72);
        font-size:11px;
        line-height:1.3;
        margin-bottom:6px;
      }

      .mysteryRewardTop{
        display:none;
        margin-bottom:8px;
        border:1px solid rgba(215,180,106,.26);
        background:linear-gradient(180deg, rgba(215,180,106,.14), rgba(255,255,255,.03));
        border-radius:14px;
        padding:10px 12px;
        box-shadow:
          0 10px 24px rgba(0,0,0,.14),
          inset 0 1px 0 rgba(255,255,255,.04);
        animation:mysteryPulseIn .22s ease;
      }

      .mysteryRewardTop.is-visible{
        display:block;
      }

      .mysteryRewardTop__label{
        font-size:9px;
        font-weight:900;
        letter-spacing:.16em;
        text-transform:uppercase;
        color:rgba(255,255,255,.66);
        margin-bottom:4px;
      }

      .mysteryRewardTop__text{
        font-size:14px;
        font-weight:900;
        line-height:1.25;
        color:#f2d38a;
      }

      .mysteryGameShell .hybridTitle{
        font-size:18px;
        margin-bottom:2px;
      }

      .mysteryGameSub{
        color:rgba(255,255,255,.68);
        font-size:12px;
        line-height:1.45;
        margin-bottom:8px;
      }

      .mysteryOfferBadge{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        margin-bottom:8px;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid rgba(215,180,106,.26);
        background:rgba(215,180,106,.08);
        color:#f2d38a;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .menuSubTab--upsell{
        border-color: rgba(215,180,106,.38);
        background: linear-gradient(135deg, rgba(215,180,106,.18), rgba(255,255,255,.05));
        color: #f2d38a;
        box-shadow:
          0 8px 18px rgba(215,180,106,.10),
          inset 0 1px 0 rgba(255,255,255,.05);
      }

      .menuSubTab--upsell:hover{
        border-color: rgba(215,180,106,.55);
        background: linear-gradient(135deg, rgba(215,180,106,.24), rgba(255,255,255,.07));
      }

      .menuSubTab--upsell.active{
        border-color: rgba(215,180,106,.55);
        background: linear-gradient(135deg, rgba(215,180,106,.26), rgba(255,255,255,.08));
        color: #f2d38a;
      }

      .mysteryGrid{
        display:grid;
        grid-template-columns:repeat(8, minmax(0, 1fr));
        gap:8px;
      }

      .mysteryBox{
        appearance:none;
        min-height:42px;
        border-radius:12px;
        padding:6px 4px;
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
        border:1px solid rgba(255,255,255,.12);
        background:linear-gradient(135deg, rgba(215,180,106,.20), rgba(255,255,255,.04));
        color:#fff;
        box-shadow:
          0 8px 18px rgba(0,0,0,.12),
          inset 0 1px 0 rgba(255,255,255,.03);
        transition:transform .14s ease, border-color .14s ease, opacity .18s ease, background .18s ease, box-shadow .18s ease;
      }

      .mysteryBox:hover{
        transform:translateY(-1px);
        border-color:rgba(215,180,106,.34);
        box-shadow:
          0 10px 22px rgba(0,0,0,.16),
          0 0 16px rgba(215,180,106,.10),
          inset 0 1px 0 rgba(255,255,255,.04);
      }

      .mysteryBox.is-open{
        background:linear-gradient(135deg, rgba(215,180,106,.22), rgba(255,255,255,.08));
        border-color:rgba(215,180,106,.38);
        color:#f2d38a;
        box-shadow:
          0 12px 24px rgba(0,0,0,.18),
          0 0 18px rgba(215,180,106,.12),
          inset 0 1px 0 rgba(255,255,255,.06);
      }

      .mysteryBox.is-locked{
        opacity:.34;
        cursor:not-allowed;
      }

      .mysteryBox.is-winning{
        animation:mysteryWinFlash .55s ease;
      }

      .mysteryReveal{
        display:none;
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

      @keyframes promoSmokeFloat{
        0%,100%{ transform:translate(0,0) scale(1); opacity:.82; }
        50%{ transform:translate(8px,-8px) scale(1.06); opacity:1; }
      }

      @keyframes mysteryPulseIn{
        from{ opacity:0; transform:translateY(6px); }
        to{ opacity:1; transform:translateY(0); }
      }

      @keyframes mysteryWinFlash{
        0%{ transform:scale(1); }
        50%{ transform:scale(1.05); }
        100%{ transform:scale(1); }
      }

      @media (max-width: 1100px){
        .mysteryGrid{
          grid-template-columns:repeat(6, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px){
        .offerExperienceBanner__title{
          font-size:22px;
        }

        .offerExperienceBanner__inner{
          align-items:flex-start;
        }

        .mysteryGrid{
          grid-template-columns:repeat(4, minmax(0, 1fr));
          gap:6px;
        }

        .mysteryBox{
          min-height:40px;
          font-size:10px;
          padding:6px 4px;
        }
      }

      @media (max-width: 520px){
        .offerExperienceBanner__inner{
          flex-direction:column;
          align-items:flex-start;
        }

        .offerExperienceBanner__icon{
          font-size:28px;
        }

        .mysteryGrid{
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:6px;
        }

        .mysteryBox{
          min-height:42px;
          font-size:10px;
          padding:6px 4px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getTopSellersForCategory(catKey) {
    return Array.isArray(TOP_SELLERS[catKey]) ? TOP_SELLERS[catKey] : [];
  }

  function renderTopSellers(catKey) {
    const items = getTopSellersForCategory(catKey);

    if (!items.length) return "";

    return `
      <section class="menuTopSellers">
        <div class="menuTopSellers__head">
          <div class="menuTopSellers__eyebrow">Featured Picks</div>
          <div class="menuTopSellers__title">Top Sellers This Week</div>
        </div>

        <div class="menuTopSellers__grid">
          ${items.map(item => `
            <article class="menuTopSellerCard">
              <div class="menuTopSellerCard__top">
                <div class="menuTopSellerCard__name">${item.name || ""}</div>
                <div class="menuTopSellerCard__price">${item.price || ""}</div>
              </div>

              ${item.desc ? `
                <div class="menuTopSellerCard__desc">${item.desc}</div>
              ` : ""}

              ${item.badge ? `
                <div class="menuTopSellerCard__badge">${item.badge}</div>
              ` : ""}
            </article>
          `).join("")}
        </div>
      </section>
    `;
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

  function renderSectionedMenu(content, catKey = "") {
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
          ${catKey === "hookah23" ? `
            <button class="menuSubTab menuSubTab--upsell" type="button" data-hookah-refill="true">
              + Hookah Refill
            </button>
          ` : ""}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function getHookahRefillKey(day, panelTitleText = "") {
    const now = new Date();
    const currentHour = now.getHours();
    const title = String(panelTitleText || "").toLowerCase();

    const isAfter9Panel = title.includes("after 9");
    const isHappyHourPanel = title.includes("happy hour");

    if (day === "monday") {
      return "hookahRefill15";
    }

    if (day === "sunday") {
      return "hookahRefill12";
    }

    if (day === "tuesday" || day === "wednesday") {
      if (currentHour >= 21 || isAfter9Panel) {
        return "hookahRefill14";
      }
      return "hookahRefill12";
    }

    if (day === "thursday") {
      return "hookahRefill12";
    }

    if (day === "friday" || day === "saturday") {
      if (currentHour >= 21 || isAfter9Panel) {
        return "hookahRefill23";
      }
      if (isHappyHourPanel || currentHour < 21) {
        return "hookahRefill12";
      }
      return "hookahRefill12";
    }

    return "hookahRefill12";
  }

  function bindSubTabs(panelBody, content, catKey = "") {
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
        if (tab.dataset.hookahRefill === "true" && catKey === "hookah23") {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");

          const dayPanel = panelBody.closest(".dayPanel");
          const day = dayPanel?.dataset.daypanel || getTodayName();

          const panelBox = panelBody.closest(".menuBigPanel");
          const panelTitle = panelBox?.querySelector(".menuPanelTitle")?.textContent || "";

          const refillKey = getHookahRefillKey(day, panelTitle);
          const refillContent = CATEGORY_CONTENT[refillKey];

          if (
            refillContent &&
            refillContent.sections &&
            refillContent.sections[0] &&
            refillContent.sections[0].items
          ) {
            subBody.innerHTML = renderFlatMenu(refillContent.sections[0].items || []);
          } else {
            subBody.innerHTML = `<div class="menuEmpty">Hookah refill coming soon.</div>`;
          }

          return;
        }

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

  function openLeadModal(type, panel, day) {
    injectMenuEnhancementStyles();
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

  function getRewardsFromConfig() {
    const rewards = GAME_CONFIG?.rewards || {};
    return {
      instagram: Array.isArray(rewards.instagram) && rewards.instagram.length ? rewards.instagram : [
        "Free Mixer",
        "$2 Off Hookah",
        "$3 Off Fishbowl",
        "$3 Off Tower",
        "10% Off Food",
        "Free Red Bull w/ Drink",
        "Hookah Flavor Upgrade",
        "High Noon Discount"
      ],
      phone: Array.isArray(rewards.phone) && rewards.phone.length ? rewards.phone : [
        "$5 Off Hookah",
        "Free Shot w/ $30 Tab",
        "$5 Off Premium Drink",
        "$5 Off Bottle Service",
        "VIP Line Skip",
        "$3 Off Tower",
        "Taco Discount",
        "Wine Upgrade"
      ],
      vip: Array.isArray(rewards.vip) && rewards.vip.length ? rewards.vip : [
        "Free Hookah (Min $50 Tab)",
        "$10 Off Bottle",
        "Premium Shot Upgrade",
        "VIP Table Priority",
        "Premium Hookah Flavor",
        "Fishbowl Discount",
        "Reserved Seating",
        "Weekend VIP Perk"
      ],
      teachers: Array.isArray(rewards.teachers) && rewards.teachers.length ? rewards.teachers : [
        "Teacher Free Mixer",
        "15% Off Food",
        "$5 Off Hookah",
        "Free Shot w/ Purchase",
        "Teacher VIP Line Skip",
        "$5 Off Fishbowl",
        "Priority Seating",
        "Teacher Appreciation Reward"
      ],
      dc: Array.isArray(rewards.dc) && rewards.dc.length ? rewards.dc : [
        "DC Local Discount",
        "15% Off Food",
        "$5 Off Hookah",
        "$5 Off Tower",
        "Free Mixer",
        "Locals VIP Line Skip",
        "Reserved Seating",
        "DC Resident Reward"
      ],
      filler: Array.isArray(rewards.filler) && rewards.filler.length ? rewards.filler : [
        "Try Again",
        "Good Vibes",
        "Ask Server",
        "Come Back",
        "Next Time Lucky",
        "Enjoy The Night",
        "Ask About VIP",
        "House Favorite"
      ]
    };
  }

  function getGameItems(type, offerKey = "") {
    const rewards = getRewardsFromConfig();
    let pool = [];

    if (offerKey === "vip") {
      pool = [...rewards.vip, ...rewards.vip, ...rewards.phone, ...rewards.filler];
    } else if (offerKey === "teachers") {
      pool = [...rewards.teachers, ...rewards.teachers, ...rewards.instagram, ...rewards.filler];
    } else if (offerKey === "dc") {
      pool = [...rewards.dc, ...rewards.dc, ...rewards.phone, ...rewards.filler];
    } else if (type === "phone") {
      pool = [...rewards.phone, ...rewards.instagram, ...rewards.filler];
    } else if (type === "vip") {
      pool = [...rewards.vip, ...rewards.phone, ...rewards.filler];
    } else {
      pool = [...rewards.instagram, ...rewards.filler, ...rewards.filler];
    }

    while (pool.length < 24) {
      pool.push("Try Again");
    }

    return shuffle(pool).slice(0, 24);
  }

  function getLeadGateCopy(offerConfig) {
    const defaultTitle = GAME_CONFIG?.labels?.defaultTitle || "Unlock Your VIP Mystery Box";
    const defaultText = GAME_CONFIG?.labels?.defaultText || "Enter your Instagram or phone number to play. Enter both for VIP reward odds.";

    if (!offerConfig) {
      return {
        title: defaultTitle,
        text: `${defaultText}<br>Pick one box and reveal tonight’s reward.`,
        igLabel: "Instagram",
        phoneLabel: "Phone",
        vipLabel: "VIP"
      };
    }

    if (offerConfig.key === "vip") {
      return {
        title: defaultTitle,
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
    injectMenuEnhancementStyles();

    const offerConfig = getOfferConfig();
    const copy = getLeadGateCopy(offerConfig);

    panel.innerHTML = `
      <div class="hybridGame">
        ${offerConfig ? `<div class="mysteryOfferBadge">${offerConfig.badge}</div>` : ""}
        ${getPromoCard(day)}

        <div class="hybridTitle">${copy.title}</div>
        <div class="hybridSub">${copy.text}</div>

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

  function getGameSubcopy(entryType, offerKey) {
    if (offerKey === "vip") return "Pick one box only. VIP rewards are weighted heavier tonight.";
    if (offerKey === "teachers") return "Pick one box only. Teacher appreciation rewards are active tonight.";
    if (offerKey === "dc") return "Pick one box only. Local rewards are active tonight.";
    if (entryType === "vip") return "Pick one box only. Full-access entries have stronger premium odds.";
    if (entryType === "phone") return "Pick one box only. Phone entries unlock stronger direct rewards.";
    return "Pick one box only. Instagram entries unlock social reward odds.";
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
          <div class="mysteryTopHint">One box only</div>
        </div>

        ${offerConfig ? `<div class="mysteryOfferBadge">${offerConfig.badge}</div>` : ""}

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
        <div class="mysteryGameSub">${getGameSubcopy(entryType, offerKey)}</div>

        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox" type="button" data-box="${i}" aria-label="Mystery box ${i + 1}">
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
        const wonSomething = String(reward).toLowerCase() !== "try again";

        revealText.textContent = reward;
        rewardTop.classList.add("is-visible");
        rewardTopText.textContent = reward;

        boxes.forEach((b, idx) => {
          if (idx === i) {
            b.textContent = wonSomething ? "OPEN" : "TRY";
            b.classList.add("is-open");
            if (wonSomething) b.classList.add("is-winning");
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
    panel.innerHTML = renderSectionedMenu(content, catKey);
    bindSubTabs(panel, content, catKey);
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
          panel.innerHTML = renderSectionedMenu(content, catKey);
          bindSubTabs(panel, content, catKey);
        });
      });
    }

    openDefaultCategory(wrap);
  }

  /* =========================
     TOP GAME HERO
  ========================= */

  function openGameFromHero() {
    const activeDayPanel = document.querySelector(".dayPanel.active");
    if (!activeDayPanel) return;

    const wrap = activeDayPanel.querySelector(".menuCenterWrap");
    if (!wrap) return;

    const panel = wrap.querySelector(".menuPanelBody");
    const buttons = getButtons(wrap);
    const gameBtn = buttons.find(isGameButton);
    const day = activeDayPanel.dataset.daypanel || getTodayName();

    if (!panel) return;

    buttons.forEach(btn => btn.classList.remove("active"));
    if (gameBtn) gameBtn.classList.add("active");

    renderLeadGate(panel, day);

    panel.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function bindGameHeroButtons() {
    document.querySelectorAll("[data-open-game]").forEach(btn => {
      btn.addEventListener("click", openGameFromHero);
    });
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
    updateGameHero(day);
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => activateDay(tab.dataset.daytab));
  });

  injectMenuEnhancementStyles();
  injectOfferBanner();
  bindGameHeroButtons();

  const today = getTodayName();
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  activateDay(hasTodayTab ? today : fallbackDay);

  window.getAllureLeads = () => getStoredLeads();
});
