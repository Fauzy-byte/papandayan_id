import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

const CANDIDATE_LOGOS = [
  '/logo (2).png',
  '/logo.png',
  '/logo.PNG',
  '/logo.jpg',
  '/logo.JPG',
  '/logo.jpeg',
  '/logo.JPEG',
  '/logo-asli.jpg',
  '/logo-asli.JPG',
  '/logo-asli.png',
  '/logo_asli.jpg',
  '/logo_asli.png',
  '/logo.svg'
];

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = false
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFallbackToSvg, setHasFallbackToSvg] = useState(false);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base leading-tight',
    md: 'text-base sm:text-lg leading-none',
    lg: 'text-xl sm:text-2xl leading-none'
  };

  const handleImageError = () => {
    if (candidateIndex < CANDIDATE_LOGOS.length - 1) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setHasFallbackToSvg(true);
    }
  };

  const currentSrc = CANDIDATE_LOGOS[candidateIndex];

  return (
    <div id="brand-logo" className="flex items-center gap-2.5 sm:gap-3 select-none group">
      {/* Official Mountain Emblem / Foto Asli Logo */}
      <div 
        className={`${iconSizes[size]} rounded-xl bg-black overflow-hidden flex items-center justify-center shadow-md relative shrink-0 border border-slate-800 transition-transform group-hover:scale-105`}
      >
        {!hasFallbackToSvg ? (
          <img 
            key={currentSrc}
            src={currentSrc} 
            alt="Logo Papandayan" 
            className="w-full h-full object-cover object-center"
            onError={handleImageError}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full p-1" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White Outer Crest Shape */}
            <path 
              d="M 16 66 
                 C 11 58, 12 47, 19 39 
                 L 43 14 
                 C 48 8, 56 8, 62 13 
                 L 87 38 
                 C 92 43, 91 50, 85 53 
                 C 80 55, 75 51, 71 46 
                 L 55 29 
                 C 52 26, 48 26, 45 29 
                 L 27 48 
                 C 22 53, 21 60, 24 65 
                 C 27 70, 32 72, 40 71 
                 C 44 70, 47 73, 46 78 
                 C 45 82, 38 84, 30 84 
                 C 22 84, 18 76, 16 66 Z" 
              fill="#FFFFFF" 
            />
            {/* Golden Yellow Swoop Base */}
            <path 
              d="M 27 60 
                 C 27 50, 37 44, 50 42 
                 C 63 40, 75 44, 86 54 
                 C 93 61, 91 69, 83 72 
                 C 70 76, 51 68, 36 68 
                 C 31 68, 27 65, 27 60 Z" 
              fill="#FFB800" 
            />
          </svg>
        )}
      </div>

      {/* Brand Typography (papandayan_id) */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <span 
            className={`font-black tracking-tight font-sans ${titleSizes[size]} text-[#FFB800]`}
            style={{ letterSpacing: '0.04em' }}
          >
            PAPANDAYAN
          </span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 uppercase tracking-wider ml-0.5 font-mono">
            _ID
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-blue-200/80 font-medium tracking-wide">
            Official Mountain Trip Operator
          </span>
        )}
      </div>
    </div>
  );
};
