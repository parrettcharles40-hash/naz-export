import React, { useState } from 'react';
import { MessageSquare, Scale, ChevronRight, X } from 'lucide-react';

interface StickyMoqBadgeProps {
  moq: string;
  whatsapp: string;
}

export const StickyMoqBadge: React.FC<StickyMoqBadgeProps> = ({ moq, whatsapp }) => {
  const [minimized, setMinimized] = useState(false);

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi NAZ EXPORT, I'd like to order wholesale Iranian products, MOQ ${moq}`
  )}`;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-40 bg-[#1F3B2C] text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-emerald-500/40 flex items-center space-x-2 text-xs font-bold hover:scale-105 transition-all"
        title="Show Wholesale MOQ Badge"
        id="sticky-moq-minimized"
      >
        <Scale className="w-4 h-4 text-emerald-400" />
        <span>MOQ: {moq}</span>
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-5 right-5 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#BEDEC5] p-3.5 sm:p-4 animate-in slide-in-from-bottom-5 duration-300"
      id="sticky-moq-badge"
      aria-label="Minimum Order Quantity Notice"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF6EC] text-[#2D5A3F] flex items-center justify-center shrink-0 border border-[#BEDEC5]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A7255]">Wholesale Policy</span>
              <span className="bg-[#2D5A3F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                MOQ {moq}
              </span>
            </div>
            <p className="text-xs font-bold text-[#1F3B2C] mt-0.5">Minimum Export Order: {moq}</p>
          </div>
        </div>

        <button
          onClick={() => setMinimized(true)}
          className="text-[#5C7E66] hover:text-[#1F3B2C] p-1 rounded-md transition-colors"
          title="Minimize badge"
          aria-label="Minimize badge"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-[#4A6E53] mt-2 font-sans-body leading-snug">
        Worldwide expedited air & ocean freight directly from Iranian cooperatives.
      </p>

      <div className="mt-2.5 pt-2 border-t border-[#E5EFE7] flex items-center justify-between">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A3D1E] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          id="sticky-moq-whatsapp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Quick WhatsApp Inquiry</span>
          <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
