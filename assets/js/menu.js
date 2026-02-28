/* =========================
   assets/js/menu.js
   FULL CLEAN REPLACEMENT (safe + clickable)
   - Day tabs
   - Category chips (auto-add Food chip)
   - Renders Food + Flavors + Upcharge
   ========================= */

const PHONE = "+12025550123";

/* ---------- Menu data ---------- */
const MENU_DATA = {
  /* =======================
     MONDAY
     ======================= */
  "monday-happy": {
    food: { title: "Food + Flavors", type: "foodFull", sections: foodSectionsFromPhoto() },

    shots5: { title: "$5 Shots", type: "simpleList", items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"] },
    drinks10: { title: "$10 Drinks", type: "simpleList", items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"] },
    cocktails10: {
      title: "$10 Cocktails",
      type: "cocktails",
      items: [
        ["Allure Lemon Drop", "Teremana Repo, Triple Sec, Lemon Juice & Simple Syrup"],
        ["Long Island", "Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix topped w/ Coke"],
        ["Mojito", "Captain Morgan, Lime Juice, Mint Leaves & Simple Syrup topped w/ Soda Water"],
        ["Moscow Mule", "Tito's, Lime Juice & Ginger Beer"],
      ],
    },
    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    hookah23: {
      title: "$23 Hookah",
      type: "twoCols",
      leftTitle: "Flavors",
      rightTitle: "Premium (+$2)",
      left: [
        "Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"
      ],
      right: ["Bluemist +$2","Magic Love +$2","Lady Killer +$2","Love 66 +$2"]
    },
    tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
  },

  "monday-late": {
    food: { title: "Food + Flavors", type: "foodFull", sections: foodSectionsFromPhoto() },

    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    premium: {
      title: "Premium",
      type: "twoCols",
      leftTitle: "$16 Shots • $32 Drinks",
      rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","Dusse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    refill12: { title: "$12 Refill", type: "simpleList", items: ["Hookah refill (see flavors under Food + Flavors)"] },
  },

  /* =======================
     TUESDAY
     ======================= */
  "tuesday-happy": {
    food: { title: "Food + Flavors", type: "foodFull", sections: foodSectionsFromPhoto() },

    shots5: {
      title: "$5 Shots",
      type: "spiritCols",
      cols: {
        Vodka: ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
        Tequila: ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
        Whiskey: ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar's","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
        Liqueur: ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
        Cognac: ["Courvoisier","Hennessy"],
        Rum: ["Bacardi","Captain Morgan","Malibu","Myers"],
        Gin: ["Bombay","Roku","Tanqueray"]
      }
    },

    /* $10 Drinks = SAME list as $5 list (you asked this) */
    drinks10: {
      title: "$10 Drinks",
      type: "spiritCols",
      cols: {
        Vodka: ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
        Tequila: ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
        Whiskey: ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar's","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
        Liqueur: ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori"],
        Cognac: ["Courvoisier","Hennessy"],
        Rum: ["Bacardi","Captain Morgan","Malibu","Myers"],
        Gin: ["Bombay","Roku","Tanqueray"]
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
        ["Moscow Mule", "Tito's, Lime Juice & Ginger Beer"],
        ["Old Fashion", "Bulleit, Simple Syrup & Bitters"],
        ["Orange Martini", "Orange Stoli, Lime Juice, Triple Sec, Orange Juice"],
        ["Red or White Sangria", "Red/White Wine, Fruit, Triple Sec topped w/ Soda Water"],
        ["Rum Punch", "Bacardi, Myers, Grenadine, Pineapple Juice, Orange Juice & Lime Juice"],
        ["Strawberry Henny", "Hennessy, Strawberry Puree, Sour Mix & Triple Sec"]
      ]
    },

    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },

    premium: {
      title: "Premium",
      type: "twoCols",
      leftTitle: "$16 Shots • $32 Drinks",
      rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","Dusse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },

    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon","Chardonnay","Merlot","Moscato (Red/White)","Pinot Grigio","Sauvignon Blanc","Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard","Corona","Guinness","Heineken","Modelo","Stella","Goose Island IPA","Voodoo Ranger IPA"] },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"],["Ginger Beer", "$5"],["Frozen Drinks", "$5"],["Soda", "$3"],["Juice", "$3"],["Water", "$3"]] },

    hookah23: {
      title: "$23 Hookah",
      type: "simpleList",
      items: ["Choose flavors inside Food + Flavors"]
    },

    refill12: {
      title: "$12 Refill (Hookah)",
      type: "simpleList",
      items: ["Refill flavors are inside Food + Flavors"]
    },

    tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
  },

  "tuesday-late": {
    food: { title: "Food + Flavors", type: "foodFull", sections: foodSectionsFromPhoto() },

    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    premium: {
      title: "Premium",
      type: "twoCols",
      leftTitle: "$16 Shots • $32 Drinks",
      rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","Dusse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },
    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon","Chardonnay","Merlot","Moscato (Red/White)","Pinot Grigio","Sauvignon Blanc","Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard","Corona","Guinness","Heineken","Modelo","Stella","Goose Island IPA","Voodoo Ranger IPA"] },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"],["Ginger Beer", "$5"],["Frozen Drinks", "$5"],["Soda", "$3"],["Juice", "$3"],["Water", "$3"]] },
    hookah23: { title: "$23 Hookah", type: "simpleList", items: ["Choose flavors inside Food + Flavors"] },
    tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
  }
};

