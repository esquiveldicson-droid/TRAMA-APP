import React, { useState, useRef } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { sanitizeText, compressImage } from '../../services/geminiService';
import { X, Sparkles, Heart, Cake, Camera, Upload, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const updateUserProfile = useFamilyStore((state) => state.updateUserProfile);
  const showToast = useFamilyStore((state) => state.showToast);

  const [nombre, setNombre] = useState(currentUser?.nombre || '');
  const [apodoIA, setApodoIA] = useState(currentUser?.apodo_IA || '');
  const [comidaFav, setComidaFav] = useState(currentUser?.comida_fav || '');
  const [cumpleanos, setCumpleanos] = useState(currentUser?.cumpleanos || '1990-01-01');
  const [bioIA, setBioIA] = useState(currentUser?.bio_ia || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [colorAcento, setColorAcento] = useState(currentUser?.color_acento || '#E07A5F');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  // Preset avatars for quick selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('La foto debe ser menor a 10MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 400, 0.85);
      setAvatarUrl(compressed);
      showToast('Foto cargada y optimizada', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al procesar la foto', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserProfile(currentUser.id, {
      nombre: sanitizeText(nombre.trim()),
      apodo_IA: sanitizeText(apodoIA.trim()),
      comida_fav: sanitizeText(comidaFav.trim()),
      cumpleanos,
      avatar_url: avatarUrl || currentUser.avatar_url,
      color_acento: colorAcento,
      bio_ia: bioIA ? sanitizeText(bioIA.trim()) : undefined,
    });
    onClose();
  };

  const accentColors = ['#E07A5F', '#819B84', '#3D5A80', '#9D4EDD', '#D97706', '#E76F51'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--theme-primary)]" />
            <h3 className="font-['Playfair_Display'] font-bold text-base text-[var(--text-primary)]">
              Personalizar Perfil Familiar
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Avatar Customization with Camera picker */}
          <div className="flex flex-col items-center text-center space-y-3 pb-2 border-b border-[#EFE7DA] dark:border-[#35302A]">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 bg-stone-100 dark:bg-stone-800 shadow-md flex items-center justify-center cursor-pointer"
                style={{ borderColor: colorAcento }}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-xl text-[var(--text-muted)]">
                    {nombre.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload badge button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white dark:border-stone-900"
                title="Cambiar foto desde tu galería o cámara"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[var(--theme-primary)] hover:underline flex items-center gap-1 mx-auto"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Procesando foto...' : 'Subir foto desde mi teléfono / cámara'}</span>
              </button>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                Formatos JPG, PNG, WebP (hasta 10MB)
              </span>
            </div>

            {/* Quick avatar presets */}
            <div className="space-y-1.5 w-full pt-1">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
                O elige un avatar sugerido:
              </span>
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform active:scale-90 ${
                      avatarUrl === preset ? 'ring-2 ring-[var(--theme-primary)] scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accent Color Picker for User */}
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
              Color de tu Marco Personal
            </label>
            <div className="flex items-center gap-2">
              {accentColors.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColorAcento(col)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    colorAcento === col ? 'scale-115 ring-2 ring-offset-2 ring-[var(--theme-primary)]' : ''
                  }`}
                  style={{ backgroundColor: col }}
                >
                  {colorAcento === col && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Nombre en la Familia *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>Apodo Familiar o de IA</span>
            </label>
            <input
              type="text"
              required
              value={apodoIA}
              onChange={(e) => setApodoIA(e.target.value)}
              placeholder="ej. El Asador Mayor, La Reina del Hogar"
              className="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
            />
          </div>

          {/* Favorite Food & Birthday */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span>Comida Favorita</span>
              </label>
              <input
                type="text"
                required
                value={comidaFav}
                onChange={(e) => setComidaFav(e.target.value)}
                placeholder="ej. Asado, Pasta"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-amber-500" />
                <span>Cumpleaños</span>
              </label>
              <input
                type="date"
                required
                value={cumpleanos}
                onChange={(e) => setCumpleanos(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Biografía / Descripción Cariñosa
            </label>
            <textarea
              rows={3}
              value={bioIA}
              onChange={(e) => setBioIA(e.target.value)}
              placeholder="Algo lindo o representativo sobre ti en la familia..."
              className="w-full p-2.5 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#EFE7DA] dark:border-[#35302A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
