/* =========================
   ALLURE MENU SYSTEM
   Full Working Version + Daily Animations
   ========================= */

const PHONE = "+12025550123";

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
   MENU DATA
   ========================= */

const FOOD_BLOCK = {
  title: "Food",
  type: "foodBlock",
  sections: [
    {
      title: "Appetizers",
      items: [
        ["Salmon Sliders w/ Fries", "$12"],
        ["Beef Sliders w/ Fries", "$10"],
        ["Mozzarella Sticks", "$7"],
        ["Fried Pickles", "$5"],
        ["Chips & Salsa", "$5"],
        ["Onion Rings", "$7"],
        ["Fries", "$5"]
      ]
    },
    {
      title: "Wings",
      items: [
        ["12pc Wings w/ Fries", "$16"],
        ["8pc Wings w/ Fries", "$14"],
        ["6pc Wings w/ Fries", "$12"],
        ["12pc Wings Only", "$14"],
        ["8pc Wings Only", "$10"],
        ["6pc Wings Only", "$8"]
      ]
    },
    {
      title: "Quesadillas",
      items: [
        ["Cheese", "$8"],
        ["Chicken", "$10"],
        ["Shrimp", "$12"],
        ["Salmon", "$14"]
      ]
    },
    {
      title: "Rasta Pasta / Alfredo",
      items: [
        ["Chicken", "$16"],
        ["Shrimp", "$18"],
        ["Salmon", "$20"]
      ]
    },
    {
      title: "Salads",
      items: [
        ["Salad", "$8"],
        ["Chicken", "$10"],
        ["Shrimp", "$12"],
        ["Salmon", "$13"]
      ],
      note: "Dressings: Ranch • Blue Cheese • Italian • Balsamic Vinaigrette • Caesar"
    },
    {
      title: "Dinner",
      items: [
        ["Salmon (Yellow Rice & Broccoli)", "$20"],
        ["General Tso (Yellow Rice & Broccoli)", "$18"],
        ["Beef Burger w/ Fries", "$13"]
      ]
    },
    {
      title: "Seafood Baskets",
      items: [
        ["Fried Shrimp Basket", "$18"],
        ["Crab Fries Basket", "$18"],
        ["Fried Whiting Basket", "$15"],
        ["Salmon Nugget Basket", "$15"],
        ["Catfish Nuggets Basket", "$13"]
      ]
    },
    {
      title: "Tacos",
      items: [
        ["Shrimp Tacos", "$16"],
        ["Chicken Tacos", "$14"]
      ],
      note: "Includes: Lettuce • Cheese • Sour Cream • Salsa"
    },
    {
      title: "Wing Flavors",
      items: [
        ["Wet: Honey Lemon Pepper", ""],
        ["Wet: Honey Old Bay", ""],
        ["Wet: Buffalo BBQ", ""],
        ["Wet: Honey Sazon", ""],
        ["Wet: Sweet Chili", ""],
        ["Wet: Teriyaki", ""],
        ["Wet: Mumbo", ""],
        ["Dry: Lemon Pepper", ""],
        ["Dry: Jerk Rub", ""],
        ["Dry: Old Bay", ""]
      ]
    }
  ]
};

const BOTTLES_BLOCK = {
  title: "Bottles • Pricing",
  type: "bottlesBlock",
  sections: [
    {
      title: "Standard",
      items: [
        ["Don Julio Blanco", "$220"],
        ["Casamigos Reposado", "$240"],
        ["Hennessy VS", "$220"]
      ]
    },
    {
      title: "Premium",
      items: [
        ["Don Julio 1942", "$650"],
        ["Clase Azul", "$650"],
        ["Hennessy XO", "$550"]
      ]
    },
    {
      title: "VIP Packages",
      items: [
        ["VIP Gold Package", "$900"],
        ["VIP Platinum Package", "$1200"],
        ["Celebration Package", "$1500"]
      ]
    }
  ]
};

