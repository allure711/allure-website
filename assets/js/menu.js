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
      return { ok: false, error: "Missing Google Apps Script web app URL" };
    }

    try {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
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
      return { ok: false, error: String(error) };
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
        <path class="pdmWheelSvg__slice" data-slice-index="${index}" d="${wedgePath}" fill="${WHEEL_COLORS[index % WHEEL_COLORS.length]}"></path>
      `);

      const dividerOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
      const dividerInner = polarToCartesian(cx, cy, innerRadius, startAngle);

      dividers.push(`
        <line class="pdmWheelSvg__divider" x1="${dividerInner.x}" y1="${dividerInner.y}" x2="${dividerOuter.x}" y2="${dividerOuter.y}"></line>
      `);

      const textPoint = polarToCartesian(cx, cy, textRadius, centerAngle);
      const lines = splitLabelIntoLines(label);
      const firstDy = lines.length === 1 ? 0 : -10;

      texts.push(`
        <g class="pdmWheelSvg__labelGroup" transform="translate(${textPoint.x} ${textPoint.y})">
          <text class="pdmWheelSvg__label" text-anchor="middle" dominant-baseline="middle" font-size="${fontSize}">
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
      <line class="pdmWheelSvg__divider"
        x1="${polarToCartesian(cx, cy, innerRadius, 360).x}"
        y1="${polarToCartesian(cx, cy, innerRadius, 360).y}"
        x2="${polarToCartesian(cx, cy, outerRadius, 360).x}"
        y2="${polarToCartesian(cx, cy, outerRadius, 360).y}">
      </line>
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
              result="goldGlow">
            </feColorMatrix>
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
    const todayKey = getTodayKey