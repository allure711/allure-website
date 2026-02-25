(() => {
  const tabs = document.querySelectorAll(".daytab");
  const panels = document.querySelectorAll(".daypanel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      document.querySelector(`.daypanel[data-day="${tab.dataset.day}"]`)
        .classList.add("active");
    });
  });

  document.querySelectorAll(".tierChip").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".daypanel");
      parent.querySelectorAll(".tierChip")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const price = btn.dataset.tier === "shots" ? "$5" : "$10";
      parent.querySelectorAll(".jsPrice")
        .forEach(p => p.textContent = price);
    });
  });

  document.querySelectorAll(".spiritChip").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".daypanel");

      parent.querySelectorAll(".spiritChip")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      parent.querySelectorAll(".spiritList")
        .forEach(list => list.classList.remove("active"));

      parent.querySelector(
        `.spiritList[data-spirit-list="${btn.dataset.spirit}"]`
      ).classList.add("active");
    });
  });
})();