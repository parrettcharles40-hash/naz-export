import React, { useState, useEffect } from 'react';
import { Product, CompanyInfo, Inquiry, ProductCategory } from '../types.ts';
import {
  loginAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  updateCompanyInfo,
  fetchInquiries,
  deleteInquiry,
  removeStoredToken,
} from '../services/api.ts';
import {
  X,
  Lock,
  Package,
  Building2,
  Inbox,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  AlertCircle,
  LogOut,
  Image as ImageIcon,
  RotateCcw,
  Star,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  company: CompanyInfo;
  onProductsUpdated: (products: Product[]) => void;
  onCompanyUpdated: (company: CompanyInfo) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  company,
  onProductsUpdated,
  onCompanyUpdated,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'company' | 'inquiries'>('products');

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Products state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Saffron' as ProductCategory,
    price: '$1.50/gram',
    unit: 'gram',
    shortDescription: '',
    fullDescription: '',
    photo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Khorasan, Iran',
    purity: 'Grade 1 ISO 3632',
    harvestYear: '2025/2026',
    featured: false,
  });

  // Company form state
  const [companyForm, setCompanyForm] = useState<CompanyInfo>(company);
  const [companySaving, setCompanySaving] = useState(false);
  const [companySuccess, setCompanySuccess] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Keep companyForm in sync
  useEffect(() => {
    setCompanyForm(company);
  }, [company]);

  // Load inquiries when tab changes
  useEffect(() => {
    if (isLoggedIn && activeTab === 'inquiries') {
      loadInquiries();
    }
  }, [isLoggedIn, activeTab]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await loginAdmin({ username, password });
      setIsLoggedIn(true);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    removeStoredToken();
    setIsLoggedIn(false);
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadImage(file);
      setProductForm((prev) => ({ ...prev, photo: uploadedUrl }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, productForm);
        const newProducts = products.map((p) => (p.id === editingProduct.id ? updated : p));
        onProductsUpdated(newProducts);
        
        // If product was toggled as featured, also synchronize company.heroProductId
        if (productForm.featured && company.heroProductId !== editingProduct.id) {
          const updatedCompany = { ...company, heroProductId: editingProduct.id };
          updateCompanyInfo(updatedCompany)
            .then((saved) => onCompanyUpdated(saved))
            .catch(console.error);
        }
        setEditingProduct(null);
      } else {
        const created = await createProduct(productForm);
        onProductsUpdated([created, ...products]);
        if (productForm.featured) {
          const updatedCompany = { ...company, heroProductId: created.id };
          updateCompanyInfo(updatedCompany)
            .then((saved) => onCompanyUpdated(saved))
            .catch(console.error);
        }
        setIsAddingNew(false);
      }
      // Reset form
      setProductForm({
        name: '',
        category: 'Saffron',
        price: '$1.50/gram',
        unit: 'gram',
        shortDescription: '',
        fullDescription: '',
        photo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        origin: 'Khorasan, Iran',
        purity: 'Grade 1 ISO 3632',
        harvestYear: '2025/2026',
        featured: false,
      });
    } catch (err: any) {
      alert(`Failed to save product: ${err.message}`);
    }
  };

  const handleSetHeroFeatured = async (product: Product) => {
    try {
      const updatedCompany = { ...company, heroProductId: product.id };
      const saved = await updateCompanyInfo(updatedCompany);
      onCompanyUpdated(saved);
      setCompanyForm(saved);
      // Ensure local state reflects featured item
      const updatedList = products.map((p) => ({
        ...p,
        featured: p.id === product.id,
      }));
      onProductsUpdated(updatedList);
    } catch (err: any) {
      alert(`Failed to update hero showcase product: ${err.message}`);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsAddingNew(false);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription || product.shortDescription,
      photo: product.photo,
      origin: product.origin || 'Iran',
      purity: product.purity || 'Export Standard',
      harvestYear: product.harvestYear || '2025/2026',
      featured: Boolean(product.featured),
    });
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      try {
        await deleteProduct(id);
        const remaining = products.filter((p) => p.id !== id);
        onProductsUpdated(remaining);
      } catch (err: any) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  // Save company info
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanySuccess(false);
    try {
      const updated = await updateCompanyInfo(companyForm);
      onCompanyUpdated(updated);
      setCompanySuccess(true);
      setTimeout(() => setCompanySuccess(false), 4000);
    } catch (err: any) {
      alert(`Failed to update company info: ${err.message}`);
    } finally {
      setCompanySaving(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm('Delete this inquiry record?')) {
      try {
        await deleteInquiry(id);
        setInquiries(inquiries.filter((i) => i.id !== id));
      } catch (err: any) {
        alert(`Failed to delete inquiry: ${err.message}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      id="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-[#BEDEC5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="admin-modal-container"
      >
        {/* Top Header Bar */}
        <div className="bg-[#1F3B2C] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/60 flex items-center justify-center text-emerald-200 font-cinzel font-bold text-sm">
              NE
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide">
                NAZ EXPORT — Management Panel
              </h2>
              <span className="text-[11px] text-emerald-300">
                Live Database & Content Controller
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-850 text-emerald-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Log out of Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            {/* Clearly visible X close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-hidden"
              aria-label="Close admin panel"
              id="admin-close-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isLoggedIn ? (
          /* ================= LOGIN VIEW ================= */
          <div className="p-8 sm:p-12 overflow-y-auto max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF6EC] text-[#2D5A3F] flex items-center justify-center mx-auto border border-[#C2E0C9] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-cinzel text-2xl font-bold text-[#1F3B2C]">
                Admin Authentication
              </h3>
              <p className="text-xs text-[#52795E] mt-1 font-sans-body">
                Please enter your credentials to manage products, pricing, and company information.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left text-xs">
              <div>
                <label className="block font-semibold text-[#1F3B2C] mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] text-xs focus:bg-white focus:outline-hidden focus:border-[#2D5A3F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F3B2C] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] text-xs focus:bg-white focus:outline-hidden focus:border-[#2D5A3F]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F1F8F1] border border-[#D5EBD9] text-[11px] text-[#3A5D46] space-y-1">
                <span className="font-bold block text-[#1F3B2C]">Default Credentials:</span>
                <div>Username: <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#CDE5D3]">admin</code></div>
                <div>Password: <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#CDE5D3]">admin123</code></div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#1F3B2C] hover:bg-[#152B20] text-white font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                id="admin-login-submit"
              >
                {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED DASHBOARD ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-[#D8EADB] bg-[#F7FCF8] px-6">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className={`py-3.5 px-4 font-semibold text-xs sm:text-sm flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'products'
                    ? 'border-[#2D5A3F] text-[#1F3B2C] bg-white'
                    : 'border-transparent text-[#52795E] hover:text-[#1F3B2C]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('company')}
                className={`py-3.5 px-4 font-semibold text-xs sm:text-sm flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'company'
                    ? 'border-[#2D5A3F] text-[#1F3B2C] bg-white'
                    : 'border-transparent text-[#52795E] hover:text-[#1F3B2C]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Company Info & MOQ</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-3.5 px-4 font-semibold text-xs sm:text-sm flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'inquiries'
                    ? 'border-[#2D5A3F] text-[#1F3B2C] bg-white'
                    : 'border-transparent text-[#52795E] hover:text-[#1F3B2C]'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Inquiries Inbox ({inquiries.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* ========== 1. PRODUCTS TAB ========== */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5EFE7]">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#1F3B2C]">
                        {isAddingNew ? 'Add New Product' : editingProduct ? `Edit: ${editingProduct.name}` : 'Product Inventory'}
                      </h3>
                      <p className="text-xs text-[#52795E]">
                        All price, photo, and description updates reflect instantly on the public website.
                      </p>
                    </div>

                    {!isAddingNew && !editingProduct && (
                      <button
                        onClick={() => {
                          setIsAddingNew(true);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#2D5A3F] hover:bg-[#1F3B2C] text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                        id="admin-btn-add-product"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Export Product</span>
                      </button>
                    )}

                    {(isAddingNew || editingProduct) && (
                      <button
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingProduct(null);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-[#BEDEC5] text-[#2D5A3F] hover:bg-[#EAF6EC] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Cancel & Return to List
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Form */}
                  {(isAddingNew || editingProduct) ? (
                    <form onSubmit={handleSaveProduct} className="bg-[#F7FCF8] p-6 rounded-2xl border border-[#BEDEC5] space-y-5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Product Name *</label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="e.g. Super Negin Saffron"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Category *</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          >
                            <option value="Saffron">Saffron</option>
                            <option value="Herbal">Herbal Products</option>
                            <option value="Nuts">Premium Nuts</option>
                            <option value="Tea">Black Tea</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Wholesale Price (Displayed) *</label>
                          <input
                            type="text"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            placeholder="e.g. $1.80/gram or $24.00/kg"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Unit *</label>
                          <input
                            type="text"
                            required
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                            placeholder="e.g. gram, kg, pack"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Iranian Origin</label>
                          <input
                            type="text"
                            value={productForm.origin}
                            onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                            placeholder="e.g. Khorasan, Iran"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Purity / Export Grade</label>
                          <input
                            type="text"
                            value={productForm.purity}
                            onChange={(e) => setProductForm({ ...productForm, purity: e.target.value })}
                            placeholder="e.g. ISO 3632 Category I"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#1F3B2C] mb-1">Harvest Season</label>
                          <input
                            type="text"
                            value={productForm.harvestYear}
                            onChange={(e) => setProductForm({ ...productForm, harvestYear: e.target.value })}
                            placeholder="e.g. 2025/2026 Fresh"
                            className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                          />
                        </div>
                      </div>

                      {/* Photo Upload / URL */}
                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">Product Photo</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#BEDEC5] shrink-0">
                            {productForm.photo ? (
                              <img
                                src={productForm.photo}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#BEDEC5]">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <input
                              type="text"
                              value={productForm.photo}
                              onChange={(e) => setProductForm({ ...productForm, photo: e.target.value })}
                              placeholder="Image URL or upload below..."
                              className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                            />

                            <div className="flex items-center space-x-2">
                              <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#EAF6EC] hover:bg-[#D5EBD9] text-[#1F3B2C] font-semibold text-xs border border-[#BEDEC5] cursor-pointer transition-colors">
                                <Upload className="w-3.5 h-3.5 text-[#2D5A3F]" />
                                <span>{uploadingImage ? 'Uploading Image...' : 'Upload from Local Device'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  disabled={uploadingImage}
                                />
                              </label>
                              <span className="text-[11px] text-[#7A9C83]">
                                Multer saves to /uploads immediately
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">Short Description (Front Card) *</label>
                        <textarea
                          required
                          rows={2}
                          value={productForm.shortDescription}
                          onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                          placeholder="Brief summary displayed on front side of product card..."
                          className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">Full Export Description (Flipped Card & Modal)</label>
                        <textarea
                          rows={3}
                          value={productForm.fullDescription}
                          onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                          placeholder="Comprehensive details on botanical profile, harvest process, packaging..."
                          className="w-full px-3.5 py-2 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>

                      {/* Feature on Homepage Hero Toggle */}
                      <div className="p-3 bg-[#EAF6EC] rounded-xl border border-[#BEDEC5] flex items-start space-x-2.5">
                        <input
                          type="checkbox"
                          id="admin-form-hero-featured"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="mt-0.5 w-4 h-4 text-[#2D5A3F] rounded border-[#BEDEC5] focus:ring-[#2D5A3F] cursor-pointer"
                        />
                        <label htmlFor="admin-form-hero-featured" className="text-xs text-[#1F3B2C] cursor-pointer select-none">
                          <span className="font-bold flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                            <span>Feature in Homepage Hero Showcase</span>
                          </span>
                          <span className="text-[11px] text-[#52795E] block mt-0.5">
                            Displays this product's photo, grade, and pricing dynamically on the homepage hero banner card.
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#BEDEC5]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 rounded-xl border border-[#BEDEC5] text-[#2D5A3F] font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#1F3B2C] hover:bg-[#152B20] text-white font-bold text-xs shadow-md transition-colors"
                        >
                          {editingProduct ? 'Save Changes' : 'Create Product'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Products Table */
                    <div className="overflow-x-auto rounded-2xl border border-[#BEDEC5]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#EAF6EC] text-[#1F3B2C] border-b border-[#BEDEC5] font-semibold">
                            <th className="py-3 px-4">Photo</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Origin</th>
                            <th className="py-3 px-4">Hero Showcase</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5EFE7]">
                          {products.map((p) => {
                            const isHeroItem =
                              company.heroProductId === p.id ||
                              (!company.heroProductId && (p.id === 'saffron-super-negin' || p.name.toLowerCase().includes('super negin')));

                            return (
                              <tr key={p.id} className="hover:bg-[#F7FCF8] transition-colors">
                                <td className="py-3 px-4">
                                  <img
                                    src={p.photo}
                                    alt={p.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-[#BEDEC5]"
                                    referrerPolicy="no-referrer"
                                  />
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#1F3B2C]">
                                  {p.name}
                                  <span className="block text-[10px] text-[#52795E] truncate max-w-xs">
                                    {p.shortDescription}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-md bg-[#E1EFE4] text-[#224A32] text-[11px] font-medium">
                                    {p.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-[#1F3B2C]">{p.price}</td>
                                <td className="py-3 px-4 text-[#52795E]">{p.origin || 'Iran'}</td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {isHeroItem ? (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                                      <span>Active in Hero</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSetHeroFeatured(p)}
                                      className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-[#3D674D] hover:text-[#1F3B2C] bg-[#EAF6EC] hover:bg-[#D5EBD9] border border-[#BEDEC5] transition-colors cursor-pointer"
                                      title="Set this product as the Homepage Hero Showcase"
                                    >
                                      <Star className="w-3 h-3 text-[#52795E]" />
                                      <span>Set as Hero</span>
                                    </button>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleEditClick(p)}
                                    className="p-1.5 rounded-lg bg-[#EAF6EC] hover:bg-[#D5EBD9] text-[#2D5A3F] transition-colors"
                                    title="Edit product"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClick(p.id, p.name)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========== 2. COMPANY INFO & MOQ TAB ========== */}
              {activeTab === 'company' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#1F3B2C]">
                      Company Profile & Wholesale Policy
                    </h3>
                    <p className="text-xs text-[#52795E]">
                      Update contact numbers, email, LinkedIn, MOQ requirements, and exact brand tagline.
                    </p>
                  </div>

                  {companySuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Company details updated successfully. Live site has been refreshed.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveCompany} className="bg-[#F7FCF8] p-6 rounded-2xl border border-[#BEDEC5] space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={companyForm.companyName}
                          onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">
                          Minimum Order Quantity (MOQ) *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyForm.moq}
                          onChange={(e) => setCompanyForm({ ...companyForm, moq: e.target.value })}
                          placeholder="20 KG"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1F3B2C] mb-1">Official Company Tagline *</label>
                      <textarea
                        required
                        rows={3}
                        value={companyForm.tagline}
                        onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1F3B2C] mb-1">WhatsApp Export Number *</label>
                        <input
                          type="text"
                          required
                          value={companyForm.whatsapp}
                          onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                          placeholder="+989010192169"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#1F3B2C] mb-1">LinkedIn Corporate URL *</label>
                      <input
                        type="url"
                        required
                        value={companyForm.linkedin}
                        onChange={(e) => setCompanyForm({ ...companyForm, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs focus:outline-hidden focus:border-[#2D5A3F]"
                      />
                    </div>

                    <div className="p-4 bg-[#EAF6EC] rounded-xl border border-[#BEDEC5] space-y-2">
                      <label className="block font-bold text-[#1F3B2C] text-xs">
                        Homepage Hero Featured Product Selection
                      </label>
                      <select
                        value={
                          companyForm.heroProductId ||
                          products.find((p) => p.id === 'saffron-super-negin' || p.name.toLowerCase().includes('super negin'))?.id ||
                          products[0]?.id ||
                          ''
                        }
                        onChange={(e) => setCompanyForm({ ...companyForm, heroProductId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-white text-xs font-medium focus:outline-hidden focus:border-[#2D5A3F]"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.category} — {p.price})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-[#52795E]">
                        This determines which product is dynamically displayed in the large card on the homepage hero section. When you edit that product's photo, price, or specifications, it updates instantly.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={companySaving}
                        className="py-3 px-6 rounded-xl bg-[#1F3B2C] hover:bg-[#152B20] text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                        id="admin-btn-save-company"
                      >
                        {companySaving ? 'Saving Updates...' : 'Save Company Information'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========== 3. INQUIRIES TAB ========== */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5EFE7]">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#1F3B2C]">
                        Wholesale Inquiries Received
                      </h3>
                      <p className="text-xs text-[#52795E]">
                        Customer requests submitted through the contact desk.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadInquiries}
                      className="px-3 py-1.5 rounded-lg border border-[#BEDEC5] text-[#2D5A3F] text-xs font-semibold hover:bg-[#EAF6EC] flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {inquiriesLoading ? (
                    <div className="text-center py-12 text-xs text-[#52795E]">
                      Loading inquiries inbox...
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-16 bg-[#F7FCF8] rounded-2xl border border-dashed border-[#BEDEC5]">
                      <Inbox className="w-10 h-10 text-[#BEDEC5] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#1F3B2C]">No inquiries received yet.</p>
                      <p className="text-xs text-[#52795E] mt-1">
                        Any quotation submitted on the public site will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-2xl bg-[#F7FCF8] border border-[#BEDEC5] hover:border-[#2D5A3F] transition-colors space-y-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5EFE7] pb-2">
                            <div>
                              <strong className="text-sm text-[#1F3B2C]">{inq.name}</strong>
                              <span className="text-[#52795E] ml-2">({inq.email})</span>
                              {inq.phone && <span className="text-[#2D5A3F] ml-2 font-mono">{inq.phone}</span>}
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="text-[11px] text-[#7A9C83]">
                                {new Date(inq.createdAt).toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#3D674D]">
                            {inq.country && <div><strong>Location:</strong> {inq.country}</div>}
                            {inq.productInterested && <div><strong>Product:</strong> {inq.productInterested}</div>}
                            {inq.estimatedQuantity && <div><strong>Volume:</strong> {inq.estimatedQuantity}</div>}
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-[#E5EFE7] text-[#254633] leading-relaxed">
                            {inq.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