const HH_TUE_SAT = {
  food: FOOD_BLOCK,
  bottles: BOTTLES_BLOCK,

  shots5: {
    title: "$5 Shots",
    type: "spiritCols",
    cols: {
      Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
      Tequila: ["1800 (Blanco/Repo)", "Altos", "Espolon", "Hornitos", "Jose Cuervo", "Lunazul", "Milagro", "Teremana"],
      Whiskey: ["Basil Hayden", "Bulleit", "Chivas Regal", "Crown", "Dewar’s", "Fireball", "Jack Daniels", "Jameson", "Jim Beam", "Makers Mark", "Woodford"],
      Rum: ["Bacardi", "Captain Morgan", "Malibu", "Myers"],
      Gin: ["Bombay", "Roku", "Tanqueray"],
      Cognac: ["Courvoisier", "Hennessy"],
      Liqueur: ["Disaronno", "Grand Marnier", "Hpnotiq", "Jagermeister", "Midori"]
    }
  },

  drinks10: {
    title: "$10 Drinks",
    type: "spiritCols",
    cols: {
      Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
      Tequila: ["1800 (Blanco/Repo)", "Altos", "Espolon", "Hornitos", "Jose Cuervo", "Lunazul", "Milagro", "Teremana"],
      Whiskey: ["Basil Hayden", "Bulleit", "Chivas Regal", "Crown", "Dewar’s", "Fireball", "Jack Daniels", "Jameson", "Jim Beam", "Makers Mark", "Woodford"],
      Rum: ["Bacardi", "Captain Morgan", "Malibu", "Myers"],
      Gin: ["Bombay", "Roku", "Tanqueray"],
      Cognac: ["Courvoisier", "Hennessy"],
      Liqueur: ["Disaronno", "Grand Marnier", "Hpnotiq", "Jagermeister", "Midori"]
    }
  },

  cocktails10: {
    title: "$10 Cocktails",
    type: "cocktails",
    items: [
      ["Allure Lemon Drop", "Teremana Repo, Triple Sec, Lemon Juice & Simple Syrup"],
      ["Allure Sidecar", "Hennessy, Amaretto, Triple Sec & Lemon Juice"],
      ["Apple Martini", "Absolut & Green Apple Schnapps"],
      ["Long Island", "Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix topped w/ Coke"],
      ["Mojito", "Captain Morgan, Lime Juice, Mint Leaves & Simple Syrup topped w/ Soda Water"],
      ["Moscow Mule", "Tito’s, Lime Juice & Ginger Beer"]
    ]
  },

  shots7: {
    title: "$7 Shots",
    type: "simpleList",
    items: ["818", "Casa Azul", "Casamigos", "Ciroc VS", "Don Julio", "D’usse", "Equiano", "Hendricks", "Hennessy VSOP", "Herradura", "Old Forester", "Patron", "Remy 1738", "Remy VSOP", "Sir Davis"]
  },

  drinks14: {
    title: "$14 Drinks",
    type: "simpleList",
    items: ["(Same brands list as $7 tier)"]
  },

  premium: {
    title: "Premium",
    type: "twoCols",
    leftTitle: "$16 Shots • $32 Drinks",
    rightTitle: "$10 Shots • $20 Drinks",
    left: ["1942", "Azul", "D’usse XO", "Remy XO"],
    right: ["Gran Coramino", "JW Black", "JW Double Black", "JW Gold"]
  },

  wine6: {
    title: "$6 Wine",
    type: "simpleList",
    items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"]
  },

  beer4: {
    title: "$4 Beer",
    type: "simpleList",
    items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"]
  },

  highnoon8: {
    title: "$8 High Noon",
    type: "twoCols",
    leftTitle: "Vodka",
    rightTitle: "Tequila",
    left: ["Grapefruit", "Mango"],
    right: ["Lime", "Strawberry"]
  },

  na: {
    title: "Non-Alcoholic",
    type: "pricedList",
    items: [
      ["Red Bull", "$5"],
      ["Ginger Beer", "$5"],
      ["Frozen Drinks", "$5"],
      ["Soda", "$3"],
      ["Juice", "$3"],
      ["Water", "$3"]
    ]
  },

  hookah23: {
    title: "$23 Hookah",
    type: "twoCols",
    leftTitle: "Flavors",
    rightTitle: "Premium (+$2)",
    left: ["Blueberry Mint", "Double Apple", "Grape", "Grape Fruit", "Grape Fruit Mint", "Guava", "Gum Mint", "Kiwi", "Lemon Mint", "Mango", "Mint", "Orange Mint", "Peach", "Pineapple", "Strawberry", "Vanilla", "Watermelon", "Watermelon Mint"],
    right: ["Bluemist +$2", "Lady Killer +$2", "Love 66 +$2", "Magic Love +$2"]
  },

  refill12: {
    title: "$12 Refill",
    type: "twoCols",
    leftTitle: "Refill Flavors",
    rightTitle: "Premium (+$2)",
    left: ["Blueberry Mint", "Double Apple", "Grape", "Grape Fruit", "Grape Fruit Mint", "Guava", "Gum Mint", "Kiwi", "Lemon Mint", "Mango", "Mint", "Orange Mint", "Peach", "Pineapple", "Strawberry", "Vanilla", "Watermelon", "Watermelon Mint"],
    right: ["Bluemist +$2", "Lady Killer +$2", "Love 66 +$2", "Magic Love +$2"]
  },

  tower43: {
    title: "$43 Tower",
    type: "simpleList",
    items: ["Ask server for flavors / specials"]
  },

  fishbowl23: {
    title: "$23 Fishbowl",
    type: "simpleList",
    items: ["Ask server for flavors / specials"]
  }
};

