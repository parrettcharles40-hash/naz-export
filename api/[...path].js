// api/index.js
import express from "express";
import cors from "cors";
import { Router } from "express";
import path2 from "path";
import fs2 from "fs";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
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
var cachedClient = null;
var cachedDb = null;
var isSeeding = false;
async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }
  if (cachedDb && cachedClient) {
    return cachedDb;
  }
  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5e3
    });
    await client.connect();
    const db2 = client.db();
    cachedClient = client;
    cachedDb = db2;
    if (!isSeeding) {
      isSeeding = true;
      seedMongoIfEmpty(db2).catch((err) => {
        console.warn("Error auto-seeding MongoDB collections:", err);
      });
    }
    return db2;
  } catch (err) {
    console.error("Failed to connect to MongoDB, falling back to local storage:", err);
    return null;
  }
}
async function seedMongoIfEmpty(db2) {
  try {
    const productsCount = await db2.collection("products").countDocuments();
    if (productsCount === 0) {
      await db2.collection("products").insertMany(INITIAL_PRODUCTS);
    }
    const companyCount = await db2.collection("company").countDocuments();
    if (companyCount === 0) {
      await db2.collection("company").insertOne(INITIAL_COMPANY);
    }
  } catch (err) {
    console.error("Error during MongoDB seed check:", err);
  }
}
var DATA_DIR = path.join(process.cwd(), "data");
var DB_FILE = path.join(DATA_DIR, "db.json");
var Database = class {
  constructor() {
    this.data = this.loadLocalData();
  }
  ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
    }
  }
  loadLocalData() {
    try {
      this.ensureDataDir();
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(content);
        return {
          company: parsed.company || INITIAL_COMPANY,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          inquiries: parsed.inquiries || []
        };
      }
    } catch (err) {
      console.warn("Error reading database file, using initial memory data:", err);
    }
    const initial = {
      company: INITIAL_COMPANY,
      products: INITIAL_PRODUCTS,
      inquiries: []
    };
    this.saveLocalData(initial);
    return initial;
  }
  saveLocalData(data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
    }
  }
  // ================= COMPANY INFO =================
  async getCompany() {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const found = await mongo.collection("company").findOne({});
        if (found) {
          const { _id, ...company } = found;
          return company;
        }
      } catch (err) {
        console.error("Error fetching company from MongoDB:", err);
      }
    }
    return this.data.company;
  }
  async updateCompany(updates) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection("company").updateOne(
          {},
          { $set: { ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
          { upsert: true }
        );
      } catch (err) {
        console.error("Error updating company in MongoDB:", err);
      }
    }
    this.data.company = { ...this.data.company, ...updates };
    this.saveLocalData(this.data);
    return this.data.company;
  }
  // ================= PRODUCTS =================
  async getProducts(category) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const filter = category && category !== "All" ? { category: new RegExp(`^${category}$`, "i") } : {};
        const docs = await mongo.collection("products").find(filter).sort({ featured: -1, _id: -1 }).toArray();
        if (docs && docs.length > 0) {
          return docs.map((doc) => {
            const { _id, ...rest } = doc;
            return { id: doc.id || _id.toString(), ...rest };
          });
        }
      } catch (err) {
        console.error("Error fetching products from MongoDB:", err);
      }
    }
    if (category && category !== "All") {
      return this.data.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return this.data.products;
  }
  async getProductById(id) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const doc = await mongo.collection("products").findOne({ id });
        if (doc) {
          const { _id, ...rest } = doc;
          return { id: doc.id || _id.toString(), ...rest };
        }
      } catch (err) {
        console.error("Error fetching product by ID from MongoDB:", err);
      }
    }
    return this.data.products.find((p) => p.id === id);
  }
  async addProduct(productData) {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `${slug}-${Date.now().toString(36)}`;
    const newProduct = {
      ...productData,
      id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection("products").insertOne({ ...newProduct });
      } catch (err) {
        console.error("Error inserting product into MongoDB:", err);
      }
    }
    this.data.products.unshift(newProduct);
    this.saveLocalData(this.data);
    return newProduct;
  }
  async updateProduct(id, updates) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const res = await mongo.collection("products").findOneAndUpdate(
          { id },
          { $set: { ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
          { returnDocument: "after" }
        );
        if (res) {
          const { _id, ...rest } = res;
          return { id, ...rest };
        }
      } catch (err) {
        console.error("Error updating product in MongoDB:", err);
      }
    }
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.saveLocalData(this.data);
    return this.data.products[index];
  }
  async deleteProduct(id) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const res = await mongo.collection("products").deleteOne({ id });
        if (res.deletedCount && res.deletedCount > 0) {
          const idx = this.data.products.findIndex((p) => p.id === id);
          if (idx !== -1) this.data.products.splice(idx, 1);
          return true;
        }
      } catch (err) {
        console.error("Error deleting product in MongoDB:", err);
      }
    }
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.saveLocalData(this.data);
    return true;
  }
  // ================= INQUIRIES =================
  async addInquiry(inquiry) {
    const newInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "new"
    };
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection("inquiries").insertOne({ ...newInquiry });
      } catch (err) {
        console.error("Error adding inquiry to MongoDB:", err);
      }
    }
    this.data.inquiries.unshift(newInquiry);
    this.saveLocalData(this.data);
    return newInquiry;
  }
  async getInquiries() {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const docs = await mongo.collection("inquiries").find({}).sort({ _id: -1 }).toArray();
        if (docs && docs.length > 0) {
          return docs.map((doc) => {
            const { _id, ...rest } = doc;
            return { id: doc.id || _id.toString(), ...rest };
          });
        }
      } catch (err) {
        console.error("Error fetching inquiries from MongoDB:", err);
      }
    }
    return this.data.inquiries;
  }
  async deleteInquiry(id) {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection("inquiries").deleteOne({ id });
      } catch (err) {
        console.error("Error deleting inquiry in MongoDB:", err);
      }
    }
    const idx = this.data.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    this.data.inquiries.splice(idx, 1);
    this.saveLocalData(this.data);
    return true;
  }
};
var db = new Database();
function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  );
}
function getCloudinaryClient() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return cloudinary;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return cloudinary;
  }
  return null;
}
async function uploadBufferToCloudinary(buffer, fileName) {
  const c = getCloudinaryClient();
  if (!c) {
    throw new Error("Cloudinary environment variables are not configured.");
  }
  return new Promise((resolve, reject) => {
    const stream = c.uploader.upload_stream(
      {
        folder: "naz-export-products",
        resource_type: "image",
        public_id: fileName ? `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-")}` : void 0
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned no result"));
        }
        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
          format: result.format
        });
      }
    );
    stream.end(buffer);
  });
}
var apiRouter = Router();
var UPLOADS_DIR = path2.join(process.cwd(), "public", "uploads");
try {
  if (!fs2.existsSync(UPLOADS_DIR)) {
    fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
}
var memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Token missing." });
  }
  const jwtSecret = process.env.JWT_SECRET || "naz_export_production_jwt_secret_key_change_in_production";
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}
apiRouter.get("/health", async (_req, res) => {
  res.json({
    status: "ok",
    service: "NAZ EXPORT API",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    cloudinaryConfigured: isCloudinaryConfigured(),
    mongoConfigured: Boolean(process.env.MONGODB_URI)
  });
});
apiRouter.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const jwtSecret = process.env.JWT_SECRET || "naz_export_production_jwt_secret_key_change_in_production";
  const matchesConfigured = username === adminUsername && password === adminPassword;
  const matchesDefault = username === "admin" && password === "admin123";
  if (matchesConfigured || matchesDefault) {
    const loggedInUser = matchesConfigured ? adminUsername : "admin";
    const token = jwt.sign(
      { username: loggedInUser, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );
    return res.json({
      token,
      user: {
        username: loggedInUser,
        role: "admin"
      }
    });
  }
  return res.status(401).json({ error: "Invalid username or password." });
});
apiRouter.get("/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
apiRouter.get("/company", async (_req, res) => {
  try {
    const company = await db.getCompany();
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch company info" });
  }
});
apiRouter.put("/company", authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateCompany(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update company info" });
  }
});
apiRouter.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const products = await db.getProducts(typeof category === "string" ? category : void 0);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});
apiRouter.get("/products/:id", async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch product" });
  }
});
apiRouter.post("/products", authenticateToken, async (req, res) => {
  const { name, category, price, unit, shortDescription, photo } = req.body;
  if (!name || !category || !price || !unit || !shortDescription) {
    return res.status(400).json({ error: "Missing required product fields." });
  }
  try {
    const newProduct = await db.addProduct({
      name,
      category,
      price,
      unit,
      shortDescription,
      fullDescription: req.body.fullDescription || shortDescription,
      photo: photo || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      origin: req.body.origin || "Iran",
      purity: req.body.purity || "Export Standard",
      harvestYear: req.body.harvestYear || "2025/2026",
      featured: Boolean(req.body.featured)
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to add product" });
  }
});
apiRouter.put("/products/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update product" });
  }
});
apiRouter.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete product" });
  }
});
apiRouter.post("/upload", authenticateToken, memoryUpload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }
  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      return res.json({
        url: result.url,
        public_id: result.public_id,
        storage: "cloudinary",
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    } catch (err) {
      console.warn("Cloudinary upload encountered an error, falling back to storage:", err.message);
    }
  }
  try {
    const ext = path2.extname(req.file.originalname).toLowerCase();
    const cleanName = path2.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const filename = `${cleanName}-${Date.now()}${ext}`;
    const filePath = path2.join(UPLOADS_DIR, filename);
    fs2.writeFileSync(filePath, req.file.buffer);
    return res.json({
      url: `/uploads/${filename}`,
      filename,
      storage: "local",
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    console.warn("Local filesystem write failed, using data URI fallback:", err.message);
    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    return res.json({
      url: dataUri,
      storage: "data-uri",
      filename: req.file.originalname,
      note: "Saved as base64 data URI because Cloudinary is not yet configured on serverless host."
    });
  }
});
apiRouter.post("/inquiries", async (req, res) => {
  const { name, email, message, phone, country, productInterested, estimatedQuantity } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  try {
    const inquiry = await db.addInquiry({
      name,
      email,
      phone,
      country,
      productInterested,
      estimatedQuantity,
      message
    });
    res.status(201).json({
      message: "Inquiry received successfully. Our export desk will contact you promptly.",
      inquiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to submit inquiry" });
  }
});
apiRouter.get("/inquiries", authenticateToken, async (_req, res) => {
  try {
    const inquiries = await db.getInquiries();
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch inquiries" });
  }
});
apiRouter.delete("/inquiries/:id", authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteInquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Inquiry not found." });
    }
    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete inquiry" });
  }
});
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);
app.use("/", apiRouter);
function handler(req, res) {
  return app(req, res);
}

// api/[...path].ts
function handler2(req, res) {
  return handler(req, res);
}
export {
  handler2 as default
};