/* ---------- Food menu from your photo ---------- */
function foodSectionsFromPhoto() {
  return [
    {
      title: "APPETIZERS",
      items: [
        ["Salmon Sliders w/ Fries", "$12", ""],
        ["Beef Sliders w/ Fries", "$10", ""],
        ["Mozzarella Sticks", "$7", ""],
        ["Fried Pickles", "$5", ""],
        ["Chips & Salsa", "$5", ""],
        ["Onion Rings", "$7", ""],
        ["Fries", "$5", ""]
      ]
    },
    {
      title: "WINGS",
      items: [
        ["(12) pcs Wing w/ Fries", "$16", ""],
        ["(8) pcs Wing w/ Fries", "$14", ""],
        ["(6) pcs Wings w/ Fries", "$12", ""],
        ["(12) pcs", "$14", ""],
        ["(8) pcs", "$10", ""],
        ["(6) pcs", "$8", ""]
      ]
    },
    {
      title: "QUESADILLAS",
      items: [
        ["Cheese", "$8", ""],
        ["Chicken", "$10", ""],
        ["Shrimp", "$12", ""],
        ["Salmon", "$14", ""]
      ]
    },
    {
      title: "RASTA PASTA OR ALFREDO",
      items: [
        ["Chicken", "$16", ""],
        ["Shrimp", "$18", ""],
        ["Salmon", "$20", ""]
      ]
    },
    {
      title: "SALADS",
      items: [
        ["Salad", "$8", ""],
        ["Chicken", "$10", ""],
        ["Shrimp", "$12", ""],
        ["Salmon", "$13", ""],
        ["Dressings", "", "Ranch • Blue Cheese • Italian • Balsamic Vinaigrette • Caesar"]
      ]
    },
    {
      title: "DINNER",
      items: [
        ["Salmon", "$20", "Yellow Rice & Broccoli"],
        ["General Tso", "$18", "Yellow Rice & Broccoli"],
        ["Beef Burger w/ Fries", "$13", "Mayo • Lettuce • Tomato • Cheese"],
        ["Fried Shrimp Basket", "$18", ""],
        ["Crab Fries Basket", "$18", ""],
        ["Fried Whiting Basket", "$15", ""],
        ["Salmon Nugget Basket", "$15", ""],
        ["Catfish Nuggets Basket", "$18", ""]
      ]
    },
    {
      title: "TACOS",
      items: [
        ["Shrimp", "$16", ""],
        ["Chicken", "$14", "Lettuce • Cheese • Sour Cream • Salsa"]
      ]
    },
    {
      title: "UPCHARGE",
      items: [
        ["Add Chicken", "$4", ""],
        ["Add Shrimp", "$5", ""],
        ["Add Salmon", "$6", ""]
      ]
    },
    {
      title: "FLAVORS",
      items: [
        ["WET", "", "Honey Lemon Pepper • Honey Old Bay • Buffalo BBQ • Honey Sazon • Sweet Chili • Teriyaki • Mumbo"],
        ["DRY", "", "Lemon Pepper • Jerk Rub • Old Bay"]
      ]
    }
  ];
}

