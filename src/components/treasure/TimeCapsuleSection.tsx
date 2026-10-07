import React, { useState, useEffect } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { TimeCapsule } from '../../types/family';
import { Lock, Unlock, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const TimeCapsuleSection: React.FC = () => {
  const capsules = useFamilyStore((state) => state.timeCapsules);
  const users = useFamilyStore((state) => state.users);

  // Time remaining calculator
  const calculateRemaining = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return { expired: false, days, hours, minutes };
  };

  const [unlockedCapsules, setUnlockedCapsules] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
          Cápsulas del Tiempo Selladas
        </h3>
        <p className="text-xs text-[#2C2724]/60">
          Mensajes y recuerdos guardados bajo candado para el futuro
        </p>
      </div>

      <div className="grid gap-3.5">
        {capsules.map((capsule) => {
          const creator = users.find((u) => u.id === capsule.creador_id);
          const time = calculateRemaining(capsule.fecha_apertura);
          const isRevealed = unlockedCapsules[capsule.id];

          return (
            <div
              key={capsule.id}
              className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DA] shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                      time.expired || isRevealed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#E07A5F]/15 text-[#E07A5F]'
                    }`}
                  >
                    {time.expired || isRevealed ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C2724]">
                      {capsule.titulo}
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      Sellada por {creator?.nombre || 'Familia'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  Apertura: {new Date(capsule.fecha_apertura).toLocaleDateString()}
                </span>
              </div>

              {/* Countdown or Revealed Content */}
              {isRevealed ? (
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 animate-in zoom-in-95">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                    <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                    <span>¡Cápsula Revelada!</span>
                  </div>
                  <p className="text-xs text-[#2C2724] leading-relaxed italic">
                    "{capsule.contenido_encriptado}"
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EFE7DA] text-center space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Tiempo Restante para Abrir
                  </span>

                  <div className="flex items-center justify-center gap-3 text-[#2C2724]">
                    <div className="text-center">
                      <span className="font-['Playfair_Display'] text-xl font-bold block leading-none">
                        {time.days}
                      </span>
                      <span className="text-[9px] text-stone-400">días</span>
                    </div>
                    <span className="text-stone-300 font-bold">:</span>
                    <div className="text-center">
                      <span className="font-['Playfair_Display'] text-xl font-bold block leading-none">
                        {time.hours}
                      </span>
                      <span className="text-[9px] text-stone-400">horas</span>
                    </div>
                    <span className="text-stone-300 font-bold">:</span>
                    <div className="text-center">
                      <span className="font-['Playfair_Display'] text-xl font-bold block leading-none">
                        {time.minutes}
                      </span>
                      <span className="text-[9px] text-stone-400">min</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setUnlockedCapsules((prev) => ({
                          ...prev,
                          [capsule.id]: true,
                        }))
                      }
                      className="text-[11px] font-bold text-[#E07A5F] hover:underline"
                    >
                      (Ver previa con permiso familiar)
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
