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
  const WINNER_GLOW_DURATION_MS = 1600;

  const WHEEL_SEGMENTS = [
    "Free Shot",
    "$5 Hookah",
    "Free Mixer",
    "$3 Fishbowl",
    "Bonus Spin",
    "Hookah Upgrade",
    "Lucky Deal",
    "VIP Access",
    "House Pick",
    "Try Again",
    "$10 Bottle",
    "Group Shot"
  ];

  const WHEEL_COLORS = [
    "#d7b46a",
    "#171720",
    "#a25af5",
    "#101017",
    "#f2d38a",
    "#171720",
    "#ff5edb",
    "#101017",
    "#d7b46a",
    "#15151c",
    "#f2d38a",
    "#171720"
  ];

  let audioContext = null;
  let lastTickStep = -1;
  let pointerBounceLock = false;

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

  function ensureAudioContext() {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  }

  function playWheelTick(strength = 1) {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const volume = Math.max(0.018, Math.min(0.055, 0.022 + strength * 0.02));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(1800 + strength * 550, now);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200 + strength * 500, now);
    filter.Q.setValueAtTime(1.3, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.042);
  }

  function bouncePointer(pointer, strength = 0.5) {
    if (!pointer || pointerBounceLock) return;

    pointerBounceLock = true;

    const angleA = -(4 + strength * 4);
    const angleB = 2 + strength * 2.5;

    pointer.animate(
      [
        { transform: "translateX(-50%) rotate(0deg)" },
        { transform: `translateX(-50%) rotate(${angleA}deg)`, offset: 0.35 },
        { transform: `translateX(-50%) rotate(${angleB}deg)`, offset: 0.72 },
        { transform: "translateX(-50%) rotate(0deg)" }
      ],
      {
        duration: 120 + strength * 45,
        easing: "cubic-bezier(.2,.9,.2,1)"
      }
    );

    setTimeout(() => {
      pointerBounceLock = false;
    }, 180);
  }

  function resetWheelTickState() {
    lastTickStep = -1;
    pointerBounceLock = false;
  }

  function handleWheelTicks(currentRotation, totalSegments, pointer) {
    const segmentAngle = 360 / totalSegments;
    const currentStep = Math.floor(currentRotation / segmentAngle);

    if (lastTickStep === -1) {
      lastTickStep = currentStep;
      return;
    }

    if (currentStep <= lastTickStep) return;

    for (let step = lastTickStep + 1; step <= currentStep; step++) {
      const progressFactor = Math.min(1, step / (totalSegments * 6));
      const endStrength = Math.max(0, (progressFactor - 0.7) / 0.3);
      playWheelTick(endStrength);
      bouncePointer(pointer, endStrength);
    }

    lastTickStep = currentStep;
  }

  function polarToCartesian(cx, cy, radius, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad)
    };
  }

  function buildWedgePath(cx, cy, rOuter, rInner, startAngle, endAngle) {
    const outerStart = polarToCartesian(cx, cy, rOuter, startAngle);
    const outerEnd = polarToCartesian(cx, cy, rOuter, endAngle);
    const innerEnd = polarToCartesian(cx, cy, rInner, endAngle);
    const innerStart = polarToCartesian(cx, cy, rInner, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
      "Z"
    ].join(" ");
  }

  function splitLabelIntoLines(label) {
    const words = String(label || "").split(" ");
    if (words.length <= 1) return [label];
    if (words.length === 2) return [words[0], words[1]];
    const midpoint = Math.ceil(words.length / 2);
    return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
  }

  function buildWheelSvg(segments) {
    const mobile = isMobileView();
    const size = 600;
    const cx = 300;
    const cy = 300;
    const outerRadius = 275;
    const innerRadius = mobile ? 94 : 102;
    const textRadius = mobile ? 182 : 192;
    const fontSize = mobile ? 18 : 20;
    const segmentAngle = 360 / segments.length;

    const wedges = [];
    const dividers = [];
    const texts = [];

    segments.forEach((label, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const centerAngle = startAngle + segmentAngle / 2;
      const wedgePath = buildWedgePath(cx, cy, outerRadius, innerRadius, startAngle, endAngle);

      wedges.push(`
        <path
          class="pdmWheelSvg__slice"
          data-slice-index="${index}"
          d="${wedgePath}"
          fill="${WHEEL_COLORS[index % WHEEL_COLORS.length]}"
        ></path>
      `);

      const dividerOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
      const dividerInner = polarToCartesian(cx, cy, innerRadius, startAngle);

      dividers.push(`
        <line
          class="pdmWheelSvg__divider"
          x1="${dividerInner.x}"
          y1="${dividerInner.y}"
          x2="${dividerOuter.x}"
          y2="${dividerOuter.y}"
        ></line>
      `);

      const textPoint = polarToCartesian(cx, cy, textRadius, centerAngle);
      const lines = splitLabelIntoLines(label);
      const firstDy = lines.length === 1 ? 0 : -10;

      texts.push(`
        <g
          class="pdmWheelSvg__labelGroup"
          transform="translate(${textPoint.x} ${textPoint.y})"
        >
          <text
            class="pdmWheelSvg__label"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="${fontSize}"
          >
            ${lines.map((line, lineIndex) => `
              <tspan x="0" dy="${lineIndex === 0 ? firstDy : 22}">
                ${escapeHtml(line)}
              </tspan>
            `).join("")}
          </text>
        </g>
      `);
    });

    dividers.push(`
      <line
        class="pdmWheelSvg__divider"
        x1="${polarToCartesian(cx, cy, innerRadius, 360).x}"
        y1="${polarToCartesian(cx, cy, innerRadius, 360).y}"
        x2="${polarToCartesian(cx, cy, outerRadius, 360).x}"
        y2="${polarToCartesian(cx, cy, outerRadius, 360).y}"
      ></line>
    `);

    return `
      <svg class="pdmWheelSvg" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <defs>
          <filter id="pdmWinnerGlowFilter" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 0.84 0 0 0
                0 0 0.45 0 0
                0 0 0 1 0
              "
              result="goldGlow"
            ></feColorMatrix>
            <feMerge>
              <feMergeNode in="goldGlow"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>

        <circle class="pdmWheelSvg__outerRing" cx="${cx}" cy="${cy}" r="${outerRadius + 9}"></circle>
        <circle class="pdmWheelSvg__rimInner" cx="${cx}" cy="${cy}" r="${outerRadius - 6}"></circle>
        ${wedges.join("")}
        ${dividers.join("")}
        ${texts.join("")}
        <circle class="pdmWheelSvg__hubRing" cx="${cx}" cy="${cy}" r="${innerRadius + 8}"></circle>
        <circle class="pdmWheelSvg__hubCore" cx="${cx}" cy="${cy}" r="${innerRadius - 6}"></circle>
      </svg>
    `;
  }

  function triggerWinnerGlow(wheel, selectedIndex) {
    const slice = wheel?.querySelector(`.pdmWheelSvg__slice[data-slice-index="${selectedIndex}"]`);
    if (!slice) return;

    slice.classList.add("is-winner");
    setTimeout(() => {
      slice.classList.remove("is-winner");
    }, WINNER_GLOW_DURATION_MS);
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
        return;
      }

      const rows = [["createdAt", "day", "table", "entryType", "phone", "reward", "boxNumber", "code"]];

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
    panel.querySelector("[data-back-idle]").addEventListener("click", () => renderIdleState(panel, day));
  }

  function renderEntryScreen(panel, day, forceFresh = false) {
    setGameState(panel, true);

    const existing = readSession(day);

    if (!forceFresh && existing) {
      if (existing.stage === "winner" && typeof existing.selectedIndex === "number") {
        renderWinnerScreen(panel, day, existing);
        return;
      }

      if (existing.stage === "wheel" && existing.phone) {
        renderWheelScreen(panel, day, existing);
        return;
      }
    }

    panel.innerHTML = `
      <div class="pdmEntry">
        <div class="pdmEntry__eyebrow">Exclusive Tonight</div>
        <h3 class="pdmEntry__title">Unlock your spin and reveal tonight’s reward.</h3>
        <p class="pdmEntry__text">Enter your phone number, unlock the wheel, and reveal what your table gets tonight.</p>

        <div class="staffBox">
          <div class="pdmEntry__form">
            <input class="staffInput pdmEntry__input" type="tel" placeholder="Phone number" data-phone-input>
            <button class="gameBtn gameBtn--gold pdmEntry__submit" type="button" data-entry-continue>Unlock My Spin</button>
          </div>
          <div class="staffState">Enter a valid phone number to continue.</div>
        </div>

        <div class="gameHint">Fast entry. One spin. One reward. Redeem tonight.</div>

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
    panel.querySelector("[data-back-idle]").addEventListener("click", () => renderIdleState(panel, day));
    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => renderDashboard(panel, day));
  }

  function renderWheelScreen(panel, day, session) {
    setGameState(panel, true);

    const safeSession = readSession(day) || session;

    panel.innerHTML = `

          <div class="gameBadgeRow">
            <span class="gameBadge">Table: ${escapeHtml(safeSession.table || getTableLabel())}</span>
            <span class="gameBadge gameBadge--gold">${escapeHtml(prettyLabel(day))}</span>
          </div>
        </div>
        <div class="gameClean">
           <h2>SPIN THE WHEEL</h2>
           </div>

        <div class="pdmWheelArea">
          <div class="pdmPointer"></div>

          <div class="pdmWheelWrap">
            <div class="pdmWheel" data-wheel>
              ${buildWheelSvg(safeSession.segments)}
            </div>

            <div class="pdmWheelCenterBadge">
              <div class="pdmWheelCenterBadge__top">ALLURE</div>
              <div class="pdmWheelCenterBadge__main" data-wheel-winner>REVEAL</div>
              <div class="pdmWheelCenterBadge__bottom">Tonight only</div>
            </div>
          </div>
        </div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--gold" type="button" data-spin-now>Reveal My Reward</button>
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-start-over>Start Over</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Manager Dashboard</button>
        </div>

    const shell = panel.querySelector(".pdmWheelShell");
    const wheel = panel.querySelector("[data-wheel]");
    const winnerText = panel.querySelector("[data-wheel-winner]");
    const spinButton = panel.querySelector("[data-spin-now]");
    const stateBox = panel.querySelector(".staffState");
    const pointer = panel.querySelector(".pdmPointer");

    if (wheel) {
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";
    }

    panel.querySelector("[data-back-top]").addEventListener("click", jumpToTopInstant);

    panel.querySelector("[data-start-over]").addEventListener("click", () => {
      clearSession(day);
      renderEntryScreen(panel, day, true);
      setTimeout(() => jumpToElementInstant(panel, 8), 20);
    });

    panel.querySelector("[data-open-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    spinButton.addEventListener("click", async () => {
      ensureAudioContext();
      resetWheelTickState();

      const current = readSession(day) || safeSession;
      const selectedIndex = getRandomSegmentIndex();
      const segmentCount = current.segments.length;
      const segmentAngle = 360 / segmentCount;

      const selectedCenterAngle = selectedIndex * segmentAngle + segmentAngle / 2;
      const normalizedStopRotation =
        (360 - selectedCenterAngle + POINTER_ALIGNMENT_OFFSET_DEG) % 360;
      const finalRotation = 360 * 6 + normalizedStopRotation;

      spinButton.disabled = true;
      stateBox.textContent = "Spinning...";
      if (winnerText) winnerText.textContent = "SPINNING";

      if (shell) {
        shell.classList.add("is-spinning");
      }

      if (wheel) {
        wheel.style.transition = "none";
        wheel.style.transform = "rotate(0deg)";
        wheel.offsetHeight;
        wheel.style.transition = `transform ${WHEEL_SPIN_DURATION_MS}ms cubic-bezier(.12,.8,.18,1)`;
        wheel.style.transform = `rotate(${finalRotation}deg)`;
      }

      let tickRotation = 0;
      const tickTimer = setInterval(() => {
        tickRotation += 18;
        handleWheelTicks(tickRotation, segmentCount, pointer);
      }, 70);

      setTimeout(async () => {
        clearInterval(tickTimer);

        if (wheel) {
          wheel.style.transition = `transform ${FINAL_SETTLE_DURATION_MS}ms cubic-bezier(.2,.9,.2,1)`;
          wheel.style.transform = `rotate(${finalRotation + FINAL_SETTLE_OVERSHOOT_DEG}deg)`;

          setTimeout(() => {
            wheel.style.transition = `transform ${FINAL_SETTLE_DURATION_MS}ms cubic-bezier(.2,.9,.2,1)`;
            wheel.style.transform = `rotate(${finalRotation}deg)`;
          }, FINAL_SETTLE_DURATION_MS);
        }

        playWheelTick(1);
        bouncePointer(pointer, 1);
        triggerWinnerGlow(wheel, selectedIndex);

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
        await sendLeadToGoogleSheet(leadPayload);

        setTimeout(() => {
          if (shell) shell.classList.remove("is-spinning");
          if (winnerText) winnerText.textContent = current.reward;

          stateBox.textContent = "Reward revealed.";
          renderWinnerScreen(panel, day, current);

          setTimeout(() => {
            const winnerTarget = panel.querySelector(".pdmWinner");
            jumpToElementInstant(winnerTarget || panel, 8);
          }, 20);
        }, FINAL_SETTLE_DURATION_MS + 80);
      }, WHEEL_SPIN_DURATION_MS);
    });
  }

  function renderWinnerScreen(panel, day, session) {
    setGameState(panel, true);

    const safeSession = readSession(day) || session;
    const rewardText = safeSession.reward || "Try Again";

    panel.innerHTML = `
      <div class="pdmWinner">
        <div class="pdmWinner__eyebrow">Reward Unlocked</div>
        <h3 class="pdmWinner__title">${escapeHtml(rewardText)}</h3>
        <p class="pdmWinner__text">Show this screen to staff and redeem tonight.</p>

        <div class="gameReveal">
          <div class="gameRevealLabel">Your Redemption Code</div>
          <div class="gameRevealText">${escapeHtml(safeSession.code || "")}</div>
          <div class="gameRevealCode">Table ${escapeHtml(safeSession.table || getTableLabel())} • ${escapeHtml(prettyLabel(day))}</div>
        </div>

        <div class="pdmWinnerNote">Valid for tonight’s visit only.</div>

        <div class="gameActions">
          <button class="gameBtn gameBtn--top" type="button" data-back-top>Back To Top</button>
          <button class="gameBtn gameBtn--gold" type="button" data-new-guest>New Guest</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-manager-reset>Manager Reset</button>
          <button class="gameBtn gameBtn--ghost" type="button" data-open-dashboard>Dashboard</button>
        </div>

        <div class="staffBox">
          <div class="staffRow">
            <input class="staffInput" type="password" placeholder="Manager PIN">
            <button class="gameBtn gameBtn--ghost" type="button" data-confirm-reset>Confirm Reset</button>
          </div>
          <div class="staffState">Reset clears this guest and opens a new entry screen.</div>
        </div>
      </div>
    `;

    const pinInput = panel.querySelector(".staffInput");
    const staffState = panel.querySelector(".staffState");

    panel.querySelector("[data-back-top]").addEventListener("click", jumpToTopInstant);

    panel.querySelector("[data-new-guest]").addEventListener("click", () => {
      clearSession(day);
      renderEntryScreen(panel, day, true);
      setTimeout(() => jumpToElementInstant(panel, 8), 20);
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
      renderEntryScreen(panel, day, true);
      setTimeout(() => jumpToElementInstant(panel, 8), 20);
    });
  }

  function renderIdleState(panel, day) {
    setGameState(panel, false);
    getWrapFromPanel(panel)?.classList.remove("is-menu-launch-active");
    document.body.classList.remove("is-game-direct-mode");

    panel.innerHTML = `
      <div class="menuStart">
        <div class="menuStart__title">${escapeHtml(prettyLabel(day))} Menu</div>
        <div class="menuStart__text">Select a category to view menu items, play Pour Decision Maker, or open the manager dashboard.</div>
        <div class="menuStart__actions">
          <button class="menuStartBtn menuStartBtn--gold" type="button" data-start-game>Play Pour Decision Maker</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-food>Open Food Menu</button>
          <button class="menuStartBtn menuStartBtn--ghost" type="button" data-start-dashboard>Dashboard</button>
        </div>
        <div class="menuStartMeta">Entry saves to Google Sheet and local browser backup.</div>
      </div>
    `;

    const wrap = panel.closest(".menuCenterWrap");

    panel.querySelector("[data-start-game]").addEventListener("click", () => {
      renderEntryScreen(panel, day, true);
      setTimeout(() => jumpToElementInstant(panel, 8), 20);
    });

    panel.querySelector("[data-start-dashboard]").addEventListener("click", () => {
      renderDashboard(panel, day);
    });

    panel.querySelector("[data-start-food]").addEventListener("click", () => {
      const foodButton = wrap?.querySelector('.menuCenterBtn[data-cat="food"]');
      if (foodButton) foodButton.click();
    });
  }

  function getButtons(wrap) {
    const inside = [...wrap.querySelectorAll(".menuCenterBtn")];
    const outsideWrap = wrap.parentElement?.querySelector(".outsideBottom");
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
      getWrapFromPanel(panel)?.classList.remove("is-menu-launch-active");
      document.body.classList.remove("menu-launch-fullscreen");

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
      document.body.classList.remove("menu-launch-fullscreen");
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

  function jumpToActiveGamePanel() {
  document.body.classList.add("is-game-direct-mode");
  document.body.classList.remove("menu-launch-fullscreen");
  document.body.classList.remove("is-hookah-direct-mode");

  let activeDayPanel = document.querySelector(".dayPanel.active");

  if (!activeDayPanel) {
    activateDay(hasTodayTab ? today : fallbackDay);
    activeDayPanel = document.querySelector(".dayPanel.active");
  }

  if (!activeDayPanel) return;

  const wrap = activeDayPanel.querySelector(".menuCenterWrap");
  const gameButton = activeDayPanel.querySelector('.menuCenterBtn[data-action="game"]');
  const panel = activeDayPanel.querySelector(".menuPanelBody");

  if (!wrap || !gameButton || !panel) return;

  document.querySelectorAll(".menuCenterWrap").forEach(w => {
    w.classList.remove("is-menu-launch-active");
    w.classList.remove("is-hookah-direct-open");
    w.classList.remove("is-game-direct-open");
  });

  wrap.classList.add("is-game-direct-open");

  gameButton.classList.add("active");
  renderEntryScreen(panel, activeDayPanel.dataset.daypanel || "monday", true);

  setTimeout(() => {
    const target = activeDayPanel.querySelector(".menuCenterWrap.is-game-direct-open .menuBigPanel");
    jumpToElementInstant(target || activeDayPanel, -80);
  }, 40);
}

  document.querySelectorAll("[data-open-game]").forEach(button => {
    button.addEventListener("click", jumpToActiveGamePanel);
  });

  function getMenuCategoryIcon(label) {
    const text = String(label || "").toLowerCase();

    if (text.includes("food")) return "🍽️";
    if (text.includes("hookah")) return "💨";
    if (text.includes("shot")) return "🥃";
    if (text.includes("drink")) return "🍹";
    if (text.includes("tower")) return "🏆";
    if (text.includes("fishbowl")) return "🐠";
    if (text.includes("high noon")) return "☀️";
    if (text.includes("wine")) return "🍷";
    if (text.includes("beer")) return "🍺";
    if (text.includes("non")) return "🧊";
    if (text.includes("bottle")) return "🍾";
    if (text.includes("premium")) return "💎";
    if (text.includes("decision") || text.includes("pour")) return "🎰";

    return "✨";
  }

  function openTodayMenu() {
    const dayToOpen = hasTodayTab ? today : fallbackDay;

    document.body.classList.add("menu-launch-fullscreen");
    activateDay(dayToOpen);

    setTimeout(() => {
      const activeDayPanel = document.querySelector(`.dayPanel[data-daypanel="${dayToOpen}"]`);
      if (!activeDayPanel) return;

      const wrap = activeDayPanel.querySelector(".menuCenterWrap");
      if (!wrap) return;

      const panel = wrap.querySelector(".menuPanelBody");
      if (!panel) return;

      const buttons = getButtons(wrap);
      if (!buttons.length) return;

      wrap.classList.remove("is-game-active");
      wrap.classList.add("is-menu-launch-active");
      buttons.forEach(btn => btn.classList.remove("active"));

      function closeFullMenu() {
        document.body.classList.remove("menu-launch-fullscreen");
        wrap.classList.remove("is-menu-launch-active");
        renderIdleState(panel, dayToOpen);
        jumpToTopInstant();
      }

      function renderTemuHome() {
        panel.innerHTML = `
          <div class="menuLaunchApp">
            <button class="menuAppBackBtn" type="button" data-close-full-menu>← Back To Home</button>

            <div class="menuLaunchGrid">
              ${buttons.map((button, index) => {
                const label = button.textContent.trim();
                const isAccent = button.classList.contains("menuCenterBtn--accent");
                const icon = getMenuCategoryIcon(label);

                return `
                  <button class="menuLaunchBtn ${isAccent ? "menuLaunchBtn--accent" : ""}" type="button" data-launch-index="${index}">
                    <span class="menuLaunchBtn__icon">${escapeHtml(icon)}</span>
                    <span class="menuLaunchBtn__label">${escapeHtml(label)}</span>
                    <span class="menuLaunchBtn__tap">Open</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        `;

        panel.querySelector("[data-close-full-menu]")?.addEventListener("click", closeFullMenu);

        panel.querySelectorAll("[data-launch-index]").forEach(launchBtn => {
          launchBtn.addEventListener("click", () => {
            const originalButton = buttons[Number(launchBtn.dataset.launchIndex)];
            if (!originalButton) return;
            openTemuCategory(originalButton);
          });
        });

        jumpToElementInstant(panel.closest(".menuBigPanel") || panel, 0);
      }

      function openTemuCategory(originalButton) {
        const catKey = originalButton.dataset.cat;
        const mode = originalButton.dataset.mode || "";
        const isGame = originalButton.dataset.action === "game";

        buttons.forEach(btn => btn.classList.remove("active"));
        originalButton.classList.add("active");

        if (isGame) {
          document.body.classList.remove("menu-launch-fullscreen");
          wrap.classList.remove("is-menu-launch-active");
          originalButton.click();
          return;
        }

        const baseContent = CATEGORY_CONTENT[catKey];

        if (!baseContent) {
          panel.innerHTML = `
            <div class="menuAppCategory">
              <button class="menuAppBackBtn" type="button" data-back-launch>← Back To Menu</button>
              <div class="menuEmpty">Coming soon.</div>
            </div>
          `;

          panel.querySelector("[data-back-launch]")?.addEventListener("click", renderTemuHome);
          return;
        }

        const content = getContentByMode(baseContent, mode);
        const currentLabel = originalButton.textContent.trim();

        panel.innerHTML = `
          <div class="menuAppCategory">
            <button class="menuAppBackBtn" type="button" data-back-launch>← Back To Menu</button>

            <div class="menuUberWrap">
              <button class="menuUberDropdown" type="button" data-toggle-category>
                <span>${escapeHtml(currentLabel)}</span>
                <span class="menuUberDropdown__chevron">⌄</span>
              </button>

              <div class="menuUberCategoryList" data-uber-category-list>
                ${buttons.map((button, index) => {
                  const label = button.textContent.trim();
                  const icon = getMenuCategoryIcon(label);
                  const active = button === originalButton;

                  return `
                    <button class="menuUberCategoryOption" type="button" data-uber-switch="${index}" data-active="${active}">
                      <span>${escapeHtml(icon)} ${escapeHtml(label)}</span>
                      <b>Open</b>
                    </button>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="menuAppCategory__body">
              ${renderSectionedMenu(content)}
            </div>
          </div>
        `;

        bindSubTabs(panel, content);

        panel.querySelector("[data-back-launch]")?.addEventListener("click", renderTemuHome);

        const dropdownBtn = panel.querySelector("[data-toggle-category]");
        const list = panel.querySelector("[data-uber-category-list]");

        dropdownBtn?.addEventListener("click", () => {
          dropdownBtn.classList.toggle("is-open");
          list?.classList.toggle("is-open");
        });

        panel.querySelectorAll("[data-uber-switch]").forEach(option => {
          option.addEventListener("click", () => {
            const nextButton = buttons[Number(option.dataset.uberSwitch)];
            if (!nextButton) return;
            openTemuCategory(nextButton);
          });
        });

        jumpToElementInstant(panel.closest(".menuBigPanel") || panel, 0);
      }

      renderTemuHome();
    }, 50);
  }

  document.addEventListener("click", event => {
    const openMenuButton = event.target.closest("[data-open-menu], .menuWelcomeStrip__item--clickable");

    if (!openMenuButton) return;

    event.preventDefault();
    event.stopPropagation();
    openTodayMenu();
  });
document.addEventListener("click", event => {
  const openMenuButton = event.target.closest("[data-open-menu]");

  if (!openMenuButton) return;

  event.preventDefault();
  event.stopPropagation();
  openTodayMenu();
});

  document.addEventListener("click", event => {
    const card = event.target.closest(".menuWelcomeStrip__item");
    if (!card) return;

    const text = (card.textContent || "").toLowerCase();
    if (!text.includes("free hookah monday")) return;

    event.preventDefault();
    event.stopPropagation();

    const dayToOpen = hasTodayTab ? today : fallbackDay;
    activateDay(dayToOpen);

    setTimeout(() => {
      const activeDayPanel = document.querySelector(`.dayPanel[data-daypanel="${dayToOpen}"]`);
      if (!activeDayPanel) return;

      const wrap = activeDayPanel.querySelector(".menuCenterWrap");
      if (!wrap) return;

      const hookahButton =
        activeDayPanel.querySelector('.menuCenterBtn[data-cat="hookah"]') ||
        [...activeDayPanel.querySelectorAll(".menuCenterBtn")]
          .find(btn => (btn.textContent || "").toLowerCase().includes("hookah"));

      if (!hookahButton) return;

      document.body.classList.add("is-hookah-direct-mode");
      // ADD BACK BUTTON
let backBtn = document.createElement("button");
backBtn.className = "hookahBackBtn";
backBtn.textContent = "← Back";

document.body.appendChild(backBtn);

backBtn.addEventListener("click", () => {
  document.body.classList.remove("is-hookah-direct-mode");

  const wrap = document.querySelector(".menuCenterWrap.is-hookah-direct-open");
  if (wrap) wrap.classList.remove("is-hookah-direct-open");

  backBtn.remove();

  // return to normal menu home
  window.scrollTo(0,0);
});

wrap.classList.remove("is-menu-launch-active");
wrap.classList.add("is-hookah-direct-open");

hookahButton.click();

      setTimeout(() => {
        const target =
  activeDayPanel.querySelector(".menuCenterWrap.is-hookah-direct-open .menuBigPanel") ||
  activeDayPanel.querySelector(".menuBigPanel");
        if (!target) return;

        const html = document.documentElement;
        const body = document.body;

        html.style.scrollBehavior = "auto";
        body.style.scrollBehavior = "auto";

        const header = document.querySelector(".header");
        const headerHeight = header ? header.offsetHeight : 0;

        const top =
          window.pageYOffset +
          target.getBoundingClientRect().top -
          headerHeight;

        window.scrollTo(0, Math.max(0, top));
      }, 20);
    }, 20);
  }, true);

  document.addEventListener("click", event => {
    const openMenuButton = event.target.closest("[data-open-menu], .menuWelcomeStrip__item--clickable");
    if (!openMenuButton) return;

    const text = (openMenuButton.textContent || "").toLowerCase();
    if (text.includes("free hookah monday")) return;

    event.preventDefault();
    event.stopPropagation();
    openTodayMenu();
  });

  activateDay(hasTodayTab ? today : fallbackDay);
});
