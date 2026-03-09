const DAY_CONTENT = {
  monday: {
    bannerTitle: "MONDAY VIP EXPERIENCE",
    bannerMeta: "Free Hookah • Cocktails • Lounge Energy",
    lineup: "Afrobeats • R&B • Hip-Hop",
    badge: "MONDAY SPECIAL",
    popular: [
      ["Salmon Sliders", "$12"],
      ["Allure Lemon Drop", "$10"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"]
    ]
  },
  tuesday: {
    bannerTitle: "TACO TUESDAY VIP",
    bannerMeta: "Tacos • Margaritas • Hookah",
    lineup: "Latin • Hip-Hop • Party Mix",
    badge: "TUESDAY SPECIAL",
    popular: [
      ["Shrimp Tacos", "$16"],
      ["Chicken Tacos", "$14"],
      ["Cocktails", "$10"],
      ["Hookah", "$23"]
    ]
  },
  wednesday: {
    bannerTitle: "MIDWEEK LUXE",
    bannerMeta: "After Work Drinks • Lounge",
    lineup: "R&B • Amapiano",
    badge: "MIDWEEK",
    popular: [
      ["Rasta Pasta", "$16+"],
      ["Moscow Mule", "$10"],
      ["High Noon", "$8"],
      ["Bottles", "VIP"]
    ]
  },
  thursday: {
    bannerTitle: "KARAOKE NIGHT",
    bannerMeta: "Live Mic • Cocktails",
    lineup: "Open Mic • Party Anthems",
    badge: "LIVE THURSDAY",
    popular: [
      ["Wings", "$12+"],
      ["Long Island", "$10"],
      ["Fishbowl", "$23"],
      ["Bottle Service", "VIP"]
    ]
  },
  friday: {
    bannerTitle: "FRIDAY NIGHT VIP",
    bannerMeta: "DJ • VIP Sections • Hookah",
    lineup: "Hip-Hop • Afrobeats",
    badge: "FRIDAY NIGHT",
    popular: [
      ["Bottles", "VIP"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"],
      ["Premium Cocktails", "$10+"]
    ]
  },
  saturday: {
    bannerTitle: "SATURDAY VIP TAKEOVER",
    bannerMeta: "Bottle Service • DJ Energy",
    lineup: "Hip-Hop • Afrobeats",
    badge: "SATURDAY VIP",
    popular: [
      ["VIP Bottles", "🔥"],
      ["Hookah", "$23"],
      ["Fishbowl", "$23"],
      ["Clase Azul", "$650"]
    ]
  },
  sunday: {
    bannerTitle: "SOCIAL SUNDAY",
    bannerMeta: "Relaxed Vibes • Food",
    lineup: "R&B • Soul",
    badge: "SUNDAY SOCIAL",
    popular: [
      ["Salmon Dinner", "$20"],
      ["Wine", "$6"],
      ["Hookah", "$23"],
      ["Bottles", "VIP"]
    ]
  }
};

const CATEGORY_CONTENT = {
  food: [
    { name: "Wings", desc: "Crispy wings with house sauce.", price: "$12+" },
    { name: "Salmon Sliders", desc: "Fresh salmon sliders.", price: "$12" },
    { name: "Chicken Tacos", desc: "Seasoned chicken tacos.", price: "$14" },
    { name: "Shrimp Tacos", desc: "Grilled shrimp tacos.", price: "$16" },
    { name: "Rasta Pasta", desc: "Creamy jerk pasta.", price: "$16+" }
  ],

  shots5: [
    { name: "Green Tea Shot", desc: "Smooth and sweet house favorite.", price: "$5" },
    { name: "Lemon Drop Shot", desc: "Citrus-forward party shot.", price: "$5" },
    { name: "Tequila Shot", desc: "Select house tequila.", price: "$5" }
  ],

  shots7: [
    { name: "Casamigos Shot", desc: "Premium tequila shot.", price: "$7" },
    { name: "Patron Shot", desc: "Top shelf tequila option.", price: "$7" },
    { name: "Hennessy Shot", desc: "Premium cognac pour.", price: "$7" }
  ],

  drinks10: [
    { name: "Rum Punch", desc: "House rum punch mix.", price: "$10" },
    { name: "Vodka Cranberry", desc: "Simple mixed drink favorite.", price: "$10" },
    { name: "Tequila Sunrise", desc: "Classic mixed drink.", price: "$10" }
  ],

  drinks14: [
    { name: "Hennessy Mix", desc: "Premium mixed drink.", price: "$14" },
    { name: "Casamigos Mix", desc: "Top shelf tequila mixed drink.", price: "$14" },
    { name: "Patron Mix", desc: "Premium tequila cocktail.", price: "$14" }
  ],

  cocktails10: [
    { name: "Allure Lemon Drop", desc: "Signature cocktail.", price: "$10" },
    { name: "Moscow Mule", desc: "Vodka, ginger beer, lime.", price: "$10" },
    { name: "Margarita", desc: "Fresh citrus margarita.", price: "$10" },
    { name: "Long Island", desc: "Strong house favorite.", price: "$10" }
  ],

  premium: [
    { name: "Don Julio 1942", desc: "Premium tequila bottle or pour.", price: "Market" },
    { name: "Clase Azul", desc: "Luxury tequila option.", price: "Market" },
    { name: "Ace of Spades", desc: "Premium champagne selection.", price: "Market" }
  ],

  wine6: [
    { name: "House White", desc: "White wine by the glass.", price: "$6" },
    { name: "House Red", desc: "Red wine by the glass.", price: "$6" }
  ],

  beer4: [
    { name: "Domestic Beer", desc: "Selected domestic beers.", price: "$4" },
    { name: "Imported Beer", desc: "Ask for current import selection.", price: "$4+" }
  ],

  highnoon8: [
    { name: "High Noon Pineapple", desc: "Vodka seltzer.", price: "$8" },
    { name: "High Noon Watermelon", desc: "Vodka seltzer.", price: "$8" },
    { name: "High Noon Peach", desc: "Vodka seltzer.", price: "$8" }
  ],

  na: [
    { name: "Mocktail", desc: "House non-alcoholic drink.", price: "$8" },
    { name: "Soft Drink", desc: "Coke, Sprite, Ginger Ale.", price: "$4" },
    { name: "Red Bull", desc: "Regular or sugar free.", price: "$6" }
  ],

  hookah23: [
    { name: "House Hookah", desc: "Standard hookah flavor selection.", price: "$23" },
    { name: "Mint Hookah", desc: "Cool and smooth flavor option.", price: "$23" },
    { name: "Fruit Mix Hookah", desc: "Popular house fruit blend.", price: "$23" }
  ],

  refill12: [
    { name: "Hookah Refill", desc: "Refresh your bowl.", price: "$12" }
  ],

  tower43: [
    { name: "Drink Tower", desc: "Large table drink tower.", price: "$43" }
  ],

  fishbowl23: [
    { name: "Blue Fishbowl", desc: "Large share cocktail.", price: "$23" },
    { name: "Tropical Fishbowl", desc: "Fruit-forward share drink.", price: "$23" }
  ],

  bottles: [
    { name: "Hennessy Bottle", desc: "Bottle service option.", price: "VIP" },
    { name: "Casamigos Bottle", desc: "Premium bottle service.", price: "VIP" },
    { name: "Patron Bottle", desc: "Tequila bottle service.", price: "VIP" },
    { name: "Champagne Bottle", desc: "Ask for current champagne list.", price: "VIP" }
  ]
};

function getToday() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
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
            <div class="menuItem__desc">${item.desc}</div>
          </div>
          <div class="menuItem__price">${item.price}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderVipBanner(day) {
  const c = DAY_CONTENT[day];
  if (!c) return null;

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

function renderPopular(day) {
  const c = DAY_CONTENT[day];
  if (!c) return null;

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

function setupCategoryBar(bar) {
  const scope = bar.dataset.scope;
  const body = document.querySelector(`[data-scopebody="${scope}"]`);
  const buttons = Array.from(bar.querySelectorAll(".cat"));

  if (!body || !buttons.length) return;

  function activateCategory(catKey) {
    buttons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === catKey);
    });

    body.innerHTML = createMenuList(CATEGORY_CONTENT[catKey] || []);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      activateCategory(btn.dataset.cat);
    });
  });

  activateCategory(buttons[0].dataset.cat);
}

function setupPanel(panel, day) {
  panel.querySelectorAll(".vipNightBanner, .popularTonight").forEach(node => node.remove());

  const hero = panel.querySelector(".heroRow");
  if (hero) {
    const banner = renderVipBanner(day);
    const popular = renderPopular(day);

    if (banner) hero.after(banner);
    if (banner && popular) banner.after(popular);
  }

  panel.querySelectorAll(".catBar").forEach(bar => setupCategoryBar(bar));
}

function activateDay(day) {
  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.daytab === day);
  });

  document.querySelectorAll(".dayPanel").forEach(panel => {
    const isActive = panel.dataset.daypanel === day;
    panel.classList.toggle("active", isActive);

    if (isActive) {
      setupPanel(panel, day);
    }
  });
}

function bindDayTabs() {
  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindDayTabs();

  const today = getToday();
  const allowed = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  activateDay(allowed.includes(today) ? today : "monday");
});