import React, { useState } from 'react';
import { Product } from '../types.ts';
import { MessageSquare, RotateCw, Eye, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  companyWhatsapp: string;
  moq: string;
  onOpenModal: (product: Product) => void;
  cardIndex: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  companyWhatsapp,
  moq,
  onOpenModal,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Dynamic WhatsApp prefilled link with exact specified format
  const whatsappUrl = `https://wa.me/${companyWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi NAZ EXPORT, I'd like to order ${product.name}, MOQ ${moq}`
  )}`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid flipping when clicking on actual buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Saffron':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Herbal':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Nuts':
        return 'bg-stone-100 text-stone-900 border-stone-300';
      case 'Tea':
        return 'bg-amber-950/10 text-amber-950 border-amber-800/20';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div
      className="perspective-1000 w-full h-[430px] group cursor-pointer"
      onClick={handleCardClick}
      id={`product-card-${product.id}`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ===================== FRONT SIDE ===================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-white border border-[#CFE4D4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
          {/* Product Image Box */}
          <div className="relative h-52 w-full overflow-hidden bg-[#EDF6EF]">
            <img
              src={product.photo}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback in case of broken image URL
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

            {/* Category Tag */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs uppercase tracking-wider ${getCategoryColor(
                  product.category
                )}`}
              >
                {product.category}
              </span>
            </div>

            {/* Prominent MOQ Badge on every card */}
            <div className="absolute top-3 right-3 bg-[#1F3B2C]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-[#3D674D] shadow-xs flex items-center space-x-1">
              <span>MOQ: {moq}</span>
            </div>

            {/* Quick action button overlay */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(product);
                }}
                className="bg-white/90 hover:bg-white text-[#1F3B2C] text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm backdrop-blur-xs flex items-center space-x-1 transition-colors"
                title="Quick View full details"
              >
                <Eye className="w-3.5 h-3.5 text-[#2D5A3F]" />
                <span>Quick View</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="bg-[#1F3B2C]/90 hover:bg-[#1F3B2C] text-white p-1.5 rounded-lg shadow-sm transition-colors"
                title="Flip for specifications"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
            <div>
              {product.origin && (
                <div className="flex items-center text-[11px] text-[#4A7255] font-medium mb-1 space-x-1">
                  <MapPin className="w-3 h-3 text-[#2D5A3F]" />
                  <span className="truncate">{product.origin}</span>
                </div>
              )}
              <h3 className="font-cinzel font-bold text-lg text-[#1F3B2C] line-clamp-1 group-hover:text-[#2D5A3F] transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-[#4A6452] mt-1.5 line-clamp-2 leading-relaxed font-sans-body">
                {product.shortDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5EFE7] mt-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-[#5C7E66] block uppercase tracking-wider font-semibold">
                    Wholesale Price
                  </span>
                  <div className="text-lg font-bold text-[#1F3B2C]">
                    {product.price}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#2D5A3F] font-semibold bg-[#EAF6EC] px-2 py-0.5 rounded border border-[#CDE5D3]">
                    Min. {moq}
                  </span>
                </div>
              </div>

              {/* Tap to flip hint */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#7A9C83] pt-1">
                <span className="flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                  Grade: {product.purity || 'Export Standard'}
                </span>
                <span className="text-[11px] text-[#2D5A3F] font-medium group-hover:underline flex items-center">
                  Tap to flip <RotateCw className="w-2.5 h-2.5 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== BACK SIDE (FLIPPED) ===================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b from-[#1F3B2C] to-[#15281E] text-white p-5 shadow-xl border border-[#2D5A3F] flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                  {product.category} Specifications
                </span>
                <h4 className="font-cinzel font-bold text-base text-white truncate max-w-[200px]">
                  {product.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition-colors"
                title="Flip back to front"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description & Export Points */}
            <div className="mt-3 space-y-3 text-xs text-emerald-100/90 font-sans-body leading-relaxed">
              <p>{product.fullDescription || product.shortDescription}</p>

              <div className="space-y-1.5 pt-2 border-t border-emerald-800/40">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80">Regional Origin:</span>
                  <span className="font-semibold text-white">{product.origin || 'Iran'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80">Export Grade:</span>
                  <span className="font-semibold text-emerald-200">{product.purity || 'Laboratory Certified'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80">Minimum Order (MOQ):</span>
                  <span className="font-bold text-amber-300">{moq}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80">Indicative Pricing:</span>
                  <span className="font-bold text-white">{product.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons on Back */}
          <div className="mt-4 space-y-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A3D1E] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-colors"
              id={`order-whatsapp-${product.id}`}
            >
              <MessageSquare className="w-4 h-4 text-[#0A3D1E]" />
              <span>Order via WhatsApp (MOQ {moq})</span>
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(product);
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs flex items-center justify-center space-x-1 border border-emerald-700/50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-300" />
              <span>Full Details & Packaging Options</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
