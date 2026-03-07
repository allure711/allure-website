/* =========================
   PHASE 6 ADD-ON
   Countdown + Flyer + Bottle Modal
   Safe extension
   ========================= */

const PHASE6_FLYERS = {
  monday: [
    { badge: "Monday Special", title: "FREE HOOKAH MONDAY", meta: "Lounge vibes • cocktails • hookah", sub: "Afrobeats • R&B • Hip-Hop" },
    { badge: "VIP Tables", title: "MONDAY ALL NIGHT", meta: "Book sections early for best seating", sub: "Bottle service available" },
    { badge: "Popular", title: "LEMON DROP + HOOKAH", meta: "Perfect Monday combo", sub: "Ask about bottle packages" }
  ],
  tuesday: [
    { badge: "Tuesday Special", title: "TACO TUESDAY", meta: "Tacos • drinks • hookah", sub: "Latin • Hip-Hop • Party Mix" },
    { badge: "Popular", title: "SHRIMP TACOS + MARGARITA", meta: "Best-selling Tuesday pairing", sub: "Kitchen favorites all night" },
    { badge: "VIP Tables", title: "TURN UP YOUR TUESDAY", meta: "Bottle service available", sub: "Reserve your section now" }
  ],
  wednesday: [
    { badge: "Midweek", title: "MIDWEEK WEDNESDAY", meta: "After-work energy • lounge vibes", sub: "R&B • Amapiano" },
    { badge: "Popular", title: "RASTA PASTA + MULE", meta: "Smooth food and drink combo", sub: "Relaxed VIP mood" },
    { badge: "VIP Tables", title: "MIDWEEK LUXE", meta: "Drinks • hookah • bottles", sub: "Reserve your section" }
  ],
  thursday: [
    { badge: "Live Thursday", title: "KARAOKE THURSDAY", meta: "Mic on • drinks up", sub: "Open Mic • Party Anthems" },
    { badge: "Popular", title: "WINGS + LONG ISLAND", meta: "A Thursday crowd favorite", sub: "Late night energy" },
    { badge: "VIP Tables", title: "SING • SIP • STAY", meta: "Bottle service available", sub: "Reserve your section" }
  ],
  friday: [
    { badge: "Friday Night", title: "FRIDAY NIGHT VIP", meta: "DJ • hookah • bottles", sub: "Hip-Hop • Afrobeats" },
    { badge: "Popular", title: "HOOKAH + FISHBOWL", meta: "Friday best-sellers", sub: "Prime lounge energy" },
    { badge: "VIP Tables", title: "BOOK YOUR SECTION", meta: "High-demand seating", sub: "Bottle service available" }
  ],
  saturday: [
    { badge: "Saturday VIP", title: "SATURDAY TAKEOVER", meta: "Bottle service • DJ • prime night", sub: "Hip-Hop • Afrobeats" },
    { badge: "Popular", title: "VIP BOTTLES + HOOKAH", meta: "Peak Saturday experience", sub: "Luxury section energy" },
    { badge: "VIP Tables", title: "CELEBRATE BIG", meta: "Birthdays • sections • sparklers", sub: "Reserve early" }
  ],
  sunday: [
    { badge: "Sunday Social", title: "SOCIAL SUNDAY", meta: "Food • wine • lounge", sub: "R&B • Soul" },
    { badge: "Popular", title: "SALMON DINNER + WINE", meta: "Smooth Sunday pairing", sub: "Chill lounge energy" },
    { badge: "VIP Tables", title: "END THE WEEK RIGHT", meta: "Hookah • bottles • food", sub: "Reserve your table" }
  ]
};

const PHASE6_PACKAGES = [
  {
    tier: "Gold",
    price: "$900",
    items: ["2 premium bottles", "1 hookah", "VIP section", "Mixer package"]
  },
  {
    tier: "Platinum",
    price: "$1200",
    items: ["3 premium bottles", "2 hookahs", "VIP section", "Mixer package"]
  },
  {
    tier: "Celebration",
    price: "$1500",
    items: ["4 premium bottles", "2 hookahs", "VIP section", "Celebration setup"]
  }
];

let phase6CountdownTimer = null;
let phase6FlyerTimer = null;

function phase6GetEventHour(day) {
  if (day === "monday" || day === "sunday") return 20;
  return 21;
}

function phase6NextOccurrence(day, hour) {
  const map = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, 0, 0, 0);

  const todayIndex = now.getDay();
  const targetIndex = map[day];
  let diff = targetIndex - todayIndex;

  if (diff < 0) diff += 7;

  if (diff === 0 && target <= now) {
    diff = 7;
  }

  target.setDate(now.getDate() + diff);
  return target;
}

function phase6RenderCountdown(day) {
  const wrap = document.createElement("section");
  wrap.className = "eventCountdown";
  wrap.innerHTML = `
    <div class="eventCountdown__left">
      <div class="eventCountdown__eyebrow">Next event countdown</div>
      <div class="eventCountdown__title">${day.toUpperCase()} vibe starts soon</div>
    </div>

    <div class="eventCountdown__clock">
      <div class="countChip">
        <span class="countChip__num" data-count="d">00</span>
        <span class="countChip__label">Days</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="h">00</span>
        <span class="countChip__label">Hours</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="m">00</span>
        <span class="countChip__label">Min</span>
      </div>
      <div class="countChip">
        <span class="countChip__num" data-count="s">00</span>
        <span class="countChip__label">Sec</span>
      </div>
    </div>
  `;
  return wrap;
}

