import React from 'react';
import { clsx } from 'clsx';
import { AvailabilityStatus, MachineCondition, RFQStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'navy' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variants = {
    default: 'bg-slate-light text-charcoal-700 border-slate-border',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    navy: 'bg-navy-900/10 text-navy-900 border-navy-900/20 font-semibold',
    orange: 'bg-industrial-orange/10 text-industrial-orange-dark border-industrial-orange/30 font-semibold',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded font-medium border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const AvailabilityBadge: React.FC<{ status: AvailabilityStatus }> = ({ status }) => {
  switch (status) {
    case 'InStock':
      return <Badge variant="success">In Stock</Badge>;
    case 'AvailableToOrder':
      return <Badge variant="info">Available To Order</Badge>;
    case 'ManufacturingLeadTime':
      return <Badge variant="warning">Lead Time 4-6 Wks</Badge>;
    case 'PreOrder':
      return <Badge variant="orange">Pre-Order</Badge>;
    case 'Discontinued':
      return <Badge variant="default">Discontinued</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const ConditionBadge: React.FC<{ condition: MachineCondition }> = ({ condition }) => {
  switch (condition) {
    case 'BrandNew':
      return (
        <span className="text-[11px] font-semibold tracking-wider text-industrial-orange bg-industrial-orange-light px-2 py-0.5 rounded border border-industrial-orange/30">
          BRAND NEW
        </span>
      );
    case 'FactoryRefurbished':
      return (
        <span className="text-[11px] font-semibold tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
          FACTORY REFURBISHED
        </span>
      );
    case 'CertifiedPreOwned':
      return (
        <span className="text-[11px] font-semibold tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          CERTIFIED PRE-OWNED
        </span>
      );
  }
};

export const RfqStatusBadge: React.FC<{ status: RFQStatus }> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant="warning">Pending Review</Badge>;
    case 'UnderReview':
      return <Badge variant="info">Under Review</Badge>;
    case 'Assigned':
      return <Badge variant="navy">Sales Assigned</Badge>;
    case 'QuotationSent':
      return <Badge variant="orange">Quotation Sent</Badge>;
    case 'Approved':
      return <Badge variant="success">Approved</Badge>;
    case 'Rejected':
      return <Badge variant="danger">Declined</Badge>;
    case 'Completed':
      return <Badge variant="success">Completed</Badge>;
  }
};

