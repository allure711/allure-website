document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";

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

  function renderSectionedMenu(content) {
    const sections = content?.sections || [];
    if (!sections.length) return `<div class="menuEmpty">Coming soon.</div>`;

    return `
      <div class="menuNested">
        ${sections.map(section => `
          <div class="menuGrouped">
            <div class="menuGrouped__title">${section.title}</div>
            ${renderFlatMenu(section.items || [])}
          </div>
        `).join("")}
      </div>
    `;
  }

  function getTable() {
    const params = new URLSearchParams(window.location.search);
    return params.get("table") || "walk-in";
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function gameKey(day) {
    return `allureVIP:${today()}:${day}:${getTable()}`;
  }

  function saveGame(data, day) {
    localStorage.setItem(gameKey(day), JSON.stringify(data));
  }

  function loadGame(day) {
    const raw = localStorage.getItem(gameKey(day));
    if (!raw) return null;
    return JSON.parse(raw);
  }

  function clearGame(day) {
    localStorage.removeItem(gameKey(day));
  }

  function rewardPool(type) {
    const standard = [
      "Free Shot",
      "$2 Off Hookah",
      "Free Mixer",
      "Wing Upgrade",
      "Try Again",
      "Good Vibes"
    ];

    const premium = [
      "$5 Off Hookah",
      "10% Off Food",
      "$3 Off Fishbowl",
      "Premium Drink Discount",
      "Line Skip"
    ];

    const vip = [
      "VIP Table Priority",
      "Free Hookah Upgrade",
      "$10 Off Bottle",
      "Premium Shot Upgrade",
      "Exclusive Weekend Reward"
    ];

    let pool = [];

    if (type === "ig") pool = [...standard, ...standard];
    if (type === "phone") pool = [...standard, ...premium];
    if (type === "vip") pool = [...premium, ...vip];

    while (pool.length < 24) pool.push("Try Again");

    return pool.sort(() => Math.random() - 0.5).slice(0, 24);
  }

  function renderLeadGate(panel, day) {
    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTitle">Unlock Your VIP Mystery Box</div>
        <div class="gameSub">
          Enter Instagram or phone number to play.<br>
          Enter both for VIP reward odds.
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" data-type="ig">Instagram</button>
          <button class="gameBtn gameBtn--ghost" data-type="phone">Phone</button>
          <button class="gameBtn gameBtn--gold" data-type="vip">VIP (Both)</button>
        </div>

        <div class="staffBox">
          <input class="staffInput" placeholder="@instagram or phone">
          <button class="gameBtn gameBtn--ghost" data-start>Start Game</button>
        </div>
      </div>
    `;

    let selected = null;

    panel.querySelectorAll("[data-type]").forEach(btn => {
      btn.onclick = () => {
        selected = btn.dataset.type;
        panel.querySelectorAll("[data-type]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      };
    });

    panel.querySelector("[data-start]").onclick = () => {
      const input = panel.querySelector(".staffInput").value.trim();

      if (!selected || !input) {
        alert("Enter info and select option");
        return;
      }

      let ig = "";
      let phone = "";

      if (selected === "ig") ig = input;
      if (selected === "phone") phone = input;
      if (selected === "vip") {
        const parts = input.split(",");
        ig = parts[0] || "";
        phone = parts[1] || "";
      }

      renderGame(panel, day, selected, ig, phone);
    };
  }

  function renderGame(panel, day, type, ig, phone) {
    const existing = loadGame(day);

    if (existing) {
      type = existing.type;
      ig = existing.ig;
      phone = existing.phone;
    }

    const rewards = existing?.rewards || rewardPool(type);
    const revealed = existing?.revealed ?? null;

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTitle">24 Box Game</div>

        <div class="boxGrid">
          ${rewards.map((_, i) => `
            <button class="boxCell" data-i="${i}">Box ${i+1}</button>
          `).join("")}
        </div>

        <div class="gameReveal">
          <div class="gameRevealText">${revealed !== null ? rewards[revealed] : "Pick a box"}</div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" data-back>Back</button>
          <button class="gameBtn gameBtn--gold" data-reset>Reset</button>
        </div>
      </div>
    `;

    const boxes = panel.querySelectorAll(".boxCell");

    if (revealed !== null) {
      boxes.forEach((b,i)=>{
        if(i!==revealed) b.classList.add("is-locked");
        else b.classList.add("is-revealed");
      });
    }

    boxes.forEach((btn,i)=>{
      btn.onclick = ()=>{
        if(loadGame(day)) return;

        panel.querySelector(".gameRevealText").textContent = rewards[i];

        boxes.forEach((b,j)=>{
          if(j!==i) b.classList.add("is-locked");
          else b.classList.add("is-revealed");
        });

        saveGame({
          type, ig, phone, rewards, revealed:i, time:Date.now()
        }, day);
      };
    });

    panel.querySelector("[data-back]").onclick = ()=> renderLeadGate(panel, day);

    panel.querySelector("[data-reset]").onclick = ()=>{
      const pin = prompt("Manager PIN");
      if(pin === STAFF_PIN){
        clearGame(day);
        renderLeadGate(panel, day);
      }
    };
  }

  function setupWrap(wrap){
    const panel = wrap.querySelector(".menuPanelBody");
    const day = wrap.closest(".dayPanel").dataset.daypanel;

    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${day.toUpperCase()} MENU</div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" data-game>Play VIP Game</button>
        </div>
      </div>
    `;

    panel.querySelector("[data-game]").onclick = ()=>{
      renderLeadGate(panel, day);
    };

    wrap.querySelectorAll(".menuCenterBtn").forEach(btn=>{
      btn.onclick = ()=>{
        if(btn.dataset.action === "game"){
          renderLeadGate(panel, day);
          return;
        }

        const cat = CATEGORY_CONTENT[btn.dataset.cat];
        panel.innerHTML = renderSectionedMenu(cat);
      };
    });
  }

  function activateDay(day){
    document.querySelectorAll(".dayPanel").forEach(p=>{
      p.classList.toggle("active", p.dataset.daypanel===day);
      if(p.dataset.daypanel===day){
        p.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });

    document.querySelectorAll(".dayTab").forEach(t=>{
      t.classList.toggle("active", t.dataset.daytab===day);
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab=>{
    tab.onclick = ()=> activateDay(tab.dataset.daytab);
  });

  const todayName = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
  activateDay(todayName);
});