import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, FileSpreadsheet, ArrowRight, MessageSquare, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { addToCompare } from '@/features/compare/compareSlice';
import { AvailabilityBadge, ConditionBadge } from '../common/Badge';
import Button from '../common/Button';
import { handleImageError } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const dispatch = useAppDispatch();
  const compareItems = useAppSelector((state) => state.compare.items);
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);

  const isInCompare = compareItems.some((p) => p.id === product.id);
  const isInBasket = rfqItems.some((it) => it.productId === product.id);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello WoodTech Solutions, I am interested in technical specs and pricing for: ${product.name} (Model: ${product.modelNumber}).`
    );
    window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
  };

  // Render top 3 dynamic specifications as compact pills
  const specEntries = Object.entries(product.specifications || {}).slice(0, 3);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-slate-border hover:border-charcoal-700/40 hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col md:flex-row group">
        {/* Left: Image */}
        <Link
          to={`/products/${product.slug}`}
          className="relative md:w-72 h-56 md:h-auto bg-surface-offwhite shrink-0 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-border"
        >
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <AvailabilityBadge status={product.availabilityStatus} />
          </div>
        </Link>

        {/* Center: Details */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-industrial-orange uppercase tracking-wider">
                {product.modelNumber}
              </span>
              <span className="text-xs text-slate-muted font-medium">
                {product.manufacturerName}
              </span>
            </div>

            <Link
              to={`/products/${product.slug}`}
              className="text-lg font-bold text-navy-900 group-hover:text-industrial-orange transition-colors line-clamp-1"
            >
              {product.name}
            </Link>

            <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Dynamic Specs Bar */}
            {specEntries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {specEntries.map(([key, val]) => (
                  <div
                    key={key}
                    className="text-xs bg-surface-offwhite border border-slate-border px-2.5 py-1 rounded text-charcoal-700"
                  >
                    <span className="text-slate-muted capitalize font-normal">
                      {key.replace(/_/g, ' ')}:{' '}
                    </span>
                    <span className="font-semibold text-navy-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(addToCompare(product))}
                className={`p-2 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isInCompare
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-charcoal-700 border-slate-border hover:bg-slate-light'
                }`}
                title={isInCompare ? 'In Comparison Matrix' : 'Add to Compare'}
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">{isInCompare ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="WhatsApp Inquiry"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/products/${product.slug}`}
                className="px-3 py-2 text-xs font-semibold text-charcoal-700 hover:text-navy-900 hover:bg-slate-light rounded-md flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Specs</span>
              </Link>

              <Button
                variant={isInBasket ? 'secondary' : 'primary'}
                size="sm"
                icon={isInBasket ? <Check className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                onClick={() => dispatch(addToBasket({ product }))}
              >
                {isInBasket ? 'Added to RFQ' : 'Add to RFQ'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode
  return (
    <div className="bg-white rounded-lg border border-slate-border hover:border-charcoal-700/30 hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image Banner */}
      <div className="relative aspect-4/3 bg-surface-offwhite overflow-hidden border-b border-slate-border">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <AvailabilityBadge status={product.availabilityStatus} />
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={() => dispatch(addToCompare(product))}
            className={`p-2 rounded-full shadow-sm transition-colors ${
              isInCompare
                ? 'bg-navy-900 text-white'
                : 'bg-white/90 text-charcoal-700 hover:bg-white hover:text-navy-900'
            }`}
            title="Add to Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-industrial-orange uppercase tracking-wider">
              {product.modelNumber}
            </span>
            <span className="text-[11px] text-slate-muted font-medium truncate">
              {product.manufacturerName}
            </span>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-base font-bold text-navy-900 group-hover:text-industrial-orange transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Dynamic Specifications Preview */}
          {specEntries.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-slate-border/70 text-[11px]">
              {specEntries.slice(0, 2).map(([key, val]) => (
                <div key={key} className="bg-surface-offwhite p-1.5 rounded border border-slate-border/50">
                  <span className="text-slate-muted block capitalize text-[10px]">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-semibold text-navy-900 truncate block">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 mt-4 border-t border-slate-border flex items-center justify-between gap-2">
          <button
            onClick={handleWhatsApp}
            className="p-2 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Quick WhatsApp Inquiry"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/products/${product.slug}`}
              className="p-2 text-charcoal-700 hover:text-navy-900 hover:bg-slate-light rounded transition-colors"
              title="View full specs"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <Button
              variant={isInBasket ? 'secondary' : 'primary'}
              size="sm"
              icon={isInBasket ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
              onClick={() => dispatch(addToBasket({ product }))}
              className="text-xs font-semibold px-3"
            >
              {isInBasket ? 'In RFQ' : 'Add to RFQ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

