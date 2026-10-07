import React, { useEffect, useState } from 'react';
import { Recipe } from '../../types/family';
import { X, Clock, Users, Sun, CheckCircle2, Circle, Sparkles } from 'lucide-react';

interface Props {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeReaderModal: React.FC<Props> = ({ recipe, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Screen Wake Lock API implementation
  useEffect(() => {
    let sentinel: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          sentinel = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch (err) {
        console.warn('Wake Lock no disponible o denegado:', err);
      }
    };

    if (recipe) {
      requestWakeLock();
    }

    return () => {
      if (sentinel) {
        sentinel.release().catch(() => {});
        setWakeLockActive(false);
      }
    };
  }, [recipe]);

  if (!recipe) return null;

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF6F0] flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
      {/* Sticky Reader Header */}
      <header className="sticky top-0 z-20 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EFE7DA] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E07A5F] text-white flex items-center justify-center font-bold">
            👨‍🍳
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#E07A5F] uppercase tracking-wider block">
              Modo Cocina en Vivo
            </span>
            <h2 className="font-['Playfair_Display'] font-bold text-sm text-[#2C2724] truncate max-w-[200px] sm:max-w-xs">
              {recipe.titulo}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wakeLockActive && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300"
              title="La pantalla se mantendrá encendida mientras cocinas"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Pantalla Activa</span>
            </span>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Reader Body */}
      <main className="max-w-xl mx-auto w-full p-4 sm:p-6 space-y-6 pb-20">
        {/* Hero Photo Banner */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-md border border-[#EFE7DA]">
          <img
            src={recipe.imagen_url}
            alt={recipe.titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-around p-3.5 bg-white rounded-2xl border border-[#EFE7DA] shadow-xs">
          <div className="text-center">
            <span className="text-[11px] text-stone-400 block font-medium">Tiempo</span>
            <span className="font-bold text-sm text-[#2C2724] flex items-center gap-1 justify-center">
              <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
              {recipe.tiempo_minutos} min
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div className="text-center">
            <span className="text-[11px] text-stone-400 block font-medium">Porciones</span>
            <span className="font-bold text-sm text-[#2C2724] flex items-center gap-1 justify-center">
              <Users className="w-3.5 h-3.5 text-[#819B84]" />
              {recipe.porciones} personas
            </span>
          </div>
        </div>

        {/* Secret Tip */}
        {recipe.secreto_familiar && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">
                Secreto de la Familia
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed italic">
                "{recipe.secreto_familiar}"
              </p>
            </div>
          </div>
        )}

        {/* Ingredients Checklist */}
        <section className="bg-white p-5 rounded-3xl border border-[#EFE7DA] shadow-xs space-y-3">
          <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724] flex items-center gap-2">
            <span>Ingredientes Necesarios</span>
            <span className="text-xs font-sans font-normal text-stone-400">
              ({recipe.ingredientes.length})
            </span>
          </h3>
          <ul className="space-y-2">
            {recipe.ingredientes.map((ing, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs text-[#2C2724] font-medium p-1.5 rounded-lg hover:bg-stone-50"
              >
                <span className="w-2 h-2 rounded-full bg-[#E07A5F] mt-1.5 shrink-0" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Step by Step Preparation */}
        <section className="bg-white p-5 rounded-3xl border border-[#EFE7DA] shadow-xs space-y-4">
          <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
            Paso a Paso
          </h3>
          <div className="space-y-3">
            {recipe.pasos.map((paso, idx) => {
              const isDone = completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-200 line-through text-stone-400'
                      : 'bg-[#FAF6F0] border-[#EFE7DA] hover:border-[#E07A5F]/40 text-[#2C2724]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold mr-1.5">Paso {idx + 1}:</span>
                    <span>{paso}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
