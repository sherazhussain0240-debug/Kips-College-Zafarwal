import React from 'react';

interface CollegeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  className = '',
  size = 'md',
  customLogoUrl,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="KIPS College Zafarwal Logo"
        className={`${sizeMap[size]} object-contain rounded-full shadow-xs ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      title="KIPS College Zafarwal Official Crest"
      aria-label="KIPS College Zafarwal Official Crest"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="crestBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="innerShield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>
        </defs>

        {/* Outer Circular Laurel Frame */}
        <circle cx="60" cy="60" r="57" fill="url(#crestBlueGrad)" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" />

        {/* Central Shield Outline */}
        <path
          d="M60 22 C78 22 88 28 88 42 C88 66 70 82 60 90 C50 82 32 66 32 42 C32 28 42 22 60 22 Z"
          fill="url(#innerShield)"
          stroke="#0284c7"
          strokeWidth="2"
        />

        {/* Academic Open Book in Upper Shield */}
        <path
          d="M60 52 C55 49 48 48 41 50 L41 68 C48 66 55 67 60 70 C65 67 72 66 79 68 L79 50 C72 48 65 49 60 52 Z"
          fill="#0284c7"
        />
        <path
          d="M60 52 L60 70"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Book pages lines */}
        <line x1="46" y1="56" x2="55" y2="54" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <line x1="46" y1="60" x2="55" y2="58" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <line x1="65" y1="54" x2="74" y2="56" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <line x1="65" y1="58" x2="74" y2="60" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

        {/* Academic Mortarboard (Graduation Cap) at top */}
        <polygon points="60,30 76,37 60,44 44,37" fill="#0f172a" />
        <polygon points="52,41 52,47 68,47 68,41 60,45" fill="#1e293b" />
        {/* Tassel */}
        <path d="M72 39 L76 49 L78 49" stroke="url(#goldAccent)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Academic Torch / Star of Excellence at base of shield */}
        <polygon points="60,74 62,79 67,80 63,83 64,88 60,85 56,88 57,83 53,80 58,79" fill="url(#goldAccent)" />

        {/* Lower Banner with KIPS */}
        <path
          d="M24 94 C42 89 78 89 96 94 L92 104 C74 100 46 100 28 104 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1"
        />
        <text
          x="60"
          y="100"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="1.5"
          fontFamily="system-ui, sans-serif"
        >
          KIPS
        </text>

        {/* Stars */}
        <polygon points="32,48 33,50 35,50 33.5,51.5 34,53.5 32,52 30,53.5 30.5,51.5 29,50 31,50" fill="url(#goldAccent)" />
        <polygon points="88,48 89,50 91,50 89.5,51.5 90,53.5 88,52 86,53.5 86.5,51.5 85,50 87,50" fill="url(#goldAccent)" />
      </svg>
    </div>
  );
};
