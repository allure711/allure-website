/* =========================
   Allure Menu JS
   File: assets/js/menu.js
   ========================= */

/**
 * DATA MODEL
 * day -> sections: happy + late
 * section -> categories[] (buttons) + panels for each category
 *
 * IMPORTANT:
 * You asked:
 * - Food should be on top with other categories ✅
 * - “$10 drinks” should have SAME list as $5 drinks, just price $10 ✅
 *   (We treat it as its own category using the same list)
 * - $14 drinks needs list ✅
 * - Hookah refill needs flavors ✅
 * - $10 Cocktails needs full list ✅
 * - Add flavor section under food ✅
 */

const MENU = {
  monday: {
    title: "MONDAY",
    subtitle: "Happy Hour 5PM–9PM • After 9PM Late-Night Menu",
    happy: buildHappyHourTuesdayLike({
      cocktailsPriceLabel: "$12 Cocktails",
      drinks10Label: "$12 Drinks",
      shots5Label: "$5 Shots",
      hookahLabel: "$23 Hookah",
      refillLabel: "$15 Refill"
    }),
    late: buildLateNightBase({
      heroNote: "After 9PM • Late-night favorites",
      includeHookah: true
    })
  },

  tuesday: {
    title: "TUESDAY",
    subtitle: "Happy Hour 5PM–9PM • After 9PM Late-Night Menu",
    happy: buildHappyHourTuesdayLike({
      cocktailsPriceLabel: "$10 Cocktails",
      drinks10Label: "$10 Drinks",
      shots5Label: "$5 Shots",
      hookahLabel: "$23 Hookah",
      refillLabel: "$12 Refill"
    }),
    late: buildLateNightBase({
      heroNote: "After 9PM • Late-night favorites",
      includeHookah: true
    })
  },

  wednesday: placeholderDay("WEDNESDAY"),
  thursday: placeholderDay("THURSDAY"),
  friday: placeholderDay("FRIDAY"),
  saturday: placeholderDay("SATURDAY"),
  sunday: placeholderDay("SUNDAY")
};

/* --------- Shared Lists from your menu images --------- */

const SPIRITS_BASE = {
  vodka: ["Absolut","Belvedere","Ciroc","Grey Goose","Kettle One","Stoli Orange","Titos"],
  tequila: ["1800 (Blanco/Repo)","Altos","Espolon","Hornitos","Jose Cuervo","Lunazul","Milagro","Teremana"],
  whiskey: ["Basil Hayden","Bulleit","Chivas Regal","Crown","Dewar’s","Fireball","Jack Daniels","Jameson","Jim Beam","Makers Mark","Woodford"],
  liqueur: ["Disaronno","Grand Marnier","Hpnotiq","Jägermeister","Midori"],
  rum: ["Bacardi","Captain Morgan","Malibu","Myers"],
  gin: ["Bombay","Roku","Tanqueray"],
  cognac: ["Courvoisier","Hennessy"]
};

const SHOTS7_DRINKS14_LIST = [
  "818",
  "Casa Azul",
  "Casamigos",
  "Ciroc VS",
  "Don Julio",
  "D’USSÉ",
  "Equiano",
  "Hendrick’s",
  "Hennessy VSOP",
  "Herradura",
  "Old Forester",
  "Patrón",
  "Remy 1738",
  "Remy VSOP",
  "Sir Davis"
];

const PREMIUM_16_32 = ["1942","Azul","D’USSÉ XO","Remy XO"];
const PREMIUM_10_20 = ["Gran Coramino","JW Black","JW Double Black","JW Gold"];

const WINE_6 = [
  "Cabernet Sauvignon",
  "Chardonnay",
  "Merlot",
  "Moscato (Red/White)",
  "Pinot Grigio",
  "Sauvignon Blanc",
  "Sweet Red"
];

const BEER_4 = [
  "Angry Orchard",
  "Corona",
  "Guinness",
  "Heineken",
  "Modelo",
  "Stella",
  "Goose Island IPA",
  "Voodoo Ranger IPA"
];

