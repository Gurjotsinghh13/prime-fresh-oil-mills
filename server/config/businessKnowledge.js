/**
 * Prime Fresh Oil Mills - Single Source of Truth for Chatbot Grounding
 * Matches client-side js/config.js exactly with verified manufacturing specs.
 */

export const BUSINESS_KNOWLEDGE = {
  company: {
    name: "Prime Fresh Oil Mills",
    tagline: "Pure Mustard Oil, Seeds & De-oiled Cakes Direct From the Mill",
    phone: "+91 90572 92529",
    phoneRaw: "919057292529",
    email: "Puneet2garg@gmail.com",
    address: "Gala No. V1210 to V1221, Ground Floor, Opposite Akshar Business Park, Krushi Wholesale Mart, Plot No. 17-20, APMC, Sector 19 Vashi, Turbhe, Navi Mumbai-400703",
    operatingHours: "Monday to Saturday, 9:00 AM – 7:00 PM IST",
    salesLead: "Puneet Garg / Commercial Desk"
  },

  clientele: [
    "Edible oil brands & blenders",
    "FMCG companies & food processors",
    "Private-label retail brands (1L, 2L, 5L PET bottles / pouches)",
    "Bulk & wholesale distributors",
    "Animal & cattle feed manufacturers (for de-oiled cakes)",
    "Solvent extraction plants"
  ],

  categories: ["Oils", "Seeds", "De-oiled Cakes"],

  products: [
    {
      id: "yellow-mustard-oil",
      name: "Yellow Mustard Oil",
      category: "Oils",
      flagship: true,
      grade: "100% Pure Cold Pressed / Kachi Ghani (First Extraction)",
      packSummary: "Bulk Tankers, 200L MS/HDPE Drums, 15L/15kg Tins, Private-label retail packs (1L / 2L / 5L)",
      description: "Flagship first-press yellow mustard oil with golden clarity, strong natural pungency, and unadulterated purity. Tested free from argemone oil. Supplied with batch Certificate of Analysis (COA)."
    },
    {
      id: "black-mustard-oil",
      name: "Black Mustard Oil",
      category: "Oils",
      grade: "100% Pure Cold Pressed / Mechanical Expeller",
      packSummary: "Bulk Tankers, 200L MS/HDPE Drums, 15L/15kg Commercial Tins",
      description: "Traditional bold, pungent black mustard oil extracted direct from cleaned seeds. Ideal for institutional food brands, culinary packers, and regional distributors."
    },
    {
      id: "yellow-mustard-seeds",
      name: "Yellow Mustard Seeds",
      category: "Seeds",
      grade: "Machine Cleaned, Sortexed & Graded",
      packSummary: "Bulk 50kg HDPE/PP Bags, Full Truckload (FTL)",
      description: "Cleaned yellow mustard seeds with high natural oil content (34–36.5%). Sourced for culinary seasoning, industrial processing, and direct oil extraction."
    },
    {
      id: "black-mustard-seeds",
      name: "Black Mustard Seeds",
      category: "Seeds",
      grade: "Machine Cleaned & Graded",
      packSummary: "Bulk 50kg Bags, Full Truckload (FTL)",
      description: "Uniformly sorted black mustard seeds with high pungency and distinct volatile oil profile. Sourced by spice blenders, pickle manufacturers, and millers."
    },
    {
      id: "groundnut-seeds",
      name: "Groundnut Seeds",
      category: "Seeds",
      grade: "Bold Size Cleaned Seeds (Uniform Moisture)",
      packSummary: "Bulk 50kg Jute/PP Bags",
      description: "Clean whole groundnut seeds with uniform moisture content. Demanded for snacking, peanut butter processing, confectionery, and oil crushing."
    },
    {
      id: "sesame-seeds",
      name: "Sesame Seeds",
      category: "Seeds",
      grade: "Natural White Cleaned Grade",
      packSummary: "Bulk 25kg / 50kg Bags",
      description: "Premium natural cleaned sesame seeds suitable for tahini, bakery topping, confectionery, and cold-pressed sesame oil extraction."
    },
    {
      id: "black-sesame-seeds",
      name: "Black Sesame Seeds",
      category: "Seeds",
      grade: "Triple-Cleaned Bold Grade",
      packSummary: "Bulk 25kg / 50kg Bags",
      description: "Rich black sesame seeds with deep colour and nutty aroma. Used by specialty food processors, medicinal formulations, and export blenders."
    },
    {
      id: "yellow-mustard-cake",
      name: "Yellow Mustard Cake",
      category: "De-oiled Cakes",
      grade: "High-Protein De-oiled Flakes / Cake",
      packSummary: "Bulk 50kg HDPE Bags, Full Truckload (FTL)",
      description: "By-product of yellow mustard pressing, rich in plant protein and residual micronutrients. Heavily demanded for cattle feed formulations, poultry feed, and organic fertilizers."
    },
    {
      id: "black-mustard-cake",
      name: "Black Mustard Cake",
      category: "De-oiled Cakes",
      grade: "Expeller / De-oiled Cake",
      packSummary: "Bulk 50kg HDPE Bags, Full Truckload (FTL)",
      description: "Nutrient-dense organic cake from black mustard pressing. Widely used as soil conditioner, natural pest-repellent organic manure, and balanced livestock feed."
    }
  ],

  packagingOptions: {
    oils: [
      "Bulk Tanker Loads (Stainless / Food Grade)",
      "200-Litre MS / HDPE Drums",
      "15-Litre / 15-kg Commercial Tins",
      "Private-Label Retail Bottles & Pouches (1L, 2L, 5L)"
    ],
    seeds: [
      "25kg / 50kg PP Bags",
      "50kg Jute Bags",
      "Full Truckloads (FTL)"
    ],
    cakes: [
      "50kg HDPE Bags",
      "Full Truckload / Bulk Dispatches"
    ]
  },

  yieldBenchmarks: {
    "yellow-mustard-seeds": {
      name: "Yellow Mustard Seeds",
      oilId: "yellow-mustard-oil",
      cakeId: "yellow-mustard-cake",
      coldPressOil: 34.0,   // %
      expellerOil: 36.5,    // %
      cakeRecovery: 61.5,   // %
      processLoss: 2.0,     // %
      oilDensity: 0.91      // kg/L
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

  procurementSteps: [
    "Step 1: Requirement & Quote — Buyer submits volume, packing preference, and delivery city; commercial desk responds in 24 hours.",
    "Step 2: Sample Testing & COA — Mill dispatches physical lots with batch COA for QA moisture, pungency, and purity approval.",
    "Step 3: Contract & Production — Direct mill contract locks specifications, batch lot numbers, and planned dispatch schedule.",
    "Step 4: Dispatch & Logistics — Dispatches via bulk tankers, sealed drums, or palletized cartons with complete transport documentation."
  ]
};
