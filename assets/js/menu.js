document.addEventListener("DOMContentLoaded", () => {

  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};

  /* =========================
     RENDER FLAT MENU
  ========================= */

  function renderFlatMenu(items){
    return `
      <div class="menuList menuList--compact">
        ${(items || []).map(item => `
          <div class="menuItem menuItem--compact">
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

  /* =========================
     RENDER GROUPED MENU
  ========================= */

  function renderGroupedMenu(section){

    const groups = section.groups || [];

    function getFlavorIcon(name){
      const label = String(name || "").toLowerCase();

      if(label.includes("lemon pepper")) return "🌶️";
      if(label.includes("jerk")) return "🔥";
      if(label.includes("old bay")) return "🧂";
      if(label.includes("honey")) return "🍯";
      if(label.includes("buffalo")) return "🍗";
      if(label.includes("sweet chili")) return "🌶️";
      if(label.includes("teriyaki")) return "🥢";
      if(label.includes("mumbo")) return "👑";

      return "";
    }

    const isWingFlavors = (section.title || "").toLowerCase() === "wing flavors";

    return `
      <div class="menuGrouped menuGrouped--compact">

        <div class="menuGrouped__grid">

          ${groups.map(group => `
            <div class="menuGrouped__box">

              <div class="menuGrouped__boxTitle">
                ${group.title || ""}
              </div>

              <div class="menuList menuList--compact">

                ${(group.items || []).map(item => `
                  <div class="menuItem menuItem--compact">

                    <div class="menuItem__left">

                      <div class="menuItem__name">

                        ${isWingFlavors ? `<span class="flavorIcon">${getFlavorIcon(item.name)}</span>` : ""}

                        ${item.name || ""}

                      </div>

                      ${item.desc ? `<div class="menuItem__desc">${item.desc}</div>` : ""}

                    </div>

                    <div class="menuItem__price">${item.price || ""}</div>

                  </div>
                `).join("")}

              </div>

            </div>
          `).join("")}

        </div>

      </div>
    `;
  }

  /* =========================
     MAP PRICE MODE
  ========================= */

  function mapItemsForMode(items, mode){

    if(!mode) return items || [];

    return (items || []).map(item => {

      const rawPrice = String(item.price || "");

      if(!rawPrice.includes("/")) return item;

      const parts = rawPrice.split("/").map(p => p.trim());

      if(mode === "shots"){
        return { ...item, price: parts[0] || rawPrice };
      }

      if(mode === "drinks"){
        return { ...item, price: parts[1] || parts[0] || rawPrice };
      }

      return item;

    });

  }

  /* =========================
     RENDER SECTION MENU
  ========================= */

  function renderSectionedMenu(content){

    const sections = content.sections || [];

    return `
      <div class="menuNested">

        <div class="menuSubTabs">

          ${sections.map(section => `
            <button class="menuSubTab" type="button" data-subsection="${section.title}">
              ${section.title}
            </button>
          `).join("")}

        </div>

        <div class="menuSubBody"></div>

      </div>
    `;

  }

  /* =========================
     RENDER MENU
  ========================= */

  function renderMenu(content){

    if(!content){
      return `<div class="menuEmpty">Click a category above to view menu.</div>`;
    }

    if(Array.isArray(content)){
      return renderFlatMenu(content);
    }

    if(content.sections){
      return renderSectionedMenu(content);
    }

    return `<div class="menuEmpty">Menu coming soon</div>`;

  }

  /* =========================
     BIND SUB TABS
  ========================= */

  function bindSubTabs(panelBody, content, mode = null){

    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content.sections || [];

    if(!tabs.length) return;

    function activateSubsection(title){

      tabs.forEach(tab=>{
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);

      if(!section) return;

      if(section.layout === "wingsGrouped"){

        subBody.innerHTML = `
          <div class="menuSectionBlock menuSectionBlock--compact">
            ${renderGroupedMenu(section)}
          </div>
        `;

        return;

      }

      const items = mapItemsForMode(section.items || [], mode);

      subBody.innerHTML = `
        <div class="menuSectionBlock menuSectionBlock--compact">
          ${renderFlatMenu(items)}
        </div>
      `;

    }

    tabs.forEach(tab=>{
      tab.addEventListener("click",()=>{
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);

  }

  /* =========================
     CATEGORY CLICK
  ========================= */

  function setupCenterWrap(wrap){

    const buttons = [...wrap.querySelectorAll(".menuCenterBtn")];
    const panelBody = wrap.querySelector(".menuPanelBody");

    function activateButton(button){

      const cat = button.dataset.cat;
      const mode = button.dataset.mode || null;
      const content = CATEGORY_CONTENT[cat];

      buttons.forEach(btn=>{
        btn.classList.toggle("active", btn === button);
      });

      if(!content){
        panelBody.innerHTML = `<div class="menuEmpty">Coming soon</div>`;
        return;
      }

      panelBody.innerHTML = renderMenu(content);

      if(content.sections){
        bindSubTabs(panelBody, content, mode);
      }

    }

    buttons.forEach(button=>{
      button.addEventListener("click",()=>{
        activateButton(button);
      });
    });

  }

  /* =========================
     DAY SWITCH
  ========================= */

  function activateDay(day){

    document.querySelectorAll(".dayTab").forEach(tab=>{
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel=>{

      const isActive = panel.dataset.daypanel === day;

      panel.classList.toggle("active", isActive);

      if(isActive){

        panel.querySelectorAll(".menuCenterWrap").forEach(setupCenterWrap);

      }

    });

  }

  function getTodayDay(){

    const days=[
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    return days[new Date().getDay()];

  }

  document.querySelectorAll(".dayTab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      activateDay(tab.dataset.daytab);
    });
  });

  activateDay(getTodayDay());

});