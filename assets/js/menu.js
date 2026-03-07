/* =========================
   Menu Page JS
   ========================= */

const PHONE = "+12025550123";

/* =========================
   DAY PROMOS
   ========================= */

const DAY_PROMOS = {
  monday: {
    title: "FREE HOOKAH MONDAY",
    text: "Tap a category to explore tonight’s menu."
  },
  tuesday: {
    title: "TACO TUESDAY",
    text: "Tap a category to explore tacos, drinks, and bottles."
  },
  wednesday: {
    title: "MIDWEEK WEDNESDAY",
    text: "Tap a category to explore tonight’s specials."
  },
  thursday: {
    title: "KARAOKE THURSDAY",
    text: "Tap a category to explore the karaoke night menu."
  },
  friday: {
    title: "ALLURE FRIDAY",
    text: "Tap a category to explore the Friday experience."
  },
  saturday: {
    title: "ALLURE SATURDAY",
    text: "Tap a category to explore Saturday night specials."
  },
  sunday: {
    title: "SOCIAL SUNDAY",
    text: "Tap a category to explore Sunday food and drinks."
  }
};

/* =========================
   HELPERS
   ========================= */

function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

/* =========================
   CLOSED STATE (PROMO BOX)
   ========================= */

function setClosedState(root = document) {

  const activePanel =
    root.querySelector(".dayPanel.active") ||
    document.querySelector(".dayPanel.active");

  let day = "monday";

  if (activePanel) {
    day = activePanel.getAttribute("data-daypanel") || "monday";
  }

  const promo = DAY_PROMOS[day] || DAY_PROMOS.monday;

  root.querySelectorAll("[data-scopebody]").forEach((body) => {

    body.innerHTML = `
      <div class="menuPromo">
        <div class="menuPromoIcon">✨</div>
        <div class="menuPromoTitle">${promo.title}</div>
        <div class="menuPromoText">${promo.text}</div>
      </div>
    `;

  });

  root.querySelectorAll("[data-scope]").forEach((bar) => {
    bar.style.display = "";
    bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
  });

  root.querySelectorAll(".focusBackBtn").forEach((b) => b.remove());

}

/* =========================
   ACCORDION
   ========================= */

function wireAccordion(container) {

  container.querySelectorAll("details.acc").forEach((details) => {

    details.addEventListener("toggle", () => {

      if (!details.open) return;

      container.querySelectorAll("details.acc").forEach((other) => {
        if (other !== details) other.open = false;
      });

    });

  });

}

/* =========================
   CATEGORY RENDER
   ========================= */

function renderCategory(scopeKey, catKey) {

  const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
  if (!target) return;

  const data = MENU_DATA?.[scopeKey]?.[catKey];

  if (!data) {
    target.innerHTML = `<div class="muted">No items yet for this category.</div>`;
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "listGrid";

  wrap.appendChild(el(`<div class="sectionHead">${data.title}</div>`));

  if (data.type === "foodBlock") {

    const outer = document.createElement("div");
    outer.className = "listGrid";

    data.sections.forEach((section) => {

      const details = document.createElement("details");
      details.className = "acc";

      const summary = document.createElement("summary");
      summary.className = "acc__summary";
      summary.textContent = section.title;

      const box = document.createElement("div");
      box.className = "colBox";

      section.items.forEach(([name, price]) => {

        box.appendChild(el(`
        <div class="itemRow">
        <span>${name}</span>
        <span class="price">${price}</span>
        </div>`));

      });

      details.appendChild(summary);
      details.appendChild(box);
      outer.appendChild(details);

    });

    wireAccordion(outer);
    wrap.appendChild(outer);

  }

  target.innerHTML = "";
  target.appendChild(wrap);

}

/* =========================
   CATEGORY CLICK
   ========================= */

function bindCategoryBarsOnce(root = document) {

  root.querySelectorAll("[data-scope]").forEach((bar) => {

    if (bar.dataset.bound === "1") return;
    bar.dataset.bound = "1";

    bar.addEventListener("click", (e) => {

      const btn = e.target.closest(".cat");
      if (!btn) return;

      const scopeKey = bar.getAttribute("data-scope");
      const catKey = btn.getAttribute("data-cat");

      bar.querySelectorAll(".cat").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      bar.style.display = "none";

      renderCategory(scopeKey, catKey);

      const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
      if (!target) return;

      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 120);

      const back = document.createElement("button");
      back.className = "backBtn focusBackBtn";
      back.textContent = "← Back to Menu";

      back.addEventListener("click", () => {

        bar.style.display = "";

        bar.querySelectorAll(".cat").forEach((b) =>
          b.classList.remove("active")
        );

        setClosedState(document);

      });

      target.prepend(back);

    });

  });

}

/* =========================
   DAY TABS
   ========================= */

function bindDayTabsOnce() {

  const tabs = [...document.querySelectorAll(".dayTab")];
  const panels = [...document.querySelectorAll(".dayPanel")];

  tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      const key = tab.getAttribute("data-daytab");

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      panels.forEach((p) => p.classList.remove("active"));

      const panel = document.querySelector(`[data-daypanel="${key}"]`);
      if (panel) panel.classList.add("active");

      setClosedState(panel);

    });

  });

}

/* =========================
   BOOT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

  bindDayTabsOnce();
  bindCategoryBarsOnce(document);

  setClosedState(document);

});