const LATE_TUE_SAT = {
  food: FOOD_BLOCK,
  bottles: BOTTLES_BLOCK,
  shots7: HH_TUE_SAT.shots7,
  drinks14: HH_TUE_SAT.drinks14,
  premium: HH_TUE_SAT.premium,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  hookah23: HH_TUE_SAT.hookah23,
  tower43: HH_TUE_SAT.tower43,
  fishbowl23: HH_TUE_SAT.fishbowl23
};

const HH_MON_SUN = {
  food: FOOD_BLOCK,
  bottles: BOTTLES_BLOCK,
  shots5: HH_TUE_SAT.shots5,
  drinks10: HH_TUE_SAT.drinks10,
  cocktails10: HH_TUE_SAT.cocktails10,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  hookah23: HH_TUE_SAT.hookah23,
  tower43: HH_TUE_SAT.tower43,
  fishbowl23: HH_TUE_SAT.fishbowl23
};

const MENU_DATA = {
  "monday-happy": HH_MON_SUN,
  "tuesday-happy": HH_TUE_SAT,
  "tuesday-late": LATE_TUE_SAT,
  "wednesday-happy": HH_TUE_SAT,
  "wednesday-late": LATE_TUE_SAT,
  "thursday-happy": HH_TUE_SAT,
  "thursday-late": LATE_TUE_SAT,
  "friday-happy": HH_TUE_SAT,
  "friday-late": LATE_TUE_SAT,
  "saturday-happy": HH_TUE_SAT,
  "saturday-late": LATE_TUE_SAT,
  "sunday-happy": HH_MON_SUN
};

/* =========================
   HELPERS
   ========================= */

function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

function getDayData(day) {
  return DAY_CONTENT[day] || DAY_CONTENT.monday;
}

function getToday() {
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  return days[new Date().getDay()];
}

function getPromoMarkup(day) {
  const c = getDayData(day);

  const promoAnimations = {
    monday: `
      <div class="promoAnim promoAnim--monday">
        <div class="spark s1"></div>
        <div class="spark s2"></div>
        <div class="spark s3"></div>
        <div class="smoke smoke1"></div>
        <div class="smoke smoke2"></div>
      </div>
    `,
    tuesday: `
      <div class="promoAnim promoAnim--tuesday">
        <div class="tacoGlow"></div>
        <div class="tacoGlow tacoGlow2"></div>
      </div>
    `,
    wednesday: `
      <div class="promoAnim promoAnim--wednesday">
        <div class="waveBar"></div>
        <div class="waveBar waveBar2"></div>
        <div class="waveBar waveBar3"></div>
      </div>
    `,
    thursday: `
      <div class="promoAnim promoAnim--thursday">
        <div class="pulseRing"></div>
        <div class="pulseRing ring2"></div>
      </div>
    `,
    friday: `
      <div class="promoAnim promoAnim--friday">
        <div class="lightSweep"></div>
      </div>
    `,
    saturday: `
      <div class="promoAnim promoAnim--saturday">
        <div class="lightSweep"></div>
        <div class="pulseRing"></div>
        <div class="pulseRing ring2"></div>
      </div>
    `,
    sunday: `
      <div class="promoAnim promoAnim--sunday">
        <div class="smoke smoke1"></div>
        <div class="smoke smoke2"></div>
      </div>
    `
  };

  return `
    <div class="menuPromo">
      ${promoAnimations[day] || ""}
      <div class="menuPromoIcon">✨</div>
      <div class="menuPromoTitle">${c.promoTitle}</div>
      <div class="menuPromoText">${c.promoText}</div>
    </div>
  `;
}

