import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  X,
  CheckCircle2,
  Cpu,
  Wrench,
  Factory,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  Scale,
  FileSpreadsheet,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { catalogService } from '@/services/catalogService';
import { Category, Product, HeroSlide } from '@/types';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectedCategory } from '@/features/catalog/catalogSlice';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { addToCompare } from '@/features/compare/compareSlice';
import { AvailabilityBadge } from '@/components/common/Badge';
import {
  handleImageError,
  CNC_ROUTER_SVG,
  SURFACE_PLANER_SVG,
  THICKNESS_PLANER_SVG,
  SPINDLE_SHAPER_SVG,
  CIRCULAR_SAW_SVG,
  EDGE_BANDER_SVG,
  PANEL_SAW_SVG,
  BORING_MACHINE_SVG,
  WIDE_BELT_SANDER_SVG,
  HYDRAULIC_PRESS_SVG,
  DUST_EXTRACTION_SVG,
  DIAMOND_TOOLING_SVG,
  ALL_MACHINERY_SVG,
} from '@/utils/imageUtils';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // 14 Featured Category Badges (Circular layout matching Gadget & Gear reference)
  const featuredCategoryBadges = [
    { id: 'cat-cnc', name: 'CNC Router', slug: 'cnc-router-machine', imageUrl: CNC_ROUTER_SVG },
    { id: 'cat-surf', name: 'Surface Planer', slug: 'surface-planer', imageUrl: SURFACE_PLANER_SVG },
    { id: 'cat-thick', name: 'Thickness Planer', slug: 'thickness-planer', imageUrl: THICKNESS_PLANER_SVG },
    { id: 'cat-spin', name: 'Spindle Shaper', slug: 'spindle-shaper-moulder', imageUrl: SPINDLE_SHAPER_SVG },
    { id: 'cat-circ', name: 'Circular Saw', slug: 'circular-saw', imageUrl: CIRCULAR_SAW_SVG },
    { id: 'cat-edge', name: 'Edge Banding', slug: 'edge-banding', imageUrl: EDGE_BANDER_SVG },
    { id: 'cat-panel', name: 'Panel Saws', slug: 'panel-saws', imageUrl: PANEL_SAW_SVG },
    { id: 'cat-bore', name: 'Boring & Drilling', slug: 'boring-drilling', imageUrl: BORING_MACHINE_SVG },
    { id: 'cat-sand', name: 'Belt Sanding', slug: 'sanding-finishing', imageUrl: WIDE_BELT_SANDER_SVG },
    { id: 'cat-press', name: 'Hydraulic Press', slug: 'hydraulic-presses', imageUrl: HYDRAULIC_PRESS_SVG },
    { id: 'cat-dust', name: 'Dust Extraction', slug: 'dust-extraction', imageUrl: DUST_EXTRACTION_SVG },
    { id: 'cat-tools', name: 'PCD Tooling', slug: 'cutter-accessories', imageUrl: DIAMOND_TOOLING_SVG },
    { id: 'cat-display', name: 'Display Center', slug: 'display-center', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', isDisplayCenter: true },
    { id: 'cat-all', name: 'All Machinery', slug: 'all', imageUrl: ALL_MACHINERY_SVG, isAll: true },
  ];

  // Hero Carousel State (Auto-swapping pictures with pause on hover)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [isHeroPaused, setIsHeroPaused] = useState<boolean>(false);

  useEffect(() => {
    const slides = catalogService.getHeroSlides();
    setHeroSlides(slides);

    const handleSlidesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HeroSlide[]>;
      if (customEvent.detail) {
        setHeroSlides(customEvent.detail.filter((s) => s.isActive));
      }
    };
    window.addEventListener('wts-hero-slides-updated', handleSlidesUpdate);
    return () => window.removeEventListener('wts-hero-slides-updated', handleSlidesUpdate);
  }, []);

  // Auto-play timer for Hero Machinery Visual
  useEffect(() => {
    if (heroSlides.length <= 1 || isHeroPaused) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // 4 seconds auto-swap

    return () => clearInterval(timer);
  }, [heroSlides.length, isHeroPaused]);

  const nextHeroSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }
  };

  const prevHeroSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const activeHeroSlide = heroSlides[currentHeroIndex] || heroSlides[0] || {
    id: 'default',
    badge: 'FEATURED MACHINE MODEL',
    title: 'WTS Prime-1325 Heavy Duty ATC CNC Router',
    subtitle: '9.0kW Italian ATC Spindle • Syntec 6MB CNC • Becker Vacuum',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    targetSlug: 'wts-prime-1325-atc-cnc-router',
    displayOrder: 1,
    isActive: true,
  };
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Featured Categories Single-Line Slider State (Auto-swapping with < > buttons)
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isCatPaused, setIsCatPaused] = useState(false);

  const scrollCategoriesLeft = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      if (scrollLeft <= 10) {
        categoryScrollRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        categoryScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
      }
    }
  };

  const scrollCategoriesRight = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        categoryScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        categoryScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
      }
    }
  };

  // Auto-swap categories carousel every 3.5 seconds
  useEffect(() => {
    if (isCatPaused) return;
    const timer = setInterval(() => {
      scrollCategoriesRight();
    }, 3500);
    return () => clearInterval(timer);
  }, [isCatPaused]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const compareItems = useAppSelector((state) => state.compare.items);
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, productsRes] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getProducts({ pageSize: 50 }),
        ]);
        const sortedCats = [...cats].sort((a, b) => a.displayOrder - b.displayOrder);
        setCategories(sortedCats);
        setAllProducts(productsRes.items);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // 1. Tapping ANY of the 5 Most Popular Items navigates to that category's dedicated page!
  const handlePopularItemNavigate = (categorySlug: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    dispatch(setSelectedCategory(categorySlug));
    navigate(`/products?category=${categorySlug}`);
  };

  // 5 Popular Items: 1 Hero on Left + 4 on Right in 2x2 grid
  const popularCategories = categories.slice(0, 5);
  const heroCategory = popularCategories[0]; // CNC ROUTER MACHINE
  const gridCategories = popularCategories.slice(1, 5); // SURFACE PLANER, THICKNESS PLANER, SPINDLE SHAPER, CIRCULAR SAW

  // Featured Products Section: Display top 9 products
  const featuredProducts = allProducts.slice(0, 9);

  return (
    <div className="space-y-10 sm:space-y-12 pb-14">
      {/* 1. HERO SECTION: PANORAMIC BANNER SLIDER (CLEAN WHITE / HIGH CONTRAST THEME) */}
      <section className="bg-surface-offwhite text-navy-900 pt-3 pb-5 sm:pb-7 border-b border-slate-200">
        {/* Wide Panoramic Hero Banner Slider on Light Theme (Pure Banner Graphics, No Text Overlay) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200 aspect-[16/7] sm:aspect-[21/9] min-h-[220px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[500px] flex items-center group select-none cursor-pointer"
            onMouseEnter={() => setIsHeroPaused(true)}
            onMouseLeave={() => setIsHeroPaused(false)}
            onClick={() => {
              if (activeHeroSlide.targetSlug) {
                navigate(
                  activeHeroSlide.targetSlug.startsWith('/')
                    ? activeHeroSlide.targetSlug
                    : `/products/${activeHeroSlide.targetSlug}`
                );
              }
            }}
          >
            {/* Active Slide Background Image - Pure Banner Image with No Text / No Whitewash Gradient */}
            <div className="absolute inset-0">
              <img
                key={activeHeroSlide.id}
                src={activeHeroSlide.imageUrl}
                alt={activeHeroSlide.title || 'Hero Banner'}
                onError={handleImageError}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-[1.01]"
              />
            </div>

            {/* Left & Right Interactive Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevHeroSlide();
                }}
                className="p-3 rounded-full bg-white/90 hover:bg-industrial-orange text-navy-900 hover:text-white border border-slate-200 shadow-lg backdrop-blur-xs transition-all pointer-events-auto cursor-pointer hover:scale-110"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextHeroSlide();
                }}
                className="p-3 rounded-full bg-white/90 hover:bg-industrial-orange text-navy-900 hover:text-white border border-slate-200 shadow-lg backdrop-blur-xs transition-all pointer-events-auto cursor-pointer hover:scale-110"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Top-Right Slide Counter & Auto-play Status */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm text-[11px] font-mono text-navy-900 font-bold z-20">
              <span className={`w-2 h-2 rounded-full ${isHeroPaused ? 'bg-amber-500' : 'bg-industrial-orange animate-pulse'}`} />
              <span>{String(currentHeroIndex + 1).padStart(2, '0')} / {String(heroSlides.length || 1).padStart(2, '0')}</span>
              {isHeroPaused && <span className="text-[10px] text-amber-600 font-sans ml-1">(Paused)</span>}
            </div>

            {/* Bottom Indicator Navigation Dots */}
            {heroSlides.length > 1 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentHeroIndex === idx
                        ? 'w-7 bg-industrial-orange'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Trust Badges Strip (Crystal Clear High Contrast) */}
          <div className="pt-5 pb-1 flex items-center justify-center flex-wrap gap-6 text-xs text-charcoal-700 font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Authorized Manufacturer Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Onsite Factory Installation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Genuine Spare Parts Supply</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY METRICS & CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-2 pb-2">
        <div className="bg-white rounded-xl shadow-premium border border-slate-border grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-border">
          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              150+
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Turnkey Facilities Commissioned
            </h4>
            <p className="text-xs text-slate-muted">
              Complete automated factory setups across nationwide industrial clusters.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              30+
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Machinery Product Lines
            </h4>
            <p className="text-xs text-slate-muted">
              Covering CNC nesting, edge processing, beam saws, and dust control.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              24-Hour
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Technical Service Response
            </h4>
            <p className="text-xs text-slate-muted">
              Dedicated field service engineers on standby for rapid onsite troubleshooting.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              100%
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Genuine Spare Parts
            </h4>
            <p className="text-xs text-slate-muted">
              In-stock inventory of diamond tooling, motors, solenoid valves, and controllers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES (SINGLE LINE HORIZONTAL SLIDER WITH AUTO-SWAP & PREV/NEXT < > BUTTONS) */}
      <section className="bg-white py-6 sm:py-7 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
          {/* Centered Section Title */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
              Featured Categories
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Explore industrial woodworking machinery by specialized manufacturing discipline
            </p>
          </div>

          {/* Single Line Carousel with Left & Right < > Buttons */}
          <div className="relative max-w-6xl mx-auto flex items-center group/cat-slider">
            {/* Left < Button (Shifted further left so it never touches or overlaps the first card) */}
            <button
              type="button"
              onClick={scrollCategoriesLeft}
              className="absolute -left-4 sm:-left-7 md:-left-9 lg:-left-12 top-9 sm:top-10 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white hover:bg-industrial-orange text-navy-900 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
              title="Previous Categories"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Single Row Horizontal Scroll Track */}
            <div
              ref={categoryScrollRef}
              onMouseEnter={() => setIsCatPaused(true)}
              onMouseLeave={() => setIsCatPaused(false)}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="no-scrollbar scrollbar-none flex items-start gap-4 sm:gap-6 lg:gap-7 overflow-x-auto scroll-smooth py-2 px-3 sm:px-4 w-full select-none"
            >
              {featuredCategoryBadges.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (cat.isAll) {
                      navigate('/products');
                    } else if (cat.isDisplayCenter) {
                      navigate('/display-center');
                    } else {
                      handlePopularItemNavigate(cat.slug);
                    }
                  }}
                  className="shrink-0 group flex flex-col items-center cursor-pointer text-center select-none w-20 sm:w-24 md:w-26 transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Circular Badge Avatar */}
                  <div className="w-17 h-17 sm:w-19 sm:h-19 md:w-21 md:h-21 rounded-full bg-[#f4f6f8] group-hover:bg-white border border-slate-200/80 group-hover:border-industrial-orange/50 shadow-2xs group-hover:shadow-md flex items-center justify-center p-3 transition-all duration-300 group-hover:scale-108">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      onError={handleImageError}
                      className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 object-contain drop-shadow-2xs group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>

                  {/* Clean Centered Label Underneath */}
                  <span className="text-xs sm:text-[13px] font-bold text-navy-900 group-hover:text-industrial-orange transition-colors mt-2 max-w-[95px] sm:max-w-[105px] leading-tight block text-center line-clamp-2">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right > Button (Shifted further right so it never touches or overlaps the last card) */}
            <button
              type="button"
              onClick={scrollCategoriesRight}
              className="absolute -right-4 sm:-right-7 md:-right-9 lg:-right-12 top-9 sm:top-10 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white hover:bg-industrial-orange text-navy-900 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
              title="Next Categories"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. MOST POPULAR ITEMS (TAP TAKES USER DIRECTLY TO DEDICATED CATEGORY PAGE!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Section Heading matching Reference Website */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
            WTS Woodworking Machinery — All Kind of Woodworking Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 uppercase tracking-tight">
            MOST POPULAR ITEMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We provide a complete woodworking solution with consultancy for factory planning,
            production layout plan, supply of machines, installation, operation training and after sales service.
          </p>
        </div>

        {/* 5 Box Container: Left Hero Box + Right 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Box: CNC ROUTER MACHINE */}
          {heroCategory && (
            <div
              onClick={() => handlePopularItemNavigate(heroCategory.slug)}
              className="lg:col-span-6 bg-white rounded-2xl border border-slate-border hover:border-industrial-orange hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group p-6 sm:p-8 text-center"
            >
              {/* Centered Machine Cutout Image */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[280px] sm:min-h-[360px]">
                <img
                  src={heroCategory.imageUrl || ''}
                  alt={heroCategory.name}
                  onError={handleImageError}
                  className="max-h-72 sm:max-h-80 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              {/* Bottom Centered Title (Clean, Bold, Just Like Photo 1) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
                <h3 className="font-extrabold text-lg sm:text-xl text-navy-900 group-hover:text-industrial-orange transition-colors tracking-wide uppercase">
                  {heroCategory.name}
                </h3>
                <span className="text-xs font-semibold text-industrial-orange mt-1 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Series Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* Right Side 2x2 Grid: SURFACE PLANER, THICKNESS PLANER, SPINDLE SHAPER, CIRCULAR SAW */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handlePopularItemNavigate(category.slug)}
                className="bg-white rounded-2xl border border-slate-border hover:border-industrial-orange hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group p-5 text-center"
              >
                {/* Centered Machine Cutout Image */}
                <div className="flex-1 flex items-center justify-center p-3 min-h-[160px] sm:min-h-[190px]">
                  <img
                    src={category.imageUrl || ''}
                    alt={category.name}
                    onError={handleImageError}
                    className="max-h-40 sm:max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Bottom Centered Title (Clean, Bold, Just Like Photo 1) */}
                <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
                  <h3 className="font-extrabold text-sm sm:text-base text-navy-900 group-hover:text-industrial-orange transition-colors tracking-wide uppercase">
                    {category.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5 group-hover:text-industrial-orange transition-colors inline-flex items-center gap-1">
                    <span>Explore Models</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (CLEAN 3-COL GRID, 9 PRODUCTS, HOVER QUICK VIEW, NO CATEGORY PILLS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 space-y-6">
        {/* Centered Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase tracking-tight">
            FEATURED PRODUCTS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Visit our demo and technology center to see all kind of woodworking machines
          </p>
          <div className="w-16 h-0.5 bg-slate-200 mx-auto mt-2" />
        </div>

        {/* Clean 3-Column Grid without artificial card boxes/borders */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
            {featuredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="group flex flex-col items-center text-center cursor-pointer select-none"
                >
                  {/* Machine Photo Container with Minimalist Hover Quick View */}
                  <div className="relative w-full aspect-4/3 flex items-center justify-center p-4 overflow-hidden">
                    <Link
                      to={`/products/${product.slug}`}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        onError={handleImageError}
                        className="max-h-56 sm:max-h-64 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Smooth Minimalist Hover View */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="bg-navy-900/90 hover:bg-industrial-orange text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-200 hover:scale-105 backdrop-blur-xs cursor-pointer"
                          title="Quick View Machine Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Machine Model Name & Category */}
                  <div className="pt-4 space-y-1">
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-bold text-sm sm:text-base text-navy-900 group-hover:text-industrial-orange transition-colors uppercase tracking-tight block line-clamp-1"
                      title={product.name}
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-slate-500 font-normal block">
                      {product.categoryName || 'CNC Router Machine'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-border space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-navy-900">
              No machinery models found.
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Visit our demo center or contact our engineering desk for catalog assistance.
            </p>
          </div>
        )}

        {/* View All Products Button */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center space-y-2 text-center">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              dispatch(setSelectedCategory(null));
              navigate('/products');
            }}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-navy-950 hover:bg-industrial-orange text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
          >
            <span>View All Machinery by Category</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Explore complete catalog across all industrial manufacturing disciplines
          </span>
        </div>
      </section>

      {/* QUICK VIEW MODAL (CLEAN, PROFESSIONAL, NO CLUTTER) */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-border animate-in zoom-in-95 duration-200 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              title="Close Quick View"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Cutout Photo */}
              <div className="aspect-4/3 bg-surface-offwhite rounded-xl flex items-center justify-center p-6 border border-slate-100">
                <img
                  src={quickViewProduct.mainImageUrl}
                  alt={quickViewProduct.name}
                  onError={handleImageError}
                  className="max-h-52 w-auto object-contain drop-shadow-sm"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3 text-left">
                <span className="text-xs font-semibold uppercase text-industrial-orange tracking-wider">
                  {quickViewProduct.categoryName || 'Woodworking Machinery'}
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 uppercase leading-snug">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {quickViewProduct.shortDescription || 'Heavy-duty industrial manufacturing solution with certified factory warranty.'}
                </p>

                {/* Key Technical Parameters */}
                <div className="space-y-1.5 pt-2 text-xs">
                  {quickViewProduct.specifications?.travelling_size && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Travelling Size:</span>
                      <span className="font-semibold text-navy-900">{quickViewProduct.specifications.travelling_size}</span>
                    </div>
                  )}
                  {quickViewProduct.specifications?.spindle_power && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Spindle Power:</span>
                      <span className="font-semibold text-navy-900">{quickViewProduct.specifications.spindle_power}</span>
                    </div>
                  )}
                  {quickViewProduct.specifications?.control_system && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Control System:</span>
                      <span className="font-semibold text-navy-900">{quickViewProduct.specifications.control_system}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      dispatch(addToBasket({ product: quickViewProduct }));
                      setQuickViewProduct(null);
                    }}
                    icon={<FileSpreadsheet className="w-4 h-4" />}
                    className="w-full justify-center font-bold text-xs"
                  >
                    Add to Quotation / RFQ
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuickViewProduct(null);
                      navigate(`/products/${quickViewProduct.slug}`);
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="w-full justify-center font-bold text-xs"
                  >
                    View Full Product Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ABOUT UNIQUE WOOD SOLUTION (CRAFTSMANSHIP, STORY & PHILOSOPHY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-industrial-orange text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About Unique Wood Solution</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                More Than Craftsmen — <br />
                <span className="text-industrial-orange">We Are Storytellers</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                At <strong>Unique Wood Solution</strong>, we are more than craftsmen; we are storytellers,
                weaving tales of passion, creativity, and expertise through the medium of wood.
                Established with a vision to redefine craftsmanship and innovation, our journey began with
                a profound love for the timeless beauty and versatility of wood.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Driven by an unwavering commitment to excellence, our goal is to create exceptional wooden
                pieces that inspire, captivate, and endure. We embrace age-old techniques passed down through
                generations, infusing them with modern design sensibilities.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy-950 hover:bg-industrial-orange text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-102"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-offwhite hover:bg-slate-100 text-navy-900 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-all"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                  alt="Craftsmanship at Unique Wood Solution"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-5 -left-5 bg-navy-950 text-white p-5 rounded-2xl shadow-xl border border-navy-800 max-w-xs hidden sm:block">
                <span className="text-xs font-bold text-industrial-orange uppercase tracking-wider block">
                  Tradition &amp; Innovation
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  Crafting bespoke solutions that reflect unique personalities, elegance, and durability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTHORIZED MANUFACTURERS & BRANDS */}
      <section className="bg-white border-y border-slate-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-muted">
              Global Manufacturing Partnerships
            </span>
            <h3 className="text-xl font-bold text-navy-900">
              Direct Technology Partners &amp; Authorized Brands
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { name: 'Nanxing Machinery', country: 'Pioneer in Automatic Beam Saws & Edgebanders', origin: 'China' },
              { name: 'KDT Machinery', country: 'Leader in 6-Sided CNC Boring & Nesting Lines', origin: 'China' },
              { name: 'Homag Group Partner', country: 'Precision German Engineering Solutions', origin: 'Germany' },
              { name: 'WoodTech Prime Tech', country: 'Heavy-Duty Tropicalized Machinery Lines', origin: 'Taiwan' },
            ].map((brand) => (
              <div
                key={brand.name}
                className="p-5 rounded-lg border border-slate-border bg-surface-offwhite text-center space-y-1 hover:border-industrial-orange/40 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange block">
                  {brand.origin}
                </span>
                <h4 className="font-bold text-sm text-navy-900">{brand.name}</h4>
                <p className="text-[11px] text-slate-muted">{brand.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-charcoal-900 text-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-navy-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-industrial-orange font-bold">
              Ready to Upgrade Your Factory Line?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Build your customized Request for Quote (RFQ) online today.
            </h3>
            <p className="text-sm text-slate-300">
              Select multiple machines, add your custom electrical and voltage requirements, and
              receive a formal proforma proposal from our senior engineering team within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-industrial-orange hover:bg-industrial-orange-hover text-white font-bold rounded-lg shadow-lg transition-all"
            >
              <span>Build RFQ Basket</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/compare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg border border-navy-700 transition-all text-sm"
            >
              <span>Compare Models</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
