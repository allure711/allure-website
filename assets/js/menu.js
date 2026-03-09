document.addEventListener("DOMContentLoaded", () => {
  const menuTabs = document.querySelectorAll(".menuTab");
  const menuContent = document.getElementById("menuContent");

  if (!menuTabs.length || !menuContent) return;

  const MENU_DATA = {
    food: [
      {
        name: "Lounge Wings",
        description: "Crispy wings tossed in house sauce, perfect for the table.",
        price: "$14"
      },
      {
        name: "Allure Sliders",
        description: "Mini burgers with premium toppings and fries.",
        price: "$16"
      },
      {
        name: "Truffle Fries",
        description: "Crisp fries finished with truffle oil and parmesan.",
        price: "$10"
      },
      {
        name: "Salmon Bites",
        description: "Seasoned salmon pieces with a house glaze.",
        price: "$18"
      },
      {
        name: "Chicken Tacos",
        description: "Soft tacos with seasoned chicken and fresh toppings.",
        price: "$15"
      },
      {
        name: "Shrimp Tacos",
        description: "Grilled shrimp tacos with signature sauce.",
        price: "$17"
      }
    ],

    cocktails: [
      {
        name: "Allure Lemon Drop",
        description: "A bright, smooth house favorite with premium vodka.",
        price: "$14"
      },
      {
        name: "French 75",
        description: "Gin, citrus, and sparkling finish for a polished lounge vibe.",
        price: "$15"
      },
      {
        name: "Espresso Martini",
        description: "Rich espresso, vodka, and coffee liqueur.",
        price: "$16"
      },
      {
        name: "Old Fashioned",
        description: "Classic whiskey cocktail with a refined finish.",
        price: "$16"
      },
      {
        name: "Margarita",
        description: "Fresh citrus and tequila with a clean balanced taste.",
        price: "$14"
      },
      {
        name: "Moscow Mule",
        description: "Vodka, ginger beer, and lime served ice cold.",
        price: "$14"
      }
    ],

    beer: [
      {
        name: "Domestic Beer",
        description: "Rotating domestic options available at the bar.",
        price: "$6"
      },
      {
        name: "Imported Beer",
        description: "Imported selections for a stronger premium lineup.",
        price: "$8"
      },
      {
        name: "Craft Selection",
        description: "Ask your server for the current craft beer options.",
        price: "$9"
      }
    ],

    wine: [
      {
        name: "House White",
        description: "Crisp and refreshing glass pour.",
        price: "$10"
      },
      {
        name: "House Red",
        description: "Smooth red pour with a rich finish.",
        price: "$10"
      },
      {
        name: "Sparkling",
        description: "Light sparkling option for celebrations and VIP nights.",
        price: "$12"
      },
      {
        name: "Premium Pour",
        description: "Ask about our current premium wine selection.",
        price: "$14+"
      }
    ]
  };

  function renderMenuItems(category) {
    const items = MENU_DATA[category] || [];

    menuContent.innerHTML = items.map((item) => {
      return `
        <article class="menuCard">
          <div class="menuCard__top">
            <h3 class="menuCard__title">${item.name}</h3>
            <div class="menuCard__price">${item.price}</div>
          </div>
          <p class="menuCard__text">${item.description}</p>
        </article>
      `;
    }).join("");
  }

  function setActiveTab(category) {
    menuTabs.forEach((tab) => {
      const isActive = tab.dataset.menu === category;
      tab.classList.toggle("active", isActive);
    });

    renderMenuItems(category);
  }

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.menu;
      setActiveTab(category);
    });
  });

  setActiveTab("food");
});