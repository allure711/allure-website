/* =========================
DAY TAB SWITCHING
========================= */

document.querySelectorAll(".dayTab").forEach(tab => {
  tab.addEventListener("click", () => {

    document.querySelectorAll(".dayTab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const day = tab.dataset.daytab;

    document.querySelectorAll(".dayPanel").forEach(panel => {
      panel.classList.remove("active");
    });

    const activePanel = document.querySelector(`[data-daypanel="${day}"]`);
    if (activePanel) activePanel.classList.add("active");

  });
});


/* =========================
MENU CATEGORY DATA
========================= */

const MENU_DATA = {

food:[
{n:"Wings",d:"Crispy wings with house sauce",p:"$12+"},
{n:"Salmon Sliders",d:"Fresh salmon sliders",p:"$12"},
{n:"Chicken Tacos",d:"Seasoned chicken tacos",p:"$14"},
{n:"Shrimp Tacos",d:"Grilled shrimp tacos",p:"$16"},
{n:"Rasta Pasta",d:"Creamy jerk pasta",p:"$16+"}
],

shots5:[
{n:"House Shots",d:"Select house liquor shots",p:"$5"}
],

shots7:[
{n:"Top Shelf Shots",d:"Premium shots",p:"$7"}
],

drinks10:[
{n:"House Mixed Drinks",d:"Standard mixed drinks",p:"$10"}
],

drinks14:[
{n:"Premium Mixed Drinks",d:"Top shelf mixed drinks",p:"$14"}
],

cocktails10:[
{n:"Allure Lemon Drop",d:"Signature cocktail",p:"$10"},
{n:"Moscow Mule",d:"Vodka, ginger beer, lime",p:"$10"},
{n:"Margarita",d:"Fresh citrus margarita",p:"$10"}
],

premium:[
{n:"Premium Pour",d:"Top shelf spirits",p:"Market"}
],

wine6:[
{n:"House Wine",d:"Red or white",p:"$6"}
],

beer4:[
{n:"Domestic Beer",d:"Selected domestic beers",p:"$4"}
],

highnoon8:[
{n:"High Noon",d:"Various flavors",p:"$8"}
],

na:[
{n:"Mocktail",d:"House non-alcoholic drink",p:"$8"},
{n:"Soft Drinks",d:"Coke, Sprite, etc",p:"$4"}
],

hookah23:[
{n:"Hookah",d:"Premium hookah flavors",p:"$23"}
],

refill12:[
{n:"Hookah Refill",d:"Refresh hookah bowl",p:"$12"}
],

tower43:[
{n:"Drink Tower",d:"Large table drink tower",p:"$43"}
],

fishbowl23:[
{n:"Fishbowl",d:"Large share cocktail",p:"$23"}
],

bottles:[
{n:"Bottle Service",d:"Ask server for bottle menu",p:"VIP"}
]

};


/* =========================
RENDER MENU ITEMS
========================= */

function renderItems(items){

return `
<div class="menuList">

${items.map(i=>`

<div class="menuItem">

<div class="menuItem__left">
<div class="menuItem__name">${i.n}</div>
<div class="menuItem__desc">${i.d}</div>
</div>

<div class="menuItem__price">${i.p}</div>

</div>

`).join("")}

</div>
`;

}


/* =========================
CATEGORY BUTTON SYSTEM
========================= */

document.querySelectorAll(".catBar").forEach(bar=>{

const scope = bar.dataset.scope;
const body = document.querySelector(`[data-scopebody="${scope}"]`);
const buttons = bar.querySelectorAll(".cat");

function activate(cat){

buttons.forEach(b=>b.classList.remove("active"));

const btn = bar.querySelector(`[data-cat="${cat}"]`);
if(btn) btn.classList.add("active");

const items = MENU_DATA[cat];

if(items && body){
body.innerHTML = renderItems(items);
}

}

buttons.forEach(btn=>{
btn.addEventListener("click",()=>{
activate(btn.dataset.cat);
});
});

if(buttons.length){
activate(buttons[0].dataset.cat);
}

});