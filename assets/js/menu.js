/* =========================
   Menu System – Phase 5
   ========================= */

const PHONE = "+12025550123";

/* =========================
   DAY CONTENT
   ========================= */

const DAY_CONTENT = {

  monday:{
    promoTitle:"FREE HOOKAH MONDAY",
    promoText:"Tap a category to explore tonight’s menu.",
    bannerTitle:"MONDAY VIP EXPERIENCE",
    bannerMeta:"Free Hookah • Cocktails • Lounge Energy",
    lineup:"Afrobeats • R&B • Hip-Hop",
    badge:"MONDAY SPECIAL",
    vibe:"Free Hookah • VIP Energy • Late Night",
    popular:[
      ["Salmon Sliders","$12"],
      ["Allure Lemon Drop","$10"],
      ["Hookah","$23"],
      ["Fishbowl","$23"]
    ]
  },

  tuesday:{
    promoTitle:"TACO TUESDAY",
    promoText:"Tap a category to explore tacos and drinks.",
    bannerTitle:"TACO TUESDAY VIP",
    bannerMeta:"Tacos • Margaritas • Hookah",
    lineup:"Latin • Hip-Hop • Party Mix",
    badge:"TUESDAY SPECIAL",
    vibe:"Tacos • Margaritas • Hookah",
    popular:[
      ["Shrimp Tacos","$16"],
      ["Chicken Tacos","$14"],
      ["Cocktails","$10"],
      ["Hookah","$23"]
    ]
  },

  wednesday:{
    promoTitle:"MIDWEEK WEDNESDAY",
    promoText:"Tap a category to explore tonight’s specials.",
    bannerTitle:"MIDWEEK LUXE",
    bannerMeta:"After Work Drinks • Lounge",
    lineup:"R&B • Amapiano",
    badge:"MIDWEEK",
    vibe:"After Work Drinks",
    popular:[
      ["Rasta Pasta","$16+"],
      ["Moscow Mule","$10"],
      ["High Noon","$8"],
      ["Bottles","VIP"]
    ]
  },

  thursday:{
    promoTitle:"KARAOKE THURSDAY",
    promoText:"Tap a category to explore the karaoke menu.",
    bannerTitle:"KARAOKE NIGHT",
    bannerMeta:"Live Mic • Cocktails",
    lineup:"Open Mic • Party Anthems",
    badge:"LIVE THURSDAY",
    vibe:"Karaoke • Cocktails",
    popular:[
      ["Wings","$12+"],
      ["Long Island","$10"],
      ["Fishbowl","$23"],
      ["Bottle Service","VIP"]
    ]
  },

  friday:{
    promoTitle:"ALLURE FRIDAY",
    promoText:"Tap a category to explore tonight.",
    bannerTitle:"FRIDAY NIGHT VIP",
    bannerMeta:"DJ • VIP Sections • Hookah",
    lineup:"Hip-Hop • Afrobeats",
    badge:"FRIDAY NIGHT",
    vibe:"DJ • Bottles • Hookah",
    popular:[
      ["Bottles","VIP"],
      ["Hookah","$23"],
      ["Fishbowl","$23"],
      ["Premium Cocktails","$10+"]
    ]
  },

  saturday:{
    promoTitle:"ALLURE SATURDAY",
    promoText:"Tap a category to explore tonight.",
    bannerTitle:"SATURDAY VIP TAKEOVER",
    bannerMeta:"Bottle Service • DJ Energy",
    lineup:"Hip-Hop • Afrobeats",
    badge:"SATURDAY VIP",
    vibe:"Prime Night",
    popular:[
      ["VIP Bottles","🔥"],
      ["Hookah","$23"],
      ["Fishbowl","$23"],
      ["Clase Azul","$650"]
    ]
  },

  sunday:{
    promoTitle:"SOCIAL SUNDAY",
    promoText:"Tap a category to explore tonight.",
    bannerTitle:"SOCIAL SUNDAY",
    bannerMeta:"Relaxed Vibes • Food",
    lineup:"R&B • Soul",
    badge:"SUNDAY SOCIAL",
    vibe:"Chill Lounge",
    popular:[
      ["Salmon Dinner","$20"],
      ["Wine","$6"],
      ["Hookah","$23"],
      ["Bottles","VIP"]
    ]
  }

};