function setClosedState(panel) {
  if (!panel) return;
  const day = panel.getAttribute("data-daypanel") || "monday";

  panel.querySelectorAll("[data-scopebody]").forEach((body) => {
    body.innerHTML = getPromoMarkup(day);
  });

  panel.querySelectorAll("[data-scope]").forEach((bar) => {
    bar.style.display = "";
    bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
  });

  panel.querySelectorAll(".focusBackBtn").forEach((b) => b.remove());
}

function wireAccordion(container) {
  container.querySelectorAll("details.acc").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      container.querySelectorAll("details.acc").forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
  });
}

/* =========================
   PHASE BLOCKS
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

function renderPopular(day) {
  const c = getDayData(day);
  const section = document.createElement("section");
  section.className = "popularTonight reveal";
  section.innerHTML = `
    <div class="popularTonight__title">🔥 Popular Tonight</div>
    <div class="popularTonight__grid"></div>
  `;
  const grid = section.querySelector(".popularTonight__grid");
  c.popular.forEach((i) => {
    const card = document.createElement("div");
    card.className = "popularCard";
    card.innerHTML = `
      <span>${i[0]}</span>
      <span class="price">${i[1]}</span>
    `;
    grid.appendChild(card);
  });
  return section;
}

/* =========================
   RENDERERS
   ========================= */

function renderFoodAccordion(data) {
  const outer = document.createElement("div");
  outer.className = "listGrid";

  (data.sections || []).forEach((section) => {
    const details = document.createElement("details");
    details.className = "acc";

    const summary = document.createElement("summary");
    summary.className = "acc__summary";
    summary.textContent = section.title;

    const box = document.createElement("div");
    box.className = "colBox";

    (section.items || []).forEach(([name, price]) => {
      box.appendChild(el(`
        <div class="itemRow">
          <span>${name}</span>
          <span class="price">${price}</span>
        </div>
      `));
    });

    if (section.note) {
      box.appendChild(el(`<div class="muted" style="margin-top:8px; text-align:left; padding:0;">${section.note}</div>`));
    }

    details.appendChild(summary);
    details.appendChild(box);
    outer.appendChild(details);
  });

  wireAccordion(outer);
  return outer;
}

function renderSpiritColsAccordion(data) {
  const outer = document.createElement("div");
  outer.className = "listGrid";

  const order = ["Vodka", "Tequila", "Whiskey", "Rum", "Gin", "Cognac", "Liqueur"];
  const cols = data.cols || {};

  order.forEach((title) => {
    if (!cols[title]) return;

    const details = document.createElement("details");
    details.className = "acc";

    const summary = document.createElement("summary");
    summary.className = "acc__summary";
    summary.textContent = title;

    const box = document.createElement("div");
    box.className = "colBox";

    const ul = document.createElement("ul");
    ul.className = "bullets";

    cols[title].forEach((i) => ul.appendChild(el(`<li>${i}</li>`)));

    box.appendChild(ul);
    details.appendChild(summary);
    details.appendChild(box);
    outer.appendChild(details);
  });

  wireAccordion(outer);
  return outer;
}

function renderBottlesAccordion(data) {
  const outer = document.createElement("div");
  outer.className = "listGrid";

  (data.sections || []).forEach((section) => {
    const details = document.createElement("details");
    details.className = "acc";

    const summary = document.createElement("summary");
    summary.className = "acc__summary";
    summary.textContent = section.title;

    const box = document.createElement("div");
    box.className = "colBox";

    (section.items || []).forEach(([name, price]) => {
      box.appendChild(el(`
        <div class="itemRow">
          <span>${name}</span>
          <span class="price">${price}</span>
        </div>
      `));
    });

    details.appendChild(summary);
    details.appendChild(box);
    outer.appendChild(details);
  });

  wireAccordion(outer);
  return outer;
}

