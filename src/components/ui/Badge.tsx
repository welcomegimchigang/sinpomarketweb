import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'amber' | 'navy' | 'slate' | 'outline' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    orange: 'bg-orange-100 text-orange-800 border-orange-200/70',
    amber: 'bg-amber-100 text-amber-900 border-amber-200/80',
    navy: 'bg-slate-900 text-slate-100 border-slate-700',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-orange-600 border-orange-300',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs md:text-sm px-3 py-1 font-semibold',
    lg: 'text-sm md:text-base px-4 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
