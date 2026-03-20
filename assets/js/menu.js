document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};
  const ALLURE_LIVE_STATUS = window.ALLURE_LIVE_STATUS || {};
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
     24 BOX GAME
  ========================= */

  function getItems(staff) {
    const rewards = staff
      ? ["Free Shot","$4 Off","15% Off","VIP Upgrade","Hookah Upgrade"]
      : ["Free Shot","$2 Off","10% Off","VIP Skip"];

    const neutral = ["Try Again","Ask Server","Come Back","Enjoy Vibe"];
    const info = ["Instagram","Address","Owner","Reserve"];

    return shuffle([...rewards, ...neutral, ...info, ...rewards]).slice(0,24);
  }

  function shuffle(arr){
    return arr.sort(()=>Math.random()-0.5);
  }

  function renderGame(panelBody){
    const table = new URLSearchParams(location.search).get("table") || "Walk-In";

    panelBody.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">Allure Mystery Boxes</div>

        <div class="mysteryGrid">
          ${Array.from({length:24}).map((_,i)=>`
            <button class="mysteryBox">Box ${i+1}</button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div id="reveal">Pick a box</div>
        </div>
      </div>
    `;

    const boxes = [...panelBody.querySelectorAll(".mysteryBox")];
    const reveal = panelBody.querySelector("#reveal");

    let items = getItems(false);
    let used = 0;

    boxes.forEach((box,i)=>{
      box.onclick = ()=>{
        if(used>=1) return;
        box.textContent = items[i];
        reveal.textContent = items[i];
        used++;
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