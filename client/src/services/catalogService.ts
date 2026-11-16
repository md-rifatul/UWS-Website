import apiClient from './apiClient';
import { Category, Manufacturer, PaginatedResult, Product, ProductFilterParams, HeroSlide } from '@/types';
import { DEMO_CATEGORIES, DEMO_MANUFACTURERS, DEMO_PRODUCTS, DEFAULT_HERO_SLIDES } from './mockData';

export const FEATURED_STORAGE_KEY = 'wts_featured_map';

export const getStoredFeaturedMap = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(FEATURED_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const applyFeaturedOverrides = (products: Product[]): Product[] => {
  const map = getStoredFeaturedMap();
  if (Object.keys(map).length === 0) return products;
  return products.map((p) => {
    if (map[p.id] !== undefined) {
      return { ...p, isFeatured: map[p.id] };
    }
    return p;
  });
};

export const CUSTOM_PRODUCTS_KEY = 'uws_custom_products';
export const DELETED_PRODUCTS_KEY = 'uws_deleted_product_ids';
export const CUSTOM_CATEGORIES_KEY = 'uws_custom_categories';
export const DELETED_CATEGORIES_KEY = 'uws_deleted_category_ids';

// One-time purge of any old demo products / dummy data cached in user's browser localStorage
const PURGE_KEY = 'uws_demo_cleared_v4';
try {
  if (typeof window !== 'undefined' && !localStorage.getItem(PURGE_KEY)) {
    localStorage.removeItem(CUSTOM_PRODUCTS_KEY);
    localStorage.removeItem(DELETED_PRODUCTS_KEY);
    localStorage.removeItem(FEATURED_STORAGE_KEY);
    localStorage.removeItem('wts_hero_slides');
    localStorage.setItem(PURGE_KEY, 'true');
  }
} catch {}

export const getStoredCustomProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const getStoredDeletedProductIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const getStoredCustomCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const getStoredDeletedCategoryIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const getEffectiveCategories = (): Category[] => {
  const custom = getStoredCustomCategories();
  const deletedIds = new Set(getStoredDeletedCategoryIds());
  const combined = [...custom, ...DEMO_CATEGORIES.filter((c) => !custom.some((x) => x.id === c.id))];
  return combined.filter((c) => !deletedIds.has(c.id));
};

export const getEffectiveProducts = (): Product[] => {
  const custom = getStoredCustomProducts();
  const deletedIds = new Set(getStoredDeletedProductIds());
  const combined = [...custom, ...DEMO_PRODUCTS.filter((p) => !custom.some((x) => x.id === p.id))];
  return combined.filter((p) => !deletedIds.has(p.id));
};

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/catalog/categories');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return getEffectiveCategories();
    } catch {
      return getEffectiveCategories();
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`/catalog/categories/slug/${slug}`);
      return response.data;
    } catch {
      const cats = getEffectiveCategories();
      const found = cats.find((c) => c.slug === slug);
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
    let result: PaginatedResult<Product>;
    try {
      const response = await apiClient.get<PaginatedResult<Product>>('/catalog/products', {
        params,
      });
      if (response.data && response.data.items && response.data.items.length > 0) {
        result = response.data;
      } else {
        result = filterLocalProducts(params);
      }
    } catch {
      result = filterLocalProducts(params);
    }
    // Apply local storage featured overrides so admin toggles persist immediately everywhere
    return {
      ...result,
      items: applyFeaturedOverrides(result.items),
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/catalog/products/slug/${slug}`);
      const prod = response.data;
      if (prod) {
        const map = getStoredFeaturedMap();
        if (map[prod.id] !== undefined) prod.isFeatured = map[prod.id];
      }
      return prod;
    } catch {
      const found = DEMO_PRODUCTS.find((p) => p.slug === slug);
      if (found) {
        const map = getStoredFeaturedMap();
        return map[found.id] !== undefined ? { ...found, isFeatured: map[found.id] } : found;
      }
      return null;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/catalog/products/${id}`);
      const prod = response.data;
      if (prod) {
        const map = getStoredFeaturedMap();
        if (map[prod.id] !== undefined) prod.isFeatured = map[prod.id];
      }
      return prod;
    } catch {
      const found = DEMO_PRODUCTS.find((p) => p.id === id);
      if (found) {
        const map = getStoredFeaturedMap();
        return map[found.id] !== undefined ? { ...found, isFeatured: map[found.id] } : found;
      }
      return null;
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
  website_url: string;

  // Head Office
  head_office_name: string;
  head_office_address: string;
  head_office_phone: string;
  head_office_email: string;
  head_office_website: string;

  // Corporate Office & Display Center
  corporate_office_name: string;
  corporate_office_address: string;
  corporate_office_phone: string;
  corporate_office_email: string;

  // Warehouse
  warehouse_name: string;
  warehouse_address: string;
  warehouse_phone: string;
  warehouse_email: string;

  // Showroom & General Backwards-compatibility
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
  logo_short: 'UWS',
  logo_title: 'UNIQUE WOOD SOLUTION',
  logo_badge: 'Woodworking Machinery & Craftsmanship',
  website_url: 'www.uwsbd.com',

  // Head Office
  head_office_name: 'Head Office',
  head_office_address: '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000',
  head_office_phone: '01612-429999',
  head_office_email: 'info@uwsbd.com',
  head_office_website: 'www.uwsbd.com',

  // Corporate Office & Display Center
  corporate_office_name: 'Corporate Office',
  corporate_office_address: 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310',
  corporate_office_phone: '01912-580072',
  corporate_office_email: 'info@uwsbd.com',

  // Warehouse
  warehouse_name: 'Warehouse & Logistics',
  warehouse_address: 'Unique Wood Solution Warehouse, Godarbag, Keraniganj, Dhaka 1310',
  warehouse_phone: '01805-465555',
  warehouse_email: 'info@uwsbd.com',

  // Showroom & General Backwards-compatibility
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
  partner_badge: 'Authorized Machinery & Turnkey Engineering Partner',
  hero_headline: 'High-Precision CNC & Industrial Woodworking Machinery',
  hero_subtitle: 'Turnkey industrial solutions with complete factory planning, automated production line layout, machinery commissioning, and genuine spare parts support.',
};

function filterLocalProducts(params: ProductFilterParams): PaginatedResult<Product> {
  let list = getEffectiveProducts();

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
    const targetCat = getEffectiveCategories().find((c) => c.slug === params.categorySlug);
    list = list.filter((p) => {
      if (p.categorySlug === params.categorySlug) return true;
      if (targetCat && p.categoryId === targetCat.id) return true;
      if (targetCat && p.categoryName && p.categoryName.toLowerCase() === targetCat.name.toLowerCase()) return true;
      if ((params.categorySlug === 'accessories' || params.categorySlug === 'cutter-accessories') && (p.categorySlug === 'accessories' || p.categorySlug === 'cutter-accessories')) return true;
      if (params.categorySlug === 'edge-banding' && (p.categorySlug === 'edge-banding-machines' || p.categorySlug === 'edge-banding')) return true;
      if (params.categorySlug === 'boring-drilling' && (p.categorySlug === 'cnc-boring-drilling' || p.categorySlug === 'boring-drilling')) return true;
      if (params.categorySlug === 'cnc-router-machine' && (p.categorySlug === 'cnc-machining-centers' || p.categorySlug === 'cnc-router-machine')) return true;
      return false;
    });
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

