import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Video,
  Wrench,
  Cpu,
  ArrowRight,
  Send,
} from 'lucide-react';
import Button from '@/components/common/Button';
import { handleImageError } from '@/utils/imageUtils';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const DisplayCenterPage: React.FC = () => {
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || '+8801700000000').replace(/[^0-9]/g, '');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    machineCategory: 'CNC Router Machine',
    preferredDate: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-surface-offwhite min-h-screen pb-20 space-y-16">
      {/* 1. HERO HEADER */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800 border border-navy-700 text-industrial-orange text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Central Technology Showroom &amp; Demo Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            Experience Machinery Power in Action Before You Invest
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Visit Bangladesh’s largest 40,000 sq ft industrial woodworking technology center in Tejgaon, Dhaka.
            Inspect live test cuts, computerized nesting, PUR edgebanding, and heavy solid wood leveling firsthand.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Test-Cut On Your Own Board Material</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Factory Engineering Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>35+ Machines In Live Demonstration</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMO CENTER CAPABILITIES & BOOKING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Demo Center Details & Photo Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-border p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange block">
                  Interactive Facility
                </span>
                <h2 className="text-2xl font-extrabold text-navy-900 mt-0.5">
                  What You Can Test at Our Demo Center
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="p-4 bg-surface-offwhite rounded-xl border border-slate-border space-y-2">
                  <Cpu className="w-6 h-6 text-industrial-orange" />
                  <h4 className="font-bold text-sm text-navy-900">CNC Nesting &amp; Routing</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Test 3D decorative relief, acrylic routing, cabinet nesting, and Italian 9.0kW ATC automatic tool changing.
                  </p>
                </div>

                <div className="p-4 bg-surface-offwhite rounded-xl border border-slate-border space-y-2">
                  <Wrench className="w-6 h-6 text-industrial-orange" />
                  <h4 className="font-bold text-sm text-navy-900">PUR &amp; EVA Edgebanding</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Verify chip-free pre-milling, corner rounding, scraper finishing, and zero-joint waterproof glue lines.
                  </p>
                </div>

                <div className="p-4 bg-surface-offwhite rounded-xl border border-slate-border space-y-2">
                  <Compass className="w-6 h-6 text-industrial-orange" />
                  <h4 className="font-bold text-sm text-navy-900">Precision Panel Saws</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Inspect 3200mm anodized sliding table saws and computerized beam saws with independent scoring blade.
                  </p>
                </div>

                <div className="p-4 bg-surface-offwhite rounded-xl border border-slate-border space-y-2">
                  <ShieldCheck className="w-6 h-6 text-industrial-orange" />
                  <h4 className="font-bold text-sm text-navy-900">Solid Wood Jointers &amp; Planers</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Experience silent spiral helical cutterheads leveling uneven teak, mahogany, and hardwood slabs true flat.
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Opening Hours */}
            <div className="bg-white rounded-2xl border border-slate-border p-8 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-industrial-orange" />
                <span>Showroom Location &amp; Visiting Hours</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
                <div className="space-y-2">
                  <span className="font-bold text-navy-900 block text-sm">
                    {siteSettings.showroom_name || 'Central Technology Center'}
                  </span>
                  <p className="leading-relaxed font-medium text-charcoal-700">
                    {siteSettings.showroom_address || 'Plot 42, Tejgaon Industrial Area, Dhaka-1208, Bangladesh.'}
                  </p>
                  {siteSettings.showroom_maps_url && (
                    <a
                      href={siteSettings.showroom_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-industrial-orange hover:text-industrial-orange-hover font-semibold pt-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-navy-900 block text-sm">Working Hours &amp; Inquiries</span>
                  {siteSettings.showroom_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-industrial-orange shrink-0" />
                      <span>{siteSettings.showroom_hours}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-industrial-orange shrink-0" />
                    <span>Hotline: {siteSettings.showroom_phone || siteSettings.support_phone || '+880 1700-000000'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    <a
                      href={`https://wa.me/${rawWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      WhatsApp VIP Desk: {siteSettings.whatsapp_number || '+880 1700-000000'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Book a Live Demonstration Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-border p-8 shadow-lg space-y-6 sticky top-24">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange block">
                  Book A Private Session
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 mt-1">
                  Schedule A Factory Demo Visit
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bring your own CAD files and board samples. Our application engineers will run a live cut test.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-900">Demo Session Requested!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you. Our senior technical engineer will call you within 2 hours to confirm your machinery test schedule.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-charcoal-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Engr. Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-charcoal-700">Company / Factory Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Woodcraft Ltd."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-charcoal-700">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 17..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-charcoal-700">Preferred Date</label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-charcoal-700">Machine of Primary Interest *</label>
                    <select
                      value={formData.machineCategory}
                      onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs bg-white"
                    >
                      <option value="CNC Router Machine">CNC Router Machine (ATC &amp; Nesting)</option>
                      <option value="Automatic Edgebander">Automatic High-Speed Edgebander (PUR/EVA)</option>
                      <option value="Precision Panel Saw">Computerized Beam Saw / Sliding Table Saw</option>
                      <option value="Surface Planer">Surface Planer (Jointer with Spiral Head)</option>
                      <option value="Thickness Planer">Auto-Feed Thickness Planer</option>
                      <option value="Spindle Shaper">High-Speed Spindle Shaper / Moulder</option>
                      <option value="Boring Machine">6-Sided CNC Drilling Center</option>
                      <option value="Hydraulic Press">Hot &amp; Cold Hydraulic Veneer Press</option>
                      <option value="Dust Extraction">Pulse-Jet Central Dust Collector</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-charcoal-700">Custom Testing Notes (Optional)</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. We want to test cutting 18mm high-gloss melamine and 25mm solid teak..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Send className="w-4 h-4" />}
                    className="w-full justify-center font-bold text-xs shadow-md mt-2"
                  >
                    Confirm Live Demo Appointment
                  </Button>

                  <p className="text-[11px] text-slate-400 text-center">
                    No charge for demonstration. Technical engineers available onsite.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisplayCenterPage;

