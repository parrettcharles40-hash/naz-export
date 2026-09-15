import fs from 'fs';
import path from 'path';
import { getMongoDb } from './mongodb';
import { Product, CompanyInfo, Inquiry } from './types';
import { INITIAL_COMPANY, INITIAL_PRODUCTS } from './seed';

export type { Product, CompanyInfo, Inquiry };

interface DatabaseSchema {
  company: CompanyInfo;
  products: Product[];
  inquiries: Inquiry[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadLocalData();
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      // In serverless, filesystem might be read-only
    }
  }

  private loadLocalData(): DatabaseSchema {
    try {
      this.ensureDataDir();
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          company: parsed.company || INITIAL_COMPANY,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          inquiries: parsed.inquiries || [],
        };
      }
    } catch (err) {
      console.warn('Error reading database file, using initial memory data:', err);
    }

    const initial: DatabaseSchema = {
      company: INITIAL_COMPANY,
      products: INITIAL_PRODUCTS,
      inquiries: [],
    };
    this.saveLocalData(initial);
    return initial;
  }

  private saveLocalData(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      // Ephemeral environments like Vercel Lambda have read-only root FS
    }
  }

  // ================= COMPANY INFO =================
  public async getCompany(): Promise<CompanyInfo> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const found = await mongo.collection<CompanyInfo>('company').findOne({});
        if (found) {
          const { _id, ...company } = found as any;
          return company as CompanyInfo;
        }
      } catch (err) {
        console.error('Error fetching company from MongoDB:', err);
      }
    }
    return this.data.company;
  }

  public async updateCompany(updates: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection('company').updateOne(
          {},
          { $set: { ...updates, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      } catch (err) {
        console.error('Error updating company in MongoDB:', err);
      }
    }

    this.data.company = { ...this.data.company, ...updates };
    this.saveLocalData(this.data);
    return this.data.company;
  }

  // ================= PRODUCTS =================
  public async getProducts(category?: string): Promise<Product[]> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const filter = category && category !== 'All' ? { category: new RegExp(`^${category}$`, 'i') } : {};
        const docs = await mongo.collection('products').find(filter).sort({ featured: -1, _id: -1 }).toArray();
        if (docs && docs.length > 0) {
          return docs.map((doc: any) => {
            const { _id, ...rest } = doc;
            return { id: doc.id || _id.toString(), ...rest } as Product;
          });
        }
      } catch (err) {
        console.error('Error fetching products from MongoDB:', err);
      }
    }

    if (category && category !== 'All') {
      return this.data.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return this.data.products;
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const doc = (await mongo.collection('products').findOne({ id })) as any;
        if (doc) {
          const { _id, ...rest } = doc;
          return { id: doc.id || _id.toString(), ...rest } as Product;
        }
      } catch (err) {
        console.error('Error fetching product by ID from MongoDB:', err);
      }
    }
    return this.data.products.find((p) => p.id === id);
  }

  public async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slug}-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...productData,
      id,
      updatedAt: new Date().toISOString(),
    };

    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection('products').insertOne({ ...newProduct } as any);
      } catch (err) {
        console.error('Error inserting product into MongoDB:', err);
      }
    }

    this.data.products.unshift(newProduct);
    this.saveLocalData(this.data);
    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const res = await mongo.collection('products').findOneAndUpdate(
          { id },
          { $set: { ...updates, updatedAt: new Date().toISOString() } },
          { returnDocument: 'after' }
        );
        if (res) {
          const { _id, ...rest } = res as any;
          return { id, ...rest } as Product;
        }
      } catch (err) {
        console.error('Error updating product in MongoDB:', err);
      }
    }

    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveLocalData(this.data);
    return this.data.products[index];
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const res = await mongo.collection('products').deleteOne({ id });
        if (res.deletedCount && res.deletedCount > 0) {
          const idx = this.data.products.findIndex((p) => p.id === id);
          if (idx !== -1) this.data.products.splice(idx, 1);
          return true;
        }
      } catch (err) {
        console.error('Error deleting product in MongoDB:', err);
      }
    }

    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.saveLocalData(this.data);
    return true;
  }

  // ================= INQUIRIES =================
  public async addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection('inquiries').insertOne({ ...newInquiry } as any);
      } catch (err) {
        console.error('Error adding inquiry to MongoDB:', err);
      }
    }

    this.data.inquiries.unshift(newInquiry);
    this.saveLocalData(this.data);
    return newInquiry;
  }

  public async getInquiries(): Promise<Inquiry[]> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        const docs = await mongo.collection('inquiries').find({}).sort({ _id: -1 }).toArray();
        if (docs && docs.length > 0) {
          return docs.map((doc: any) => {
            const { _id, ...rest } = doc;
            return { id: doc.id || _id.toString(), ...rest } as Inquiry;
          });
        }
      } catch (err) {
        console.error('Error fetching inquiries from MongoDB:', err);
      }
    }
    return this.data.inquiries;
  }

  public async deleteInquiry(id: string): Promise<boolean> {
    const mongo = await getMongoDb();
    if (mongo) {
      try {
        await mongo.collection('inquiries').deleteOne({ id });
      } catch (err) {
        console.error('Error deleting inquiry in MongoDB:', err);
      }
    }

    const idx = this.data.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    this.data.inquiries.splice(idx, 1);
    this.saveLocalData(this.data);
    return true;
  }
}

export const db = new Database();
