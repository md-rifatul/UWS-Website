import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
  removeFromBasket,
  updateQuantity,
  updateRequirements,
  clearBasket,
} from '@/features/rfq/rfqBasketSlice';
import { rfqService } from '@/services/rfqService';
import Button from '@/components/common/Button';

export const RfqPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items } = useAppSelector((state) => state.rfqBasket);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form Fields
  const [formData, setFormData] = useState({
    contactName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    industryType: 'Panel & Modular Furniture',
    city: 'Dhaka',
    country: 'Bangladesh',
    targetDeliveryDate: '',
    estimatedBudget: '',
    clientNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    rfq: any;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Please add at least one machinery model to your RFQ before submitting.');
      return;
    }

    if (!formData.contactName || !formData.email || !formData.phone || !formData.companyName) {
      setErrorMessage('Please complete all mandatory corporate contact fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await rfqService.submitRfq({
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        industryType: formData.industryType,
        city: formData.city,
        country: formData.country,
        targetDeliveryDate: formData.targetDeliveryDate || undefined,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined,
        clientNotes: formData.clientNotes,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          customRequirements: it.customRequirements,
          selectedConfigurations: it.selectedConfigurations,
        })),
      });

      if (result.success) {
        setSubmissionSuccess({
          referenceNumber: result.referenceNumber,
          rfq: result.rfq,
        });
        dispatch(clearBasket());
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to submit quote request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If RFQ successfully submitted:
  if (submissionSuccess) {
    return (
      <div className="bg-surface-offwhite min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Quotation Request Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-2">
              Thank You! Your RFQ has been logged.
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Our Senior Machinery Application Engineers will review your machine specifications and
              furnish a formal proforma quotation and delivery schedule.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-border rounded-xl shadow-xs text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-border">
              <span className="text-xs text-slate-muted uppercase font-semibold">
                RFQ Reference Number:
              </span>
              <span className="text-base font-extrabold text-industrial-orange font-mono">
                {submissionSuccess.referenceNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <span className="block text-slate-muted">Company Name:</span>
                <span className="font-semibold text-navy-900">{formData.companyName}</span>
              </div>
              <div>
                <span className="block text-slate-muted">Representative:</span>
                <span className="font-semibold text-navy-900">{formData.contactName}</span>
              </div>
              <div>
                <span className="block text-slate-muted">Contact Phone:</span>
                <span className="font-semibold text-navy-900">{formData.phone}</span>
              </div>
              <div>
                <span className="block text-slate-muted">Corporate Email:</span>
                <span className="font-semibold text-navy-900">{formData.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-border text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-industrial-orange shrink-0" />
              <span>Standard commercial response time: Within 24 business hours.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button variant="primary" onClick={() => navigate('/products')}>
              Return to Catalog
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const text = encodeURIComponent(
                  `Hello WoodTech Solutions, I have submitted RFQ Reference: ${submissionSuccess.referenceNumber} for ${formData.companyName}. Looking forward to discussing details.`
                );
                window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
              }}
            >
              Direct WhatsApp Follow-up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-border pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
            Commercial Procurement
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Request for Official Quotation (RFQ)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review your selected machinery units, configure electrical and tooling parameters, and submit your enterprise procurement request.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Configured Machinery Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-border">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-industrial-orange" />
                  <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wide">
                    Configured Machinery Models ({items.length})
                  </h3>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch(clearBasket())}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-sm text-slate-muted">Your RFQ basket currently has 0 machines.</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/products')}
                  >
                    Browse Equipment Catalog
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 rounded-lg border border-slate-border bg-surface-offwhite space-y-3"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            item.product?.mainImageUrl ||
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={item.product?.name || 'Machine'}
                          className="w-20 h-20 object-cover rounded bg-white border border-slate-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <span className="text-[11px] font-bold text-industrial-orange uppercase tracking-wider truncate">
                              {item.product?.modelNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => dispatch(removeFromBasket(item.productId))}
                              className="text-slate-muted hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="font-bold text-sm text-navy-900 line-clamp-1 mt-0.5">
                            {item.product?.name}
                          </h4>
                          <p className="text-xs text-slate-muted mt-0.5">
                            {item.product?.categoryName} • {item.product?.manufacturerName}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Notes Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-border/60 items-center">
                        <div className="sm:col-span-4 flex items-center gap-2">
                          <span className="text-xs text-slate-muted">Quantity:</span>
                          <div className="flex items-center border border-slate-border rounded bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.productId,
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                )
                              }
                              className="px-2.5 py-1 text-xs text-charcoal-700 hover:bg-slate-light"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-navy-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.productId,
                                    quantity: item.quantity + 1,
                                  })
                                )
                              }
                              className="px-2.5 py-1 text-xs text-charcoal-700 hover:bg-slate-light"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-8">
                          <input
                            type="text"
                            placeholder="Specific voltage, tooling sets, or optional units..."
                            value={item.customRequirements || ''}
                            onChange={(e) =>
                              dispatch(
                                updateRequirements({
                                  productId: item.productId,
                                  notes: e.target.value,
                                })
                              )
                            }
                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-border rounded text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Project Requirements */}
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wide">
                Project Scope & Delivery Timelines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Target Factory Commissioning Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.targetDeliveryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, targetDeliveryDate: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Estimated Machinery Budget (USD, Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={formData.estimatedBudget}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedBudget: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  General Factory Scope & Additional Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail any factory facility limitations, electrical power capacity, ceiling heights, or existing machines you need to integrate with..."
                  value={formData.clientNotes}
                  onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
                  className="w-full text-xs p-3 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Customer Information & Submission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-5 sticky top-24">
              <div className="border-b border-slate-border pb-3">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wide">
                  Corporate Buyer Information
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Proforma quotes are issued directly to certified corporate accounts.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Company / Factory Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Woodcraft Industries Ltd."
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                    Contact Person & Designation *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Tariqul Islam (GM Operations)"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({ ...formData, contactName: e.target.value })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Official Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+880 1711-000000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Corporate Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="buyer@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Factory Location / City *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Gazipur / Chittagong"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                      Industry Segment
                    </label>
                    <select
                      value={formData.industryType}
                      onChange={(e) =>
                        setFormData({ ...formData, industryType: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    >
                      <option value="Panel & Modular Furniture">Panel & Modular Furniture</option>
                      <option value="Solid Wood & Engineered Doors">Solid Wood & Doors</option>
                      <option value="Architectural Millwork">Architectural Millwork</option>
                      <option value="Kitchen & Bathroom Cabinetry">Kitchen & Bath Cabinets</option>
                      <option value="Commercial Turnkey Project">Commercial Turnkey</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-lg text-sm"
                  isLoading={isSubmitting}
                  disabled={items.length === 0}
                  icon={<FileSpreadsheet className="w-5 h-5" />}
                >
                  Submit Official RFQ Proposal
                </Button>
              </div>

              <div className="p-3 bg-surface-offwhite rounded-md border border-slate-border text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 text-navy-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enterprise Guarantee</span>
                </div>
                <p>
                  Your quotation data is kept strictly confidential. No obligations prior to formal contract signing.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RfqPage;

