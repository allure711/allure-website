/* =========================
   Menu Page JS (FINAL VIP)
   - Day tabs
   - Category click
   - Bottle pills
   - Scroll fade
   - Gold confetti sparkles
   - LIMITED TABLES rules
   ========================= */

/* --- YOUR MENU_DATA MUST REMAIN ABOVE THIS FILE OR INSIDE THIS FILE --- */
/* Keep your existing MENU_DATA object exactly as you already have it. */

function el(html){
  const d = document.createElement("div");
  d.innerHTML = html.trim();
  return d.firstElementChild;
}

/* ---------- Render category ---------- */
function renderCategory(scopeKey, catKey){
  const target = document.querySelector(`[data-scopebody="${scopeKey}"]`);
  if(!target) return;

  const data = MENU_DATA?.[scopeKey]?.[catKey];
  if(!data){
    target.innerHTML = `<div class="muted">No items yet for this category.</div>`;
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "listGrid";
  wrap.appendChild(el(`<div class="sectionHead">${data.title}</div>`));

  if(data.type === "simpleList"){
    const box = document.createElement("div");
    box.className = "colBox";
    const ul = document.createElement("ul");
    ul.className = "bullets";
    data.items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
    box.appendChild(ul);
    wrap.appendChild(box);
  }

  if(data.type === "pricedList"){
    const box = document.createElement("div");
    box.className = "colBox";
    data.items.forEach(([name, price]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
    });
    wrap.appendChild(box);
  }

  if(data.type === "cocktails"){
    const box = document.createElement("div");
    box.className = "colBox";
    data.items.forEach(([name, desc]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price"></span></div>`));
      box.appendChild(el(`<div class="muted" style="margin:-4px 0 10px 0; padding-left:6px;">${desc}</div>`));
    });
    wrap.appendChild(box);
  }

  if(data.type === "twoCols"){
    const two = document.createElement("div");
    two.className = "twoCols";
    const left = el(`<div class="colBox"><div class="colTitle">${data.leftTitle}</div></div>`);
    const right = el(`<div class="colBox"><div class="colTitle">${data.rightTitle}</div></div>`);
    const ulL = document.createElement("ul"); ulL.className = "bullets";
    const ulR = document.createElement("ul"); ulR.className = "bullets";
    (data.left||[]).forEach(i => ulL.appendChild(el(`<li>${i}</li>`)));
    (data.right||[]).forEach(i => ulR.appendChild(el(`<li>${i}</li>`)));
    left.appendChild(ulL); right.appendChild(ulR);
    two.appendChild(left); two.appendChild(right);
    wrap.appendChild(two);
  }

  if(data.type === "spiritCols"){
    const flow = document.createElement("div");
    flow.className = "twoCols";
    Object.entries(data.cols).forEach(([title, items]) => {
      const box = document.createElement("div");
      box.className = "colBox";
      box.appendChild(el(`<div class="colTitle">${title}</div>`));
      const ul = document.createElement("ul");
      ul.className = "bullets";
      items.forEach(i => ul.appendChild(el(`<li>${i}</li>`)));
      box.appendChild(ul);
      flow.appendChild(box);
    });
    wrap.appendChild(flow);
  }

  if(data.type === "foodBlock"){
    const box = document.createElement("div");
    box.className = "colBox";
    data.items.forEach(([name, price, note]) => {
      box.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
      if(note) box.appendChild(el(`<div class="muted" style="margin:-4px 0 10px 0; padding-left:6px;">${note}</div>`));
    });

    if(data.flavorsTitle){
      box.appendChild(el(`<div class="sectionHead" style="margin-top:12px;">${data.flavorsTitle}</div>`));
      const ul = document.createElement("ul");
      ul.className = "bullets";
      (data.flavors||[]).forEach(f => ul.appendChild(el(`<li>${f}</li>`)));
      box.appendChild(ul);
    }

    wrap.appendChild(box);
  }

  target.innerHTML = "";
  target.appendChild(wrap);
}

/* ---------- Category bar wiring ---------- */
function initCategoryBars(){
  document.querySelectorAll("[data-scope]").forEach(bar => {
    const scopeKey = bar.getAttribute("data-scope");
    const buttons = [...bar.querySelectorAll(".cat")];

    const activate = (btn) => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategory(scopeKey, btn.getAttribute("data-cat"));
    };

    buttons.forEach(btn => btn.addEventListener("click", () => activate(btn)));

    const first = buttons.find(b => b.classList.contains("active")) || buttons[0];
    if(first) activate(first);
  });
}

