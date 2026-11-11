import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Trash2,
  FileSpreadsheet,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { removeFromCompare, clearCompare } from '@/features/compare/compareSlice';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { AvailabilityBadge, ConditionBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';

export const ComparePage: React.FC = () => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items } = useAppSelector((state) => state.compare);
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);

  // Collect the union of all specification keys across all compared machines
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specifications || {})))
  );

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-border pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
              Technical Due Diligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Machinery Specification Matrix
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Side-by-side comparison of technical capacity, motors, controllers, and tolerances.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-charcoal-700 cursor-pointer bg-white border border-slate-border px-3 py-2 rounded-md shadow-2xs">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="rounded text-industrial-orange focus:ring-industrial-orange"
                />
                <Sparkles className="w-3.5 h-3.5 text-industrial-orange" />
                <span>Highlight Differences</span>
              </label>

              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(clearCompare())}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Clear Matrix
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-border p-16 text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-surface-offwhite rounded-full flex items-center justify-center mx-auto text-slate-muted border border-slate-border">
              <Scale className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-navy-900">
                No machinery selected for comparison
              </h3>
              <p className="text-xs text-slate-600">
                You can select up to 4 equipment models from our catalog to analyze their technical
                specifications side-by-side.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/products')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Browse Equipment Catalog
            </Button>
          </div>
        ) : (
          /* Comparison Table / Matrix */
          <div className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                {/* Machine Summary Headers */}
                <thead>
                  <tr className="border-b border-slate-border bg-surface-offwhite">
                    <th className="p-4 sm:p-6 w-60 text-xs font-bold uppercase tracking-wider text-charcoal-700 shrink-0">
                      Specification Attribute
                    </th>
                    {items.map((item) => {
                      const inRfq = rfqItems.some((r) => r.productId === item.id);
                      return (
                        <th
                          key={item.id}
                          className="p-4 sm:p-6 min-w-64 max-w-72 align-top border-l border-slate-border"
                        >
                          <div className="space-y-3">
                            <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-white border border-slate-border">
                              <img
                                src={item.mainImageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => dispatch(removeFromCompare(item.id))}
                                className="absolute top-2 right-2 p-1.5 bg-navy-950/80 hover:bg-red-600 text-white rounded-full transition-colors"
                                title="Remove from compare"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-industrial-orange uppercase tracking-wider">
                                {item.modelNumber}
                              </span>
                              <h4 className="font-bold text-xs text-navy-900 line-clamp-2 mt-0.5">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-slate-muted mt-0.5">
                                {item.manufacturerName}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <AvailabilityBadge status={item.availabilityStatus} />
                            </div>

                            <Button
                              variant={inRfq ? 'secondary' : 'primary'}
                              size="sm"
                              className="w-full text-xs font-semibold"
                              icon={inRfq ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                              onClick={() => dispatch(addToBasket({ product: item }))}
                            >
                              {inRfq ? 'In RFQ Basket' : 'Add to RFQ'}
                            </Button>
                          </div>
                        </th>
                      );
                    })}

                    {/* Placeholder slot if under 4 machines */}
                    {items.length < 4 && (
                      <th className="p-6 min-w-64 border-l border-slate-border align-middle text-center bg-slate-50/50">
                        <Link
                          to="/products"
                          className="inline-flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-border rounded-xl text-slate-muted hover:text-industrial-orange hover:border-industrial-orange transition-colors"
                        >
                          <Plus className="w-8 h-8 mb-2" />
                          <span className="text-xs font-semibold">Add Machine Model</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Up to 4 machines
                          </span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Body: Side-by-Side Dynamic Attributes */}
                <tbody className="divide-y divide-slate-border text-xs sm:text-sm">
                  {/* Category Row */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-charcoal-700 bg-surface-offwhite/50">
                      Machinery Category
                    </td>
                    {items.map((item) => (
                      <td key={item.id} className="p-4 border-l border-slate-border font-medium text-navy-900">
                        {item.categoryName}
                      </td>
                    ))}
                    {items.length < 4 && <td className="p-4 border-l border-slate-border bg-slate-50/30" />}
                  </tr>

                  {/* SKU Row */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-charcoal-700 bg-surface-offwhite/50">
                      SKU Reference
                    </td>
                    {items.map((item) => (
                      <td key={item.id} className="p-4 border-l border-slate-border text-slate-600 font-mono text-xs">
                        {item.sku}
                      </td>
                    ))}
                    {items.length < 4 && <td className="p-4 border-l border-slate-border bg-slate-50/30" />}
                  </tr>

                  {/* Dynamic Technical Specifications */}
                  {allSpecKeys.map((key) => {
                    const values = items.map((item) => item.specifications?.[key]);
                    const isDifferent = new Set(values.map((v) => String(v || ''))).size > 1;

                    return (
                      <tr
                        key={key}
                        className={`hover:bg-slate-50 ${
                          highlightDifferences && isDifferent ? 'bg-amber-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="p-4 font-semibold text-charcoal-700 bg-surface-offwhite/50 capitalize">
                          {key.replace(/_/g, ' ')}
                        </td>
                        {items.map((item) => {
                          const val = item.specifications?.[key];
                          return (
                            <td
                              key={item.id}
                              className={`p-4 border-l border-slate-border ${
                                highlightDifferences && isDifferent ? 'text-navy-950 font-bold' : 'text-slate-700'
                              }`}
                            >
                              {val !== undefined ? (
                                typeof val === 'boolean' ? (
                                  val ? (
                                    <span className="text-emerald-700 font-bold">Yes</span>
                                  ) : (
                                    <span className="text-slate-400">No</span>
                                  )
                                ) : (
                                  String(val)
                                )
                              ) : (
                                <span className="text-slate-300 italic">—</span>
                              )}
                            </td>
                          );
                        })}
                        {items.length < 4 && <td className="p-4 border-l border-slate-border bg-slate-50/30" />}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;

