import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Check,
  X,
  Sliders,
  AlertCircle,
  Star,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { catalogService } from '@/services/catalogService';
import { Category, Manufacturer, Product } from '@/types';
import { AvailabilityBadge, ConditionBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { handleImageError } from '@/utils/imageUtils';

interface SpecRow {
  id: string;
  key: string;
  value: string;
}

const SUBCATEGORIES_STORAGE_KEY = 'uws_subcategories_by_category';

const DEFAULT_SUBCATEGORIES_MAP: Record<string, string[]> = {
  'cnc-router-machine': [
    '3-Axis CNC Router',
    '4-Axis CNC Router',
    '5-Axis Machining Center',
    'ATC Linear Nesting Center',
    'Heavy-Duty Stone & Wood CNC',
  ],
  'surface-planer': [
    'Manual Surface Planer',
    'Heavy-Duty Long-Bed Jointer',
    'Helical Spiral Cutter Planer',
  ],
  'thickness-planer': [
    'Single-Side Auto Feed Planer',
    'Double-Side Heavy Duty Planer',
    'High-Precision 630mm Planer',
  ],
  'spindle-shaper-moulder': [
    'Tilting Spindle Shaper',
    'High Speed Heavy Moulder',
    'Sliding Table Spindle Shaper',
  ],
  'circular-saw': [
    'Sliding Table Precision Saw',
    'Heavy Duty Rip Saw',
    'Multi-Blade Cross-Cut Saw',
  ],
  'edge-banding': [
    'Manual Contour Edge Bander',
    'High-Speed Automatic Edgebander',
    'PUR & EVA Dual-Melt Edgebander',
    'Corner Rounding Finishing Line',
  ],
  'panel-saws': [
    'Sliding Table Saw (MJ Series)',
    'Computerized Heavy Beam Saw',
    'Vertical Panel Saw',
  ],
  'boring-drilling': [
    'Single-Row Multi-Spindle Line',
    'Multi-Row Boring Machine',
    'Six-Sided CNC Drilling Center',
  ],
  'sanding-finishing': [
    'Wide Belt Calibrating Sander',
    'Profile Brush Polishing Sander',
    'Fine Lacquer Finish Sander',
  ],
  'hydraulic-presses': [
    'Multi-Daylight Hot Press',
    '50-Ton Sectional Cold Press',
    'Hydraulic Door Embossing Press',
  ],
  'dust-extraction': [
    'Pulse-Jet Central Dust Collector',
    'Twin-Bag Industrial Dust Collector',
    'Cyclone Filtration Unit',
  ],
  'cutter-accessories': [
    'PCD Diamond Sizing Saw Blades',
    'Helical Spiral Planer Heads',
    'TCT Turnover Knives',
  ],
};

const getStoredSubcategoriesMap = (): Record<string, string[]> => {
  try {
    const raw = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

const saveStoredSubcategory = (categoryKey: string, subName: string) => {
  try {
    const map = getStoredSubcategoriesMap();
    const existing = map[categoryKey] || [];
    if (!existing.includes(subName)) {
      map[categoryKey] = [...existing, subName];
      localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(map));
    }
  } catch {}
};

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'standard'>('all');
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Bulk CSV Import / Export States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ total: number; success: number; errors: string[] } | null>(null);

  const handleExportCsv = async () => {
    try {
      const blob = await adminService.exportProductsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `woodtech-machinery-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;
    setIsImporting(true);
    setImportResult(null);
    try {
      const res = await adminService.importProductsCsv(importFile);
      setImportResult({ total: res.totalProcessed, success: res.successCount, errors: res.errors || [] });
      await loadData();
    } catch (err) {
      console.error('Failed to import CSV', err);
    } finally {
      setIsImporting(false);
    }
  };
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // In-line Category Quick Creation States
  const [isInlineCategoryOpen, setIsInlineCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [inlineCatSuccess, setInlineCatSuccess] = useState('');

  // In-line Subcategory Creation States
  const [isInlineSubCategoryOpen, setIsInlineSubCategoryOpen] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [inlineSubCatSuccess, setInlineSubCatSuccess] = useState('');
  const [customSubcategoriesMap, setCustomSubcategoriesMap] = useState<Record<string, string[]>>(() => getStoredSubcategoriesMap());

  // Dynamic Custom Specification Rows State
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);

  const handleAddSpecRow = (key = '', value = '') => {
    setSpecRows((prev) => [
      ...prev,
      { id: `spec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, key, value },
    ]);
  };

  const handleRemoveSpecRow = (id: string) => {
    setSpecRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSpecRowChange = (id: string, field: 'key' | 'value', value: string) => {
    setSpecRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    modelNumber: '',
    sku: '',
    categoryId: '',
    subCategory: '',
    manufacturerId: '',
    condition: 'BrandNew',
    availabilityStatus: 'InStock',
    mainImageUrl: '',
    shortDescription: '',
    fullDescription: '',
    referencePrice: '',
    isFeatured: false,
    specifications: {} as Record<string, any>,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cats, mans] = await Promise.all([
        catalogService.getProducts({ pageSize: 50 }),
        catalogService.getCategories(),
        catalogService.getManufacturers(),
      ]);
      setProducts(pRes.items);
      setCategories(cats);
      setManufacturers(mans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const featuredCount = products.filter((p) => p.isFeatured).length;

  // Filter products locally for instant response
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategoryFilter || p.categoryId === selectedCategoryFilter;
    const matchesFeatured =
      featuredFilter === 'all'
        ? true
        : featuredFilter === 'featured'
        ? p.isFeatured
        : !p.isFeatured;
    return matchesSearch && matchesCat && matchesFeatured;
  });

  const handleOpenCreateModal = () => {
    const defaultCatId = categories[0]?.id || '';
    const defaultManId = manufacturers[0]?.id || '';
    setEditingProduct(null);
    setIsInlineCategoryOpen(false);
    setInlineCatSuccess('');
    setNewCatName('');
    setNewCatDesc('');
    setIsInlineSubCategoryOpen(false);
    setInlineSubCatSuccess('');
    setNewSubCategoryName('');
    setSpecRows([
      { id: 'spec-1', key: 'Working Area', value: '' },
      { id: 'spec-2', key: 'Main Motor / Spindle Power', value: '' },
      { id: 'spec-3', key: 'Control System', value: '' },
      { id: 'spec-4', key: 'Operating Voltage', value: '' },
    ]);
    setFormState({
      name: '',
      modelNumber: '',
      sku: `UWS-EQ-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: defaultCatId,
      subCategory: '',
      manufacturerId: defaultManId,
      condition: 'BrandNew',
      availabilityStatus: 'InStock',
      mainImageUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      shortDescription: '',
      fullDescription: '',
      referencePrice: '',
      isFeatured: false,
      specifications: {},
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsInlineCategoryOpen(false);
    setInlineCatSuccess('');
    setNewCatName('');
    setNewCatDesc('');
    setIsInlineSubCategoryOpen(false);
    setInlineSubCatSuccess('');
    setNewSubCategoryName('');

    const existingSpecs = p.specifications || {};
    const rows: SpecRow[] = Object.entries(existingSpecs)
      .filter(([k]) => k !== 'subCategory')
      .map(([k, v], i) => ({
        id: `spec-${i}-${Date.now()}`,
        key: k.replace(/_/g, ' '),
        value: typeof v === 'boolean' ? (v ? 'Yes / Integrated' : 'No') : String(v),
      }));

    setSpecRows(
      rows.length > 0
        ? rows
        : [
            { id: 'spec-1', key: 'Working Area', value: '' },
            { id: 'spec-2', key: 'Main Motor / Spindle Power', value: '' },
            { id: 'spec-3', key: 'Control System', value: '' },
            { id: 'spec-4', key: 'Operating Voltage', value: '' },
          ]
    );

    setFormState({
      name: p.name,
      modelNumber: p.modelNumber,
      sku: p.sku,
      categoryId: p.categoryId,
      subCategory: p.subCategory || (p.specifications?.subCategory as string) || '',
      manufacturerId: p.manufacturerId,
      condition: p.condition,
      availabilityStatus: p.availabilityStatus,
      mainImageUrl: p.mainImageUrl,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      referencePrice: p.referencePrice ? String(p.referencePrice) : '',
      isFeatured: p.isFeatured,
      specifications: p.specifications ? { ...p.specifications } : {},
    });
    setIsModalOpen(true);
  };

  const handleQuickCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) return;
    setIsCreatingCat(true);
    try {
      const created = await adminService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      });
      setCategories((prev) => [...prev, created]);
      setFormState((prev) => ({ ...prev, categoryId: created.id }));
      setInlineCatSuccess(`Category "${created.name}" created and selected!`);
      setTimeout(() => setInlineCatSuccess(''), 3500);
      setNewCatName('');
      setNewCatDesc('');
      setIsInlineCategoryOpen(false);
    } catch (err) {
      console.error('Failed to quick create category:', err);
      alert('Failed to create category. Please check your connection and try again.');
    } finally {
      setIsCreatingCat(false);
    }
  };

  const handleQuickCreateSubCategory = () => {
    const trimmed = newSubCategoryName.trim();
    if (!trimmed) return;
    if (!formState.categoryId) {
      alert('Please select a Category first.');
      return;
    }

    saveStoredSubcategory(formState.categoryId, trimmed);
    if (currentCategory?.slug) {
      saveStoredSubcategory(currentCategory.slug, trimmed);
    }

    setCustomSubcategoriesMap(getStoredSubcategoriesMap());
    setFormState((prev) => ({ ...prev, subCategory: trimmed }));
    setInlineSubCatSuccess(`Subcategory "${trimmed}" saved & selected!`);
    setTimeout(() => setInlineSubCatSuccess(''), 3500);
    setNewSubCategoryName('');
    setIsInlineSubCategoryOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the active catalog?`)) {
      await adminService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updatedStatus = !product.isFeatured;
    try {
      await adminService.toggleProductFeatured(product.id, updatedStatus);
      setProducts(
        products.map((p) => (p.id === product.id ? { ...p, isFeatured: updatedStatus } : p))
      );
      setToastMessage(
        updatedStatus
          ? `★ "${product.name}" is now featured on the homepage!`
          : `Removed "${product.name}" from homepage featured products.`
      );
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.categoryId) {
      alert('Please select or create a Category for this machinery model.');
      return;
    }

    // Build custom specifications map from dynamic specification rows
    const specs: Record<string, any> = {};
    specRows.forEach((r) => {
      const k = r.key.trim();
      const v = r.value.trim();
      if (k) {
        specs[k] = v;
      }
    });

    const trimmedSub = formState.subCategory.trim();
    if (trimmedSub) {
      specs.subCategory = trimmedSub;
      saveStoredSubcategory(formState.categoryId, trimmedSub);
      if (currentCategory?.slug) {
        saveStoredSubcategory(currentCategory.slug, trimmedSub);
      }
      setCustomSubcategoriesMap(getStoredSubcategoriesMap());
    }

    const payload: Partial<Product> = {
      name: formState.name,
      modelNumber: formState.modelNumber,
      sku: formState.sku,
      categoryId: formState.categoryId,
      categoryName: categories.find((c) => c.id === formState.categoryId)?.name,
      subCategory: trimmedSub || undefined,
      manufacturerId: formState.manufacturerId,
      manufacturerName: manufacturers.find((m) => m.id === formState.manufacturerId)?.name,
      condition: formState.condition as any,
      availabilityStatus: formState.availabilityStatus as any,
      mainImageUrl: formState.mainImageUrl,
      shortDescription: formState.shortDescription,
      fullDescription: formState.fullDescription,
      referencePrice: formState.referencePrice ? parseFloat(formState.referencePrice) : null,
      isFeatured: formState.isFeatured,
      specifications: specs,
    };

    if (editingProduct?.id) {
      const updated = await adminService.updateProduct(editingProduct.id, payload);
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await adminService.createProduct(payload);
      setProducts([created, ...products]);
    }
    setIsModalOpen(false);
  };

  // Find active category
  const currentCategory = categories.find((c) => c.id === formState.categoryId);

  // Collect available subcategories for selected category from default map + custom storage + products
  const availableSubcategories = React.useMemo(() => {
    const list = new Set<string>();
    const catId = formState.categoryId;
    const catSlug = currentCategory?.slug;

    // 1. From default map by slug or id
    if (catSlug && DEFAULT_SUBCATEGORIES_MAP[catSlug]) {
      DEFAULT_SUBCATEGORIES_MAP[catSlug].forEach((s) => list.add(s));
    }
    if (catId && DEFAULT_SUBCATEGORIES_MAP[catId]) {
      DEFAULT_SUBCATEGORIES_MAP[catId].forEach((s) => list.add(s));
    }

    // 2. From stored custom map
    if (catId && customSubcategoriesMap[catId]) {
      customSubcategoriesMap[catId].forEach((s) => list.add(s));
    }
    if (catSlug && customSubcategoriesMap[catSlug]) {
      customSubcategoriesMap[catSlug].forEach((s) => list.add(s));
    }

    // 3. From category model subCategories
    currentCategory?.subCategories?.forEach((sub) => {
      if (sub.name) list.add(sub.name);
    });

    // 4. From existing products in this category
    products
      .filter((p) => p.categoryId === catId || (catSlug && p.categorySlug === catSlug))
      .forEach((p) => {
        const sc = p.subCategory || (p.specifications?.subCategory as string);
        if (sc && sc.trim()) list.add(sc.trim());
      });

    return Array.from(list);
  }, [currentCategory, formState.categoryId, customSubcategoriesMap, products]);

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Inventory Management
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 mt-0.5">Machinery Models</h1>
          <p className="text-xs text-slate-500 mt-1">
            Total {products.length} models listed with PostgreSQL JSONB specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCsv}
            icon={<Download className="w-4 h-4" />}
            className="font-semibold text-xs"
          >
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setImportResult(null);
              setImportFile(null);
              setIsImportModalOpen(true);
            }}
            icon={<Upload className="w-4 h-4" />}
            className="font-semibold text-xs"
          >
            Import CSV
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-xs text-xs"
          >
            Add Machinery Model
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-navy-950 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Homepage Featured Products Controller Bar */}
      <div className="bg-white rounded-xl border border-slate-border p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-emerald-600 fill-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-950">
                Homepage Featured Products Controller
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {featuredCount} Active on Home
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Only machines marked with <strong>★ Featured</strong> will be displayed in the "FEATURED PRODUCTS" section of the public homepage. Click the star in the table below to show or hide any machine instantly.
            </p>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFeaturedFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              featuredFilter === 'all'
                ? 'bg-white text-navy-950 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFeaturedFilter('featured')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              featuredFilter === 'featured'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${featuredFilter === 'featured' ? 'fill-white text-white' : 'text-emerald-600'}`} />
            <span>Featured ({featuredCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFeaturedFilter('standard')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              featuredFilter === 'standard'
                ? 'bg-white text-navy-950 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Standard ({products.length - featuredCount})
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by model, SKU, or machine name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-offwhite border-b border-slate-border text-slate-muted uppercase tracking-wider">
                <th className="py-3 px-4">Machinery Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Manufacturer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Homepage Showcase</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.mainImageUrl}
                        alt=""
                        onError={handleImageError}
                        className="w-12 h-12 object-cover rounded bg-slate-light border border-slate-border shrink-0"
                      />
                      <div className="truncate max-w-xs">
                        <span className="font-mono text-[11px] font-bold text-industrial-orange block">
                          {p.modelNumber}
                        </span>
                        <span className="font-semibold text-navy-900 truncate block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-charcoal-700">
                    <span className="block text-navy-900 font-semibold">{p.categoryName || 'Unassigned'}</span>
                    {(p.subCategory || p.specifications?.subCategory) && (
                      <span className="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] bg-slate-100 text-slate-600 rounded border border-slate-200">
                        {p.subCategory || p.specifications?.subCategory}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{p.manufacturerName}</td>
                  <td className="py-3 px-4">
                    <AvailabilityBadge status={p.availabilityStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        p.isFeatured
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                          : 'text-slate-500 bg-slate-50 border-slate-200 hover:text-navy-900 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                      title={p.isFeatured ? 'Click to remove from homepage Featured section' : 'Click to feature on homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-emerald-600 text-emerald-600' : 'text-slate-400'}`} />
                      <span>{p.isFeatured ? '★ Featured on Home' : 'Not Featured'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-light rounded transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Machinery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-border flex items-center justify-between bg-navy-950 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-industrial-orange" />
                <h3 className="font-bold text-sm tracking-tight">
                  {editingProduct ? `Edit Machine: ${editingProduct.name}` : 'Create New Machinery Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Machine Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WTS Prime-1325 ATC CNC Router"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Model Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WTS-1325-ATC"
                    value={formState.modelNumber}
                    onChange={(e) => setFormState({ ...formState, modelNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange font-mono"
                  />
                </div>
              </div>

              {/* Category & Subcategory Flow */}
              <div className="space-y-3 bg-surface-offwhite/50 p-3.5 rounded-lg border border-slate-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection + Inline Creation Trigger */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                        Machinery Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsInlineCategoryOpen(!isInlineCategoryOpen)}
                        className="text-[11px] font-bold text-industrial-orange hover:text-industrial-orange-dark inline-flex items-center gap-1 cursor-pointer"
                        title="Create a new category right here"
                      >
                        <Plus className="w-3 h-3" />
                        {isInlineCategoryOpen ? 'Cancel' : '+ New Category'}
                      </button>
                    </div>

                    <select
                      required
                      value={formState.categoryId}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsInlineCategoryOpen(true);
                        } else {
                          setFormState({ ...formState, categoryId: e.target.value });
                        }
                      }}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange shadow-2xs font-medium"
                    >
                      <option value="">-- Select Category (Required) * --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      <option value="__new__" className="font-semibold text-industrial-orange">
                        + Create New Category...
                      </option>
                    </select>
                  </div>

                  {/* Subcategory Dropdown (With Create & Save Capability) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                        Subcategory <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsInlineSubCategoryOpen(!isInlineSubCategoryOpen)}
                        className="text-[11px] font-bold text-industrial-orange hover:text-industrial-orange-dark inline-flex items-center gap-1 cursor-pointer"
                        title="Create a new subcategory"
                      >
                        <Plus className="w-3 h-3" />
                        {isInlineSubCategoryOpen ? 'Cancel' : '+ New Subcategory'}
                      </button>
                    </div>

                    <select
                      value={formState.subCategory}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsInlineSubCategoryOpen(true);
                        } else {
                          setFormState({ ...formState, subCategory: e.target.value });
                        }
                      }}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange shadow-2xs font-medium"
                    >
                      <option value="">
                        {availableSubcategories.length > 0
                          ? '-- Select Subcategory (Optional) --'
                          : '-- No Subcategories Yet (Click + New) --'}
                      </option>
                      {availableSubcategories.map((sc) => (
                        <option key={sc} value={sc}>
                          {sc}
                        </option>
                      ))}
                      <option value="__new__" className="font-semibold text-industrial-orange">
                        + Create New Subcategory...
                      </option>
                    </select>

                    {/* Quick suggestion pills if available */}
                    {availableSubcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {availableSubcategories.slice(0, 4).map((sc) => (
                          <button
                            key={sc}
                            type="button"
                            onClick={() => setFormState({ ...formState, subCategory: sc })}
                            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                              formState.subCategory === sc
                                ? 'bg-industrial-orange text-white border-industrial-orange font-bold'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Quick-Add Category Box */}
                {isInlineCategoryOpen && (
                  <div className="p-3 bg-amber-50/70 border border-amber-300/80 rounded-lg space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                        <Plus className="w-3.5 h-3.5 text-industrial-orange" />
                        <span>Create New Category Right Here</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInlineCategoryOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 mb-0.5">
                          Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="e.g. CNC Router & Machining Centers"
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleQuickCreateCategory();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 mb-0.5">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={newCatDesc}
                          onChange={(e) => setNewCatDesc(e.target.value)}
                          placeholder="Short description of this machinery type..."
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleQuickCreateCategory();
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsInlineCategoryOpen(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isCreatingCat || !newCatName.trim()}
                        onClick={() => handleQuickCreateCategory()}
                        className="px-3.5 py-1 bg-industrial-orange text-white text-xs font-semibold rounded hover:bg-industrial-orange-dark disabled:opacity-50 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {isCreatingCat ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Create &amp; Select
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Quick-Add Subcategory Box (Saved and Persisted) */}
                {isInlineSubCategoryOpen && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                        <Plus className="w-3.5 h-3.5 text-industrial-orange" />
                        <span>
                          Add New Subcategory for {currentCategory?.name || 'Selected Category'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInlineSubCategoryOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        placeholder="e.g. 5-Axis CNC Routers, Sliding Table Saws, Contour Edgebander..."
                        className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleQuickCreateSubCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={!newSubCategoryName.trim()}
                        onClick={handleQuickCreateSubCategory}
                        className="px-3.5 py-2 bg-industrial-orange text-white text-xs font-semibold rounded hover:bg-industrial-orange-dark disabled:opacity-50 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save &amp; Select</span>
                      </button>
                    </div>
                  </div>
                )}

                {inlineSubCatSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inlineSubCatSuccess}</span>
                  </div>
                )}

                {inlineCatSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inlineCatSuccess}</span>
                  </div>
                )}
              </div>

              {/* Manufacturer & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Manufacturer / Brand *
                  </label>
                  <select
                    value={formState.manufacturerId}
                    onChange={(e) => setFormState({ ...formState, manufacturerId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  >
                    {manufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Availability Status
                  </label>
                  <select
                    value={formState.availabilityStatus}
                    onChange={(e) =>
                      setFormState({ ...formState, availabilityStatus: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  >
                    <option value="InStock">In Stock</option>
                    <option value="AvailableToOrder">Available To Order</option>
                    <option value="ManufacturingLeadTime">Lead Time 4-6 Wks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Main Machinery Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formState.mainImageUrl}
                  onChange={(e) => setFormState({ ...formState, mainImageUrl: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Short Technical Summary
                </label>
                <textarea
                  rows={2}
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  placeholder="High level executive summary of spindle power, vacuum table, and axis travel..."
                  className="w-full text-xs p-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              {/* FLEXIBLE CUSTOM SPECIFICATIONS BUILDER */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-industrial-orange" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">
                        Technical Specifications (Custom Parameters)
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Add any custom specification boxes for this machine model as needed.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSpecRow()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-950 hover:bg-industrial-orange text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Specification Box</span>
                  </button>
                </div>

                {/* Common quick-add suggestion pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Add:</span>
                  {[
                    'Working Area',
                    'Spindle / Motor Power',
                    'Control System',
                    'Table Size',
                    'Feed Speed',
                    'Max Blade Diameter',
                    'Operating Voltage',
                    'Net Weight',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSpecRow(s, '')}
                      className="text-[10px] px-2 py-0.5 bg-surface-offwhite hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                {/* Dynamic Spec Boxes Container */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {specRows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="flex items-center gap-2.5 p-2.5 bg-surface-offwhite rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      {/* Column 1: Spec Name */}
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Specification Name #{idx + 1}
                        </label>
                        <input
                          type="text"
                          list="common-spec-keys"
                          placeholder="e.g. Working Area, Spindle Power..."
                          value={row.key}
                          onChange={(e) => handleSpecRowChange(row.id, 'key', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-navy-950 font-semibold focus:outline-none focus:border-industrial-orange"
                        />
                      </div>

                      {/* Column 2: Spec Value */}
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Specification Value
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1300 × 2500 mm, 9.0 kW..."
                          value={row.value}
                          onChange={(e) => handleSpecRowChange(row.id, 'value', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete this specification box"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {specRows.length === 0 && (
                    <div className="p-5 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-xs text-slate-500">
                        No specifications added yet. Click <strong>+ Add Specification Box</strong> or any quick pill above to add machine parameters.
                      </p>
                    </div>
                  )}
                </div>

                <datalist id="common-spec-keys">
                  <option value="Working Area" />
                  <option value="Table Size" />
                  <option value="Spindle Power" />
                  <option value="Spindle Speed" />
                  <option value="Main Motor Power" />
                  <option value="Control System" />
                  <option value="Inverter Power" />
                  <option value="Tool Changer Type" />
                  <option value="Vacuum Pump Capacity" />
                  <option value="Feed Speed" />
                  <option value="Max Working Thickness" />
                  <option value="Max Saw Blade Diameter" />
                  <option value="Tape Thickness" />
                  <option value="Operating Voltage" />
                  <option value="Air Pressure Requirement" />
                  <option value="Machine Weight" />
                  <option value="Overall Dimensions" />
                </datalist>
              </div>

              {/* Homepage Showcase Control */}
              <div
                onClick={() => setFormState({ ...formState, isFeatured: !formState.isFeatured })}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formState.isFeatured
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                    : 'bg-surface-offwhite border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formState.isFeatured}
                  onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-navy-900 block cursor-pointer">
                    Showcase this machine in "Featured Products" on the Homepage
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When checked, this machine model will be prominently showcased on the public homepage.
                  </p>
                </div>
                {formState.isFeatured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    <span>Active on Home</span>
                  </span>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="font-semibold">
                  {editingProduct ? 'Save Changes' : 'Publish Model to Catalog'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    
      {/* BULK CSV IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-navy-900">
                  Bulk Machinery CSV Import
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Import multiple machines, specifications, and SKUs from a spreadsheet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-navy-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportCsv} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-industrial-orange transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="font-bold text-navy-900 block cursor-pointer">
                  <span>{importFile ? importFile.name : 'Choose a CSV file to upload'}</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported format: ModelNumber, Name, Category, Manufacturer, Price, TravellingSize, SpindlePower
                </p>
              </div>

              {importResult && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs">
                  <p className="font-bold">
                    Import completed: {importResult.success} of {importResult.total} machines successfully processed!
                  </p>
                  {importResult.errors.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-[11px] text-rose-600">
                      {importResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isImporting}
                  disabled={!importFile}
                  icon={<Upload className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  {isImporting ? 'Processing CSV...' : 'Start Import'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
