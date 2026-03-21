document.addEventListener("DOMContentLoaded", () => {

  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";

  /* =========================
     NAV
  ========================= */

  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================
     MENU RENDER
  ========================= */

  function renderFlatMenu(items) {
    return `
      <div class="menuList">
        ${(items || []).map(item => `
          <div class="menuItem">
            <div class="menuItem__left">
              <div class="menuItem__name">${item.name || ""}</div>
              ${item.desc ? `<div class="menuItem__desc">${item.desc}</div>` : ""}
            </div>
            <div class="menuItem__price">${item.price || ""}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderGroupedMenu(section) {
    return `
      <div class="menuGrouped">
        ${section.title ? `<div class="menuGrouped__title">${section.title}</div>` : ""}
        <div class="menuGrouped__grid">
          ${(section.groups || []).map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${group.title}</div>
              ${renderFlatMenu(group.items)}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderSectionedMenu(content) {
    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${(content.sections || []).map(s => `
            <button class="menuSubTab" data-subsection="${s.title}">${s.title}</button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function bindSubTabs(panelBody, content) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");

    function activate(title) {
      tabs.forEach(t => t.classList.toggle("active", t.dataset.subsection === title));
      const section = content.sections.find(s => s.title === title);

      if (section.layout === "grouped") {
        subBody.innerHTML = renderGroupedMenu(section);
      } else {
        subBody.innerHTML = renderFlatMenu(section.items);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => activate(tab.dataset.subsection));
    });

    activate(content.sections[0].title);
  }

  /* =========================
     REWARD SYSTEM
  ========================= */

  function getItems(mode) {

    const igRewards = [
      "Free Mixer",
      "$2 Off Hookah",
      "$3 Off Fishbowl",
      "$3 Off Tower",
      "10% Off Food",
      "Free Red Bull w/ Drink",
      "Hookah Flavor Upgrade",
      "High Noon Discount"
    ];

    const phoneRewards = [
      "$5 Off Hookah",
      "Free Shot w/ $30 Tab",
      "$5 Off Premium Drink",
      "$5 Off Bottle Service",
      "VIP Line Skip",
      "$3 Off Tower",
      "Taco Discount",
      "Wine Upgrade"
    ];

    const vipRewards = [
      "Free Hookah (Min $50 Tab)",
      "$10 Off Bottle",
      "Premium Shot Upgrade",
      "VIP Table Priority",
      "Premium Hookah Flavor",
      "Fishbowl Discount",
      "Reserved Seating",
      "Weekend VIP Perk"
    ];

    const fillers = [
      "Try Again",
      "Good Vibes",
      "Ask Server",
      "Come Back",
      "Next Time Lucky",
      "Enjoy The Night"
    ];

    let pool;

    if (mode === "vip") {
      pool = [...vipRewards, ...phoneRewards, ...fillers];
    } else if (mode === "phone") {
      pool = [...phoneRewards, ...igRewards, ...fillers];
    } else {
      pool = [...igRewards, ...fillers];
    }

    return shuffle(pool).slice(0, 24);
  }

  function shuffle(arr){
    return arr.sort(()=>Math.random()-0.5);
  }

  /* =========================
     24 BOX GAME (FULL)
  ========================= */

  function renderGame(panelBody){

    panelBody.innerHTML = `
      <div class="hybridGame">

        <div class="hybridTitle">🎁 Mystery Box Game</div>

        <div class="promoCard">
          <div class="promoTitle">Unlock Better Rewards</div>

          <div class="staffRow">
            <input id="igInput" class="staffInput" placeholder="Enter Instagram @" />
            <input id="phoneInput" class="staffInput" placeholder="Enter Phone #" />
            <input id="vipPin" class="staffInput" placeholder="VIP PIN" />
          </div>

          <button id="startGame" class="promoBtn promoBtn--gold">Start Game</button>
        </div>

        <div class="mysteryGrid">
          ${Array.from({length:24}).map((_,i)=>`
            <button class="mysteryBox">Box ${i+1}</button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div id="reveal">Enter info & start</div>
        </div>

      </div>
    `;

    const boxes = [...panelBody.querySelectorAll(".mysteryBox")];
    const reveal = panelBody.querySelector("#reveal");

    const startBtn = panelBody.querySelector("#startGame");
    const igInput = panelBody.querySelector("#igInput");
    const phoneInput = panelBody.querySelector("#phoneInput");
    const vipPin = panelBody.querySelector("#vipPin");

    let items = [];
    let used = false;

    startBtn.onclick = () => {

      let mode = "ig";

      if (phoneInput.value.trim()) mode = "phone";
      if (vipPin.value === STAFF_PIN) mode = "vip";

      items = getItems(mode);
      reveal.textContent = "Pick a box";
      used = false;

      boxes.forEach(b => {
        b.textContent = "Box";
        b.classList.remove("is-open");
      });
    };

    boxes.forEach((box,i)=>{
      box.onclick = ()=>{
        if(used || items.length === 0) return;

        box.textContent = items[i];
        box.classList.add("is-open");
        reveal.textContent = items[i];

        used = true;
      };
    });
  }

  /* =========================
     CENTER WRAP
  ========================= */

  function getButtons(wrap){
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outside = [...wrap.parentElement.querySelectorAll(".outsideBottom .menuCenterBtn")];
    return [...inside, ...outside];
  }

  function setupWrap(wrap){
    if(wrap.dataset.done) return;
    wrap.dataset.done = true;

    const buttons = getButtons(wrap);
    const panel = wrap.querySelector(".menuPanelBody");

    buttons.forEach(btn=>{
      btn.onclick = ()=>{
        buttons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");

        const content = CATEGORY_CONTENT[btn.dataset.cat];

        if(!content){
          panel.innerHTML = "Coming soon";
          return;
        }

        panel.innerHTML = renderSectionedMenu(content);
        bindSubTabs(panel, content);
      };
    });

    // 🔥 IMPORTANT: GAME loads first (NOTHING auto opens)
    renderGame(panel);
  }

  /* =========================
     DAY SWITCH
  ========================= */

  function activateDay(day){
    document.querySelectorAll(".dayPanel").forEach(p=>{
      const active = p.dataset.daypanel===day;
      p.classList.toggle("active", active);

      if(active){
        p.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab=>{
    tab.onclick = ()=>activateDay(tab.dataset.daytab);
  });

  const today = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
  activateDay(today);

});