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
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
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
      setDesktopSearchOpen(false);
    }
  };

  const rfqItems = useAppSelector((state) => state.rfqBasket.items);
  const compareItems = useAppSelector((state) => state.compare.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const totalRfqCount = rfqItems.reduce((acc, it) => acc + it.quantity, 0);

  // Active state styling matching user specifications
  const isHome = location.pathname === '/';
  const isAbout = location.pathname.startsWith('/about');
  const isMachinery =
    location.pathname.startsWith('/products') &&
    !location.search.toLowerCase().includes('cutter') &&
    !location.search.toLowerCase().includes('motor') &&
    !location.search.toLowerCase().includes('drive') &&
    !location.search.toLowerCase().includes('spindle') &&
    !location.search.toLowerCase().includes('inverter') &&
    !location.search.toLowerCase().includes('remote');
  const isAccessories =
    location.pathname.startsWith('/products') &&
    (location.search.toLowerCase().includes('cutter') ||
      location.search.toLowerCase().includes('motor') ||
      location.search.toLowerCase().includes('drive') ||
      location.search.toLowerCase().includes('spindle') ||
      location.search.toLowerCase().includes('inverter') ||
      location.search.toLowerCase().includes('remote'));
  const isDisplay = location.pathname === '/display-center';
  const isGallery = location.pathname === '/projects';
  const isContact = location.pathname === '/contact';

  const toggleMobileDropdown = (name: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
      <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 xl:gap-6 w-full">
          {/* Left: Brand Logo (Dynamic from Admin Settings) */}
          <div className="flex items-center justify-start shrink-0 mr-3 xl:mr-6">
            <Link to="/" className="flex items-center gap-2 group">
              {siteSettings.logo_url ? (
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings.logo_title || 'WoodTech Solutions'}
                  className="h-8 sm:h-9 xl:h-10 w-auto max-w-[130px] xl:max-w-[170px] object-contain shrink-0"
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
          <nav
            style={{ justifyContent: 'safe center' }}
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 2xl:gap-3 text-[11px] xl:text-xs font-bold uppercase tracking-tight shrink-0 mx-auto px-1"
          >
            {/* 1. HOME */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors py-1.5 px-1.5 xl:px-2 flex items-center rounded ${
                  isActive ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 hover:text-emerald-600'
                }`
              }
            >
              HOME
            </NavLink>

            {/* 2. ABOUT US (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isAbout ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>ABOUT US</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0 opacity-70" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/about#profile"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Company Profile</span>
                  <span className="text-[11px] text-slate-500 font-normal">Our heritage, vision &amp; craftsmanship</span>
                </Link>
                <Link
                  to="/about#team"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Our Team</span>
                  <span className="text-[11px] text-slate-500 font-normal">Passionate artisans, engineers &amp; leaders</span>
                </Link>
                <Link
                  to="/about#mission"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Our Mission</span>
                  <span className="text-[11px] text-slate-500 font-normal">Crafting excellence with purpose &amp; sustainability</span>
                </Link>
              </div>
            </div>

            {/* 3. MACHINERY (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isMachinery ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>MACHINERY</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/products"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">All Machines</span>
                  <span className="text-[11px] text-slate-500 font-normal">Explore full woodworking lineup</span>
                </Link>
                <Link
                  to="/products?search=CNC+Router"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">CNC Router</span>
                  <span className="text-[11px] text-slate-500 font-normal">Classic &amp; heavy-duty nesting routers</span>
                </Link>
                <Link
                  to="/products?search=Surface+Planer"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Surface Planer</span>
                  <span className="text-[11px] text-slate-500 font-normal">Helical spiral silent jointers</span>
                </Link>
                <Link
                  to="/products?search=Thickness+Planer"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Thickness Planer</span>
                  <span className="text-[11px] text-slate-500 font-normal">Digital elevation thicknessers</span>
                </Link>
                <Link
                  to="/products?search=Spindle+Shaper"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Spindle Shaper</span>
                  <span className="text-[11px] text-slate-500 font-normal">High-speed tilting moulders</span>
                </Link>
                <Link
                  to="/products?search=Circular+Saw"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Circular Saw</span>
                  <span className="text-[11px] text-slate-500 font-normal">Sliding table &amp; precision beam saws</span>
                </Link>
              </div>
            </div>

            {/* 4. ACCESSORIES (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/products?search=Accessories')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isAccessories ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>ACCESSORIES</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/products?search=Cutter"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Cutter Accessories</span>
                  <span className="text-[11px] text-slate-500 font-normal">Diamond PCD router bits, blades &amp; inserts</span>
                </Link>
                <Link
                  to="/products?search=Motor"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Motor</span>
                  <span className="text-[11px] text-slate-500 font-normal">AC servo &amp; stepper drive motors</span>
                </Link>
                <Link
                  to="/products?search=Drive"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Drive</span>
                  <span className="text-[11px] text-slate-500 font-normal">High precision digital servo drives</span>
                </Link>
                <Link
                  to="/products?search=Spindle"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Spindle</span>
                  <span className="text-[11px] text-slate-500 font-normal">Air &amp; water-cooled electro-spindles</span>
                </Link>
                <Link
                  to="/products?search=Inverter"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Inverter</span>
                  <span className="text-[11px] text-slate-500 font-normal">High frequency VFD variable inverters</span>
                </Link>
                <Link
                  to="/products?search=Remote"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Remote</span>
                  <span className="text-[11px] text-slate-500 font-normal">Wireless MPG &amp; DSP hand controllers</span>
                </Link>
              </div>
            </div>

            {/* 5. DISPLAY CENTER (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/display-center')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isDisplay ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span><span className="hidden xl:inline">DISPLAY </span>CENTER</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/display-center"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Showroom</span>
                  <span className="text-[11px] text-slate-500 font-normal">Experience machinery live demos in Keraniganj</span>
                </Link>
                <Link
                  to="/display-center#factory-visit"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Factory Visit</span>
                  <span className="text-[11px] text-slate-500 font-normal">Book test cut session with your board samples</span>
                </Link>
              </div>
            </div>

            {/* 6. GALLERY (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isGallery ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span>GALLERY</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/projects#projects"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Machine Gallery</span>
                  <span className="text-[11px] text-slate-500 font-normal">Industrial equipment in action</span>
                </Link>
                <Link
                  to="/projects#projects"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Project Gallery</span>
                  <span className="text-[11px] text-slate-500 font-normal">Turnkey automated factory installations</span>
                </Link>
              </div>
            </div>

            {/* 7. CONTACT US (DROPDOWN) */}
            <div className="relative group py-1.5">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className={`flex items-center gap-0.5 xl:gap-1 transition-colors uppercase cursor-pointer px-1.5 xl:px-2 rounded whitespace-nowrap ${
                  isContact ? 'text-emerald-600 font-extrabold' : 'text-charcoal-800 group-hover:text-emerald-600'
                }`}
              >
                <span><span className="hidden xl:inline">CONTACT </span>US</span>
                <ChevronDown className="w-2.5 h-2.5 xl:w-3 xl:h-3 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
              </button>

              <div className="absolute top-full right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/contact#info"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-navy-900 block text-xs">Contact Information</span>
                  <span className="text-[11px] text-slate-500 font-normal">Hotline, email &amp; inquiry messaging</span>
                </Link>
                <Link
                  to="/contact#locations"
                  className="block px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <span className="font-bold text-navy-900 block text-xs">Location</span>
                  <span className="text-[11px] text-slate-500 font-normal">Head office, display center &amp; warehouse</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Action Tools: Minimal Search, Compare, RFQ Basket, Auth, CTA */}
          <div className="hidden lg:flex items-center justify-end gap-1.5 xl:gap-2.5 shrink-0 ml-auto">
            {/* On lg (1024px - 1279px): Compact Search Icon Button */}
            <button
              type="button"
              onClick={() => setDesktopSearchOpen(!desktopSearchOpen)}
              className={`p-1.5 rounded-md transition-colors xl:hidden cursor-pointer ${
                desktopSearchOpen
                  ? 'bg-industrial-orange/15 text-industrial-orange'
                  : 'text-charcoal-700 hover:text-navy-900 hover:bg-slate-100'
              }`}
              title="Search Machinery"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-industrial-orange" />
            </button>

            {/* On xl (1280px+): Minimal Inline Search Box */}
            <form onSubmit={handleHeaderSearch} className="relative hidden xl:flex items-center group shrink-0">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none group-focus-within:text-industrial-orange transition-colors" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-28 2xl:w-36 pl-8 pr-6 py-1.5 text-xs text-navy-950 placeholder:text-slate-400 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-industrial-orange rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-industrial-orange/20 shadow-2xs font-medium"
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
                  <span className="hidden 2xl:inline-block absolute right-2 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded shadow-2xs pointer-events-none">
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

      {/* Desktop Compact Search Dropdown (for 1024px - 1279px screens) */}
      {desktopSearchOpen && (
        <div className="hidden lg:block xl:hidden px-6 py-2.5 bg-slate-50 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-150 shadow-inner">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleHeaderSearch} className="relative flex items-center">
              <Search className="w-4 h-4 text-industrial-orange absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search machinery, models, SKUs..."
                className="w-full pl-10 pr-9 py-2 text-xs text-navy-950 placeholder-slate-400 bg-white border border-slate-300 rounded-full focus:outline-none focus:border-industrial-orange focus:ring-2 focus:ring-industrial-orange/15 font-medium shadow-2xs"
              />
              {headerSearch ? (
                <button
                  type="button"
                  onClick={() => setHeaderSearch('')}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-navy-900 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDesktopSearchOpen(false)}
                  className="absolute right-3 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-600 rounded bg-slate-100 cursor-pointer"
                >
                  ESC
                </button>
              )}
            </form>
          </div>
        </div>
      )}

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
              className={`block px-3 py-2.5 rounded-md ${
                isHome ? 'text-emerald-600 font-extrabold bg-emerald-50/60' : 'text-charcoal-800 hover:bg-slate-50'
              }`}
            >
              HOME
            </Link>

            {/* 2. ABOUT US Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('about')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isAbout ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>ABOUT US</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'about' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/about#profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Company Profile
                  </Link>
                  <Link
                    to="/about#team"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Our Team
                  </Link>
                  <Link
                    to="/about#mission"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Our Mission
                  </Link>
                </div>
              )}
            </div>

            {/* 3. MACHINERY Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('machinery')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isMachinery ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>MACHINERY</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'machinery' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'machinery' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange font-semibold"
                  >
                    All Machines
                  </Link>
                  <Link
                    to="/products?search=CNC+Router"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    CNC Router
                  </Link>
                  <Link
                    to="/products?search=Surface+Planer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Surface Planer
                  </Link>
                  <Link
                    to="/products?search=Thickness+Planer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Thickness Planer
                  </Link>
                  <Link
                    to="/products?search=Spindle+Shaper"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Spindle Shaper
                  </Link>
                  <Link
                    to="/products?search=Circular+Saw"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Circular Saw
                  </Link>
                </div>
              )}
            </div>

            {/* 4. ACCESSORIES Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('accessories')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isAccessories ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>ACCESSORIES</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'accessories' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'accessories' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/products?search=Cutter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Cutter Accessories
                  </Link>
                  <Link
                    to="/products?search=Motor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Motor
                  </Link>
                  <Link
                    to="/products?search=Drive"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Drive
                  </Link>
                  <Link
                    to="/products?search=Spindle"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Spindle
                  </Link>
                  <Link
                    to="/products?search=Inverter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Inverter
                  </Link>
                  <Link
                    to="/products?search=Remote"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Remote
                  </Link>
                </div>
              )}
            </div>

            {/* 5. DISPLAY CENTER Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('display')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isDisplay ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>DISPLAY CENTER</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'display' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'display' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/display-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Showroom
                  </Link>
                  <Link
                    to="/display-center#factory-visit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Factory Visit
                  </Link>
                </div>
              )}
            </div>

            {/* 6. GALLERY Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('gallery')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isGallery ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>GALLERY</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'gallery' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'gallery' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/projects#projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Machine Gallery
                  </Link>
                  <Link
                    to="/projects#projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Project Gallery
                  </Link>
                </div>
              )}
            </div>

            {/* 7. CONTACT US Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleMobileDropdown('contact')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left font-bold ${
                  isContact ? 'text-emerald-600' : 'text-charcoal-800 hover:bg-slate-50'
                }`}
              >
                <span>CONTACT US</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'contact' ? 'rotate-180' : ''}`} />
              </button>
              {mobileOpenDropdown === 'contact' && (
                <div className="pl-6 space-y-1 py-1 font-normal normal-case text-xs">
                  <Link
                    to="/contact#info"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Contact Information
                  </Link>
                  <Link
                    to="/contact#locations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-industrial-orange"
                  >
                    Location
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
