import { useState, useEffect, useCallback } from 'react';
import { Product, CompanyInfo } from './types.ts';
import { fetchProducts, fetchCompanyInfo, verifyCurrentAuth } from './services/api.ts';
import { INITIAL_PRODUCTS, INITIAL_COMPANY } from './data/seedProducts.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductsSection } from './components/ProductsSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { StickyMoqBadge } from './components/StickyMoqBadge.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';

export default function App() {
  const [company, setCompany] = useState<CompanyInfo>(INITIAL_COMPANY);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Sync admin modal visibility with URL route (/admin or #admin)
  const openAdmin = useCallback(() => {
    setIsAdminOpen(true);
    if (window.location.pathname !== '/admin') {
      try {
        window.history.pushState({}, '', '/admin');
      } catch (e) {
        window.location.hash = '#admin';
      }
    }
  }, []);

  const closeAdmin = useCallback(() => {
    setIsAdminOpen(false);
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {
        window.location.hash = '';
      }
    }
  }, []);

  // Initial data loading & route checking
  useEffect(() => {
    async function loadData() {
      try {
        const [compData, prodData] = await Promise.all([
          fetchCompanyInfo().catch(() => INITIAL_COMPANY),
          fetchProducts().catch(() => INITIAL_PRODUCTS),
        ]);
        if (compData) {
          setCompany(compData);
        }
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }
      } catch (err) {
        console.error('Error loading API data, using default catalog', err);
      }
    }

    loadData();

    // Check if admin is currently authenticated
    verifyCurrentAuth().then((isValid) => {
      setIsAdminLoggedIn(isValid);
    });

    // Check if initial URL is /admin or #admin
    const isInitialAdmin =
      window.location.pathname === '/admin' ||
      window.location.pathname === '/admin/' ||
      window.location.hash === '#admin';
    if (isInitialAdmin) {
      setIsAdminOpen(true);
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const isAdminRoute =
        window.location.pathname === '/admin' ||
        window.location.pathname === '/admin/' ||
        window.location.hash === '#admin';
      setIsAdminOpen(isAdminRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F8F3] text-[#1F3B2C] font-sans-body relative">
      {/* Header with Continuous Scrolling Marquee */}
      <Header
        company={company}
        onOpenAdmin={openAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Hero with auto color-shifting text animation */}
        <Hero company={company} onExploreClick={handleExploreClick} />

        {/* Products Section */}
        <ProductsSection
          products={products}
          companyWhatsapp={company.whatsapp}
          moq={company.moq}
          onOpenModal={(prod) => setSelectedProduct(prod)}
        />

        {/* About & MOQ Section */}
        <AboutSection company={company} />

        {/* Contact & Quotation Desk Section */}
        <ContactSection company={company} />
      </main>

      {/* Footer */}
      <Footer company={company} onOpenAdmin={openAdmin} />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        companyWhatsapp={company.whatsapp}
        companyEmail={company.email}
        moq={company.moq}
      />

      {/* Sticky Floating MOQ Badge */}
      <StickyMoqBadge moq={company.moq} whatsapp={company.whatsapp} />

      {/* Admin Panel Modal / Dashboard */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={closeAdmin}
        products={products}
        company={company}
        onProductsUpdated={(newProducts) => setProducts(newProducts)}
        onCompanyUpdated={(newCompany) => setCompany(newCompany)}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}
