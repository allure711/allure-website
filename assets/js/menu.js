/* assets/js/menu.js
   Keeps your original design (rowItem/price/chip look)
   Works with your existing HTML:
   - .dayBtn[data-day]
   - .accordionMain[data-acc] + .accordionContent[data-accbody]
   - .catBar[data-scope] + .catBody[data-scopebody]
*/

(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  const setHref = (id, href) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", href);
  };

  // ----------------------------
  // DATA (keep your current MENU object)
  // ----------------------------
  const MENU = {
    // NOTE: You only provided tuesday in your snippet.
    // If you want other days to work, add them here OR copy tuesday to other days.
    tuesday: {
      title: "TUESDAY",
      subtitle: "HAPPY HOUR 5PM–9PM • After 9PM Late-Night Menu",
      reserveHref: "tel:12025550123",

      happy: {
        categoriesOrder: [
          "food","shots5","drinks10","cocktails10","shots7","drinks14","premium",
          "wine6","beer4","highnoon8","nonalc","hookah23","refill12","tower43","fishbowl23",
        ],
        categories: {
          food: {
            label: "Food",
            blocks: [
              {
                title: "Food",
                items: [
                  { name: "Wings (6pc)", note: "Buffalo • Honey Garlic • Lemon Pepper", price: "$12" },
                  { name: "Fries", note: "Classic • Loaded (+$4)", price: "$6" },
                  { name: "Salmon Nuggets Basket", note: "Crispy bites • house sauce", price: "$15" },
                  { name: "Rasta Pasta", note: "Chicken $16 • Shrimp $18 • Salmon $20", price: "—" },
                ],
              },
              { title: "Food Flavors", items: ["Buffalo","Honey Garlic","Lemon Pepper","Mumbo"] },
            ],
          },

          shots5: { label: "$5 Shots", blocks: [{ title: "$5 Shots", items: ["Vodka","Tequila","Whiskey","Liqueur","Rum","Gin","Cognac"] }] },

          drinks10: { label: "$10 Drinks", blocks: [{ title: "$10 Drinks (same list as $5 list)", items: ["Vodka","Tequila","Whiskey","Liqueur","Rum","Gin","Cognac"] }] },

          cocktails10: {
            label: "$10 Cocktails",
            blocks: [
              { title: "$10 Cocktails", items: ["Allure Lemon Drop","Allure Sidecar","Apple Martini","Bitch Please","Blue Motorcycle","Ciroc Punch","Classic Margarita","Cosmopolitan","Gin Martini","Green Tea","Long Island","Manhattan","Mint Julep","Mojito","Moscow Mule","Old Fashion","Orange Martini","Red or White Sangria","Rum Punch","Strawberry Henny"] },
              { title: "Add to any cocktail", items: ["Strawberry","Mango","Peach"] },
            ],
          },

          shots7: { label: "$7 Shots", blocks: [{ title: "$7 Shots", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738","Remy VSOP","Sir Davis"] }] },

          drinks14: { label: "$14 Drinks", blocks: [{ title: "$14 Drinks", items: ["Hennessy VSOP","Patron","Don Julio","Casamigos","Remy 1738","Herradura","Old Forester","Dusse"] }] },

          premium: {
            label: "Premium",
            blocks: [
              { title: "$16 Shots • $32 Drinks", items: ["1942","Azul","Dusse XO","Remy XO"] },
              { title: "$10 Shots • $20 Drinks", items: ["Gran Coramino","JW Black","JW Double Black","JW Gold"] },
            ],
          },

          wine6: { label: "$6 Wine", blocks: [{ title: "$6 Wine", items: ["Cabernet Sauvignon","Chardonnay","Merlot","Moscato (Red/White)","Pinot Grigio","Sauvignon Blanc","Sweet Red"] }] },
          beer4: { label: "$4 Beer", blocks: [{ title: "$4 Beer", items: ["Angry Orchard","Corona","Guinness","Heineken","Modelo","Stella","Goose Island IPA","Voodoo Ranger IPA"] }] },

          highnoon8: { label: "$8 High Noon", blocks: [{ title: "Vodka", items: ["Grapefruit","Mango"] }, { title: "Tequila", items: ["Lime","Strawberry"] }] },

          nonalc: { label: "Non-Alcoholic", blocks: [{ title: "Non-Alcoholic", items: ["Red Bull $5","Ginger Beer $5","Frozen Drinks $5","Soda $3","Juice $3","Water $3"] }] },

          hookah23: { label: "$23 Hookah", blocks: [{ title: "$23 Hookah", items: ["Your choice of flavor (see Refill flavors)"] }] },

          refill12: { label: "$12 Refill", blocks: [{ title: "Refill Flavors", items: ["Bluemist (+$2)","Magic Love (+$2)","Lady Killer (+$2)","Love 66 (+$2)","Blueberry","BMW","Blueberry Mint","Double Apple","Grape","Grape Fruit","Grape Fruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"] }] },

          tower43: { label: "$43 Tower", blocks: [{ title: "$43 Tower", items: ["Available flavors: Strawberry • Mango • Peach"] }] },
          fishbowl23: { label: "$23 Fishbowl", blocks: [{ title: "$23 Fishbowl", items: ["Ask bartender for today’s fishbowl specials"] }] },
        },
      },

      late: {
        categoriesOrder: ["food","shots7","drinks14","premium","wine6","beer4","highnoon8","nonalc","hookah23","tower43","fishbowl23"],
        categories: {
          food: { label: "Food", blocks: [{ title: "After 9PM Food", items: [{ name: "Wings (6pc)", note: "Buffalo • Honey Garlic • Lemon Pepper", price: "$12" }, { name: "Fries", note: "Classic • Loaded (+$4)", price: "$6" }] }] },
          shots7: { label: "$7 Shots", blocks: [{ title: "$7 Shots", items: ["818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano","Hendricks"] }] },
          drinks14:{ label: "$14 Drinks", blocks: [{ title: "$14 Drinks", items: ["Hennessy VSOP","Patron","Remy 1738","Herradura"] }] },
          premium:{ label: "Premium", blocks: [{ title: "$16 Shots • $32 Drinks", items: ["1942","Azul","Dusse XO","Remy XO"] }] },
          wine6:  { label: "$6 Wine", blocks: [{ title: "$6 Wine", items: ["Cabernet Sauvignon","Chardonnay","Merlot"] }] },
          beer4:  { label: "$4 Beer", blocks: [{ title: "$4 Beer", items: ["Corona","Heineken","Modelo"] }] },
          highnoon8:{ label: "$8 High Noon", blocks: [{ title: "High Noon", items: ["Grapefruit","Mango","Lime","Strawberry"] }] },
          nonalc: { label: "Non-Alcoholic", blocks: [{ title: "Non-Alcoholic", items: ["Red Bull $5","Water $3"] }] },
          hookah23:{ label: "$23 Hookah", blocks: [{ title: "$23 Hookah", items: ["Your choice of flavor"] }] },
          tower43:{ label: "$43 Tower", blocks: [{ title: "$43 Tower", items: ["Ask bartender"] }] },
          fishbowl23:{ label: "$23 Fishbowl", blocks: [{ title: "$23 Fishbowl", items: ["Ask bartender"] }] },
        },
      },
    },
  };

  // If a day isn't in MENU, we copy Tuesday so buttons don't go blank.
  const dayKeys = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  dayKeys.forEach((d) => { if (!MENU[d]) MENU[d] = MENU.tuesday; });

  let activeDayKey = "tuesday";
  const activeCat = { happy: null, late: null };

  // ----------------------------
  // RENDER
  // ----------------------------
  function renderDay(dayKey) {
    const day = MENU[dayKey];
    if (!day) return;

    activeDayKey = dayKey;
    setText("dayTitle", day.title || dayKey.toUpperCase());
    setText("daySubtitle", day.subtitle || "");
    setHref("reserveTop", day.reserveHref || "tel:12025550123");

    renderScope("happy", day.happy);
    renderScope("late", day.late);
  }

  function renderScope(scopeName, scopeData) {
    const bar = document.querySelector(`.catBar[data-scope="${scopeName}"]`);
    const body = document.querySelector(`.catBody[data-scopebody="${scopeName}"]`);
    if (!bar || !body || !scopeData) return;

    const order = scopeData.categoriesOrder || Object.keys(scopeData.categories || {});
    const categories = scopeData.categories || {};

    // choose active category (keep previous if exists)
    const firstKey = order.find((k) => categories[k]);
    if (!activeCat[scopeName] || !categories[activeCat[scopeName]]) activeCat[scopeName] = firstKey;

    // chips
    bar.innerHTML = "";
    order.forEach((catKey) => {
      const cat = categories[catKey];
      if (!cat) return;

      const btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.dataset.cat = catKey;
      btn.textContent = cat.label || catKey;

      if (catKey === activeCat[scopeName]) btn.classList.add("active");

      btn.addEventListener("click", () => {
        activeCat[scopeName] = catKey;
        $$(".chip", bar).forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        renderCategoryBody(body, cat);
      });

      bar.appendChild(btn);
    });

    // body
    renderCategoryBody(body, categories[activeCat[scopeName]]);
  }

  function renderCategoryBody(bodyEl, category) {
    bodyEl.innerHTML = "";
    if (!category) return;

    (category.blocks || []).forEach((block) => {
      // Title (small)
      if (block.title) {
        const h = document.createElement("div");
        h.className = "catMiniTitle";
        h.textContent = block.title;
        bodyEl.appendChild(h);
      }

      // Items (render in your existing row style)
      (block.items || []).forEach((it) => {
        // String item
        if (typeof it === "string") {
          const row = document.createElement("div");
          row.className = "rowItem";
          row.innerHTML = `<span>${it}</span><span class="price"></span>`;
          bodyEl.appendChild(row);
          return;
        }

        // Object item: {name, note, price}
        const row = document.createElement("div");
        row.className = "rowItem";
        row.innerHTML = `
          <span>${it.name || ""}</span>
          <span class="price">${it.price || ""}</span>
        `;
        bodyEl.appendChild(row);

        if (it.note) {
          const note = document.createElement("div");
          note.className = "rowNote";
          note.textContent = it.note;
          bodyEl.appendChild(note);
        }
      });
    });
  }

  // ----------------------------
  // ACCORDION
  // ----------------------------
  function setupAccordions() {
    $$(".accordionMain").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-acc");
        const panel = document.querySelector(`.accordionContent[data-accbody="${key}"]`);
        if (!panel) return;

        const willOpen = !panel.classList.contains("open");
        panel.classList.toggle("open", willOpen);

        const arrow = btn.querySelector(".arrow");
        if (arrow) arrow.textContent = willOpen ? "–" : "+";
      });
    });

    // open both by default
    const happyPanel = $('.accordionContent[data-accbody="happy"]');
    const latePanel = $('.accordionContent[data-accbody="late"]');
    if (happyPanel) happyPanel.classList.add("open");
    if (latePanel) latePanel.classList.add("open");
    const happyArrow = $('.accordionMain[data-acc="happy"] .arrow');
    const lateArrow = $('.accordionMain[data-acc="late"] .arrow');
    if (happyArrow) happyArrow.textContent = "–";
    if (lateArrow) lateArrow.textContent = "–";
  }

  // ----------------------------
  // DAY BUTTONS
  // ----------------------------
  function setupDayButtons() {
    $$(".dayBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".dayBtn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderDay(btn.dataset.day);
      });
    });
  }

  // ----------------------------
  // INIT
  // ----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    setupAccordions();
    setupDayButtons();

    // default to the day button that already has .active (if any)
    const activeBtn = $(".dayBtn.active");
    activeDayKey = activeBtn?.dataset.day || "tuesday";

    renderDay(activeDayKey);
  });
})();