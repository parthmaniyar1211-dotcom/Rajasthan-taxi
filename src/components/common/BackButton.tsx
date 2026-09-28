import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { FallbackRoute } from '../../types/navigationTypes';

interface BackButtonProps {
  /** Optional custom label for desktop, e.g. "Back to Bookings" */
  label?: string;
  /** Contextual fallback route if user arrived via direct URL or has empty session stack */
  fallback?: FallbackRoute;
  /** Custom click handler if overriding router navigation */
  onClick?: () => void;
  /** Additional custom classes */
  className?: string;
  /** Variant style */
  variant?: 'subtle' | 'ghost' | 'pill' | 'white';
}

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  fallback,
  onClick,
  className = '',
  variant = 'subtle'
}) => {
  const { goBack, previousRoute } = useNavigation();

  // Determine desktop label: custom prop > fallback label > previous title > default "Back"
  const desktopLabel = label || fallback?.label || (previousRoute ? `Back to ${previousRoute.title}` : 'Back');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      goBack(fallback);
    }
  };

  const variantStyles = {
    subtle: 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-2xs',
    white: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-950',
    pill: 'bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full'
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={desktopLabel}
      className={`group min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform shrink-0" />
      {/* Responsive Text: Full label on desktop (>=1024px), compact "Back" on mobile/tablet */}
      <span className="hidden lg:inline whitespace-nowrap">{desktopLabel}</span>
      <span className="lg:hidden font-medium">Back</span>
    </button>
  );
};
