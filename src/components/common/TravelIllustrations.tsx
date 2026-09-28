import React from 'react';

// Royalty-inspired architectural SVG motifs and fleet illustrations
export const RajasthanFortIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="70%" stopColor="#334155" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="sandstone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="60%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="fortDistant" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#451a03" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    {/* Sky & Sun */}
    <rect width="400" height="240" fill="url(#skyGrad)" rx="16" />
    <circle cx="310" cy="70" r="28" fill="#fbbf24" fillOpacity="0.85" />
    <circle cx="310" cy="70" r="42" fill="#fef08a" fillOpacity="0.2" />

    {/* Distant Aravalli Hills */}
    <path d="M-20 180 Q60 110 140 160 T300 130 T420 170 L420 240 L-20 240 Z" fill="#1e1b4b" fillOpacity="0.5" />
    <path d="M30 190 Q120 130 220 175 T390 150 L420 240 L30 240 Z" fill="#312e81" fillOpacity="0.4" />

    {/* Grand Hilltop Fort Ramparts (Mehrangarh / Chittorgarh style) */}
    <path d="M120 140 L120 120 L135 120 L135 140 L150 140 L150 120 L165 120 L165 140 L210 140 L210 110 L230 110 L230 140 L250 140 L250 115 L270 115 L270 140 L290 140 L320 210 L80 210 Z" fill="url(#fortDistant)" />
    
    {/* Main Palace Bastion & Chhatri domes */}
    <path d="M150 120 C150 95 180 95 180 120 Z" fill="#d97706" />
    <path d="M225 110 C225 80 260 80 260 110 Z" fill="#f59e0b" />
    <rect x="240" y="72" width="5" height="10" fill="#fbbf24" />
    <circle cx="242.5" cy="70" r="2.5" fill="#fef08a" />

    {/* Foreground Sandstone Architecture & Arches */}
    <path d="M0 175 L400 175 L400 240 L0 240 Z" fill="#78350f" fillOpacity="0.95" />
    <path d="M0 165 C80 165 140 172 200 170 C280 168 340 162 400 165 L400 180 L0 180 Z" fill="url(#sandstone)" />

    {/* Royal Jharokha Carved Windows */}
    <rect x="160" y="190" width="14" height="26" rx="7" fill="#1e293b" />
    <rect x="220" y="190" width="14" height="26" rx="7" fill="#1e293b" />
    <rect x="280" y="190" width="14" height="26" rx="7" fill="#1e293b" />

    {/* Highway strip in perspective */}
    <path d="M140 240 L170 200 L230 200 L260 240 Z" fill="#0f172a" />
    <line x1="200" y1="202" x2="200" y2="238" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
  </svg>
);

export const UdaipurLakesIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lakeSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="50%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="lakeWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#lakeSky)" rx="16" />
    <circle cx="80" cy="50" r="18" fill="#fef08a" fillOpacity="0.9" />

    {/* Aravalli range */}
    <path d="M-10 120 Q80 70 180 115 T380 95 L410 140 L-10 140 Z" fill="#1e1b4b" fillOpacity="0.7" />

    {/* Lake Palace Floating in Pichola */}
    <rect x="110" y="112" width="180" height="28" fill="#ffffff" rx="2" />
    <rect x="130" y="98" width="50" height="16" fill="#f8fafc" />
    <path d="M140 98 C140 82 170 82 170 98 Z" fill="#f59e0b" />
    <rect x="220" y="95" width="45" height="18" fill="#f8fafc" />
    <path d="M230 95 C230 80 255 80 255 95 Z" fill="#d97706" />

    {/* Lake Water Surface with Reflections */}
    <rect x="0" y="138" width="400" height="102" fill="url(#lakeWater)" rx="0 0 16 16" />
    <ellipse cx="200" cy="148" rx="80" ry="4" fill="#ffffff" fillOpacity="0.25" />
    <ellipse cx="200" cy="162" rx="65" ry="3" fill="#fef08a" fillOpacity="0.2" />
    <ellipse cx="190" cy="178" rx="45" ry="2" fill="#ffffff" fillOpacity="0.15" />

    {/* Royal Shikara Boat */}
    <path d="M60 175 Q90 178 120 175 L115 182 L65 182 Z" fill="#b45309" />
    <path d="M85 162 L85 175" stroke="#f59e0b" strokeWidth="2" />
    <polygon points="85,162 105,168 85,173" fill="#fbbf24" />
  </svg>
);

