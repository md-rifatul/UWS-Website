import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowRight, Check, Package } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { handleImageError } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const dispatch = useAppDispatch();
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);
  const isInBasket = rfqItems.some((it) => it.productId === product.id);

  // List View (Minimal & Clean, Machine Highlighted)
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-industrial-orange/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group select-none">
        {/* Machine Photo - Highlighted Showcase */}
        <Link
          to={`/products/${product.slug}`}
          className="relative sm:w-72 h-52 sm:h-auto bg-gradient-to-b from-[#f8fafc] to-white shrink-0 overflow-hidden flex items-center justify-center p-5 border-b sm:border-b-0 sm:border-r border-slate-100 group-hover:from-white group-hover:to-orange-50/20 transition-all duration-300"
        >
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="max-h-48 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-108 drop-shadow-sm group-hover:drop-shadow-md"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 p-6">
              <Package className="w-10 h-10 mb-1 stroke-1" />
              <span className="text-[11px] text-slate-400 font-medium">No Image</span>
            </div>
          )}
        </Link>

        {/* Minimal Details */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
                {product.categoryName}
              </span>
              {product.manufacturerName && (
                <>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-500 font-medium">
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
              <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {product.subCategory || product.specifications?.subCategory}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <Link
              to={`/products/${product.slug}`}
              className="text-xs font-bold text-navy-900 group-hover:text-industrial-orange transition-colors inline-flex items-center gap-1.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => dispatch(addToBasket({ product }))}
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
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

  // Grid View (Minimal & Clean, Machine Highlighted)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-industrial-orange/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group select-none">
      {/* Machine Photo - Highlighted Showcase Frame */}
      <div className="relative aspect-4/3 bg-gradient-to-b from-[#f8fafc] to-white overflow-hidden flex items-center justify-center p-5 border-b border-slate-100 group-hover:from-white group-hover:to-orange-50/20 transition-all duration-300">
        <Link to={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="max-h-52 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-108 drop-shadow-sm group-hover:drop-shadow-md"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 p-6">
              <Package className="w-12 h-12 mb-1 stroke-1" />
              <span className="text-[11px] text-slate-400 font-medium">No Image Uploaded</span>
            </div>
          )}
        </Link>
      </div>

      {/* Card Content (Clean Title & Category - No SKU, No Stock Badges, Fully Highlighted) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-industrial-orange truncate">
              {product.categoryName}
            </span>
            {(product.subCategory || product.specifications?.subCategory) && (
              <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                {product.subCategory || product.specifications?.subCategory}
              </span>
            )}
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-sm sm:text-base font-bold text-navy-950 group-hover:text-industrial-orange transition-colors block line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
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
