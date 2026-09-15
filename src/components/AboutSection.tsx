import React from 'react';
import { CompanyInfo } from '../types.ts';
import { ShieldCheck, Truck, Award, DollarSign, CheckCircle, Scale, Globe2, FileCheck2, MessageSquare } from 'lucide-react';

interface AboutSectionProps {
  company: CompanyInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ company }) => {
  const whatsappUrl = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi NAZ EXPORT, I would like to learn more about your export terms, MOQ ${company.moq}, and partnership opportunities.`
  )}`;

  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-[#F1F8F1] via-[#EAF6EC] to-[#F1F8F1] border-t border-[#DCECDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Company Profile & Trust Signals */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-[#BEDEC5] text-xs font-semibold text-[#2D5A3F] shadow-xs">
              <Globe2 className="w-3.5 h-3.5 text-[#2D5A3F]" />
              <span>International Trade & B2B Logistics</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3B2C] tracking-tight leading-tight">
              About {company.companyName}
            </h2>

            {/* Official Tagline Highlight */}
            <div className="p-5 rounded-2xl bg-white/80 border-l-4 border-[#2D5A3F] shadow-xs">
              <p className="text-base sm:text-lg text-[#1F3B2C] font-serif-display italic leading-relaxed">
                "{company.tagline}"
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#3A5D46] leading-relaxed font-sans-body">
              Operating directly out of Iran's most distinguished agricultural hubs—from the saffron fields of Khorasan to the fragrant rose gardens of Kashan and ancient pistachio groves of Kerman—we eliminate intermediaries. Our direct farm-gate sourcing guarantees traceable provenance, uncompromising laboratory purity, and high-volume commercial consistency.
            </p>

            {/* Four Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/70 border border-[#CDE5D3] flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F3B2C]">Uncompromising Quality</h3>
                  <p className="text-xs text-[#52795E] mt-0.5 leading-normal">
                    Certified ISO 3632 Saffron standards, aflatoxin-screened nuts, and pure organic botanicals.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#CDE5D3] flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F3B2C]">Competitive Direct Pricing</h3>
                  <p className="text-xs text-[#52795E] mt-0.5 leading-normal">
                    Eliminating multi-tiered brokers delivers genuine wholesale farm-gate rates for commercial importers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#CDE5D3] flex items-start space-x-3">
                <Truck className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F3B2C]">Global Export Logistics</h3>
                  <p className="text-xs text-[#52795E] mt-0.5 leading-normal">
                    Expedited air cargo delivery for perishable saffron flowers, alongside 20ft/40ft container freight.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#CDE5D3] flex items-start space-x-3">
                <FileCheck2 className="w-5 h-5 text-[#2D5A3F] shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F3B2C]">Full Documentation</h3>
                  <p className="text-xs text-[#52795E] mt-0.5 leading-normal">
                    Phytosanitary health certs, Certificate of Origin (COO), and third-party laboratory test reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Wholesale MOQ Highlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1F3B2C] via-[#1A3326] to-[#0F2217] text-white p-7 sm:p-9 shadow-2xl border border-[#2D5A3F] overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                      Wholesale Policy
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                    B2B Commercial Only
                  </span>
                </div>

                <div>
                  <span className="text-xs text-emerald-300 uppercase tracking-widest block font-medium">
                    Minimum Order Quantity
                  </span>
                  <div className="text-4xl sm:text-5xl font-cinzel font-bold text-white mt-1 flex items-baseline space-x-2">
                    <span>{company.moq}</span>
                    <span className="text-sm font-normal text-emerald-300">(20 Kilograms)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 font-sans-body leading-relaxed">
                    To maintain rigorous quality controls, standardized international phytosanitary customs documentation, and commercial freight rates, all export shipments start at a baseline of <strong>{company.moq}</strong>.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 text-xs text-emerald-100/90 border-t border-emerald-800/60">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Mixed-product 20 KG consolidated trial shipments available</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hermetic bulk metal tins & food-grade nitrogen flushed bags</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Private labeling (OEM) available for orders exceeding 100 KG</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>FOB Bandar Abbas, CIF Dubai, or CIP European Airport freight</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A3D1E] font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:-translate-y-0.5"
                    id="about-btn-whatsapp-inquiry"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire About MOQ {company.moq} via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
