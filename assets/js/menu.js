const PHONE = "+12022974949";

/* =========================
   DAY CONTENT
========================= */

const DAY_CONTENT = {
  monday: {
    promoTitle: "FREE HOOKAH MONDAY",
    promoText: "Tap a category to explore tonight’s menu.",
    bannerTitle: "MONDAY VIP EXPERIENCE",
    bannerMeta: "Free Hookah • Cocktails • Lounge Energy",
    lineup: "Afrobeats • R&B • Hip-Hop",
    badge: "MONDAY SPECIAL",
    vibe: "Free Hookah • VIP Energy • Late Night",
    popular: [
      ["Salmon Sliders", "$12"],
      ["Allure Lemon Drop", "$10"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"]
    ]
  },

  tuesday: {
    promoTitle: "TACO TUESDAY",
    promoText: "Tap a category to explore tacos and drinks.",
    bannerTitle: "TACO TUESDAY VIP",
    bannerMeta: "Tacos • Margaritas • Hookah",
    lineup: "Latin • Hip-Hop • Party Mix",
    badge: "TUESDAY SPECIAL",
    vibe: "Tacos • Margaritas • Hookah",
    popular: [
      ["Shrimp Tacos", "$16"],
      ["Chicken Tacos", "$14"],
      ["Cocktails", "$10"],
      ["Hookah", "$23"]
    ]
  },

  wednesday: {
    promoTitle: "MIDWEEK WEDNESDAY",
    promoText: "Tap a category to explore tonight’s specials.",
    bannerTitle: "MIDWEEK LUXE",
    bannerMeta: "After Work Drinks • Lounge",
    lineup: "R&B • Amapiano",
    badge: "MIDWEEK",
    vibe: "After Work Drinks",
    popular: [
      ["Rasta Pasta", "$16+"],
      ["Moscow Mule", "$10"],
      ["High Noon", "$8"],
      ["Bottles", "VIP"]
    ]
  },

  thursday: {
    promoTitle: "KARAOKE THURSDAY",
    promoText: "Tap a category to explore the karaoke menu.",
    bannerTitle: "KARAOKE NIGHT",
    bannerMeta: "Live Mic • Cocktails",
    lineup: "Open Mic • Party Anthems",
    badge: "LIVE THURSDAY",
    vibe: "Karaoke • Cocktails",
    popular: [
      ["Wings", "$12+"],
      ["Long Island", "$10"],
      ["Fishbowl", "$23"],
      ["Bottle Service", "VIP"]
    ]
  },

  friday: {
    promoTitle: "ALLURE FRIDAY",
    promoText: "Tap a category to explore tonight.",
    bannerTitle: "FRIDAY NIGHT VIP",
    bannerMeta: "DJ • VIP Sections • Hookah",
    lineup: "Hip-Hop • Afrobeats",
    badge: "FRIDAY NIGHT",
    vibe: "DJ • Bottles • Hookah",
    popular: [
      ["Bottles", "VIP"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"],
      ["Premium Cocktails", "$10+"]
    ]
  },

  saturday: {
    promoTitle: "ALLURE SATURDAY",
    promoText: "Tap a category to explore tonight.",
    bannerTitle: "SATURDAY VIP TAKEOVER",
    bannerMeta: "Bottle Service • DJ Energy",
    lineup: "Hip-Hop • Afrobeats",
    badge: "SATURDAY VIP",
    vibe: "Prime Night",
    popular: [
      ["VIP Bottles", "🔥"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"],
      ["Clase Azul", "$650"]
    ]
  },

  sunday: {
    promoTitle: "SOCIAL SUNDAY",
    promoText: "Tap a category to explore tonight.",
    bannerTitle: "SOCIAL SUNDAY",
    bannerMeta: "Relaxed Vibes • Food",
    lineup: "R&B • Soul",
    badge: "SUNDAY SOCIAL",
    vibe: "Chill Lounge",
    popular: [
      ["Salmon Dinner", "$20"],
      ["Wine", "$6"],
      ["Hookah", "$23"],
      ["Bottles", "VIP"]
    ]
  }
};

/* =========================
   MENU ITEMS
========================= */

const CATEGORY_CONTENT = {
  food: [
    { name: "Wings", desc: "Crispy wings tossed in house sauce.", price: "$12+" },
    { name: "Salmon Sliders", desc: "Savory salmon sliders with premium flavor.", price: "$12" },
    { name: "Chicken Tacos", desc: "Soft tacos with seasoned chicken and fresh toppings.", price: "$14" },
    { name: "Shrimp Tacos", desc: "Grilled shrimp tacos with signature sauce.", price: "$16" },
    { name: "Rasta Pasta", desc: "Creamy pasta with bold seasoning and premium finish.", price: "$16+" }
  ],

  shots5: [
    { name: "House Shots", desc: "Selected house shots all night.", price: "$5" }
  ],

  shots7: [
    { name: "Top Shelf Shots", desc: "Premium shot options for late night energy.", price: "$7" }
  ],

  drinks10: [
    { name: "House Mixed Drinks", desc: "Selected mixed drinks.", price: "$10" }
  ],

  drinks14: [
    { name: "Premium Mixed Drinks", desc: "Top shelf mixed drinks.", price: "$14" }
  ],

  cocktails10: [
    { name: "Allure Lemon Drop", desc: "A signature smooth house favorite.", price: "$10" },
    { name: "Moscow Mule", desc: "Vodka, ginger beer, and lime.", price: "$10" },
    { name: "Margarita", desc: "Fresh citrus and tequila with balanced flavor.", price: "$10" }
  ],

  premium: [
    { name: "Premium Pour", desc: "Top shelf premium liquor selection.", price: "Market" }
  ],

  wine6: [
    { name: "House Wine", desc: "Select glass of red or white wine.", price: "$6" }
  ],

  beer4: [
    { name: "Beer Special", desc: "Domestic beer selection.", price: "$4" }
  ],

  highnoon8: [
    { name: "High Noon", desc: "Selected High Noon flavors.", price: "$8" }
  ],

  na: [
    { name: "Mocktail", desc: "Refreshing alcohol-free house option.", price: "$8" },
    { name: "Soft Drink", desc: "Standard soft drink selection.", price: "$4" }
  ],

  hookah23: [
    { name: "Hookah", desc: "Standard hookah flavor selection.", price: "$23" }
  ],

  refill12: [
    { name: "Hookah Refill", desc: "Refresh your hookah session.", price: "$12" }
  ],

  tower43: [
    { name: "Tower", desc: "Large-format tower option for the table.", price: "$43" }
  ],

  fishbowl23: [
    { name: "Fishbowl", desc: "Large shareable signature cocktail.", price: "$23" }
  ],

  bottles: [
    { name: "Bottle Service", desc: "Ask staff for current bottle list and VIP pricing.", price: "VIP" }
  ]
};

/* =========================
   HELPERS
========================= */

function getDayData(day) {
  return DAY_CONTENT[day] || DAY_CONTENT.monday;
}

function getToday() {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  return days[new Date().getDay()];
}

function createMenuList(items) {
  if (!items || !items.length) {
    return `
      <div class="menuPromo">
        <div class="menuPromoIcon">✨</div>
        <div class="menuPromoTitle">Coming Soon</div>
        <div class="menuPromoText">This section will be updated with the full menu soon.</div>
      </div>
    `;
  }

  return `
    <div class="menuList">
      ${items.map(item => `
        <div class="menuItem">
          <div class="menuItem__left">
            <div class="menuItem__name">${item.name}</div>
            ${item.desc ? `<div class="menuItem__desc">${item.desc}</div>` : ""}
          </div>
          <div class="menuItem__price">${item.price}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function getPromoMarkup(day) {
  const c = getDayData(day);

  return `
    <div class="menuPromo">
      <div class="menuPromoIcon">✨</div>
      <div class="menuPromoTitle">${c.promoTitle}</div>
      <div class="menuPromoText">${c.promoText}</div>
    </div>
  `;
}

/* =========================
   VIP BANNER
========================= */

function renderVipBanner(day) {
  const c = getDayData(day);
  const section = document.createElement("section");

  section.className = "vipNightBanner reveal";
  section.innerHTML = `
    <div class="vipNightBanner__badge">${c.badge}</div>
    <div class="vipNightBanner__title">${c.bannerTitle}</div>
    <div class="vipNightBanner__meta">${c.bannerMeta}</div>
    <div class="vipNightBanner__lineup">DJ: ${c.lineup}</div>
  `;

  return section;
}

/* =========================
   POPULAR TONIGHT
========================= */

function renderPopular(day) {
  const c = getDayData(day);
  const section = document.createElement("section");

  section.className = "popularTonight reveal";
  section.innerHTML = `
    <div class="popularTonight__title">🔥 Popular Tonight</div>
    <div class="popularTonight__grid">
      ${c.popular.map(item => `
        <div class="popularCard">
          <span>${item[0]}</span>
          <span class="price">${item[1]}</span>
        </div>
      `).join("")}
    </div>
  `;

  return section;
}

/* =========================
   CATEGORY SYSTEM
========================= */

function renderScope(scope) {
  const bar = document.querySelector(`.catBar[data-scope="${scope}"]`);
  const body = document.querySelector(`.catBody[data-scopebody="${scope}"]`);

  if (!bar || !body) return;

  const cats = Array.from(bar.querySelectorAll(".cat"));
  if (!cats.length) return;

  function activateCategory(catKey) {
    cats.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === catKey);
    });

    const items = CATEGORY_CONTENT[catKey];
    body.innerHTML = createMenuList(items);
  }

  cats.forEach(btn => {
    btn.addEventListener("click", () => {
      activateCategory(btn.dataset.cat);
    });
  });

  activateCategory(cats[0].dataset.cat);
}

function renderAllScopesForPanel(panel) {
  const bars = panel.querySelectorAll(".catBar[data-scope]");
  bars.forEach(bar => {
    renderScope(bar.dataset.scope);
  });
}

/* =========================
   DAY SWITCH
========================= */

function activateDay(day) {
  const panels = document.querySelectorAll(".dayPanel");
  const tabs = document.querySelectorAll(".dayTab");

  panels.forEach(panel => panel.classList.remove("active"));
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.daytab === day));

  const panel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
  if (!panel) return;

  panel.classList.add("active");

  panel.querySelectorAll(".vipNightBanner, .popularTonight").forEach(node => node.remove());

  const hero = panel.querySelector(".heroRow");
  if (hero) {
    const banner = renderVipBanner(day);
    const popular = renderPopular(day);

    hero.after(banner);
    banner.after(popular);
  }

  panel.querySelectorAll("[data-scopebody]").forEach(body => {
    body.innerHTML = getPromoMarkup(day);
  });

  renderAllScopesForPanel(panel);
}

/* =========================
   BIND TABS
========================= */

function bindDayTabs() {
  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  bindDayTabs();

  const today = getToday();
  const allowedDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const startDay = allowedDays.includes(today) ? today : "monday";

  activateDay(startDay);
});