import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Sliders,
  Check,
  X,
  Edit2,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  ArrowUpDown,
  Eye,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { catalogService } from '@/services/catalogService';
import { AttributeDataType, Category, CategoryAttribute } from '@/types';
import Button from '@/components/common/Button';
import { handleImageError } from '@/utils/imageUtils';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Category Add / Edit Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true,
  });

  // New Attribute Form
  const [newAttr, setNewAttr] = useState<{
    label: string;
    attributeKey: string;
    dataType: AttributeDataType;
    unit: string;
    options: string;
    isFilterable: boolean;
    isRequired: boolean;
  }>({
    label: '',
    attributeKey: '',
    dataType: 'Text',
    unit: '',
    options: '',
    isFilterable: true,
    isRequired: false,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await catalogService.getCategories();
      const sorted = [...cats].sort((a, b) => a.displayOrder - b.displayOrder);
      setCategories(sorted);
      if (sorted.length > 0 && !selectedCategory) {
        setSelectedCategory(sorted[0]);
        setAttributes(sorted[0].attributes || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setAttributes(cat.attributes || []);
    setSaveSuccess(false);
  };

  // Open Add Category Modal
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
    });
    setIsCategoryModalOpen(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const slug =
      categoryForm.slug.trim() ||
      categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload: Partial<Category> = {
      name: categoryForm.name.trim(),
      slug,
      description: categoryForm.description.trim(),
      imageUrl: categoryForm.imageUrl.trim() || null,
      displayOrder: Number(categoryForm.displayOrder) || 1,
      isActive: categoryForm.isActive,
    };

    if (editingCategory) {
      const updated = await adminService.updateCategory(editingCategory.id, payload);
      const updatedList = categories.map((c) => (c.id === updated.id ? { ...c, ...updated } : c));
      updatedList.sort((a, b) => a.displayOrder - b.displayOrder);
      setCategories(updatedList);
      if (selectedCategory?.id === updated.id) {
        setSelectedCategory({ ...selectedCategory, ...updated });
      }
    } else {
      const created = await adminService.createCategory(payload);
      const updatedList = [...categories, created].sort((a, b) => a.displayOrder - b.displayOrder);
      setCategories(updatedList);
      setSelectedCategory(created);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await adminService.deleteCategory(id);
      const updatedList = categories.filter((c) => c.id !== id);
      setCategories(updatedList);
      if (selectedCategory?.id === id) {
        setSelectedCategory(updatedList[0] || null);
        setAttributes(updatedList[0]?.attributes || []);
      }
    }
  };

  // Attribute Builder Handlers
  const handleAddAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttr.label || !selectedCategory) return;

    const generatedKey =
      newAttr.attributeKey.trim() ||
      newAttr.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');

    const parsedOptions =
      newAttr.options.trim()
        ? newAttr.options.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;

    const created: CategoryAttribute = {
      id: `attr-${Date.now()}`,
      categoryId: selectedCategory.id,
      label: newAttr.label,
      attributeKey: generatedKey,
      dataType: newAttr.dataType,
      unit: newAttr.unit.trim() || null,
      options: parsedOptions,
      isFilterable: newAttr.isFilterable,
      isRequired: newAttr.isRequired,
      displayOrder: attributes.length + 1,
    };

    setAttributes([...attributes, created]);
    setNewAttr({
      label: '',
      attributeKey: '',
      dataType: 'Text',
      unit: '',
      options: '',
      isFilterable: true,
      isRequired: false,
    });
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes(attributes.filter((a) => a.id !== id));
  };

  const handleSaveSchema = async () => {
    if (!selectedCategory) return;
    await adminService.saveCategoryAttributes(selectedCategory.id, attributes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Machinery Categories &amp; Schema Engineering
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 mt-0.5">
            Category Management &amp; Dynamic Specs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage category ordering, homepage featured slots (top 4-5 series), and configure dynamic JSONB specification schemas.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddCategory}
          icon={<Plus className="w-4 h-4" />}
          className="font-semibold shadow-xs shrink-0"
        >
          Add New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Categories List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-border p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-border">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal-700">
                Categories Directory
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Top 4-5 categories appear on homepage
              </p>
            </div>
            <span className="text-[10px] text-industrial-orange font-bold px-2 py-0.5 bg-orange-50 rounded border border-orange-200">
              {categories.length} Total
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const isSelected = selectedCategory?.id === cat.id;
              const isTopFeatured = idx < 5;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-white border-slate-border text-charcoal-800 hover:border-industrial-orange/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={cat.imageUrl || ''}
                      alt=""
                      onError={handleImageError}
                      className="w-9 h-9 rounded object-cover border border-slate-border bg-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold truncate">{cat.name}</span>
                        {isTopFeatured && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isSelected ? 'bg-industrial-orange text-white' : 'bg-orange-100 text-industrial-orange'
                            }`}
                            title="Featured in Homepage Category Section"
                          >
                            Top #{cat.displayOrder}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {cat.attributes?.length || 0} specifications • {cat.productCount || 0} models
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pl-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditCategory(cat, e)}
                      className={`p-1.5 rounded transition-colors ${
                        isSelected ? 'hover:bg-navy-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-navy-900'
                      }`}
                      title="Edit Category Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                      className={`p-1.5 rounded transition-colors ${
                        isSelected ? 'hover:bg-red-900/40 text-red-300 hover:text-red-200' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                      }`}
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Attribute Builder */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCategory ? (
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-border">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCategory.imageUrl || ''}
                    alt=""
                    onError={handleImageError}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-border bg-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-industrial-orange uppercase tracking-wider">
                        Category Schema (Order #{selectedCategory.displayOrder})
                      </span>
                      {selectedCategory.isActive && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-navy-900">{selectedCategory.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedCategory.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditCategory(selectedCategory)}
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit Details
                  </Button>

                  {saveSuccess && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Saved!
                    </span>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveSchema}
                    className="font-semibold shadow-xs"
                  >
                    Save Attribute Schema
                  </Button>
                </div>
              </div>

              {/* Attributes List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Defined Technical Attributes ({attributes.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Stored in PostgreSQL JSONB column: specifications
                  </span>
                </div>

                {attributes.length === 0 ? (
                  <div className="p-8 text-center bg-surface-offwhite rounded-lg border border-dashed border-slate-border text-slate-500 text-xs">
                    No technical specifications configured for this category yet. Use the form below to add them.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-border border border-slate-border rounded-lg overflow-hidden">
                    {attributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-navy-900">{attr.label}</span>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-light px-1.5 py-0.5 rounded">
                              key: {attr.attributeKey}
                            </span>
                            {attr.isRequired && (
                              <span className="text-[10px] font-bold text-red-500 uppercase">Required</span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="px-2 py-0.5 bg-surface-offwhite rounded border border-slate-border text-charcoal-700">
                              Type: {attr.dataType}
                            </span>
                            {attr.unit && (
                              <span className="px-2 py-0.5 bg-surface-offwhite rounded border border-slate-border text-charcoal-700">
                                Unit: {attr.unit}
                              </span>
                            )}
                            {attr.isFilterable && (
                              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Filterable in Catalog
                              </span>
                            )}
                            {attr.options && attr.options.length > 0 && (
                              <span className="text-slate-400 truncate max-w-xs">
                                Options: {attr.options.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(attr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors self-end sm:self-center"
                          title="Remove Attribute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Attribute Form */}
              <div className="pt-4 border-t border-slate-border">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-industrial-orange" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                    Add Technical Specification Field
                  </h4>
                </div>

                <form onSubmit={handleAddAttribute} className="space-y-4 bg-surface-offwhite p-4 rounded-lg border border-slate-border">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                        Specification Label *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Spindle Power"
                        value={newAttr.label}
                        onChange={(e) => setNewAttr({ ...newAttr, label: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                        Attribute Key (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="auto-generated: spindle_power"
                        value={newAttr.attributeKey}
                        onChange={(e) => setNewAttr({ ...newAttr, attributeKey: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 font-mono focus:outline-none focus:border-industrial-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                        Data Type *
                      </label>
                      <select
                        value={newAttr.dataType}
                        onChange={(e) =>
                          setNewAttr({ ...newAttr, dataType: e.target.value as AttributeDataType })
                        }
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      >
                        <option value="Text">Text (e.g. 1300 x 2500 mm)</option>
                        <option value="Number">Number (e.g. 24)</option>
                        <option value="Dropdown">Dropdown (Predefined list)</option>
                        <option value="Boolean">Boolean (Yes / No toggle)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                        Unit of Measurement (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. kW, mm, m/min, kg, Tons"
                        value={newAttr.unit}
                        onChange={(e) => setNewAttr({ ...newAttr, unit: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                    </div>

                    {newAttr.dataType === 'Dropdown' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                          Options (Comma-separated) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 6.0 kW, 9.0 kW, 12.0 kW, 16.0 kW"
                          value={newAttr.options}
                          onChange={(e) => setNewAttr({ ...newAttr, options: e.target.value })}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-700">
                        <input
                          type="checkbox"
                          checked={newAttr.isFilterable}
                          onChange={(e) => setNewAttr({ ...newAttr, isFilterable: e.target.checked })}
                          className="text-industrial-orange focus:ring-industrial-orange rounded"
                        />
                        <span>Enable as Dynamic Filter in Catalog</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-700">
                        <input
                          type="checkbox"
                          checked={newAttr.isRequired}
                          onChange={(e) => setNewAttr({ ...newAttr, isRequired: e.target.checked })}
                          className="text-industrial-orange focus:ring-industrial-orange rounded"
                        />
                        <span>Mandatory for Products</span>
                      </label>
                    </div>

                    <Button type="submit" variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                      Append Attribute
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-border p-12 text-center text-slate-400">
              Select a category on the left to configure its attributes.
            </div>
          )}
        </div>
      </div>

      {/* Category Modal (Add or Edit) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-border flex items-center justify-between bg-navy-950 text-white">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-industrial-orange" />
                <h3 className="font-bold text-sm">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Machinery Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNC Machining Centers"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cnc-machining-centers"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 font-mono focus:outline-none focus:border-industrial-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Display Order (1-5 Featured on Homepage)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 font-semibold focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Category Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={categoryForm.imageUrl}
                  onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
                {categoryForm.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-surface-offwhite rounded border border-slate-border">
                    <img
                      src={categoryForm.imageUrl}
                      alt="Preview"
                      onError={handleImageError}
                      className="w-16 h-12 rounded object-cover border border-slate-border bg-slate-200 shrink-0"
                    />
                    <span className="text-[11px] text-slate-500">
                      Live image preview. If this link ever fails, the platform will automatically render the WoodTech fallback SVG.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive description of equipment line, capabilities, and industrial applications..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActiveCheck"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="text-industrial-orange rounded"
                />
                <label htmlFor="catActiveCheck" className="text-xs font-semibold text-charcoal-800">
                  Active in Catalog &amp; Homepage Navigation
                </label>
              </div>

              <div className="pt-4 border-t border-slate-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="font-semibold">
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