const HIGHNOON_8 = [
  "Vodka: Grapefruit",
  "Vodka: Mango",
  "Tequila: Lime",
  "Tequila: Strawberry"
];

const NA_LIST = [
  { name: "Red Bull", price: "$5" },
  { name: "Ginger Beer", price: "$5" },
  { name: "Frozen Drinks", price: "$5" },
  { name: "Soda", price: "$3" },
  { name: "Juice", price: "$3" },
  { name: "Water", price: "$3" }
];

const HOOKAH_FLAVORS = [
  "Bluemist (+$2)",
  "Magic Love (+$2)",
  "Lady Killer (+$2)",
  "Love 66 (+$2)",
  "Blueberry",
  "BMW",
  "Blueberry Mint",
  "Double Apple",
  "Grape",
  "Grape Fruit",
  "Grape Fruit Mint",
  "Guava",
  "Gum Mint",
  "Kiwi",
  "Lemon Mint",
  "Mango",
  "Mint",
  "Orange Mint",
  "Peach",
  "Pineapple",
  "Strawberry",
  "Vanilla",
  "Watermelon",
  "Watermelon Mint"
];

const COCKTAILS_FULL = [
  { name:"Allure Lemon Drop", note:"Teremana Repo, Triple Sec, Lemon Juice, Simple Syrup" },
  { name:"Allure Sidecar", note:"Hennessy, Amaretto, Triple Sec, Lemon Juice" },
  { name:"Apple Martini", note:"Absolut & Green Apple Schnapps" },
  { name:"Bitch Please", note:"Espolon, Coconut Bacardi, Peach Schnapps, Blue Curacao, Sour Mix, topped w/Sprite" },
  { name:"Blue Motorcycle", note:"Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix, Blue Curacao, topped w/Sprite" },
  { name:"Ciroc Punch", note:"Ciroc, Pineapple Juice, Cranberry Juice & Peach Schnapps" },
  { name:"Classic Margarita", note:"Lunazul, Margarita Mix, Triple Sec (Original/Strawberry/Peach/Mango)" },
  { name:"Cosmopolitan", note:"Absolut, Triple Sec, Lime Juice & Cranberry Juice" },
  { name:"Gin Martini", note:"Bombay & Dry Vermouth" },
  { name:"Green Tea", note:"Jameson, Sour Mix, Peach Schnapps, topped w/Sprite" },
  { name:"Long Island", note:"Vodka, Tequila, Rum, Gin, Triple Sec, Sour Mix, topped w/Coke" },
  { name:"Manhattan", note:"Basil Hayden, Sweet Vermouth & Bitters" },
  { name:"Mint Julep", note:"Jim Beam, Mint Leaves & Simple Syrup" },
  { name:"Mojito", note:"Captain Morgan, Lime Juice, Mint Leaves & Simple Syrup, topped w/Soda Water" },
  { name:"Moscow Mule", note:"Tito’s, Lime Juice & Ginger Beer" },
  { name:"Old Fashion", note:"Bulleit, Simple Syrup & Bitters" },
  { name:"Orange Martini", note:"Orange Stoli, Lime Juice, Triple Sec, Orange Juice" },
  { name:"Red or White Sangria", note:"Red/White Wine, Fruit, Triple Sec topped w/Soda Water" },
  { name:"Rum Punch", note:"Bacardi, Myers, Grenadine, Pineapple Juice, Orange Juice & Lime Juice" },
  { name:"Strawberry Henny", note:"Hennessy, Strawberry Puree, Sour Mix & Triple Sec" }
];

const FOOD_BASE = [
  { name:"Wings (6pc)", note:"Buffalo • Honey Garlic • Lemon Pepper", price:"$12" },
  { name:"Fries", note:"Classic • Loaded (+$4)", price:"$6" },
  { name:"Salmon Nuggets Basket", note:"Crispy bites • house sauce", price:"$15" },
  { name:"Rasta Pasta", note:"Chicken $16 • Shrimp $18 • Salmon $20", price:"from $16" }
];

