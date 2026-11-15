import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FileSpreadsheet,
  Menu,
  X,
  User,
  Shield,
  ChevronDown,
  ArrowRight,
  Cpu,
  Layers,
  Wrench,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Navigation,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleBasketDrawer } from '@/features/rfq/rfqBasketSlice';
import { setSearchQuery } from '@/features/catalog/catalogSlice';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Button from '../common/Button';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const locationCardRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const siteSettings = useSiteSettings();

  // Close location popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationCardRef.current && !locationCardRef.current.contains(event.target as Node)) {
        setLocationModalOpen(false);
      }
    };
    if (locationModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationModalOpen]);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      dispatch(setSearchQuery(headerSearch.trim()));
      navigate('/products');
      setMobileSearchOpen(false);
    }
  };

  const rfqItems = useAppSelector((state) => state.rfqBasket.items);
  const compareItems = useAppSelector((state) => state.compare.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const totalRfqCount = rfqItems.reduce((acc, it) => acc + it.quantity, 0);

  // Active state styling matching screenshot: Green when active, dark charcoal when inactive
  const isHome = location.pathname === '/';
  const isDisplay = location.pathname === '/display-center';
  const isAbout = location.pathname.startsWith('/about') || location.pathname.startsWith('/services');
  const isMachine = location.pathname.startsWith('/products');
  const isContact = location.pathname === '/contact';
  const isGallery = location.pathname === '/projects';

  const toggleMobileDropdown = (name: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
      <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 xl:gap-6 w-full">
          {/* Left: Brand Logo (Dynamic from Admin Settings) */}
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              {siteSettings.logo_url ? (
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings.logo_title || 'WoodTech Solutions'}
                  className="h-9 sm:h-10 w-auto max-w-[170px] object-contain shrink-0"
                />
              ) : (
                <>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-900 rounded-lg flex items-center justify-center text-white shadow-md group-hover:bg-charcoal-800 transition-colors shrink-0">
                    <span className="font-extrabold tracking-tighter text-base sm:text-lg text-industrial-orange">
                      {siteSettings.logo_short || 'WTS'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-bold text-sm sm:text-base text-navy-900 tracking-tight whitespace-nowrap">
                      {siteSettings.logo_title || 'WOODTECH'}
                    </span>
                    {siteSettings.logo_badge && (
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-industrial-orange/15 text-industrial-orange-dark rounded whitespace-nowrap">
                        {siteSettings.logo_badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Center Column: Clean responsive navigation links */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-2 text-[10.5px] xl:text-[11.5px] 2xl:text-xs font-bold uppercase tracking-tight xl:tracking-wide shrink min-w-0">
            {/* 1. HOME */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors py-1.5 px-1 xl:px-1.5 flex items-center rounded ${
                  isActive ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 hover:text-emerald-600'
                }`
              }
            >
              HOME
            </NavLink>

            {/* 2. DISPLAY CENTER */}
            <NavLink
              to="/display-center"
              className={({ isActive }) =>
                `transition-colors py-1.5 px-1 xl:px-1.5 flex items-center whitespace-nowrap rounded ${
                  isActive ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 hover:text-emerald-600'
                }`
              }
            >
              DISPLAY CENTER
            </NavLink>

            {/* 3. ABOUT US (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1 xl:px-1.5 rounded whitespace-nowrap ${
                  isAbout ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>ABOUT US</span>
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0 opacity-70" />
              </button>

              {/* Flyout Menu */}
              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/about"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Company Overview</span>
                  <span className="text-[11px] text-slate-500 font-normal">Our 15+ years engineering heritage</span>
                </Link>
                <Link
                  to="/services"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Turnkey Factory Services</span>
                  <span className="text-[11px] text-slate-500 font-normal">3D CAD planning &amp; power balancing</span>
                </Link>
                <Link
                  to="/services"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Maintenance &amp; Spare Parts</span>
                  <span className="text-[11px] text-slate-500 font-normal">Onsite factory installation &amp; calibration</span>
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Leadership &amp; Engineers</span>
                  <span className="text-[11px] text-slate-500 font-normal">Certified technical application team</span>
                </Link>
              </div>
            </div>

            {/* 4. ALL MACHINE (MEGA-DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1 xl:px-1.5 rounded whitespace-nowrap ${
                  isMachine ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>ALL MACHINE</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              {/* Rich Mega-Menu Flyout */}
              <div className="absolute top-full -left-20 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-border p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-3 gap-6">
                {/* Column 1: CNC Machining Centers */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-industrial-orange">
                    <Cpu className="w-4 h-4" />
                    <span className="font-extrabold text-[11px] tracking-wider uppercase">CNC Machining</span>
                  </div>
                  <ul className="space-y-2 text-xs font-normal normal-case">
                    <li>
                      <Link
                        to="/products?category=cnc-router-machine"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        CNC Router Machines
                      </Link>
                      <span className="text-[11px] text-slate-400">Classic &amp; Racer Pro Series</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=cnc-router-machine"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        ATC Nesting Machining Centers
                      </Link>
                      <span className="text-[11px] text-slate-400">12-Tool Carousel &amp; Syntec 6MB</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=cnc-boring-drilling"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Six-Sided Drilling &amp; Boring
                      </Link>
                      <span className="text-[11px] text-slate-400">High speed throughfeed lines</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Solid Wood Preparation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-industrial-orange">
                    <Layers className="w-4 h-4" />
                    <span className="font-extrabold text-[11px] tracking-wider uppercase">Solid Wood Prep</span>
                  </div>
                  <ul className="space-y-2 text-xs font-normal normal-case">
                    <li>
                      <Link
                        to="/products?category=surface-planer"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Surface Planers (Jointers)
                      </Link>
                      <span className="text-[11px] text-slate-400">Helical spiral silent cutterhead</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=thickness-planer"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Auto-Feed Thickness Planers
                      </Link>
                      <span className="text-[11px] text-slate-400">Digital DRO table elevation</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=spindle-shaper-moulder"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Spindle Shapers &amp; Moulders
                      </Link>
                      <span className="text-[11px] text-slate-400">Tilting spindle 10,000 RPM</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Panel Processing & Finishing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-industrial-orange">
                    <Wrench className="w-4 h-4" />
                    <span className="font-extrabold text-[11px] tracking-wider uppercase">Panel Processing</span>
                  </div>
                  <ul className="space-y-2 text-xs font-normal normal-case">
                    <li>
                      <Link
                        to="/products?category=circular-saw"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Sliding Table Circular Saws
                      </Link>
                      <span className="text-[11px] text-slate-400">3200mm anodized carriage</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=panel-saws"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Computerized Beam Panel Saws
                      </Link>
                      <span className="text-[11px] text-slate-400">Magnetic digital positioning</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=edge-banding-machines"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Automatic Edgebanders
                      </Link>
                      <span className="text-[11px] text-slate-400">PUR/EVA dual-melt gluing</span>
                    </li>
                    <li>
                      <Link
                        to="/products?category=sanding-finishing"
                        className="text-navy-900 hover:text-industrial-orange font-semibold block transition-colors"
                      >
                        Wide Belt Calibrating Sanders
                      </Link>
                      <span className="text-[11px] text-slate-400">Heavy calibrating &amp; finish heads</span>
                    </li>
                  </ul>
                </div>

                {/* Mega-Menu Footer Banner */}
                <div className="col-span-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-normal normal-case">
                    Direct authorized distributor with manufacturer warranty &amp; spare parts backup.
                  </span>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-industrial-orange hover:text-industrial-orange-hover"
                  >
                    <span>Explore Full 2026 Catalog (35+ Models)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 5. CUTTER ACCESSORIES (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/products?search=Cutter')}
                className="flex items-center gap-0.5 xl:gap-1 text-charcoal-800 group-hover:text-emerald-600 transition-colors uppercase cursor-pointer px-1 xl:px-1.5 rounded whitespace-nowrap"
              >
                <span>CUTTER ACCESSORIES</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/products?search=Diamond"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Diamond PCD Router Cutters</span>
                  <span className="text-[11px] text-slate-500 font-normal">Nesting compression &amp; mortising</span>
                </Link>
                <Link
                  to="/products?search=Blade"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">T.C.T. Circular Saw Blades</span>
                  <span className="text-[11px] text-slate-500 font-normal">Main &amp; scoring chip-free blades</span>
                </Link>
                <Link
                  to="/products?search=Spiral"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Spiral Helical Cutterheads</span>
                  <span className="text-[11px] text-slate-500 font-normal">Carbide four-side indexable inserts</span>
                </Link>
                <Link
                  to="/products?search=Parts"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Genuine Factory Spare Parts</span>
                  <span className="text-[11px] text-slate-500 font-normal">Vacuum pods, solenoids &amp; motors</span>
                </Link>
              </div>
            </div>

            {/* 6. CONTACT US */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors py-1.5 px-1 xl:px-1.5 flex items-center whitespace-nowrap rounded ${
                  isActive ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 hover:text-emerald-600'
                }`
              }
            >
              CONTACT US
            </NavLink>

            {/* 7. GALLERY */}
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `transition-colors py-1.5 px-1 xl:px-1.5 flex items-center whitespace-nowrap rounded ${
                  isActive ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 hover:text-emerald-600'
                }`
              }
            >
              GALLERY
            </NavLink>

            {/* 8. WTS FOUNDATION (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="flex items-center gap-0.5 xl:gap-1 text-charcoal-800 group-hover:text-emerald-600 transition-colors uppercase cursor-pointer px-1 xl:px-1.5 rounded whitespace-nowrap"
              >
                <span>WTS FOUNDATION</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>
              <div className="absolute top-full right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/about"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Woodworking Skill Academy</span>
                  <span className="text-[11px] text-slate-500 font-normal">Operator CAD/CAM certification</span>
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Factory Safety Protocols</span>
                  <span className="text-[11px] text-slate-500 font-normal">Machine guarding &amp; dust control</span>
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Green Woodworking CSR</span>
                  <span className="text-[11px] text-slate-500 font-normal">Eco-friendly sawdust recycling</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Action Tools: Minimal Search, Compare, RFQ Basket, Auth, CTA */}
          <div className="hidden lg:flex items-center justify-end gap-1.5 xl:gap-2.5 shrink-0">
            {/* Minimal & Beautiful Search Box */}
            <form onSubmit={handleHeaderSearch} className="relative flex items-center group shrink-0">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none group-focus-within:text-industrial-orange transition-colors" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-24 xl:w-32 focus:w-36 xl:focus:w-44 pl-8 pr-6 py-1.5 text-xs text-navy-950 placeholder:text-slate-400 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-industrial-orange rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-industrial-orange/20 shadow-2xs font-medium"
                />
                {headerSearch ? (
                  <button
                    type="button"
                    onClick={() => setHeaderSearch('')}
                    className="absolute right-2 p-0.5 text-slate-400 hover:text-navy-900 rounded-full cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="hidden xl:inline-block absolute right-2 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded shadow-2xs pointer-events-none">
                    ↵
                  </span>
                )}
              </div>
            </form>

            {/* Showroom & Physical Address Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationModalOpen(!locationModalOpen)}
                className={`relative p-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  locationModalOpen
                    ? 'bg-industrial-orange/15 text-industrial-orange'
                    : 'text-charcoal-700 hover:text-navy-900 hover:bg-slate-100'
                }`}
                title="Showroom & Factory Physical Address"
                aria-label="View Store & Showroom Address"
              >
                <MapPin className="w-4 h-4 text-industrial-orange" />
              </button>

              {/* Physical Address Popover Card */}
              {locationModalOpen && (
                <div
                  ref={locationCardRef}
                  className="absolute top-full right-0 mt-2.5 w-[330px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left space-y-3.5"
                >
                  {/* Popover Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-industrial-orange/15 flex items-center justify-center text-industrial-orange">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                          Shop &amp; Showroom Location
                        </h4>
                        <span className="text-[10px] text-slate-500">Visit us for live machinery demo</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocationModalOpen(false)}
                      className="p-1 text-slate-400 hover:text-navy-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Facility 1: Corporate Office & Display Center (Dynamic) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">
                        {siteSettings.corporate_office_name || siteSettings.showroom_name || 'Unique Wood Solution Display Center'}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Live Demo
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                      {siteSettings.corporate_office_address || siteSettings.showroom_address || 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-industrial-orange shrink-0" />
                        <span>{siteSettings.corporate_office_phone || siteSettings.showroom_phone || '01912-580072'}</span>
                      </div>
                      {siteSettings.showroom_hours && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-industrial-orange shrink-0" />
                          <span>{siteSettings.showroom_hours}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Facility 2: Head Office (Dynamic) */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-navy-900">
                        {siteSettings.head_office_name || siteSettings.office_name || 'Head Office'}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-industrial-orange bg-orange-50 px-1.5 py-0.5 rounded">
                        Dhaka 1000
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {siteSettings.head_office_address || siteSettings.office_address || '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000'}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Phone className="w-3 h-3 text-industrial-orange shrink-0" />
                      <span>{siteSettings.head_office_phone || siteSettings.support_phone || '01612-429999'}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Google Maps Direction + View Display Center */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <a
                      href={siteSettings.showroom_maps_url || 'https://maps.google.com/?q=Unique+Wood+Solution+South+Ramerkanda+Keraniganj+Dhaka'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                    >
                      <Navigation className="w-3.5 h-3.5 text-industrial-orange" />
                      <span>Google Maps</span>
                    </a>
                    <Link
                      to="/display-center"
                      onClick={() => setLocationModalOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-industrial-orange hover:bg-industrial-orange-hover text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                    >
                      <span>Showroom Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Admin Badge */}
            {isAuthenticated ? (
              <div className="flex items-center">
                <Link
                  to={user?.role === 'Admin' ? '/admin' : '/request-quote'}
                  className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 text-charcoal-700 hover:text-navy-900 text-xs font-medium"
                  title={user?.fullName || 'Account'}
                >
                  {user?.role === 'Admin' ? (
                    <Shield className="w-4 h-4 text-industrial-orange" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1.5 text-charcoal-700 hover:text-navy-900 hover:bg-slate-100 rounded-md text-xs font-medium"
                title="Account Login"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Request Quotation Primary CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/request-quote')}
              className="font-bold text-xs shadow-xs px-2.5 xl:px-3 py-1.5 whitespace-nowrap shrink-0"
            >
              <span className="hidden xl:inline">Request </span>Quote
            </Button>
          </div>

          {/* Mobile Menu & Search Actions */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-charcoal-700 hover:text-navy-900 hover:bg-slate-100 rounded-md"
              title="Search Machinery"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setLocationModalOpen(!locationModalOpen)}
              className="p-1.5 text-charcoal-700 hover:text-navy-900 hover:bg-slate-100 rounded-md cursor-pointer"
              title="Shop & Showroom Physical Address"
            >
              <MapPin className="w-5 h-5 text-industrial-orange" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-charcoal-700 hover:text-navy-900 hover:bg-slate-100 rounded-md cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-navy-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-slate-50 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleHeaderSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search machinery, models, SKUs..."
              className="w-full pl-9 pr-8 py-2 text-xs text-navy-950 placeholder-slate-400 bg-white border border-slate-300 rounded-full focus:outline-none focus:border-industrial-orange focus:ring-2 focus:ring-industrial-orange/15 font-medium shadow-2xs"
            />
            {headerSearch && (
              <button
                type="button"
                onClick={() => setHeaderSearch('')}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-navy-900 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Bar inside Menu */}
          <form
            onSubmit={(e) => {
              handleHeaderSearch(e);
              setMobileMenuOpen(false);
            }}
            className="relative flex items-center pb-1"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search machine, model, SKU..."
              className="w-full pl-9 pr-8 py-2 text-xs text-navy-950 placeholder-slate-400 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:bg-white focus:border-industrial-orange font-medium"
            />
            {headerSearch && (
              <button
                type="button"
                onClick={() => setHeaderSearch('')}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-navy-900 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
            {/* 1. HOME */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-emerald-600 font-extrabold hover:bg-slate-50"
            >
              HOME
            </Link>

            {/* 2. DISPLAY CENTER */}
            <Link
              to="/display-center"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50"
            >
              DISPLAY CENTER
            </Link>

            {/* 3. ABOUT US Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('about')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50 text-left font-bold"
              >
                <span>ABOUT US</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'about' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Company Overview &amp; Heritage
                  </Link>
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Turnkey Engineering &amp; Factory Planning
                  </Link>
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Maintenance &amp; Spare Parts
                  </Link>
                </div>
              )}
            </div>

            {/* 4. ALL MACHINE Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('machine')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50 text-left font-bold"
              >
                <span>ALL MACHINE</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'machine' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'machine' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/products?category=cnc-router-machine"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange font-semibold"
                  >
                    CNC Router Machines (Classic &amp; Racer Pro)
                  </Link>
                  <Link
                    to="/products?category=surface-planer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Surface Planers (Spiral Jointers)
                  </Link>
                  <Link
                    to="/products?category=thickness-planer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Thickness Planers
                  </Link>
                  <Link
                    to="/products?category=spindle-shaper-moulder"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Spindle Shapers &amp; Moulders
                  </Link>
                  <Link
                    to="/products?category=circular-saw"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Sliding Table Circular Saws
                  </Link>
                  <Link
                    to="/products?category=edge-banding-machines"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Automatic Edgebanders (PUR/EVA)
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-industrial-orange font-bold"
                  >
                    View Complete 2026 Catalog →
                  </Link>
                </div>
              )}
            </div>

            {/* 5. CUTTER ACCESSORIES Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('cutters')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50 text-left font-bold"
              >
                <span>CUTTER ACCESSORIES</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'cutters' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'cutters' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/products?search=Cutter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Diamond PCD CNC Cutters
                  </Link>
                  <Link
                    to="/products?search=Blade"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    T.C.T. Saw Blades
                  </Link>
                  <Link
                    to="/products?search=Spiral"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Spiral Planer Inserts
                  </Link>
                </div>
              )}
            </div>

            {/* 6. CONTACT US */}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50"
            >
              CONTACT US
            </Link>

            {/* 7. GALLERY */}
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50"
            >
              GALLERY
            </Link>

            {/* 8. WTS FOUNDATION Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('foundation')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-charcoal-800 hover:bg-slate-50 text-left font-bold"
              >
                <span>WTS FOUNDATION</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'foundation' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'foundation' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Operator CAD/CAM Academy
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Safety Standards &amp; Dust Control
                  </Link>
                </div>
              )}
            </div>

            {user?.role === 'Admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-xs font-bold text-industrial-orange bg-navy-900 mt-2"
              >
                ADMIN DASHBOARD PORTAL
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-slate-border flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold text-xs"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/request-quote');
              }}
            >
              Request Custom Quotation
            </Button>
            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs text-charcoal-700 hover:text-navy-900 font-semibold"
              >
                Sign In to Account
              </Link>
            ) : (
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs text-charcoal-700 hover:text-navy-900 font-semibold"
              >
                My Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
