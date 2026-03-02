/* =========================
   Menu Page JS (Full Clean)
   - Day tabs
   - Category click -> render
   - Tue–Sat share same menus
   - Sun + Mon share same menus
   - Food includes Flavors inside Food
   - LIMITED TABLES tag:
       • Thursday after 9pm
       • Saturday after 10pm
       • Sunday after 10pm
   - Scroll fade animations
   ========================= */

const PHONE = "+12025550123";

const FOOD_BLOCK = {
  title: "Food",
  type: "foodBlock",
  items: [
    ["Wings (6pc)", "$12", "Buffalo • Honey Garlic • Lemon Pepper"],
    ["Fries", "$6", "Classic • Loaded (+$4)"],
    ["Salmon Nuggets Basket", "$15", "Crispy bites • House sauce"],
    ["Rasta Pasta", "$16+", "Chicken $16 • Shrimp $18 • Salmon $20"]
  ],
  flavorsTitle: "Sauces / Flavors",
  flavors: ["Buffalo", "Honey Garlic", "Lemon Pepper", "Mild", "BBQ"]
};

/* ---------- BASE MENUS ---------- */

// Tue–Sat Happy Hour (your “full” set)
const HH_TUE_SAT = {
  food: FOOD_BLOCK,

  shots5: {
    title: "$5 Shots",
    type: "spiritCols",
    cols: {
      "Vodka": ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
      "Tequila": ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
      "Whiskey": ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
      "Liqueur": ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
      "Cognac": ["Courvoisier","Hennessy"],
      "Rum": ["Bacardi","Captain Morgan","Malibu","Myers"],
      "Gin": ["Bombay","Roku","Tanqueray"]
    }
  },

  // $10 drinks shows SAME list as $5 shots (only price changes)
  drinks10: {
    title: "$10 Drinks",
    type: "spiritCols",
    cols: {
      "Vodka": ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
      "Tequila": ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
      "Whiskey": ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
      "Liqueur": ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
      "Cognac": ["Courvoisier","Hennessy"],
      "Rum": ["Bacardi","Captain Morgan","Malibu","Myers"],
      "Gin": ["Bombay","Roku","Tanqueray"]
    }
  },

  cocktails10: {
    title: "$10 Cocktails",
    type: "cocktails",
    items: [
      ["Allure Lemon Drop", "Teremana Repo, Triple Sec, Lemon Juice & Simple Syrup"],
      ["Allure Sidecar", "Hennessy, Amaretto, Triple Sec & Lemon Juice"],
      ["Apple Martini", "Absolut & Green Apple Schnapps"],
      ["Bitch Please", "Espolon, Coconut Bacardi, Peach Schnapps, Blue Curacao, Sour Mix topped w/ Sprite"],
      ["Blue Motorcycle", "Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix, Blue Curacao topped w/ Sprite"],
      ["Ciroc Punch", "Ciroc, Pineapple Juice, Cranberry Juice & Peach Schnapps"],
      ["Classic Margarita", "Lunazul, Margarita Mix, Triple Sec (Original/Strawberry/Peach/Mango)"],
      ["Cosmopolitan", "Absolut, Triple Sec, Lime Juice & Cranberry Juice"],
      ["Gin Martini", "Bombay & Dry Vermouth"],
      ["Green Tea", "Jameson, Sour Mix, Peach Schnapps topped w/ Sprite"],
      ["Long Island", "Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix topped w/ Coke"],
      ["Manhattan", "Basil Hayden, Sweet Vermouth & Bitters"],
      ["Mint Julep", "Jim Beam, Mint Leaves & Simple Syrup"],
      ["Mojito", "Captain Morgan, Lime Juice, Mint Leaves & Simple Syrup topped w/ Soda Water"],
      ["Moscow Mule", "Tito’s, Lime Juice & Ginger Beer"],
      ["Old Fashion", "Bulleit, Simple Syrup & Bitters"],
      ["Orange Martini", "Orange Stoli, Lime Juice, Triple Sec, Orange Juice"],
      ["Red or White Sangria", "Red/White Wine, Fruit, Triple Sec topped w/ Soda Water"],
      ["Rum Punch", "Bacardi, Myers, Grenadine, Pineapple Juice, Orange Juice & Lime Juice"],
      ["Strawberry Henny", "Hennessy, Strawberry Puree, Sour Mix & Triple Sec"]
    ]
  },

  shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","D’usse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
  drinks14: { title: "$14 Drinks", type: "simpleList", items: ["(Same brands list as $7 tier)"] },

  premium: {
    title: "Premium",
    type: "twoCols",
    leftTitle: "$16 Shots • $32 Drinks",
    rightTitle: "$10 Shots • $20 Drinks",
    left: ["1942","Azul","D’usse XO","Remy XO"],
    right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
  },

  wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon","Chardonnay","Merlot","Moscato (Red/White)","Pinot Grigio","Sauvignon Blanc","Sweet Red"] },
  beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard","Corona","Guinness","Heineken","Modelo","Stella","Goose Island IPA","Voodoo Ranger IPA"] },
  highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
  na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"],["Ginger Beer", "$5"],["Frozen Drinks", "$5"],["Soda", "$3"],["Juice", "$3"],["Water", "$3"]] },

  hookah23: {
    title: "$23 Hookah",
    type: "twoCols",
    leftTitle: "Flavors",
    rightTitle: "Premium (+$2)",
    left: ["Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"],
    right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"]
  },

  refill12: {
    title: "$12 Refill",
    type: "twoCols",
    leftTitle: "Refill Flavors",
    rightTitle: "Premium (+$2)",
    left: ["Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"],
    right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"]
  },

  tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
  fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
};

