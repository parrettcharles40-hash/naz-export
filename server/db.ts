import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  category: 'Saffron' | 'Herbal' | 'Nuts' | 'Tea';
  price: string;
  unit: string;
  shortDescription: string;
  fullDescription?: string;
  photo: string;
  origin?: string;
  purity?: string;
  harvestYear?: string;
  featured?: boolean;
  updatedAt?: string;
}

export interface CompanyInfo {
  companyName: string;
  tagline: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  moq: string;
  establishedYear?: string;
  headquarters?: string;
  exportDestinations?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  productInterested?: string;
  estimatedQuantity?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

interface DatabaseSchema {
  company: CompanyInfo;
  products: Product[];
  inquiries: Inquiry[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_COMPANY: CompanyInfo = {
  companyName: 'NAZ EXPORT',
  tagline: 'We are committed to supplying premium Iranian products with reliable quality, competitive prices, and professional export services. We look forward to building long-term business partnerships with customers worldwide.',
  email: 'niiiynaa76@gmail.com',
  whatsapp: '+989010192169',
  linkedin: 'https://www.linkedin.com/in/nedashirava-799538419',
  moq: '20 KG',
  headquarters: 'Tehran & Khorasan, Iran',
  exportDestinations: 'Europe, Middle East, Asia-Pacific, Americas'
};

const INITIAL_PRODUCTS: Product[] = [
  // Saffron
  {
    id: 'saffron-dasteh',
    name: 'Traditional Dasteh Saffron',
    category: 'Saffron',
    price: '$1.20/gram',
    unit: 'gram',
    shortDescription: 'Classic Persian bunch saffron (Dokhtar-Pich) containing complete natural red and yellow threads with balanced crocin and safranal.',
    fullDescription: 'Traditional Dasteh Saffron (Bunch saffron) bundles the entire thread including the red stigma and yellow style. Known as the mother of all saffron cuts, it provides an authentic earthy fragrance and natural aroma preservation.',
    photo: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    origin: 'Gonabad & Qaenat, Khorasan',
    purity: 'Traditional Hand-Tied Bundle',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'saffron-super-negin',
    name: 'Super Negin Saffron',
    category: 'Saffron',
    price: '$1.80/gram',
    unit: 'gram',
    shortDescription: 'Crown grade Persian saffron with extra-long, thick, unbroken crimson stigmas. Unmatched coloring power (Crocin 260+).',
    fullDescription: 'Super Negin is the finest, most luxurious commercial grade of saffron globally. Selected by hand directly after harvest, only the thickest crimson filaments are dried straight without any breakage or yellow parts.',
    photo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    origin: 'Khorasan Razavi, Iran',
    purity: 'Grade 1 ISO 3632 Category I',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'saffron-sargol',
    name: 'Sargol Persian Saffron',
    category: 'Saffron',
    price: '$1.50/gram',
    unit: 'gram',
    shortDescription: 'Pure top-cut scarlet red stigmas with intense floral saffron notes and rich golden coloring strength.',
    fullDescription: 'Sargol literally means "flower top" in Persian. It consists of pure red stigmas separated from the yellow style, ideal for culinary excellence, pharmaceutical extracts, and cosmetic industries worldwide.',
    photo: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    origin: 'Qaenat, South Khorasan',
    purity: '100% Pure Red Stigmas',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'saffron-root',
    name: 'Saffron Root (White Part)',
    category: 'Saffron',
    price: '$0.90/gram',
    unit: 'gram',
    shortDescription: 'Aromatic pale yellow botanical style portion of the Crocus sativus flower, high in essential oils and gentle aroma.',
    fullDescription: 'Saffron root (Konj/White style) retains the delicate saffron aroma and natural bioactive components at a cost-effective price point, widely used for herbal infusions, tea blending, and aromatic food essences.',
    photo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Torbat-e Heydarieh, Khorasan',
    purity: 'Clean Air-Dried Style',
    harvestYear: '2025/2026',
    featured: false
  },

  // Herbal Products
  {
    id: 'herbal-chamomile',
    name: 'Chamomile',
    category: 'Herbal',
    price: '$18.00/kg',
    unit: 'kg',
    shortDescription: 'Whole dried golden-yellow Persian Matricaria chamomile blossoms with gentle honey-floral soothing notes.',
    fullDescription: 'Naturally dried in shade to preserve golden blossom heads and essential chamazulene oil. Premium botanical selection for wellness teas, herbal extracts, and organic skincare formulations.',
    photo: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
    origin: 'Fars Province, Iran',
    purity: '100% Whole Dried Flower Heads',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'herbal-shirazi-thyme',
    name: 'Shirazi Thyme',
    category: 'Herbal',
    price: '$22.00/kg',
    unit: 'kg',
    shortDescription: 'Authentic wild-crafted Persian mountain thyme (Zataria multiflora) renowned for high thymol and antibacterial strength.',
    fullDescription: 'Shirazi Thyme is indigenous to the arid southern highlands of Iran. Renowned for its pungent, earthy, warm aroma and exceptional medicinal concentration. Ideal for spice blends, teas, and essential oil distillation.',
    photo: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    origin: 'Zagros Highlands, Shiraz, Iran',
    purity: 'Wild-Harvested Mountain Grade',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'herbal-damask-rose',
    name: 'Damask Rose Flowers',
    category: 'Herbal',
    price: '$25.00/kg',
    unit: 'kg',
    shortDescription: 'Fragrant pink Persian Mohammadi rosebuds from the mountain oasis of Kashan, sun-cured to lock in sweet natural perfume.',
    fullDescription: 'Handpicked in the early morning dew of Kashan and Lalehzar before full bloom. These intact pink buds provide exceptional scent and visual elegance for luxury herbal teas, confectionery, and export retail packaging.',
    photo: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    origin: 'Kashan Oasis, Isfahan',
    purity: 'Whole Dried Closed Rosebuds',
    harvestYear: '2025/2026',
    featured: true
  },

  // Premium Iranian Nuts
  {
    id: 'nuts-pistachios',
    name: 'Premium Iranian Pistachios',
    category: 'Nuts',
    price: '$24.00/kg',
    unit: 'kg',
    shortDescription: 'World-famous Iranian long Akbari and round Fandoghi pistachios with rich kernel oil content and natural open shells.',
    fullDescription: 'Iranian pistachios are celebrated worldwide for their deep nutty flavor, high roasting tolerance, and vibrant purple-green kernels. Graded by size (20/22 to 28/30 ounces) and mechanically sorted for zero defects.',
    photo: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
    origin: 'Rafsanjan & Kerman, Iran',
    purity: 'Naturally Open In-Shell (Aflatoxin Tested)',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'nuts-dried-fig',
    name: 'Dried Fig',
    category: 'Nuts',
    price: '$16.00/kg',
    unit: 'kg',
    shortDescription: 'Naturally sun-cured Estahban dried figs, naturally sweet with delicate thin skin and chewy golden honey center.',
    fullDescription: 'Produced exclusively in Estahban, the largest rain-fed fig forest in the world. Dried completely naturally under the Persian sun without chemical sulfur treatments or added sugars.',
    photo: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&w=800&q=80',
    origin: 'Estahban Valley, Fars, Iran',
    purity: '100% Natural Sun-Dried Grade A',
    harvestYear: '2025/2026',
    featured: true
  },

  // Black Tea
  {
    id: 'tea-black',
    name: 'Black Tea',
    category: 'Tea',
    price: '$14.00/kg',
    unit: 'kg',
    shortDescription: 'Traditional Northern Iranian orthodox black tea with deep amber liquor, subtle astringency, and crisp clean finish.',
    fullDescription: 'Grown on the misty Caspian slopes of Gilan. Processed using traditional orthodox rolling and natural oxidation without synthetic artificial colorants or flavorings.',
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    origin: 'Gilan Caspian Hills, Iran',
    purity: 'Single-Estate Orthodox Leaf',
    harvestYear: '2025/2026',
    featured: true
  },
  {
    id: 'tea-lahijan-black',
    name: 'Lahijan Black Tea',
    category: 'Tea',
    price: '$18.00/kg',
    unit: 'kg',
    shortDescription: 'The crown jewel of Persian tea. Handpicked tender spring shoots from the terraced mountain gardens of Lahijan.',
    fullDescription: 'Lahijan is the historic capital of Iranian tea cultivation since 1900. High elevation and humid sea breezes produce a velvety, aromatic ruby-red infusion with floral muscatel undertones and high antioxidant density.',
    photo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    origin: 'Lahijan Foothills, Guilan, Iran',
    purity: 'First Flush Golden Flowery Pekoe',
    harvestYear: '2025/2026',
    featured: true
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          company: { ...INITIAL_COMPANY, ...(parsed.company || {}) },
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          inquiries: parsed.inquiries || []
        };
      }
    } catch (err) {
      console.error('Error reading database file, using initial data:', err);
    }

    const initial: DatabaseSchema = {
      company: INITIAL_COMPANY,
      products: INITIAL_PRODUCTS,
      inquiries: []
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  // Company Info methods
  public getCompany(): CompanyInfo {
    return this.data.company;
  }

  public updateCompany(updates: Partial<CompanyInfo>): CompanyInfo {
    this.data.company = { ...this.data.company, ...updates };
    this.saveData(this.data);
    return this.data.company;
  }

  // Products methods
  public getProducts(category?: string): Product[] {
    if (category && category !== 'All') {
      return this.data.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `${slug}-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...productData,
      id,
      updatedAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveData(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  // Inquiries
  public addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.data.inquiries.unshift(newInquiry);
    this.saveData(this.data);
    return newInquiry;
  }

  public getInquiries(): Inquiry[] {
    return this.data.inquiries;
  }

  public deleteInquiry(id: string): boolean {
    const idx = this.data.inquiries.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.data.inquiries.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }
}

export const db = new Database();
