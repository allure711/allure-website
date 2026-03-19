document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const MENU_HIGHLIGHTS = window.MENU_HIGHLIGHTS || {};
  const ALLURE_LIVE_STATUS = window.ALLURE_LIVE_STATUS || {};
  const STAFF_PIN = "2024";

  ensurePromoStyles();

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

  function ensurePromoStyles() {
    if (document.getElementById("allurePromoStyles")) return;

    const style = document.createElement("style");
    style.id = "allurePromoStyles";
    style.textContent = `
      .promoCard{
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:16px;
        background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      }

      .promoHead{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        margin-bottom:12px;
      }

      .promoTitle{
        font-size:16px;
        font-weight:900;
        letter-spacing:.06em;
        color:#d7b46a;
        text-transform:uppercase;
      }

      .promoSub{
        color:rgba(255,255,255,.72);
        font-size:12px;
        line-height:1.5;
        margin-top:4px;
      }

      .promoMeta{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        justify-content:flex-end;
      }

      .promoBadge{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:7px 10px;
        border-radius:999px;
        background:rgba(255,255,255,.05);
        border:1px solid rgba(255,255,255,.10);
        color:#fff;
        font-size:11px;
        font-weight:800;
        letter-spacing:.04em;
        text-transform:uppercase;
      }

      .promoBadge--gold{
        color:#d7b46a;
        border-color:rgba(215,180,106,.32);
        background:rgba(215,180,106,.08);
      }

      .scratchWrap{
        position:relative;
        border-radius:18px;
        overflow:hidden;
        border:1px solid rgba(215,180,106,.18);
        background:
          radial-gradient(circle at top right, rgba(255,94,219,.10), transparent 35%),
          radial-gradient(circle at left center, rgba(215,180,106,.10), transparent 28%),
          rgba(255,255,255,.03);
        min-height:160px;
        margin:12px 0;
      }

      .scratchReward{
        position:absolute;
        inset:0;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        padding:18px;
      }

      .scratchRewardLabel{
        font-size:11px;
        letter-spacing:.16em;
        text-transform:uppercase;
        color:rgba(255,255,255,.72);
        font-weight:900;
        margin-bottom:8px;
      }

      .scratchRewardText{
        font-size:26px;
        font-weight:950;
        line-height:1.1;
        color:#fff;
        text-shadow:0 0 22px rgba(255,94,219,.15);
      }

      .scratchRewardCode{
        margin-top:10px;
        font-size:11px;
        color:#d7b46a;
        letter-spacing:.14em;
        text-transform:uppercase;
        font-weight:900;
      }

      .scratchGrid{
        position:absolute;
        inset:0;
        display:grid;
        grid-template-columns:repeat(4, 1fr);
        grid-template-rows:repeat(3, 1fr);
        gap:1px;
        background:rgba(255,255,255,.04);
      }

      .scratchTile{
        border:none;
        background:
          linear-gradient(135deg, rgba(215,180,106,.90), rgba(255,255,255,.28));
        cursor:pointer;
        min-height:48px;
        transition:transform .12s ease, opacity .18s ease;
      }

      .scratchTile:hover{
        transform:scale(.98);
      }

      .scratchTile.is-cleared{
        opacity:0;
        pointer-events:none;
      }

      .promoActions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:12px;
      }

      .promoBtn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:10px 14px;
        font-weight:900;
        letter-spacing:.04em;
        cursor:pointer;
      }

      .promoBtn--gold{
        background:linear-gradient(135deg, #d7b46a, #f2d38a);
        color:#111;
      }

      .promoBtn--ghost{
        background:rgba(255,255,255,.05);
        color:#fff;
        border:1px solid rgba(255,255,255,.12);
      }

      .promoBtn[disabled]{
        opacity:.45;
        cursor:not-allowed;
      }

      .promoHint{
        margin-top:10px;
        font-size:12px;
        color:rgba(255,255,255,.68);
        line-height:1.5;
      }

      .promoDivider{
        height:1px;
        background:rgba(255,255,255,.08);
        margin:14px 0;
      }

      .staffBox{
        border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.03);
        border-radius:14px;
        padding:12px;
      }

      .staffRow{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        align-items:center;
      }

      .staffInput{
        flex:1 1 160px;
        min-width:0;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(0,0,0,.18);
        color:#fff;
        padding:10px 12px;
      }

      .staffState{
        margin-top:8px;
        font-size:12px;
        color:rgba(255,255,255,.72);
      }

      .promoQueueNote{
        margin-top:10px;
        font-size:11px;
        color:rgba(255,255,255,.55);
      }

      @media (max-width:640px){
        .scratchRewardText{
          font-size:22px;
        }
      }
    `;
    document.head.appendChild(style);
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

  function renderGroupedMenu(section) {
    const groups = section.groups || [];
    return `
      <div class="menuGrouped">
        ${section.title ? `<div class="menuGrouped__title">${section.title}</div>` : ""}
        <div class="menuGrouped__grid">
          ${groups.map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${group.title || ""}</div>
              ${renderFlatMenu(group.items || [])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function mapItemsForMode(items, mode) {
    if (!mode) return items || [];

    return (items || []).map(item => {
      const rawPrice = String(item.price || "");
      if (!rawPrice.includes("/")) return item;

      const parts = rawPrice.split("/").map(p => p.trim());

      if (mode === "shots") {
        return { ...item, price: parts[0] || rawPrice };
      }

      if (mode === "drinks") {
        return { ...item, price: parts[1] || parts[0] || rawPrice };
      }

      return item;
    });
  }

  function renderSectionedMenu(content) {
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

  function renderHighlights(day, panel) {
    panel.querySelectorAll(".popularTonight").forEach(node => node.remove());

    const items = MENU_HIGHLIGHTS[day];
    if (!items || !items.length) return;

    const hero = panel.querySelector(".heroRow");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "popularTonight";
    section.innerHTML = `
      <div class="popularTonight__title">🔥 Popular Tonight</div>
      <div class="popularTonight__grid">
        ${items.map(item => `
          <div class="popularCard">${item.name || ""}</div>
        `).join("")}
      </div>
    `;

    hero.after(section);
  }

  function renderVipNightBanner(day, panel) {
    panel.querySelectorAll(".vipNightBannerFloating").forEach(node => node.remove());

    if (day !== "friday" && day !== "saturday") return;

    const hero = panel.querySelector(".heroRow");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "vipNightBannerFloating";
    section.innerHTML = `
      <div class="vipNightBannerFloating__badge">VIP NIGHT ACTIVE</div>
      <div class="vipNightBannerFloating__title">Late Night Energy • Bottle Service • DJ Vibes</div>
      <div class="vipNightBannerFloating__meta">Premium cocktails • VIP tables • Hookah • Fishbowls</div>
    `;

    hero.after(section);
  }

  function updateLiveIndicator(day) {
    const liveTitle = document.getElementById("liveTitle");
    const liveTags = document.getElementById("liveTags");
    const info = ALLURE_LIVE_STATUS[day];

    if (!liveTitle || !liveTags || !info) return;

    liveTitle.textContent = info.title || "Live Tonight";
    liveTags.innerHTML = (info.tags || []).map(tag => `<span class="liveTag">${tag}</span>`).join("");
  }

  function bindSubTabs(panelBody, content, mode = null) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);
      if (!section) return;

      if (section.layout === "grouped") {
        subBody.innerHTML = `
          <div class="menuSectionBlock ${["Wings","Wing Flavors"].includes(section.title) ? "menuSectionBlock--bare" : ""}">
            ${renderGroupedMenu(section)}
          </div>
        `;
        return;
      }

      const items = mapItemsForMode(section.items || [], mode);
      subBody.innerHTML = `
        <div class="menuSectionBlock">
          ${renderFlatMenu(items)}
        </div>
      `;
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);
  }

  function applyVipNightMode(day) {
    document.querySelectorAll(".menuCenterWrap").forEach(wrap => {
      wrap.classList.remove("vipNightMode");
    });

    if (day !== "friday" && day !== "saturday") return;

    const activePanel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
    if (!activePanel) return;

    activePanel.querySelectorAll(".menuCenterWrap").forEach(wrap => {
      const titleEl = wrap.querySelector(".menuPanelTitle");
      if (!titleEl) return;

      const text = titleEl.textContent.toLowerCase();
      if (text.includes("after 9") || text.includes("vip night")) {
        wrap.classList.add("vipNightMode");
      }
    });
  }

  function getTableNumber() {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    return table ? String(table).trim() : "Walk-In";
  }

  function slugifyReward(reward) {
    return reward
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function createPromoCode(table, reward) {
    const stamp = Date.now().toString().slice(-6);
    const safeTable = String(table).replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "BAR";
    return `ALR-${safeTable}-${slugifyReward(reward).slice(0, 8).toUpperCase()}-${stamp}`;
  }

  function getPromoRewards(staffMode) {
    if (staffMode) {
      return [
        "Free Shot",
        "$4 Off Drink",
        "15% Off Tab",
        "VIP Upgrade",
        "Free Hookah Upgrade",
        "Reserved Table Perk"
      ];
    }

    return [
      "Free Shot",
      "$2 Off Drink",
      "10% Off Tab",
      "Free Mixer Upgrade",
      "Try Again",
      "VIP Line Skip"
    ];
  }

  function savePromoToQueue(payload) {
    const key = "allurePromoQueue";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push(payload);
    localStorage.setItem(key, JSON.stringify(current));
  }

  function renderDashboard(panelBody) {
    panelBody.classList.remove("menuPanelBody--shots");

    const table = getTableNumber();
    const baseReward = "Scratch to Reveal";
    const promoCode = createPromoCode(table, baseReward);

    panelBody.innerHTML = `
      <div class="promoCard">
        <div class="promoHead">
          <div>
            <div class="promoTitle">Allure VIP Scratch</div>
            <div class="promoSub">Scratch tiles to unlock a table reward. Guests can scan a QR that opens this page with a table number like <strong>?table=12</strong>.</div>
          </div>

          <div class="promoMeta">
            <span class="promoBadge promoBadge--gold">Table ${table}</span>
            <span class="promoBadge" data-role-badge>Guest Mode</span>
          </div>
        </div>

        <div class="scratchWrap">
          <div class="scratchReward">
            <div class="scratchRewardLabel">Tonight's Reward</div>
            <div class="scratchRewardText" data-reward-text>${baseReward}</div>
            <div class="scratchRewardCode" data-reward-code>${promoCode}</div>
          </div>

          <div class="scratchGrid" data-scratch-grid>
            ${Array.from({ length: 12 }).map((_, index) => `
              <button class="scratchTile" type="button" data-tile="${index}"></button>
            `).join("")}
          </div>
        </div>

        <div class="promoActions">
          <button class="promoBtn promoBtn--gold" type="button" data-reset-btn>New Scratch</button>
          <button class="promoBtn promoBtn--ghost" type="button" data-redeem-btn disabled>Save Reward</button>
          <button class="promoBtn promoBtn--ghost" type="button" data-copy-btn disabled>Copy Code</button>
        </div>

        <div class="promoHint" data-hint>Scratch 8 tiles to reveal the reward.</div>

        <div class="promoDivider"></div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Staff PIN" data-staff-pin>
            <button class="promoBtn promoBtn--ghost" type="button" data-staff-btn>Unlock Staff Mode</button>
          </div>
          <div class="staffState" data-staff-state>Guest rewards active. Staff can unlock upgraded rewards for approved comps.</div>
          <div class="promoQueueNote">POS mode: rewards are queued locally on this device now. A developer can later sync the queue to your POS API.</div>
        </div>
      </div>
    `;

    const grid = panelBody.querySelector("[data-scratch-grid]");
    const tiles = [...panelBody.querySelectorAll(".scratchTile")];
    const rewardTextEl = panelBody.querySelector("[data-reward-text]");
    const rewardCodeEl = panelBody.querySelector("[data-reward-code]");
    const hintEl = panelBody.querySelector("[data-hint]");
    const redeemBtn = panelBody.querySelector("[data-redeem-btn]");
    const copyBtn = panelBody.querySelector("[data-copy-btn]");
    const resetBtn = panelBody.querySelector("[data-reset-btn]");
    const staffPinInput = panelBody.querySelector("[data-staff-pin]");
    const staffBtn = panelBody.querySelector("[data-staff-btn]");
    const staffState = panelBody.querySelector("[data-staff-state]");
    const roleBadge = panelBody.querySelector("[data-role-badge]");

    let scratchedCount = 0;
    let revealed = false;
    let staffMode = false;
    let currentReward = "";
    let currentCode = "";

    function chooseReward() {
      const rewards = getPromoRewards(staffMode);
      return rewards[Math.floor(Math.random() * rewards.length)];
    }

    function resetScratchCard() {
      scratchedCount = 0;
      revealed = false;
      currentReward = chooseReward();
      currentCode = createPromoCode(table, currentReward);

      tiles.forEach(tile => {
        tile.classList.remove("is-cleared");
      });

      rewardTextEl.textContent = "Scratch to Reveal";
      rewardCodeEl.textContent = createPromoCode(table, "Scratch");
      hintEl.textContent = "Scratch 8 tiles to reveal the reward.";
      redeemBtn.disabled = true;
      copyBtn.disabled = true;
    }

    function revealReward() {
      if (revealed) return;
      revealed = true;

      rewardTextEl.textContent = currentReward;
      rewardCodeEl.textContent = currentCode;
      hintEl.textContent = "Reward unlocked. Save it or copy the code for staff redemption.";
      redeemBtn.disabled = false;
      copyBtn.disabled = false;

      tiles.forEach(tile => {
        tile.classList.add("is-cleared");
      });
    }

    tiles.forEach(tile => {
      tile.addEventListener("click", () => {
        if (tile.classList.contains("is-cleared")) return;
        tile.classList.add("is-cleared");
        scratchedCount += 1;

        if (scratchedCount >= 8) {
          revealReward();
        } else {
          hintEl.textContent = `Scratch ${8 - scratchedCount} more tile${8 - scratchedCount === 1 ? "" : "s"} to reveal the reward.`;
        }
      });
    });

    resetBtn.addEventListener("click", () => {
      resetScratchCard();
    });

    redeemBtn.addEventListener("click", () => {
      if (!revealed) return;

      const payload = {
        code: currentCode,
        reward: currentReward,
        table,
        staffMode,
        redeemed: false,
        created_at: new Date().toISOString(),
        source: "menu-dashboard"
      };

      savePromoToQueue(payload);
      hintEl.textContent = `Saved. Reward code ${currentCode} is queued on this device for POS/staff redemption.`;
    });

    copyBtn.addEventListener("click", async () => {
      if (!revealed) return;

      const text = `${currentReward} | ${currentCode} | Table ${table}`;
      try {
        await navigator.clipboard.writeText(text);
        hintEl.textContent = `Copied: ${currentCode}`;
      } catch {
        hintEl.textContent = `Copy failed. Use code: ${currentCode}`;
      }
    });

    staffBtn.addEventListener("click", () => {
      const entered = (staffPinInput.value || "").trim();

      if (entered !== STAFF_PIN) {
        staffState.textContent = "Invalid staff PIN.";
        return;
      }

      staffMode = !staffMode;
      roleBadge.textContent = staffMode ? "Staff Mode" : "Guest Mode";
      staffState.textContent = staffMode
        ? "Staff mode unlocked. Next scratch uses upgraded rewards."
        : "Guest rewards active. Staff can unlock upgraded rewards for approved comps.";

      staffPinInput.value = "";
      resetScratchCard();
    });

    resetScratchCard();
  }

  function setupCenterWrap(wrap) {
    if (wrap.dataset.bound === "true") return;
    wrap.dataset.bound = "true";

    const buttons = [...wrap.querySelectorAll(".menuCenterBtn")];
    const panelBody = wrap.querySelector(".menuPanelBody");

    if (!buttons.length || !panelBody) return;

    function activateButton(button) {
      const cat = button.dataset.cat;
      const mode = button.dataset.mode || null;
      const content = CATEGORY_CONTENT[cat];

      buttons.forEach(btn => {
        btn.classList.toggle("active", btn === button);
      });

      if (!content) {
        panelBody.classList.remove("menuPanelBody--shots");
        panelBody.innerHTML = `<div class="menuEmpty">This section will be updated soon.</div>`;
        return;
      }

      panelBody.innerHTML = renderSectionedMenu(content);

      if (["shots5", "shots7", "premium"].includes(cat)) {
        panelBody.classList.add("menuPanelBody--shots");
      } else {
        panelBody.classList.remove("menuPanelBody--shots");
      }

      bindSubTabs(panelBody, content, mode);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        activateButton(button);
      });
    });

    renderDashboard(panelBody);
  }

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const isActive = panel.dataset.daypanel === day;
      panel.classList.toggle("active", isActive);

      if (isActive) {
        renderVipNightBanner(day, panel);
        renderHighlights(day, panel);
        panel.querySelectorAll(".menuCenterWrap").forEach(setupCenterWrap);
      }
    });

    updateLiveIndicator(day);
    applyVipNightMode(day);
  }

  function getTodayDay() {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return days[new Date().getDay()];
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateDay(tab.dataset.daytab);
    });
  });

  if (document.querySelector(".dayTab")) {
    activateDay(getTodayDay());
  }
});