const FOOD_FLAVORS = [
  "Buffalo",
  "Honey Garlic",
  "Lemon Pepper",
  "Mild",
  "Hot",
  "Garlic Parm",
  "Sweet Chili"
];

/* --------- Builders --------- */

function buildHappyHourTuesdayLike(labels){
  // categories order (Food first)
  const categories = [
    { key:"food", label:"Food" },
    { key:"shots5", label: labels.shots5Label || "$5 Shots" },
    { key:"drinks10", label: labels.drinks10Label || "$10 Drinks" },
    { key:"cocktails10", label: labels.cocktailsPriceLabel || "$10 Cocktails" },
    { key:"shots7", label:"$7 Shots" },
    { key:"drinks14", label:"$14 Drinks" },
    { key:"premium", label:"Premium" },
    { key:"wine6", label:"$6 Wine" },
    { key:"beer4", label:"$4 Beer" },
    { key:"highnoon8", label:"$8 High Noon" },
    { key:"na", label:"Non-Alcoholic" },
    { key:"hookah23", label: labels.hookahLabel || "$23 Hookah" },
    { key:"refill12", label: labels.refillLabel || "$12 Refill" },
    { key:"tower43", label:"$43 Tower" },
    { key:"fishbowl23", label:"$23 Fishbowl" }
  ];

  // “$10 drinks same list as $5 drinks”:
  // We don’t have $5 drinks in your latest build—so we use the FULL spirits base list for $10 drinks.
  // (If you want a smaller “$10 drinks list”, tell me and I’ll tighten it.)
  const drinks10Panels = [
    panelSpirits("Vodka", SPIRITS_BASE.vodka, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Tequila", SPIRITS_BASE.tequila, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Whiskey", SPIRITS_BASE.whiskey, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Liqueur", SPIRITS_BASE.liqueur, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Rum", SPIRITS_BASE.rum, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Gin", SPIRITS_BASE.gin, labels.drinks10Label || "$10 Drinks"),
    panelSpirits("Cognac", SPIRITS_BASE.cognac, labels.drinks10Label || "$10 Drinks")
  ];

  const shots5Panels = [
    panelSimpleList("Shots List", [
      ...SPIRITS_BASE.vodka,
      ...SPIRITS_BASE.tequila,
      ...SPIRITS_BASE.whiskey,
      ...SPIRITS_BASE.liqueur,
      ...SPIRITS_BASE.rum,
      ...SPIRITS_BASE.gin,
      ...SPIRITS_BASE.cognac
    ], labels.shots5Label || "$5 Shots")
  ];

  const cocktailsPanels = [
    {
      title: "Cocktails",
      tag: labels.cocktailsPriceLabel || "$10 Cocktails",
      note: "Add Strawberry, Mango, or Peach to any cocktail",
      items: COCKTAILS_FULL.map(c => ({ name: c.name, note: c.note }))
    }
  ].map(normalizePanel);

  const shots7Panels = [
    panelSimpleList("Shots List", SHOTS7_DRINKS14_LIST, "$7 Shots")
  ];

  const drinks14Panels = [
    panelSimpleList("Drinks List", SHOTS7_DRINKS14_LIST, "$14 Drinks")
  ];

  const premiumPanels = [
    normalizePanel({
      title: "$16 Shots • $32 Drinks",
      tag: "Premium",
      items: PREMIUM_16_32.map(x => ({ name: x }))
    }),
    normalizePanel({
      title: "$10 Shots • $20 Drinks",
      tag: "Premium",
      items: PREMIUM_10_20.map(x => ({ name: x }))
    })
  ];

  const winePanels = [ panelSimpleList("Wine", WINE_6, "$6 Wine") ];
  const beerPanels = [ panelSimpleList("Beer", BEER_4, "$4 Beer") ];
  const highnoonPanels = [ panelSimpleList("High Noon", HIGHNOON_8, "$8 High Noon") ];
  const naPanels = [ normalizePanel({ title:"Non-Alcoholic", tag:"", items: NA_LIST }) ];

  const hookahPanels = [
    normalizePanel({
      title: "Hookah",
      tag: labels.hookahLabel || "$23 Hookah",
      note: "Your choice of flavor",
      items: HOOKAH_FLAVORS.map(f => ({ name: f }))
    })
  ];

  const refillPanels = [
    normalizePanel({
      title: "Refill",
      tag: labels.refillLabel || "$12 Refill",
      note: "Add flavors below (same flavor list)",
      items: HOOKAH_FLAVORS.map(f => ({ name: f }))
    })
  ];

  const towerPanels = [ normalizePanel({ title:"Tower", tag:"$43", items: [{name:"Tower (single option)"}] }) ];
  const fishbowlPanels = [ normalizePanel({ title:"Fishbowl", tag:"$23", items: [{name:"Fishbowl (single option)"}] }) ];

  const foodPanels = [
    normalizePanel({
      title:"Food • Late Night Favorites",
      tag:"",
      items: FOOD_BASE
    }),
    normalizePanel({
      title:"Flavors",
      tag:"",
      note:"Choose flavors for wings + add-ons",
      items: FOOD_FLAVORS.map(x => ({ name:x }))
    })
  ];

  // Map category->panels
  const map = {
    food: foodPanels,
    shots5: shots5Panels,
    drinks10: drinks10Panels,
    cocktails10: cocktailsPanels,
    shots7: shots7Panels,
    drinks14: drinks14Panels,
    premium: premiumPanels,
    wine6: winePanels,
    beer4: beerPanels,
    highnoon8: highnoonPanels,
    na: naPanels,
    hookah23: hookahPanels,
    refill12: refillPanels,
    tower43: towerPanels,
    fishbowl23: fishbowlPanels
  };

  return { categories, map, defaultKey: "food" };
}

function buildLateNightBase({heroNote, includeHookah}){
  const categories = [
    { key:"food", label:"Food" },
    { key:"bottles", label:"Bottles" },
    { key:"cocktails", label:"Cocktails" },
    ...(includeHookah ? [{ key:"hookah", label:"Hookah" }] : [])
  ];

  const map = {
    food: [
      normalizePanel({
        title:"Food • Late Night Favorites",
        tag:"",
        items: FOOD_BASE
      }),
      normalizePanel({
        title:"Flavors",
        tag:"",
        note:"Choose flavors for wings + add-ons",
        items: FOOD_FLAVORS.map(x => ({ name:x }))
      })
    ],
    bottles: [
      normalizePanel({
        title:"Bottles • Pricing",
        tag:"",
        note:"Add your full bottle list here (VIP / Standard / Premium).",
        items: [
          { name:"Don Julio Blanco", price:"$220" },
          { name:"Casamigos Reposado", price:"$240" },
          { name:"Hennessy VS", price:"$220" }
        ]
      })
    ],
    cocktails: [
      normalizePanel({
        title:"Cocktails",
        tag:"",
        note: heroNote || "",
        items: COCKTAILS_FULL.map(c => ({ name:c.name, note:c.note }))
      })
    ],
    hookah: [
      normalizePanel({
        title:"Hookah",
        tag:"$23",
        note:"Your choice of flavor",
        items: HOOKAH_FLAVORS.map(x => ({ name:x }))
      })
    ]
  };

  return { categories, map, defaultKey: "food" };
}

function placeholderDay(title){
  return {
    title,
    subtitle: "Menu coming soon — add your items and I’ll format it perfectly.",
    happy: {
      categories: [{key:"soon", label:"Happy Hour"}],
      map: {
        soon: [normalizePanel({ title:"Happy Hour", tag:"", items:[{name:"Coming soon"}] })]
      },
      defaultKey:"soon"
    },
    late: {
      categories: [{key:"soon", label:"After 9PM"}],
      map: {
        soon: [normalizePanel({ title:"After 9PM", tag:"", items:[{name:"Coming soon"}] })]
      },
      defaultKey:"soon"
    }
  };
}

/* --------- Panel Helpers --------- */

function panelSpirits(title, list, tag){
  return normalizePanel({
    title,
    tag: tag || "",
    items: list.map(n => ({ name: n }))
  });
}

function panelSimpleList(title, list, tag){
  return normalizePanel({
    title,
    tag: tag || "",
    items: list.map(n => ({ name: n }))
  });
}

function normalizePanel(p){
  return {
    title: p.title || "",
    tag: p.tag || "",
    note: p.note || "",
    items: Array.isArray(p.items) ? p.items : []
  };
}

/* --------- UI Logic --------- */

const qs = (sel, el=document) => el.querySelector(sel);
const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

let currentDay = "monday";
let openAcc = { happy:true, late:true };
let currentCat = { happy:null, late:null };

function init(){
  // Default open accordions
  setAccordionOpen("happy", true);
  setAccordionOpen("late", true);

  // Day buttons
  qsa(".dayBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      qsa(".dayBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      currentDay = btn.dataset.day;
      renderDay();
    });
  });

  // Accordion toggles
  qsa(".accordionMain").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const acc = btn.dataset.acc;
      setAccordionOpen(acc, !openAcc[acc]);
    });
  });

  renderDay();
}

