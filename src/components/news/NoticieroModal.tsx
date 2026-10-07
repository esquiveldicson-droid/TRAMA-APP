import React, { useEffect } from 'react';
import { useNoticiero } from '../../hooks/useNoticiero';
import { X, Radio, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NoticieroModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    data,
    isLoading,
    isPlayingAudio,
    generateNoticiero,
    speakNoticiero,
    stopAudio,
  } = useNoticiero();

  useEffect(() => {
    if (isOpen && !data) {
      generateNoticiero();
    }
    return () => {
      stopAudio();
    };
  }, [isOpen, data, generateNoticiero, stopAudio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        {/* Radio Header with vintage aesthetics */}
        <div className="p-5 border-b border-[#EFE7DA] bg-gradient-to-r from-[#2C2724] to-[#3D3530] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#F2CC8F] tracking-widest uppercase block">
                Radio Familia Hub • 98.5 FM
              </span>
              <h3 className="font-['Playfair_Display'] font-bold text-base leading-tight">
                Noticiero Dominical
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-3 border-[#E07A5F] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#E07A5F]">
                Sintonizando la frecuencia familiar con Gemini...
              </p>
              <p className="text-[11px] text-stone-400">
                Resumiendo los posts, anécdotas y eventos de la semana
              </p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Radio Broadcaster Action Bar */}
              <div className="p-4 bg-[#FAF0E6] rounded-2xl border border-[#F2CC8F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <span className="text-[11px] font-bold text-[#C9654C] block">
                      Locución Radial en Vivo
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Voz del relator nostálgico
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={speakNoticiero}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-[#E07A5F] hover:bg-[#C9654C] text-white'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Escuchar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateNoticiero}
                    className="p-2 text-stone-500 hover:text-[#E07A5F] bg-white rounded-xl border border-stone-200"
                    title="Regenerar noticiero"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2724] border-b border-[#EFE7DA] pb-2">
                {data.title}
              </h4>

              {/* 3 Paragraphs */}
              <div className="space-y-3">
                {data.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-[#2C2724]/90 leading-relaxed bg-[#FFFDF9] p-3 rounded-2xl border border-[#EFE7DA]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-stone-400 italic">
                  "Familia Hub: transmitiendo desde el corazón del hogar."
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
