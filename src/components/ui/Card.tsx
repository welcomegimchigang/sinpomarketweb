import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderAccent?: 'none' | 'orange' | 'amber' | 'navy';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  borderAccent = 'none',
}) => {
  const borderStyles = {
    none: 'border-slate-200/80',
    orange: 'border-orange-200 hover:border-orange-400',
    amber: 'border-amber-200 hover:border-amber-400',
    navy: 'border-slate-300 hover:border-slate-600',
  };

  return (
    <div
      className={`bg-white rounded-2xl border ${borderStyles[borderAccent]} shadow-card transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1.5 hover:shadow-warm' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