// Tue–Sat Late Night
const LATE_TUE_SAT = {
  food: FOOD_BLOCK,
  shots7: HH_TUE_SAT.shots7,
  drinks14: HH_TUE_SAT.drinks14,
  premium: HH_TUE_SAT.premium,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  hookah23: HH_TUE_SAT.hookah23,
  tower43: HH_TUE_SAT.tower43,
  fishbowl23: HH_TUE_SAT.fishbowl23,
};

// Mon/Sun Happy Hour (simpler but still VIP)
const HH_MON_SUN = {
  food: FOOD_BLOCK,
  shots5: { title: "$5 Shots", type: "simpleList", items: ["Vodka","Tequila","Whiskey","Liqueur","Rum","Gin","Cognac"] },
  drinks10: { title: "$10 Drinks", type: "simpleList", items: ["Vodka","Tequila","Whiskey","Liqueur","Rum","Gin","Cognac"] },
  cocktails10: HH_TUE_SAT.cocktails10,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  hookah23: HH_TUE_SAT.hookah23,
  tower43: HH_TUE_SAT.tower43,
  fishbowl23: HH_TUE_SAT.fishbowl23,
};

// Mon/Sun Late Night (includes refill12)
const LATE_MON_SUN = {
  food: FOOD_BLOCK,
  shots7: HH_TUE_SAT.shots7,
  drinks14: HH_TUE_SAT.drinks14,
  premium: HH_TUE_SAT.premium,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  refill12: HH_TUE_SAT.refill12,
};

/* ---------- Scope map (this is what your HTML uses) ---------- */
const MENU_DATA = {
  "monday-happy": HH_MON_SUN,
  "monday-late": LATE_MON_SUN,

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

  "sunday-happy": HH_MON_SUN,
  "sunday-late": LATE_MON_SUN,
};

/* ---------- DOM helpers ---------- */
function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
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

  if (data.type === "simpleList") {
    const box = document.createElement("div");
    box.className = "colBox";
    const ul = document.createElement("ul");
    ul.className = "bullets";
    data.items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
    box.appendChild(ul);
    wrap.appendChild(box);
  }

  if (data.type === "pricedList") {
    const box = document.createElement("div");
    box.className = "colBox";
    data.items.forEach(([name, price]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
    });
    wrap.appendChild(box);
  }

  if (data.type === "cocktails") {
    const box = document.createElement("div");
    box.className = "colBox";
    data.items.forEach(([name, desc]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price"></span></div>`));
      box.appendChild(el(`<div class="muted" style="margin:-4px 0 10px 0; padding-left:6px;">${desc}</div>`));
    });
    wrap.appendChild(box);
  }

  if (data.type === "twoCols") {
    const two = document.createElement("div");
    two.className = "twoCols";

    const left = el(`<div class="colBox"><div class="colTitle">${data.leftTitle}</div></div>`);
    const right = el(`<div class="colBox"><div class="colTitle">${data.rightTitle}</div></div>`);

    const ulL = document.createElement("ul"); ulL.className = "bullets";
    const ulR = document.createElement("ul"); ulR.className = "bullets";

    (data.left || []).forEach(i => ulL.appendChild(el(`<li>${i}</li>`)));
    (data.right || []).forEach(i => ulR.appendChild(el(`<li>${i}</li>`)));

    left.appendChild(ulL);
    right.appendChild(ulR);

    two.appendChild(left);
    two.appendChild(right);

    wrap.appendChild(two);
  }

  if (data.type === "spiritCols") {
    const grid = document.createElement("div");
    grid.className = "twoCols";

    Object.entries(data.cols).forEach(([title, items]) => {
      const box = document.createElement("div");
      box.className = "colBox";
      box.appendChild(el(`<div class="colTitle">${title}</div>`));

      const ul = document.createElement("ul");
      ul.className = "bullets";
      items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
      box.appendChild(ul);

      grid.appendChild(box);
    });

    wrap.appendChild(grid);
  }

  if (data.type === "foodBlock") {
    const box = document.createElement("div");
    box.className = "colBox";

    (data.items || []).forEach(([name, price, note]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
      if (note) box.appendChild(el(`<div class="muted" style="margin:-4px 0 10px 0; padding-left:6px;">${note}</div>`));
    });

    box.appendChild(el(`<div class="sectionHead" style="margin-top:12px;">${data.flavorsTitle || "Flavors"}</div>`));

    const ul = document.createElement("ul");
    ul.className = "bullets";
    (data.flavors || []).forEach(f => ul.appendChild(el(`<li>${f}</li>`)));
    box.appendChild(ul);

    wrap.appendChild(box);
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* ---------- Bind category bars ONCE ---------- */
function bindCategoryBarsOnce(root = document) {
  root.querySelectorAll("[data-scope]").forEach(bar => {
    if (bar.dataset.bound === "1") return;
    bar.dataset.bound = "1";

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn || !bar.contains(btn)) return;

      const scopeKey = bar.getAttribute("data-scope");
      const catKey = btn.getAttribute("data-cat");

      const isAlreadyActive = btn.classList.contains("active");
      const isFocus = bar.classList.contains("is-focus");

      // If user clicks the ACTIVE chip again, toggle focus mode OFF (bring all chips back)
      if (isAlreadyActive && isFocus) {
        bar.classList.remove("is-focus");
        return;
      }

      // Activate the clicked chip
      bar.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Turn focus mode ON (hide other chips)
      bar.classList.add("is-focus");

      // Render content
      renderCategory(scopeKey, catKey);
    });
  });
}

