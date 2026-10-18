/**
 * SAVOR - Central Restaurant Configuration & Data Store
 * Decoupled data layer for restaurant customization.
 * Clean, direct positioning copy. Zero marketing fluff.
 */

const SAVOR_CONFIG = {
  restaurant: {
    name: "SAVOR",
    serviceCode: "DINE-IN",
    tagline: "Fire, Coal & Salt.",
    subtitle: "Open kitchen dining & table arcade. Cooked to order.",
    tableNumber: "Dine-In",
    defaultToken: null,
    activeToken: null,
    isTokenVerified: false,
    currency: "₹",
    phone: "+91 98765 43210",
    email: "kitchen@savor-dining.com",
    address: "42 Kensington Boulevard, Indiranagar, Bengaluru - 560038",
    hours: "12:00 – 23:30 (Every Day)",
    mapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    publicUrl: "", // Set to your live production URL (e.g. "https://savor-menu.com") once deployed
    nfcPlaqueSpecs: {
      dimensions: "8 x 13 cm",
      finish: "Premium Matte Black & Subtle Gold",
      nfcRecordType: "Standard NDEF URI (HTTPS)"
    },
    serviceNotification: {
      enabled: true,
      primaryMethod: "telegram", // Primary dispatch method: "telegram"
      telegram: {
        botToken: "YOUR_TELEGRAM_BOT_TOKEN", // Set in js/config.local.js (gitignored) or localStorage
        chatId: "YOUR_TELEGRAM_CHAT_ID"     // Set in js/config.local.js (gitignored) or localStorage
      },
      spareMethods: {
        ntfyTopic: "savor-table-service-demo", // Spare: Free instant pub-sub push notification fallback
        whatsappNumber: "+919876543210"        // Spare: Direct WhatsApp message fallback
      },
      // Aliases for compatibility
      method: "telegram",
      whatsappNumber: "+919876543210",
      ntfyTopic: "savor-table-service-demo",
      cooldownSeconds: 60
    },
    story: "SAVOR operates on open heat: cast-iron skillets, hardwood charcoal, and stone hearths. No batch warmers, no microwave reheating, no artificial stabilizers. Breads are slow-fermented for 48 hours; curries simmer on stone coals until the fat clarifies. Food is served straight from the flame to your table."
  },

  categories: [
    { id: "all", name: "All Dishes", icon: "•", count: 0 },
    { id: "starters", name: "Starters & Small Plates", icon: "01" },
    { id: "indian-main", name: "Coal-Fired Gravies", icon: "02" },
    { id: "chinese", name: "Wok & Claypot", icon: "03" },
    { id: "pizza-pasta", name: "Stone Hearth Pizza", icon: "04" },
    { id: "burgers-snacks", name: "Iron Skillet Burgers", icon: "05" },
    { id: "beverages", name: "Cold Brews & Tonics", icon: "06" },
    { id: "desserts", name: "Plated Sweets", icon: "07" }
  ],

  menuItems: [
    // --- STARTERS ---
    {
      id: "st-1",
      name: "Truffle Mushroom Arancini",
      category: "starters",
      price: 385,
      isVeg: true,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 0,
      description: "Carnaroli rice balls stuffed with wild portobello and fontina. Fried in clean rice bran oil and finished with black truffle emulsion.",
      image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=700&auto=format&fit=crop&q=80",
      prepTime: "12 mins",
      calories: "340 kcal",
      ingredients: ["Carnaroli Rice", "Portobello", "Black Truffle", "Fontina", "Panko"],
      addOns: [
        { name: "Extra Black Truffle Dip", price: 65 },
        { name: "Shaved 24-Mo Parmesan", price: 45 }
      ]
    },
    {
      id: "st-2",
      name: "Kasundi Mustard Fish Tikka",
      category: "starters",
      price: 495,
      isVeg: false,
      isBestseller: false,
      isChefPick: true,
      spiceLevel: 2,
      description: "River sole fillets cut thick, marinated in cold-pressed mustard oil and raw fermented kasundi. Charred over babool charcoal.",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700&auto=format&fit=crop&q=80",
      prepTime: "16 mins",
      calories: "390 kcal",
      ingredients: ["River Sole", "Bengal Kasundi", "Mustard Oil", "Carom Seeds", "Sea Salt"],
      addOns: [
        { name: "Charred Garlic Butter Dip", price: 35 },
        { name: "Cast-Iron Onion Relish", price: 25 }
      ]
    },
    {
      id: "st-3",
      name: "Angara Smoked Paneer Tikka",
      category: "starters",
      price: 420,
      isVeg: true,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 2,
      description: "Full-fat Malai paneer marinated in stone-ground degi mirch and curd. Finished over open coals with roasted sweet peppers.",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700&auto=format&fit=crop&q=80",
      prepTime: "14 mins",
      calories: "410 kcal",
      ingredients: ["Malai Paneer", "Degi Mirch", "Tandoor Spices", "Bell Peppers", "Coal Smoke"],
      addOns: [
        { name: "Aged Amul Cheese Crust", price: 50 },
        { name: "Lachha Onion with Coriander", price: 25 }
      ]
    },
    {
      id: "st-4",
      name: "Crisp Lotus Stem & Holy Basil",
      category: "starters",
      price: 360,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 2,
      description: "Shaved lotus root quick-fried for dry snap, wok-tossed with bird's eye chilies, wild holy basil, and fermented garlic soy.",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&auto=format&fit=crop&q=80",
      prepTime: "10 mins",
      calories: "280 kcal",
      ingredients: ["Lotus Root", "Thai Basil", "Bird's Eye Chili", "Toasted Sesame", "Dark Soy"],
      addOns: [
        { name: "Crushed Wok Peanuts", price: 35 }
      ]
    },
    {
      id: "st-5",
      name: "Cast-Iron Butter Garlic Prawns",
      category: "starters",
      price: 540,
      isVeg: false,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 2,
      description: "Wild sea prawns flashed in cultured butter, smashed purple garlic, and rough chili flakes. Served with toasted sourdough heel.",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=700&auto=format&fit=crop&q=80",
      prepTime: "12 mins",
      calories: "360 kcal",
      ingredients: ["Sea Prawns", "Purple Garlic", "Cultured Butter", "Chili Flakes", "Sourdough Heel"],
      addOns: [
        { name: "Extra Toasted Sourdough (2 pcs)", price: 55 }
      ]
    },

    // --- INDIAN MAIN COURSE ---
    {
      id: "in-1",
      name: "Old Delhi Coal Butter Chicken",
      category: "indian-main",
      price: 520,
      isVeg: false,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 1,
      description: "Boneless tandoori chicken simmered in a reduced tomato and white butter gravy. Finished with dry kasoori methi hand-rubbed over the pot.",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&auto=format&fit=crop&q=80",
      prepTime: "18 mins",
      calories: "580 kcal",
      ingredients: ["Chicken Tikka", "Vine Tomatoes", "White Butter", "Cashew Paste", "Kasoori Methi"],
      addOns: [
        { name: "Butter Garlic Naan", price: 75 },
        { name: "Tandoori Lachha Paratha", price: 65 },
        { name: "Extra Boneless Chicken Cuts", price: 110 }
      ]
    },
    {
      id: "in-2",
      name: "24-Hour Charcoal Dal Makhani",
      category: "indian-main",
      price: 430,
      isVeg: true,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 1,
      description: "Black urad beans and kidney beans simmered overnight over extinguished charcoal embers. Heavy with white butter, light on cream.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80",
      prepTime: "15 mins",
      calories: "450 kcal",
      ingredients: ["Black Urad", "Rajma", "White Butter", "Garlic Mash", "Tomato Reduction"],
      addOns: [
        { name: "Lachha Paratha", price: 65 },
        { name: "Smoked Butter Dollop", price: 40 }
      ]
    },
    {
      id: "in-3",
      name: "Slow-Braised Nalli Rogan Josh",
      category: "indian-main",
      price: 640,
      isVeg: false,
      isBestseller: false,
      isChefPick: true,
      spiceLevel: 2,
      description: "Whole mutton shank braised four hours in bone marrow stock, caramelized onion paste, fennel root, and Kashmiri ratan jot.",
      image: "https://images.unsplash.com/photo-1545247181-516773ca838b?w=700&auto=format&fit=crop&q=80",
      prepTime: "22 mins",
      calories: "620 kcal",
      ingredients: ["Mutton Shank", "Marrow Stock", "Kashmiri Ratan Jot", "Fennel Root", "Curd Gravy"],
      addOns: [
        { name: "Zafrani Khamiri Roti (2 pcs)", price: 90 },
        { name: "Extra Marrow Spoon", price: 120 }
      ]
    },
    {
      id: "in-4",
      name: "Royal Paneer Lababdar",
      category: "indian-main",
      price: 460,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 1,
      description: "Hand-torn malai paneer folded into crushed coriander, roasted onion concasse, and saffron-scented cashew gravy.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80",
      prepTime: "16 mins",
      calories: "490 kcal",
      ingredients: ["Malai Paneer", "Crushed Coriander", "Brown Onion", "Fresh Cream"],
      addOns: [
        { name: "Chili Garlic Naan", price: 80 }
      ]
    },
    {
      id: "in-5",
      name: "Kolkata Clay Handi Gosht Biryani",
      category: "indian-main",
      price: 580,
      isVeg: false,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 1,
      description: "Aged long-grain basmati sealed in unglazed terracotta handi with spiced lamb, slow-steamed whole potato, and saffron marrow milk.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80",
      prepTime: "20 mins",
      calories: "670 kcal",
      ingredients: ["Aged Basmati", "Spiced Lamb", "Steamed Potato", "Saffron Milk", "Burani Raita"],
      addOns: [
        { name: "Extra Steamed Potato & Boiled Egg", price: 50 },
        { name: "Garlic Burani Raita", price: 40 }
      ]
    },

    // --- CHINESE & ASIAN ---
    {
      id: "ch-1",
      name: "Sichuan Chili Crisp Dumplings (6 pcs)",
      category: "chinese",
      price: 360,
      isVeg: true,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 3,
      description: "Thin crystal dough wrappers filled with water chestnut and shiitake. Drenched in our house toasted chili crisp and Chinkiang vinegar.",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=700&auto=format&fit=crop&q=80",
      prepTime: "12 mins",
      calories: "260 kcal",
      ingredients: ["Water Chestnut", "Shiitake", "House Chili Crisp", "Chinkiang Vinegar", "Scallions"],
      addOns: [
        { name: "Extra Jar of Chili Crisp (60ml)", price: 45 }
      ]
    },
    {
      id: "ch-2",
      name: "High Wok-Hei Truffle Noodles",
      category: "chinese",
      price: 395,
      isVeg: true,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 1,
      description: "Hand-rolled noodles flashed in a smoking cast-iron wok with shredded vegetables, dark mushroom soy, and cold-pressed truffle oil.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80",
      prepTime: "14 mins",
      calories: "430 kcal",
      ingredients: ["Handmade Noodles", "Snow Peas", "Mushroom Soy", "White Truffle", "Scallion Oil"],
      addOns: [
        { name: "Crisp Shredded Chicken", price: 85 },
        { name: "Wok Fried Egg", price: 45 }
      ]
    },
    {
      id: "ch-3",
      name: "Kung Pao Pepper Chicken",
      category: "chinese",
      price: 450,
      isVeg: false,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 2,
      description: "Diced thigh meat seared crisp with whole dried Tianjin chilies, Sichuan peppercorns, scallion whites, and roasted peanuts.",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=700&auto=format&fit=crop&q=80",
      prepTime: "15 mins",
      calories: "490 kcal",
      ingredients: ["Chicken Thigh", "Tianjin Chilies", "Sichuan Pepper", "Roasted Peanuts", "Dark Vinegar"],
      addOns: [
        { name: "Steamed Jasmine Rice", price: 95 }
      ]
    },

    // --- PIZZA & PASTA ---
    {
      id: "pz-1",
      name: "Burrata & San Marzano Hearth Pizza",
      category: "pizza-pasta",
      price: 590,
      isVeg: true,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 0,
      description: "48-hour cold-fermented sourdough baked at 450°C. Crushed San Marzano tomatoes, whole cold burrata, and peppery basil.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80",
      prepTime: "16 mins",
      calories: "680 kcal",
      ingredients: ["Sourdough Base", "San Marzano Tomatoes", "Fresh Burrata", "Sweet Basil", "Extra Virgin Olive Oil"],
      addOns: [
        { name: "Extra Fresh Burrata (100g)", price: 140 },
        { name: "Fermented Hot Honey", price: 40 }
      ]
    },
    {
      id: "pz-2",
      name: "Diavola Smoked Pork Pepperoni",
      category: "pizza-pasta",
      price: 660,
      isVeg: false,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 2,
      description: "Blistered crust with dry-cured pork pepperoni, Calabrian chili oil, low-moisture mozzarella, and wild dried oregano.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&auto=format&fit=crop&q=80",
      prepTime: "16 mins",
      calories: "740 kcal",
      ingredients: ["Cured Pork Pepperoni", "Fior di Latte", "Calabrian Chilies", "Wild Oregano"],
      addOns: [
        { name: "Double Pepperoni Layer", price: 120 },
        { name: "Pickled Jalapeño Rings", price: 35 }
      ]
    },
    {
      id: "pz-3",
      name: "Fettuccine Alfredo al Tartufo",
      category: "pizza-pasta",
      price: 520,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 0,
      description: "Egg pasta cut fresh daily. Emulsified directly in the pan with aged Parmigiano, pasta water, French butter, and black pepper.",
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=700&auto=format&fit=crop&q=80",
      prepTime: "15 mins",
      calories: "560 kcal",
      ingredients: ["Fresh Fettuccine", "24-Mo Parmigiano", "Cultured Butter", "Coarse Black Pepper"],
      addOns: [
        { name: "Charred Chicken Strips", price: 90 },
        { name: "Wood-Toasted Garlic Bread", price: 50 }
      ]
    },

    // --- BURGERS & SNACKS ---
    {
      id: "bg-1",
      name: "SAVOR Skillet Smash Burger",
      category: "burgers-snacks",
      price: 490,
      isVeg: false,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 1,
      description: "Two 90g coarse tenderloin patties smashed wafer-thin on ripping hot cast iron. Sharp cheddar, sweet shallot jam, potato bun.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80",
      prepTime: "15 mins",
      calories: "720 kcal",
      ingredients: ["Double Smash Patties", "Sharp Cheddar", "Shallot Jam", "Potato Brioche", "House Pickle"],
      addOns: [
        { name: "Crisp Bacon Rasher", price: 75 },
        { name: "Extra Cheddar Slice", price: 45 },
        { name: "Peri-Peri Seasoned Fries", price: 50 }
      ]
    },
    {
      id: "bg-2",
      name: "Crisp Halloumi & Avocado Stack",
      category: "burgers-snacks",
      price: 440,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 1,
      description: "Thick slab of Cypriot halloumi pan-seared to a golden crust. Smashed avocado, smoked chipotle relish, quick-pickled cucumber.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&auto=format&fit=crop&q=80",
      prepTime: "14 mins",
      calories: "580 kcal",
      ingredients: ["Seared Halloumi", "Hass Avocado", "Chipotle Mayo", "Brioche Bun", "Pickled Cucumber"],
      addOns: [
        { name: "Sweet Potato Wedges", price: 70 }
      ]
    },
    {
      id: "bg-3",
      name: "Sea Salt & Truffle Russet Fries",
      category: "burgers-snacks",
      price: 290,
      isVeg: true,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 0,
      description: "Hand-cut russet potatoes soaked, parboiled, and double-fried in clean oil. Tossed with flaky sea salt and Pecorino Romano.",
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=700&auto=format&fit=crop&q=80",
      prepTime: "10 mins",
      calories: "380 kcal",
      ingredients: ["Idaho Russet Potatoes", "Pecorino Romano", "White Truffle Oil", "Flaky Sea Salt"],
      addOns: [
        { name: "Smoked Paprika Mayo", price: 40 }
      ]
    },

    // --- BEVERAGES ---
    {
      id: "bv-1",
      name: "Charred Rosemary Passion Tonic",
      category: "beverages",
      price: 260,
      isVeg: true,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 0,
      description: "Tart passion fruit pulp, crushed kaffir lime, soda water, and a sprig of fresh rosemary torched directly before pouring.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80",
      prepTime: "5 mins",
      calories: "140 kcal",
      ingredients: ["Passion Fruit", "Torch Rosemary", "Kaffir Lime", "Botanical Tonic"],
      addOns: []
    },
    {
      id: "bv-2",
      name: "16-Hour Estate Cold Brew",
      category: "beverages",
      price: 280,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 0,
      description: "Single-estate Chikmagalur beans steeped 16 hours in cold stone water. Poured over ice with a strip of fresh blood orange peel.",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&auto=format&fit=crop&q=80",
      prepTime: "4 mins",
      calories: "90 kcal",
      ingredients: ["Chikmagalur Arabica", "Blood Orange Peel", "Ice", "Spring Water"],
      addOns: [
        { name: "Extra Espresso Shot", price: 50 }
      ]
    },
    {
      id: "bv-3",
      name: "Kashmiri Kahwa Iced Steep",
      category: "beverages",
      price: 240,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 0,
      description: "Green tea leaves infused with saffron strands, crushed green cardamom, and Ceylon cinnamon bark. Chilled over hand-cracked ice.",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&auto=format&fit=crop&q=80",
      prepTime: "4 mins",
      calories: "80 kcal",
      ingredients: ["Kashmiri Green Tea", "Saffron", "Crushed Cardamom", "Cinnamon", "Almond Slivers"],
      addOns: []
    },

    // --- DESSERTS ---
    {
      id: "ds-1",
      name: "70% Dark Chocolate Iron Pot Cake",
      category: "desserts",
      price: 420,
      isVeg: true,
      isBestseller: true,
      isChefPick: true,
      spiceLevel: 0,
      description: "Valrhona chocolate cake baked directly in a cast-iron crock. Molten center with warm salted caramel and cold vanilla bean cream.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80",
      prepTime: "12 mins",
      calories: "520 kcal",
      ingredients: ["Valrhona 70% Chocolate", "Salted Caramel", "Madagascar Vanilla Cream", "Roasted Hazelnut"],
      addOns: [
        { name: "Extra Scoop Vanilla Cream", price: 90 },
        { name: "Espresso Shot Affogato Pour", price: 45 }
      ]
    },
    {
      id: "ds-2",
      name: "Saffron Pistachio Crisp Phyllo",
      category: "desserts",
      price: 380,
      isVeg: true,
      isBestseller: false,
      isChefPick: false,
      spiceLevel: 0,
      description: "Butter-soaked sheets of phyllo baked to crackling gold, layered with Iranian pistachios, orange blossom honey, and saffron cream.",
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=700&auto=format&fit=crop&q=80",
      prepTime: "10 mins",
      calories: "440 kcal",
      ingredients: ["Phyllo Pastry", "Iranian Pistachios", "Saffron Cream", "Orange Blossom Honey"],
      addOns: []
    },
    {
      id: "ds-3",
      name: "Classic Mascarpone Tiramisu",
      category: "desserts",
      price: 390,
      isVeg: true,
      isBestseller: true,
      isChefPick: false,
      spiceLevel: 0,
      description: "Italian ladyfingers soaked in our 16-hour cold brew, whipped mascarpone curd, and raw Dutch cocoa powder.",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&auto=format&fit=crop&q=80",
      prepTime: "6 mins",
      calories: "410 kcal",
      ingredients: ["Savoiardi", "House Cold Brew", "Mascarpone", "Raw Cocoa"],
      addOns: []
    }
  ],

  arcade: {
    title: "TABLE ARCADE // TIME PASS",
    subtitle: "Kitchen prep takes 12–18 minutes. Four tactile mini-games to play right here.",
    tagline: "TABLE 04 ARCADE",
    games: [
      {
        id: "burger-stack",
        title: "Burger Stack",
        icon: "01",
        badge: "CANVAS PHYSICS",
        difficulty: "Precision Timing",
        desc: "Drop moving ingredients to build the tallest burger. Overhang slices off with real collision physics.",
        controls: "Tap screen or Spacebar to drop ingredient."
      },
      {
        id: "memory-match",
        title: "Food Memory Match",
        icon: "02",
        badge: "3D CARDS",
        difficulty: "8 / 12 / 16 Cards",
        desc: "Turn and match food pairs against the kitchen clock. Three difficulty tiers with personal best tracking.",
        controls: "Tap any tile to flip and match."
      },
      {
        id: "catch-food",
        title: "Catch The Food",
        icon: "03",
        badge: "30-SEC SPRINT",
        difficulty: "Reflex Challenge",
        desc: "Drag the chef's basket across the bottom to catch gourmet food items. Score combos and dodge penalties.",
        controls: "Drag basket on touch or use Arrow keys / Mouse."
      },
      {
        id: "tic-tac-toe",
        title: "Pizza vs Burger",
        icon: "04",
        badge: "TABLE DUEL",
        difficulty: "AI or 2-Player",
        desc: "The classic table duel. Play Pizza vs Burger against our smart bot or your companion at the table.",
        controls: "Tap an open tile to move."
      }
    ]
  },

  // Secure NFC Table Token Registry (Obfuscated unique token per physical table)
  // Ensures table numbers are not exposed in URLs (?t=sv-i9752 instead of ?table=04)
  tableTokens: {
    "sv-w77lx": { number: 1, label: "Table 01", section: "Main Dining" },
    "sv-28ej0": { number: 2, label: "Table 02", section: "Main Dining" },
    "sv-c807z": { number: 3, label: "Table 03", section: "Main Dining" },
    "sv-i9752": { number: 4, label: "Table 04", section: "Main Dining" },
    "sv-s8su1": { number: 5, label: "Table 05", section: "Main Dining" },
    "sv-y9zr4": { number: 6, label: "Table 06", section: "Terrace Garden" },
    "sv-89lg3": { number: 7, label: "Table 07", section: "Terrace Garden" },
    "sv-u4fgq": { number: 8, label: "Table 08", section: "Terrace Garden" },
    "sv-4415p": { number: 9, label: "Table 09", section: "Chef's Hearth" },
    "sv-rpge3": { number: 10, label: "Table 10", section: "Chef's Hearth" },
    "sv-hpup4": { number: 11, label: "Table 11", section: "Chef's Hearth" },
    "sv-bons1": { number: 12, label: "Table 12", section: "Chef's Hearth" },
    "sv-1p232": { number: 13, label: "Table 13", section: "Chef's Hearth" },
    "sv-vnv5z": { number: 14, label: "Table 14", section: "Chef's Hearth" },
    "sv-lo9h0": { number: 15, label: "Table 15", section: "Private Alcove" },
    "sv-fn2jx": { number: 16, label: "Table 16", section: "Private Alcove" },
    "sv-5nguy": { number: 17, label: "Table 17", section: "Private Alcove" },
    "sv-kwotf": { number: 18, label: "Table 18", section: "Private Alcove" },
    "sv-ax34g": { number: 19, label: "Table 19", section: "Private Alcove" },
    "sv-a62lc": { number: 20, label: "Table 20", section: "Private Alcove" },
    "sv-k5oab": { number: 21, label: "Table 21", section: "Rooftop Deck" },
    "sv-u59za": { number: 22, label: "Table 22", section: "Rooftop Deck" },
    "sv-44vo9": { number: 23, label: "Table 23", section: "Rooftop Deck" },
    "sv-e4hd8": { number: 24, label: "Table 24", section: "Rooftop Deck" },
    "sv-o4327": { number: 25, label: "Table 25", section: "Rooftop Deck" },
    "sv-y3or6": { number: 26, label: "Table 26", section: "Rooftop Deck" },
    "sv-83ag5": { number: 27, label: "Table 27", section: "Rooftop Deck" },
    "sv-i2w54": { number: 28, label: "Table 28", section: "Rooftop Deck" },
    "sv-s2hu3": { number: 29, label: "Table 29", section: "Rooftop Deck" },
    "sv-y6u95": { number: 30, label: "Table 30", section: "Rooftop Deck" }
  }
};

