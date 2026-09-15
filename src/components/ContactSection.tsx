import React, { useState } from 'react';
import { CompanyInfo } from '../types.ts';
import { submitInquiry } from '../services/api.ts';
import { MessageSquare, Mail, Linkedin, Send, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  company: CompanyInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ company }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    productInterested: 'Super Negin Saffron',
    estimatedQuantity: '20 KG (MOQ)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappUrl = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi NAZ EXPORT, I'd like to inquire about ordering Persian export products, MOQ ${company.moq}`
  )}`;

  const emailUrl = `mailto:${company.email}?subject=${encodeURIComponent('Product Inquiry - NAZ EXPORT')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitInquiry(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        productInterested: 'Super Negin Saffron',
        estimatedQuantity: '20 KG (MOQ)',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#EAF6EC] border-t border-[#D5EAD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A3F] bg-white/80 px-3.5 py-1 rounded-full border border-[#BEDEC5]">
            Direct Trade Communications
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3B2C]">
            Connect With Our Export Desk
          </h2>
          <p className="text-sm sm:text-base text-[#3A5D46] font-sans-body">
            Get instant quotations, sample availability reports, and shipping schedules from our Tehran export representatives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Channels */}
          <div className="lg:col-span-5 space-y-5">
            {/* WhatsApp Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-[#BEDEC5] shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-4 group block cursor-pointer"
              id="contact-channel-whatsapp"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel font-bold text-[#1F3B2C] text-base">WhatsApp Commercial Desk</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Fastest
                  </span>
                </div>
                <p className="text-xs text-[#52795E] mt-0.5">Instant chat & quotation dispatch</p>
                <div className="text-sm font-semibold text-[#0F5132] mt-1 font-mono">
                  {company.whatsapp}
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={emailUrl}
              className="p-5 rounded-2xl bg-white border border-[#BEDEC5] shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-4 group block cursor-pointer"
              id="contact-channel-email"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1F3B2C]/10 text-[#1F3B2C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-cinzel font-bold text-[#1F3B2C] text-base">Email Formal Inquiries</h3>
                <p className="text-xs text-[#52795E] mt-0.5">Pro-forma invoices & contracts</p>
                <div className="text-sm font-semibold text-[#1F3B2C] mt-1 font-mono break-all">
                  {company.email}
                </div>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={company.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-[#BEDEC5] shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-4 group block cursor-pointer"
              id="contact-channel-linkedin"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0077B5]/15 text-[#0077B5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-cinzel font-bold text-[#1F3B2C] text-base">LinkedIn Executive Profile</h3>
                <p className="text-xs text-[#52795E] mt-0.5">Professional credentials & network</p>
                <div className="text-xs font-semibold text-[#005582] mt-1 truncate">
                  Connect on LinkedIn
                </div>
              </div>
            </a>

            {/* Export Office Details */}
            <div className="p-5 rounded-2xl bg-[#E2EFE4] border border-[#C2E0C9] space-y-2 text-xs text-[#284A35]">
              <div className="flex items-center space-x-2 font-semibold text-[#1F3B2C]">
                <MapPin className="w-4 h-4 text-[#2D5A3F]" />
                <span>Headquarters: Tehran & Khorasan Export Hub, Iran</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#2D5A3F]" />
                <span>Operating Hours: 08:00 – 18:00 (GMT+3:30) • 24/7 WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive B2B Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#BEDEC5] shadow-md">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1F3B2C] mb-1">
                Request Official Quotation
              </h3>
              <p className="text-xs text-[#52795E] mb-6 font-sans-body">
                Please specify your target destination and product interest. Wholesale minimum order is {company.moq}.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-cinzel text-lg font-bold text-[#14532D]">
                    Inquiry Received Successfully
                  </h4>
                  <p className="text-xs text-[#166534] max-w-md mx-auto leading-relaxed">
                    Thank you for contacting NAZ EXPORT. Our export desk has logged your request and will provide a detailed pro-forma quote with current CIF/FOB rates within 12 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Full Name / Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alexander Weber"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Corporate Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="importer@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Destination Country / City</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Frankfurt, Germany / Dubai, UAE"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+49 170 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Product of Interest</label>
                      <select
                        value={formData.productInterested}
                        onChange={(e) => setFormData({ ...formData, productInterested: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      >
                        <option value="Super Negin Saffron">Super Negin Saffron</option>
                        <option value="Sargol Persian Saffron">Sargol Persian Saffron</option>
                        <option value="Traditional Dasteh Saffron">Traditional Dasteh Saffron</option>
                        <option value="Saffron Root (White Part)">Saffron Root (White Part)</option>
                        <option value="Chamomile Flowers">Chamomile Flowers</option>
                        <option value="Shirazi Thyme">Shirazi Thyme</option>
                        <option value="Damask Rose Flowers">Damask Rose Flowers</option>
                        <option value="Premium Iranian Pistachios">Premium Iranian Pistachios</option>
                        <option value="Estahban Dried Fig">Estahban Dried Fig</option>
                        <option value="Lahijan Black Tea">Lahijan Black Tea</option>
                        <option value="Consolidated Mixed Trial Shipment">Consolidated Mixed Trial (20 KG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#1F3B2C] font-semibold mb-1">Estimated Order Volume (MOQ: {company.moq})</label>
                      <input
                        type="text"
                        value={formData.estimatedQuantity}
                        onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                        placeholder="e.g. 20 KG, 50 KG, 200 KG"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1F3B2C] font-semibold mb-1">Detailed Inquiry & Packaging Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please indicate preferred incoterms (FOB/CIF), packaging preference (tins, vacuum bags, cartons), or specific ISO analysis requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#BEDEC5] bg-[#F7FCF8] focus:bg-white focus:outline-hidden focus:border-[#2D5A3F] transition-all text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1F3B2C] hover:bg-[#152B20] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
                    id="contact-form-submit"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting Quotation Request...' : 'Submit Wholesale Quotation Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
