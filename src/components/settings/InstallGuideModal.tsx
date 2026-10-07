import React, { useState } from 'react';
import { X, Smartphone, Share2, Copy, Check, Apple, Chrome, ArrowRight, ExternalLink } from 'lucide-react';
import { useFamilyStore } from '../../store/useFamilyStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const showToast = useFamilyStore((state) => state.showToast);
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'iphone' | 'android'>('android');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://trama-app.web.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('Enlace copiado al portapapeles', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola familia! Les comparto el enlace a nuestra red privada TRAMA APP para compartir fotos, recetas y eventos familiares:\n\n${currentUrl}\n\nÁbranlo en su navegador y toquen "Agregar a pantalla de inicio" para instalarla como app.`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)] flex items-center justify-center text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-base text-[var(--text-primary)]">
                Instalar Trama App en tu Teléfono
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Sin pasar por tiendas, 100% privada y directa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm text-[var(--text-primary)]">
          {/* Share Box */}
          <div className="p-3.5 bg-[#FAF6F0] dark:bg-[#1A1816] rounded-2xl border border-[#EFE7DA] dark:border-[#35302A] space-y-2.5">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Enlace de tu aplicación familiar:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#2A2622] rounded-xl border border-stone-300 dark:border-stone-700 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl flex items-center gap-1 active:scale-95 transition-transform"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar enlace por WhatsApp a la familia</span>
            </button>
          </div>

          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            <button
              onClick={() => setActivePlatform('android')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'android'
                  ? 'bg-white dark:bg-[#25221E] text-[var(--text-primary)] shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              <Chrome className="w-4 h-4 text-emerald-600" />
              <span>Android (Chrome)</span>
            </button>
            <button
              onClick={() => setActivePlatform('iphone')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'iphone'
                  ? 'bg-white dark:bg-[#25221E] text-[var(--text-primary)] shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              <Apple className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>iPhone (Safari)</span>
            </button>
          </div>

          {/* Instructions Step by Step */}
          {activePlatform === 'android' ? (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--theme-primary)]">
                Pasos para Android (Google Chrome):
              </h4>
              <ol className="space-y-2.5 text-xs text-[var(--text-primary)]">
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Abre el enlace en el navegador <strong>Google Chrome</strong> en tu celular.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Toca los <strong>tres puntos (⋮)</strong> en la esquina superior derecha de la pantalla.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span>¡Listo! Trama App aparecerá en tu teléfono con su icono propio como cualquier app nativa.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--theme-primary)]">
                Pasos para iPhone (Safari):
              </h4>
              <ol className="space-y-2.5 text-xs text-[var(--text-primary)]">
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Abre el enlace usando el navegador <strong>Safari</strong> en tu iPhone.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Toca el botón <strong>Compartir</strong> (el cuadrado con la flecha hacia arriba ⬆️ en la barra inferior).</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Baja en las opciones y presiona <strong>"Agregar a pantalla de inicio"</strong> (+).</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 bg-stone-50 dark:bg-[#25221E] rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Toca <strong>"Agregar"</strong> arriba a la derecha. ¡Se abrirá en pantalla completa sin barras de navegador!</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
