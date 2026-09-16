export type ProductCategory = 'Saffron' | 'Herbal' | 'Nuts' | 'Tea';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
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
  heroProductId?: string;
  updatedAt?: string;
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