function setAccordionOpen(acc, isOpen){
  openAcc[acc] = isOpen;
  const body = qs(`.accordionContent[data-accbody="${acc}"]`);
  const btn = qs(`.accordionMain[data-acc="${acc}"]`);
  const arrow = qs(".arrow", btn);

  if(isOpen){
    body.classList.add("open");
    arrow.textContent = "–";
  }else{
    body.classList.remove("open");
    arrow.textContent = "+";
  }
}

function renderDay(){
  const day = MENU[currentDay];
  qs("#dayTitle").textContent = day.title;
  qs("#daySubtitle").textContent = day.subtitle;

  // Render Happy + Late
  renderSection("happy", day.happy);
  renderSection("late", day.late);
}

function renderSection(scope, section){
  // Build category buttons
  const bar = qs(`.catBar[data-scope="${scope}"]`);
  const body = qs(`.catBody[data-scopebody="${scope}"]`);
  bar.innerHTML = "";
  body.innerHTML = "";

  const defaultKey = section.defaultKey || (section.categories[0]?.key ?? "");
  if(!currentCat[scope]) currentCat[scope] = defaultKey;

  section.categories.forEach(cat=>{
    const b = document.createElement("button");
    b.className = "cat" + (cat.key === currentCat[scope] ? " active" : "");
    b.textContent = cat.label;
    b.dataset.cat = cat.key;

    b.addEventListener("click", ()=>{
      currentCat[scope] = cat.key;
      qsa(".cat", bar).forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      renderPanels(body, section.map[cat.key] || []);
    });

    bar.appendChild(b);
  });

  // render default panels
  renderPanels(body, section.map[currentCat[scope]] || []);
}

function renderPanels(container, panels){
  container.innerHTML = "";

  panels.forEach(p=>{
    const wrap = document.createElement("div");
    wrap.className = "panel";

    const h = document.createElement("div");
    h.className = "panelTitle";
    h.innerHTML = `
      <span>${escapeHtml(p.title)}</span>
      ${p.tag ? `<span class="tag">${escapeHtml(p.tag)}</span>` : `<span></span>`}
    `;
    wrap.appendChild(h);

    if(p.note){
      const note = document.createElement("div");
      note.className = "itemNote";
      note.style.marginBottom = "10px";
      note.textContent = p.note;
      wrap.appendChild(note);
    }

    const grid = document.createElement("div");
    grid.className = "listGrid";

    p.items.forEach(it=>{
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `
        <div>
          <div class="itemName">${escapeHtml(it.name || "")}</div>
          ${it.note ? `<div class="itemNote">${escapeHtml(it.note)}</div>` : ``}
        </div>
        ${it.price ? `<div class="itemPrice">${escapeHtml(it.price)}</div>` : ``}
      `;
      grid.appendChild(row);
    });

    wrap.appendChild(grid);
    container.appendChild(wrap);
  });
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

document.addEventListener("DOMContentLoaded", init);
