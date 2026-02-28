/* assets/js/menu.js
   Allure Menu Logic (Day switch + Accordion + Category tabs)
*/

(() => {
  // ========= 1) MENU DATA =========
  // You can edit lists anytime without touching the logic.

  const MENU = {
    monday: {
      title: "MONDAY",
      subtitle: "Happy Hour 5PM–9PM • After 9PM Late-Night Menu",
      happy: {
        // Food FIRST (per your request later you can fill it)
        food: {
          label: "Food",
          type: "list",
          items: [
            { name: "Add your food items here", price: "" }
          ]
        },

        shots5: {
          label: "$5 Shots",
          type: "spiritTabs",
          price: "$5",
          tabs: {
            Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
            Tequila: ["1800", "Altos", "Patron"],
            Whiskey: ["Jameson", "Jack Daniels"],
            Liqueur: ["Triple Sec"],
            Rum: ["Bacardi"],
            Gin: ["Bombay"],
            Cognac: ["Hennessy"]
          }
        },

        drinks10: {
          label: "$10 Drinks",
          type: "spiritTabs",
          price: "$10",
          // same exact list as $5 shots, only price changes
          tabs: {
            Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
            Tequila: ["1800", "Altos", "Patron"],
            Whiskey: ["Jameson", "Jack Daniels"],
            Liqueur: ["Triple Sec"],
            Rum: ["Bacardi"],
            Gin: ["Bombay"],
            Cognac: ["Hennessy"]
          }
        },

        cocktails10: {
          label: "$10 Cocktails",
          type: "chips",
          items: [
            "Allure Lemon Drop",
            "Long Island",
            "Manhattan",
            "Mint Julep",
            "Mojito",
            "Moscow Mule",
            "Old Fashion",
            "Orange Martini",
            "Red/White Sangria",
            "Rum Punch",
            "Strawberry Henny"
          ]
        },

        topShelf: {
          label: "$7 Shots / $14 Drinks",
          type: "chips",
          items: [
            "818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano",
            "Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738",
            "Remy VSOP","Sir Davis"
          ]
        },

        wbna: {
          label: "Wine / Beer / Non-Alcoholic",
          type: "wbnaTabs",
          tabs: {
            "$6 Wine": [
              "Cabernet Sauvignon",
              "Chardonnay",
              "Merlot",
              "Moscato (Red/White)",
              "Pinot Grigio",
              "Sauvignon Blanc",
              "Sweet Red"
            ],
            "$4 Beer": ["Heineken", "Corona", "Stella", "Guinness", "Angry Orchard"],
            "Non-Alcoholic": ["Soda", "Juice", "Water", "Red Bull"]
          }
        },

        hookah: {
          label: "Hookah / Tower / Fishbowl",
          type: "hookahTabs",
          tabs: {
            "Hookah $23": ["Blue Mist","Magic Love","Lady Killer","Love 66","Blueberry","BMW","Blueberry Mint","Double Apple","Grape","Grapefruit","Grapefruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"],
            "Refill $12": ["Blue Mist","Magic Love","Lady Killer","Love 66","Blueberry","BMW","Blueberry Mint","Double Apple","Grape","Grapefruit","Grapefruit Mint","Guava","Gum Mint","Kiwi","Lemon Mint","Mango","Mint","Orange Mint","Peach","Pineapple","Strawberry","Vanilla","Watermelon","Watermelon Mint"],
            "Tower $43": ["Long Island", "Lemon Drop", "Margarita"],
            "Fishbowl $23": ["Long Island", "Lemon Drop", "Margarita"]
          }
        }
      },

      late: {
        // After 9pm — put your real items here
        food: {
          label: "Late-Night Food",
          type: "list",
          items: [{ name: "Add after 9pm food items here", price: "" }]
        },
        drinks: {
          label: "Late-Night Drinks",
          type: "chips",
          items: ["Add after 9pm drink specials here"]
        }
      }
    },

    // Tue–Sat: you can duplicate monday structure or customize later
    tuesday: { title: "TUESDAY", subtitle: "Happy Hour 5PM–9PM • Taco Tuesday", happyRef: "monday", lateRef: "monday" },
    wednesday:{ title: "WEDNESDAY", subtitle:"Happy Hour 5PM–9PM", happyRef: "monday", lateRef:"monday" },
    thursday: { title: "THURSDAY", subtitle:"Happy Hour 5PM–9PM", happyRef: "monday", lateRef:"monday" },
    friday:   { title: "FRIDAY", subtitle:"Happy Hour 5PM–9PM • After 9PM Late-Night Menu", happyRef: "monday", lateRef:"monday" },
    saturday: { title: "SATURDAY", subtitle:"Happy Hour 5PM–9PM • After 9PM Late-Night Menu", happyRef: "monday", lateRef:"monday" },

    sunday: {
      title: "SUNDAY",
      subtitle: "Happy Hour 5PM–9PM • After 9PM Late-Night Menu",
      // For now same as Monday
      happyRef: "monday",
      lateRef: "monday"
    }
  };

  // ========= 2) HELPERS =========
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setHero(dayKey){
    const dayTitle = qs("#dayTitle");
    const daySubtitle = qs("#daySubtitle");
    const reserveTop = qs("#reserveTop");

    const d = MENU[dayKey];
    dayTitle.textContent = d.title || dayKey.toUpperCase();
    daySubtitle.textContent = d.subtitle || "";
    reserveTop.setAttribute("href", "tel:12025550123"); // change to your real number
  }

  function resolveDayData(dayKey){
    const d = MENU[dayKey];
    if(!d) return MENU.monday;
    if(d.happyRef || d.lateRef){
      const base = MENU[d.happyRef || "monday"];
      return {
        title: d.title,
        subtitle: d.subtitle,
        happy: (MENU[d.happyRef]?.happy) || base.happy,
        late: (MENU[d.lateRef]?.late) || base.late
      };
    }
    return d;
  }

  function clearPanel(scope){
    const bar = qs(`.catBar[data-scope="${scope}"]`);
    const body = qs(`.catBody[data-scopebody="${scope}"]`);
    if(bar) bar.innerHTML = "";
    if(body) body.innerHTML = "";
  }

  // ========= 3) RENDERERS =========

  function renderChips(list){
    const wrap = document.createElement("div");
    wrap.className = "chipGrid";
    list.forEach(t => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = t;
      wrap.appendChild(chip);
    });
    return wrap;
  }

  function renderList(items){
    const box = document.createElement("div");
    box.className = "listBox";
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "rowItem";
      row.innerHTML = `<span>${it.name}</span><span class="price">${it.price || ""}</span>`;
      box.appendChild(row);
    });
    return box;
  }

  function renderSpiritTabs(cfg){
    // cfg: {price, tabs:{Vodka:[...],...}}
    const wrap = document.createElement("div");
    wrap.className = "spiritWrap";

    const tabsRow = document.createElement("div");
    tabsRow.className = "spiritTabs";

    const panels = document.createElement("div");
    panels.className = "spiritPanels";

    const keys = Object.keys(cfg.tabs);
    keys.forEach((k, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip spiritChip" + (idx===0 ? " active" : "");
      btn.textContent = k;
      btn.dataset.spirit = k;

      const panel = document.createElement("div");
      panel.className = "spiritPanel" + (idx===0 ? " active" : "");
      panel.dataset.panel = k;

      // rows
      cfg.tabs[k].forEach(name => {
        const row = document.createElement("div");
        row.className = "rowItem";
        row.innerHTML = `<span>${name}</span><span class="price">${cfg.price || ""}</span>`;
        panel.appendChild(row);
      });

      btn.addEventListener("click", () => {
        qsa(".spiritChip", tabsRow).forEach(x => x.classList.remove("active"));
        qsa(".spiritPanel", panels).forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        panel.classList.add("active");
      });

      tabsRow.appendChild(btn);
      panels.appendChild(panel);
    });

    wrap.appendChild(tabsRow);
    wrap.appendChild(panels);
    return wrap;
  }

  function renderSubTabs(cfg){
    // generic sub-tabs (Wine/Beer/NA) or Hookah/Tower/Fishbowl
    const wrap = document.createElement("div");

    const tabRow = document.createElement("div");
    tabRow.className = "tierRow";

    const panels = document.createElement("div");
    panels.className = "subPanels";

    const keys = Object.keys(cfg.tabs);
    keys.forEach((k, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip subChip" + (idx===0 ? " active" : "");
      btn.textContent = k;
      btn.dataset.tab = k;

      const panel = document.createElement("div");
      panel.className = "subPanel" + (idx===0 ? " active" : "");
      panel.dataset.panel = k;

      // render list as chips by default
      panel.appendChild(renderChips(cfg.tabs[k]));

      btn.addEventListener("click", () => {
        qsa(".subChip", tabRow).forEach(x => x.classList.remove("active"));
        qsa(".subPanel", panels).forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        panel.classList.add("active");
      });

      tabRow.appendChild(btn);
      panels.appendChild(panel);
    });

    wrap.appendChild(tabRow);
    wrap.appendChild(panels);
    return wrap;
  }

  function renderScope(scopeKey, data){
    const bar = qs(`.catBar[data-scope="${scopeKey}"]`);
    const body = qs(`.catBody[data-scopebody="${scopeKey}"]`);
    if(!bar || !body) return;

    // Build category buttons
    const keys = Object.keys(data);
    keys.forEach((key, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catBtn" + (idx===0 ? " active" : "");
      btn.textContent = data[key].label;
      btn.dataset.cat = key;
      bar.appendChild(btn);
    });

    // Render first category by default
    function showCategory(catKey){
      body.innerHTML = "";
      qsa(".catBtn", bar).forEach(b => b.classList.toggle("active", b.dataset.cat === catKey));

      const cfg = data[catKey];

      if(cfg.type === "chips"){
        body.appendChild(renderChips(cfg.items || []));
      } else if(cfg.type === "list"){
        body.appendChild(renderList(cfg.items || []));
      } else if(cfg.type === "spiritTabs"){
        body.appendChild(renderSpiritTabs(cfg));
      } else if(cfg.type === "wbnaTabs" || cfg.type === "hookahTabs"){
        body.appendChild(renderSubTabs(cfg));
      } else {
        body.appendChild(renderChips(["(No items yet)"]));
      }
    }

    // click binding
    qsa(".catBtn", bar).forEach(btn => {
      btn.addEventListener("click", () => showCategory(btn.dataset.cat));
    });

    // Default to first
    showCategory(keys[0]);
  }

  // ========= 4) ACCORDION =========
  function setupAccordion(){
    // close all first
    qsa(".accordionContent").forEach(c => c.style.display = "none");

    qsa(".accordionMain").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.acc;
        const body = qs(`.accordionContent[data-accbody="${id}"]`);
        if(!body) return;

        const open = body.style.display === "block";
        // close both
        qsa(".accordionContent").forEach(c => c.style.display = "none");
        qsa(".accordionMain .arrow").forEach(a => a.textContent = "+");

        // open clicked
        if(!open){
          body.style.display = "block";
          qs(".arrow", btn).textContent = "–";
        }
      });
    });

    // Open HAPPY by default
    const happyBody = qs(`.accordionContent[data-accbody="happy"]`);
    const happyBtn = qs(`.accordionMain[data-acc="happy"] .arrow`);
    if(happyBody){
      happyBody.style.display = "block";
      if(happyBtn) happyBtn.textContent = "–";
    }
  }

  // ========= 5) DAY SWITCH =========
  function activateDay(dayKey){
    const dayData = resolveDayData(dayKey);

    // update hero text
    setHero(dayKey);

    // reset accordions + content so nothing carries over
    clearPanel("happy");
    clearPanel("late");

    // render
    renderScope("happy", dayData.happy);
    renderScope("late", dayData.late);

    // reset accordion open state
    setupAccordion();

    // save
    try { localStorage.setItem("activeDay", dayKey); } catch(e){}
  }

  function setupDays(){
    const buttons = qsa(".dayBtn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activateDay(btn.dataset.day);
      });
    });

    const start = (location.hash || "").replace("#","") || (localStorage.getItem("activeDay") || "monday");
    const startBtn = buttons.find(b => b.dataset.day === start) || buttons[0];
    if(startBtn){
      buttons.forEach(b => b.classList.remove("active"));
      startBtn.classList.add("active");
      activateDay(startBtn.dataset.day);
    }
  }

  // ========= 6) INIT =========
  document.addEventListener("DOMContentLoaded", () => {
    setupDays();
    setupAccordion();
  });
})();