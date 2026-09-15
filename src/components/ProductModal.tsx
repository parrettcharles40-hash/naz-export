import React, { useEffect } from 'react';
import { Product } from '../types.ts';
import { X, MessageSquare, Mail, ShieldCheck, Check, Package, Calendar, MapPin, Award } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  companyWhatsapp: string;
  companyEmail: string;
  moq: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  companyWhatsapp,
  companyEmail,
  moq,
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  // Exact dynamic WhatsApp url with MOQ
  const whatsappUrl = `https://wa.me/${companyWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi NAZ EXPORT, I'd like to order ${product.name}, MOQ ${moq}`
  )}`;

  const emailUrl = `mailto:${companyEmail}?subject=${encodeURIComponent(
    `Product Inquiry - ${product.name} (MOQ ${moq})`
  )}&body=${encodeURIComponent(
    `Hello NAZ EXPORT Team,\n\nI am inquiring regarding wholesale availability and freight terms for ${product.name} (Minimum Order Quantity: ${moq}).\n\nDestination Country:\nEstimated Volume:\nPackaging Preference:\n\nLooking forward to your quotation.\n`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      id="product-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#CFE4D4] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="product-modal-container"
      >
        {/* Clearly visible X close button in the top-right corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer focus:outline-hidden"
          id="modal-close-button"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Top Section: Photo and Essential Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Box */}
            <div className="md:col-span-6 relative rounded-xl overflow-hidden bg-[#EBF5EE] border border-[#D5EAD9] shadow-inner h-64 sm:h-72">
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#1F3B2C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {product.category}
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-[#CDE5D3] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1F3B2C]">Wholesale MOQ</span>
                <span className="bg-[#1F3B2C] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                  {moq}
                </span>
              </div>
            </div>

            {/* Title & Core Specs */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#3D674D] font-semibold uppercase tracking-wider mb-1">
                  <span>Iranian Export Quality</span>
                  <span>•</span>
                  <span>Direct Farm Gate</span>
                </div>
                <h2 id="modal-product-title" className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1F3B2C] leading-tight">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline space-x-3">
                  <span className="text-2xl font-bold text-[#1F3B2C]">{product.price}</span>
                  <span className="text-xs text-[#5C7E66]">Wholesale baseline per {product.unit}</span>
                </div>
              </div>

              {/* Spec Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9] flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#2D5A3F] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5C7E66] block">Origin</span>
                    <span className="font-semibold text-[#1F3B2C] truncate block">
                      {product.origin || 'Iran'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9] flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#2D5A3F] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5C7E66] block">Purity / Grade</span>
                    <span className="font-semibold text-[#1F3B2C] truncate block">
                      {product.purity || 'Export Grade 1'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9] flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#2D5A3F] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5C7E66] block">Harvest Season</span>
                    <span className="font-semibold text-[#1F3B2C] truncate block">
                      {product.harvestYear || '2025/2026 Fresh'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9] flex items-center space-x-2">
                  <Package className="w-4 h-4 text-[#2D5A3F] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5C7E66] block">Minimum Order</span>
                    <span className="font-bold text-[#1F3B2C] truncate block">{moq}</span>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action inside top */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A3D1E] font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                id="modal-btn-whatsapp-order"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order via WhatsApp (MOQ {moq})</span>
              </a>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-[#E5EFE7]">
            <h3 className="font-cinzel text-base font-bold text-[#1F3B2C]">
              Product Overview & Export Description
            </h3>
            <p className="text-sm text-[#30503D] leading-relaxed font-sans-body">
              {product.fullDescription || product.shortDescription}
            </p>
          </div>

          {/* Export Packaging & Logistics Details */}
          <div className="rounded-xl bg-[#F4F9F5] p-4 sm:p-5 border border-[#CFE4D4] space-y-3">
            <h4 className="text-xs font-bold text-[#1F3B2C] uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2D5A3F]" />
              <span>International Wholesale Packaging & Terms</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#284835]">
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Packaging:</strong> Sealed airtight metal tins, multilayer foil bags, or bulk corrugated export cartons.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Certifications:</strong> Phytosanitary certificates, Certificate of Origin, and SGS/ISO analysis reports available.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Freight:</strong> Expedited air cargo for saffron and herbal blossoms; sea container for bulk nuts and tea.
                </span>
              </div>
            </div>
          </div>

          {/* Dual Action Buttons Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E5EFE7]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#B8D7C1] text-[#1F3B2C] hover:bg-[#EAF6EC] font-semibold text-xs transition-colors"
            >
              Close Window
            </button>

            <a
              href={emailUrl}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E2EFEB] hover:bg-[#D4E7DE] text-[#1F3B2C] border border-[#BDD9C8] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#1F3B2C]" />
              <span>Request Pro-Forma Invoice via Email</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A3D1E] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0A3D1E]" />
              <span>Order via WhatsApp (MOQ {moq})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
