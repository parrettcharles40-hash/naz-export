import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { db } from './db.ts';

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'naz-export-super-secret-key-2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create uploads directory (may be read-only in serverless):', e);
  }
}

// Multer disk storage for product photo uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded as { username: string; role: string };
    next();
  });
}

// ======================== API ROUTES ========================

// 1. Health check
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NAZ EXPORT API', timestamp: new Date().toISOString() });
});

// 2. Auth routes
apiRouter.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({
      token,
      user: {
        username: ADMIN_USERNAME,
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
apiRouter.get('/company', (_req, res) => {
  const company = db.getCompany();
  res.json(company);
});

apiRouter.put('/company', authenticateToken, (req, res) => {
  const updated = db.updateCompany(req.body);
  res.json(updated);
});

// 4. Products routes
apiRouter.get('/products', (req, res) => {
  const { category } = req.query;
  const products = db.getProducts(typeof category === 'string' ? category : undefined);
  res.json(products);
});

apiRouter.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
});

apiRouter.post('/products', authenticateToken, (req, res) => {
  const { name, category, price, unit, shortDescription, photo } = req.body;
  if (!name || !category || !price || !unit || !shortDescription) {
    return res.status(400).json({ error: 'Missing required product fields.' });
  }

  const newProduct = db.addProduct({
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
});

apiRouter.put('/products/:id', authenticateToken, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(updated);
});

apiRouter.delete('/products/:id', authenticateToken, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ message: 'Product deleted successfully', id: req.params.id });
});

// 5. Image upload route
apiRouter.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

// 6. Contact Inquiries routes
apiRouter.post('/inquiries', (req, res) => {
  const { name, email, message, phone, country, productInterested, estimatedQuantity } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const inquiry = db.addInquiry({
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
});

apiRouter.get('/inquiries', authenticateToken, (_req, res) => {
  const inquiries = db.getInquiries();
  res.json(inquiries);
});

apiRouter.delete('/inquiries/:id', authenticateToken, (req, res) => {
  const success = db.deleteInquiry(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Inquiry not found.' });
  }
  res.json({ message: 'Inquiry deleted successfully' });
});
