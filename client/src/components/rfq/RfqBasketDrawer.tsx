import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, Plus, Minus, Layers, FileCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
  removeFromBasket,
  updateQuantity,
  updateRequirements,
  clearBasket,
  setBasketDrawerOpen,
} from '@/features/rfq/rfqBasketSlice';
import Button from '../common/Button';

export const RfqBasketDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, isDrawerOpen } = useAppSelector((state) => state.rfqBasket);
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setBasketDrawerOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-border flex items-center justify-between bg-navy-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-navy-800 rounded-md text-industrial-orange">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight">Quotation Basket (RFQ)</h3>
                <p className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? 'Machine Model' : 'Machine Models'} ({totalCount} units)
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setBasketDrawerOpen(false))}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto bg-surface-offwhite rounded-full flex items-center justify-center text-slate-muted border border-slate-border">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-charcoal-800">Your RFQ basket is empty</h4>
                  <p className="text-xs text-slate-muted max-w-xs mx-auto">
                    Browse our equipment catalog and click "Add to RFQ" to build your custom factory quotation.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    dispatch(setBasketDrawerOpen(false));
                    navigate('/products');
                  }}
                >
                  Explore Equipment Catalog
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3.5 bg-surface-offwhite border border-slate-border rounded-lg space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        item.product?.mainImageUrl ||
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={item.product?.name || 'Machinery'}
                      className="w-18 h-18 object-cover rounded bg-white border border-slate-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[11px] font-semibold text-industrial-orange uppercase tracking-wider truncate">
                          {item.product?.modelNumber || 'EQUIPMENT'}
                        </span>
                        <button
                          onClick={() => dispatch(removeFromBasket(item.productId))}
                          className="text-slate-muted hover:text-red-600 transition-colors"
                          title="Remove from RFQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-xs text-navy-900 line-clamp-2 mt-0.5">
                        {item.product?.name || 'Industrial Equipment'}
                      </h4>
                      <p className="text-[11px] text-slate-muted mt-0.5">
                        {item.product?.categoryName}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Custom requirements */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-border/60">
                    <div className="flex items-center border border-slate-border rounded bg-white">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        className="p-1 hover:bg-slate-light text-charcoal-700 disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-navy-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-1 hover:bg-slate-light text-charcoal-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Add custom spec notes..."
                      value={item.customRequirements || ''}
                      onChange={(e) =>
                        dispatch(
                          updateRequirements({
                            productId: item.productId,
                            notes: e.target.value,
                          })
                        )
                      }
                      className="text-xs px-2.5 py-1 border border-slate-border rounded bg-white text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange w-48"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-border bg-surface-offwhite space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-muted">
                <span>Quotation Format:</span>
                <span className="font-semibold text-navy-900">Formal Proforma / B2B Quote</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => dispatch(clearBasket())}
                  className="text-xs"
                >
                  Clear All
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-semibold"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={() => {
                    dispatch(setBasketDrawerOpen(false));
                    navigate('/request-quote');
                  }}
                >
                  Proceed to RFQ ({totalCount} units)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RfqBasketDrawer;