function renderCategory(scopeKey, catKey) {
  const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
  if (!target) return;

  const data = MENU_DATA[scopeKey]?.[catKey];
  if (!data) {
    target.innerHTML = `<div class="muted">No items yet for this category.</div>`;
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "listGrid";
  wrap.appendChild(el(`<div class="sectionHead">${data.title}</div>`));

  if (data.type === "foodBlock") {
    wrap.appendChild(renderFoodAccordion(data));
  } else if (data.type === "spiritCols") {
    wrap.appendChild(renderSpiritColsAccordion(data));
  } else if (data.type === "bottlesBlock") {
    wrap.appendChild(renderBottlesAccordion(data));
  } else if (data.type === "simpleList") {
    const box = document.createElement("div");
    box.className = "colBox";
    const ul = document.createElement("ul");
    ul.className = "bullets";
    (data.items || []).forEach((i) => ul.appendChild(el(`<li>${i}</li>`)));
    box.appendChild(ul);
    wrap.appendChild(box);
  } else if (data.type === "pricedList") {
    const box = document.createElement("div");
    box.className = "colBox";
    (data.items || []).forEach(([name, price]) => {
      box.appendChild(el(`
        <div class="itemRow">
          <span>${name}</span>
          <span class="price">${price}</span>
        </div>
      `));
    });
    wrap.appendChild(box);
  } else if (data.type === "cocktails") {
    const box = document.createElement("div");
    box.className = "colBox cocktailList";
    (data.items || []).forEach(([name, desc]) => {
      const row = document.createElement("div");
      row.className = "cocktailItem";
      row.appendChild(el(`<div class="cocktailName">${name}</div>`));
      row.appendChild(el(`<div class="cocktailDesc">${desc}</div>`));
      box.appendChild(row);
    });
    wrap.appendChild(box);
  } else if (data.type === "twoCols") {
    const two = document.createElement("div");
    two.className = "twoCols";

    const left = el(`<div class="colBox"><div class="colTitle">${data.leftTitle}</div></div>`);
    const right = el(`<div class="colBox"><div class="colTitle">${data.rightTitle}</div></div>`);

    const ulL = document.createElement("ul");
    ulL.className = "bullets";
    const ulR = document.createElement("ul");
    ulR.className = "bullets";

    (data.left || []).forEach((i) => ulL.appendChild(el(`<li>${i}</li>`)));
    (data.right || []).forEach((i) => ulR.appendChild(el(`<li>${i}</li>`)));

    left.appendChild(ulL);
    right.appendChild(ulR);
    two.appendChild(left);
    two.appendChild(right);
    wrap.appendChild(two);
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* =========================
   CATEGORY BARS
   ========================= */

function bindCategoryBars() {
  document.querySelectorAll("[data-scope]").forEach((bar) => {
    if (bar.dataset.bound === "1") return;
    bar.dataset.bound = "1";

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn) return;

      const scopeKey = bar.getAttribute("data-scope");
      const catKey = btn.getAttribute("data-cat");
      const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
      if (!target) return;

      bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      bar.style.display = "none";
      renderCategory(scopeKey, catKey);

      target.querySelectorAll(".focusBackBtn").forEach((b) => b.remove());

      const back = document.createElement("button");
      back.type = "button";
      back.className = "backBtn focusBackBtn";
      back.textContent = "← Back to Menu";

      back.addEventListener("click", () => {
        bar.style.display = "";
        bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));

        const panel = bar.closest(".dayPanel");
        const day = panel?.getAttribute("data-daypanel") || "monday";

        target.innerHTML = getPromoMarkup(day);
        back.remove();
      });

      target.prepend(back);
    });
  });
}

/* =========================
   DAY SWITCH
   ========================= */

