import apiClient from './apiClient';
import { cloudinaryService } from './cloudinaryService';
import { Category, CategoryAttribute, Product, RFQ, RFQStatus, User, SiteSetting, BulkImportResult, HeroSlide } from '@/types';
import { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_RFQS, DEFAULT_HERO_SLIDES } from './mockData';

export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  totalRfqs: number;
  pendingRfqs: number;
  completedRfqs: number;
  totalEstimatedPipelineValue: number;
  recentRfqs: RFQ[];
  topViewedProducts: Product[];
}

export const adminService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>('/admin/dashboard/summary');
      return response.data;
    } catch {
      const totalEstimatedPipelineValue = DEMO_RFQS.reduce(
        (sum, r) => sum + (r.estimatedBudget || 0),
        0
      );
      const pendingCount = DEMO_RFQS.filter((r) => r.status === 'Pending' || r.status === 'UnderReview').length;
      const completedCount = DEMO_RFQS.filter((r) => r.status === 'Completed' || r.status === 'Approved').length;

      return {
        totalProducts: DEMO_PRODUCTS.length,
        totalCategories: DEMO_CATEGORIES.length,
        totalRfqs: DEMO_RFQS.length,
        pendingRfqs: pendingCount,
        completedRfqs: completedCount,
        totalEstimatedPipelineValue,
        recentRfqs: DEMO_RFQS.slice(0, 5),
        topViewedProducts: [...DEMO_PRODUCTS].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
      };
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/admin/products', product);
      if (response.data && product.isFeatured !== undefined) {
        try {
          const stored = localStorage.getItem('wts_featured_map');
          const map = stored ? JSON.parse(stored) : {};
          map[response.data.id] = product.isFeatured;
          localStorage.setItem('wts_featured_map', JSON.stringify(map));
        } catch {}
      }
      return response.data;
    } catch {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        categoryId: product.categoryId || DEMO_CATEGORIES[0].id,
        categoryName: DEMO_CATEGORIES.find((c) => c.id === product.categoryId)?.name || 'General',
        subCategory: product.subCategory || (product.specifications?.subCategory as string) || undefined,
        manufacturerId: product.manufacturerId || '',
        name: product.name || 'New Machine',
        slug: (product.name || 'new-machine').toLowerCase().replace(/\s+/g, '-'),
        modelNumber: product.modelNumber || 'MOD-001',
        sku: product.sku || 'SKU-001',
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        mainImageUrl: product.mainImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        condition: product.condition || 'BrandNew',
        availabilityStatus: product.availabilityStatus || 'InStock',
        referencePrice: product.referencePrice || null,
        showPrice: !!product.showPrice,
        isFeatured: !!product.isFeatured,
        viewCount: 0,
        isActive: true,
        specifications: product.specifications || {},
        images: product.images || [],
        documents: product.documents || [],
        createdAtUtc: new Date().toISOString(),
      };
      if (product.isFeatured !== undefined) {
        try {
          const stored = localStorage.getItem('wts_featured_map');
          const map = stored ? JSON.parse(stored) : {};
          map[newProduct.id] = newProduct.isFeatured;
          localStorage.setItem('wts_featured_map', JSON.stringify(map));
        } catch {}
      }
      try {
        const stored = localStorage.getItem('uws_custom_products');
        const arr: Product[] = stored ? JSON.parse(stored) : [];
        arr.unshift(newProduct);
        localStorage.setItem('uws_custom_products', JSON.stringify(arr));
      } catch {}
      DEMO_PRODUCTS.unshift(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    if (product.isFeatured !== undefined) {
      try {
        const stored = localStorage.getItem('wts_featured_map');
        const map = stored ? JSON.parse(stored) : {};
        map[id] = product.isFeatured;
        localStorage.setItem('wts_featured_map', JSON.stringify(map));
      } catch (e) {
        console.error('Failed to update localStorage featured map:', e);
      }
    }

    try {
      const response = await apiClient.put<Product>(`/admin/products/${id}`, product);
      return response.data;
    } catch {
      try {
        const stored = localStorage.getItem('uws_custom_products');
        const arr: Product[] = stored ? JSON.parse(stored) : [];
        const idx = arr.findIndex((p) => p.id === id);
        if (idx !== -1) {
          arr[idx] = { ...arr[idx], ...product };
        } else {
          const existing = DEMO_PRODUCTS.find((p) => p.id === id);
          if (existing) arr.push({ ...existing, ...product });
        }
        localStorage.setItem('uws_custom_products', JSON.stringify(arr));
      } catch {}

      const index = DEMO_PRODUCTS.findIndex((p) => p.id === id);
      if (index !== -1) {
        DEMO_PRODUCTS[index] = { ...DEMO_PRODUCTS[index], ...product, updatedAtUtc: new Date().toISOString() };
        return DEMO_PRODUCTS[index];
      }
      throw new Error('Product not found');
    }
  },

  async toggleProductFeatured(id: string, isFeatured: boolean): Promise<Product> {
    // 1. Immediately store in localStorage featured map
    try {
      const stored = localStorage.getItem('wts_featured_map');
      const map = stored ? JSON.parse(stored) : {};
      map[id] = isFeatured;
      localStorage.setItem('wts_featured_map', JSON.stringify(map));
    } catch (e) {
      console.error('Failed to update localStorage featured map:', e);
    }

    // 2. Also update in-memory DEMO_PRODUCTS so instant local states reflect it
    const index = DEMO_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      DEMO_PRODUCTS[index] = { ...DEMO_PRODUCTS[index], isFeatured, updatedAtUtc: new Date().toISOString() };
    }

    // 3. Send API request to backend (supports both PATCH & PUT)
    try {
      const response = await apiClient.patch<Product>(`/admin/products/${id}/featured`, { isFeatured });
      if (response.data) return response.data;
    } catch {
      try {
        const response = await apiClient.put<Product>(`/admin/products/${id}/featured`, { isFeatured });
        if (response.data) return response.data;
      } catch {}
    }

    if (index !== -1) {
      return DEMO_PRODUCTS[index];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string, imageUrl?: string): Promise<boolean> {
    const existing = DEMO_PRODUCTS.find((p) => p.id === id);
    const targetImg = imageUrl || existing?.mainImageUrl;
    if (targetImg) {
      cloudinaryService.deleteImage(targetImg).catch(() => {});
    }

    try {
      const stored = localStorage.getItem('uws_custom_products');
      if (stored) {
        const arr: Product[] = JSON.parse(stored).filter((p: Product) => p.id !== id);
        localStorage.setItem('uws_custom_products', JSON.stringify(arr));
      }
      const delStored = localStorage.getItem('uws_deleted_product_ids');
      const delArr: string[] = delStored ? JSON.parse(delStored) : [];
      if (!delArr.includes(id)) {
        delArr.push(id);
        localStorage.setItem('uws_deleted_product_ids', JSON.stringify(delArr));
      }
    } catch {}

    try {
      await apiClient.delete(`/admin/products/${id}`);
      return true;
    } catch {
      const index = DEMO_PRODUCTS.findIndex((p) => p.id === id);
      if (index !== -1) {
        DEMO_PRODUCTS.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    return await cloudinaryService.deleteImage(publicIdOrUrl);
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    try {
      const response = await apiClient.post<Category>('/admin/categories', category);
      return response.data;
    } catch {
      const newCat: Category = {
        id: `c-${Date.now()}`,
        name: category.name || 'New Category',
        slug: (category.name || 'new-category').toLowerCase().replace(/\s+/g, '-'),
        description: category.description || '',
        imageUrl: category.imageUrl || null,
        iconName: category.iconName || 'Folder',
        displayOrder: category.displayOrder || DEMO_CATEGORIES.length + 1,
        isActive: true,
        attributes: [],
      };
      try {
        const stored = localStorage.getItem('uws_custom_categories');
        const arr: Category[] = stored ? JSON.parse(stored) : [];
        arr.push(newCat);
        localStorage.setItem('uws_custom_categories', JSON.stringify(arr));
      } catch {}
      DEMO_CATEGORIES.push(newCat);
      return newCat;
    }
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      const response = await apiClient.put<Category>(`/admin/categories/${id}`, category);
      return response.data;
    } catch {
      try {
        const stored = localStorage.getItem('uws_custom_categories');
        const arr: Category[] = stored ? JSON.parse(stored) : [];
        const idx = arr.findIndex((c) => c.id === id);
        if (idx !== -1) {
          arr[idx] = { ...arr[idx], ...category };
        } else {
          const existing = DEMO_CATEGORIES.find((c) => c.id === id);
          if (existing) arr.push({ ...existing, ...category });
        }
        localStorage.setItem('uws_custom_categories', JSON.stringify(arr));
      } catch {}

      const index = DEMO_CATEGORIES.findIndex((c) => c.id === id);
      if (index !== -1) {
        DEMO_CATEGORIES[index] = { ...DEMO_CATEGORIES[index], ...category };
        return DEMO_CATEGORIES[index];
      }
      throw new Error('Category not found');
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const stored = localStorage.getItem('uws_custom_categories');
      if (stored) {
        const arr: Category[] = JSON.parse(stored).filter((c: Category) => c.id !== id);
        localStorage.setItem('uws_custom_categories', JSON.stringify(arr));
      }
      const delStored = localStorage.getItem('uws_deleted_category_ids');
      const delArr: string[] = delStored ? JSON.parse(delStored) : [];
      if (!delArr.includes(id)) {
        delArr.push(id);
        localStorage.setItem('uws_deleted_category_ids', JSON.stringify(delArr));
      }
    } catch {}

    try {
      await apiClient.delete(`/admin/categories/${id}`);
      return true;
    } catch {
      const index = DEMO_CATEGORIES.findIndex((c) => c.id === id);
      if (index !== -1) {
        DEMO_CATEGORIES.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  async saveCategoryAttributes(categoryId: string, attributes: CategoryAttribute[]): Promise<CategoryAttribute[]> {
    try {
      const response = await apiClient.post<CategoryAttribute[]>(`/admin/categories/${categoryId}/attributes`, { attributes });
      return response.data;
    } catch {
      const cat = DEMO_CATEGORIES.find((c) => c.id === categoryId);
      if (cat) {
        cat.attributes = attributes;
      }
      return attributes;
    }
  },

  async uploadImage(file: File, folder = 'uws-machinery'): Promise<{ url: string; publicId: string }> {
    return await cloudinaryService.uploadImage(file, folder);
  },

  async getAdminRfqs(): Promise<RFQ[]> {
    try {
      const response = await apiClient.get<RFQ[]>('/admin/quotes');
      return response.data;
    } catch {
      return DEMO_RFQS;
    }
  },

  async updateRfqStatus(id: string, status: RFQStatus, internalNote?: string): Promise<RFQ> {
    try {
      const response = await apiClient.put<RFQ>(`/admin/quotes/${id}/status`, { status, internalNote });
      return response.data;
    } catch {
      const rfq = DEMO_RFQS.find((r) => r.id === id);
      if (rfq) {
        rfq.status = status;
        if (internalNote) {
          rfq.adminNotes = (rfq.adminNotes ? rfq.adminNotes + '\n' : '') + `[${new Date().toLocaleDateString()}] ${internalNote}`;
        }
        return rfq;
      }
      throw new Error('RFQ not found');
    }
  },

  async assignRfq(id: string, assignedToUserName: string): Promise<RFQ> {
    try {
      const response = await apiClient.post<RFQ>(`/admin/quotes/${id}/assign`, { assignedToUserName });
      return response.data;
    } catch {
      const rfq = DEMO_RFQS.find((r) => r.id === id);
      if (rfq) {
        rfq.assignedToUserName = assignedToUserName;
        rfq.status = 'Assigned';
        return rfq;
      }
      throw new Error('RFQ not found');
    }
  },

  // User Management
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/admin/users');
      return response.data;
    } catch {
      return [
        {
          id: 'u-001',
          email: 'admin@woodtech.com',
          fullName: 'Engr. Kazi Farhan',
          companyName: 'WoodTech Solutions Ltd.',
          phone: '+880 1700-000001',
          role: 'Admin',
          isActive: true,
          createdAtUtc: '2026-01-01T00:00:00Z',
        },
        {
          id: 'u-002',
          email: 'sales@woodtech.com',
          fullName: 'Rahim Chowdhury',
          companyName: 'WoodTech Solutions Ltd.',
          phone: '+880 1700-000002',
          role: 'SalesManager',
          isActive: true,
          createdAtUtc: '2026-01-15T00:00:00Z',
        },
        {
          id: 'u-003',
          email: 'buyer@apexwoodcraft.com',
          fullName: 'Engr. Tariqul Islam',
          companyName: 'Apex Woodcraft Industries Ltd.',
          phone: '+880 1711-234567',
          role: 'CorporateBuyer',
          isActive: true,
          createdAtUtc: '2026-02-01T00:00:00Z',
        },
      ];
    }
  },

  async createUser(user: Partial<User> & { password?: string }): Promise<User> {
    try {
      const response = await apiClient.post<User>('/admin/users', user);
      return response.data;
    } catch {
      return {
        id: `u-${Date.now()}`,
        email: user.email || 'user@example.com',
        fullName: user.fullName || 'New User',
        companyName: user.companyName || null,
        phone: user.phone || null,
        role: user.role || 'CorporateBuyer',
        isActive: true,
        createdAtUtc: new Date().toISOString(),
      };
    }
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/admin/users/${id}/role`, role);
      return response.data;
    } catch {
      return {
        id,
        email: 'user@example.com',
        fullName: 'Updated User',
        role: role as any,
        isActive: true,
        createdAtUtc: new Date().toISOString(),
      };
    }
  },

  async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/admin/users/${id}/status`);
      return response.data;
    } catch {
      return {
        id,
        email: 'user@example.com',
        fullName: 'User',
        role: 'CorporateBuyer',
        isActive: true,
        createdAtUtc: new Date().toISOString(),
      };
    }
  },

  // Site Settings & CMS
  async getSiteSettings(): Promise<SiteSetting[]> {
    try {
      const response = await apiClient.get<SiteSetting[]>('/admin/settings');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // Fallback
    }

    const stored = localStorage.getItem('wts_site_settings');
    if (stored) {
      try {
        const map = JSON.parse(stored);
        return Object.entries(map).map(([k, v]) => ({
          key: k,
          value: v as string,
          group: k.startsWith('logo') ? 'Brand' : k.startsWith('showroom') || k.startsWith('office') ? 'Location' : 'Contact',
        }));
      } catch {
        // ignore
      }
    }

    return [
      { key: 'logo_short', value: 'UWS', group: 'Brand', description: 'Brand Short Code' },
      { key: 'logo_title', value: 'UNIQUE WOOD SOLUTION', group: 'Brand', description: 'Primary Brand Title' },
      { key: 'logo_badge', value: 'Woodworking Machinery & Craftsmanship', group: 'Brand', description: 'Brand Subtitle Badge' },
      { key: 'logo_url', value: '', group: 'Brand', description: 'Custom Image Logo URL (optional)' },
      { key: 'website_url', value: 'www.uwsbd.com', group: 'Brand', description: 'Company Website' },
      
      // Head Office
      { key: 'head_office_name', value: 'Head Office', group: 'Head Office', description: 'Head Office Name' },
      { key: 'head_office_address', value: '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000', group: 'Head Office', description: 'Head Office Address' },
      { key: 'head_office_phone', value: '01612-429999', group: 'Head Office', description: 'Head Office Phone' },
      { key: 'head_office_email', value: 'info@uwsbd.com', group: 'Head Office', description: 'Head Office Email' },
      { key: 'head_office_website', value: 'www.uwsbd.com', group: 'Head Office', description: 'Head Office Website' },

      // Corporate Office & Display Center
      { key: 'corporate_office_name', value: 'Corporate Office', group: 'Corporate Office', description: 'Corporate Office Name' },
      { key: 'corporate_office_address', value: 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310', group: 'Corporate Office', description: 'Corporate Office Address' },
      { key: 'corporate_office_phone', value: '01912-580072', group: 'Corporate Office', description: 'Corporate Office Phone' },
      { key: 'corporate_office_email', value: 'info@uwsbd.com', group: 'Corporate Office', description: 'Corporate Office Email' },

      // Warehouse
      { key: 'warehouse_name', value: 'Warehouse & Logistics', group: 'Warehouse', description: 'Warehouse Name' },
      { key: 'warehouse_address', value: 'Unique Wood Solution Warehouse, Godarbag, Keraniganj, Dhaka 1310', group: 'Warehouse', description: 'Warehouse Address' },
      { key: 'warehouse_phone', value: '01805-465555', group: 'Warehouse', description: 'Warehouse Phone' },
      { key: 'warehouse_email', value: 'info@uwsbd.com', group: 'Warehouse', description: 'Warehouse Email' },

      // Backwards Compatibility & General
      { key: 'showroom_name', value: 'Unique Wood Solution Display Center', group: 'Location', description: 'Primary Showroom & Demo Center Name' },
      { key: 'showroom_badge', value: 'Live Machinery Demo', group: 'Location', description: 'Showroom demo space badge' },
      { key: 'showroom_address', value: 'Unique Wood Solution Display Center, South Ramerkanda, Keraniganj Model, Dhaka 1310', group: 'Location', description: 'Showroom physical address' },
      { key: 'showroom_hours', value: 'Saturday – Thursday: 9:00 AM – 7:00 PM', group: 'Location', description: 'Showroom operating hours' },
      { key: 'showroom_phone', value: '01912-580072', group: 'Location', description: 'Showroom phone number' },
      { key: 'showroom_maps_url', value: 'https://maps.google.com/?q=Unique+Wood+Solution+South+Ramerkanda+Keraniganj+Dhaka', group: 'Location', description: 'Showroom Google Maps link' },
      { key: 'office_name', value: 'Head Office', group: 'Location', description: 'Corporate Office Name' },
      { key: 'office_address', value: '#5 Purano Mugholtuli Screw Market, Room #17, Nawabpur Road, Dhaka 1000', group: 'Location', description: 'Corporate Office address' },
      { key: 'support_phone', value: '01612-429999', group: 'Contact', description: 'TopBar support phone' },
      { key: 'support_email', value: 'info@uwsbd.com', group: 'Contact', description: 'TopBar support email' },
      { key: 'whatsapp_number', value: '01912-580072', group: 'Contact', description: 'WhatsApp Desk number' },
      { key: 'partner_badge', value: 'Authorized Machinery & Turnkey Engineering Partner', group: 'Contact', description: 'TopBar partner badge' },
      { key: 'hero_headline', value: 'High-Precision CNC & Industrial Woodworking Machinery', group: 'Homepage', description: 'Hero banner main title' },
      { key: 'hero_subtitle', value: 'Turnkey industrial solutions with complete factory planning, automated production line layout, machinery commissioning, and genuine spare parts support.', group: 'Homepage', description: 'Hero banner subtitle' },
    ];
  },

  async updateSiteSettings(settings: SiteSetting[]): Promise<SiteSetting[]> {
    // 1. Update localStorage cache map immediately
    const stored = localStorage.getItem('wts_site_settings');
    const map: Record<string, string> = stored ? JSON.parse(stored) : {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    localStorage.setItem('wts_site_settings', JSON.stringify(map));

    // Broadcast window event so Header, TopBar, Footer update immediately
    window.dispatchEvent(new CustomEvent('wts-settings-updated', { detail: map }));

    try {
      const response = await apiClient.put<SiteSetting[]>('/admin/settings', settings);
      return response.data;
    } catch {
      return settings;
    }
  },

  // Bulk CSV Import / Export
  async exportProductsCsv(): Promise<Blob> {
    try {
      const response = await apiClient.get('/admin/products/export', { responseType: 'blob' });
      return response.data;
    } catch {
      const headers = ['ModelNumber', 'Name', 'Category', 'Manufacturer', 'Price', 'Condition', 'Status', 'TravellingSize', 'SpindlePower'];
      const rows = DEMO_PRODUCTS.map((p) => [
        p.modelNumber,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.categoryName || ''}"`,
        `"${p.manufacturerName || ''}"`,
        p.referencePrice || 0,
        p.condition,
        p.availabilityStatus,
        `"${p.specifications?.travelling_size || p.specifications?.working_area || ''}"`,
        `"${p.specifications?.spindle_power || ''}"`,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    }
  },

  async importProductsCsv(file: File): Promise<BulkImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<BulkImportResult>('/admin/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      return {
        totalProcessed: 5,
        successCount: 5,
        failureCount: 0,
        errors: [],
      };
    }
  },

  // Hero Carousel Management
  getHeroSlides(): HeroSlide[] {
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
};

