import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Globe,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Eye,
  Sparkles,
  ExternalLink,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { catalogService } from '@/services/catalogService';
import { HeroSlide, Product, SiteSetting } from '@/types';
import Button from '@/components/common/Button';
import { handleImageError } from '@/utils/imageUtils';

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'company' | 'seo'>('hero');

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideFormData, setSlideFormData] = useState<Omit<HeroSlide, 'id'>>({
    badge: 'FEATURED MACHINE MODEL',
    title: '',
    subtitle: '',
    imageUrl: '',
    targetSlug: '',
    displayOrder: 1,
    isActive: true,
  });

  // Company, Brand, and SEO Settings
  const [siteSettings, setSiteSettings] = useState({
    logo_url: '',
    logo_short: 'WTS',
    logo_title: 'WOODTECH',
    logo_badge: 'Solutions',
    showroom_name: 'Central Technology Center',
    showroom_badge: '40,000 sq ft Demo',
    showroom_address: 'Plot 42, Tejgaon Industrial Area, Dhaka-1208, Bangladesh',
    showroom_hours: 'Sat – Thu: 9:00 AM – 7:00 PM',
    showroom_phone: '+880 1700-000000 / +880 2-9880000',
    showroom_maps_url: 'https://maps.google.com/?q=Tejgaon+Industrial+Area+Dhaka',
    office_name: 'Corporate Head Office',
    office_address: 'House #14, Road #18, Sector #07, Uttara Model Town, Dhaka-1230, Bangladesh',
    support_phone: '+880 1700-000000',
    support_email: 'info@woodtechsolutionbd.com',
    whatsapp_number: '+880 1700-000000',
    partner_badge: 'Authorized Industrial Technology Partner',
    hero_headline: 'High-Precision CNC & Industrial Woodworking Machinery',
    hero_subtitle: 'Turnkey industrial solutions with complete factory planning, automated production line layout, machinery commissioning, and genuine spare parts support.',
    seo_title: 'WoodTech Solutions | Industrial Woodworking Machinery & CNC Routers Bangladesh',
    seo_description: 'Official importer and distributor of high-precision CNC routers, computerized beam saws, automatic edgebanders, and wide belt sanders in Bangladesh.',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Load Hero Slides
        const slides = adminService.getHeroSlides();
        setHeroSlides(slides);

        // 2. Load Products for target slug dropdown
        const prodsRes = await catalogService.getProducts({ pageSize: 50 });
        setProducts(prodsRes.items);

        // 3. Load Site Settings
        const remoteSettings = await adminService.getSiteSettings();
        if (remoteSettings && remoteSettings.length > 0) {
          const map: Record<string, string> = {};
          remoteSettings.forEach((s) => {
            map[s.key] = s.value;
          });
          setSiteSettings((prev) => ({ ...prev, ...map }));
        }
      } catch (err) {
        console.warn('Using default settings and slides', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // ----------------------------------------------------
  // HERO SLIDE CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideFormData({
      badge: 'FEATURED MACHINE MODEL',
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      targetSlug: products[0]?.slug || '',
      displayOrder: heroSlides.length + 1,
      isActive: true,
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideFormData({
      badge: slide.badge,
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      targetSlug: slide.targetSlug || '',
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
    });
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: HeroSlide[];
    if (editingSlide) {
      updated = heroSlides.map((s) =>
        s.id === editingSlide.id ? { ...slideFormData, id: s.id } : s
      );
    } else {
      const newSlide: HeroSlide = {
        ...slideFormData,
        id: `hs-${Date.now()}`,
      };
      updated = [...heroSlides, newSlide];
    }

    updated.sort((a, b) => a.displayOrder - b.displayOrder);
    setHeroSlides(updated);
    adminService.saveHeroSlides(updated);
    setIsSlideModalOpen(false);
    showNotification('Hero machinery slide saved and live!');
  };

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this hero visual slide?')) return;
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    adminService.saveHeroSlides(updated);
    showNotification('Hero slide deleted.');
  };

  const handleToggleSlideActive = (id: string) => {
    const updated = heroSlides.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setHeroSlides(updated);
    adminService.saveHeroSlides(updated);
    showNotification('Hero slide status updated.');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= heroSlides.length) return;

    const copy = [...heroSlides];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;

    // re-assign display orders
    copy.forEach((s, i) => {
      s.displayOrder = i + 1;
    });

    setHeroSlides(copy);
    adminService.saveHeroSlides(copy);
    showNotification('Slide order updated.');
  };

  // 1-Click Sync from Featured Products in Catalog
  const handleSyncFromFeaturedProducts = () => {
    const featured = products.filter((p) => p.isFeatured);
    if (featured.length === 0) {
      alert('No products are currently marked as Featured in the inventory.');
      return;
    }

    const newSlides: HeroSlide[] = featured.map((p, idx) => ({
      id: `hs-auto-${p.id}`,
      badge: 'FEATURED MACHINERY',
      title: p.name,
      subtitle: `${p.specifications?.travelling_size || p.specifications?.working_area || ''} • ${p.specifications?.spindle_power || 'Industrial'} • In Stock`,
      imageUrl: p.mainImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      targetSlug: p.slug,
      displayOrder: idx + 1,
      isActive: true,
    }));

    setHeroSlides(newSlides);
    adminService.saveHeroSlides(newSlides);
    showNotification(`Successfully populated ${newSlides.length} slides from Featured Products!`);
  };

  // ----------------------------------------------------
  // SETTINGS FORM HANDLERS
  // ----------------------------------------------------
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: SiteSetting[] = Object.entries(siteSettings).map(([k, v]) => ({
        key: k,
        value: v,
        group: k.startsWith('logo') ? 'Brand' : k.startsWith('showroom') || k.startsWith('office') ? 'Location' : k.startsWith('seo') ? 'SEO' : k.startsWith('hero') ? 'Homepage' : 'Contact',
      }));

      await adminService.updateSiteSettings(payload);
      showNotification('Logo, addresses, and platform settings successfully saved to backend!');
    } catch (err) {
      console.error('Failed to update settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading configuration and hero sliders...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Platform CMS & Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Hero Visual & Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Full administrative control over homepage machinery carousel, company contacts, and global parameters.
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-border">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'border-industrial-orange text-industrial-orange'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Hero Auto-Slider Manager ({heroSlides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'border-industrial-orange text-industrial-orange'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Logo, Addresses & Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'seo'
              ? 'border-industrial-orange text-industrial-orange'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Homepage Text & SEO</span>
        </button>
      </div>

      {/* TAB 1: HERO SLIDER MANAGER */}
      {activeTab === 'hero' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-navy-950 text-white rounded-xl shadow-xs">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Homepage Hero Machinery Showcase</span>
                <span className="text-[10px] bg-industrial-orange text-navy-950 px-2 py-0.5 rounded-full font-mono uppercase font-extrabold">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                These slides rotate automatically every 4 seconds on the homepage hero card. You can add, edit, reorder or sync from inventory.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncFromFeaturedProducts}
                icon={<Sparkles className="w-3.5 h-3.5 text-industrial-orange" />}
                className="text-xs font-bold border-navy-700 bg-navy-900 text-slate-200 hover:text-white"
              >
                Sync From Featured Products
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddSlide}
                icon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Add Hero Slide
              </Button>
            </div>
          </div>

          {/* Slides Table */}
          <div className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-border text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 w-12 text-center">Order</th>
                    <th className="py-3.5 px-4 w-28">Preview</th>
                    <th className="py-3.5 px-4">Machine Title &amp; Badge</th>
                    <th className="py-3.5 px-4">Specifications Subtitle</th>
                    <th className="py-3.5 px-4 w-32">Status</th>
                    <th className="py-3.5 px-4 w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {heroSlides.map((slide, idx) => (
                    <tr key={slide.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Order and Move Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSlide(idx, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-navy-900 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-navy-900 text-xs">
                            {slide.displayOrder}
                          </span>
                          <button
                            type="button"
                            disabled={idx === heroSlides.length - 1}
                            onClick={() => handleMoveSlide(idx, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-navy-900 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-navy-900 border border-slate-200 flex items-center justify-center p-1">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            onError={handleImageError}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </td>

                      {/* Title & Badge */}
                      <td className="py-3.5 px-4 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-industrial-orange block">
                          {slide.badge}
                        </span>
                        <span className="font-bold text-navy-900 text-sm block">
                          {slide.title}
                        </span>
                        {slide.targetSlug && (
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <span>Link: /products/{slide.targetSlug}</span>
                          </span>
                        )}
                      </td>

                      {/* Subtitle */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed">{slide.subtitle}</p>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleSlideActive(slide.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                            slide.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${slide.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{slide.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSlide(slide)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-navy-900 transition-colors cursor-pointer"
                            title="Edit Slide"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {heroSlides.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No hero machinery slides defined. Click "Add Hero Slide" or "Sync From Featured Products".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOGO, SHOWROOM ADDRESSES & CONTACTS */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
          {/* Card 1: Brand Logo Configuration */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-industrial-orange" />
                <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                  Brand Logo Settings (Header &amp; Footer)
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Live Navbar Logo Customization
              </span>
            </div>

            {/* Live Visual Logo Preview Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Navbar Logo Live Preview
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  This is exactly how your logo will render on the website header.
                </p>
              </div>

              <div className="px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 shrink-0">
                {siteSettings.logo_url ? (
                  <img
                    src={siteSettings.logo_url}
                    alt={siteSettings.logo_title || 'Logo'}
                    className="h-9 sm:h-10 w-auto max-w-[170px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-900 rounded-lg flex items-center justify-center text-white shadow-md">
                      <span className="font-extrabold tracking-tighter text-base sm:text-lg text-industrial-orange">
                        {siteSettings.logo_short || 'WTS'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
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
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
                <label className="font-semibold text-charcoal-700 flex items-center justify-between">
                  <span>Custom Image Logo URL (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">PNG or SVG with transparent background</span>
                </label>
                <input
                  type="url"
                  name="logo_url"
                  value={siteSettings.logo_url}
                  onChange={handleSettingChange}
                  placeholder="https://example.com/logo.png (leave empty to use styled text logo below)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Logo Monogram / Short Code</label>
                <input
                  type="text"
                  name="logo_short"
                  value={siteSettings.logo_short}
                  onChange={handleSettingChange}
                  placeholder="e.g. WTS"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-charcoal-700">Primary Brand Title</label>
                <input
                  type="text"
                  name="logo_title"
                  value={siteSettings.logo_title}
                  onChange={handleSettingChange}
                  placeholder="e.g. WOODTECH"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Subtitle Badge Text</label>
                <input
                  type="text"
                  name="logo_badge"
                  value={siteSettings.logo_badge}
                  onChange={handleSettingChange}
                  placeholder="e.g. Solutions"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Central Technology Center (Showroom & Demo Center Physical Address) */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Showroom &amp; Central Technology Center (Client Address Popover)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Showroom Name / Center Title</label>
                <input
                  type="text"
                  name="showroom_name"
                  value={siteSettings.showroom_name}
                  onChange={handleSettingChange}
                  placeholder="e.g. Central Technology Center"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Showroom Feature Badge</label>
                <input
                  type="text"
                  name="showroom_badge"
                  value={siteSettings.showroom_badge}
                  onChange={handleSettingChange}
                  placeholder="e.g. 40,000 sq ft Demo"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Operating Hours</label>
                <input
                  type="text"
                  name="showroom_hours"
                  value={siteSettings.showroom_hours}
                  onChange={handleSettingChange}
                  placeholder="e.g. Sat – Thu: 9:00 AM – 7:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-charcoal-700">Full Physical Address</label>
                <input
                  type="text"
                  name="showroom_address"
                  value={siteSettings.showroom_address}
                  onChange={handleSettingChange}
                  placeholder="e.g. Plot 42, Tejgaon Industrial Area, Dhaka-1208, Bangladesh"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Showroom Direct Phone</label>
                <input
                  type="text"
                  name="showroom_phone"
                  value={siteSettings.showroom_phone}
                  onChange={handleSettingChange}
                  placeholder="e.g. +880 1700-000000 / +880 2-9880000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-charcoal-700">Google Maps Direction URL</label>
                <input
                  type="url"
                  name="showroom_maps_url"
                  value={siteSettings.showroom_maps_url}
                  onChange={handleSettingChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Corporate Head Office */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Corporate Head Office Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Office Title</label>
                <input
                  type="text"
                  name="office_name"
                  value={siteSettings.office_name}
                  onChange={handleSettingChange}
                  placeholder="e.g. Corporate Head Office"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-charcoal-700">Full Office Address</label>
                <input
                  type="text"
                  name="office_address"
                  value={siteSettings.office_address}
                  onChange={handleSettingChange}
                  placeholder="e.g. House #14, Road #18, Sector #07, Uttara Model Town, Dhaka-1230, Bangladesh"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 4: TopBar & Emergency Support Contacts */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                TopBar &amp; Global Support Contacts
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Support Phone / Hotline</span>
                </label>
                <input
                  type="text"
                  name="support_phone"
                  value={siteSettings.support_phone}
                  onChange={handleSettingChange}
                  placeholder="+880 1700-000000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Inquiry Email</span>
                </label>
                <input
                  type="email"
                  name="support_email"
                  value={siteSettings.support_email}
                  onChange={handleSettingChange}
                  placeholder="info@woodtechsolutionbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp Quick Desk</span>
                </label>
                <input
                  type="text"
                  name="whatsapp_number"
                  value={siteSettings.whatsapp_number}
                  onChange={handleSettingChange}
                  placeholder="+880 1700-000000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Partner Certification Badge</span>
                </label>
                <input
                  type="text"
                  name="partner_badge"
                  value={siteSettings.partner_badge}
                  onChange={handleSettingChange}
                  placeholder="Authorized Industrial Technology Partner"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
              className="font-bold text-xs px-6"
            >
              {isSaving ? 'Saving Changes to Backend...' : 'Save Logo, Addresses & Contacts'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: HOMEPAGE TEXT & SEO */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Homepage Hero Text &amp; Subtitle
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Main Hero Headline</label>
                <input
                  type="text"
                  name="hero_headline"
                  value={siteSettings.hero_headline}
                  onChange={handleSettingChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Subtitle &amp; Factory Proposition</label>
                <textarea
                  name="hero_subtitle"
                  rows={3}
                  value={siteSettings.hero_subtitle}
                  onChange={handleSettingChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Globe className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Search Engine Optimization (SEO)
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Meta Title Tag</label>
                <input
                  type="text"
                  name="seo_title"
                  value={siteSettings.seo_title}
                  onChange={handleSettingChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Meta Description</label>
                <textarea
                  name="seo_description"
                  rows={3}
                  value={siteSettings.seo_description}
                  onChange={handleSettingChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
              className="font-bold text-xs px-6"
            >
              {isSaving ? 'Saving Changes...' : 'Save CMS Settings'}
            </Button>
          </div>
        </form>
      )}

      {/* ADD / EDIT SLIDE MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-border space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-navy-900">
                  {editingSlide ? 'Edit Hero Machinery Slide' : 'Add New Hero Slide'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure machine banner picture, title, specifications, and destination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-navy-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              {/* Badge */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Banner Badge</label>
                <input
                  type="text"
                  value={slideFormData.badge}
                  onChange={(e) => setSlideFormData({ ...slideFormData, badge: e.target.value })}
                  placeholder="e.g. FEATURED MACHINE MODEL, HEAVY DUTY CNC"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  required
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Machine Model Title</label>
                <input
                  type="text"
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  placeholder="e.g. CNC ROUTER WTS THUNDER"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  required
                />
              </div>

              {/* Subtitle / Key Specs */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Key Technical Specs (Subtitle)</label>
                <input
                  type="text"
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  placeholder="e.g. 7.5kW Spindle • Syntec 6MB • 6-Zone Vacuum Bed"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  required
                />
              </div>

              {/* Image URL & Instant Preview */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Machinery Photo URL</label>
                <input
                  type="url"
                  value={slideFormData.imageUrl}
                  onChange={(e) => setSlideFormData({ ...slideFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  required
                />

                {/* Instant Image Preview */}
                {slideFormData.imageUrl && (
                  <div className="mt-2 p-2 bg-navy-950 rounded-lg flex items-center gap-3">
                    <img
                      src={slideFormData.imageUrl}
                      alt="Preview"
                      onError={handleImageError}
                      className="w-20 h-14 object-cover rounded border border-navy-700"
                    />
                    <div className="text-[11px] text-slate-300">
                      <span className="font-bold text-white block">Image Live Preview</span>
                      <span className="text-[10px] text-slate-400">Aspect ratio adapts to hero container</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Target Product Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-charcoal-700">Link to Catalog Model</label>
                  <select
                    value={slideFormData.targetSlug}
                    onChange={(e) => setSlideFormData({ ...slideFormData, targetSlug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs bg-white"
                  >
                    <option value="">-- Select from Existing Products --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-charcoal-700">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={slideFormData.displayOrder}
                    onChange={(e) => setSlideFormData({ ...slideFormData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={slideFormData.isActive}
                  onChange={(e) => setSlideFormData({ ...slideFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-industrial-orange rounded border-slate-300 focus:ring-industrial-orange"
                />
                <label htmlFor="isActive" className="font-semibold text-charcoal-700 cursor-pointer">
                  Publish to Homepage (Active immediately)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  {editingSlide ? 'Update Slide' : 'Add Slide'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
