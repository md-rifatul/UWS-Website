import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Building2, Globe, ExternalLink } from 'lucide-react';
import Button from '@/components/common/Button';
import useSiteSettings from '@/hooks/useSiteSettings';

export const ContactPage: React.FC = () => {
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912580072').replace(/[^0-9]/g, '');
  const normalizedWhatsApp = rawWhatsApp.startsWith('880') ? rawWhatsApp : rawWhatsApp.startsWith('0') ? `88${rawWhatsApp}` : `880${rawWhatsApp}`;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: 'Machinery Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
            Direct Corporate Communication
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Connect with {siteSettings.logo_title || 'Unique Wood Solution'}
          </h1>
          <p className="text-sm text-slate-600">
            Visit our display center in Keraniganj or reach out directly to our Head Office for commercial quotations and machine availability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Multi-Facility Office Details */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Head Office */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-industrial-orange">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">
                      {siteSettings.head_office_name || 'Head Office'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Administrative &amp; Commercial Center</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-orange bg-orange-50 px-2 py-0.5 rounded">
                  Dhaka 1000
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-charcoal-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-industrial-orange shrink-0 mt-0.5" />
                  <span>
                    {siteSettings.head_office_address ||
                      siteSettings.office_address ||
                      '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-industrial-orange shrink-0" />
                  <a
                    href={`tel:${siteSettings.head_office_phone || siteSettings.support_phone || '01612429999'}`}
                    className="hover:text-industrial-orange font-semibold transition-colors"
                  >
                    Phone: {siteSettings.head_office_phone || siteSettings.support_phone || '01612-429999'}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-industrial-orange shrink-0" />
                  <a
                    href={`mailto:${siteSettings.head_office_email || siteSettings.support_email || 'info@uwsbd.com'}`}
                    className="hover:text-industrial-orange transition-colors"
                  >
                    Email: {siteSettings.head_office_email || siteSettings.support_email || 'info@uwsbd.com'}
                  </a>
                </div>

                {(siteSettings.head_office_website || siteSettings.website_url) && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-industrial-orange shrink-0" />
                    <a
                      href={`https://${(siteSettings.head_office_website || siteSettings.website_url || 'www.uwsbd.com').replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-industrial-orange transition-colors font-medium flex items-center gap-1"
                    >
                      <span>Website: {siteSettings.head_office_website || siteSettings.website_url || 'www.uwsbd.com'}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Corporate Office & Display Center */}
            <div className="bg-navy-950 text-white rounded-xl p-6 border border-navy-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {siteSettings.corporate_office_name || 'Corporate Office & Display Center'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">Live Machine Demos &amp; Consultations</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  Display Center
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {siteSettings.corporate_office_address ||
                      siteSettings.showroom_address ||
                      'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`tel:${siteSettings.corporate_office_phone || siteSettings.showroom_phone || '01912580072'}`}
                    className="hover:text-emerald-300 font-semibold transition-colors"
                  >
                    Phone: {siteSettings.corporate_office_phone || siteSettings.showroom_phone || '01912-580072'}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`mailto:${siteSettings.corporate_office_email || 'info@uwsbd.com'}`}
                    className="hover:text-emerald-300 transition-colors"
                  >
                    Email: {siteSettings.corporate_office_email || 'info@uwsbd.com'}
                  </a>
                </div>

                {siteSettings.showroom_hours && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hours: {siteSettings.showroom_hours}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-navy-800 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${normalizedWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp VIP Desk ({siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912-580072'})</span>
                </a>
                {siteSettings.showroom_maps_url && (
                  <a
                    href={siteSettings.showroom_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-md text-xs font-medium transition-colors border border-navy-700"
                  >
                    <MapPin className="w-3.5 h-3.5 text-industrial-orange" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
            </div>

            {/* 3. Warehouse & Logistics */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">
                      {siteSettings.warehouse_name || 'Warehouse & Logistics'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Heavy Machinery Stock &amp; Spare Parts</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Godarbag
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-charcoal-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {siteSettings.warehouse_address ||
                      'Unique Wood Solution Warehouse, Godarbag, Keraniganj, Dhaka 1310'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <a
                    href={`tel:${siteSettings.warehouse_phone || '01805465555'}`}
                    className="hover:text-blue-600 font-semibold transition-colors"
                  >
                    Phone: {siteSettings.warehouse_phone || '01805-465555'}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <a
                    href={`mailto:${siteSettings.warehouse_email || 'info@uwsbd.com'}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Email: {siteSettings.warehouse_email || 'info@uwsbd.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl border border-slate-border p-8 shadow-xs sticky top-24">
              <h3 className="font-bold text-base text-navy-900 mb-1">Send a Direct Message</h3>
              <p className="text-xs text-slate-500 mb-6">
                Our sales team typically responds within 4 business hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-900">Message Dispatched</h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thank you for reaching out. A technical sales representative will get back to your corporate email promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                        Company / Factory Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Factory Ltd."
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@factory.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1711-000000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    >
                      <option value="Machinery Inquiry">Machinery Inquiry & Quotation</option>
                      <option value="Turnkey Factory Setup">Turnkey Factory Project</option>
                      <option value="Installation & Maintenance">Installation & Service Request</option>
                      <option value="Spare Parts">Spare Parts & Tooling Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please outline the machines of interest, production capacity goals, and any relevant technical parameters..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full text-xs p-3 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full font-semibold"
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send Direct Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

