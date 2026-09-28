import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Sparkles, Compass } from 'lucide-react';

export const ThreeDHeroScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const tiltX = isHovered ? -mousePos.y * 10 : 0;
  const tiltY = isHovered ? mousePos.x * 12 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#0d1629] to-[#1a1c29] border border-amber-500/20 shadow-2xl select-none ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Dynamic 3D Scene Root */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        }}
      >
        {/* Layer 1: Desert Golden Hour Sky & Sandstone Fort Backdrop (Depth: -120px) */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `translateZ(-120px) scale(1.15) translate(${mousePos.x * -15}px, ${mousePos.y * -8}px)`
          }}
        >
          {/* Radiant Sun Glow */}
          <div className="absolute top-12 right-16 w-44 h-44 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/20 to-transparent blur-3xl" />
          <div className="absolute top-20 right-28 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-600/80 shadow-[0_0_80px_rgba(245,158,11,0.6)] opacity-90" />

          {/* Rajasthan Mountain & Haveli/Fort Silhouettes */}
          <svg
            viewBox="0 0 1000 360"
            className="absolute bottom-28 w-full opacity-60 text-slate-900 fill-current"
            preserveAspectRatio="none"
          >
            {/* Distant Aravalli Ridges */}
            <path d="M0,260 Q180,180 340,240 T700,200 T1000,250 L1000,360 L0,360 Z" fill="#080d1a" />
            {/* Majestic Fort Ramparts */}
            <path
              d="M120,270 L140,230 L160,230 L160,215 L175,215 L175,230 L195,230 L210,270 L260,270 L275,220 L300,220 L300,270 L480,270 L510,195 L530,195 L530,180 L545,180 L545,195 L565,195 L590,270 L780,270 L800,240 L825,240 L840,270 Z"
              fill="#0d1527"
            />
            {/* Traditional Chhatri / Dome Domes */}
            <circle cx="538" cy="175" r="9" fill="#141f38" />
            <path d="M528,178 Q538,162 548,178 Z" fill="#1e2c4d" />
            <circle cx="168" cy="210" r="7" fill="#141f38" />
            <path d="M160,213 Q168,198 176,213 Z" fill="#1e2c4d" />
          </svg>

          {/* Golden Sand Dunes Floor */}
          <div className="absolute bottom-0 w-full h-44 bg-gradient-to-t from-[#1b1409] via-[#241a0d]/90 to-transparent" />
        </div>

        {/* Layer 2: 3D Receding Rajasthan Highway with Perspective (Depth: -30px) */}
        <div
          className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
          style={{
            transform: `translateZ(-30px) rotateX(48deg) scaleY(1.4)`,
            transformOrigin: 'bottom center'
          }}
        >
          {/* Smooth Asphalt Highway Surface */}
          <div className="w-full h-full bg-gradient-to-b from-[#131b2c] via-[#1a2338] to-[#0f172a] shadow-inner border-t border-amber-500/30 relative overflow-hidden">
            {/* Left & Right Shoulder Markings */}
            <div className="absolute left-6 inset-y-0 w-1 bg-amber-400/40" />
            <div className="absolute right-6 inset-y-0 w-1 bg-amber-400/40" />

            {/* Glowing Highway Dashed Centerline */}
            <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-2 flex flex-col justify-around items-center">
              <span className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              <span className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              <span className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              <span className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>
          </div>
        </div>

        {/* Layer 3: 3D Luxury Cab (Innova Crysta Silhouette / 3D Stylized Car) (Depth: 50px) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[320px] sm:w-[380px] pointer-events-none transition-transform duration-200 ease-out"
          style={{
            transform: `translateZ(60px) translate(${mousePos.x * 12}px, ${mousePos.y * 6}px)`
          }}
        >
          {/* Chassis Ground Ambient Shadow */}
          <div className="w-full h-10 bg-black/80 rounded-full blur-xl mx-auto translate-y-6 scale-x-95" />

          {/* Luxury White Innova Crysta / Executive Travel SUV SVG Render */}
          <svg viewBox="0 0 460 220" className="w-full drop-shadow-2xl">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#1e293b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="goldDecal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Wheels & Tires */}
            <g>
              {/* Rear Wheel */}
              <circle cx="105" cy="165" r="32" fill="#090d16" />
              <circle cx="105" cy="165" r="22" fill="#334155" />
              <circle cx="105" cy="165" r="14" fill="#94a3b8" />
              <circle cx="105" cy="165" r="5" fill="#f8fafc" />

              {/* Front Wheel */}
              <circle cx="355" cy="165" r="32" fill="#090d16" />
              <circle cx="355" cy="165" r="22" fill="#334155" />
              <circle cx="355" cy="165" r="14" fill="#94a3b8" />
              <circle cx="355" cy="165" r="5" fill="#f8fafc" />
            </g>

            {/* Aerodynamic SUV Chassis Body */}
            <path
              d="M45,145 
                 L65,115 Q95,78 145,72 
                 L260,68 Q290,68 335,95 
                 L395,112 Q425,120 440,140 
                 L440,165 L395,165 
                 A40,40 0 0,0 315,165 
                 L145,165 
                 A40,40 0 0,0 65,165 
                 L45,165 Z"
              fill="url(#bodyGrad)"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Sleek Dark Tint Windows with Chrome Trim */}
            <path
              d="M135,78 L240,75 L240,118 L115,118 Q120,95 135,78 Z"
              fill="url(#glassGrad)"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <path
              d="M248,75 L300,77 L355,112 L248,118 Z"
              fill="url(#glassGrad)"
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Royal Gold Side Accent Pinstripe */}
            <path d="M55,135 L430,135" stroke="url(#goldDecal)" strokeWidth="3" strokeLinecap="round" />

            {/* Headlights (Glowing LED Xenon Beam) */}
            <polygon points="415,125 438,135 435,145 408,140" fill="#fef08a" />
            <ellipse cx="430" cy="138" rx="8" ry="4" fill="#ffffff" />
            {/* Beam projection */}
            <polygon points="435,132 500,105 500,175 435,145" fill="url(#goldDecal)" opacity="0.15" />

            {/* Tail lights */}
            <polygon points="45,130 52,126 50,145 45,143" fill="#ef4444" />

            {/* Roof Luggage Carrier (Professional Tourist Taxi style) */}
            <rect x="130" y="60" width="160" height="7" rx="3.5" fill="#475569" />
            <line x1="145" y1="67" x2="145" y2="72" stroke="#475569" strokeWidth="3" />
            <line x1="275" y1="67" x2="275" y2="72" stroke="#475569" strokeWidth="3" />
          </svg>
        </div>

        {/* Layer 4: Floating 3D Waypoint Markers & Highway Badges (Depth: 90px) */}
        <div
          className="absolute top-6 left-6 pointer-events-none"
          style={{ transform: 'translateZ(90px)' }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-amber-500/40 shadow-xl text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300">Hub Active:</span>
            <span className="text-xs font-semibold">Bhilwara ➔ Ahmedabad NH-48</span>
          </div>
        </div>

        {/* Floating Route Pin: Udaipur (Lake City) */}
        <div
          className="absolute top-24 left-1/4 pointer-events-none hidden sm:block animate-bounce duration-1000"
          style={{ transform: 'translateZ(80px)' }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-white shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Jaipur • 240 km</span>
          </div>
        </div>

        {/* Floating Route Pin: Delhi Express */}
        <div
          className="absolute top-16 right-1/4 pointer-events-none hidden md:block"
          style={{ transform: 'translateZ(100px)' }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-white shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delhi NCR • Express</span>
          </div>
        </div>

        {/* Bottom Floating Stats Pill */}
        <div
          className="absolute bottom-5 right-6 pointer-events-none hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-white shadow-xl"
          style={{ transform: 'translateZ(70px)' }}
        >
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="text-[11px] leading-tight">
            <span className="text-amber-400 font-bold block">100% Verified Fleet</span>
            <span className="text-slate-400">All India Tourist Permit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
