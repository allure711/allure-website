document.addEventListener("DOMContentLoaded", () => {

const CATEGORY_CONTENT = {

food:[
{name:"Wings",desc:"Crispy wings with house sauce.",price:"$12+"},
{name:"Salmon Sliders",desc:"Fresh salmon sliders.",price:"$12"},
{name:"Chicken Tacos",desc:"Seasoned chicken tacos.",price:"$14"},
{name:"Shrimp Tacos",desc:"Grilled shrimp tacos.",price:"$16"},
{name:"Rasta Pasta",desc:"Creamy jerk pasta.",price:"$16+"}
],

shots5:[
{name:"Vodka Shot",desc:"House vodka.",price:"$5"},
{name:"Tequila Shot",desc:"House tequila.",price:"$5"},
{name:"Rum Shot",desc:"House rum.",price:"$5"},
{name:"Whiskey Shot",desc:"House whiskey.",price:"$5"}
],

shots7:[
{name:"Hennessy Shot",desc:"Premium cognac.",price:"$7"},
{name:"Patron Shot",desc:"Premium tequila.",price:"$7"},
{name:"Casamigos Shot",desc:"Premium tequila.",price:"$7"},
{name:"Ciroc Shot",desc:"Premium vodka.",price:"$7"}
],

drinks10:[
{name:"Vodka Mix",desc:"Vodka + mixer.",price:"$10"},
{name:"Tequila Mix",desc:"Tequila + mixer.",price:"$10"},
{name:"Rum Mix",desc:"Rum + mixer.",price:"$10"},
{name:"Gin Mix",desc:"Gin + mixer.",price:"$10"}
],

drinks14:[
{name:"Hennessy Mix",desc:"Hennessy + mixer.",price:"$14"},
{name:"Patron Mix",desc:"Patron + mixer.",price:"$14"},
{name:"Casamigos Mix",desc:"Casamigos + mixer.",price:"$14"},
{name:"Ciroc Mix",desc:"Ciroc + mixer.",price:"$14"}
],

cocktails10:[
{name:"Allure Lemon Drop",desc:"Signature cocktail.",price:"$10"},
{name:"Margarita",desc:"Fresh citrus margarita.",price:"$10"},
{name:"Moscow Mule",desc:"Vodka ginger beer.",price:"$10"},
{name:"Long Island",desc:"Strong house cocktail.",price:"$10"}
],

premium:[
{name:"Don Julio 1942",desc:"Luxury tequila.",price:"Market"},
{name:"Clase Azul",desc:"Premium tequila.",price:"Market"},
{name:"Ace of Spades",desc:"Luxury champagne.",price:"Market"}
],

wine6:[
{name:"House White Wine",desc:"Glass of white wine.",price:"$6"},
{name:"House Red Wine",desc:"Glass of red wine.",price:"$6"}
],

beer4:[
{name:"Bud Light",desc:"Domestic beer.",price:"$4"},
{name:"Corona",desc:"Imported beer.",price:"$4"},
{name:"Heineken",desc:"Imported beer.",price:"$4"}
],

highnoon8:[
{name:"High Noon Pineapple",desc:"Vodka seltzer.",price:"$8"},
{name:"High Noon Watermelon",desc:"Vodka seltzer.",price:"$8"},
{name:"High Noon Peach",desc:"Vodka seltzer.",price:"$8"}
],

na:[
{name:"Mocktail",desc:"Non-alcoholic cocktail.",price:"$8"},
{name:"Soft Drinks",desc:"Coke, Sprite, Ginger Ale.",price:"$4"},
{name:"Red Bull",desc:"Energy drink.",price:"$6"}
],

hookah23:[
{name:"House Hookah",desc:"Standard hookah flavors.",price:"$23"},
{name:"Mint Hookah",desc:"Mint flavor.",price:"$23"},
{name:"Fruit Mix Hookah",desc:"Fruit blend.",price:"$23"}
],

refill12:[
{name:"Hookah Refill",desc:"New bowl refill.",price:"$12"}
],

tower43:[
{name:"Drink Tower",desc:"Large group drink tower.",price:"$43"}
],

fishbowl23:[
{name:"Blue Fishbowl",desc:"Large share cocktail.",price:"$23"},
{name:"Tropical Fishbowl",desc:"Fruit punch bowl.",price:"$23"}
],

bottles:[
{name:"Hennessy Bottle",desc:"Bottle service.",price:"VIP"},
{name:"Casamigos Bottle",desc:"Bottle service.",price:"VIP"},
{name:"Patron Bottle",desc:"Bottle service.",price:"VIP"},
{name:"Ciroc Bottle",desc:"Bottle service.",price:"VIP"}
]

};

function renderMenu(items){

return `
<div class="menuList">
${items.map(i=>`
<div class="menuItem">
<div>
<div class="menuItem__name">${i.name}</div>
<div class="menuItem__desc">${i.desc}</div>
</div>
<div class="menuItem__price">${i.price}</div>
</div>
`).join("")}
</div>
`;

}

function setupCategoryBar(bar){

const scope=bar.dataset.scope;
const body=document.querySelector(`[data-scopebody="${scope}"]`);
const buttons=[...bar.querySelectorAll(".cat")];

function activate(cat){

buttons.forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));

body.innerHTML=renderMenu(CATEGORY_CONTENT[cat]||[]);

}

buttons.forEach(btn=>{
btn.onclick=()=>activate(btn.dataset.cat);
});

activate(buttons[0].dataset.cat);

}

function activateDay(day){

document.querySelectorAll(".dayTab").forEach(tab=>{
tab.classList.toggle("active",tab.dataset.daytab===day);
});

document.querySelectorAll(".dayPanel").forEach(panel=>{

const active=panel.dataset.daypanel===day;

panel.classList.toggle("active",active);

if(active){

panel.querySelectorAll(".catBar").forEach(setupCategoryBar);

}

});

}

document.querySelectorAll(".dayTab").forEach(tab=>{

tab.addEventListener("click",()=>{

activateDay(tab.dataset.daytab);

});

});

activateDay("monday");

});