import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  FileSpreadsheet,
  Download,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Truck,
  Wrench,
  ChevronRight,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { catalogService } from '@/services/catalogService';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addToBasket } from '@/features/rfq/rfqBasketSlice';
import { addToCompare } from '@/features/compare/compareSlice';
import { AvailabilityBadge, ConditionBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { handleImageError } from '@/utils/imageUtils';
import ProductCard from '@/components/catalog/ProductCard';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912580072').replace(/[^0-9]/g, '');
  const normalizedWhatsApp = rawWhatsApp.startsWith('880') ? rawWhatsApp : rawWhatsApp.startsWith('0') ? `88${rawWhatsApp}` : `880${rawWhatsApp}`;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const compareItems = useAppSelector((state) => state.compare.items);
  const rfqItems = useAppSelector((state) => state.rfqBasket.items);

  useEffect(() => {
    const loadProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await catalogService.getProductBySlug(slug);
        setProduct(p);
        if (p) {
          setActiveImage(p.mainImageUrl);
          // Load related products from same category
          const related = await catalogService.getProducts({
            categorySlug: p.categorySlug,
            pageSize: 3,
          });
          setRelatedProducts(related.items.filter((item) => item.id !== p.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-10 h-10 border-4 border-industrial-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-muted">Loading technical machinery specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Machine Model Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested industrial machinery model may have been relocated or updated in our catalog.
        </p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Return to Equipment Catalog
        </Button>
      </div>
    );
  }

  const isInCompare = compareItems.some((item) => item.id === product.id);
  const isInBasket = rfqItems.some((item) => item.productId === product.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const brand = siteSettings.logo_title || 'Unique Wood Solution';
    const text = encodeURIComponent(
      `Hello ${brand}, I am reviewing machine specifications for ${product.name} (Model: ${product.modelNumber || ''}). Please provide commercial quotation and delivery lead time.`
    );
    window.open(`https://wa.me/${normalizedWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-surface-offwhite min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-muted">
          <Link to="/" className="hover:text-navy-900">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-navy-900">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-navy-900">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-navy-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Grid: Gallery & Buying Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-white border border-slate-border shadow-xs">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <AvailabilityBadge status={product.availabilityStatus} />
                <ConditionBadge condition={product.condition} />
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img.imageUrl
                        ? 'border-industrial-orange shadow-md'
                        : 'border-slate-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="bg-white rounded-lg border border-slate-border p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>1-Year Comprehensive Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-industrial-orange shrink-0" />
                <span>Onsite Commissioning & Testing</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-navy-900 shrink-0" />
                <span>Nationwide Secure Transport</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & RFQ Builder Box */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
                  MODEL: {product.modelNumber}
                </span>
                <span className="text-xs text-slate-muted">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                <span>
                  Manufacturer:{' '}
                  <strong className="text-navy-900 font-semibold">{product.manufacturerName}</strong>
                </span>
                <span>•</span>
                <span>
                  Views: <strong className="text-navy-900 font-semibold">{product.viewCount}</strong>
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* RFQ Action Box */}
            <div className="bg-white rounded-xl border border-slate-border p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-border pb-3">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Industrial Quotation (RFQ)
                </span>
                <span className="text-xs text-emerald-600 font-medium">Proforma Pricing</span>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                  Required Units / Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-border rounded-md bg-surface-offwhite">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-charcoal-700 hover:bg-slate-light text-sm font-bold disabled:opacity-40"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-navy-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-charcoal-700 hover:bg-slate-light text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-muted">
                    Includes factory pre-shipment inspection
                  </span>
                </div>
              </div>

              {/* Custom Technical Requirements */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                  Custom Voltage / Tooling Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., 380V 3-Phase 50Hz, Include extra 12-piece cutter set, etc."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange"
                />
              </div>

              {/* Primary Buttons */}
              <div className="space-y-2.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-md"
                  icon={isInBasket ? <Check className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                  onClick={() => {
                    dispatch(
                      addToBasket({
                        product,
                        quantity,
                        customRequirements: customNotes,
                      })
                    );
                  }}
                >
                  {isInBasket ? `Add More (${quantity} Units) to RFQ` : 'Add Machine to RFQ Basket'}
                </Button>

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant={isInCompare ? 'dark' : 'outline'}
                    size="md"
                    icon={<Scale className="w-4 h-4" />}
                    onClick={() => dispatch(addToCompare(product))}
                    className="text-xs font-semibold"
                  >
                    {isInCompare ? 'Comparing' : 'Add to Compare'}
                  </Button>

                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-md text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Desk</span>
                  </button>
                </div>
              </div>

              {/* Share & Brochure */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-border text-xs text-slate-muted">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 hover:text-navy-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Specs'}</span>
                </button>

                <a
                  href="#brochure"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Official technical PDF specification brochure has been queued for download.');
                  }}
                  className="inline-flex items-center gap-1 text-industrial-orange hover:text-industrial-orange-hover font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Spec Sheet (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Technical Specifications Matrix (PostgreSQL JSONB View) */}
        <div className="bg-white rounded-xl border border-slate-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
              Verified Technical Parameters
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mt-1">
              Engineering Specifications
            </h2>
            <p className="text-xs text-slate-muted mt-1">
              Dynamically mapped to factory standards and industrial tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {Object.entries(product.specifications || {}).map(([key, val], index) => (
              <div
                key={key}
                className="flex items-center justify-between py-2.5 border-b border-slate-border/70 text-xs sm:text-sm"
              >
                <span className="text-slate-600 font-medium capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-bold text-navy-900 text-right">
                  {typeof val === 'boolean' ? (val ? 'Yes / Integrated' : 'No') : String(val)}
                </span>
              </div>
            ))}
          </div>

          {/* Full Engineering Description & Scope */}
          <div className="pt-6 border-t border-slate-border space-y-3">
            <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wide">
              Detailed Mechanical & Electrical Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Related Machinery Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
                  Complementary Solutions
                </span>
                <h3 className="text-xl font-bold text-navy-900">
                  Related Equipment in {product.categoryName}
                </h3>
              </div>
              <Link
                to={`/products?category=${product.categorySlug}`}
                className="text-xs font-semibold text-industrial-orange hover:underline"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