function activateDay(day) {
  const panels = document.querySelectorAll(".dayPanel");
  const tabs = document.querySelectorAll(".dayTab");

  panels.forEach((p) => p.classList.remove("active"));
  tabs.forEach((t) => t.classList.remove("active"));

  const panel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
  const tab = document.querySelector(`.dayTab[data-daytab="${day}"]`);

  if (!panel) return;

  panel.classList.add("active");
  if (tab) tab.classList.add("active");

  panel.querySelectorAll(".vipNightBanner,.popularTonight").forEach((e) => e.remove());

  const hero = panel.querySelector(".heroRow");
  if (hero) {
    const banner = renderVipBanner(day);
    const popular = renderPopular(day);
    hero.after(banner);
    banner.after(popular);
  }

  setClosedState(panel);
  updateVibeStrip(day);
  updateLimitedTablesTag();
}

function bindDayTabs() {
  document.querySelectorAll(".dayTab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });
}

/* =========================
   MOBILE RESERVE + VIBE STRIP
   ========================= */

function mobileReserve() {
  if (document.querySelector(".mobileReserve")) return;
  const btn = document.createElement("a");
  btn.href = `tel:${PHONE}`;
  btn.className = "mobileReserve";
  btn.textContent = "Reserve / Call";
  document.body.appendChild(btn);
}

function vibeStrip() {
  if (document.querySelector(".vibeStrip")) return;
  const strip = document.createElement("div");
  strip.className = "vibeStrip";
  document.body.appendChild(strip);
}

function updateVibeStrip(day) {
  const strip = document.querySelector(".vibeStrip");
  if (!strip) return;
  const c = getDayData(day);
  strip.textContent = `${c.badge} • ${c.vibe} • DJ ${c.lineup}`;
}

/* =========================
   LIMITED TABLES
   ========================= */

function updateLimitedTablesTag() {
  const activePanel = document.querySelector(".dayPanel.active");
  if (!activePanel) return;

  const day = activePanel.getAttribute("data-daypanel");
  const tag = activePanel.querySelector("[data-limited-tag]");
  if (!tag) return;

  const hour = new Date().getHours();

  let show = false;
  if (day === "thursday" && hour >= 21) show = true;
  if (day === "saturday" && hour >= 22) show = true;
  if (day === "sunday" && hour >= 22) show = true;

  tag.style.display = show ? "inline-flex" : "none";
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  bindDayTabs();
  bindCategoryBars();
  mobileReserve();
  vibeStrip();
  activateDay(getToday());
  setInterval(updateLimitedTablesTag, 60000);
});
/* =========================
   PHASE 6 ADD-ON
   Countdown + Flyer + Bottle Modal
   Safe extension
   ========================= */

const PHASE6_FLYERS = {
  monday: [
    { badge: "Monday Special", title: "FREE HOOKAH MONDAY", meta: "Lounge vibes • cocktails • hookah", sub: "Afrobeats • R&B • Hip-Hop" },
    { badge: "VIP Tables", title: "MONDAY ALL NIGHT", meta: "Book sections early for best seating", sub: "Bottle service available" },
    { badge: "Popular", title: "LEMON DROP + HOOKAH", meta: "Perfect Monday combo", sub: "Ask about bottle packages" }
  ],
  tuesday: [
    { badge: "Tuesday Special", title: "TACO TUESDAY", meta: "Tacos • drinks • hookah", sub: "Latin • Hip-Hop • Party Mix" },
    { badge: "Popular", title: "SHRIMP TACOS + MARGARITA", meta: "Best-selling Tuesday pairing", sub: "Kitchen favorites all night" },
    { badge: "VIP Tables", title: "TURN UP YOUR TUESDAY", meta: "Bottle service available", sub: "Reserve your section now" }
  ],
  wednesday: [
    { badge: "Midweek", title: "MIDWEEK WEDNESDAY", meta: "After-work energy • lounge vibes", sub: "R&B • Amapiano" },
    { badge: "Popular", title: "RASTA PASTA + MULE", meta: "Smooth food and drink combo", sub: "Relaxed VIP mood" },
    { badge: "VIP Tables", title: "MIDWEEK LUXE", meta: "Drinks • hookah • bottles", sub: "Reserve your section" }
  ],
  thursday: [
    { badge: "Live Thursday", title: "KARAOKE THURSDAY", meta: "Mic on • drinks up", sub: "Open Mic • Party Anthems" },
    { badge: "Popular", title: "WINGS + LONG ISLAND", meta: "A Thursday crowd favorite", sub: "Late night energy" },
    { badge: "VIP Tables", title: "SING • SIP • STAY", meta: "Bottle service available", sub: "Reserve your section" }
  ],
  friday: [
    { badge: "Friday Night", title: "FRIDAY NIGHT VIP", meta: "DJ • hookah • bottles", sub: "Hip-Hop • Afrobeats" },
    { badge: "Popular", title: "HOOKAH + FISHBOWL", meta: "Friday best-sellers", sub: "Prime lounge energy" },
    { badge: "VIP Tables", title: "BOOK YOUR SECTION", meta: "High-demand seating", sub: "Bottle service available" }
  ],
  saturday: [
    { badge: "Saturday VIP", title: "SATURDAY TAKEOVER", meta: "Bottle service • DJ • prime night", sub: "Hip-Hop • Afrobeats" },
    { badge: "Popular", title: "VIP BOTTLES + HOOKAH", meta: "Peak Saturday experience", sub: "Luxury section energy" },
    { badge: "VIP Tables", title: "CELEBRATE BIG", meta: "Birthdays • sections • sparklers", sub: "Reserve early" }
  ],
  sunday: [
    { badge: "Sunday Social", title: "SOCIAL SUNDAY", meta: "Food • wine • lounge", sub: "R&B • Soul" },
    { badge: "Popular", title: "SALMON DINNER + WINE", meta: "Smooth Sunday pairing", sub: "Chill lounge energy" },
    { badge: "VIP Tables", title: "END THE WEEK RIGHT", meta: "Hookah • bottles • food", sub: "Reserve your table" }
  ]
};

