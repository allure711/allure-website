// Day tabs (Monday/Tuesday/etc)
document.querySelectorAll(".daytab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const day = btn.dataset.day;

    document.querySelectorAll(".daytab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".daypanel").forEach(p => p.classList.remove("active"));
    const panel = document.querySelector(`.daypanel[data-day-panel="${day}"]`);
    if (panel) panel.classList.add("active");
  });
});

// Main accordions (Happy Hour / After 9PM)
document.querySelectorAll(".accordionMain").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const arrow = btn.querySelector(".arrow");
    const open = content.style.display === "block";

    content.style.display = open ? "none" : "block";
    arrow.textContent = open ? "+" : "−";
  });
});

// Sub accordions ($5 Shots / Food / Bottles / etc)
document.querySelectorAll(".accordionSub").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const arrow = btn.querySelector(".arrow");
    const open = content.style.display === "block";

    content.style.display = open ? "none" : "block";
    arrow.textContent = open ? "+" : "−";
  });
});