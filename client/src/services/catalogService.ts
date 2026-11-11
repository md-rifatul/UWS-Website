import apiClient from './apiClient';
import { Category, Manufacturer, PaginatedResult, Product, ProductFilterParams, HeroSlide } from '@/types';
import { DEMO_CATEGORIES, DEMO_MANUFACTURERS, DEMO_PRODUCTS, DEFAULT_HERO_SLIDES } from './mockData';

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/catalog/categories');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return DEMO_CATEGORIES;
    } catch (e) {
      console.warn('API unavailable, serving catalog categories from local dataset', e);
      return DEMO_CATEGORIES;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`/catalog/categories/slug/${slug}`);
      return response.data;
    } catch {
      const found = DEMO_CATEGORIES.find((c) => c.slug === slug);
      return found || null;
    }
  },

  async getManufacturers(): Promise<Manufacturer[]> {
    try {
      const response = await apiClient.get<Manufacturer[]>('/catalog/manufacturers');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return DEMO_MANUFACTURERS;
    } catch {
      return DEMO_MANUFACTURERS;
    }
  },

  async getProducts(params: ProductFilterParams = {}): Promise<PaginatedResult<Product>> {
    try {
      const response = await apiClient.get<PaginatedResult<Product>>('/catalog/products', {
        params,
      });
      if (response.data && response.data.items && response.data.items.length > 0) {
        return response.data;
      }
      return filterLocalProducts(params);
    } catch {
      return filterLocalProducts(params);
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/catalog/products/slug/${slug}`);
      return response.data;
    } catch {
      const found = DEMO_PRODUCTS.find((p) => p.slug === slug);
      return found || null;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/catalog/products/${id}`);
      return response.data;
    } catch {
      const found = DEMO_PRODUCTS.find((p) => p.id === id);
      return found || null;
    }
  },

  getHeroSlides(): HeroSlide[] {
    const stored = localStorage.getItem('wts_hero_slides');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((s: HeroSlide) => s.isActive)
            .sort((a: HeroSlide, b: HeroSlide) => a.displayOrder - b.displayOrder);
        }
      } catch (e) {
        console.error('Error parsing wts_hero_slides', e);
      }
    }
    return DEFAULT_HERO_SLIDES;
  },

  getAllHeroSlides(): HeroSlide[] {
    const stored = localStorage.getItem('wts_hero_slides');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: HeroSlide, b: HeroSlide) => a.displayOrder - b.displayOrder);
        }
      } catch (e) {
        console.error('Error parsing wts_hero_slides', e);
      }
    }
    return DEFAULT_HERO_SLIDES;
  },

  saveHeroSlides(slides: HeroSlide[]): void {
    localStorage.setItem('wts_hero_slides', JSON.stringify(slides));
  },

  async getSiteSettings(): Promise<SiteSettingsMap> {
    try {
      const response = await apiClient.get<Array<{ key: string; value: string }>>('/catalog/settings');
      if (response.data && response.data.length > 0) {
        const map: SiteSettingsMap = { ...DEFAULT_SITE_SETTINGS };
        response.data.forEach((item) => {
          if (item.key) {
            map[item.key] = item.value;
          }
        });
        localStorage.setItem('wts_site_settings', JSON.stringify(map));
        return map;
      }
    } catch {
      // Fallback to localStorage or defaults
    }

    const stored = localStorage.getItem('wts_site_settings');
    if (stored) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) };
      } catch {
        // ignore
      }
    }
    return DEFAULT_SITE_SETTINGS;
  },
};

export interface SiteSettingsMap {
  logo_url: string;
  logo_short: string;
  logo_title: string;
  logo_badge: string;
  showroom_name: string;
  showroom_badge: string;
  showroom_address: string;
  showroom_hours: string;
  showroom_phone: string;
  showroom_maps_url: string;
  office_name: string;
  office_address: string;
  support_phone: string;
  support_email: string;
  whatsapp_number: string;
  partner_badge: string;
  hero_headline: string;
  hero_subtitle: string;
  [key: string]: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsMap = {
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
};

function filterLocalProducts(params: ProductFilterParams): PaginatedResult<Product> {
  let list = [...DEMO_PRODUCTS];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.modelNumber.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (params.categorySlug) {
    list = list.filter((p) => p.categorySlug === params.categorySlug);
  }

  if (params.manufacturerSlug) {
    const m = DEMO_MANUFACTURERS.find((man) => man.slug === params.manufacturerSlug);
    if (m) {
      list = list.filter((p) => p.manufacturerId === m.id);
    }
  }

  if (params.condition) {
    list = list.filter((p) => p.condition === params.condition);
  }

  if (params.availability) {
    list = list.filter((p) => p.availabilityStatus === params.availability);
  }

  if (params.isFeatured !== undefined) {
    list = list.filter((p) => p.isFeatured === params.isFeatured);
  }

  // Dynamic spec filtering
  if (params.specs && Object.keys(params.specs).length > 0) {
    Object.entries(params.specs).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        list = list.filter((p) => {
          const specVal = p.specifications?.[key];
          if (specVal === undefined) return false;
          return String(specVal).toLowerCase().includes(String(val).toLowerCase());
        });
      }
    });
  }

  // Sorting
  switch (params.sortBy) {
    case 'name_asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'views':
      list.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'newest':
    default:
      list.sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
      break;
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 9;
  const totalCount = list.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const items = list.slice(startIndex, startIndex + pageSize);

  return {
    items,
    pageNumber: page,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

