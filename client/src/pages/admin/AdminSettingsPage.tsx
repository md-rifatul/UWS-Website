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

  // Company, Brand, and Location Settings
  const [siteSettings, setSiteSettings] = useState({
    logo_url: '',
    logo_short: 'UWS',
    logo_title: 'UNIQUE WOOD SOLUTION',
    logo_badge: 'Woodworking Machinery & Craftsmanship',
    website_url: 'www.uwsbd.com',

    // 1. Head Office
    head_office_name: 'Head Office',
    head_office_address: '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000',
    head_office_phone: '01612-429999',
    head_office_email: 'info@uwsbd.com',
    head_office_website: 'www.uwsbd.com',

    // 2. Corporate Office & Display Center
    corporate_office_name: 'Corporate Office',
    corporate_office_address: 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310',
    corporate_office_phone: '01912-580072',
    corporate_office_email: 'info@uwsbd.com',

    // 3. Warehouse & Logistics
    warehouse_name: 'Warehouse & Logistics',
    warehouse_address: 'Unique Wood Solution Warehouse, Godarbag, Keraniganj, Dhaka 1310',
    warehouse_phone: '01805-465555',
    warehouse_email: 'info@uwsbd.com',

    // Showroom & General Backwards Compatibility
    showroom_name: 'Unique Wood Solution Display Center',
    showroom_badge: 'Live Machinery Demonstrations',
    showroom_address: 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310',
    showroom_hours: 'Saturday – Thursday: 9:00 AM – 7:00 PM',
    showroom_phone: '01912-580072',
    showroom_maps_url: 'https://maps.google.com/?q=Unique+Wood+Solution+South+Ramerkanda+Keraniganj+Dhaka',
    office_name: 'Head Office',
    office_address: '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000',
    support_phone: '01612-429999',
    support_email: 'info@uwsbd.com',
    whatsapp_number: '01912-580072',
    partner_badge: 'Authorized Industrial Machinery & Craftsmanship Partner',
    hero_headline: 'High-Precision CNC & Industrial Woodworking Machinery',
    hero_subtitle: 'Turnkey industrial solutions with complete factory planning, automated production line layout, machinery commissioning, and genuine spare parts support.',
    seo_title: 'Unique Wood Solution | Industrial Woodworking Machinery & Bespoke Solutions Bangladesh',
    seo_description: 'Official importer and distributor of high-precision CNC routers, computerized beam saws, automatic edgebanders, and woodworking equipment in Bangladesh.',
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
      badge: '',
      title: '',
      subtitle: '',
      imageUrl: '',
      targetSlug: '',
      displayOrder: heroSlides.length + 1,
      isActive: true,
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideFormData({
      badge: slide.badge || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl || '',
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
    window.dispatchEvent(new CustomEvent('wts-hero-slides-updated', { detail: updated }));
    setIsSlideModalOpen(false);
    showNotification('Hero banner saved and live!');
  };

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this hero banner?')) return;
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    adminService.saveHeroSlides(updated);
    window.dispatchEvent(new CustomEvent('wts-hero-slides-updated', { detail: updated }));
    showNotification('Hero banner deleted.');
  };

  const handleToggleSlideActive = (id: string) => {
    const updated = heroSlides.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setHeroSlides(updated);
    adminService.saveHeroSlides(updated);
    window.dispatchEvent(new CustomEvent('wts-hero-slides-updated', { detail: updated }));
    showNotification('Hero banner status updated.');
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
    window.dispatchEvent(new CustomEvent('wts-hero-slides-updated', { detail: copy }));
    showNotification('Banner order updated.');
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
    setSiteSettings((prev) => {
      const updated = { ...prev, [name]: value };
      // Keep backwards compatibility keys in sync
      if (name === 'head_office_address') updated.office_address = value;
      if (name === 'head_office_name') updated.office_name = value;
      if (name === 'head_office_phone') updated.support_phone = value;
      if (name === 'head_office_email') updated.support_email = value;
      if (name === 'head_office_website') updated.website_url = value;
      if (name === 'website_url') updated.head_office_website = value;
      if (name === 'corporate_office_address') updated.showroom_address = value;
      if (name === 'corporate_office_name') updated.showroom_name = value;
      if (name === 'corporate_office_phone') {
        updated.showroom_phone = value;
        updated.whatsapp_number = value;
      }
      return updated;
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: SiteSetting[] = Object.entries(siteSettings).map(([k, v]) => ({
        key: k,
        value: v,
        group: k.startsWith('logo') ? 'Brand' : (k.startsWith('showroom') || k.startsWith('office') || k.startsWith('head_office') || k.startsWith('corporate_office') || k.startsWith('warehouse')) ? 'Location' : k.startsWith('seo') ? 'SEO' : k.startsWith('hero') ? 'Homepage' : 'Contact',
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
          <span>Hero Banners ({heroSlides.length})</span>
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
          <span>SEO & Metadata</span>
        </button>
      </div>

      {/* TAB 1: HERO BANNER MANAGER */}
      {activeTab === 'hero' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-navy-950 text-white rounded-xl shadow-xs">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Homepage Hero Banners</span>
                <span className="text-[10px] bg-industrial-orange text-navy-950 px-2 py-0.5 rounded-full font-mono uppercase font-extrabold">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload and manage full-width promotional hero banners for the homepage slider. Banners display clean in full resolution without text overlays.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddSlide}
                icon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Add Hero Banner
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
                    <th className="py-3.5 px-4 w-40">Banner Preview</th>
                    <th className="py-3.5 px-4">Banner Name / Reference</th>
                    <th className="py-3.5 px-4">Click Destination Link</th>
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
                        <div className="w-36 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-0.5">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title || 'Banner'}
                            onError={handleImageError}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </td>

                      {/* Reference Title */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-navy-900 text-sm block">
                          {slide.title || 'Promotional Banner'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {slide.id}
                        </span>
                      </td>

                      {/* Destination Link */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {slide.targetSlug ? (
                          <span className="text-xs font-mono text-industrial-orange bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/50">
                            {slide.targetSlug.startsWith('/') ? slide.targetSlug : `/products/${slide.targetSlug}`}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None (Display only)</span>
                        )}
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
                            title="Edit Banner"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Banner"
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
                        No hero banners defined. Click "Add Hero Banner" to add one.
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

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Website Domain URL</span>
                </label>
                <input
                  type="text"
                  name="website_url"
                  value={siteSettings.website_url}
                  onChange={handleSettingChange}
                  placeholder="www.uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Head Office */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-industrial-orange" />
                <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                  1. Head Office (Nawabpur Road)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-industrial-orange bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded">
                Central Headquarters
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Facility / Branch Title</label>
                <input
                  type="text"
                  name="head_office_name"
                  value={siteSettings.head_office_name}
                  onChange={handleSettingChange}
                  placeholder="Head Office"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Direct Phone / Hotline</span>
                </label>
                <input
                  type="text"
                  name="head_office_phone"
                  value={siteSettings.head_office_phone}
                  onChange={handleSettingChange}
                  placeholder="01612-429999"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Email</span>
                </label>
                <input
                  type="email"
                  name="head_office_email"
                  value={siteSettings.head_office_email}
                  onChange={handleSettingChange}
                  placeholder="info@uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Physical Address</span>
                </label>
                <input
                  type="text"
                  name="head_office_address"
                  value={siteSettings.head_office_address}
                  onChange={handleSettingChange}
                  placeholder="#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Website URL</span>
                </label>
                <input
                  type="text"
                  name="head_office_website"
                  value={siteSettings.head_office_website}
                  onChange={handleSettingChange}
                  placeholder="www.uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Corporate Office & Display Center */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-industrial-orange" />
                <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                  2. Corporate Office &amp; Display Center (Keraniganj Model)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                Live Machine Demo Facility
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Facility Title</label>
                <input
                  type="text"
                  name="corporate_office_name"
                  value={siteSettings.corporate_office_name}
                  onChange={handleSettingChange}
                  placeholder="Unique Wood Solution Display Center"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Phone / VIP Inquiries</span>
                </label>
                <input
                  type="text"
                  name="corporate_office_phone"
                  value={siteSettings.corporate_office_phone}
                  onChange={handleSettingChange}
                  placeholder="01912-580072"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Facility Email</span>
                </label>
                <input
                  type="email"
                  name="corporate_office_email"
                  value={siteSettings.corporate_office_email}
                  onChange={handleSettingChange}
                  placeholder="info@uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Physical Address</span>
                </label>
                <input
                  type="text"
                  name="corporate_office_address"
                  value={siteSettings.corporate_office_address}
                  onChange={handleSettingChange}
                  placeholder="Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Display Center Visiting Hours</label>
                <input
                  type="text"
                  name="showroom_hours"
                  value={siteSettings.showroom_hours}
                  onChange={handleSettingChange}
                  placeholder="e.g. Sat – Thu: 9:00 AM – 7:00 PM"
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

          {/* Card 4: Warehouse & Logistics */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-industrial-orange" />
                <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                  3. Warehouse &amp; Logistics Hub (Godarbag)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                Inventory &amp; Dispatch Depot
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Facility Title</label>
                <input
                  type="text"
                  name="warehouse_name"
                  value={siteSettings.warehouse_name}
                  onChange={handleSettingChange}
                  placeholder="Unique Wood Solution Warehouse"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Logistics &amp; Dispatch Phone</span>
                </label>
                <input
                  type="text"
                  name="warehouse_phone"
                  value={siteSettings.warehouse_phone}
                  onChange={handleSettingChange}
                  placeholder="01805-465555"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Warehouse Email</span>
                </label>
                <input
                  type="email"
                  name="warehouse_email"
                  value={siteSettings.warehouse_email}
                  onChange={handleSettingChange}
                  placeholder="info@uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Physical Address</span>
                </label>
                <input
                  type="text"
                  name="warehouse_address"
                  value={siteSettings.warehouse_address}
                  onChange={handleSettingChange}
                  placeholder="Unique Wood Solution Warehouse, Godarbag, Keraniganj, Dhaka 1310"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>
            </div>
          </div>

          {/* Card 5: TopBar, Hotline & Emergency Support Contacts */}
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                4. Global Hotline, WhatsApp &amp; Support Channels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Support Phone / Central Hotline</span>
                </label>
                <input
                  type="text"
                  name="support_phone"
                  value={siteSettings.support_phone}
                  onChange={handleSettingChange}
                  placeholder="01612-429999"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-semibold"
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
                  placeholder="info@uwsbd.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-semibold"
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
                  placeholder="01912-580072"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-semibold"
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
                  placeholder="Authorized Industrial Machinery & Craftsmanship Partner"
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
          <div className="bg-white rounded-xl border border-slate-border p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-industrial-orange" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
                Homepage Hero Banner Presentation
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Text overlays on the homepage hero banner are disabled. The homepage features clean, panoramic image banners without overlapping titles or badges. You can upload, edit, or reorder banners from the <strong>Hero Banners</strong> tab above.
            </p>
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
                  {editingSlide ? 'Edit Hero Banner' : 'Add New Hero Banner'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set the banner picture and click destination. Banners display clean without text overlays.
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
              {/* Title / Reference */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center justify-between">
                  <span>Banner Reference Name (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Internal name for admin list</span>
                </label>
                <input
                  type="text"
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  placeholder="e.g. Promotional Banner 1, Autumn Machinery Sale"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                />
              </div>

              {/* Image URL & Instant Preview */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Banner Image URL *</label>
                <input
                  type="url"
                  value={slideFormData.imageUrl}
                  onChange={(e) => setSlideFormData({ ...slideFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or direct banner image link"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs"
                  required
                />

                {/* Instant Image Preview */}
                {slideFormData.imageUrl && (
                  <div className="mt-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Live Banner Image Preview
                    </span>
                    <img
                      src={slideFormData.imageUrl}
                      alt="Preview"
                      onError={handleImageError}
                      className="w-full max-h-48 object-cover rounded-lg border border-slate-200 shadow-2xs"
                    />
                  </div>
                )}
              </div>

              {/* Target Destination Link */}
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700 flex items-center justify-between">
                  <span>Click Destination Link (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opens this page when banner is clicked</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={slideFormData.targetSlug}
                    onChange={(e) => setSlideFormData({ ...slideFormData, targetSlug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs bg-white"
                  >
                    <option value="">-- No Link / Custom URL --</option>
                    <option value="/products">All Machinery Catalog (/products)</option>
                    <option value="/request-quote">RFQ Quote Page (/request-quote)</option>
                    <option value="/contact">Contact Page (/contact)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        Product: {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={slideFormData.targetSlug}
                    onChange={(e) => setSlideFormData({ ...slideFormData, targetSlug: e.target.value })}
                    placeholder="Or type custom URL e.g. /products"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-border text-navy-900 focus:outline-hidden focus:border-industrial-orange text-xs font-mono"
                  />
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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

                <div className="flex items-center gap-2 pt-6">
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
