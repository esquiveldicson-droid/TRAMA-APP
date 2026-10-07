import React from 'react';

interface TramaLogoProps {
  size?: number | string;
  showText?: boolean;
  className?: string;
  textColor?: string;
}

/**
 * Logotipo oficial de TRAMA APP vectorizado en alta definición (SVG).
 * Representa la letra 'T' tejida con hebras de colores entrelazadas (trama familiar).
 */
export const TramaLogo: React.FC<TramaLogoProps> = ({
  size = 40,
  showText = false,
  className = '',
  textColor,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        <defs>
          {/* Gradients matching the woven cords */}
          <linearGradient id="trama-orange" x1="20" y1="30" x2="140" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F28E2B" />
            <stop offset="100%" stopColor="#E06830" />
          </linearGradient>

          <linearGradient id="trama-blue" x1="20" y1="40" x2="100" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#76B7B2" />
            <stop offset="100%" stopColor="#4E79A7" />
          </linearGradient>

          <linearGradient id="trama-yellow" x1="40" y1="30" x2="100" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EDC948" />
            <stop offset="100%" stopColor="#E5A638" />
          </linearGradient>

          <linearGradient id="trama-green" x1="30" y1="50" x2="90" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#87BBA2" />
            <stop offset="100%" stopColor="#5F8D76" />
          </linearGradient>

          <linearGradient id="trama-purple" x1="80" y1="30" x2="130" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9C755F" />
            <stop offset="100%" stopColor="#724E68" />
          </linearGradient>

          {/* Soft shadow filter */}
          <filter id="soft-shadow" x="-8%" y="-8%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* --- WOVEN T CORDS --- */}

        {/* Cord 1: Leftmost sage green loop curving into vertical stem */}
        <path
          d="M 32 60 C 50 60 62 70 66 122"
          stroke="url(#trama-green)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#soft-shadow)"
        />

        {/* Cord 2: Blue cord coming from top-left arm, weaving across and down */}
        <path
          d="M 32 44 C 70 44 72 80 76 126"
          stroke="url(#trama-blue)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#soft-shadow)"
        />

        {/* Cord 3: Orange arch bridging top bar from left to center stem */}
        <path
          d="M 38 28 C 80 28 84 66 86 128"
          stroke="url(#trama-orange)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#soft-shadow)"
        />

        {/* Cord 4: Yellow ribbon coming down from right bend through center */}
        <path
          d="M 124 44 C 88 44 86 80 82 126"
          stroke="url(#trama-yellow)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#soft-shadow)"
        />

        {/* Cord 5: Purple ribbon from right crossbar down into right stem */}
        <path
          d="M 124 58 C 104 58 98 78 94 122"
          stroke="url(#trama-purple)"
          strokeWidth="13"
          strokeLinecap="round"
          filter="url(#soft-shadow)"
        />

        {/* Interlaced weave overlays for true interwoven illusion */}
        {/* Over-under weave 1: Orange crosses over Blue */}
        <path
          d="M 68 36 C 75 42 78 52 80 64"
          stroke="url(#trama-orange)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Over-under weave 2: Blue crosses over Yellow at stem */}
        <path
          d="M 72 82 C 74 96 75 110 76 124"
          stroke="url(#trama-blue)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Over-under weave 3: Yellow crosses over Orange top bend */}
        <path
          d="M 94 40 C 90 48 86 58 84 70"
          stroke="url(#trama-yellow)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Bottom U-joint linking the central stems gracefully */}
        <path
          d="M 66 120 C 66 136 94 136 94 120"
          stroke="url(#trama-yellow)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      {showText && (
        <span
          className="font-['Nunito',sans-serif] font-black tracking-wider text-xl uppercase"
          style={{ color: textColor || 'currentColor' }}
        >
          TRAMA
        </span>
      )}
    </div>
  );
};
