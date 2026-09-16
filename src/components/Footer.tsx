import React from 'react';
import { CompanyInfo } from '../types.ts';
import { MessageSquare, Mail, Linkedin, ArrowUp } from 'lucide-react';

interface FooterProps {
  company: CompanyInfo;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ company }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hi NAZ EXPORT, I would like to inquire about wholesale bulk export orders.'
  )}`;
  const emailUrl = `mailto:${company.email}?subject=${encodeURIComponent('Product Inquiry - NAZ EXPORT')}`;

  return (
    <footer className="bg-[#15291E] text-[#D0E5D5] border-t border-[#234532] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#234532]">
          {/* Brand & Exact Tagline */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A3F] flex items-center justify-center text-emerald-100 font-cinzel font-bold text-lg border border-emerald-400/30">
                NE
              </div>
              <span className="font-cinzel text-2xl font-bold tracking-wider text-white">
                {company.companyName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A8CCA7] leading-relaxed max-w-lg font-sans-body">
              "{company.tagline}"
            </p>

            <div className="flex items-center space-x-2 pt-2 text-xs text-emerald-200">
              <span className="bg-[#2D5A3F] px-2.5 py-1 rounded text-white font-bold text-[11px]">
                MOQ: {company.moq}
              </span>
              <span>• Certified Iranian Agro-Export Corporation</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-emerald-300 transition-colors">Home & Overview</a>
              </li>
              <li>
                <a href="#products" className="hover:text-emerald-300 transition-colors">Export Product Catalog</a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-300 transition-colors">About & Wholesale MOQ</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-300 transition-colors">Direct Contact Desk</a>
              </li>
            </ul>
          </div>

          {/* Direct Communication Channels */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Export Communications
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp: {company.whatsapp}</span>
              </a>

              <a
                href={emailUrl}
                className="flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{company.email}</span>
              </a>

              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#0077B5] shrink-0" />
                <span>LinkedIn Corporate Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B9F87] gap-4">
          <p>
            © {new Date().getFullYear()} {company.companyName}. All international commercial rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