// Merge untracked local credentials if available (e.g. from gitignored js/config.local.js)
if (typeof window !== 'undefined') {
  try {
    if (typeof SAVOR_LOCAL_CONFIG !== 'undefined' && SAVOR_LOCAL_CONFIG.telegram) {
      Object.assign(SAVOR_CONFIG.restaurant.serviceNotification.telegram, SAVOR_LOCAL_CONFIG.telegram);
    }
  } catch (e) { }
}

// Detect table token from NFC/QR URL (Strictly ?t=... or ?token=...)
// Plain ?table=04 or invalid numbers are strictly rejected and ignored
(function initTableFromUrl() {
  if (typeof window !== 'undefined' && window.location) {
    try {
      const params = new URLSearchParams(window.location.search);
      // STRICT: Only look for secure token parameters (?t=... or ?token=...)
      // Plain ?table=... is intentionally rejected to prevent table manipulation.
      const rawToken = params.get('t') || params.get('token');

      if (rawToken) {
        const clean = rawToken.trim().toLowerCase();
        let matched = null;

        if (SAVOR_CONFIG.tableTokens) {
          for (const [tKey, tVal] of Object.entries(SAVOR_CONFIG.tableTokens)) {
            if (tKey.toLowerCase() === clean) {
              matched = { token: tKey, ...tVal, verified: true };
              break;
            }
          }
        }

        if (matched) {
          SAVOR_CONFIG.restaurant.tableNumber = matched.label;
          SAVOR_CONFIG.restaurant.serviceCode = matched.label.toUpperCase();
          SAVOR_CONFIG.restaurant.activeToken = matched.token;
          SAVOR_CONFIG.restaurant.tableSection = matched.section || 'Main Dining';
          SAVOR_CONFIG.restaurant.isTokenVerified = true;
          if (SAVOR_CONFIG.arcade) {
            SAVOR_CONFIG.arcade.tagline = `${matched.label.toUpperCase()} ARCADE`;
          }
        } else {
          // An unrecognized token was supplied (e.g. ?t=04 or ?t=badcode)
          SAVOR_CONFIG.restaurant.tableNumber = "Dine-In";
          SAVOR_CONFIG.restaurant.serviceCode = "DINE-IN";
          SAVOR_CONFIG.restaurant.activeToken = null;
          SAVOR_CONFIG.restaurant.isTokenVerified = false;
        }
      } else {
        // No token provided (e.g. User accessed bare site or tried ?table=04)
        SAVOR_CONFIG.restaurant.tableNumber = "Dine-In";
        SAVOR_CONFIG.restaurant.serviceCode = "DINE-IN";
        SAVOR_CONFIG.restaurant.activeToken = null;
        SAVOR_CONFIG.restaurant.isTokenVerified = false;
      }
    } catch (e) { }
  }
})();

// Helper to inspect all NFC table plaque URLs
if (typeof window !== 'undefined') {
  window.getNfcPlaqueUrls = function() {
    const base = (SAVOR_CONFIG.restaurant.publicUrl || window.location.origin + window.location.pathname).replace(/\/+$/, '');
    return Object.entries(SAVOR_CONFIG.tableTokens).map(([tok, val]) => ({
      table: val.label,
      section: val.section,
      token: tok,
      nfcUrl: `${base}?t=${tok}`
    }));
  };
}

// Freeze config so it cannot be inadvertently mutated
if (typeof Object.freeze === 'function') {
  Object.freeze(SAVOR_CONFIG.restaurant);
  Object.freeze(SAVOR_CONFIG.categories);
  Object.freeze(SAVOR_CONFIG.arcade);
  Object.freeze(SAVOR_CONFIG.tableTokens);
}
