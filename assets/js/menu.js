/* =========================
   Menu Page JS (Clean + Food Sections)
   - Day tabs work
   - Category click renders ONLY after click
   - Default state: "Select a category above..."
   - Food: organized into sections (from your photo)
   - Tue–Sat share same menus
   - Sun + Mon share same menus
   - LIMITED TABLES tag:
       • Thursday after 9pm
       • Saturday after 10pm
       • Sunday after 10pm
   ========================= */

const PHONE = "+12025550123";

/* ---------- FOOD (Same everyday) ---------- */
const FOOD_BLOCK = {
  title: "Food",
  type: "foodSections",
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
        ["Fries", "$5"],
      ],
    },
    {
      title: "Wings",
      items: [
        ["(12) pcs Wings w/ Fries", "$16"],
        ["(8) pcs Wings w/ Fries", "$14"],
        ["(6) pcs Wings w/ Fries", "$12"],
        ["(12) pcs", "$14"],
        ["(8) pcs", "$10"],
        ["(6) pcs", "$8"],
      ],
    },
    {
      title: "Quesadillas",
      items: [
        ["Cheese", "$8"],
        ["Chicken", "$10"],
        ["Shrimp", "$12"],
        ["Salmon", "$14"],
      ],
    },
    {
      title: "Rasta Pasta or Alfredo",
      items: [
        ["Chicken", "$16"],
        ["Shrimp", "$18"],
        ["Salmon", "$20"],
      ],
    },
    {
      title: "Salads",
      items: [
        ["Salad", "$8"],
        ["Chicken", "$10"],
        ["Shrimp", "$12"],
        ["Salmon", "$13"],
        ["Dressings", "Ranch • Blue Cheese • Italian • Balsamic Vinaigrette • Caesar"],
      ],
    },
    {
      title: "Dinner",
      items: [
        ["Salmon (Yellow Rice & Broccoli)", "$20"],
        ["General Tso (Yellow Rice & Broccoli)", "$18"],
        ["Beef Burger w/ Fries", "$13"],
        ["Fried Shrimp Basket", "$18"],
        ["Crab Fries Basket", "$18"],
        ["Fried Whiting Basket", "$15"],
        ["Salmon Nugget Basket", "$15"],
        ["Catfish Nuggets Basket", "$13"],
      ],
    },
    {
      title: "Tacos",
      items: [
        ["Shrimp", "$16"],
        ["Chicken", "$14"],
        ["Includes", "Lettuce • Cheese • Sour Cream • Salsa"],
      ],
    },
    {
      title: "Upcharge",
      items: [
        ["Add Chicken", "$4"],
        ["Add Shrimp", "$5"],
        ["Add Salmon", "$6"],
      ],
    },
    {
      title: "Flavors",
      split: true,
      leftTitle: "Wet",
      left: ["Honey Lemon Pepper", "Honey Old Bay", "Buffalo BBQ", "Honey Sazon", "Sweet Chili", "Teriyaki", "Mumbo"],
      rightTitle: "Dry",
      right: ["Lemon Pepper", "Jerk Rub", "Old Bay"],
    },
  ],
};

/* ---------- BASE MENUS ---------- */

// Tue–Sat Happy Hour
const HH_TUE_SAT = {
  food: FOOD_BLOCK,

  shots5: {
    title: "$5 Shots",
    type: "spiritCols",
    cols: {
      Vodka: ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
      Tequila: ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
      Whiskey: ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
      "Liqueur": ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
      Cognac: ["Courvoisier","Hennessy"],
      Rum: ["Bacardi","Captain Morgan","Malibu","Myers"],
      Gin: ["Bombay","Roku","Tanqueray"],
    },
  },

  drinks10: {
    title: "$10 Drinks",
    type: "spiritCols",
    cols: {
      Vodka: ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
      Tequila: ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
      Whiskey: ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
      "Liqueur": ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
      Cognac: ["Courvoisier","Hennessy"],
      Rum: ["Bacardi","Captain Morgan","Malibu","Myers"],
      Gin: ["Bombay","Roku","Tanqueray"],
    },
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
      ["Moscow Mule", "Tito’s, Lime Juice & Ginger Beer"],
    ],
  },

  shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","D’usse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
  drinks14: { title: "$14 Drinks", type: "simpleList", items: ["(Same brands list as $7 tier)"] },

  premium: {
    title: "Premium",
    type: "twoCols",
    leftTitle: "$16 Shots • $32 Drinks",
    rightTitle: "$10 Shots • $20 Drinks",
    left: ["1942","Azul","D’usse XO","Remy XO"],
    right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"],
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
    right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"],
  },

  refill12: {
    title: "$12 Refill",
    type: "twoCols",
    leftTitle: "Refill Flavors",
    rightTitle: "Premium (+$2)",
    left: ["Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"],
    right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"],
  },

  tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
  fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
};

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

