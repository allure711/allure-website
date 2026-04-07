document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";
  const LEADS_KEY = "allure_leads_v3";
  const GOOGLE_SHEET_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
  const MOBILE_BREAKPOINT = 760;

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
     HELPERS
  ========================= */

  function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getTableLabel() {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("table") ||
      params.get("tableno") ||
      params.get("tableNo") ||
      params.get("seat") ||
      "walk-in"
    ).trim();
  }

  function getSessionKey(day) {
    return `allure_vip_session:${getTodayKey()}:${day}:${getTableLabel().toLowerCase()}`;
  }

  function readSession(day) {
    const raw = localStorage.getItem(getSessionKey(day));
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveSession(day, data) {
    localStorage.setItem(getSessionKey(day), JSON.stringify(data));
  }

  function clearSession(day) {
    localStorage.removeItem(getSessionKey(day));
  }

  function readLeads() {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLead(lead) {
    const leads = readLeads();
    leads.push(lead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  function overwriteLeads(leads) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  async function sendLeadToGoogleSheet(lead) {
    if (
      !GOOGLE_SHEET_WEB_APP_URL ||
      GOOGLE_SHEET_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")
    ) {
      return {
        ok: false,
        error: "Missing Google Apps Script web app URL"
      };
    }

    try {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          createdAt: lead.createdAt || "",
          day: lead.day || "",
          table: lead.table || "",
          entryType: lead.entryType || "",
          instagram: lead.instagram || "",
          phone: lead.phone || "",
          reward: lead.reward || "",
          boxNumber: lead.boxNumber || "",
          code: lead.code || ""
        })
      });

      return { ok: true };
    } catch (error) {
      console.error("Google Sheet sync failed:", error);
      return {
        ok: false,
        error: String(error)
      };
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function validatePhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validateInstagram(value) {
    if (!value) return false;
    const cleaned = String(value).trim();
    return /^@?[a-zA-Z0-9._]{2,30}$/.test(cleaned);
  }

  function normalizeInstagram(value) {
    const cleaned = String(value || "").trim().replace(/\s+/g, "");
    if (!cleaned) return "";
    return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
  }

  function csvEscape(value) {
    const str = String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function prettyLabel(value) {
    return String(value || "").charAt(0).toUpperCase() + String(value || "").slice(1);
  }

  function weightedPool(entryType = "phone") {
    const standard = [
      "Free Shot",
      "Free Mixer",
      "$2 Off Hookah",
      "Wing Flavor Upgrade",
      "Good Vibes",
      "Try Again",
      "Try Again",
      "Try Again"
    ];

    const premium = [
      "$5 Off Hookah",
      "10% Off Food",
      "$3 Off Fishbowl",
      "Premium Drink Discount",
      "Line Skip",
      "Hookah Flavor Upgrade",
      "Try Again",
      "Try Again"
    ];

    const vip = [
      "VIP Table Priority",
      "Free Hookah Upgrade",
      "$10 Off Bottle",
      "Premium Shot Upgrade",
      "Exclusive Weekend Reward",
      "VIP Skip Line",
      "Reserved Table Perk",
      "Try Again"
    ];

    let source = [];

    if (entryType === "ig") {
      source = [...standard, ...standard, ...premium];
    } else if (entryType === "phone") {
      source = [...standard, ...premium, ...premium, ...vip];
    } else {
      source = [...premium, ...premium, ...vip, ...vip];
    }

    while (source.length < 24) {
      source.push("Try Again");
    }

    const copy = [...source];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy.slice(0, 24);
  }

  function jumpToElementInstant(target, extraOffset = 8) {
    if (!target) return;

    const html = document.documentElement;
    const body = document.body;
    const oldHtmlScrollBehavior = html.style.scrollBehavior;
    const oldBodyScrollBehavior = body.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";

    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop = window.pageYOffset + target.getBoundingClientRect().top - headerHeight - extraOffset;

    window.scrollTo(0, Math.max(0, targetTop));

    setTimeout(() => {
      html.style.scrollBehavior = oldHtmlScrollBehavior;
      body.style.scrollBehavior = oldBodyScrollBehavior;
    }, 50);
  }

  function jumpToTopInstant() {
    const html = document.documentElement;
    const body = document.body;
    const oldHtmlScrollBehavior = html.style.scrollBehavior;
    const oldBodyScrollBehavior = body.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);

    setTimeout(() => {
      html.style.scrollBehavior = oldHtmlScrollBehavior;
      body.style.scrollBehavior = oldBodyScrollBehavior;
    }, 50);
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
              <div class="menuItem__name">${escapeHtml(item.name || "")}</div>
              ${item.desc ? `<div class="menuItem__desc">${escapeHtml(item.desc)}</div>` : ""}
            </div>
            <div class="menuItem__price">${escapeHtml(item.price || "")}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderGroupedMenu(section) {
    return `
      <div class="menuGrouped">
        ${section.title ? `<div class="menuGrouped__title">${escapeHtml(section.title)}</div>` : ""}
        <div class="menuGrouped__grid">
          ${(section.groups || []).map(group => `
            <div class="menuGrouped__box">
              <div class="menuGrouped__boxTitle">${escapeHtml(group.title || "")}</div>
              ${renderFlatMenu(group.items || [])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function splitShotsAndDrinks(items) {
    const shots = [];
    const drinks = [];

    (items || []).forEach(item => {
      const price = item.price || "";
      const parts = price.split("/").map(p => p.trim());

      if (parts.length === 2) {
        shots.push({ ...item, price: parts[0] });
        drinks.push({ ...item, price: parts[1] });
      } else {
        shots.push({ ...item });
        drinks.push({ ...item });
      }
    });

    return { shots, drinks };
  }

  function getContentByMode(content, mode) {
    if (!content || !content.sections) return content;
    if (!mode || (mode !== "shots" && mode !== "drinks")) return content;

    return {
      ...content,
      sections: content.sections.map(section => {
        if (section.layout === "grouped") return section;
        const split = splitShotsAndDrinks(section.items || []);
        return {
          ...section,
          items: mode === "shots" ? split.shots : split.drinks
        };
      })
    };
  }

  function renderSectionedMenu(content) {
    const sections = content?.sections || [];

    if (!sections.length) {
      return `<div class="menuEmpty">Menu coming soon.</div>`;
    }

    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${sections.map(section => `
            <button class="menuSubTab" type="button" data-subsection="${escapeHtml(section.title)}">
              ${escapeHtml(section.title)}
            </button>
          `).join("")}
        </div>
        <div class="menuSubBody"></div>
      </div>
    `;
  }

  function bindSubTabs(panelBody, content) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content?.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(title) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.subsection === title);
      });

      const section = sections.find(s => s.title === title);

      if (!section) {
        subBody.innerHTML = `<div class="menuEmpty">Section not found.</div>`;
        return;
      }

      if (section.layout === "grouped") {
        subBody.innerHTML = renderGroupedMenu(section);
      } else {
        subBody.innerHTML = renderFlatMenu(section.items || []);
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(tab.dataset.subsection);
      });
    });

    activateSubsection(sections[0].title);
  }

  /* =========================
     DASHBOARD
  ========================= */

  function renderDashboard(panel, day) {
    const leads = readLeads();
    const todayKey = getTodayKey();

    const todayLeads = leads.filter(lead => lead.date === todayKey);
    const todayDayLeads = leads.filter(lead => lead.date === todayKey && lead.day === day);

    const counts = {
      ig: leads.filter(l => l.entryType === "ig").length,
      phone: leads.filter(l => l.entryType === "phone").length,
      vip: leads.filter(l => l.entryType === "vip").length
    };

    const recent = [...leads].reverse().slice(0, 12);

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Manager Dashboard</div>
            <div class="gameSub">
              Local browser backup, CSV export, and reset tools.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge gameBadge--gold">Today: ${todayLeads.length}</span>
            <span class="gameBadge">${prettyLabel(day)}: ${todayDayLeads.length}</span>
            <span class="gameBadge">Total: ${leads.length}</span>
          </div>
        </div>

        <div class="menuList" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div class="menuEmpty"><strong>Instagram</strong><br>${counts.ig}</div>
          <div class="menuEmpty"><strong>Phone</strong><br>${counts.phone}</div>
          <div class="menuEmpty"><strong>VIP Both</strong><br>${counts.vip}</div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--gold" type="button" data-export-all>Export All CSV</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-export-today>Export Today CSV</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-reset-day>Reset Today Sessions</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-clear-leads>Clear Local Backup</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
        </div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Manager PIN">
            <button class="gameBtn gameBtn--ghost" type="button" data-pin-action>Confirm Action</button>
          </div>
          <div class="staffState">Protected actions require manager PIN.</div>
        </div>

        <div class="menuEmpty" style="padding:16px;">
          <strong>Recent Entries</strong>
          <div style="margin-top:10px;display:grid;gap:8px;">
            ${recent.length ? recent.map(lead => `
              <div style="padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.02);">
                <div><strong>${escapeHtml(lead.reward)}</strong> • ${escapeHtml((lead.entryType || "").toUpperCase())}</div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  ${escapeHtml(lead.createdAt || lead.timestamp || "")} • ${escapeHtml(lead.day)} • Table ${escapeHtml(lead.table)}
                </div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  IG: ${escapeHtml(lead.instagram || "-")} • Phone: ${escapeHtml(lead.phone || "-")}
                </div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  Code: ${escapeHtml(lead.code || "-")}
                </div>
              </div>
            `).join("") : `<div style="color:rgba(255,255,255,.72);">No entries yet.</div>`}
          </div>
        </div>
      </div>
    `;

    const pinInput = panel.querySelector(".staffInput");
    const staffState = panel.querySelector(".staffState");
    let pendingAction = null;

    panel.querySelector("[data-export-all]").addEventListener("click", () => {
      if (!leads.length) {
        staffState.textContent = "No entries to export.";
        return;
      }

      const rows = [
        ["createdAt", "day", "table", "entryType", "instagram", "phone", "reward", "boxNumber", "code"]
      ];

      leads.forEach(lead => {
        rows.push([
          lead.createdAt || lead.timestamp || "",
          lead.day || "",
          lead.table || "",
          lead.entryType || "",
          lead.instagram || "",
          lead.phone || "",
          lead.reward || "",
          String(lead.boxNumber || lead.revealedBox || ""),
          lead.code || ""
        ]);
      });

      downloadCsv(`allure-leads-all-${todayKey}.csv`, rows);
      staffState.textContent = "Exported all local entries.";
    });

    panel.querySelector("[data-export-today]").addEventListener("click", () => {
      if (!todayLeads.length) {
        staffState.textContent = "No entries for today.";
        return;
      }

      const rows = [
        ["createdAt", "day", "table", "entryType", "instagram", "phone", "reward", "boxNumber", "code"]
      ];

      todayLeads.forEach(lead => {
        rows.push([
          lead.createdAt || lead.timestamp || "",
          lead.day || "",
          lead.table || "",
          lead.entryType || "",
          lead.instagram || "",
          lead.phone || "",
          lead.reward || "",
          String(lead.boxNumber || lead.revealedBox || ""),
          lead.code || ""
        ]);
      });

      downloadCsv(`allure-leads-today-${todayKey}.csv`, rows);
      staffState.textContent = "Exported today's local entries.";
    });

    panel.querySelector("[data-reset-day]").addEventListener("click", () => {
      pendingAction = "reset-day";
      staffState.textContent = "Enter manager PIN and confirm to reset all today's sessions.";
    });

    panel.querySelector("[data-clear-leads]").addEventListener("click", () => {
      pendingAction = "clear-leads";
      staffState.textContent = "Enter manager PIN and confirm to clear local backup entries.";
    });

    panel.querySelector("[data-pin-action]").addEventListener("click", () => {
      const pin = (pinInput.value || "").trim();

      if (pin !== STAFF_PIN) {
        staffState.textContent = "Incorrect PIN.";
        return;
      }

      if (pendingAction === "reset-day") {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`allure_vip_session:${todayKey}:`)) {
            localStorage.removeItem(key);
          }
        });
        staffState.textContent = "Today's sessions reset.";
        pendingAction = null;
        return;
      }

      if (pendingAction === "clear-leads") {
        overwriteLeads([]);
        staffState.textContent = "Local backup entries cleared.";
        pendingAction = null;
        renderDashboard(panel, day);
        return;
      }

      staffState.textContent = "No protected action selected.";
    });

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
    });
  }

  /* =========================
     GAME FLOW
  ========================= */

  function renderDesktopPhoneOnlyGate(panel, day) {
    const existing = readSession(day);

    if (existing && typeof existing.revealedIndex === "number") {
      renderGame(panel, day, existing);
      return;
    }

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Unlock Your 24 Box Game</div>
            <div class="gameSub">
              Enter your phone number to play and unlock tonight's reward.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">Table: ${escapeHtml(getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${escapeHtml(prettyLabel(day))}</span>
          </div>
        </div>

        <div class="staffBox">
          <div style="display:grid;gap:10px;">
            <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input>
            <button class="gameBtn gameBtn--gold" type="button" data-unlock-boxes>Unlock Boxes</button>
          </div>
          <div class="staffState">Enter a valid phone number to continue.</div>
        </div>

        <div class="gameHint">
          Your phone number is saved to Allure's guest entry sheet when you reveal your box.
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const phoneInput = panel.querySelector("[data-phone-input]");
    const staffState = panel.querySelector(".staffState");

    panel.querySelector("[data-unlock-boxes]").addEventListener("click", () => {
      const phoneRaw = (phoneInput.value || "").trim();

      if (!validatePhone(phoneRaw)) {
        staffState.textContent = "Enter a valid phone number.";
        return;
      }

      const state = {
        date: getTodayKey(),
        day,
        table: getTableLabel(),
        entryType: "phone",
        instagram: "",
        phone: normalizePhone(phoneRaw),
        rewards: weightedPool("phone"),
        revealedIndex: null,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        code: ""
      };

      saveSession(day, state);
      renderGame(panel, day, state);
    });

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });
  }

  function renderMobileLeadGate(panel, day) {
    const existing = readSession(day);

    if (existing && typeof existing.revealedIndex === "number") {
      renderGame(panel, day, existing);
      return;
    }

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Unlock Your 24 Box Game</div>
            <div class="gameSub">
              Enter Instagram, phone number, or both. Then unlock the 24 boxes.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">Table: ${escapeHtml(getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${escapeHtml(prettyLabel(day))}</span>
          </div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost active" type="button" data-entry="ig">Instagram</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-entry="phone">Phone</button>
          <button class="gameBtn gameBtn--gold" type="button" data-entry="vip">VIP (Both)</button>
        </div>

        <div class="staffBox">
          <div style="display:grid;gap:10px;">
            <input class="staffInput" type="text" placeholder="@instagram" data-ig-input>
            <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input>
            <button class="gameBtn gameBtn--gold" type="button" data-unlock-boxes>Continue To 24 Boxes</button>
          </div>
          <div class="staffState">Choose one entry type, then fill the matching field(s).</div>
        </div>

        <div class="gameHint">
          Guest entry details are saved to Allure's Google Sheet when a box is revealed.
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const igInput = panel.querySelector("[data-ig-input]");
    const phoneInput = panel.querySelector("[data-phone-input]");
    const staffState = panel.querySelector(".staffState");
    const entryButtons = [...panel.querySelectorAll("[data-entry]")];
    let entryType = "ig";

    function setEntryType(type) {
      entryType = type;

      entryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.entry === type);
      });

      igInput.disabled = type === "phone";
      phoneInput.disabled = type === "ig";

      if (type === "ig") {
        phoneInput.value = "";
        staffState.textContent = "Instagram entry unlocks Standard odds.";
      } else if (type === "phone") {
        igInput.value = "";
        staffState.textContent = "Phone entry unlocks Premium odds.";
      } else {
        staffState.textContent = "VIP entry with both fields unlocks best odds.";
      }
    }

    entryButtons.forEach(button => {
      button.addEventListener("click", () => setEntryType(button.dataset.entry));
    });

    setEntryType("ig");

    panel.querySelector("[data-unlock-boxes]").addEventListener("click", () => {
      const igRaw = (igInput.value || "").trim();
      const phoneRaw = (phoneInput.value || "").trim();

      let instagram = "";
      let phone = "";

      if (entryType === "ig") {
        if (!validateInstagram(igRaw)) {
          staffState.textContent = "Enter a valid Instagram handle.";
          return;
        }
        instagram = normalizeInstagram(igRaw);
      }

      if (entryType === "phone") {
        if (!validatePhone(phoneRaw)) {
          staffState.textContent = "Enter a valid phone number.";
          return;
        }
        phone = normalizePhone(phoneRaw);
      }

      if (entryType === "vip") {
        if (!validateInstagram(igRaw) || !validatePhone(phoneRaw)) {
          staffState.textContent = "Enter both a valid Instagram handle and phone number.";
          return;
        }
        instagram = normalizeInstagram(igRaw);
        phone = normalizePhone(phoneRaw);
      }

      const state = {
        date: getTodayKey(),
        day,
        table: getTableLabel(),
        entryType,
        instagram,
        phone,
        rewards: weightedPool(entryType),
        revealedIndex: null,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        code: ""
      };

      saveSession(day, state);
      renderGame(panel, day, state);

      setTimeout(() => {
        const boxGrid = panel.querySelector(".boxGrid");
        if (boxGrid) {
          jumpToElementInstant(boxGrid, 8);
        }
      }, 30);
    });

    panel.querySelector("[data-back-top]").addEventListener("click", () => {
      jumpToTopInstant();
    });

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });
  }

  function renderLeadGate(panel, day) {
    if (isMobileView()) {
      renderMobileLeadGate(panel, day);
      return;
    }

    renderDesktopPhoneOnlyGate(panel, day);
  }

  function renderGame(panel, day, state) {
    const session = readSession(day) || state;
    const rewards = session.rewards || weightedPool(session.entryType || "phone");
    const revealedIndex = typeof session.revealedIndex === "number" ? session.revealedIndex : null;

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Allure 24 Box Game</div>
            <div class="gameSub">
              One reveal per table/device per day.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">${escapeHtml((session.entryType || "").toUpperCase())}</span>
            <span class="gameBadge">Table: ${escapeHtml(session.table || getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${escapeHtml(prettyLabel(day))}</span>
          </div>
        </div>

        <div class="boxGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="boxCell" type="button" data-box-index="${i}">
              Box ${i + 1}
            </button>
          `).join("")}
        </div>

        <div class="gameReveal">
          <div class="gameRevealLabel">Your Reveal</div>
          <div class="gameRevealText">${revealedIndex !== null ? escapeHtml(rewards[revealedIndex]) : "Choose one box"}</div>
          <div class="gameRevealCode">${revealedIndex !== null ? escapeHtml(session.code || `CODE-${day.toUpperCase()}-${revealedIndex + 1}`) : "One reveal per day"}</div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-manager-reset>Manager Reset</button>
          <button class="gameBtn gameBtn--gold" type="button" data-open-dashboard>Dashboard</button>
        </div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Manager PIN">
            <button class="gameBtn gameBtn--ghost" type="button" data-confirm-reset>Confirm Reset</button>
          </div>
          <div class="staffState">Reset clears this table/device play for today.</div>
        </div>
      </div>
    `;

    const boxButtons = [...panel.querySelectorAll("[data-box-index]")];
    const revealText = panel.querySelector(".gameRevealText");
    const revealCode = panel.querySelector(".gameRevealCode");
    const pinInput = panel.querySelector(".staffInput");
    const staffState = panel.querySelector(".staffState");

    function lockBoard(activeIndex) {
      boxButtons.forEach((button, index) => {
        if (index === activeIndex) {
          button.classList.add("is-revealed");
          button.textContent = "Winner";
        } else {
          button.classList.add("is-locked");
        }
      });
    }

    if (revealedIndex !== null) {
      lockBoard(revealedIndex);
    }

    boxButtons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        const current = readSession(day);

        if (!current || typeof current.revealedIndex === "number") {
          return;
        }

        current.revealedIndex = index;
        current.reward = rewards[index];
        current.revealedBox = index + 1;
        current.boxNumber = index + 1;
        current.timestamp = new Date().toISOString();
        current.createdAt = current.timestamp;
        current.code = `CODE-${day.toUpperCase()}-${index + 1}`;

        saveSession(day, current);

        const leadPayload = {
          date: current.date || getTodayKey(),
          createdAt: current.createdAt || current.timestamp || new Date().toISOString(),
          day: current.day || day,
          table: current.table || getTableLabel(),
          entryType: current.entryType || "",
          instagram: current.instagram || "",
          phone: current.phone || "",
          reward: current.reward || "",
          revealedBox: current.revealedBox || (index + 1),
          boxNumber: current.boxNumber || (index + 1),
          timestamp: current.timestamp || new Date().toISOString(),
          code: current.code || `CODE-${day.toUpperCase()}-${index + 1}`
        };

        saveLead(leadPayload);

        const sheetResult = await sendLeadToGoogleSheet(leadPayload);

        revealText.textContent = current.reward;
        revealCode.textContent = current.code;
        lockBoard(index);

        if (sheetResult.ok) {
          staffState.textContent = "Result saved to Google Sheet.";
        } else {
          staffState.textContent = "Result saved locally. Google Sheet sync failed.";
        }
      });
    });

    panel.querySelector("[data-back-top]").addEventListener("click", () => {
      jumpToTopInstant();
    });

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderLeadGate(panel, day);
      setTimeout(() => {
        jumpToElementInstant(panel, 8);
      }, 20);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    panel.querySelector("[data-manager-reset]").addEventListener("click", () => {
      staffState.textContent = "Enter manager PIN, then confirm reset.";
    });

    panel.querySelector("[data-confirm-reset]").addEventListener("click", () => {
      const pin = (pinInput.value || "").trim();

      if (pin !== STAFF_PIN) {
        staffState.textContent = "Incorrect PIN.";
        return;
      }

      clearSession(day);
      staffState.textContent = "Session cleared.";
      renderLeadGate(panel, day);

      setTimeout(() => {
        jumpToElementInstant(panel, 8);
      }, 20);
    });
  }

  /* =========================
     IDLE PANEL
  ========================= */

  function renderIdleState(panel, day) {
    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${escapeHtml(prettyLabel(day))} Menu</div>
        <div class="menuStart__text">
          Select a category to view menu items, play the 24 Box Game, or open the manager dashboard.
        </div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" type="button" data-start-game>Play 24 Box Game</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-food>Open Food Menu</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-dashboard>Dashboard</button>
        </div>
        <div class="menuStartMeta">
          Entries save to Google Sheet and local browser backup.
        </div>
      </div>
    `;

    const wrap = panel.closest(".menuCenterWrap");

    panel.querySelector("[data-start-game]").addEventListener("click", () => {
      renderLeadGate(panel, day);
      setTimeout(() => {
        jumpToElementInstant(panel, 8);
      }, 20);
    });

    panel.querySelector("[data-start-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    panel.querySelector("[data-start-food]").addEventListener("click", () => {
      const foodButton = wrap?.querySelector('.menuCenterBtn[data-cat="food"]');
      if (foodButton) {
        foodButton.click();
      }
    });
  }

  /* =========================
     WRAP SETUP
  ========================= */

  function getButtons(wrap) {
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outsideWrap = wrap.parentElement.querySelector(".outsideBottom");
    const outside = outsideWrap ? [...outsideWrap.querySelectorAll(".menuCenterBtn")] : [];
    return [...inside, ...outside];
  }

  function setupWrap(wrap) {
    if (wrap.dataset.done === "true") return;
    wrap.dataset.done = "true";

    const buttons = getButtons(wrap);
    const panel = wrap.querySelector(".menuPanelBody");
    const dayPanel = wrap.closest(".dayPanel");
    const day = dayPanel?.dataset.daypanel || "monday";

    if (!panel || !buttons.length) return;

    function clearActive() {
      buttons.forEach(btn => btn.classList.remove("active"));
    }

    function activateCategory(button) {
      clearActive();
      button.classList.add("active");

      const catKey = button.dataset.cat;
      const mode = button.dataset.mode || "";
      const baseContent = CATEGORY_CONTENT[catKey];

      if (!baseContent) {
        panel.innerHTML = `<div class="menuEmpty">Coming soon.</div>`;
        return;
      }

      const content = getContentByMode(baseContent, mode);
      panel.innerHTML = renderSectionedMenu(content);
      bindSubTabs(panel, content);
    }

    function activateGame(button) {
      clearActive();
      button.classList.add("active");
      renderLeadGate(panel, day);

      setTimeout(() => {
        const target = panel.querySelector(".gameShell") || panel;
        jumpToElementInstant(target, 8);
      }, 20);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "game") {
          activateGame(button);
          return;
        }

        activateCategory(button);
      });
    });

    clearActive();
    renderIdleState(panel, day);
  }

  /* =========================
     DAY SWITCH
  ========================= */

  function activateDay(day) {
    document.querySelectorAll(".dayTab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.daytab === day);
    });

    document.querySelectorAll(".dayPanel").forEach(panel => {
      const active = panel.dataset.daypanel === day;
      panel.classList.toggle("active", active);

      if (active) {
        panel.querySelectorAll(".menuCenterWrap").forEach(setupWrap);
      }
    });
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => activateDay(tab.dataset.daytab));
  });

  const today = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  /* =========================
     TOP HERO -> OPEN REAL GAME
  ========================= */

  function jumpToActiveGamePanel() {
    let activeDayPanel = document.querySelector(".dayPanel.active");

    if (!activeDayPanel) {
      activateDay(hasTodayTab ? today : fallbackDay);
      activeDayPanel = document.querySelector(".dayPanel.active");
    }

    if (!activeDayPanel) return;

    const gameButton = activeDayPanel.querySelector('.menuCenterBtn[data-action="game"]');
    if (!gameButton) return;

    gameButton.click();

    setTimeout(() => {
      const target =
        activeDayPanel.querySelector(".gameShell") ||
        activeDayPanel.querySelector(".menuBigPanel") ||
        activeDayPanel.querySelector(".menuPanelBody");

      if (!target) return;
      jumpToElementInstant(target, 8);
    }, 80);
  }

  document.querySelectorAll("[data-open-game]").forEach(button => {
    button.addEventListener("click", jumpToActiveGamePanel);
  });

  activateDay(hasTodayTab ? today : fallbackDay);
});