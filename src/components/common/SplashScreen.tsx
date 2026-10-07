import React, { useEffect, useState } from 'react';
import { TramaLogo } from './TramaLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 400);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF6F0] dark:bg-[#151311] transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-6 animate-in zoom-in-95 duration-500">
        <div className="w-28 h-28 rounded-3xl bg-white dark:bg-[#201D1A] flex items-center justify-center shadow-xl shadow-stone-300/40 dark:shadow-black/40 mb-5 border border-[#EFE7DA] dark:border-[#35302A]">
          <TramaLogo size={90} />
        </div>

        <h1 className="font-['Nunito',sans-serif] font-black text-3xl text-[var(--text-primary)] tracking-wider mb-1.5 uppercase">
          TRAMA
        </h1>
        <p className="text-xs font-semibold text-[var(--text-muted)] max-w-xs mb-8">
          El tejido íntimo de nuestra familia. Fotos, recetas, fechas y recuerdos entrelazados.
        </p>

        {/* 5 Dots for the 5 Family members */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#819B84] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A80] animate-bounce [animation-delay:0s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2CC8F] animate-bounce [animation-delay:0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E76F51] animate-bounce [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  );
};
