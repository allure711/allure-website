
  function renderGroupedMenu(section) {
    const groups = section.groups || [];

    return `
      <div class="menuGrouped">

        <div class="menuGrouped__grid">
          ${groups.map(group => `
            <div class="menuGrouped__box">
@@ -58,6 +58,7 @@ document.addEventListener("DOMContentLoaded", () => {

    return (items || []).map(item => {
      const rawPrice = String(item.price || "");

      if (!rawPrice.includes("/")) return item;

      const parts = rawPrice.split("/").map(p => p.trim());
@@ -76,11 +77,15 @@ document.addEventListener("DOMContentLoaded", () => {

  function renderSectionedMenu(content) {
    const sections = content.sections || [];

    return `
      <div class="menuNested">
        <div class="menuSubTabs">
          ${sections.map((section, index) => `
            <button
              class="menuSubTab ${index === 0 ? "active" : ""}"
              type="button"
              data-subsection-index="${index}">
              ${section.title}
            </button>
          `).join("")}
@@ -113,6 +118,19 @@ document.addEventListener("DOMContentLoaded", () => {
    hero.after(section);
  }

  function updateLiveIndicator(day) {
    const liveTitle = document.getElementById("liveTitle");
    const liveTags = document.getElementById("liveTags");
    const info = ALLURE_LIVE_STATUS[day];

    if (!liveTitle || !liveTags || !info) return;

    liveTitle.textContent = info.title || "Live Tonight";
    liveTags.innerHTML = (info.tags || [])
      .map(tag => `<span class="liveTag">${tag}</span>`)
      .join("");
  }

  function renderVipNightBanner(day, panel) {
    panel.querySelectorAll(".vipNightBannerFloating").forEach(node => node.remove());

@@ -132,42 +150,34 @@ document.addEventListener("DOMContentLoaded", () => {
    hero.after(section);
  }


function bindSubTabs(panelBody, content, mode = null) {
    const tabs = [...panelBody.querySelectorAll(".menuSubTab")];
    const subBody = panelBody.querySelector(".menuSubBody");
    const sections = content.sections || [];

    if (!tabs.length || !subBody || !sections.length) return;

    function activateSubsection(index) {
      tabs.forEach(tab => {
        tab.classList.toggle("active", Number(tab.dataset.subsectionIndex) === index);
      });

      const section = sections[index];
      if (!section) return;

      if (section.layout === "grouped") {
        const isBare = ["Wings", "Wing Flavors"].includes(section.title || "");

        subBody.innerHTML = `
          <div class="menuSectionBlock ${isBare ? "menuSectionBlock--bare" : ""}">
            ${renderGroupedMenu(section)}
          </div>
        `;
        return;
      }

      const items = mapItemsForMode(section.items || [], mode);

      subBody.innerHTML = `
        <div class="menuSectionBlock">
          ${renderFlatMenu(items)}
@@ -177,11 +187,11 @@ document.addEventListener("DOMContentLoaded", () => {

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateSubsection(Number(tab.dataset.subsectionIndex));
      });
    });

    activateSubsection(0);
  }

  function applyVipNightMode(day) {
@@ -279,7 +289,7 @@ document.addEventListener("DOMContentLoaded", () => {
  }

  function getTodayDay() {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
  }

@@ -292,4 +302,4 @@ document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".dayTab")) {
    activateDay(getTodayDay());
  }
});
