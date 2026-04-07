document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";
  const LEADS_KEY = "allure_leads_v4";
  const GOOGLE_SHEET_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
  const MOBILE_BREAKPOINT = 760;

  const WHEEL_SEGMENTS = [
    "Free Shot",
    "$5 Off Hookah",
    "Free Mixer",
    "$3 Off Fishbowl",
    "Spin Again",
    "Hookah Upgrade",
    "Lucky Discount",
    "Ask About VIP",
    "House Favorite",
    "Try Again",
    "$10 Off Bottle",
    "Group Cheers"
  ];

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
    return `allure_pdm_session:${getTodayKey()}:${day}:${getTableLabel().toLowerCase()}`;
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
          entryType: lead.entryType || "phone",
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

  function createRewardCode(day, index) {
    return `PDM-${String(day || "").slice(0, 3).toUpperCase()}-${index + 1}`;
  }

  function getRandomSegmentIndex() {
    return Math.floor(Math.random() * WHEEL_SEGMENTS.length);
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
    const targetTop =
      window.pageYOffset + target.getBoundingClientRect().top - headerHeight - extraOffset;

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

  function getWrapFromPanel(panel) {
    return panel.closest(".menuCenterWrap");
  }

  function setGameState(panel, isActive) {
    const wrap = getWrapFromPanel(panel);
    if (!wrap) return;
    wrap.classList.toggle("is-game-active", Boolean(isActive));
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
    setGameState(panel, true);

    const leads = readLeads();
    const todayKey = getTodayKey();

    const todayLeads = leads.filter(lead => lead.date === todayKey);
    const todayDayLeads = leads.filter(lead => lead.date === todayKey && lead.day === day);
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

        <div class="gameActions">
          <button class="gameBtn gameBtn--gold" type="button" data-export-all>Export All CSV</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-export-today>Export Today CSV</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-reset-day>Reset Today Sessions</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-clear-leads>Clear Local Backup</button>
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
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
                <div><strong>${escapeHtml(lead.reward)}</strong></div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  ${escapeHtml(lead.createdAt || lead.timestamp || "")} • ${escapeHtml(lead.day)} • Table ${escapeHtml(lead.table)}
                </div>
                <div style="color:rgba(255,255,255,.72);font-size:12px;margin-top:4px;">
                  Phone: ${escapeHtml(lead.phone || "-")} • Code: ${escapeHtml(lead.code || "-")}
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
        ["createdAt", "day", "table", "entryType", "phone", "reward", "boxNumber", "code"]
      ];

      leads.forEach(lead => {
        rows.push([
          lead.createdAt || lead.timestamp || "",
          lead.day || "",
          lead.table || "",
          lead.entryType || "",
          lead.phone || "",
          lead.reward || "",
          String(lead.boxNumber || ""),
          lead.code || ""
        ]);
      });

      downloadCsv(`pour-decision-maker-all-${todayKey}.csv`, rows);
      staffState.textContent = "Exported all local entries.";
    });

    panel.querySelector("[data-export-today]").addEventListener("click", () => {
      if (!todayLeads.length) {
        staffState.textContent = "No entries for today.";
        return;
      }

      const rows = [
        ["createdAt", "day", "table", "entryType", "phone", "reward", "boxNumber", "code"]
      ];

      todayLeads.forEach(lead => {
        rows.push([
          lead.createdAt || lead.timestamp || "",
          lead.day || "",
          lead.table || "",
          lead.entryType || "",
          lead.phone || "",
          lead.reward || "",
          String(lead.boxNumber || ""),
          lead.code || ""
        ]);
      });

      downloadCsv(`pour-decision-maker-today-${todayKey}.csv`, rows);
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
          if (key.startsWith(`allure_pdm_session:${todayKey}:`)) {
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

    panel.querySelector("[data-back-top]").addEventListener("click", jumpToTopInstant);

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
    });
  }

  /* =========================
     POUR DECISION MAKER FLOW
  ========================= */

  function renderEntryScreen(panel, day, forceFresh = false) {
    setGameState(panel, true);

    const existing = readSession(day);

    if (!forceFresh && existing) {
      if ((existing.stage === "wheel" || existing.stage === "winner") && existing.phone) {
        renderWheelScreen(panel, day, existing);
        return;
      }
    }

    panel.innerHTML = `
      <div class="pdmEntry">
        <div class="pdmEntry__eyebrow">Pour Decision Maker</div>
        <h3 class="pdmEntry__title">One spin. One decision. One unforgettable night.</h3>
        <p class="pdmEntry__text">
          Enter your phone number to unlock tonight's spin.
        </p>

        <div class="staffBox">
          <div class="pdmEntry__form">
            <input class="staffInput pdmEntry__input" type="tel" placeholder="Phone number" data-phone-input>
            <button class="gameBtn gameBtn--gold pdmEntry__submit" type="button" data-entry-continue>Continue</button>
          </div>
          <div class="staffState">Enter a valid phone number to continue.</div>
        </div>

        <div class="gameHint">
          Your number is saved when your result is revealed.
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-back-idle>Back</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>
      </div>
    `;

    const phoneInput = panel.querySelector("[data-phone-input]");
    const staffState = panel.querySelector(".staffState");

    panel.querySelector("[data-entry-continue]").addEventListener("click", () => {
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
        phone: normalizePhone(phoneRaw),
        segments: [...WHEEL_SEGMENTS],
        selectedIndex: null,
        reward: "",
        code: "",
        boxNumber: "",
        finalRotation: 0,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        stage: "wheel"
      };

      saveSession(day, state);
      renderWheelScreen(panel, day, state);

      setTimeout(() => {
        const wheelTarget = panel.querySelector(".pdmWheelShell");
        jumpToElementInstant(wheelTarget || panel, 8);
      }, 30);
    });

    panel.querySelector("[data-back-top]").addEventListener("click", jumpToTopInstant);

    panel.querySelector("[data-back-idle]").addEventListener("click", () => {
      renderIdleState(panel, day);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });
  }

  function renderWheelScreen(panel, day, session) {
    setGameState(panel, true);

    const safeSession = readSession(day) || session;
    const hasWinner = typeof safeSession.selectedIndex === "number" && !!safeSession.reward;

    panel.innerHTML = `
      <div class="pdmWheelShell">
        <div class="gameTop">
          <div>
            <div class="gameTitle">Pour Decision Maker</div>
            <div class="gameSub">Spin once to decide the night.</div>
          </div>

          <div class="gameBadgeRow">
            <span class="gameBadge">Table: ${escapeHtml(safeSession.table || getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${escapeHtml(prettyLabel(day))}</span>
          </div>
        </div>

        <div class="pdmWheelArea">
          <div class="pdmPointer"></div>

          <div class="pdmWheelWrap">
            <div class="pdmWheel" data-wheel>
              ${safeSession.segments.map((label, index) => `
                <div class="pdmWheel__segment" style="transform:rotate(${index * 30}deg);">
                  <div class="pdmWheel__segmentText">${escapeHtml(label)}</div>
                </div>
              `).join("")}
            </div>

            <div class="pdmWheelMiddle">
              <div class="pdmBottleReal${hasWinner ? "" : ""}" data-bottle></div>
            </div>

            <div class="pdmResultOverlay${hasWinner ? " is-visible" : ""}" data-result-overlay>
              <div class="pdmResultOverlay__label">Tonight's Result</div>
              <div class="pdmResultOverlay__reward" data-result-reward>${escapeHtml(hasWinner ? safeSession.reward : "")}</div>
              <div class="pdmResultOverlay__code" data-result-code>${escapeHtml(hasWinner ? safeSession.code : "")}</div>
            </div>
          </div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--gold" type="button" data-spin-now ${hasWinner ? "disabled" : ""}>Spin Now</button>
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-start-over>${hasWinner ? "New Guest" : "Start Over"}</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>

        <div class="staffBox">
          <div class="staffState">${hasWinner ? "Result saved." : "One spin per guest entry."}</div>
        </div>
      </div>
    `;

    const wheel = panel.querySelector("[data-wheel]");
    const bottle = panel.querySelector("[data-bottle]");
    const resultOverlay = panel.querySelector("[data-result-overlay]");
    const resultReward = panel.querySelector("[data-result-reward]");
    const resultCode = panel.querySelector("[data-result-code]");
    const spinButton = panel.querySelector("[data-spin-now]");
    const stateBox = panel.querySelector(".staffState");

    if (hasWinner && wheel && typeof safeSession.finalRotation === "number") {
      wheel.style.transition = "none";
      wheel.style.transform = `rotate(${safeSession.finalRotation}deg)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wheel.style.transition = "transform 4.7s cubic-bezier(.12,.8,.18,1)";
        });
      });
    }

    panel.querySelector("[data-back-top]").addEventListener("click", jumpToTopInstant);

    panel.querySelector("[data-start-over]").addEventListener("click", () => {
      clearSession(day);
      renderEntryScreen(panel, day, true);

      setTimeout(() => {
        jumpToElementInstant(panel, 8);
      }, 20);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    spinButton.addEventListener("click", async () => {
      const current = readSession(day) || safeSession;

      if (typeof current.selectedIndex === "number") {
        return;
      }

      const selectedIndex = getRandomSegmentIndex();
      const segmentCount = current.segments.length;
      const segmentAngle = 360 / segmentCount;
      const targetCenterAngle = (selectedIndex * segmentAngle) + (segmentAngle / 2);
      const finalRotation = (360 * 6) + (360 - targetCenterAngle);

      current.finalRotation = finalRotation;

      spinButton.disabled = true;
      stateBox.textContent = "Spinning...";

      if (bottle) {
        bottle.classList.remove("is-spinning");
        void bottle.offsetWidth;
        bottle.classList.add("is-spinning");
      }

      if (wheel) {
        wheel.style.transform = `rotate(${finalRotation}deg)`;
      }

      setTimeout(async () => {
        current.selectedIndex = selectedIndex;
        current.reward = current.segments[selectedIndex];
        current.boxNumber = selectedIndex + 1;
        current.code = createRewardCode(day, selectedIndex);
        current.timestamp = new Date().toISOString();
        current.createdAt = current.timestamp;
        current.stage = "winner";

        saveSession(day, current);

        const leadPayload = {
          date: current.date || getTodayKey(),
          createdAt: current.createdAt,
          day: current.day || day,
          table: current.table || getTableLabel(),
          entryType: current.entryType || "phone",
          phone: current.phone || "",
          reward: current.reward || "",
          boxNumber: current.boxNumber || "",
          code: current.code || ""
        };

        saveLead(leadPayload);

        const sheetResult = await sendLeadToGoogleSheet(leadPayload);

        if (resultReward) {
          resultReward.textContent = current.reward;
        }

        if (resultCode) {
          resultCode.textContent = current.code;
        }

        if (resultOverlay) {
          resultOverlay.classList.add("is-visible");
        }

        stateBox.textContent = sheetResult.ok
          ? "Result saved to Google Sheet."
          : "Result saved locally. Google Sheet sync failed.";
      }, 4700);
    });
  }

  /* =========================
     IDLE PANEL
  ========================= */

  function renderIdleState(panel, day) {
    setGameState(panel, false);

    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${escapeHtml(prettyLabel(day))} Menu</div>
        <div class="menuStart__text">
          Select a category to view menu items, play Pour Decision Maker, or open the manager dashboard.
        </div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" type="button" data-start-game>Play Pour Decision Maker</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-food>Open Food Menu</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-dashboard>Dashboard</button>
        </div>
        <div class="menuStartMeta">
          Entry saves to Google Sheet and local browser backup.
        </div>
      </div>
    `;

    const wrap = panel.closest(".menuCenterWrap");

    panel.querySelector("[data-start-game]").addEventListener("click", () => {
      renderEntryScreen(panel, day, true);

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
      setGameState(panel, false);

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

    function activateGame(button, forceFresh = false) {
      clearActive();
      button.classList.add("active");
      renderEntryScreen(panel, day, forceFresh);

      setTimeout(() => {
        const target = panel.querySelector(".pdmEntry") || panel;
        jumpToElementInstant(target, 8);
      }, 20);
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "game") {
          activateGame(button, false);
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
     HERO -> OPEN REAL GAME
  ========================= */

  function jumpToActiveGamePanel() {
    let activeDayPanel = document.querySelector(".dayPanel.active");

    if (!activeDayPanel) {
      activateDay(hasTodayTab ? today : fallbackDay);
      activeDayPanel = document.querySelector(".dayPanel.active");
    }

    if (!activeDayPanel) return;

    const gameButton = activeDayPanel.querySelector('.menuCenterBtn[data-action="game"]');
    const panel = activeDayPanel.querySelector(".menuPanelBody");

    if (!gameButton || !panel) return;

    gameButton.classList.add("active");
    renderEntryScreen(panel, activeDayPanel.dataset.daypanel || "monday", true);

    setTimeout(() => {
      const target = panel.querySelector(".pdmEntry") || panel;
      jumpToElementInstant(target, 8);
    }, 40);
  }

  document.querySelectorAll("[data-open-game]").forEach(button => {
    button.addEventListener("click", jumpToActiveGamePanel);
  });

  activateDay(hasTodayTab ? today : fallbackDay);

  window.addEventListener("resize", () => {
    const activePanel = document.querySelector(".dayPanel.active .menuPanelBody");
    if (!activePanel) return;

    const activeDay = document.querySelector(".dayPanel.active")?.dataset.daypanel || fallbackDay;
    const activeWrap = activePanel.closest(".menuCenterWrap");

    if (activeWrap?.classList.contains("is-game-active")) {
      const session = readSession(activeDay);
      if (session) {
        renderWheelScreen(activePanel, activeDay, session);
      }
    }
  });
});