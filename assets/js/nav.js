<script>
document.addEventListener("click", function(e){
  const btn = e.target.closest(".tierBtn");
  if(!btn) return;

  const card = btn.closest(".hhSpiritsCard");
  if(!card) return;

  card.querySelectorAll(".tierBtn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const spiritsWrap = card.querySelector(".spiritsWrap");
  const cocktailsWrap = card.querySelector(".cocktailsWrap");

  if(btn.dataset.tier === "cocktails10"){
    spiritsWrap.style.display = "none";
    cocktailsWrap.style.display = "block";
    return;
  }

  spiritsWrap.style.display = "block";
  cocktailsWrap.style.display = "none";

  const price = (btn.dataset.tier === "drinks10") ? "$10" : "$5";

  card.querySelectorAll(".jsSpiritPrice").forEach(p=>{
    p.textContent = price;
  });
});
</script>