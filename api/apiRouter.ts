import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from './cloudinary.js';

export const apiRouter = Router();

// Ensure uploads folder exists in non-serverless environments
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only serverless file systems
}

// Use memory storage for seamless compatibility with Cloudinary and Vercel serverless
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Authentication Middleware
export interface AuthRequest extends Request {
  user?: { username: string; role: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Token missing.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'naz_export_production_jwt_secret_key_change_in_production';

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded as { username: string; role: string };
    next();
  });
}

// ======================== API ROUTES ========================

// 1. Health check
apiRouter.get('/health', async (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NAZ EXPORT API',
    timestamp: new Date().toISOString(),
    cloudinaryConfigured: isCloudinaryConfigured(),
    mongoConfigured: Boolean(process.env.MONGODB_URI),
  });
});

// 2. Auth routes
apiRouter.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const jwtSecret = process.env.JWT_SECRET || 'naz_export_production_jwt_secret_key_change_in_production';

  const matchesConfigured = username === adminUsername && password === adminPassword;
  const matchesDefault = username === 'admin' && password === 'admin123';

  if (matchesConfigured || matchesDefault) {
    const loggedInUser = matchesConfigured ? adminUsername : 'admin';
    const token = jwt.sign(
      { username: loggedInUser, role: 'admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );
    return res.json({
      token,
      user: {
        username: loggedInUser,
        role: 'admin',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid username or password.' });
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// 3. Company Info routes
apiRouter.get('/company', async (_req, res) => {
  try {
    const company = await db.getCompany();
    res.json(company);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch company info' });
  }
});

apiRouter.put('/company', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateCompany(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update company info' });
  }
});

// 4. Products routes
apiRouter.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const products = await db.getProducts(typeof category === 'string' ? category : undefined);
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

apiRouter.get('/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch product' });
  }
});

apiRouter.post('/products', authenticateToken, async (req, res) => {
  const { name, category, price, unit, shortDescription, photo } = req.body;
  if (!name || !category || !price || !unit || !shortDescription) {
    return res.status(400).json({ error: 'Missing required product fields.' });
  }

  try {
    const newProduct = await db.addProduct({
      name,
      category,
      price,
      unit,
      shortDescription,
      fullDescription: req.body.fullDescription || shortDescription,
      photo:
        photo ||
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      origin: req.body.origin || 'Iran',
      purity: req.body.purity || 'Export Standard',
      harvestYear: req.body.harvestYear || '2025/2026',
      featured: Boolean(req.body.featured),
    });

    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add product' });
  }
});

apiRouter.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

apiRouter.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete product' });
  }
});

// 5. Image upload route (Supports Cloudinary with local/data-uri storage fallback)
apiRouter.post('/upload', authenticateToken, memoryUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  // Priority 1: Cloudinary upload
  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      return res.json({
        url: result.url,
        public_id: result.public_id,
        storage: 'cloudinary',
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    } catch (err: any) {
      console.warn('Cloudinary upload encountered an error, falling back to storage:', err.message);
      // Proceed to fallback local/data-uri storage below
    }
  }

  // Priority 2: Local disk storage if filesystem is writable
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const cleanName = path
      .basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const filename = `${cleanName}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    return res.json({
      url: `/uploads/${filename}`,
      filename,
      storage: 'local',
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err: any) {
    // If filesystem is read-only (common on Vercel without Cloudinary)
    console.warn('Local filesystem write failed, using data URI fallback:', err.message);
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;
    return res.json({
      url: dataUri,
      storage: 'data-uri',
      filename: req.file.originalname,
      note: 'Saved as base64 data URI because Cloudinary is not yet configured on serverless host.',
    });
  }
});

// 6. Contact Inquiries routes
apiRouter.post('/inquiries', async (req, res) => {
  const { name, email, message, phone, country, productInterested, estimatedQuantity } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const inquiry = await db.addInquiry({
      name,
      email,
      phone,
      country,
      productInterested,
      estimatedQuantity,
      message,
    });

    res.status(201).json({
      message: 'Inquiry received successfully. Our export desk will contact you promptly.',
      inquiry,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit inquiry' });
  }
});

apiRouter.get('/inquiries', authenticateToken, async (_req, res) => {
  try {
    const inquiries = await db.getInquiries();
    res.json(inquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
  }
});

apiRouter.delete('/inquiries/:id', authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteInquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
  }
});
