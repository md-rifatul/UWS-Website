import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Star,
  Layers,
  Grid,
  ShoppingCart,
} from 'lucide-react';
import { catalogService } from '@/services/catalogService';
import { Category, Product, HeroSlide } from '@/types';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setSelectedCategory } from '@/features/catalog/catalogSlice';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { addToCompare } from '@/features/compare/compareSlice';
import { AvailabilityBadge } from '@/components/common/Badge';
import { handleImageError } from '@/utils/imageUtils';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Dynamic Machinery Categories from Backend
  const shopCategories = useMemo(() => {
    return categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

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

  const activeHeroSlide: HeroSlide | null = heroSlides[currentHeroIndex] || heroSlides[0] || null;
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const compareItems = useAppSelector((state) => state.compare.items);
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);
  const featuredSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, productsRes] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getProducts({ pageSize: 100 }),
        ]);
        const sortedCats = [...cats].sort((a, b) => a.displayOrder - b.displayOrder);
        setCategories(sortedCats);
        setAllProducts(productsRes.items);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();

    const handleCatsUpdate = async () => {
      try {
        const cats = await catalogService.getCategories();
        setCategories([...cats].sort((a, b) => a.displayOrder - b.displayOrder));
      } catch {}
    };
    window.addEventListener('uws-categories-updated', handleCatsUpdate);
    return () => window.removeEventListener('uws-categories-updated', handleCatsUpdate);
  }, []);

  // Tapping ANY machine or component category navigates to that category's dedicated catalog page!
  const handlePopularItemNavigate = (categorySlug: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    dispatch(setSelectedCategory(categorySlug));
    navigate(`/products?category=${categorySlug}`);
  };

  // Featured Products Section: Strictly controlled by Admin/Backend via Inventory Featured status (isFeatured === true)
  const featuredProducts = useMemo(() => {
    return allProducts.filter((p) => p.isFeatured);
  }, [allProducts]);

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
            {/* Active Slide Background Image or Clean Branded Banner if no slides configured */}
            {activeHeroSlide?.imageUrl ? (
              <div className="absolute inset-0">
                <img
                  key={activeHeroSlide.id}
                  src={activeHeroSlide.imageUrl}
                  alt={activeHeroSlide.title || 'Hero Banner'}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-[1.01]"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#0d1b2a] to-navy-950 flex flex-col items-center justify-center text-center p-6 sm:p-10 text-white">
                <span className="text-[11px] font-bold uppercase tracking-widest text-industrial-orange px-3.5 py-1 bg-white/10 rounded-full mb-3 border border-industrial-orange/30">
                  Unique Wood Solution
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
                  High-Precision CNC Routers &amp; Motion Automation Spares
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-3 leading-relaxed">
                  Turnkey industrial machinery supply, specialized accessories, motors, drivers, spindles, inverters, and digital controllers.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    to="/products"
                    onClick={(e) => e.stopPropagation()}
                    className="px-5 py-2.5 rounded-xl bg-industrial-orange hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Left & Right Interactive Navigation Arrows */}
            {heroSlides.length > 1 && (
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
            )}

            {/* Top-Right Slide Counter & Auto-play Status */}
            {heroSlides.length > 1 && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm text-[11px] font-mono text-navy-900 font-bold z-20">
                <span className={`w-2 h-2 rounded-full ${isHeroPaused ? 'bg-amber-500' : 'bg-industrial-orange animate-pulse'}`} />
                <span>{String(currentHeroIndex + 1).padStart(2, '0')} / {String(heroSlides.length || 1).padStart(2, '0')}</span>
                {isHeroPaused && <span className="text-[10px] text-amber-600 font-sans ml-1">(Paused)</span>}
              </div>
            )}

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

      {/* 3. SHOP BY CATEGORY (DYNAMICALLY LOADED FROM BACKEND DATABASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Shop by Category
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Category Cards Grid (Controlled by Admin Category Management in Backend) */}
        {shopCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
            {shopCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handlePopularItemNavigate(cat.slug)}
                className="bg-[#f8fafc] hover:bg-white rounded-2xl border border-slate-200/70 hover:border-blue-400 hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between cursor-pointer group select-none min-h-[190px]"
              >
                {/* Category Image from Backend Server Upload */}
                <div className="w-full h-28 sm:h-32 flex items-center justify-center p-2 mb-3">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      onError={handleImageError}
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center rounded-xl bg-slate-100/70 text-slate-300 group-hover:text-blue-500 transition-colors">
                      <Layers className="w-9 h-9 stroke-[1.5]" />
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">No Image</span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Category Name & Circular Arrow Button */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <span className="font-bold text-xs sm:text-sm text-navy-950 group-hover:text-blue-600 transition-colors truncate">
                    {cat.name}
                  </span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-500 font-medium">No categories available in the database yet.</p>
          </div>
        )}
      </section>



      {/* 4. FEATURED PRODUCTS (DYNAMICALLY CONTROLLED BY BACKEND ADMIN TOGGLE isFeatured) */}
      <section ref={featuredSectionRef} id="featured-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Grid: Featured Products from Backend */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.map((product, idx) => {
              const inBasket = rfqItems.some((item) => item.productId === product.id);
              const badgeText = product.condition === 'BrandNew' && idx % 2 !== 0 
                ? 'New' 
                : (idx % 2 === 0 ? 'Best Seller' : 'New');

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group p-5 cursor-pointer select-none"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  <div>
                    {/* Top Row: Pill Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-2xs">
                        {badgeText}
                      </span>
                    </div>

                    {/* Centered Cutout Product Image from Backend */}
                    <div className="w-full h-44 sm:h-48 flex items-center justify-center p-2 mb-3 bg-slate-50/50 rounded-xl overflow-hidden">
                      {product.mainImageUrl ? (
                        <img
                          src={product.mainImageUrl}
                          alt={product.name}
                          onError={handleImageError}
                          className="max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-300 drop-shadow-sm"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center rounded-xl bg-slate-100/70 text-slate-300 group-hover:text-blue-500 transition-colors">
                          <Package className="w-10 h-10 stroke-[1.5]" />
                          <span className="text-[11px] text-slate-400 mt-1 font-medium">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Name & Subcategory */}
                    <div className="space-y-1 mb-4 text-left">
                      <h3
                        className="font-bold text-sm sm:text-base text-navy-950 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[44px] leading-snug"
                        title={product.name}
                      >
                        {product.name}
                        {product.modelNumber && !product.name.includes(product.modelNumber) && (
                          <span className="text-slate-500 font-normal ml-1">({product.modelNumber})</span>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Row: Price & Circular Cart Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-baseline">
                      {product.referencePrice ? (
                        <span className="text-base sm:text-lg font-extrabold text-blue-600 tracking-tight">
                          ৳ {product.referencePrice.toLocaleString('en-BD')}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-slate-600">
                          Contact for Price
                        </span>
                      )}
                    </div>

                    {/* Circular Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToBasket({ product }));
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0 ${
                        inBasket
                          ? 'bg-emerald-600 text-white shadow-emerald-200'
                          : 'bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white hover:shadow-md'
                      }`}
                      title={inBasket ? 'In RFQ Basket' : 'Add to RFQ Basket'}
                    >
                      {inBasket ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 stroke-[2]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-base text-navy-950">
              No Featured Products Selected
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Featured products are controlled directly from the backend. Go to the Admin Dashboard to mark products with ★ Featured to display them here.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
              >
                <span>Manage Featured Products in Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
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