export const DesertSafariIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="desertSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="50%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="dune1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id="dune2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#desertSky)" rx="16" />
    <circle cx="200" cy="90" r="32" fill="#fef3c7" fillOpacity="0.9" />

    {/* Desert Dunes */}
    <path d="M-20 140 Q100 110 240 150 T420 130 L420 240 L-20 240 Z" fill="url(#dune2)" />
    <path d="M-20 170 Q140 140 280 180 T420 160 L420 240 L-20 240 Z" fill="url(#dune1)" />

    {/* Camel Caravan Silhouette */}
    <g transform="translate(180, 138) scale(0.65)" fill="#451a03">
      <path d="M20 30 Q25 15 35 20 Q45 25 50 18 Q55 10 65 15 Q75 20 80 35 L80 50 L75 50 L75 35 L60 35 L60 50 L55 50 L55 35 L40 35 L40 50 L35 50 L35 35 Z" />
    </g>
    <g transform="translate(130, 142) scale(0.55)" fill="#451a03">
      <path d="M20 30 Q25 15 35 20 Q45 25 50 18 Q55 10 65 15 Q75 20 80 35 L80 50 L75 50 L75 35 L60 35 L60 50 L55 50 L55 35 L40 35 L40 50 L35 50 L35 35 Z" />
    </g>

    {/* Luxury Swiss Safari Tent */}
    <polygon points="320,185 350,150 380,185" fill="#fef3c7" />
    <polygon points="340,185 350,150 360,185" fill="#b45309" />
  </svg>
);

export const LuxuryCarIllustration: React.FC<{ type?: string; className?: string }> = ({ type = "SUV", className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    {/* Road ground shadow */}
    <ellipse cx="160" cy="140" rx="140" ry="10" fill="#0f172a" fillOpacity="0.15" />

    {/* Car Profile Body */}
    <path
      d={
        type === 'SEDAN'
          ? "M25 110 L50 85 L110 82 L150 55 L230 55 L270 85 L300 95 L300 115 L275 115 C275 105 255 105 255 115 L105 115 C105 105 85 105 85 115 L25 115 Z"
          : "M20 112 L45 80 L110 75 L140 45 L260 45 L295 75 L305 95 L305 118 L275 118 C275 102 250 102 250 118 L110 118 C110 102 85 102 85 118 L20 118 Z"
      }
      fill="url(#carBodyGrad)"
      stroke="#94a3b8"
      strokeWidth="2"
    />

    {/* Windows */}
    <path
      d={
        type === 'SEDAN'
          ? "M115 82 L152 58 L225 58 L255 82 Z"
          : "M115 75 L143 50 L255 50 L280 75 Z"
      }
      fill="url(#glassGrad)"
    />

    {/* Window Pillars */}
    <line x1="185" y1="50" x2="185" y2="78" stroke="#475569" strokeWidth="3" />

    {/* Wheels */}
    <circle cx="95" cy="118" r="20" fill="#1e293b" />
    <circle cx="95" cy="118" r="11" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
    <circle cx="265" cy="118" r="20" fill="#1e293b" />
    <circle cx="265" cy="118" r="11" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

    {/* Headlights & Tail Lights */}
    <path d="M295 85 L305 92 L300 98 Z" fill="#38bdf8" />
    <path d="M20 95 L25 90 L25 102 Z" fill="#ef4444" />

    {/* Commercial Yellow Taxi Number Plate Indicator */}
    <rect x="282" y="105" width="22" height="7" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" rx="1" />
  </svg>
);
