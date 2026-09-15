import React from 'react';
import { CompanyInfo } from '../types.ts';
import { ArrowRight, ShieldCheck, Globe, PackageCheck, Award, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  company: CompanyInfo;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ company, onExploreClick }) => {
  const whatsappUrl = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hi NAZ EXPORT, I would like to inquire about wholesale bulk order (MOQ 20kg).'
  )}`;

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#EAF6EC] via-[#F1F8F1] to-[#E5F2E7]"
    >
      {/* Soft atmospheric background botanical accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C9E7D0]/60 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#D7EEDD]/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Origin & MOQ Pill */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#BEDEC5] shadow-xs text-xs">
              <span className="flex items-center text-[#2D5A3F] font-semibold">
                <Globe className="w-3.5 h-3.5 mr-1 text-[#2D5A3F]" />
                Direct Iranian Origin
              </span>
              <span className="text-[#8FB397]">•</span>
              <span className="bg-[#2D5A3F] text-white font-bold px-2 py-0.5 rounded-full text-[11px] shadow-xs">
                Wholesale MOQ: {company.moq}
              </span>
              <span className="text-[#8FB397] hidden sm:inline">•</span>
              <span className="text-[#3A5D45] hidden sm:inline font-medium">
                Global Air & Sea Logistics
              </span>
            </div>

            {/* Auto Color-Shifting Headline */}
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] animate-color-shift">
              Authentic Iranian Excellence.
              <span className="block font-serif-display italic font-normal text-2xl sm:text-3xl md:text-4xl text-[#3D674D] mt-2">
                Exported Worldwide with Reliability.
              </span>
            </h1>

            {/* Exact Company Tagline */}
            <p className="text-base sm:text-lg text-[#254633] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans-body">
              {company.tagline}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1F3B2C] hover:bg-[#13271D] text-[#EAF6EC] font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
                id="hero-cta-explore"
              >
                <span>View Product Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#0F5132] border border-[#25D366]/40 font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-xs"
                id="hero-cta-whatsapp"
              >
                <MessageSquare className="w-4 h-4 text-[#128C7E]" />
                <span>Order via WhatsApp (MOQ {company.moq})</span>
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-[#D2E7D6] grid grid-cols-3 gap-3 text-left">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1F3B2C] uppercase tracking-wide">100% Guaranteed</h2>
                  <p className="text-[11px] text-[#4A7255]">Pure Origin & Lab Tested</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <PackageCheck className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1F3B2C] uppercase tracking-wide">Export Packaging</h2>
                  <p className="text-[11px] text-[#4A7255]">Vacuum sealed & bulk tin</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Award className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1F3B2C] uppercase tracking-wide">Wholesale MOQ</h2>
                  <p className="text-[11px] text-[#4A7255]">Starting at {company.moq}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3D Visual Card Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative perspective-1000"
          >
            <div className="relative rounded-2xl bg-white/70 backdrop-blur-md p-4 sm:p-5 border border-[#CDE5D3] shadow-xl hover:shadow-2xl transition-all duration-500 transform lg:rotate-1 hover:rotate-0">
              {/* Featured Showcase Item */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=85"
                  alt="Persian Super Negin Saffron Threads"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Badge on visual */}
                <div className="absolute top-3 left-3 bg-[#1F3B2C]/90 backdrop-blur-sm text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                  Top Export Selection
                </div>
                <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  ISO 3632 Cat I
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-medium text-amber-200 uppercase tracking-widest">
                    Grade A Khorasan Red Gold
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-cinzel">
                    Super Negin Saffron
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-emerald-100 font-semibold">$1.80 / gram</span>
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
                      MOQ: {company.moq}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Pillars below image */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9]">
                  <span className="text-[11px] text-[#4A7255] block">Saffron</span>
                  <strong className="text-[#1F3B2C] font-semibold">4 Varieties</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9]">
                  <span className="text-[11px] text-[#4A7255] block">Herbal & Nuts</span>
                  <strong className="text-[#1F3B2C] font-semibold">Organic Grade</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F1F8F1] border border-[#D5EBD9]">
                  <span className="text-[11px] text-[#4A7255] block">Lahijan Tea</span>
                  <strong className="text-[#1F3B2C] font-semibold">Orthodox Flush</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
