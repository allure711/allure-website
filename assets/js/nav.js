document.addEventListener("click", function(e){

  /* ===== BASIC ===== */
  const tierBtn = e.target.closest(".jsTierBtn");
  const spiritBtn = e.target.closest(".jsSpiritBtn");
  const cocktailBtn = e.target.closest(".jsCocktailBtn");
  const basicCard = document.querySelector('[data-card="basic"]');

  if(tierBtn){
    const price = tierBtn.dataset.tier;
    basicCard.querySelector(".spiritTabs").classList.remove("hidden");
    basicCard.querySelectorAll(".jsPrice").forEach(p=>{
      p.innerText = "$" + price;
    });
  }

  if(spiritBtn){
    const spirit = spiritBtn.dataset.spirit;
    basicCard.querySelectorAll(".spiritPanel").forEach(p=>p.classList.add("hidden"));
    basicCard.querySelector('[data-panel="'+spirit+'"]').classList.remove("hidden");
  }

  if(cocktailBtn){
    basicCard.querySelectorAll(".spiritPanel").forEach(p=>p.classList.add("hidden"));
    document.getElementById("cocktailPanel").classList.remove("hidden");
  }

  /* ===== TOP SHELF ===== */
  const topTierBtn = e.target.closest(".jsTopTierBtn");
  const topSpiritBtn = e.target.closest(".jsTopSpiritBtn");
  const topCard = document.querySelector('[data-card="topshelf"]');

  if(topTierBtn){
    const price = topTierBtn.dataset.tier;
    topCard.querySelector(".spiritTabs").classList.remove("hidden");
    topCard.querySelectorAll(".jsTopPrice").forEach(p=>{
      p.innerText = "$" + price;
    });
  }

  if(topSpiritBtn){
    const spirit = topSpiritBtn.dataset.spirit;
    topCard.querySelectorAll(".spiritPanel").forEach(p=>p.classList.add("hidden"));
    topCard.querySelector('[data-top-panel="'+spirit+'"]').classList.remove("hidden");
  }

});


/* Auto open defaults */
window.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector('.jsTierBtn[data-tier="5"]').click();
  document.querySelector('.jsTopTierBtn[data-tier="7"]').click();
});
