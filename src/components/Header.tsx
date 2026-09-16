import React, { useState } from 'react';
import { CompanyInfo } from '../types.ts';
import { MessageSquare, Mail, Linkedin, Menu, X, ExternalLink, Globe } from 'lucide-react';

interface HeaderProps {
  company: CompanyInfo;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ company }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hi NAZ EXPORT, I would like to inquire about bulk export orders (MOQ 20kg).'
  )}`;
  const emailUrl = `mailto:${company.email}?subject=${encodeURIComponent('Product Inquiry - NAZ EXPORT')}`;

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products Catalog', href: '#products' },
    { label: 'About & MOQ', href: '#about' },
    { label: 'Export Inquiries', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F3F8F3]/95 backdrop-blur-md border-b border-[#D8EADB] shadow-xs">
      {/* Continuous Marquee Banner (left-to-right as requested) */}
      <div className="bg-[#1A3325] text-[#D8EADB] overflow-hidden py-1.5 border-b border-[#254633] text-xs sm:text-sm font-medium select-none">
        <div className="animate-marquee-ltr flex items-center space-x-8 whitespace-nowrap cursor-default">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6">
              <span className="font-cinzel tracking-widest uppercase font-bold text-[#A7F3D0]">
                {company.companyName}
              </span>
              <span className="text-emerald-400/70">•</span>
              <span>PREMIUM IRANIAN EXPORT</span>
              <span className="text-emerald-400/70">•</span>
              <span className="bg-[#2D5A3F] px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-200">
                MOQ: {company.moq}
              </span>
              <span className="text-emerald-400/70">•</span>
              <span>SAFFRON • HERBAL BOTANICALS • PISTACHIOS • LAHIJAN BLACK TEA</span>
              <span className="text-emerald-400/70">•</span>
              <span>WORLDWIDE AIR & SEA FREIGHT</span>
              <span className="text-emerald-400/70">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <a href="#home" className="flex items-center space-x-3 group" id="nav-brand-logo">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F3B2C] to-[#2D5A3F] flex items-center justify-center text-emerald-100 font-cinzel font-bold text-xl shadow-md border border-[#3A6B4E]/30 group-hover:scale-105 transition-transform duration-300">
              NE
            </div>
            <div>
              <span className="font-cinzel font-bold text-xl sm:text-2xl tracking-wider text-[#1F3B2C] block leading-none">
                {company.companyName}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#4A7255] font-semibold">
                Iranian Export Co.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#1F3B2C] hover:text-[#0D5C32] font-medium text-sm transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#2D5A3F]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Direct Communication Icons & Admin Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F5132] border border-[#25D366]/30 transition-all duration-200 text-xs font-semibold"
              title="Chat on WhatsApp (+989010192169)"
              id="header-btn-whatsapp"
            >
              <MessageSquare className="w-4 h-4 text-[#128C7E]" />
              <span>WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#E2EFEB] hover:bg-[#D4E7DE] text-[#1F3B2C] border border-[#BDD9C8] transition-all duration-200 text-xs font-semibold"
              title="Email Us (niiiynaa76@gmail.com)"
              id="header-btn-email"
            >
              <Mail className="w-4 h-4 text-[#1F3B2C]" />
              <span>Email</span>
            </a>

            {/* LinkedIn */}
            <a
              href={company.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#005582] border border-[#0077B5]/30 transition-all duration-200 text-xs font-semibold"
              title="Visit LinkedIn Profile"
              id="header-btn-linkedin"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#1F3B2C] hover:bg-[#EAF6EC] focus:outline-hidden"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F3F8F3] border-b border-[#D8EADB] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[#1F3B2C] hover:bg-[#E2EFEB] font-medium text-base transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#D8EADB] flex flex-col space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-sm shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us (+989010192169)</span>
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={emailUrl}
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-lg bg-[#E2EFEB] text-[#1F3B2C] border border-[#BDD9C8] font-semibold text-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>
              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-lg bg-[#0077B5] text-white font-semibold text-xs"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
