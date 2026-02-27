/* assets/js/menu.js
   Allure Menu Logic (Day switch + Accordion + Category tabs)
*/

(() => {
  // ========= 1) MENU DATA =========
  // You can edit lists anytime without touching the logic.

  const MENU = {
    monday: {
      title: "MONDAY",
      subtitle: "Happy Hour 5PM–9PM • After 9PM Late-Night Menu",
      happy: {
        // Food FIRST (per your request later you can fill it)
        food: {
          label: "Food",
          type: "list",
          items: [
            { name: "Add your food items here", price: "" }
          ]
        },

        shots5: {
          label: "$5 Shots",
          type: "spiritTabs",
          price: "$5",
          tabs: {
            Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
            Tequila: ["1800", "Altos", "Patron"],
            Whiskey: ["Jameson", "Jack Daniels"],
            Liqueur: ["Triple Sec"],
            Rum: ["Bacardi"],
            Gin: ["Bombay"],
            Cognac: ["Hennessy"]
          }
        },

        drinks10: {
          label: "$10 Drinks",
          type: "spiritTabs",
          price: "$10",
          // same exact list as $5 shots, only price changes
          tabs: {
            Vodka: ["Absolut", "Belvedere", "Ciroc", "Grey Goose", "Kettle One", "Stoli Orange", "Titos"],
            Tequila: ["1800", "Altos", "Patron"],
            Whiskey: ["Jameson", "Jack Daniels"],
            Liqueur: ["Triple Sec"],
            Rum: ["Bacardi"],
            Gin: ["Bombay"],
            Cognac: ["Hennessy"]
          }
        },

        cocktails10: {
          label: "$10 Cocktails",
          type: "chips",
          items: [
            "Allure Lemon Drop",
            "Long Island",
            "Manhattan",
            "Mint Julep",
            "Mojito",
            "Moscow Mule",
            "Old Fashion",
            "Orange Martini",
            "Red/White Sangria",
            "Rum Punch",
            "Strawberry Henny"
          ]
        },

        topShelf: {
          label: "$7 Shots / $14 Drinks",
          type: "chips",
          items: [
            "818","Casa Azul","Casamigos","Ciroc VS","Don Julio","Dusse","Equiano",
            "Hendricks","Hennessy VSOP","Herradura","Old Forester","Patron","Remy 1738",
            "Remy VSOP","Sir Davis"
          ]
        },

        wbna: {
          label: "Wine / Beer / Non-Alcoholic",
          type: "wbnaTabs",
          tabs: {
            "$6 Wine": [
              "Cabernet Sauvignon",
              "Chardonnay",
              "Merlot",
              "Moscato (Red/White)",
              "Pinot Grigio",
              "Sauvignon Blanc",
              "Sweet Red"
            ],
            "$4 Beer": ["Heineken", "Corona", "Stella", "Guinness", "Angry Orchard"],
            "Non-Alcoholic": ["Soda", "Juice", "Water", "Red Bull"]
          }
        },

        hookah: {
          label: