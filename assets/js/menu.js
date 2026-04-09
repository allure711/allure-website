document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};
  const STAFF_PIN = "2024";
  const LEADS_KEY = "allure_leads_v5";
  const GOOGLE_SHEET_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
  const MOBILE_BREAKPOINT = 760;

  const POINTER_ALIGNMENT_OFFSET_DEG = 0;
  const FINAL_SETTLE_OVERSHOOT_DEG = 6;
  const FINAL_SETTLE_DURATION_MS = 260;
  const WHEEL_SPIN_DURATION_MS = 4700;

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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getWheelLabelMetrics(angleDeg, wheel) {
    const size = wheel?.getBoundingClientRect().width || 370;
    const mobile = isMobileView();
    const angleRad = (angleDeg * Math.PI) / 180;

    const bottomness = (1 - Math.cos(angleRad)) / 2;
    const sideness = Math.abs(Math.sin(angleRad));

    const baseRatio = mobile ? 0.34 : 0.365;
    const bottomPull = mobile ? 0.085 : 0.10;
    const sideBoost = mobile ? 0.012 : 0.018;

    const radiusRatio = baseRatio - (bottomness * bottomPull) + (sideness * sideBoost);
    const radius = size * radiusRatio;

    const chordWidth = 2 * radius * Math.sin(Math.PI / 12);

    const width = clamp(
      chordWidth * 0.96,
      mobile ? 52 : 58,
      mobile ? 78 : 94
    );

    const fontSize = mobile ? 8 : 10;
    return { radius, width, fontSize };
  }

  function syncWheelLabels(wheel, counterRotation = 0) {
    if (!wheel) return;

    const holders = [...wheel.querySelectorAll(".pdmWheel__label")];
    const total = holders.length || WHEEL_SEGMENTS.length;
    const segmentAngle = 360 / total;

    holders.forEach((holder, index) => {
      const angleDeg = index * segmentAngle;
      const text = holder.querySelector(".pdmWheel__labelText");
      const metrics = getWheelLabelMetrics(angleDeg, wheel);

      holder.style.setProperty("--label-angle", `${angleDeg}deg`);
      holder.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;

      if (text) {
        text.style.width = `${metrics.width}px`;
        text.style.fontSize = `${metrics.fontSize}px`;
        text.style.transform =
          `translate(-50%, -50%) translateY(${-metrics.radius}px) rotate(${-angleDeg - counterRotation}deg)`;
      }
    });

    wheel.dataset.currentRotation = String(counterRotation);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function animateWheelSpin({ wheel, finalRotation, duration = WHEEL_SPIN_DURATION_MS, onUpdate, onComplete }) {
    if (!wheel) {
      if (typeof onComplete === "function") onComplete(finalRotation);
      return;
    }

    const overshootRotation = finalRotation + FINAL_SETTLE_OVERSHOOT_DEG;
    const mainDuration = Math.max(300, duration - FINAL_SETTLE_DURATION_MS);
    const settleDuration = FINAL_SETTLE_DURATION_MS;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;

      if (elapsed < mainDuration) {
        const progress = Math.min(1, elapsed / mainDuration);
        const eased = easeOutQuart(progress);
        const currentRotation = overshootRotation * eased;

        wheel.style.transform = `rotate(${currentRotation}deg)`;

        if (typeof onUpdate === "function") {
          onUpdate(currentRotation);
        }

        requestAnimationFrame(frame);
        return;
      }

      const settleElapsed = elapsed - mainDuration;
      const settleProgress = Math.min(1, settleElapsed / settleDuration);
      const settleEased = easeOutBack(settleProgress);
      const currentRotation =
        overshootRotation - (overshootRotation - finalRotation) * settleEased;

      wheel.style.transform = `rotate(${currentRotation}deg)`;

      if (typeof onUpdate === "function") {
        onUpdate(currentRotation);
      }

      if (settleProgress < 1) {
        requestAnimationFrame(frame);
      } else if (typeof onComplete === "function") {
        onComplete(finalRotation);
      }
    }

    requestAnimationFrame(frame);
  }

  function refreshVisibleWheelLabels() {
    document.querySelectorAll(".pdmWheel[data-wheel]").forEach(wheel => {
      const currentRotation = Number(wheel.dataset.currentRotation || 0);
      syncWheelLabels(wheel, currentRotation);
    });
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
            <div class="gameSub">Local browser backup, CSV export, and reset tools.</div>
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

      const rows = [["createdAt", "day", "table", "entryType", "phone", "reward", "boxNumber", "code"]];

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
        return