const PHASE6_PACKAGES = [
  {
    tier: "Gold",
    price: "$900",
    items: ["2 premium bottles", "1 hookah", "VIP section", "Mixer package"]
  },
  {
    tier: "Platinum",
    price: "$1200",
    items: ["3 premium bottles", "2 hookahs", "VIP section", "Mixer package"]
  },
  {
    tier: "Celebration",
    price: "$1500",
    items: ["4 premium bottles", "2 hookahs", "VIP section", "Celebration setup"]
  }
];

let phase6CountdownTimer = null;
let phase6FlyerTimer = null;

function phase6GetEventHour(day) {
  if (day === "monday" || day === "sunday") return 20;
  return 21;
}

function phase6NextOccurrence(day, hour) {
  const map = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, 0, 0, 0);

  const todayIndex = now.getDay();
  const targetIndex = map[day];
  let diff = targetIndex - todayIndex;

  if (diff < 0) diff += 7;

  if (diff === 0 && target <= now) {
    diff = 7;
  }

  target.setDate(now.getDate() + diff);
  return target;
}

function phase6RenderCountdown(day) {
  const wrap = document.createElement("section");
  wrap.className = "eventCountdown";
  wrap.innerHTML = `
    <div class="eventCountdown__left">
      <div class="eventCountdown__eyebrow">Next event countdown</div>
      <div class="eventCountdown__title">${day.toUpperCase()} vibe starts soon</div>
    </div>

    <div class="eventCountdown__clock">
      <div class="countChip">
        <span class="countChip__num" data-count="d">00</span>
        <span class="countChip__label">Days</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="h">00</span>
        <span class="countChip__label">Hours</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="m">00</span>
        <span class="countChip__label">Min</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="s">00</span>
        <span class="countChip__label">Sec</span>
      </div>
    </div>
  `;
  return wrap;
}

function phase6StartCountdown(day, scope) {
  if (phase6CountdownTimer) {
    clearInterval(phase6CountdownTimer);
    phase6CountdownTimer = null;
  }

  const hour = phase6GetEventHour(day);
  const target = phase6NextOccurrence(day, hour);

  const dEl = scope.querySelector('[data-count="d"]');
  const hEl = scope.querySelector('[data-count="h"]');
  const mEl = scope.querySelector('[data-count="m"]');
  const sEl = scope.querySelector('[data-count="s"]');

  function tick() {
    const now = new Date();
    let diff = Math.max(0, target.getTime() - now.getTime());

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;

    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;

    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;

    const secs = Math.floor(diff / 1000);

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(mins).padStart(2, "0");
    if (sEl) sEl.textContent = String(secs).padStart(2, "0");
  }

  tick();
  phase6CountdownTimer = setInterval(tick, 1000);
}

