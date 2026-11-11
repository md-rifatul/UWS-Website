import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  UserCheck,
  CheckCircle,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { RFQ, RFQStatus } from '@/types';
import { RfqStatusBadge } from '@/components/common/Badge';
import Button from '@/components/common/Button';

export const AdminRfqsPage: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [loading, setLoading] = useState(true);

  // Status & Note update form inside modal
  const [newStatus, setNewStatus] = useState<RFQStatus>('UnderReview');
  const [salesAssignee, setSalesAssignee] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const list = await adminService.getAdminRfqs();
      setRfqs(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const handleOpenDetails = (rfq: RFQ) => {
    setSelectedRfq(rfq);
    setNewStatus(rfq.status);
    setSalesAssignee(rfq.assignedToUserName || 'Kazi Farhan (Senior Sales Director)');
    setInternalNoteText('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedRfq) return;
    const updated = await adminService.updateRfqStatus(
      selectedRfq.id,
      newStatus,
      internalNoteText.trim() || undefined
    );
    if (salesAssignee && salesAssignee !== selectedRfq.assignedToUserName) {
      await adminService.assignRfq(selectedRfq.id, salesAssignee);
      updated.assignedToUserName = salesAssignee;
    }
    setRfqs(rfqs.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRfq(updated);
    setInternalNoteText('');
    alert('RFQ commercial status and internal notes saved successfully.');
  };

  const filteredRfqs = rfqs.filter((r) => {
    const matchesSearch =
      !search ||
      r.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.contactName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-industrial-orange">
            Commercial Workflows
          </span>
          <h1 className="text-2xl font-extrabold text-navy-900 mt-0.5">RFQ Pipeline & Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review B2B machinery requests, assign sales reps, track proforma quotations, and log engineering notes.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by RFQ reference number, company, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 placeholder-slate-400 focus:outline-none focus:border-industrial-orange"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 bg-white border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
        >
          <option value="">All Statuses ({rfqs.length})</option>
          <option value="Pending">Pending</option>
          <option value="UnderReview">Under Review</option>
          <option value="Assigned">Assigned</option>
          <option value="QuotationSent">Quotation Sent</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* RFQ List Table */}
      <div className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-offwhite border-b border-slate-border text-slate-muted uppercase tracking-wider">
                <th className="py-3 px-4">RFQ Reference</th>
                <th className="py-3 px-4">Company & Location</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Machines</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {filteredRfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-navy-900">
                    {rfq.referenceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-navy-900 block truncate max-w-xs">
                      {rfq.companyName}
                    </span>
                    <span className="text-slate-400 text-[10px] block">{rfq.city}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-charcoal-800 block">{rfq.contactName}</span>
                    <span className="text-slate-400 text-[10px] block">{rfq.phone}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-navy-900">
                    {rfq.items.reduce((s, it) => s + it.quantity, 0)} Units ({rfq.items.length} Models)
                  </td>
                  <td className="py-3 px-4">
                    <RfqStatusBadge status={rfq.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {rfq.assignedToUserName || (
                      <span className="text-amber-600 italic font-medium">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(rfq)}
                      className="text-xs"
                    >
                      Inspect RFQ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFQ Detail & Management Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-border flex items-center justify-between bg-navy-950 text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-industrial-orange" />
                <div>
                  <h3 className="font-bold text-sm">RFQ Details: {selectedRfq.referenceNumber}</h3>
                  <span className="text-xs text-slate-400">
                    Logged on {new Date(selectedRfq.createdAtUtc).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Buyer Information Grid */}
              <div className="p-4 bg-surface-offwhite rounded-lg border border-slate-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Company
                  </span>
                  <span className="font-bold text-navy-900 text-sm">{selectedRfq.companyName}</span>
                </div>
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Contact Person
                  </span>
                  <span className="font-semibold text-navy-900">{selectedRfq.contactName}</span>
                </div>
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Phone
                  </span>
                  <span className="font-mono text-navy-900">{selectedRfq.phone}</span>
                </div>
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Corporate Email
                  </span>
                  <span className="font-medium text-navy-900">{selectedRfq.email}</span>
                </div>
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Location / City
                  </span>
                  <span className="font-medium text-navy-900">{selectedRfq.city}</span>
                </div>
                <div>
                  <span className="block text-slate-muted uppercase font-semibold text-[10px]">
                    Target Commissioning
                  </span>
                  <span className="font-medium text-navy-900">
                    {selectedRfq.targetDeliveryDate || 'Standard Schedule'}
                  </span>
                </div>
              </div>

              {/* Machinery Requested List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-700">
                  Requested Machinery Items ({selectedRfq.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedRfq.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-border rounded-lg flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-industrial-orange uppercase">
                          {it.product?.modelNumber || 'EQUIPMENT'}
                        </span>
                        <h5 className="font-bold text-xs text-navy-900">{it.product?.name}</h5>
                        {it.customRequirements && (
                          <p className="text-[11px] text-slate-600 bg-surface-offwhite p-1.5 rounded border border-slate-border/50">
                            <strong>Custom Requirements:</strong> {it.customRequirements}
                          </p>
                        )}
                      </div>
                      <span className="font-extrabold text-navy-900 text-sm bg-slate-light px-2.5 py-1 rounded shrink-0">
                        {it.quantity} {it.quantity === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Management Controls: Status, Assignee, Internal Notes */}
              <div className="pt-4 border-t border-slate-border space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-700">
                  Commercial Processing & Notes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                      Update Commercial Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as RFQStatus)}
                      className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="UnderReview">Under Review</option>
                      <option value="Assigned">Assigned to Sales</option>
                      <option value="QuotationSent">Quotation Sent to Client</option>
                      <option value="Approved">Approved by Client</option>
                      <option value="Completed">Completed / Delivered</option>
                      <option value="Rejected">Declined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                      Assign Sales Director
                    </label>
                    <select
                      value={salesAssignee}
                      onChange={(e) => setSalesAssignee(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                    >
                      <option value="Kazi Farhan (Senior Sales Director)">
                        Kazi Farhan (Senior Sales Director)
                      </option>
                      <option value="Tanvir Ahmed (Machinery Solutions Manager)">
                        Tanvir Ahmed (Machinery Solutions Manager)
                      </option>
                      <option value="Sharif Hossain (Technical Automation Lead)">
                        Sharif Hossain (Technical Automation Lead)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-700 uppercase mb-1">
                    Log Internal Sales / Engineering Note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sent proforma quote via email; factory power grid inspected and confirmed 380V 3-phase..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="w-full text-xs p-2.5 bg-surface-offwhite border border-slate-border rounded-md text-charcoal-800 focus:outline-none focus:border-industrial-orange"
                  />
                </div>

                {selectedRfq.adminNotes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                    <span className="font-semibold block text-[10px] uppercase text-slate-500 mb-1">
                      Historical Internal Notes:
                    </span>
                    <pre className="whitespace-pre-wrap font-sans text-xs">
                      {selectedRfq.adminNotes}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-border flex items-center justify-end gap-3 bg-surface-offwhite">
              <Button variant="outline" size="md" onClick={() => setSelectedRfq(null)}>
                Close
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdateStatus} className="font-semibold">
                Save Status & Notes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRfqsPage;

