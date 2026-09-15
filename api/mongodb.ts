import { MongoClient, Db } from 'mongodb';
import { INITIAL_PRODUCTS, INITIAL_COMPANY } from './seed.js';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isSeeding = false;

export async function getMongoDb(): Promise<Db | null> {
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
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db();
    cachedClient = client;
    cachedDb = db;

    // Auto-seed if collections are empty
    if (!isSeeding) {
      isSeeding = true;
      seedMongoIfEmpty(db).catch((err) => {
        console.warn('Error auto-seeding MongoDB collections:', err);
      });
    }

    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB, falling back to local storage:', err);
    return null;
  }
}

async function seedMongoIfEmpty(db: Db) {
  try {
    const productsCount = await db.collection('products').countDocuments();
    if (productsCount === 0) {
      await db.collection('products').insertMany(INITIAL_PRODUCTS as any);
    }

    const companyCount = await db.collection('company').countDocuments();
    if (companyCount === 0) {
      await db.collection('company').insertOne(INITIAL_COMPANY as any);
    }
  } catch (err) {
    console.error('Error during MongoDB seed check:', err);
  }
}
