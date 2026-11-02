/* ==========================================================
   EDIT THIS FILE to update business details and the catalog.
   Everything on the site reads from here.
   Only facts confirmed by the owner are used. See README.
   ========================================================== */
window.PFOM = {
  business: {
    name: "Prime Fresh Oil Mills",
    phone: "+91 90572 92529",
    phoneRaw: "919057292529",          // digits only, with country code (WhatsApp / tel:)
    email: "Puneet2garg@gmail.com",
    address: "Gala No. V1210 to V1221, Ground Floor, Opposite Akshar Business Park, Krushi Wholesale Mart, Plot No.,17-20, APMC, Sector 19 Vashi, Turbhe. Navi Mumbai-400703",
    addressConfirmed: false
  },

  // Packing options a BUYER can ask for (a preference list, not a claim of what is in stock).
  packing: {
    "Edible Oils": ["Not sure, please advise", "Bulk (drums / tanker)", "Retail packs", "Private-label packing"],
    "Seeds": ["Not sure, please advise", "Bulk bags"],
    "De-oiled Cakes": ["Not sure, please advise", "Bulk bags"]
  },
  units: ["Tonnes", "Kg", "Litres"],


  products: [
    {
      id: "yellow-mustard-oil", name: "Yellow Mustard Oil", category: "Oils", image: "assets/products/yellow-mustard-oil.jpg",
      short: "100% Pure Cold Pressed Yellow Mustard Oil. Ask for current availability."
    },
    {
      id: "black-mustard-oil", name: "Black Mustard Oil", category: "Oils", image: "assets/products/black-mustard-oil.jpg",
      short: "100% Pure Cold Pressed Black Mustard Oil. Ask for current availability."
    },
    {
      id: "yellow-mustard-seeds", name: "Yellow Mustard Seeds", category: "Seeds", image: "assets/products/yellow-mustard-seeds.jpg",
      short: "Quality yellow mustard seeds for cooking and seasoning. Ask for current availability."
    },
    {
      id: "black-mustard-seeds", name: "Black Mustard Seeds", category: "Seeds", image: "assets/products/black-mustard-seeds.jpg",
      short: "Bold-flavoured mustard seeds for cooking and food processing. Ask for current availability."
    },
    {
      id: "groundnut-seeds", name: "Groundnut Seeds", category: "Seeds", bestseller: true, image: "assets/products/groundnut-seeds.jpg",
      short: "Quality groundnuts for snacking and oil extraction. Ask for current availability."
    },
    {
      id: "sesame-seeds", name: "Sesame Seeds", category: "Seeds", bestseller: true, image: "assets/products/sesame-seeds.jpg",
      short: "Quality sesame seeds for cooking and oil extraction. Ask for current availability."
    },
    {
      id: "black-sesame-seeds", name: "Black Sesame Seeds", category: "Seeds", image: "assets/products/black-sesame-seeds.jpg",
      short: "Premium black sesame seeds for culinary and food processing. Ask for current availability."
    },

    {
      id: "yellow-mustard-cake", name: "Yellow Mustard Cake", category: "De-oiled Cakes", image: "assets/products/yellow-mustard-cake.jpg",
      short: "De-oiled mustard cake suitable for agricultural and feed applications. Ask for current availability."
    },
    {
      id: "black-mustard-cake", name: "Black Mustard Cake", category: "De-oiled Cakes", image: "assets/products/black-mustard-cake.jpg",
      short: "De-oiled mustard cake for agricultural and feed applications. Ask for current availability."
    }
  ]
};
