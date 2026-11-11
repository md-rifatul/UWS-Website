import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid,
  List,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PackageOpen,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
  setViewMode,
  setSelectedCategory,
  resetFilters,
  setSortBy,
} from '@/features/catalog/catalogSlice';
import { catalogService } from '@/services/catalogService';
import { Category, Manufacturer, PaginatedResult, Product } from '@/types';
import ProductCard from '@/components/catalog/ProductCard';
import ProductFilterSidebar from '@/components/catalog/ProductFilterSidebar';
import Button from '@/components/common/Button';

export const CatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [productsData, setProductsData] = useState<PaginatedResult<Product>>({
    items: [],
    pageNumber: 1,
    pageSize: 9,
    totalCount: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    searchQuery,
    selectedCategorySlug,
    selectedManufacturerSlug,
    selectedAvailability,
    selectedCondition,
    selectedSpecs,
    sortBy,
    viewMode,
  } = useAppSelector((state) => state.catalog);

  // Sync URL category query param on initial load
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      dispatch(setSelectedCategory(urlCategory));
    }
  }, [searchParams, dispatch]);

  // Load categories and manufacturers once
  useEffect(() => {
    const loadMetadata = async () => {
      const [cats, mans] = await Promise.all([
        catalogService.getCategories(),
        catalogService.getManufacturers(),
      ]);
      setCategories(cats);
      setManufacturers(mans);
    };
    loadMetadata();
  }, []);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const res = await catalogService.getProducts({
          page: currentPage,
          pageSize: 9,
          search: searchQuery,
          categorySlug: selectedCategorySlug || undefined,
          manufacturerSlug: selectedManufacturerSlug || undefined,
          availability: selectedAvailability || undefined,
          condition: selectedCondition || undefined,
          specs: selectedSpecs,
          sortBy,
        });
        setProductsData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    currentPage,
    searchQuery,
    selectedCategorySlug,
    selectedManufacturerSlug,
    selectedAvailability,
    selectedCondition,
    selectedSpecs,
    sortBy,
  ]);

  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="bg-surface-offwhite min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-slate-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
              {activeCategory ? activeCategory.name : 'Complete Equipment Lineup'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Industrial Machinery Catalog
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Showing {productsData.totalCount} high-precision machinery systems ready for factory deployment.
            </p>
          </div>

          {/* Controls: View Mode & Sorting */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-border rounded-md text-xs font-medium text-charcoal-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-industrial-orange" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="text-xs bg-white border border-slate-border rounded-md px-3 py-2 text-charcoal-800 focus:outline-none focus:border-industrial-orange shadow-2xs"
            >
              <option value="newest">Sort: Latest Additions</option>
              <option value="views">Sort: Most Popular</option>
              <option value="name_asc">Sort: Name (A - Z)</option>
              <option value="name_desc">Sort: Name (Z - A)</option>
            </select>

            {/* Grid / List Switcher */}
            <div className="hidden sm:flex items-center border border-slate-border rounded-md bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => dispatch(setViewMode('grid'))}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-muted hover:text-navy-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setViewMode('list'))}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-muted hover:text-navy-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category-Based Horizontal Navigation Bar */}
        <div className="bg-white rounded-xl border border-slate-border p-3 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => {
                dispatch(setSelectedCategory(null));
                setCurrentPage(1);
              }}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !selectedCategorySlug
                  ? 'bg-industrial-orange text-white shadow-xs'
                  : 'bg-surface-offwhite hover:bg-slate-100 text-charcoal-700 border border-slate-200'
              }`}
            >
              All Machinery
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  dispatch(setSelectedCategory(cat.slug));
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategorySlug === cat.slug
                    ? 'bg-industrial-orange text-white shadow-xs'
                    : 'bg-surface-offwhite hover:bg-slate-100 text-charcoal-700 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar Filter */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-border p-5 sticky top-24 shadow-2xs">
              <ProductFilterSidebar
                categories={categories}
                manufacturers={manufacturers}
                onFilterChange={() => setCurrentPage(1)}
              />
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Filters Bar */}
            {(selectedCategorySlug ||
              selectedManufacturerSlug ||
              searchQuery ||
              selectedAvailability ||
              Object.keys(selectedSpecs).length > 0) && (
              <div className="flex items-center flex-wrap gap-2 p-3 bg-white border border-slate-border rounded-lg text-xs">
                <span className="font-semibold text-charcoal-700">Active Filters:</span>
                {selectedCategorySlug && (
                  <span className="inline-flex items-center gap-1 bg-industrial-orange/15 text-industrial-orange-dark font-medium px-2 py-0.5 rounded">
                    Category: {activeCategory?.name || selectedCategorySlug}
                    <button
                      onClick={() => dispatch(setSelectedCategory(null))}
                      className="hover:text-charcoal-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-slate-light text-navy-900 font-medium px-2 py-0.5 rounded">
                    Query: "{searchQuery}"
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="hover:text-charcoal-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="text-xs text-red-600 hover:underline font-medium ml-auto"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Container */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-industrial-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-muted">Loading equipment models...</p>
              </div>
            ) : productsData.items.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-border p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-surface-offwhite rounded-full flex items-center justify-center mx-auto text-slate-muted">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-navy-900">No machinery matching your filter criteria</h3>
                  <p className="text-xs text-slate-muted max-w-md mx-auto">
                    Try relaxing your dynamic specification filters, searching for a general keyword, or reset all filters.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => dispatch(resetFilters())}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {productsData.items.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {productsData.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-border bg-white p-4 rounded-lg">
                <span className="text-xs text-slate-muted">
                  Page <span className="font-semibold text-navy-900">{productsData.pageNumber}</span> of{' '}
                  <span className="font-semibold text-navy-900">{productsData.totalPages}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!productsData.hasPreviousPage}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    icon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!productsData.hasNextPage}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Out Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-border mb-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-muted hover:text-navy-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilterSidebar
                categories={categories}
                manufacturers={manufacturers}
                onFilterChange={() => {
                  setCurrentPage(1);
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;

