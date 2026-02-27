/* assets/js/menu.js
   Clean full replacement
*/

(function () {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setText(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  function setHref(id, href) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("href", href);
  }

  // ---------- DATA ----------
  // You can edit items anytime — the UI will update automatically.
  // Important: Food is included as a category and appears FIRST.

  const MENU = {
    tuesday: {
      title: "TUESDAY",
      subtitle: "HAPPY HOUR 5PM–9PM • After 9PM Late-Night Menu",
      reserveHref: "tel:12025550123",

      happy: {
        categoriesOrder: [
          "food",
          "shots5",
          "drinks10",
          "cocktails10",
          "shots7",
          "drinks14",
          "premium",
          "wine6",
          "beer4",
          "highnoon8",
          "nonalc",
          "hookah23",
          "refill12",
          "tower43",
          "fishbowl23",
        ],
        categories: {
          food: {
            label: "Food",
            blocks: [
              {
                title: "Food • Late Night Favorites",
                items: [
                  { name: "Wings (6pc)", note: "Buffalo • Honey Garlic • Lemon Pepper", price: "$12" },
                  { name: "Fries", note: "Classic • Loaded (+$4)", price: "$6" },
                  { name: "Salmon Nuggets Basket", note: "Crispy bites • house sauce", price: "$15" },
                  { name: "Rasta Pasta", note: "Chicken $16 • Shrimp $18 • Salmon $20", price: "from $16" },
                ],
              },
              {
                title: "Flavor Add-Ons (Food)",
                items: [
                  { name: "Buffalo" },
                  { name: "Honey Garlic" },
                  { name: "Lemon Pepper" },
                  { name: "Mumbo" },
                ],
              },
            ],
          },

          shots5: {
            label: "$5 Shots",
            blocks: [
              {
                title: "$5 Shots",
                items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"],
              },
            ],
          },

          // You requested: $10 drinks = same list as the $5 list, just priced at $10
          drinks10: {
            label: "$10 Drinks",
            blocks: [
              {
                title: "$10 Drinks (same list as $5 list)",
                items: ["Vodka", "Tequila", "Whiskey", "Liqueur", "Rum", "Gin", "Cognac"],
              },
            ],
          },

          cocktails10: {
            label: "$10 Cocktails",
            blocks: [
              {
                title: "$10 Cocktails",
                items: [
                  "Allure Lemon Drop",
                  "Allure Sidecar",
                  "Apple Martini",
                  "Bitch Please",
                  "Blue Motorcycle",
                  "Ciroc Punch",
                  "Classic Margarita",
                  "Cosmopolitan",
                  "Gin Martini",
                  "Green Tea",
                  "Long Island",
                  "Manhattan",
                  "Mint Julep",
                  "Mojito",
                  "Moscow Mule",
                  "Old Fashion",
                  "Orange Martini",
                  "Red or White Sangria",
                  "Rum Punch",
                  "Strawberry Henny",
                ],
              },
              { title: "Add to any cocktail", items: ["Strawberry", "Mango", "Peach"] },
            ],
          },

          shots7: {
            label: "$7 Shots",
            blocks: [
              { title: "$7 Shots", items: ["818", "Casa Azul", "Casamigos", "Ciroc VS", "Don Julio", "Dusse", "Equiano", "Hendricks", "Hennessy VSOP", "Herradura", "Old Forester", "Patron", "Remy 1738", "Remy VSOP", "Sir Davis"] },
            ],
          },

          // You requested: $14 drinks need its own list
          drinks14: {
            label: "$14 Drinks",
            blocks: [
              {
                title: "$14 Drinks",
                items: [
                  "Hennessy VSOP",
                  "Patron",
                  "Don Julio",
                  "Casamigos",
                  "Remy 1738",
                  "Herradura",
                  "Old Forester",
                  "Dusse",
                ],
              },
            ],
          },

          premium: {
            label: "Premium",
            blocks: [
              {
                title: "$16 Shots • $32 Drinks",
                items: ["1942", "Azul", "Dusse XO", "Remy XO"],
              },
              {
                title: "$10 Shots • $20 Drinks",
                items: ["Gran Coramino", "JW Black", "JW Double Black", "JW Gold"],
              },
            ],
          },

          wine6: { label: "$6 Wine", blocks: [{ title: "$6 Wine", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] }] },
          beer4: { label: "$4 Beer", blocks: [{ title: "$4 Beer", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] }] },

          highnoon8: {
            label: "$8 High Noon",
            blocks: [
              { title: "Vodka", items: ["Grapefruit", "Mango"] },
              { title: "Tequila", items: ["Lime", "Strawberry"] },
            ],
          },

          nonalc: { label: "Non-Alcoholic", blocks: [{ title: "Non-Alcoholic", items: ["Red Bull $5", "Ginger Beer $5", "Frozen Drinks $5", "Soda $3", "Juice $3", "Water $3"] }] },

          hookah23: { label: "$23 Hookah", blocks: [{ title: "$23 Hookah", items: ["Your choice of flavor (see Refill flavors)"] }] },

          refill12: {
            label: "$12 Refill",
            blocks: [
              {
                title: "Refill Flavors",
                items: [
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
                  "Watermelon Mint",
                ],
              },
            ],
          },

          tower43: { label: "$43 Tower", blocks: [{ title: "$43 Tower", items: ["Available flavors: Strawberry • Mango • Peach"] }] },
          fishbowl23: { label: "$23 Fishbowl", blocks: [{ title: "$23 Fishbowl", items: ["Ask bartender for today’s fishbowl specials"] }] },
        },
      },

      late: {
        categoriesOrder: [
          "food",
          "shots7",
          "drinks14",
          "premium",
          "wine6",
          "beer4",
          "highnoon8",
          "nonalc",
          "hookah23",
          "tower43",
          "fishbowl23",
        ],
        categories: {
          // Make After 9PM match left side style + also has Food chip
          food: {
            label: "Food",
            blocks: [
              {
                title: "After 9PM Food",
                items: [
                  { name: "Wings (6pc)", note: "Buffalo • Honey Garlic • Lemon Pepper", price: "$12" },
                  { name: "Fries", note: "Classic • Loaded (+$4)", price: "$6" },
                  { name: "Salmon Nuggets Basket", note: "Crispy bites • house sauce", price: "$15" },
                  { name: "Rasta Pasta", note: "Chicken $16 • Shrimp $18 • Salmon $20", price: "from $16" },
                ],
              },
              { title: "Flavor Add-Ons (Food)", items: ["Buffalo", "Honey Garlic", "Lemon Pepper", "Mumbo"] },
            ],
          },

          shots7: { label: "$7 Shots", blocks: [{ title: "$7 Shots", items: ["818", "Casa Azul", "Casamigos", "Ciroc VS", "Don Julio", "Dusse", "Equiano", "Hendricks", "Hennessy VSOP", "Herradura", "Old Forester", "Patron", "Remy 1738", "Remy VSOP", "Sir Davis"] }] },
          drinks14: { label: "$14 Drinks", blocks: [{ title: "$14 Drinks", items: ["Hennessy VSOP", "Patron", "Don Julio", "Casamigos", "Remy 1738", "Herradura", "Old Forester", "Dusse"] }] },
          premium: {
            label: "Premium",
            blocks: [
              { title: "$16 Shots • $32 Drinks", items: ["1942", "Azul", "Dusse XO", "Remy XO"] },
              { title: "$10 Shots • $20 Drinks", items: ["Gran Coramino", "JW Black", "JW Double Black", "JW Gold"] },
            ],
          },
          wine6: { label: "$6 Wine", blocks: [{ title: "$6 Wine", items: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Moscato (Red/White)", "Pinot Grigio", "Sauvignon Blanc", "Sweet Red"] }] },
          beer4: { label: "$4 Beer", blocks: [{ title: "$4 Beer", items: ["Angry Orchard", "Corona", "Guinness", "Heineken", "Modelo", "Stella", "Goose Island IPA", "Voodoo Ranger IPA"] }] },
          highnoon8: { label: "$8 High Noon", blocks: [{ title: "Vodka", items: ["Grapefruit", "Mango"] }, { title: "Tequila", items: ["Lime", "Strawberry"] }] },
          nonalc: { label: "Non-Alcoholic", blocks: [{ title: "Non-Alcoholic", items: ["Red Bull $5", "Ginger Beer $5", "Frozen Drinks $5", "Soda $3", "Juice $3", "Water $3"] }] },
          hookah23: { label: "$23 Hookah", blocks: [{ title: "$23 Hookah", items: ["Your choice of flavor (see Refill flavors on Happy Hour side)"] }] },
          tower43: { label: "$43 Tower", blocks: [{ title: "$43 Tower", items: ["Available flavors: Strawberry • Mango • Peach"] }] },
          fishbowl23: { label: "$23 Fishbowl", blocks: [{ title: "$23 Fishbowl", items: ["Ask bartender for today’s fishbowl specials"] }] },
        },
      },
    },
  };

  // Default day
  let activeDayKey = "tuesday";

  // ---------- Rendering ----------
  function renderDay(dayKey) {
    const day = MENU[dayKey];
    if (!day) return;

    activeDayKey = dayKey;

    // Title + subtitle + reserve
    setText("dayTitle", day.title || dayKey.toUpperCase());
    setText("daySubtitle", day.subtitle || "");
    setHref("reserveTop", day.reserveHref || "tel:12025550123");

    // Render both scopes
    renderScope("happy", day.happy);
    renderScope("late", day.late);
  }

  function renderScope(scopeName, scopeData) {
    const bar = document.querySelector(`[data-scope="${scopeName}"]`);
    const body = document.querySelector(`[data-scopebody="${scopeName}"]`);
    if (!bar || !body || !scopeData) return;

    // Build chips
    bar.innerHTML = "";
    const order = scopeData.categoriesOrder || Object.keys(scopeData.categories || {});
    const categories = scopeData.categories || {};

    order.forEach((catKey, idx) => {
      const cat = categories[catKey];
      if (!cat) return;

      const btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.dataset.cat = catKey;
      btn.textContent = cat.label || catKey;

      if (idx === 0) btn.classList.add("active");

      btn.addEventListener("click", () => {
        $$(".chip", bar).forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        renderCategoryBody(body, cat);
      });

      bar.appendChild(btn);
    });

    // Render first category by default
    const firstKey = order.find((k) => categories[k]);
    if (firstKey) renderCategoryBody(body, categories[firstKey]);
  }

  function renderCategoryBody(bodyEl, category) {
    bodyEl.innerHTML = "";

    (category.blocks || []).forEach((block) => {
      const wrap = document.createElement("div");
      wrap.className = "panel";

      const h = document.createElement("h3");
      h.className = "panelTitle";
      h.textContent = block.title || "";
      wrap.appendChild(h);

      const list = document.createElement("ul");
      list.className = "panelList";

      (block.items || []).forEach((it) => {
        const li = document.createElement("li");

        // support string or object {name, note, price}
        if (typeof it === "string") {
          li.textContent = it;
        } else {
          const name = document.createElement("span");
          name.className = "itemName";
          name.textContent = it.name || "";

          const note = document.createElement("span");
          note.className = "itemNote";
          note.textContent = it.note ? ` — ${it.note}` : "";

          const price = document.createElement("span");
          price.className = "itemPrice";
          price.textContent = it.price ? it.price : "";

          li.appendChild(name);
          if (it.note) li.appendChild(note);
          if (it.price) li.appendChild(price);
        }

        list.appendChild(li);
      });

      wrap.appendChild(list);
      bodyEl.appendChild(wrap);
    });
  }

  // ---------- Accordion behavior ----------
  function setupAccordions() {
    $$(".accordionMain").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-acc");
        const body = document.querySelector(`[data-accbody="${key}"]`);
        if (!body) return;

        const isOpen = body.classList.contains("open");
        // close all
        $$(".accordionContent").forEach((b) => b.classList.remove("open"));
        $$(".accordionMain .arrow").forEach((a) => (a.textContent = "+"));

        // toggle current
        if (!isOpen) {
          body.classList.add("open");
          const arrow = btn.querySelector(".arrow");
          if (arrow) arrow.textContent = "–";
        }
      });
    });

    // open BOTH by default (if you prefer only one, tell me)
    const happyBody = document.querySelector('[data-accbody="happy"]');
    const lateBody = document.querySelector('[data-accbody="late"]');
    const happyBtn = document.querySelector('[data-acc="happy"] .arrow');
    const lateBtn = document.querySelector('[data-acc="late"] .arrow');

    if (happyBody) happyBody.classList.add("open");
    if (lateBody) lateBody.classList.add("open");
    if (happyBtn) happyBtn.textContent = "–";
    if (lateBtn) lateBtn.textContent = "–";
  }

  // ---------- Day buttons ----------
  function setupDayButtons() {
    $$(".dayBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".dayBtn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderDay(btn.dataset.day);
      });
    });

    // Ensure the current active button matches default day
    const defaultBtn = document.querySelector(`.dayBtn[data-day="${activeDayKey}"]`);
    if (defaultBtn) {
      $$(".dayBtn").forEach((b) => b.classList.remove("active"));
      defaultBtn.classList.add("active");
    }
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    setupAccordions();
    setupDayButtons();
    renderDay(activeDayKey);
  });
})();