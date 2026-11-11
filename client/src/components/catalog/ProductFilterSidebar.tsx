import React from 'react';
import { Search, Filter, RotateCcw, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedManufacturer,
  setSelectedAvailability,
  setSelectedCondition,
  setSpecFilter,
  resetFilters,
} from '@/features/catalog/catalogSlice';
import { Category, Manufacturer } from '@/types';

interface ProductFilterSidebarProps {
  categories: Category[];
  manufacturers: Manufacturer[];
  className?: string;
  onFilterChange?: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  categories,
  manufacturers,
  className = '',
  onFilterChange,
}) => {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    selectedCategorySlug,
    selectedManufacturerSlug,
    selectedAvailability,
    selectedCondition,
    selectedSpecs,
  } = useAppSelector((state) => state.catalog);

  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);
  const filterableAttributes = activeCategory?.attributes?.filter((a) => a.isFilterable) || [];

  const handleCategorySelect = (slug: string | null) => {
    dispatch(setSelectedCategory(slug));
    if (onFilterChange) onFilterChange();
  };

  const handleManufacturerSelect = (slug: string | null) => {
    dispatch(setSelectedManufacturer(slug));
    if (onFilterChange) onFilterChange();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-industrial-orange" />
          <h3 className="font-bold text-sm text-navy-900 tracking-wide uppercase">
            Filter Machinery
          </h3>
        </div>
        <button
          onClick={() => {
            dispatch(resetFilters());
            if (onFilterChange) onFilterChange();
          }}
          className="inline-flex items-center gap-1 text-xs text-slate-muted hover:text-industrial-orange transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
          Keyword / Model / SKU
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search CNC, Edgebander, 1325..."
            value={searchQuery}
            onChange={(e) => {
              dispatch(setSearchQuery(e.target.value));
              if (onFilterChange) onFilterChange();
            }}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Category Accordion / List */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
          Equipment Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
              selectedCategorySlug === null
                ? 'bg-navy-900 text-white font-semibold'
                : 'text-charcoal-700 hover:bg-slate-light'
            }`}
          >
            <span>All Machinery Categories</span>
            <span className="text-[11px] opacity-70">
              {categories.reduce((acc, c) => acc + (c.productCount || 0), 0)}
            </span>
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategorySlug === category.slug;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(isSelected ? null : category.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                  isSelected
                    ? 'bg-industrial-orange text-white font-semibold'
                    : 'text-charcoal-700 hover:bg-slate-light'
                }`}
              >
                <span className="truncate pr-2">{category.name}</span>
                {category.productCount !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-light text-slate-600'
                    }`}
                  >
                    {category.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Specification Filters (Only shows when category is selected) */}
      {filterableAttributes.length > 0 && (
        <div className="pt-4 border-t border-slate-border space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-industrial-orange uppercase">
              Technical Specs
            </label>
            <span className="text-[10px] text-slate-muted">Dynamic Schema</span>
          </div>

          {filterableAttributes.map((attr) => (
            <div key={attr.id} className="space-y-1.5">
              <label className="block text-xs font-medium text-charcoal-700">
                {attr.label} {attr.unit && `(${attr.unit})`}
              </label>

              {attr.options && attr.options.length > 0 ? (
                <select
                  value={selectedSpecs[attr.attributeKey] || ''}
                  onChange={(e) => {
                    dispatch(
                      setSpecFilter({
                        key: attr.attributeKey,
                        value: e.target.value || null,
                      })
                    );
                    if (onFilterChange) onFilterChange();
                  }}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                >
                  <option value="">Any {attr.label}</option>
                  {attr.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={`Filter by ${attr.label}...`}
                  value={selectedSpecs[attr.attributeKey] || ''}
                  onChange={(e) => {
                    dispatch(
                      setSpecFilter({
                        key: attr.attributeKey,
                        value: e.target.value || null,
                      })
                    );
                    if (onFilterChange) onFilterChange();
                  }}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manufacturer Filter */}
      <div className="pt-4 border-t border-slate-border">
        <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
          Manufacturer / Brand
        </label>
        <div className="space-y-1">
          <button
            onClick={() => handleManufacturerSelect(null)}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md ${
              selectedManufacturerSlug === null
                ? 'font-bold text-navy-900 bg-slate-light'
                : 'text-charcoal-600 hover:bg-slate-light'
            }`}
          >
            All Brands
          </button>
          {manufacturers.map((m) => {
            const isSelected = selectedManufacturerSlug === m.slug;
            return (
              <button
                key={m.id}
                onClick={() => handleManufacturerSelect(isSelected ? null : m.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md ${
                  isSelected
                    ? 'font-bold text-industrial-orange bg-industrial-orange-light'
                    : 'text-charcoal-600 hover:bg-slate-light'
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] text-slate-muted">{m.country}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Status Filter */}
      <div className="pt-4 border-t border-slate-border">
        <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
          Factory Availability
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { value: 'InStock', label: 'In Stock (Immediate Dispatch)' },
            { value: 'AvailableToOrder', label: 'Available to Order' },
            { value: 'ManufacturingLeadTime', label: 'Custom Production Lead Time' },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer text-charcoal-700 hover:text-navy-900"
            >
              <input
                type="radio"
                name="availability"
                checked={selectedAvailability === opt.value}
                onChange={() => {
                  dispatch(
                    setSelectedAvailability(
                      selectedAvailability === opt.value ? null : (opt.value as any)
                    )
                  );
                  if (onFilterChange) onFilterChange();
                }}
                className="text-industrial-orange focus:ring-industrial-orange"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;