/* ---------- DOM helpers ---------- */
function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

function ensureFoodChip(bar, scopeKey) {
  // If scope has food data but the chip doesn't exist in HTML, insert it FIRST.
  const hasFoodData = !!(MENU_DATA[scopeKey] && MENU_DATA[scopeKey].food);
  if (!hasFoodData) return;

  const already = bar.querySelector('.cat[data-cat="food"]');
  if (already) return;

  const btn = document.createElement("button");
  btn.className = "cat";
  btn.setAttribute("data-cat", "food");
  btn.textContent = "Food";
  bar.insertBefore(btn, bar.firstChild);
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
    const flow = document.createElement("div");
    flow.className = "twoCols";
    Object.entries(data.cols).forEach(([title, items]) => {
      const box = document.createElement("div");
      box.className = "colBox";
      box.appendChild(el(`<div class="colTitle">${title}</div>`));
      const ul = document.createElement("ul");
      ul.className = "bullets";
      items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
      box.appendChild(ul);
      flow.appendChild(box);
    });
    wrap.appendChild(flow);
  }

  if (data.type === "foodFull") {
    const box = document.createElement("div");
    box.className = "colBox";

    (data.sections || []).forEach(section => {
      box.appendChild(el(`<div class="sectionHead" style="margin-top:10px;">${section.title}</div>`));
      (section.items || []).forEach(([name, price, note]) => {
        if (price || name) {
          box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price || ""}</span></div>`));
        }
        if (note) {
          box.appendChild(el(`<div class="muted" style="margin:-4px 0 10px 0; padding-left:6px;">${note}</div>`));
        }
      });
    });

    wrap.appendChild(box);
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* ---------- Category wiring (safe init) ---------- */
function initCategoryBars() {
  document.querySelectorAll("[data-scope]").forEach(bar => {
    if (bar.dataset.inited === "1") return; // prevent double-binding
    bar.dataset.inited = "1";

    const scopeKey = bar.getAttribute("data-scope");

    // Auto-add food chip if missing
    ensureFoodChip(bar, scopeKey);

    const activate = (btn) => {
      const buttons = [...bar.querySelectorAll(".cat")];
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategory(scopeKey, btn.getAttribute("data-cat"));
    };

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn || !bar.contains(btn)) return;
      activate(btn);
    });

    // First render: if any active exists use it; else use Food if present; else first chip
    const active = bar.querySelector(".cat.active");
    const food = bar.querySelector('.cat[data-cat="food"]');
    const first = bar.querySelector(".cat");

    activate(active || food || first);
  });
}

/* ---------- Day tabs wiring ---------- */
function initDayTabs() {
  const tabs = [...document.querySelectorAll(".dayTab")];
  const panels = [...document.querySelectorAll(".dayPanel")];

  tabs.forEach(t => {
    t.addEventListener("click", () => {
      const key = t.getAttribute("data-daytab");

      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");

      panels.forEach(p => p.classList.remove("active"));
      const panel = document.querySelector(`.dayPanel[data-daypanel="${key}"]`);
      if (panel) panel.classList.add("active");

      // IMPORTANT: category bars inside the newly shown panel may not be inited yet
      initCategoryBars();
    });
  });
}

/* ---------- Bottle pills (kept as you had) ---------- */
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

  pills.forEach(p => p.addEventListener("click", () => {
    pills.forEach(x => x.classList.remove("active"));
    p.classList.add("active");
    paint(p.getAttribute("data-bottle"));
  }));

  paint("standard");
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  try {
    initDayTabs();
    initCategoryBars();
    initBottlePills();
  } catch (err) {
    console.error("Menu JS failed:", err);
  }
});