function setEmptyState(scopeKey) {
  const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
  if (!target) return;
  target.innerHTML = `<div class="muted" style="padding:8px 6px;">Select a category above to view items.</div>`;
}

function clearActiveCats(scopeKey) {
  const bar = document.querySelector(`[data-scope="${scopeKey}"]`);
  if (!bar) return;
  bar.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
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

  // FOOD sections renderer
  if (data.type === "foodSections") {
    const outer = document.createElement("div");
    outer.className = "colBox";

    (data.sections || []).forEach(sec => {
      outer.appendChild(el(`<div class="sectionHead" style="margin-top:10px;">${sec.title}</div>`));

      // Split wet/dry flavors block
      if (sec.split) {
        const two = document.createElement("div");
        two.className = "twoCols";
        const left = el(`<div class="colBox"><div class="colTitle">${sec.leftTitle || "Left"}</div></div>`);
        const right = el(`<div class="colBox"><div class="colTitle">${sec.rightTitle || "Right"}</div></div>`);
        const ulL = document.createElement("ul"); ulL.className = "bullets";
        const ulR = document.createElement("ul"); ulR.className = "bullets";
        (sec.left || []).forEach(x => ulL.appendChild(el(`<li>${x}</li>`)));
        (sec.right || []).forEach(x => ulR.appendChild(el(`<li>${x}</li>`)));
        left.appendChild(ulL); right.appendChild(ulR);
        two.appendChild(left); two.appendChild(right);
        outer.appendChild(two);
        return;
      }

      (sec.items || []).forEach(([name, price]) => {
        // if price is long text like "Ranch • ..." show it as muted row
        const looksLikeText = price && price.includes("•");
        if (looksLikeText) {
          outer.appendChild(el(`<div class="muted" style="padding-left:6px;">${name}: ${price}</div>`));
        } else {
          outer.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
        }
      });
    });

    wrap.appendChild(outer);
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* ---------- Category click wiring (NO auto render) ---------- */
function bindCategoryBarsOnce(root = document) {
  root.querySelectorAll("[data-scope]").forEach(bar => {
    if (bar.dataset.bound === "1") return;
    bar.dataset.bound = "1";

    // default: empty state + no active
    const scopeKey = bar.getAttribute("data-scope");
    clearActiveCats(scopeKey);
    setEmptyState(scopeKey);

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn || !bar.contains(btn)) return;

      bar.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      renderCategory(scopeKey, btn.getAttribute("data-cat"));
    });
  });
}

/* ---------- Day tabs ---------- */
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

      // re-init empty states on the new panel
      bindCategoryBarsOnce(panel || document);

      updateLimitedTablesTag();
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
      ["Hennessy VS", "$220"],
    ],
    premium: [
      ["Don Julio 1942", "$650"],
      ["Clase Azul", "$650"],
      ["Hennessy XO", "$550"],
    ],
    vip: [
      ["Ace of Spades", "$900"],
      ["Don Julio 1942 (VIP)", "$750"],
      ["Clase Azul Gold", "$900"],
    ],
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

  let show = false;
  if (day === "thursday" && hour >= 21) show = true;
  if (day === "saturday" && hour >= 22) show = true;
  if (day === "sunday" && hour >= 22) show = true;

  tag.style.display = show ? "inline-flex" : "none";
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  bindDayTabsOnce();
  bindCategoryBarsOnce(document);
  initBottlePills();

  updateLimitedTablesTag();
  setInterval(updateLimitedTablesTag, 60 * 1000);
});