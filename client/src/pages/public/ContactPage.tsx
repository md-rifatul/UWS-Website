import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import Button from '@/components/common/Button';

export const ContactPage: React.FC = () => {
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
            Connect with Our Machinery Specialists
          </h1>
          <p className="text-sm text-slate-600">
            Visit our industrial showroom in Dhaka or submit an inquiry below for technical consultation and quotations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-950 text-white rounded-xl p-8 border border-navy-800 space-y-6 shadow-md">
              <div>
                <span className="text-xs font-bold text-industrial-orange uppercase tracking-wider">
                  Corporate Headquarters & Showroom
                </span>
                <h3 className="text-xl font-bold text-white mt-1">WoodTech Solutions Ltd.</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-industrial-orange shrink-0 mt-0.5" />
                  <span>
                    House #14, Road #18, Sector #07, Uttara Model Town, Dhaka-1230, Bangladesh
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-industrial-orange shrink-0" />
                  <span>+880 1700-000000 / +880 1819-000000</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-industrial-orange shrink-0" />
                  <span>info@woodtechsolutionbd.com / sales@woodtechsolutionbd.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-industrial-orange shrink-0" />
                  <span>Saturday – Thursday: 9:00 AM – 7:00 PM (GMT+6)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-800 space-y-2">
                <span className="text-xs font-semibold text-white block">Instant Messaging:</span>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Engineering Desk</span>
                </a>
              </div>
            </div>

            {/* Showroom info */}
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-2">
              <h4 className="font-bold text-sm text-navy-900">Live Machinery Showroom & Test Cuts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experience live cutting demonstrations of our ATC CNC Routers, high-speed edgebanders, and beam saws with your own MDF/solid wood sample boards prior to purchase.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-slate-border p-8 shadow-xs">
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

