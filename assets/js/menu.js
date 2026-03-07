/* =========================
   Menu Page JS (Clean + Phase 3)
   ========================= */

const PHONE = "+12025550123";

/* =========================
   DAY PROMOS
   ========================= */

const DAY_PROMOS = {
  monday: {
    title: "FREE HOOKAH MONDAY",
    text: "Tap a category to explore tonight’s menu."
  },
  tuesday: {
    title: "TACO TUESDAY",
    text: "Tap a category to explore tacos, drinks, and bottles."
  },
  wednesday: {
    title: "MIDWEEK WEDNESDAY",
    text: "Tap a category to explore tonight’s specials."
  },
  thursday: {
    title: "KARAOKE THURSDAY",
    text: "Tap a category to explore the karaoke night menu."
  },
  friday: {
    title: "ALLURE FRIDAY",
    text: "Tap a category to explore the Friday experience."
  },
  saturday: {
    title: "ALLURE SATURDAY",
    text: "Tap a category to explore Saturday night specials."
  },
  sunday: {
    title: "SOCIAL SUNDAY",
    text: "Tap a category to explore Sunday food and drinks."
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
      title: "VIP",
      items: [
        ["Ace of Spades", "$900"],
        ["Don Julio 1942 (VIP)", "$750"],
        ["Clase Azul Gold", "$900"]
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

const LATE_MON_SUN = {
  food: FOOD_BLOCK,
  bottles: BOTTLES_BLOCK,
  shots7: HH_TUE_SAT.shots7,
  drinks14: HH_TUE_SAT.drinks14,
  premium: HH_TUE_SAT.premium,
  wine6: HH_TUE_SAT.wine6,
  beer4: HH_TUE_SAT.beer4,
  highnoon8: HH_TUE_SAT.highnoon8,
  na: HH_TUE_SAT.na,
  refill12: HH_TUE_SAT.refill12
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
  "sunday-late": LATE_MON_SUN
};

/* =========================
   HELPERS
   ========================= */

function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

function getPromoMarkup(day) {
  const promo = DAY_PROMOS[day] || DAY_PROMOS.monday;
  return `
    <div class="menuPromo">
      <div class="menuPromoIcon">✨</div>
      <div class="menuPromoTitle">${promo.title}</div>
      <div class="menuPromoText">${promo.text}</div>
    </div>
  `;
}

function applyDayTheme(day) {
  document.body.setAttribute("data-day-theme", day || "monday");
}

function ensureMobileReserve() {
  let btn = document.querySelector(".mobileReserve");
  if (btn) return;

  btn = document.createElement("a");
  btn.className = "mobileReserve";
  btn.href = `tel:${PHONE}`;
  btn.textContent = "Reserve / Call";

  document.body.appendChild(btn);
}

function setClosedState(root = document) {
  const activePanel =
    root.querySelector(".dayPanel.active") ||
    document.querySelector(".dayPanel.active");

  let day = "monday";
  if (activePanel) {
    day = activePanel.getAttribute("data-daypanel") || "monday";
  }

  applyDayTheme(day);

  root.querySelectorAll("[data-scopebody]").forEach((body) => {
    body.innerHTML = getPromoMarkup(day);
  });

  root.querySelectorAll("[data-scope]").forEach((bar) => {
    bar.style.display = "";
    bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
  });

  root.querySelectorAll(".focusBackBtn").forEach((b) => b.remove());
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
   RENDERERS
   ========================= */

function renderFoodAccordion(data) {
  const outer = document.createElement("div");
  outer.className = "listGrid";

  (data.sections || []).forEach((section) => {
    const details = document.createElement("details");
    details.className = "acc";
    details.open = false;

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
      box.appendChild(
        el(`<div class="muted" style="margin-top:8px; text-align:left; padding:0;">${section.note}</div>`)
      );
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

  const preferredOrder = ["Vodka", "Tequila", "Whiskey", "Rum", "Gin", "Cognac", "Liqueur"];
  const cols = data.cols || {};

  preferredOrder.forEach((title) => {
    if (!cols[title]) return;

    const details = document.createElement("details");
    details.className = "acc";
    details.open = false;

    const summary = document.createElement("summary");
    summary.className = "acc__summary";
    summary.textContent = title;

    const box = document.createElement("div");
    box.className = "colBox";

    const ul = document.createElement("ul");
    ul.className = "bullets";

    cols[title].forEach((i) => {
      ul.appendChild(el(`<li>${i}</li>`));
    });

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
    details.open = false;

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

    (data.items || []).forEach((i) => {
      ul.appendChild(el(`<li>${i}</li>`));
    });

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

  } else {
    wrap.appendChild(el(`<div class="muted">Unknown category type.</div>`));
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* =========================
   CATEGORY CLICKS
   ========================= */

function bindCategoryBarsOnce(root = document) {
  root.querySelectorAll("[data-scope]").forEach((bar) => {
    if (bar.dataset.bound === "1") return;
    bar.dataset.bound = "1";

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn || !bar.contains(btn)) return;

      const scopeKey = bar.getAttribute("data-scope");
      const catKey = btn.getAttribute("data-cat");

      bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
      if (!target) return;

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

        const activePanel =
          bar.closest(".dayPanel") || document.querySelector(".dayPanel.active");

        const day = activePanel?.getAttribute("data-daypanel") || "monday";
        applyDayTheme(day);
        target.innerHTML = getPromoMarkup(day);

        back.remove();
      });

      target.prepend(back);

      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 120);
    });
  });
}

/* =========================
   DAY TABS
   ========================= */

function bindDayTabsOnce() {
  const tabs = [...document.querySelectorAll(".dayTab")];
  const panels = [...document.querySelectorAll(".dayPanel")];

  tabs.forEach((t) => {
    if (t.dataset.bound === "1") return;
    t.dataset.bound = "1";

    t.addEventListener("click", () => {
      const key = t.getAttribute("data-daytab");

      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");

      panels.forEach((p) => p.classList.remove("active"));
      const panel = document.querySelector(`.dayPanel[data-daypanel="${key}"]`);
      if (panel) panel.classList.add("active");

      applyDayTheme(key);
      bindCategoryBarsOnce(panel || document);
      setClosedState(panel || document);
      updateLimitedTablesTag();
      revealOnScrollTick();
    });
  });
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
   REVEAL
   ========================= */

let io = null;

function initRevealObserver() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("inView");
      });
    }, { threshold: 0.12 });

    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("inView"));
  }
}

function revealOnScrollTick() {
  document.querySelectorAll(".dayPanel.active .reveal").forEach((el) => {
    el.classList.add("inView");
  });
}

/* =========================
   BOOT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  ensureMobileReserve();
  bindDayTabsOnce();
  bindCategoryBarsOnce(document);
  setClosedState(document);
  initRevealObserver();
  updateLimitedTablesTag();
  setInterval(updateLimitedTablesTag, 60 * 1000);
});
