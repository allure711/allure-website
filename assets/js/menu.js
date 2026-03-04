/* =========================
   MENU SYSTEM (STABLE BUILD)
   ========================= */

function el(html){
  const d=document.createElement("div");
  d.innerHTML=html.trim();
  return d.firstElementChild;
}

function setEmpty(scope){
  const target=document.querySelector(`[data-scopebody="${scope}"]`);
  if(!target) return;
  target.innerHTML=`<div class="muted">Select a category above to view items.</div>`;
}

function clearActive(scope){
  const bar=document.querySelector(`[data-scope="${scope}"]`);
  if(!bar) return;
  bar.querySelectorAll(".cat").forEach(b=>b.classList.remove("active"));
}

/* =========================
   FOOD MENU
   ========================= */

const FOOD_BLOCK={
title:"Food",
type:"foodSections",
sections:[

{
title:"Appetizers",
items:[
["Salmon Sliders w/ Fries","$12"],
["Beef Sliders w/ Fries","$10"],
["Mozzarella Sticks","$7"],
["Fried Pickles","$5"],
["Chips & Salsa","$5"],
["Onion Rings","$7"],
["Fries","$5"]
]
},

{
title:"Wings",
items:[
["(12) pcs Wings w/ Fries","$16"],
["(8) pcs Wings w/ Fries","$14"],
["(6) pcs Wings w/ Fries","$12"],
["(12) pcs","$14"],
["(8) pcs","$10"],
["(6) pcs","$8"]
]
},

{
title:"Quesadillas",
items:[
["Cheese","$8"],
["Chicken","$10"],
["Shrimp","$12"],
["Salmon","$14"]
]
},

{
title:"Rasta Pasta / Alfredo",
items:[
["Chicken","$16"],
["Shrimp","$18"],
["Salmon","$20"]
]
},

{
title:"Salads",
items:[
["Salad","$8"],
["Chicken","$10"],
["Shrimp","$12"],
["Salmon","$13"],
["Dressings","Ranch • Blue Cheese • Italian • Balsamic • Caesar"]
]
},

{
title:"Dinner",
items:[
["Salmon (Yellow Rice & Broccoli)","$20"],
["General Tso (Rice & Broccoli)","$18"],
["Beef Burger w/ Fries","$13"],
["Fried Shrimp Basket","$18"],
["Crab Fries Basket","$18"],
["Fried Whiting Basket","$15"],
["Salmon Nugget Basket","$15"],
["Catfish Nuggets Basket","$13"]
]
},

{
title:"Tacos",
items:[
["Shrimp","$16"],
["Chicken","$14"],
["Includes","Lettuce • Cheese • Sour Cream • Salsa"]
]
},

{
title:"Upcharge",
items:[
["Add Chicken","$4"],
["Add Shrimp","$5"],
["Add Salmon","$6"]
]
},

{
title:"Flavors",
split:true,
leftTitle:"Wet",
left:["Honey Lemon Pepper","Honey Old Bay","Buffalo BBQ","Honey Sazon","Sweet Chili","Teriyaki","Mumbo"],
rightTitle:"Dry",
right:["Lemon Pepper","Jerk Rub","Old Bay"]
}

]}

/* =========================
   MENU DATA
   ========================= */

const MENU_DATA={
"monday-happy":{food:FOOD_BLOCK},
"monday-late":{food:FOOD_BLOCK},

"tuesday-happy":{food:FOOD_BLOCK},
"tuesday-late":{food:FOOD_BLOCK},

"wednesday-happy":{food:FOOD_BLOCK},
"wednesday-late":{food:FOOD_BLOCK},

"thursday-happy":{food:FOOD_BLOCK},
"thursday-late":{food:FOOD_BLOCK},

"friday-happy":{food:FOOD_BLOCK},
"friday-late":{food:FOOD_BLOCK},

"saturday-happy":{food:FOOD_BLOCK},
"saturday-late":{food:FOOD_BLOCK},

"sunday-happy":{food:FOOD_BLOCK},
"sunday-late":{food:FOOD_BLOCK}
};

/* =========================
   RENDER
   ========================= */

function render(scope,cat){

const target=document.querySelector(`[data-scopebody="${scope}"]`);
const data=MENU_DATA[scope]?.[cat];

if(!target || !data){
target.innerHTML=`<div class="muted">No items.</div>`;
return;
}

const wrap=document.createElement("div");
wrap.className="listGrid";

wrap.appendChild(el(`<div class="sectionHead">${data.title}</div>`));

if(data.type==="foodSections"){

const outer=document.createElement("div");
outer.className="colBox";

data.sections.forEach(sec=>{

outer.appendChild(el(`<div class="sectionHead">${sec.title}</div>`));

if(sec.split){

const two=document.createElement("div");
two.className="twoCols";

const L=document.createElement("div");
L.className="colBox";

const R=document.createElement("div");
R.className="colBox";

L.appendChild(el(`<div class="colTitle">${sec.leftTitle}</div>`));
R.appendChild(el(`<div class="colTitle">${sec.rightTitle}</div>`));

const ulL=document.createElement("ul");
ulL.className="bullets";

const ulR=document.createElement("ul");
ulR.className="bullets";

sec.left.forEach(i=>ulL.appendChild(el(`<li>${i}</li>`)));
sec.right.forEach(i=>ulR.appendChild(el(`<li>${i}</li>`)));

L.appendChild(ulL);
R.appendChild(ulR);

two.appendChild(L);
two.appendChild(R);

outer.appendChild(two);

return;
}

sec.items.forEach(([name,price])=>{

if(price.includes("•")){
outer.appendChild(el(`<div class="muted">${name}: ${price}</div>`));
}
else{
outer.appendChild(el(`<div class="itemRow"><span>${name}</span><span class="price">${price}</span></div>`));
}

});

});

wrap.appendChild(outer);
}

target.innerHTML="";
target.appendChild(wrap);
}

/* =========================
   CATEGORY CLICK
   ========================= */

function bindCategories(root=document){

root.querySelectorAll("[data-scope]").forEach(bar=>{

if(bar.dataset.bound==="1") return;
bar.dataset.bound="1";

const scope=bar.getAttribute("data-scope");

clearActive(scope);
setEmpty(scope);

bar.addEventListener("click",e=>{

const btn=e.target.closest(".cat");
if(!btn) return;

bar.querySelectorAll(".cat").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

render(scope,btn.getAttribute("data-cat"));

});

});

}

/* =========================
   DAY TABS
   ========================= */

function bindTabs(){

const tabs=[...document.querySelectorAll(".dayTab")];
const panels=[...document.querySelectorAll(".dayPanel")];

tabs.forEach(t=>{

t.addEventListener("click",()=>{

const key=t.dataset.daytab;

tabs.forEach(x=>x.classList.remove("active"));
t.classList.add("active");

panels.forEach(p=>p.classList.remove("active"));

const panel=document.querySelector(`.dayPanel[data-daypanel="${key}"]`);

if(panel) panel.classList.add("active");

bindCategories(panel);

});

});

}

/* =========================
   BOOT
   ========================= */

document.addEventListener("DOMContentLoaded",()=>{

bindTabs();
bindCategories();

});