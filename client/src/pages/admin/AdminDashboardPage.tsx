import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  FileSpreadsheet,
  Clock,
  TrendingUp,
  Eye,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { adminService, DashboardSummary } from '@/services/adminService';
import { RfqStatusBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await adminService.getDashboardSummary();
        setSummary(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-industrial-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-muted">Loading administrative metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Operations Center
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 mt-0.5">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry across product catalog, client quotations, and specification schemas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/products')}
            icon={<Plus className="w-4 h-4" />}
          >
            Manage Machinery
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/categories')}
            icon={<Layers className="w-4 h-4" />}
          >
            Manage Categories
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => navigate('/admin/products')}
          className="bg-white rounded-xl border border-slate-border p-5 shadow-xs space-y-2 cursor-pointer hover:border-industrial-orange transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">Catalog Models</span>
            <div className="p-2 bg-navy-900/10 text-navy-900 rounded-md">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-navy-900 block">
            {summary?.totalProducts || 0}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Active in public catalog</span>
        </div>

        <div
          onClick={() => navigate('/admin/categories')}
          className="bg-white rounded-xl border border-slate-border p-5 shadow-xs space-y-2 cursor-pointer hover:border-industrial-orange transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">Machine Categories</span>
            <div className="p-2 bg-industrial-orange/15 text-industrial-orange rounded-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-navy-900 block">
            {summary?.totalCategories || 0}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Manage categories &amp; photos</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-border p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">Pending RFQs</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600 block">
            {summary?.pendingRfqs || 0}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Requiring sales assignment</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-border p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">Total RFQ Pipeline</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-navy-900 block font-mono">
            ${(summary?.totalEstimatedPipelineValue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            From {summary?.totalRfqs || 0} commercial inquiries
          </span>
        </div>
      </div>

      {/* Main Grid: Recent RFQs & Top Viewed Machines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent RFQs */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-border pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-industrial-orange" />
              <h3 className="font-bold text-sm text-navy-900 uppercase">Recent RFQ Submissions</h3>
            </div>
            <Link
              to="/admin/rfqs"
              className="text-xs font-semibold text-industrial-orange hover:underline flex items-center gap-1"
            >
              <span>View All Quotes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-border text-slate-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Company & Contact</th>
                  <th className="py-2.5 px-3">Units</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-border">
                {summary?.recentRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-navy-900">
                      {rfq.referenceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-navy-900 block truncate max-w-[180px]">
                        {rfq.companyName}
                      </span>
                      <span className="text-slate-400 block truncate">{rfq.contactName}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-navy-900">
                      {rfq.items.reduce((sum, it) => sum + it.quantity, 0)} Units
                    </td>
                    <td className="py-3 px-3">
                      <RfqStatusBadge status={rfq.status} />
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(rfq.createdAtUtc).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/rfqs"
                        className="text-xs font-semibold text-industrial-orange hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top Viewed Machines */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-border pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-industrial-orange" />
              <h3 className="font-bold text-sm text-navy-900 uppercase">Top Viewed Models</h3>
            </div>
          </div>

          <div className="space-y-3.5">
            {summary?.topViewedProducts.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-light text-navy-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-navy-900 truncate block">{p.name}</span>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">
                      {p.modelNumber}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-industrial-orange shrink-0">
                  {p.viewCount} views
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-border">
            <Link
              to="/admin/products"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-charcoal-700 bg-surface-offwhite hover:bg-slate-light border border-slate-border rounded-md transition-colors"
            >
              <span>Manage Entire Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

