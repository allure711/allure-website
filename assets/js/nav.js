<script>
  // Spirits tier system + spirit-category tabs (scoped per hhSpiritsCard)
  document.addEventListener("click", function (e) {

    // ===== Tier Buttons ($5 / $10 / Cocktails) =====
    const tierBtn = e.target.closest(".tierBtn");
    if (tierBtn) {
      const card = tierBtn.closest(".hhSpiritsCard");
      if (!card) return;

      card.querySelectorAll(".tierBtn").forEach(b => b.classList.remove("active"));
      tierBtn.classList.add("active");

      const spiritsWrap = card.querySelector(".spiritsWrap");
      const cocktailsWrap = card.querySelector(".cocktailsWrap");

      if (tierBtn.dataset.tier === "cocktails10") {
        spiritsWrap.classList.add("hidden");
        cocktailsWrap.classList.remove("hidden");
        return;
      }

      // For $5 shots or $10 drinks:
      cocktailsWrap.classList.add("hidden");
      spiritsWrap.classList.remove("hidden");

      // Update all spirit prices
      const price = (tierBtn.dataset.tier === "drinks10") ? "$10" : "$5";
      card.querySelectorAll(".jsSpiritPrice").forEach(p => p.textContent = price);

      // IMPORTANT: when switching tier, hide all spirit panels until a category is clicked
      card.querySelectorAll(".spiritPanel").forEach(p => p.classList.add("hidden"));
      card.querySelectorAll(".spiritBtn").forEach(b => b.classList.remove("active"));
      return;
    }

    // ===== Spirit Category Buttons (Vodka/Tequila/etc) =====
    const spiritBtn = e.target.closest(".spiritBtn");
    if (spiritBtn) {
      const card = spiritBtn.closest(".hhSpiritsCard");
      if (!card) return;

      const spiritsWrap = card.querySelector(".spiritsWrap");
      const cocktailsWrap = card.querySelector(".cocktailsWrap");

      // Make sure spirits are visible (and cocktails hidden)
      cocktailsWrap.classList.add("hidden");
      spiritsWrap.classList.remove("hidden");

      // Activate button
      card.querySelectorAll(".spiritBtn").forEach(b => b.classList.remove("active"));
      spiritBtn.classList.add("active");

      // Show only the matching panel
      const target = spiritBtn.dataset.spirit;
      card.querySelectorAll(".spiritPanel").forEach(p => {
        p.classList.toggle("hidden", p.dataset.panel !== target);
      });
    }
  });
</script>