import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Layers, Factory, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedManufacturer,
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

  const hasActiveFilters = Boolean(
    selectedCategorySlug ||
    selectedManufacturerSlug ||
    searchQuery ||
    Object.keys(selectedSpecs).length > 0
  );

  const totalProductsCount = categories.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-industrial-orange flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-sm text-navy-950 tracking-tight">
            Filter Machinery
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              dispatch(resetFilters());
              if (onFilterChange) onFilterChange();
            }}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-industrial-orange transition-colors cursor-pointer font-medium"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Search Equipment
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, model..."
            value={searchQuery}
            onChange={(e) => {
              dispatch(setSearchQuery(e.target.value));
              if (onFilterChange) onFilterChange();
            }}
            className="w-full text-xs pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-navy-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-industrial-orange focus:ring-2 focus:ring-industrial-orange/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                dispatch(setSearchQuery(''));
                if (onFilterChange) onFilterChange();
              }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Equipment Category List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Equipment Category</span>
          </label>
        </div>

        <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {/* All Machinery Option */}
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategorySlug === null
                ? 'bg-navy-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100/70 font-medium'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                selectedCategorySlug === null
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {/* Individual Categories */}
          {categories.map((category) => {
            const isSelected = selectedCategorySlug === category.slug;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(isSelected ? null : category.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-industrial-orange text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-navy-950 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <span className="truncate pr-2 text-left">{category.name}</span>
                {category.productCount !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
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
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-industrial-orange uppercase tracking-wider">
              Technical Specifications
            </label>
          </div>

          {filterableAttributes.map((attr) => (
            <div key={attr.id} className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
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
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-navy-950 focus:outline-none focus:bg-white focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange"
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
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-navy-950 focus:outline-none focus:bg-white focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manufacturer / Brand Filter */}
      {manufacturers.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Factory className="w-3.5 h-3.5 text-slate-400" />
            <span>Manufacturer / Brand</span>
          </label>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleManufacturerSelect(null)}
              className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                selectedManufacturerSlug === null
                  ? 'font-bold text-navy-950 bg-slate-100'
                  : 'text-slate-600 hover:text-navy-950 hover:bg-slate-50 font-medium'
              }`}
            >
              All Brands
            </button>
            {manufacturers.map((m) => {
              const isSelected = selectedManufacturerSlug === m.slug;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleManufacturerSelect(isSelected ? null : m.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'font-bold text-industrial-orange bg-orange-50/70 border border-industrial-orange/30'
                      : 'text-slate-600 hover:text-navy-950 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span>{m.name}</span>
                  {m.country && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      {m.country}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilterSidebar;
