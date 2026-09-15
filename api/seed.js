// api/seed.ts
var INITIAL_COMPANY = {
  companyName: "NAZ EXPORT",
  tagline: "We are committed to supplying premium Iranian products with reliable quality, competitive prices, and professional export services. We look forward to building long-term business partnerships with customers worldwide.",
  email: "niiiynaa76@gmail.com",
  whatsapp: "+989010192169",
  linkedin: "https://www.linkedin.com/in/nedashirava-799538419",
  moq: "20 KG",
  headquarters: "Tehran & Khorasan, Iran",
  exportDestinations: "Europe, Middle East, Asia-Pacific, Americas"
};
var INITIAL_PRODUCTS = [
  // Saffron
  {
    id: "saffron-dasteh",
    name: "Traditional Dasteh Saffron",
    category: "Saffron",
    price: "$1.20/gram",
    unit: "gram",
    shortDescription: "Classic Persian bunch saffron (Dokhtar-Pich) containing complete natural red and yellow threads with balanced crocin and safranal.",
    fullDescription: "Traditional Dasteh Saffron (Bunch saffron) bundles the entire thread including the red stigma and yellow style. Known as the mother of all saffron cuts, it provides an authentic earthy fragrance and natural aroma preservation.",
    photo: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    origin: "Gonabad & Qaenat, Khorasan",
    purity: "Traditional Hand-Tied Bundle",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "saffron-super-negin",
    name: "Super Negin Saffron",
    category: "Saffron",
    price: "$1.80/gram",
    unit: "gram",
    shortDescription: "Crown grade Persian saffron with extra-long, thick, unbroken crimson stigmas. Unmatched coloring power (Crocin 260+).",
    fullDescription: "Super Negin is the finest, most luxurious commercial grade of saffron globally. Selected by hand directly after harvest, only the thickest crimson filaments are dried straight without any breakage or yellow parts.",
    photo: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    origin: "Khorasan Razavi, Iran",
    purity: "Grade 1 ISO 3632 Category I",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "saffron-sargol",
    name: "Sargol Persian Saffron",
    category: "Saffron",
    price: "$1.50/gram",
    unit: "gram",
    shortDescription: "Pure top-cut scarlet red stigmas with intense floral saffron notes and rich golden coloring strength.",
    fullDescription: 'Sargol literally means "flower top" in Persian. It consists of pure red stigmas separated from the yellow style, ideal for culinary excellence, pharmaceutical extracts, and cosmetic industries worldwide.',
    photo: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    origin: "Qaenat, South Khorasan",
    purity: "100% Pure Red Stigmas",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "saffron-root",
    name: "Saffron Root (White Part)",
    category: "Saffron",
    price: "$0.90/gram",
    unit: "gram",
    shortDescription: "Aromatic pale yellow botanical style portion of the Crocus sativus flower, high in essential oils and gentle aroma.",
    fullDescription: "Saffron root (Konj/White style) retains the delicate saffron aroma and natural bioactive components at a cost-effective price point, widely used for herbal infusions, tea blending, and aromatic food essences.",
    photo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    origin: "Torbat-e Heydarieh, Khorasan",
    purity: "Clean Air-Dried Style",
    harvestYear: "2025/2026"
  },
  // Herbal Infusions
  {
    id: "herbal-damask-rose",
    name: "Dried Damask Rose Buds",
    category: "Herbal",
    price: "$24.00/kg",
    unit: "kg",
    shortDescription: "Sun-dried Mohammadi rosebuds cultivated in Kashan and Lalehzar mountain valleys, rich in gentle floral fragrance and antioxidants.",
    fullDescription: "Persian Damask rosebuds (Rosa damascena) are renowned worldwide for their intoxicating fragrance and natural essential oils. Harvested in early dawn during peak flowering, they are dried in shade to retain rich pink coloration.",
    photo: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    origin: "Kashan & Lalehzar, Iran",
    purity: "Whole Buds, No Petal Crumble",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "herbal-echium-borage",
    name: "Persian Borage (Gol Gavzaban)",
    category: "Herbal",
    price: "$32.00/kg",
    unit: "kg",
    shortDescription: "Traditional wild-crafted mountain Echium amoenum with deep purple bell-shaped petals, celebrated for its calming and soothing infusion.",
    fullDescription: "Gol Gavzaban is the legendary calming blossom of Persian traditional medicine, hand-gathered from high altitudes in the Alborz mountain range.",
    photo: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=800&q=80",
    origin: "Alborz Mountains & Gilan",
    purity: "100% Pure Violet Flowers",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "herbal-dried-lime",
    name: "Persian Black Dried Lime (Limoo Amani)",
    category: "Herbal",
    price: "$14.00/kg",
    unit: "kg",
    shortDescription: "Sun-baked citrus limes with tart, fermented, and smoky notes essential for Middle Eastern culinary masterstocks and herbal teas.",
    fullDescription: "Limoo Amani (Black & brown dried limes) are small limes brined and naturally dried under the hot desert sun until brittle and darkly aromatic.",
    photo: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80",
    origin: "Minab & Shiraz, Iran",
    purity: "Sun-Cured Export Grade",
    harvestYear: "2025/2026"
  },
  // Persian Nuts & Kernels
  {
    id: "nuts-akbari-pistachio",
    name: "Akbari Long Pistachios",
    category: "Nuts",
    price: "$22.50/kg",
    unit: "kg",
    shortDescription: 'The "Super Long" Persian pistachio, known for its elegant elongated shell, effortless cracking, and rich nutty sweetness.',
    fullDescription: "Akbari is the most luxurious and prestigious cultivar of Persian pistachio. Naturally smiling with an easy-to-open shell, it offers an elongated kernel with unmatched buttery flavor and vibrant emerald meat.",
    photo: "https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&w=800&q=80",
    origin: "Rafsanjan & Kerman",
    purity: "Natural Open Shells, Raw/Roasted",
    harvestYear: "2025/2026",
    featured: true
  },
  {
    id: "nuts-fandooghi-pistachio",
    name: "Fandooghi Round Pistachios",
    category: "Nuts",
    price: "$18.00/kg",
    unit: "kg",
    shortDescription: "Spherical Persian pistachio with high ounce density, perfect for confectionery, gelato manufacturing, and bulk snack packaging.",
    fullDescription: "Fandooghi (Round pistachio) is the primary commercial export variety of Iran. Its compact rounded shape produces the highest number of nuts per ounce, making it exceptionally economical for wholesale buyers.",
    photo: "https://images.unsplash.com/photo-1543208543-34e8d35f492b?auto=format&fit=crop&w=800&q=80",
    origin: "Sirjan & Zarand, Kerman",
    purity: "Size 28/30 & 30/32 Available",
    harvestYear: "2025/2026"
  },
  {
    id: "nuts-green-peeled-pistachio",
    name: "Green Peeled Pistachio Kernels (GPPK)",
    category: "Nuts",
    price: "$42.00/kg",
    unit: "kg",
    shortDescription: "Vibrant emerald green skinless pistachio kernels sorted by color grades (A-D) for luxury pastry, Swiss chocolate, and savory charcuterie.",
    fullDescription: "Green Peeled Pistachio Kernels are harvested early before complete shell maturity to capture the deep, radiant green core.",
    photo: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80",
    origin: "Kerman Province, Iran",
    purity: "Grade S/A Super Emerald",
    harvestYear: "2025/2026",
    featured: true
  },
  // Persian Teas
  {
    id: "tea-lahijan-black",
    name: "Lahijan Black Tea",
    category: "Tea",
    price: "$18.00/kg",
    unit: "kg",
    shortDescription: "The crown jewel of Persian tea. Handpicked tender spring shoots from the terraced mountain gardens of Lahijan.",
    fullDescription: "Lahijan is the historic capital of Iranian tea, nestled on the verdant subtropical slopes of Gilan by the Caspian Sea. Grown without synthetic pesticides thanks to brisk Caspian winters, this orthodox black tea features a distinct amber-ruby liquor.",
    photo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    origin: "Lahijan, Gilan Province",
    purity: "100% Pesticide-Free Spring Flush",
    harvestYear: "2025/2026",
    featured: true
  }
];
export {
  INITIAL_COMPANY,
  INITIAL_PRODUCTS
};