/* =========================
   UTILITIES
   ========================= */

function getDayData(day){
  return DAY_CONTENT[day] || DAY_CONTENT.monday;
}

function getToday(){

  const days=[
    "sunday","monday","tuesday",
    "wednesday","thursday",
    "friday","saturday"
  ];

  return days[new Date().getDay()];
}

/* =========================
   PROMO
   ========================= */

function getPromoMarkup(day){

const c=getDayData(day);

return `
<div class="menuPromo">
<div class="menuPromoIcon">✨</div>
<div class="menuPromoTitle">${c.promoTitle}</div>
<div class="menuPromoText">${c.promoText}</div>
</div>
`;

}


/* =========================
   VIP BANNER
   ========================= */

function renderVipBanner(day){

const c=getDayData(day);

const section=document.createElement("section");

section.className="vipNightBanner reveal";

section.innerHTML=`

<div class="vipNightBanner__badge">${c.badge}</div>
<div class="vipNightBanner__title">${c.bannerTitle}</div>
<div class="vipNightBanner__meta">${c.bannerMeta}</div>
<div class="vipNightBanner__lineup">DJ: ${c.lineup}</div>

`;

return section;

}


/* =========================
   POPULAR TONIGHT
   ========================= */

function renderPopular(day){

const c=getDayData(day);

const section=document.createElement("section");

section.className="popularTonight reveal";

section.innerHTML=`
<div class="popularTonight__title">🔥 Popular Tonight</div>
<div class="popularTonight__grid"></div>
`;

const grid=section.querySelector(".popularTonight__grid");

c.popular.forEach(i=>{

const card=document.createElement("div");

card.className="popularCard";

card.innerHTML=`
<span>${i[0]}</span>
<span class="price">${i[1]}</span>
`;

grid.appendChild(card);

});

return section;

}


/* =========================
   DAY SWITCH
   ========================= */

function activateDay(day){

const panels=document.querySelectorAll(".dayPanel");

panels.forEach(p=>p.classList.remove("active"));

const panel=document.querySelector(`.dayPanel[data-daypanel="${day}"]`);

if(!panel) return;

panel.classList.add("active");

panel.querySelectorAll(".vipNightBanner,.popularTonight").forEach(e=>e.remove());

const hero=panel.querySelector(".heroRow");

const banner=renderVipBanner(day);

const popular=renderPopular(day);

hero.after(banner);

banner.after(popular);

panel.querySelectorAll("[data-scopebody]").forEach(b=>{
b.innerHTML=getPromoMarkup(day);
});

}


/* =========================
   DAY TABS
   ========================= */

function bindDayTabs(){

document.querySelectorAll(".dayTab").forEach(tab=>{

tab.onclick=()=>{

const day=tab.dataset.daytab;

activateDay(day);

};

});

}


/* =========================
   MOBILE RESERVE
   ========================= */

function mobileReserve(){

if(document.querySelector(".mobileReserve")) return;

const btn=document.createElement("a");

btn.href=`tel:${PHONE}`;

btn.className="mobileReserve";

btn.textContent="Reserve / Call";

document.body.appendChild(btn);

}


/* =========================
   VIBE STRIP
   ========================= */

function vibeStrip(){

if(document.querySelector(".vibeStrip")) return;

const strip=document.createElement("div");

strip.className="vibeStrip";

document.body.appendChild(strip);

const day=getToday();

const c=getDayData(day);

strip.textContent=`${c.badge} • ${c.vibe} • DJ ${c.lineup}`;

}


/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded",()=>{

bindDayTabs();

mobileReserve();

vibeStrip();

activateDay(getToday());

});