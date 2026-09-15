import React, { useState } from 'react';
import { Product } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { Sparkles, Filter, PackageCheck } from 'lucide-react';

interface ProductsSectionProps {
  products: Product[];
  companyWhatsapp: string;
  moq: string;
  onOpenModal: (product: Product) => void;
}

type CategoryTab = 'All' | 'Saffron' | 'Herbal' | 'Nuts' | 'Tea';

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  companyWhatsapp,
  moq,
  onOpenModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');

  const categories: { id: CategoryTab; label: string; count: number }[] = [
    { id: 'All', label: 'All Products', count: products.length },
    {
      id: 'Saffron',
      label: 'Saffron',
      count: products.filter((p) => p.category === 'Saffron').length,
    },
    {
      id: 'Herbal',
      label: 'Herbal Products',
      count: products.filter((p) => p.category === 'Herbal').length,
    },
    {
      id: 'Nuts',
      label: 'Premium Nuts',
      count: products.filter((p) => p.category === 'Nuts').length,
    },
    {
      id: 'Tea',
      label: 'Black Tea',
      count: products.filter((p) => p.category === 'Tea').length,
    },
  ];

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const categoryDescriptions: Record<string, { title: string; subtitle: string }> = {
    All: {
      title: 'Complete Wholesale Export Catalog',
      subtitle:
        'All products sourced directly from Khorasan, Fars, Kerman, and Gilan farming cooperatives, backed by strict phytosanitary and export grade certifications.',
    },
    Saffron: {
      title: 'Persian Red Gold (Saffron)',
      subtitle:
        'Cultivated in the arid, mineral-rich soils of Khorasan. Available in Traditional Dasteh, Super Negin, Sargol, and White Root grades.',
    },
    Herbal: {
      title: 'Herbal Botanicals & Persian Flowers',
      subtitle:
        'Handpicked wild and cultivated organic chamomile, mountainous Shirazi thyme, and fragrant Mohammadi damask rosebuds.',
    },
    Nuts: {
      title: 'Iranian Pistachios & Estahban Dried Figs',
      subtitle:
        'World-renowned Akbari & Fandoghi naturally open in-shell pistachios and sun-cured organic figs from the UNESCO-recognized Estahban valley.',
    },
    Tea: {
      title: 'Gilan & Lahijan Mountain Black Tea',
      subtitle:
        'Single-estate orthodox Persian tea hand-plucked from the emerald mist-covered coastal mountains of Northern Iran.',
    },
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-[#F1F8F1] border-t border-[#DCECDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#E1EFE4] px-3.5 py-1 rounded-full text-xs font-semibold text-[#224A32] border border-[#BFDFCA]">
            <PackageCheck className="w-3.5 h-3.5 text-[#224A32]" />
            <span>Standard Wholesale Minimum: {moq}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3B2C] tracking-tight">
            Export Product Catalog
          </h2>

          <p className="text-sm sm:text-base text-[#3A5D46] font-sans-body">
            {categoryDescriptions[activeCategory].subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/80 backdrop-blur-xs rounded-2xl border border-[#BEDEC5] shadow-xs">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-[#1F3B2C] text-white shadow-md'
                    : 'text-[#2D5A3F] hover:bg-[#EAF6EC] hover:text-[#1F3B2C]'
                }`}
                id={`filter-tab-${tab.id.toLowerCase()}`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E1EFE4] text-[#2D5A3F]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Informative notice bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-white/60 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#D5EBD9] text-xs text-[#3A5D46]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Showing <strong>{filteredProducts.length}</strong> items in{' '}
              <strong>{categoryDescriptions[activeCategory].title}</strong>
            </span>
          </div>
          <div className="font-semibold text-[#1F3B2C]">
            Interactive 3D: Tap any card to flip specifications or click "Quick View"
          </div>
        </div>

        {/* Responsive Grid: 1 col mobile, 2-3 tablet, 3-4 desktop */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              companyWhatsapp={companyWhatsapp}
              moq={moq}
              onOpenModal={onOpenModal}
              cardIndex={idx}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#B8D7C1] mt-8">
            <p className="text-base font-semibold text-[#1F3B2C]">No products found in this category.</p>
            <p className="text-xs text-[#5C7E66] mt-1">Check back soon or add items via the Admin Panel.</p>
          </div>
        )}
      </div>
    </section>
  );
};
