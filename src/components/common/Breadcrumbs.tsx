import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '../../types/navigationTypes';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items || items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`hidden sm:flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto py-1 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none" />
            )}
            {isLast || !item.onClick ? (
              <span
                className={`truncate max-w-[200px] ${
                  isLast ? 'font-bold text-slate-900 select-all' : 'text-slate-500'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-amber-800 hover:underline transition truncate max-w-[180px] font-medium text-slate-600 focus:outline-hidden"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