function phase6RenderFlyer(day) {
  const slides = PHASE6_FLYERS[day] || PHASE6_FLYERS.monday;

  const section = document.createElement("section");
  section.className = "flyerSlider";
  section.innerHTML = `
    <div class="flyerTrack"></div>
    <div class="flyerDots"></div>
  `;

  const track = section.querySelector(".flyerTrack");
  const dots = section.querySelector(".flyerDots");

  slides.forEach((slide, index) => {
    const card = document.createElement("article");
    card.className = `flyerCard${index === 0 ? " is-active" : ""}`;
    card.innerHTML = `
      <div class="flyerCard__badge">${slide.badge}</div>
      <div class="flyerCard__title">${slide.title}</div>
      <div class="flyerCard__meta">${slide.meta}</div>
      <div class="flyerCard__sub">${slide.sub}</div>
    `;
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `flyerDot${index === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dots.appendChild(dot);
  });

  return section;
}

function phase6StartFlyer(scope) {
  if (phase6FlyerTimer) {
    clearInterval(phase6FlyerTimer);
    phase6FlyerTimer = null;
  }

  const cards = [...scope.querySelectorAll(".flyerCard")];
  const dots = [...scope.querySelectorAll(".flyerDot")];
  if (!cards.length) return;

  let index = 0;

  function paint(nextIndex) {
    index = nextIndex;
    cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      paint(i);
    });
  });

  phase6FlyerTimer = setInterval(() => {
    const next = (index + 1) % cards.length;
    paint(next);
  }, 3500);
}

function phase6EnsureBottleModal() {
  if (document.querySelector(".bottleModal")) return;

  const modal = document.createElement("div");
  modal.className = "bottleModal";
  modal.innerHTML = `
    <div class="bottleModal__backdrop"></div>
    <div class="bottleModal__panel">
      <div class="bottleModal__head">
        <div class="bottleModal__title">Bottle Service</div>
        <button type="button" class="bottleModal__close" aria-label="Close">×</button>
      </div>
      <div class="bottleModal__sub">Choose a package and call to reserve your VIP section.</div>
      <div class="bottlePackages"></div>
    </div>
  `;

  const container = modal.querySelector(".bottlePackages");

  PHASE6_PACKAGES.forEach((pack) => {
    const article = document.createElement("article");
    article.className = "bottlePack";
    article.innerHTML = `
      <div class="bottlePack__tier">${pack.tier}</div>
      <div class="bottlePack__price">${pack.price}</div>
      <ul class="bottlePack__items">
        ${pack.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <a class="bottlePack__cta" href="tel:${PHONE}">Reserve / Call</a>
    `;
    container.appendChild(article);
  });

  document.body.appendChild(modal);

  const close = () => modal.classList.remove("is-open");

  modal.querySelector(".bottleModal__backdrop").addEventListener("click", close);
  modal.querySelector(".bottleModal__close").addEventListener("click", close);
}

function phase6EnsureBottleButton() {
  if (document.querySelector(".bottleServiceBtn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bottleServiceBtn";
  btn.innerHTML = `<span class="bottleServiceBtn__icon">🍾</span><span>Bottle Service</span>`;

  btn.addEventListener("click", () => {
    const modal = document.querySelector(".bottleModal");
    if (modal) modal.classList.add("is-open");
  });

  document.body.appendChild(btn);
}

function phase6Render(day) {
  const panel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
  if (!panel) return;

  panel.querySelectorAll(".eventCountdown,.flyerSlider").forEach((node) => node.remove());

  const insertAfter = panel.querySelector(".popularTonight") || panel.querySelector(".vipNightBanner") || panel.querySelector(".heroRow");
  if (!insertAfter) return;

  const countdown = phase6RenderCountdown(day);
  const flyer = phase6RenderFlyer(day);

  insertAfter.after(countdown);
  countdown.after(flyer);

  phase6StartCountdown(day, countdown);
  phase6StartFlyer(flyer);
}

(function phase6PatchActivateDay() {
  const originalActivateDay = activateDay;
  activateDay = function(day) {
    originalActivateDay(day);
    phase6Render(day);
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  phase6EnsureBottleModal();
  phase6EnsureBottleButton();
});