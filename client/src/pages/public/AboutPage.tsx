import React from 'react';
import { ShieldCheck, Award, Users, Factory, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-surface-offwhite min-h-screen py-12 pb-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
            Engineering Excellence Since 2012
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
            Advancing Industrial Manufacturing in Bangladesh
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            WoodTech Solutions is a technology and machinery engineering pioneer, serving as the trusted
            automation partner for the nation's premier furniture, door, and architectural panel factories.
          </p>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-slate-border shadow-xs space-y-3">
            <div className="p-3 bg-navy-900 text-industrial-orange rounded-lg w-fit">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Turnkey Facility Specialists</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We engineer factory lines from raw board staging to robotic packaging. Over 150 automated facilities have been commissioned under our engineering supervision.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-border shadow-xs space-y-3">
            <div className="p-3 bg-navy-900 text-industrial-orange rounded-lg w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Certified Global Brands</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direct authorized integration partnerships with Nanxing, KDT, and European tooling manufacturers, ensuring authentic CE-certified components and direct factory support.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-border shadow-xs space-y-3">
            <div className="p-3 bg-navy-900 text-industrial-orange rounded-lg w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Technical Field Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our engineering team comprises mechanical engineers, electrical automation specialists, and CNC software instructors offering round-the-clock technical coverage.
            </p>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-navy-950 text-white rounded-2xl p-8 sm:p-14 border border-navy-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
                Our Engineering Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Precision tolerances are non-negotiable in mass production.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Modern furniture manufacturing demands millimeter precision across continuous daily shifts. We carefully select, inspect, and calibrate every machine before final handover to guarantee years of unwavering performance.
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-sm font-semibold rounded-md transition-all shadow-md"
                >
                  <span>Explore Machinery Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-navy-900/80 p-6 rounded-xl border border-navy-800">
                <span className="text-3xl font-extrabold text-industrial-orange">100%</span>
                <span className="block text-xs font-semibold uppercase text-slate-300 mt-1">Pre-Commissioning Testing</span>
              </div>
              <div className="bg-navy-900/80 p-6 rounded-xl border border-navy-800">
                <span className="text-3xl font-extrabold text-industrial-orange">12 Mo</span>
                <span className="block text-xs font-semibold uppercase text-slate-300 mt-1">Full Warranty Period</span>
              </div>
              <div className="bg-navy-900/80 p-6 rounded-xl border border-navy-800">
                <span className="text-3xl font-extrabold text-industrial-orange">24h</span>
                <span className="block text-xs font-semibold uppercase text-slate-300 mt-1">Service SLA</span>
              </div>
              <div className="bg-navy-900/80 p-6 rounded-xl border border-navy-800">
                <span className="text-3xl font-extrabold text-industrial-orange">30+</span>
                <span className="block text-xs font-semibold uppercase text-slate-300 mt-1">Field Engineers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

