import { Product, CompanyInfo, Inquiry, AuthResponse } from '../types.ts';

const TOKEN_KEY = 'naz_export_admin_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getAuthHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Company Info
export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const res = await fetch('/api/company');
  if (!res.ok) {
    throw new Error('Failed to fetch company information');
  }
  return res.json();
}

export async function updateCompanyInfo(company: Partial<CompanyInfo>): Promise<CompanyInfo> {
  const res = await fetch('/api/company', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(company),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Update failed' }));
    throw new Error(error.error || 'Failed to update company info');
  }
  return res.json();
}

// Products
export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category && category !== 'All' ? `/api/products?category=${encodeURIComponent(category)}` : '/api/products';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Create failed' }));
    throw new Error(error.error || 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Update failed' }));
    throw new Error(error.error || 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Delete failed' }));
    throw new Error(error.error || 'Failed to delete product');
  }
}

// Image upload
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await res.json();
  return data.url;
}

// Inquiries
export async function submitInquiry(inquiry: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  productInterested?: string;
  estimatedQuantity?: string;
  message: string;
}): Promise<{ message: string; inquiry: Inquiry }> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inquiry),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(error.error || 'Failed to submit inquiry');
  }
  return res.json();
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await fetch('/api/inquiries', {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch inquiries');
  }
  return res.json();
}

export async function deleteInquiry(id: string): Promise<void> {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete inquiry');
  }
}

// Auth
export async function loginAdmin(credentials: { username: string; password: string }): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Authentication failed' }));
    throw new Error(error.error || 'Invalid credentials');
  }
  const data: AuthResponse = await res.json();
  setStoredToken(data.token);
  return data;
}

export async function verifyCurrentAuth(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
