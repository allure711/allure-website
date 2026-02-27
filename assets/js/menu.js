/* =========================
   Menu Page JS
   - Day tabs
   - Category click -> show that category's items
   ========================= */

const PHONE = "+12025550123";

// Menu data (Tuesday filled from your images; you can expand any day)
const MENU_DATA = {
  "monday-happy": {
    shots5: { title: "$5 Shots", type: "simpleList", items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"] },
    drinks10: { title: "$10 Drinks", type: "simpleList", items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"] },
    cocktails10: { title: "$10 Cocktails", type: "cocktails", items: [
      ["Allure Lemon Drop", "Teremana Repo, Triple Sec, Lemon Juice & Simple Syrup"],
      ["Long Island", "Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix topped w/ Coke"],
      ["Mojito", "Captain Morgan, Lime Juice, Mint Leaves & Simple Syrup topped w/ Soda Water"],
      ["Moscow Mule", "Tito’s, Lime Juice & Ginger Beer"],
    ]},
    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    hookah23: { title: "$23 Hookah", type: "twoCols", leftTitle: "Flavors", rightTitle: "Premium (+$2)", left: [
      "Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"
    ], right: ["Bluemist +$2","Magic Love +$2","Lady Killer +$2","Love 66 +$2"] },
    tower43: { title: "$43 Tower", type: "simpleList", items: ["Ask server for flavors / specials"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["Ask server for flavors / specials"] },
  },

  "monday-late": {
    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","D’usse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["(Use same brands list as $7 tier)"] },
    premium: { title: "Premium", type: "twoCols", leftTitle: "$16 Shots • $32 Drinks", rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","D’usse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    refill12: { title: "$12 Refill", type: "simpleList", items: ["(Hookah refill)"] },
  },

  // TUESDAY (your request with every category clickable)
  "tuesday-happy": {
    shots5: { title: "$5 Shots", type: "spiritCols", cols: {
      "Vodka": ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
      "Tequila": ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
      "Whiskey": ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
      "Liqueur / Cognac / Rum / Gin": ["Disaronno","Grand Marnier","Hpnotiq","Jagermeister","Midori","Courvoisier","Hennessy","Bacardi","Captain Morgan","Malibu","Myers","Bombay","Roku","Tanqueray"]
    }},
    drinks10: { title: "$10 Drinks", type: "simpleList", items: ["Vodka • Tequila • Whiskey • Liqueur • Rum • Gin • Cognac"] },
    cocktails10: { title: "$10 Cocktails", type: "cocktails", items: [
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
    ]},
    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","D’usse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["(Same brands list as $7 tier)"] },
    premium: { title: "Premium", type: "twoCols", leftTitle: "$16 Shots • $32 Drinks", rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","D’usse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },
    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    hookah23: { title: "$23 Hookah", type: "twoCols", leftTitle: "Flavors", rightTitle: "Premium (+$2)", left: [
      "Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"
    ], right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"] },
    refill12: { title: "$12 Refill", type: "simpleList", items: ["(Hookah refill)"] },
    tower43: { title: "$43 Tower", type: "simpleList", items: ["(Ask server for flavors / specials)"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["(Ask server for flavors / specials)"] },
  },

  "tuesday-late": {
    shots7: { title: "$7 Shots", type: "simpleList", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","D’usse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] },
    drinks14: { title: "$14 Drinks", type: "simpleList", items: ["(Same brands list as $7 tier)"] },
    premium: { title: "Premium", type: "twoCols", leftTitle: "$16 Shots • $32 Drinks", rightTitle: "$10 Shots • $20 Drinks",
      left: ["1942","Azul","D’usse XO","Remy XO"],
      right: ["Gran Coramino","JW Black","JW Double Black","JW Gold"]
    },
    wine6: { title: "$6 Wine", type: "simpleList", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] },
    beer4: { title: "$4 Beer", type: "simpleList", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] },
    highnoon8: { title: "$8 High Noon", type: "twoCols", leftTitle: "Vodka", rightTitle: "Tequila", left: ["Grapefruit","Mango"], right: ["Lime","Strawberry"] },
    na: { title: "Non-Alcoholic", type: "pricedList", items: [["Red Bull", "$5"], ["Ginger Beer", "$5"], ["Frozen Drinks", "$5"], ["Soda", "$3"], ["Juice", "$3"], ["Water", "$3"]] },
    hookah23: { title: "$23 Hookah", type: "twoCols", leftTitle: "Flavors", rightTitle: "Premium (+$2)", left: [
      "Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"
    ], right: ["Bluemist +$2","Lady Killer +$2","Love 66 +$2","Magic Love +$2"] },
    tower43: { title: "$43 Tower", type: "simpleList", items: ["(Ask server for flavors / specials)"] },
    fishbowl23: { title: "$23 Fishbowl", type: "simpleList", items: ["(Ask server for flavors / specials)"] },
  }
};

/* ---------- Render helpers ---------- */
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

  // build UI
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
    left.appendChild(ulL); right.appendChild(ulR);
    two.appendChild(left); two.appendChild(right);
    wrap.appendChild(two);
  }

  if (data.type === "spiritCols") {
    const two = document.createElement("div");
    two.className = "twoCols";
    Object.entries(data.cols).forEach(([title, items], idx) => {
      const box = document.createElement("div");
      box.className = "colBox";
      box.appendChild(el(`<div class="colTitle">${title}</div>`));
      const ul = document.createElement("ul");
      ul.className = "bullets";
      items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
      box.appendChild(ul);
      two.appendChild(box);

      // force 2 columns layout; if more than 2 groups, it will wrap naturally
      if (idx === 1) wrap.appendChild(two.cloneNode(true));
    });

    // better: render as flowing boxes
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

  // paint
  target.innerHTML = "";
  target.appendChild(wrap);
}

/* ---------- Category click wiring ---------- */
function initCategoryBars() {
  document.querySelectorAll("[data-scope]").forEach(bar => {
    const scopeKey = bar.getAttribute("data-scope");
    const buttons = [...bar.querySelectorAll(".cat")];

    const activate = (btn) => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const catKey = btn.getAttribute("data-cat");
      renderCategory(scopeKey, catKey);
    };

    buttons.forEach(btn => btn.addEventListener("click", () => activate(btn)));

    // initial render
    const first = buttons.find(b => b.classList.contains("active")) || buttons[0];
    if (first) activate(first);
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

      // render category bars inside the newly activated panel (safe to re-init)
      initCategoryBars();
    });
  });
}

/* ---------- Bottle pills (simple placeholder) ---------- */
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
    data[key].forEach(([name, price]) => {
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
  initDayTabs();
  initCategoryBars();
  initBottlePills();
});