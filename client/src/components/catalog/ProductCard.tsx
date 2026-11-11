import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowRight, Check } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { AvailabilityBadge } from '../common/Badge';
import { handleImageError } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const dispatch = useAppDispatch();
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);
  const isInBasket = rfqItems.some((it) => it.productId === product.id);

  // List View (Minimal & Clean)
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 hover:border-industrial-orange/60 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group select-none">
        {/* Machine Photo */}
        <Link
          to={`/products/${product.slug}`}
          className="relative sm:w-64 h-48 sm:h-auto bg-[#f8fafc] shrink-0 overflow-hidden flex items-center justify-center p-3 border-b sm:border-b-0 sm:border-r border-slate-100"
        >
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute top-2.5 left-2.5">
            <AvailabilityBadge status={product.availabilityStatus} />
          </div>
        </Link>

        {/* Minimal Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-industrial-orange">
                {product.modelNumber}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">
                {product.categoryName}
              </span>
              {product.manufacturerName && (
                <>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-400">
                    {product.manufacturerName}
                  </span>
                </>
              )}
            </div>

            <Link
              to={`/products/${product.slug}`}
              className="text-base sm:text-lg font-bold text-navy-950 group-hover:text-industrial-orange transition-colors block leading-snug"
            >
              {product.name}
            </Link>

            {(product.subCategory || product.specifications?.subCategory) && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {product.subCategory || product.specifications?.subCategory}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <Link
              to={`/products/${product.slug}`}
              className="text-xs font-bold text-navy-900 group-hover:text-industrial-orange transition-colors inline-flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => dispatch(addToBasket({ product }))}
              className={`px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                isInBasket
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-navy-950 hover:bg-industrial-orange text-white shadow-2xs'
              }`}
            >
              {isInBasket ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In RFQ Basket</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Add to RFQ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Ultra Clean & Minimal, No Clutter, Just like Reference)
  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-industrial-orange/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group select-none">
      {/* Machine Photo */}
      <div className="relative aspect-4/3 bg-[#f8fafc] overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
        <Link to={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="max-h-52 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
        <div className="absolute top-2.5 left-2.5">
          <AvailabilityBadge status={product.availabilityStatus} />
        </div>
      </div>

      {/* Card Content (Clean Title, Model & Category Only - No Long Paragraphs) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-industrial-orange">
              {product.modelNumber}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate">
              {product.categoryName}
            </span>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-sm sm:text-base font-bold text-navy-950 group-hover:text-industrial-orange transition-colors block line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {(product.subCategory || product.specifications?.subCategory) && (
            <div className="pt-0.5">
              <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {product.subCategory || product.specifications?.subCategory}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer: View Details & Quick RFQ */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-bold text-navy-900 group-hover:text-industrial-orange transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={() => dispatch(addToBasket({ product }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
              isInBasket
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-navy-950 hover:bg-industrial-orange text-white shadow-2xs'
            }`}
          >
            {isInBasket ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In RFQ</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Add to RFQ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
