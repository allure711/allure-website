document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";
  const LEADS_KEY = "allure_leads_v2";

  const DAILY_PROMOS = {
    sunday: {
      label: "SOCIAL SUNDAY",
      text: "Chill vibes, hookah, drinks & music"
    },
    monday: {
      label: "FREE HOOKAH MONDAY",
      text: "With $50 bar tab — your choice of flavor"
    },
    tuesday: {
      label: "TACO TUESDAY",
      text: "Tacos, drinks & late night vibes"
    },
    wednesday: {
      label: "WEEKDAYS WEDNESDAY",
      text: "Midweek energy, cocktails & hookah"
    },
    thursday: {
      label: "KARAOKE THURSDAY",
      text: "Sing, drink & vibe all night"
    },
    friday: {
      label: "ALLURE FRIDAY",
      text: "Premium nightlife experience"
    },
    saturday: {
      label: "ALLURE SATURDAY",
      text: "VIP energy, bottles & music"
    }
  };

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

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getTodayName() {
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
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

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function validateInstagram(value) {
    if (!value) return false;
    const cleaned = value.trim();
    return /^@?[a-zA-Z0-9._]{2,30}$/.test(cleaned);
  }

  function normalizeInstagram(value) {
    const cleaned = value.trim().replace(/\s+/g, "");
    if (!cleaned) return "";
    return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function normalizePhone(value) {
    return value.replace(/\D/g, "");
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
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function weightedPool(type) {
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

    if (type === "ig") {
      source = [...standard, ...standard, ...premium];
    } else if (type === "phone") {
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

  /* =========================
     DAILY PROMO CARD
  ========================= */

  function updateDailyPromo(day) {
    const promoLabel = document.getElementById("promoLabel");
    const promoText = document.getElementById("promoText");
    const promo = DAILY_PROMOS[day];

    if (!promoLabel || !promoText || !promo) return;

    promoLabel.textContent = promo.label;
    promoText.textContent = promo.text;
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
              Local browser lead storage, CSV export, and reset tools.
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
          <button class="gameBtn gameBtn--ghost" type="button" data-clear-leads>Clear All Leads</button>
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
          <strong>Recent Leads</strong>
          <div style="margin-top:10px;display:grid;gap:8px;">
            ${recent.length ? recent.map(lead => `
              <div style="padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.02);">
                <div><strong>${escapeHtml(lead.reward)}</strong> • ${escapeHtml(lead.entryType.toUpperCase())}</div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  ${escapeHtml(lead.date)} • ${escapeHtml(lead.day)} • Table ${escapeHtml(lead.table)}
                </div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  IG: ${escapeHtml(lead.instagram || "-")} • Phone: ${escapeHtml(lead.phone || "-")}
                </div>
              </div>
            `).join("") : `<div style="color:rgba(255,255,255,.72);">No leads yet.</div>`}
          </div>
        </div>
      </div>
    `;

    const pinInput = panel.querySelector(".staffInput");
    const staffState = panel.querySelector(".staffState");
    let pendingAction = null;

    panel.querySelector("[data-export-all]").addEventListener("click", () => {
      if (!leads.length) {
        staffState.textContent = "No leads to export.";
        return;
      }

      const rows = [
        ["date", "day", "table", "entryType", "instagram", "phone", "reward", "revealedBox", "timestamp"]
      ];

      leads.forEach(lead => {
        rows.push([
          lead.date,
          lead.day,
          lead.table,
          lead.entryType,
          lead.instagram || "",
          lead.phone || "",
          lead.reward,
          String(lead.revealedBox),
          lead.timestamp
        ]);
      });

      downloadCsv(`allure-leads-all-${todayKey}.csv`, rows);
      staffState.textContent = "Exported all leads.";
    });

    panel.querySelector("[data-export-today]").addEventListener("click", () => {
      if (!todayLeads.length) {
        staffState.textContent = "No leads for today.";
        return;
      }

      const rows = [
        ["date", "day", "table", "entryType", "instagram", "phone", "reward", "revealedBox", "timestamp"]
      ];

      todayLeads.forEach(lead => {
        rows.push([
          lead.date,
          lead.day,
          lead.table,
          lead.entryType,
          lead.instagram || "",
          lead.phone || "",
          lead.reward,
          String(lead.revealedBox),
          lead.timestamp
        ]);
      });

      downloadCsv(`allure-leads-today-${todayKey}.csv`, rows);
      staffState.textContent = "Exported today leads.";
    });

    panel.querySelector("[data-reset-day]").addEventListener("click", () => {
      pendingAction = "reset-day";
      staffState.textContent = "Enter manager PIN and confirm to reset all today's sessions.";
    });

    panel.querySelector("[data-clear-leads]").addEventListener("click", () => {
      pendingAction = "clear-leads";
      staffState.textContent = "Enter manager PIN and confirm to clear all stored leads.";
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
        staffState.textContent = "All leads cleared.";
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
     VIP GAME
  ========================= */

  function renderLeadGate(panel, day) {
    const existing = readSession(day);

    if (existing && typeof existing.revealedIndex === "number") {
      renderGame(panel, day, existing);
      return;
    }

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Unlock Your VIP Mystery Box</div>
            <div class="gameSub">
              Enter your Instagram or phone number to play.<br>
              Enter both for VIP reward odds.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">Table: ${escapeHtml(getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${prettyLabel(day)}</span>
          </div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" type="button" data-entry="ig">Instagram</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-entry="phone">Phone</button>
          <button class="gameBtn gameBtn--gold" type="button" data-entry="vip">VIP (Both)</button>
        </div>

        <div class="staffBox">
          <div style="display:grid;gap:10px;">
            <input class="staffInput" type="text" placeholder="@instagram" data-ig-input>
            <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input>
            <button class="gameBtn gameBtn--gold" type="button" data-unlock-boxes>Unlock Boxes</button>
          </div>
          <div class="staffState">Choose one entry type, then fill the matching field(s).</div>
        </div>

        <div class="gameHint">
          By entering a phone number, guest agrees to receive occasional Allure promotions.
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const igInput = panel.querySelector("[data-ig-input]");
    const phoneInput = panel.querySelector("[data-phone-input]");
    const staffState = panel.querySelector(".staffState");
    let entryType = "vip";

    const entryButtons = [...panel.querySelectorAll("[data-entry]")];

    function setEntryType(type) {
      entryType = type;
      entryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.entry === type);
      });

      igInput.disabled = type === "phone";
      phoneInput.disabled = type === "ig";

      if (type === "ig") {
        phoneInput.value = "";
      } else if (type === "phone") {
        igInput.value = "";
      }

      if (type === "ig") {
        staffState.textContent = "Instagram entry unlocks Standard odds.";
      } else if (type === "phone") {
        staffState.textContent = "Phone entry unlocks Premium odds.";
      } else {
        staffState.textContent = "VIP entry with both fields unlocks best odds.";
      }
    }

    entryButtons.forEach(btn => {
      btn.addEventListener("click", () => setEntryType(btn.dataset.entry));
    });

    setEntryType("vip");

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

      const rewards = weightedPool(entryType);

      const state = {
        date: getTodayKey(),
        day,
        table: getTableLabel(),
        entryType,
        instagram,
        phone,
        rewards,
        revealedIndex: null,
        timestamp: new Date().toISOString()
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

  function renderGame(panel, day, state) {
    const session = readSession(day) || state;
    const rewards = session.rewards || weightedPool(session.entryType || "vip");
    const revealedIndex = typeof session.revealedIndex === "number" ? session.revealedIndex : null;

    panel.innerHTML = `
      <div class="gameShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Allure VIP Mystery Box</div>
            <div class="gameSub">
              One reveal per table/device per day.
            </div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">${escapeHtml((session.entryType || "").toUpperCase())}</span>
            <span class="gameBadge">Table: ${escapeHtml(session.table || getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${prettyLabel(day)}</span>
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
          <div class="gameRevealCode">${revealedIndex !== null ? `CODE-${day.toUpperCase()}-${revealedIndex + 1}` : "One reveal per day"}</div>
        </div>

        <div class="gameActions">
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
      button.addEventListener("click", () => {
        const current = readSession(day);

        if (!current || typeof current.revealedIndex === "number") {
          return;
        }

        current.revealedIndex = index;
        current.reward = rewards[index];
        current.revealedBox = index + 1;
        current.timestamp = new Date().toISOString();

        saveSession(day, current);

        saveLead({
          date: current.date || getTodayKey(),
          day: current.day || day,
          table: current.table || getTableLabel(),
          entryType: current.entryType || "",
          instagram: current.instagram || "",
          phone: current.phone || "",
          reward: current.reward,
          revealedBox: current.revealedBox,
          timestamp: current.timestamp
        });

        revealText.textContent = current.reward;
        revealCode.textContent = `CODE-${day.toUpperCase()}-${index + 1}`;
        lockBoard(index);
        staffState.textContent = "Result saved.";
      });
    });

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
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
    });
  }

  /* =========================
     IDLE PANEL
  ========================= */

  function renderIdleState(panel, day) {
    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${prettyLabel(day)} Menu</div>
        <div class="menuStart__text">
          Select a category to view menu items, play the VIP lead game, or open the manager dashboard.
        </div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" type="button" data-start-game>Play VIP Game</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-food>Open Food Menu</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-dashboard>Dashboard</button>
        </div>
        <div class="menuStartMeta">
          Leads are stored in this browser and can be exported as CSV.
        </div>
      </div>
    `;

    const wrap = panel.closest(".menuCenterWrap");

    panel.querySelector("[data-start-game]").addEventListener("click", () => {
      renderLeadGate(panel, day);
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

    updateDailyPromo(day);
  }

  document.querySelectorAll(".dayTab").forEach(tab => {
    tab.addEventListener("click", () => activateDay(tab.dataset.daytab));
  });

  const today = getTodayName();
  const fallbackDay = document.querySelector(".dayTab")?.dataset.daytab || "monday";
  const hasTodayTab = document.querySelector(`.dayTab[data-daytab="${today}"]`);

  activateDay(hasTodayTab ? today : fallbackDay);
});