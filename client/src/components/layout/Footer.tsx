import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  ExternalLink,
  Cpu,
  Clock,
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer: React.FC = () => {
  const siteSettings = useSiteSettings();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      {/* Top Banner / Factory Consultation CTA */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-industrial-orange font-bold">
                Industrial Advisory & Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Planning a modern furniture or door production facility?
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                Consult with our senior machinery automation engineers for factory layout,
                electrical load capacity sizing, and turnkey equipment line integration.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link
                to="/request-quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white font-semibold rounded-md shadow-lg transition-all"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Company Profile (Dynamic from Admin Settings) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings.logo_url ? (
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings.logo_title || 'WoodTech Solutions'}
                  className="h-10 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-navy-800 border border-navy-700 rounded-lg flex items-center justify-center text-industrial-orange font-extrabold text-xl">
                    {siteSettings.logo_short || 'WTS'}
                  </div>
                  <div>
                    <span className="font-bold text-lg text-white tracking-tight">
                      {siteSettings.logo_title || 'WOODTECH SOLUTIONS'}
                    </span>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                      {siteSettings.logo_badge || 'Industrial Machinery & Technology'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Delivering high-precision CNC machining centers, automated edgebanders,
              computerized beam saws, and customized production line solutions for the modern
              woodworking, furniture, and door manufacturing sector.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-industrial-orange shrink-0 mt-0.5" />
                <span>{siteSettings.office_address || siteSettings.showroom_address || 'House #14, Road #18, Sector #07, Uttara Model Town, Dhaka-1230, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-industrial-orange shrink-0" />
                <span>Hotline: {siteSettings.support_phone || '+880 1700-000000'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-industrial-orange shrink-0" />
                <span>Corporate: {siteSettings.support_email || 'info@woodtechsolutionbd.com'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Machinery Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Machinery Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  to="/products?category=cnc-machining-centers"
                  className="hover:text-industrial-orange transition-colors"
                >
                  CNC Routers & Nesting
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=edge-banding-machines"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Automatic Edgebanders
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=panel-saws"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Beam Saws & Sliding Tables
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=cnc-boring-drilling"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Six-Sided Boring Centers
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=sanding-finishing"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Wide Belt Sanding Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=hydraulic-presses"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Hydraulic Cold & Hot Presses
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=dust-extraction"
                  className="hover:text-industrial-orange transition-colors"
                >
                  Central Dust Collectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Services & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-industrial-orange transition-colors">
                  Factory Layout Planning
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-industrial-orange transition-colors">
                  Installation & Commissioning
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-industrial-orange transition-colors">
                  CNC Operator & CAM Training
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-industrial-orange transition-colors">
                  Genuine Spare Parts Supply
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-industrial-orange transition-colors">
                  Annual Maintenance (AMC)
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-industrial-orange transition-colors">
                  Technical Comparison Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Quality Assurance
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>
                All machinery supplied conforms to CE industrial safety directives with certified
                fail-safe electrical cabinets and overload protections.
              </p>
              <div className="p-3 bg-navy-900 border border-navy-800 rounded-md space-y-1">
                <span className="text-white font-semibold block text-xs">Warranty Guarantee</span>
                <p className="text-[11px] text-slate-400">
                  1-Year standard warranty on core mechanical and electronic components with 24/7
                  troubleshooting support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Note */}
      <div className="border-t border-navy-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} WoodTech Solutions Industrial Catalog Platform. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Enterprise B2B Quotation System</span>
            <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