function renderInitialActiveCategories(root = document) {
  root.querySelectorAll("[data-scope]").forEach(bar => {
    const scopeKey = bar.getAttribute("data-scope");
    const buttons = [...bar.querySelectorAll(".cat")];
    if (!buttons.length) return;

    const first = buttons.find(b => b.classList.contains("active")) || buttons[0];
    renderCategory(scopeKey, first.getAttribute("data-cat"));
  });
}

/* ---------- Day tabs ONCE ---------- */
function bindDayTabsOnce() {
  const tabs = [...document.querySelectorAll(".dayTab")];
  const panels = [...document.querySelectorAll(".dayPanel")];

  tabs.forEach(t => {
    if (t.dataset.bound === "1") return;
    t.dataset.bound = "1";

    t.addEventListener("click", () => {
      const key = t.getAttribute("data-daytab");

      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");

      panels.forEach(p => p.classList.remove("active"));
      const panel = document.querySelector(`.dayPanel[data-daypanel="${key}"]`);
      if (panel) panel.classList.add("active");

      bindCategoryBarsOnce(panel || document);
      renderInitialActiveCategories(panel || document);
      updateLimitedTablesTag();
      revealOnScrollTick();
    });
  });
}

/* ---------- Bottles ---------- */
function initBottlePills() {
  const pills = [...document.querySelectorAll(".pillRow .pill")];
  const list = document.getElementById("bottleList");
  if (!pills.length || !list) return;

  const data = {
    standard: [
      ["Don Julio Blanco", "$220"],
      ["Casamigos Reposado", "$240"],
      ["Hennessy VS", "$220"]
    ],
    premium: [
      ["Don Julio 1942", "$650"],
      ["Clase Azul", "$650"],
      ["Hennessy XO", "$550"]
    ],
    vip: [
      ["Ace of Spades", "$900"],
      ["Don Julio 1942 (VIP)", "$750"],
      ["Clase Azul Gold", "$900"]
    ]
  };

  const paint = (key) => {
    list.innerHTML = "";
    (data[key] || []).forEach(([name, price]) => {
      list.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
    });
    list.appendChild(el(`<div class="muted" style="margin-top:10px;">(Replace these prices with your real list anytime.)</div>`));
  };

  pills.forEach(p => {
    if (p.dataset.bound === "1") return;
    p.dataset.bound = "1";
    p.addEventListener("click", () => {
      pills.forEach(x => x.classList.remove("active"));
      p.classList.add("active");
      paint(p.getAttribute("data-bottle"));
    });
  });

  paint("standard");
}

/* ---------- LIMITED TABLES logic ---------- */
function updateLimitedTablesTag() {
  const activePanel = document.querySelector(".dayPanel.active");
  if (!activePanel) return;

  const day = activePanel.getAttribute("data-daypanel");
  const tag = activePanel.querySelector("[data-limited-tag]");
  if (!tag) return;

  const now = new Date();
  const hour = now.getHours();

  // Requirements:
  // - Thursday after 9pm
  // - Saturday after 10pm
  // - Sunday after 10pm
  let show = false;
  if (day === "thursday" && hour >= 21) show = true;
  if (day === "saturday" && hour >= 22) show = true;
  if (day === "sunday" && hour >= 22) show = true;

  tag.style.display = show ? "inline-flex" : "none";
}

/* ---------- Scroll fade animations ---------- */
let io = null;
function initRevealObserver() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("inView");
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  } else {
    // fallback
    els.forEach(el => el.classList.add("inView"));
  }
}

function revealOnScrollTick() {
  // Helps when switching days and new panels appear
  document.querySelectorAll(".dayPanel.active .reveal").forEach(el => {
    el.classList.add("inView");
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  bindDayTabsOnce();
  bindCategoryBarsOnce(document);
  renderInitialActiveCategories(document);
  initBottlePills();
  initRevealObserver();

  updateLimitedTablesTag();
  setInterval(updateLimitedTablesTag, 60 * 1000);
});
