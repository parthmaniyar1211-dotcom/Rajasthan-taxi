import React from 'react';
import { BackButton } from './BackButton';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem, FallbackRoute } from '../../types/navigationTypes';
import { useNavigation } from '../../context/NavigationContext';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  showBack?: boolean;
  backLabel?: string;
  backFallback?: FallbackRoute;
  onBack?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  showBack = true,
  backLabel,
  backFallback,
  onBack,
  breadcrumbs,
  actions,
  className = ''
}) => {
  const { getBreadcrumbs } = useNavigation();
  const activeBreadcrumbs = breadcrumbs || getBreadcrumbs();

  return (
    <div className={`space-y-3 pb-4 border-b border-slate-200/90 ${className}`}>
      {/* Top Row: Breadcrumbs on desktop */}
      {activeBreadcrumbs && activeBreadcrumbs.length > 1 && (
        <Breadcrumbs items={activeBreadcrumbs} />
      )}

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <div className="shrink-0">
              <BackButton
                label={backLabel}
                fallback={backFallback}
                onClick={onBack}
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>

            {subtitle && (
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