/* ---------- Day tabs wiring ---------- */
function initDayTabs(){
  const tabs = [...document.querySelectorAll(".dayTab")];
  const panels = [...document.querySelectorAll(".dayPanel")];

  tabs.forEach(t => {
    t.addEventListener("click", () => {
      const key = t.getAttribute("data-daytab");

      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");

      panels.forEach(p => p.classList.remove("active"));
      const panel = document.querySelector(`.dayPanel[data-daypanel="${key}"]`);
      if(panel) panel.classList.add("active");

      initCategoryBars();
      initReveal();     // keep reveals consistent
      applyLimitedTables(); // update tag based on time
    });
  });
}

/* ---------- Bottle pills ---------- */
function initBottlePills(){
  const pills = [...document.querySelectorAll(".pillRow .pill")];
  const list = document.getElementById("bottleList");
  if(!pills.length || !list) return;

  const data = {
    standard: [["Don Julio Blanco", "$220"],["Casamigos Reposado", "$240"],["Hennessy VS", "$220"]],
    premium: [["Don Julio 1942", "$650"],["Clase Azul", "$650"],["Hennessy XO", "$550"]],
    vip: [["Ace of Spades", "$900"],["Don Julio 1942 (VIP)", "$750"],["Clase Azul Gold", "$900"]],
  };

  const paint = (key) => {
    list.innerHTML = "";
    (data[key]||[]).forEach(([name, price]) => {
      list.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
    });
  };

  pills.forEach(p => p.addEventListener("click", () => {
    pills.forEach(x => x.classList.remove("active"));
    p.classList.add("active");
    paint(p.getAttribute("data-bottle"));
  }));

  paint("standard");
}

/* ---------- LIMITED TABLES rules ---------- */
function applyLimitedTables(){
  const now = new Date();
  const day = now.getDay();     // 0=Sun .. 6=Sat
  const hour = now.getHours();  // 0-23

  const showThursday = (day === 4 && hour >= 21); // Thu 9PM+
  const showSaturday = (day === 6 && hour >= 22); // Sat 10PM+
  const showSunday   = (day === 0 && hour >= 22); // Sun 10PM+

  document.querySelectorAll("[data-limited-tag]").forEach(tag => {
    const key = tag.getAttribute("data-limited-tag");

    let show = false;
    if(key === "thursday") show = showThursday;
    if(key === "saturday") show = showSaturday;
    if(key === "sunday") show = showSunday;

    tag.style.display = show ? "inline-flex" : "none";
  });
}

/* ---------- Scroll-trigger fade ---------- */
let revealObserver = null;
function initReveal(){
  if(revealObserver) revealObserver.disconnect();

  const items = document.querySelectorAll(".reveal");
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("is-in");
    });
  }, { threshold: 0.12 });

  items.forEach(el => revealObserver.observe(el));
}

/* ---------- Gold confetti sparkles on scroll ---------- */
let lastSparkle = 0;
function spawnSparkles(count = 4){
  const w = window.innerWidth;
  const h = window.innerHeight;

  for(let i=0;i<count;i++){
    const s = document.createElement("span");
    s.className = "sparkle";

    const x = Math.random() * w;
    const y = Math.random() * (h * 0.35);

    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", (Math.random()*140 - 70) + "px");
    s.style.setProperty("--dy", (Math.random()*200 + 100) + "px");

    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove(), { once:true });
  }
}

window.addEventListener("scroll", () => {
  const now = performance.now();
  if(now - lastSparkle < 220) return;
  lastSparkle = now;
  spawnSparkles(4);
}, { passive:true });

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initDayTabs();
  initCategoryBars();
  initBottlePills();
  initReveal();
  applyLimitedTables();
  setInterval(applyLimitedTables, 60000);
});