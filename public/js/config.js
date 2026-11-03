/* ==========================================================
   Prime Fresh Oil Mills - Business Configuration & Catalog
   Single source of truth for business details, catalog,
   packing options, and yield planning benchmarks.
   ========================================================== */
window.PFOM = {
  business: {
    name: "Prime Fresh Oil Mills",
    tagline: "Pure Mustard Oil, Seeds & De-oiled Cakes Direct From the Mill",
    phone: "+91 90572 92529",
    phoneRaw: "919057292529",          // digits only, with country code (WhatsApp / tel:)
    email: "Puneet2garg@gmail.com",
    // In production, configure this if backend is deployed on a standalone subdomain/service (e.g. "https://api.primefreshoilmills.com")
    // If hosted together or via reverse proxy, leave as null to use relative path "/api/chat"
    apiBaseUrl: "https://prime-fresh-api.onrender.com"
  },

  // Packing options a BUYER can ask for (preference list for B2B procurement)
  packing: {
    "Oils": ["Not sure, please advise", "Bulk tanker load", "200L MS/HDPE drums", "15L / 15kg commercial tins", "Private-label retail packs (1L/2L/5L)"],
    "Seeds": ["Not sure, please advise", "Bulk 50kg bags", "Bulk 25kg bags", "Full truckload (FTL)"],
    "De-oiled Cakes": ["Not sure, please advise", "Bulk 50kg HDPE bags", "Full truckload (FTL)"]
  },
  units: ["Tonnes", "Kg", "Litres", "Quintals"],

  // Benchmarks for B2B Yield & Procurement Calculator
  yieldBenchmarks: {
    "yellow-mustard-seeds": {
      name: "Yellow Mustard Seeds",
      oilId: "yellow-mustard-oil",
      cakeId: "yellow-mustard-cake",
      coldPressOil: 34.0,   // % oil recovery in cold press / kachi ghani
      expellerOil: 36.5,     // % oil recovery in mechanical expeller
      cakeRecovery: 61.5,    // % de-oiled cake recovery
      processLoss: 2.0,      // % moisture & foots loss
      oilDensity: 0.91       // kg/L density for volume conversion
    },
    "black-mustard-seeds": {
      name: "Black Mustard Seeds",
      oilId: "black-mustard-oil",
      cakeId: "black-mustard-cake",
      coldPressOil: 33.0,
      expellerOil: 35.5,
      cakeRecovery: 62.5,
      processLoss: 2.0,
      oilDensity: 0.91
    },
    "sesame-seeds": {
      name: "Sesame Seeds",
      oilId: "yellow-mustard-oil",
      cakeId: "yellow-mustard-cake",
      coldPressOil: 42.0,
      expellerOil: 44.5,
      cakeRecovery: 53.5,
      processLoss: 2.0,
      oilDensity: 0.92
    },
    "groundnut-seeds": {
      name: "Groundnut Seeds",
      oilId: "yellow-mustard-oil",
      cakeId: "yellow-mustard-cake",
      coldPressOil: 40.0,
      expellerOil: 42.5,
      cakeRecovery: 55.5,
      processLoss: 2.0,
      oilDensity: 0.915
    }
  },

  products: [
    {
      id: "yellow-mustard-oil",
      name: "Yellow Mustard Oil",
      category: "Oils",
      bestseller: true,
      grade: "100% Pure Cold Pressed / Kachi Ghani",
      packSummary: "Tankers · 200L Drums · 15L Tins · Private Label",
      image: "assets/products/Yellow-mustard-oil.jpg",
      short: "Flagship first-press yellow mustard oil with golden colour and characteristic pungency. Mill-direct supply for oil brands and FMCG companies."
    },
    {
      id: "black-mustard-oil",
      name: "Black Mustard Oil",
      category: "Oils",
      grade: "100% Pure Cold Pressed / Expeller",
      packSummary: "Tankers · 200L Drums · 15L Tins",
      image: "assets/products/Black-mustard-oil.jpg",
      short: "Bold, pungent traditional black mustard oil pressed direct from quality seeds. Ideal for institutional food brands and trade distributors."
    },
    {
      id: "yellow-mustard-seeds",
      name: "Yellow Mustard Seeds",
      category: "Seeds",
      bestseller: true,
      grade: "Machine Cleaned & Graded",
      packSummary: "Bulk 50kg Bags · Full Truckload",
      image: "assets/products/yellow-mustard-seeds.jpg",
      short: "Premium sorted yellow mustard seeds with high natural oil content. Supplied for direct culinary seasoning, processing, and oil extraction."
    },
    {
      id: "black-mustard-seeds",
      name: "Black Mustard Seeds",
      category: "Seeds",
      grade: "Machine Cleaned & Graded",
      packSummary: "Bulk 50kg Bags · Full Truckload",
      image: "assets/products/black-mustard-seeds.jpg",
      short: "Selected bold-flavoured black mustard seeds with high pungency profile. Uniformly graded for spice packers, food processors, and millers."
    },
    {
      id: "groundnut-seeds",
      name: "Groundnut Seeds",
      category: "Seeds",
      bestseller: true,
      grade: "Bold Size Cleaned Seeds",
      packSummary: "Bulk 50kg Jute/PP Bags",
      image: "assets/products/groundnut-seeds.jpg",
      short: "Quality whole groundnut seeds with uniform moisture content. Sourced for snacking, peanut butter, confectionery, and crushing."
    },
    {
      id: "sesame-seeds",
      name: "Sesame Seeds",
      category: "Seeds",
      bestseller: true,
      grade: "Natural White / Cleaned",
      packSummary: "Bulk 25kg / 50kg Bags",
      image: "assets/products/sesame-seeds.jpg",
      short: "Natural cleaned sesame seeds suitable for bakery, tahini, confectionery, and oil extraction with rich sweet-nutty profile."
    },
    {
      id: "black-sesame-seeds",
      name: "Black Sesame Seeds",
      category: "Seeds",
      grade: "Triple-Cleaned Bold Grade",
      packSummary: "Bulk 25kg / 50kg Bags",
      image: "assets/products/black-sesame-seeds.jpg",
      short: "Premium black sesame seeds with deep colour and nutty aroma. Favoured by specialty food manufacturers, export blenders, and processors."
    },
    {
      id: "yellow-mustard-cake",
      name: "Yellow Mustard Cake",
      category: "De-oiled Cakes",
      bestseller: true,
      grade: "High-Protein De-oiled Flakes / Cake",
      packSummary: "Bulk 50kg HDPE Bags",
      image: "assets/products/yellow-mustard-cake.jpg",
      short: "Rich in plant protein and residual micronutrients. Heavily demanded for balanced cattle feed formulations, poultry feed, and organic fertilizer."
    },
    {
      id: "black-mustard-cake",
      name: "Black Mustard Cake",
      category: "De-oiled Cakes",
      grade: "Expeller / De-oiled Cake",
      packSummary: "Bulk 50kg HDPE Bags",
      image: "assets/products/black-mustard-cake.jpg",
      short: "Nutrient-dense natural cake from black mustard pressing. Ideal soil conditioner, pest-repellent organic manure, and animal feed component."
    }
  ]
};