function phase6StartCountdown(day, scope) {
  if (phase6CountdownTimer) {
    clearInterval(phase6CountdownTimer);
    phase6CountdownTimer = null;
  }

  const hour = phase6GetEventHour(day);
  const target = phase6NextOccurrence(day, hour);

  const dEl = scope.querySelector('[data-count="d"]');
  const hEl = scope.querySelector('[data-count="h"]');
  const mEl = scope.querySelector('[data-count="m"]');
  const sEl = scope.querySelector('[data-count="s"]');

  function tick() {
    const now = new Date();
    let diff = Math.max(0, target.getTime() - now.getTime());

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;

    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;

    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;

    const secs = Math.floor(diff / 1000);

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(mins).padStart(2, "0");
    if (sEl) sEl.textContent = String(secs).padStart(2, "0");
  }

  tick();
  phase6CountdownTimer = setInterval(tick, 1000);
}

function phase6RenderFlyer(day) {
  const slides = PHASE6_FLYERS[day] || PHASE6_FLYERS.monday;

  const section = document.createElement("section");
  section.className = "flyerSlider";
  section.innerHTML = `
    <div class="flyerTrack"></div>
    <div class="flyerDots"></div>
  `;

  const track = section.querySelector(".flyerTrack");
  const dots = section.querySelector(".flyerDots");

  slides.forEach((slide, index) => {
    const card = document.createElement("article");
    card.className = `flyerCard${index === 0 ? " is-active" : ""}`;
    card.innerHTML = `
      <div class="flyerCard__badge">${slide.badge}</div>
      <div class="flyerCard__title">${slide.title}</div>
      <div class="flyerCard__meta">${slide.meta}</div>
      <div class="flyerCard__sub">${slide.sub}</div>
    `;
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `flyerDot${index === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dots.appendChild(dot);
  });

  return section;
}

function phase6StartFlyer(scope) {
  if (phase6FlyerTimer) {
    clearInterval(phase6FlyerTimer);
    phase6FlyerTimer = null;
  }

  const cards = [...scope.querySelectorAll(".flyerCard")];
  const dots = [...scope.querySelectorAll(".flyerDot")];
  if (!cards.length) return;

  let index = 0;

  function paint(nextIndex) {
    index = nextIndex;
    cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      paint(i);
    });
  });

  phase6FlyerTimer = setInterval(() => {
    const next = (index + 1) % cards.length;
    paint(next);
  }, 3500);
}

function phase6EnsureBottleModal() {
  if (document.querySelector(".bottleModal")) return;

  const modal = document.createElement("div");
  modal.className = "bottleModal";
  modal.innerHTML = `
    <div class="bottleModal__backdrop"></div>
    <div class="bottleModal__panel">
      <div class="bottleModal__head">
        <div class="bottleModal__title">Bottle Service</div>
        <button type="button" class="bottleModal__close" aria-label="Close">×</button>
      </div>
      <div class="bottleModal__sub">Choose a package and call to reserve your VIP section.</div>
      <div class="bottlePackages"></div>
    </div>
  `;

  const container = modal.querySelector(".bottlePackages");

  PHASE6_PACKAGES.forEach((pack) => {
    const article = document.createElement("article");
    article.className = "bottlePack";
    article.innerHTML = `
      <div class="bottlePack__tier">${pack.tier}</div>
      <div class="bottlePack__price">${pack.price}</div>
      <ul class="bottlePack__items">
        ${pack.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <a class="bottlePack__cta" href="tel:${PHONE}">Reserve / Call</a>
    `;
    container.appendChild(article);
  });

  document.body.appendChild(modal);

  const close = () => modal.classList.remove("is-open");

  modal.querySelector(".bottleModal__backdrop").addEventListener("click", close);
  modal.querySelector(".bottleModal__close").addEventListener("click", close);
}

function phase6EnsureBottleButton() {
  if (document.querySelector(".bottleServiceBtn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bottleServiceBtn";
  btn.innerHTML = `<span class="bottleServiceBtn__icon">🍾</span><span>Bottle Service</span>`;

  btn.addEventListener("click", () => {
    const modal = document.querySelector(".bottleModal");
    if (modal) modal.classList.add("is-open");
  });

  document.body.appendChild(btn);
}

function phase6Render(day) {
  const panel = document.querySelector(`.dayPanel[data-daypanel="${day}"]`);
  if (!panel) return;

  panel.querySelectorAll(".eventCountdown,.flyerSlider").forEach((node) => node.remove());

  const insertAfter = panel.querySelector(".popularTonight") || panel.querySelector(".vipNightBanner") || panel.querySelector(".heroRow");
  if (!insertAfter) return;

  const countdown = phase6RenderCountdown(day);
  const flyer = phase6RenderFlyer(day);

  insertAfter.after(countdown);
  countdown.after(flyer);

  phase6StartCountdown(day, countdown);
  phase6StartFlyer(flyer);
}

(function phase6PatchActivateDay() {
  const originalActivateDay = activateDay;
  activateDay = function(day) {
    originalActivateDay(day);
    phase6Render(day);
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  phase6EnsureBottleModal();
  phase6EnsureBottleButton();
});