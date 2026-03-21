document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";
  const LEADS_KEY = "allure_leads_v3";

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

  function getTodayName() {
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
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

  function overwriteLeads(leads) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  function saveLead(lead) {
    const leads = readLeads();
    leads.push(lead);
    overwriteLeads(leads);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function csvEscape(value) {
    const str = String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function prettyLabel(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normalizeInstagram(value) {
    const cleaned = String(value || "").trim().replace(/\s+/g, "");
    if (!cleaned) return "";
    return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
  }

  function validateInstagram(value) {
    return /^@?[a-zA-Z0-9._]{2,30}$/.test(String(value || "").trim());
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validatePhone(value) {
    const digits = normalizePhone(value);
    return digits.length >= 10 && digits.length <= 15;
  }

  function normalizeBirthday(value) {
    return String(value || "").trim();
  }

  function validateBirthday(value) {
    if (!value) return true;
    return /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(String(value).trim());
  }

  function buildRewardPool(type) {
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
      "Enjoy The Night",
      "Ask About VIP",
      "House Favorite"
    ];

    let pool = [];

    if (type === "phone") {
      pool = [...phoneRewards, ...igRewards, ...fillers];
    } else if (type === "vip") {
      pool = [...vipRewards, ...phoneRewards, ...fillers];
    } else {
      pool = [...igRewards, ...fillers, ...fillers];
    }

    while (pool.length < 24) {
      pool.push("Try Again");
    }

    return shuffle(pool).slice(0, 24);
  }

  function buildTags(entryType, reward, birthday) {
    const tags = [];

    if (entryType === "vip") tags.push("VIP");
    if (entryType === "phone") tags.push("Phone Lead");
    if (entryType === "ig") tags.push("IG Lead");
    if (birthday) tags.push("Birthday Club");
    if (/VIP/i.test(reward)) tags.push("VIP Reward");
    if (/Bottle/i.test(reward)) tags.push("Bottle Upsell");
    if (/Hookah/i.test(reward)) tags.push("Hookah Upsell");

    return tags.join(", ");
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
    const phoneLeads = leads.filter(lead => lead.phone);
    const birthdayLeads = leads.filter(lead => lead.birthday);
    const recent = [...leads].reverse().slice(0, 12);

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">Manager Dashboard</div>
        <div class="hybridSub">
          Level 2 + Level 3 lead tracking, exports, phone list, and birthday club.
        </div>

        <div class="menuList" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <div class="menuEmpty"><strong>Total Leads</strong><br>${leads.length}</div>
          <div class="menuEmpty"><strong>Today</strong><br>${todayLeads.length}</div>
          <div class="menuEmpty"><strong>Phone Leads</strong><br>${phoneLeads.length}</div>
        </div>

        <div class="menuList" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px;">
          <div class="menuEmpty"><strong>Birthday Club</strong><br>${birthdayLeads.length}</div>
          <div class="menuEmpty"><strong>Current Day</strong><br>${prettyLabel(day)}</div>
          <div class="menuEmpty"><strong>Table</strong><br>${escapeHtml(getTableLabel())}</div>
        </div>

        <div class="hybridActions" style="margin-top:14px;">
          <button class="hybridBtn hybridBtn--gold" type="button" data-export-all>Export All CSV</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-export-today>Export Today CSV</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-export-phones>Export Phone List</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-export-bdays>Export Birthday Club</button>
        </div>

        <div class="hybridActions" style="margin-top:10px;">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-reset-day>Reset Today Sessions</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-clear-leads>Clear All Leads</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-back-game>Back</button>
        </div>

        <div class="staffBox" style="margin-top:12px;">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Manager PIN" data-pin>
            <button class="hybridBtn hybridBtn--ghost" type="button" data-confirm-pin>Confirm Protected Action</button>
          </div>
          <div class="staffState" data-dashboard-state>Select an action above, then enter manager PIN.</div>
        </div>

        <div class="menuEmpty" style="margin-top:14px;">
          <strong>Recent Leads</strong>
          <div style="display:grid;gap:8px;margin-top:10px;">
            ${recent.length ? recent.map(lead => `
              <div style="padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.02);">
                <div><strong>${escapeHtml(lead.reward)}</strong> • ${escapeHtml(lead.entryType.toUpperCase())}</div>
                <div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:4px;">
                  ${escapeHtml(lead.date)} • ${escapeHtml(lead.day)} • Table ${escapeHtml(lead.table)}
                </div>
                <div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:4px;">
                  IG: ${escapeHtml(lead.instagram || "-")} • Phone: ${escapeHtml(lead.phone || "-")} • Birthday: ${escapeHtml(lead.birthday || "-")}
                </div>
                <div style="font-size:12px;color:rgba(255,255,255,.72);margin-top:4px;">
                  Tags: ${escapeHtml(lead.tags || "-")}
                </div>
              </div>
            `).join("") : `<div style="color:rgba(255,255,255,.72);">No leads yet.</div>`}
          </div>
        </div>
      </div>
    `;

    const state = panel.querySelector("[data-dashboard-state]");
    const pinInput = panel.querySelector("[data-pin]");
    let pendingAction = "";

    panel.querySelector("[data-export-all]").addEventListener("click", () => {
      if (!leads.length) {
        state.textContent = "No leads to export.";
        return;
      }

      const rows = [
        ["date", "day", "table", "entryType", "instagram", "phone", "birthday", "reward", "revealedBox", "tags", "timestamp"]
      ];

      leads.forEach(lead => {
        rows.push([
          lead.date,
          lead.day,
          lead.table,
          lead.entryType,
          lead.instagram || "",
          lead.phone || "",
          lead.birthday || "",
          lead.reward,
          String(lead.revealedBox),
          lead.tags || "",
          lead.timestamp
        ]);
      });

      downloadCsv(`allure-leads-all-${todayKey}.csv`, rows);
      state.textContent = "Exported all leads.";
    });

    panel.querySelector("[data-export-today]").addEventListener("click", () => {
      if (!todayLeads.length) {
        state.textContent = "No leads for today.";
        return;
      }

      const rows = [
        ["date", "day", "table", "entryType", "instagram", "phone", "birthday", "reward", "revealedBox", "tags", "timestamp"]
      ];

      todayLeads.forEach(lead => {
        rows.push([
          lead.date,
          lead.day,
          lead.table,
          lead.entryType,
          lead.instagram || "",
          lead.phone || "",
          lead.birthday || "",
          lead.reward,
          String(lead.revealedBox),
          lead.tags || "",
          lead.timestamp
        ]);
      });

      downloadCsv(`allure-leads-today-${todayKey}.csv`, rows);
      state.textContent = "Exported today leads.";
    });

    panel.querySelector("[data-export-phones]").addEventListener("click", () => {
      if (!phoneLeads.length) {
        state.textContent = "No phone leads to export.";
        return;
      }

      const rows = [
        ["phone", "instagram", "birthday", "entryType", "date", "reward", "tags"]
      ];

      phoneLeads.forEach(lead => {
        rows.push([
          lead.phone || "",
          lead.instagram || "",
          lead.birthday || "",
          lead.entryType,
          lead.date,
          lead.reward,
          lead.tags || ""
        ]);
      });

      downloadCsv(`allure-phone-list-${todayKey}.csv`, rows);
      state.textContent = "Exported phone list.";
    });

    panel.querySelector("[data-export-bdays]").addEventListener("click", () => {
      if (!birthdayLeads.length) {
        state.textContent = "No birthday club leads to export.";
        return;
      }

      const rows = [
        ["birthday", "phone", "instagram", "entryType", "date", "reward", "tags"]
      ];

      birthdayLeads.forEach(lead => {
        rows.push([
          lead.birthday || "",
          lead.phone || "",
          lead.instagram || "",
          lead.entryType,
          lead.date,
          lead.reward,
          lead.tags || ""
        ]);
      });

      downloadCsv(`allure-birthday-club-${todayKey}.csv`, rows);
      state.textContent = "Exported birthday club.";
    });

    panel.querySelector("[data-reset-day]").addEventListener("click", () => {
      pendingAction = "reset-day";
      state.textContent = "Enter manager PIN to reset today's sessions.";
    });

    panel.querySelector("[data-clear-leads]").addEventListener("click", () => {
      pendingAction = "clear-leads";
      state.textContent = "Enter manager PIN to clear all stored leads.";
    });

    panel.querySelector("[data-confirm-pin]").addEventListener("click", () => {
      const pin = String(pinInput.value || "").trim();

      if (pin !== STAFF_PIN) {
        state.textContent = "Incorrect manager PIN.";
        return;
      }

      if (pendingAction === "reset-day") {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`allure_vip_session:${todayKey}:`)) {
            localStorage.removeItem(key);
          }
        });
        state.textContent = "Today's sessions reset.";
        pendingAction = "";
        return;
      }

      if (pendingAction === "clear-leads") {
        overwriteLeads([]);
        state.textContent = "All leads cleared.";
        pendingAction = "";
        renderDashboard(panel, day);
        return;
      }

      state.textContent = "No protected action selected.";
    });

    panel.querySelector("[data-back-game]").addEventListener("click", () => {
      renderLeadGate(panel, day);
    });
  }

  /* =========================
     LEAD GATE
  ========================= */

  function renderLeadGate(panel, day) {
    const existing = readSession(day);

    if (existing && typeof existing.revealedIndex === "number") {
      renderGame(panel, day, existing);
      return;
    }

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">Unlock Your VIP Mystery Box</div>
        <div class="hybridSub">
          Enter your Instagram or phone number to play.<br>
          Enter both for VIP reward odds.
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="ig">Instagram</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-entry="phone">Phone</button>
          <button class="hybridBtn hybridBtn--gold" type="button" data-entry="vip">VIP (Both)</button>
        </div>

        <div class="staffBox">
          <div style="display:grid;gap:10px;">
            <input class="staffInput" type="text" placeholder="@instagram" data-ig-input style="display:none;">
            <input class="staffInput" type="tel" placeholder="Phone number" data-phone-input style="display:none;">
            <input class="staffInput" type="text" placeholder="Birthday MM/DD (optional)" data-bday-input style="display:none;">
            <button class="hybridBtn hybridBtn--gold" type="button" data-unlock>Unlock Boxes</button>
          </div>
          <div class="staffState" data-state>Please select Instagram, Phone, or VIP to continue.</div>
        </div>

        <div class="hybridActions" style="margin-top:10px;">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const igInput = panel.querySelector("[data-ig-input]");
    const phoneInput = panel.querySelector("[data-phone-input]");
    const birthdayInput = panel.querySelector("[data-bday-input]");
    const state = panel.querySelector("[data-state]");
    const entryButtons = [...panel.querySelectorAll("[data-entry]")];

    let entryType = "";

    function setEntry(type) {
      entryType = type;

      entryButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.entry === type);
      });

      if (type === "ig") {
        igInput.style.display = "";
        phoneInput.style.display = "none";
        birthdayInput.style.display = "";
        phoneInput.value = "";
        state.textContent = "Please enter your Instagram to continue.";
      } else if (type === "phone") {
        igInput.style.display = "none";
        phoneInput.style.display = "";
        birthdayInput.style.display = "";
        igInput.value = "";
        state.textContent = "Please enter your phone number to continue.";
      } else if (type === "vip") {
        igInput.style.display = "";
        phoneInput.style.display = "";
        birthdayInput.style.display = "";
        state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
      } else {
        igInput.style.display = "none";
        phoneInput.style.display = "none";
        birthdayInput.style.display = "none";
        igInput.value = "";
        phoneInput.value = "";
        birthdayInput.value = "";
        state.textContent = "Please select Instagram, Phone, or VIP to continue.";
      }
    }

    entryButtons.forEach(btn => {
      btn.addEventListener("click", () => setEntry(btn.dataset.entry));
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    panel.querySelector("[data-unlock]").addEventListener("click", () => {
      const ig = normalizeInstagram(igInput.value);
      const phone = normalizePhone(phoneInput.value);
      const birthday = normalizeBirthday(birthdayInput.value);

      if (!entryType) {
        state.textContent = "Please select Instagram, Phone, or VIP first.";
        return;
      }

      if (entryType === "ig" && !validateInstagram(ig)) {
        state.textContent = "Please enter your Instagram to play.";
        return;
      }

      if (entryType === "phone" && !validatePhone(phone)) {
        state.textContent = "Please enter your phone number to play.";
        return;
      }

      if (entryType === "vip") {
        if (!validateInstagram(ig) || !validatePhone(phone)) {
          state.textContent = "Please enter both Instagram and phone number to unlock VIP.";
          return;
        }
      }

      if (!validateBirthday(birthday)) {
        state.textContent = "Please enter birthday as MM/DD or leave it blank.";
        return;
      }

      const session = {
        date: getTodayKey(),
        day,
        table: getTableLabel(),
        entryType,
        instagram: entryType === "phone" ? "" : ig,
        phone: entryType === "ig" ? "" : phone,
        birthday: birthday || "",
        rewards: buildRewardPool(entryType),
        revealedIndex: null,
        timestamp: new Date().toISOString()
      };

      saveSession(day, session);
      renderGame(panel, day, session);
    });
  }

  /* =========================
     GAME RENDER
  ========================= */

  function renderGame(panel, day, state) {
    const session = readSession(day) || state;
    const rewards = session.rewards || buildRewardPool(session.entryType || "ig");
    const revealedIndex = typeof session.revealedIndex === "number" ? session.revealedIndex : null;

    panel.innerHTML = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Mystery Box Game</div>

        <div class="hybridSub">
          ${session.entryType === "ig" ? `Instagram: ${escapeHtml(session.instagram)}` : ""}
          ${session.entryType === "phone" ? `Phone: ${escapeHtml(session.phone)}` : ""}
          ${session.entryType === "vip" ? `Instagram: ${escapeHtml(session.instagram)} • Phone: ${escapeHtml(session.phone)}` : ""}
          ${session.birthday ? `<br>Birthday Club: ${escapeHtml(session.birthday)}` : ""}
        </div>

        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <button class="mysteryBox" type="button" data-box-index="${i}">
              Box ${i + 1}
            </button>
          `).join("")}
        </div>

        <div class="mysteryReveal">
          <div class="mysteryRevealText" id="revealText">${revealedIndex !== null ? escapeHtml(rewards[revealedIndex]) : "Pick a box"}</div>
        </div>

        <div class="hybridActions">
          <button class="hybridBtn hybridBtn--ghost" type="button" data-back>Back</button>
          <button class="hybridBtn hybridBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const boxes = [...panel.querySelectorAll("[data-box-index]")];
    const revealText = panel.querySelector("#revealText");

    function lockBoard(activeIndex) {
      boxes.forEach((box, idx) => {
        if (idx === activeIndex) {
          box.textContent = rewards[idx];
          box.classList.add("is-open");
        } else {
          box.classList.add("is-locked");
        }
      });
    }

    if (revealedIndex !== null) {
      lockBoard(revealedIndex);
    }

    boxes.forEach((box, i) => {
      box.addEventListener("click", () => {
        const current = readSession(day);

        if (!current || typeof current.revealedIndex === "number") {
          return;
        }

        current.revealedIndex = i;
        current.reward = rewards[i];
        current.revealedBox = i + 1;
        current.timestamp = new Date().toISOString();

        saveSession(day, current);

        saveLead({
          date: current.date || getTodayKey(),
          day: current.day || day,
          table: current.table || getTableLabel(),
          entryType: current.entryType || "",
          instagram: current.instagram || "",
          phone: current.phone || "",
          birthday: current.birthday || "",
          reward: current.reward,
          revealedBox: current.revealedBox,
          tags: buildTags(current.entryType, current.reward, current.birthday),
          timestamp: current.timestamp
        });

        revealText.textContent = current.reward;
        lockBoard(i);
      });
    });

    panel.querySelector("[data-back]").addEventListener("click", () => {
      renderLeadGate(panel, day);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });
  }

  /* =========================
     IDLE PANEL
  ========================= */

  function renderIdleState(panel, day) {
    panel.innerHTML = `
      <div class="menuEmpty">
        <strong>${prettyLabel(day)} Menu</strong><br><br>
        Choose a category above or tap <strong>24 Box Game</strong> to play.
      </div>
    `;
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
    const panel = wrap.querySelector(".menuPanelBody");
    if (!panel) return;

    const buttons = getButtons(wrap);
    const dayPanel = wrap.closest(".dayPanel");
    const day = dayPanel?.dataset.daypanel || "monday";

    if (!wrap.dataset.bound) {
      wrap.dataset.bound = "true";

      buttons.forEach(button => {
        button.addEventListener("click", () => {
          buttons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");

          if (button.dataset.action === "game") {
            renderLeadGate(panel, day);
            return;
          }

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
        });
      });
    }

    buttons.forEach(btn => btn.classList.remove("active"));
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