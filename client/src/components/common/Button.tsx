import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary:
      'bg-industrial-orange hover:bg-industrial-orange-hover text-white shadow-sm focus:ring-industrial-orange/50',
    secondary:
      'bg-navy-900 hover:bg-navy-800 text-white shadow-sm focus:ring-navy-900/40',
    outline:
      'border border-slate-border text-charcoal-800 bg-white hover:bg-surface-offwhite hover:border-charcoal-700 focus:ring-charcoal-600/30',
    dark:
      'bg-charcoal-800 hover:bg-charcoal-900 text-white focus:ring-charcoal-700/50',
    ghost:
      'text-charcoal-700 hover:bg-slate-light hover:text-navy-900 focus:ring-navy-900/20',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/40',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;

