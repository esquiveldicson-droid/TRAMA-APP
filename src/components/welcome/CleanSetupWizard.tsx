import React, { useState, useRef } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { UserRole } from '../../types/family';
import { sanitizeText, compressImage } from '../../services/geminiService';
import { TramaLogo } from '../common/TramaLogo';
import { Sparkles, Heart, Cake, ArrowRight, Camera, Upload } from 'lucide-react';

export const CleanSetupWizard: React.FC = () => {
  const addUser = useFamilyStore((state) => state.addUser);
  const setFamilyName = useFamilyStore((state) => state.setFamilyName);
  const loadDemoData = useFamilyStore((state) => state.loadDemoData);
  const showToast = useFamilyStore((state) => state.showToast);

  const [inputFamilyName, setInputFamilyName] = useState('Mi Familia');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<UserRole>('padre');
  const [email, setEmail] = useState('');
  const [comidaFav, setComidaFav] = useState('Asado / Pasta casera');
  const [cumpleanos, setCumpleanos] = useState('1985-06-15');
  const [apodo, setApodo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      showToast('Foto cargada con éxito', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al procesar foto', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (inputFamilyName.trim()) {
      setFamilyName(sanitizeText(inputFamilyName.trim()));
    }

    addUser({
      nombre: sanitizeText(nombre.trim()),
      rol,
      email: email.trim().toLowerCase() || `${nombre.toLowerCase().replace(/\s+/g, '')}@familia.com`,
      apodo_IA: apodo.trim() ? sanitizeText(apodo.trim()) : 'Fundador de la Trama',
      comida_fav: sanitizeText(comidaFav.trim()),
      cumpleanos: cumpleanos || '1990-01-01',
      avatar_url: avatarUrl,
      fecha_ingreso: new Date().toISOString().slice(0, 10),
    });
  };

  const roles: Array<{ id: UserRole; label: string }> = [
    { id: 'padre', label: 'Papá / Padre' },
    { id: 'madre', label: 'Mamá / Madre' },
    { id: 'hijo', label: 'Hijo' },
    { id: 'hija', label: 'Hija' },
    { id: 'abuelo', label: 'Abuelo' },
    { id: 'abuela', label: 'Abuela' },
    { id: 'hermano', label: 'Hermano/a' },
    { id: 'pareja', label: 'Pareja' },
    { id: 'otro', label: 'Otro' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#151311] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#201D1A] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EFE7DA] dark:border-[#35302A] animate-in zoom-in-95 duration-300">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#282420] flex items-center justify-center shadow-lg shadow-stone-200/50 dark:shadow-black/50 mx-auto mb-3 border border-[#EFE7DA] dark:border-[#35302A]">
            <TramaLogo size={70} />
          </div>
          <h1 className="font-['Nunito',sans-serif] font-black text-2xl text-[var(--text-primary)] tracking-wider uppercase">
            TRAMA
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
            Configura tu red social privada familiar en limpio. Lista en 0 para tu familia.
          </p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Photo Picker */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[var(--theme-primary)] bg-stone-100 dark:bg-stone-800 shadow-sm flex items-center justify-center">
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-[var(--theme-primary)] hover:underline mt-1.5 flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>{isUploading ? 'Cargando foto...' : 'Elegir foto de perfil (Cámara / Galería)'}</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Nombre de tu Familia o Hogar
            </label>
            <input
              type="text"
              required
              value={inputFamilyName}
              onChange={(e) => setInputFamilyName(e.target.value)}
              placeholder="ej. Familia Esquivel o Casa Grande"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Tu Nombre *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. Dicson, Roberto o Carmen"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Tu Rol
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span>Comida Favorita</span>
              </label>
              <input
                type="text"
                value={comidaFav}
                onChange={(e) => setComidaFav(e.target.value)}
                placeholder="ej. Lasaña casera"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-amber-500" />
                <span>Cumpleaños</span>
              </label>
              <input
                type="date"
                value={cumpleanos}
                onChange={(e) => setCumpleanos(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!nombre.trim() || isUploading}
            className="w-full py-3 bg-[var(--theme-primary)] hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--theme-primary)]/20 active:scale-98 transition-transform mt-2"
          >
            <span>Comenzar mi Trama Familiar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo data shortcut */}
        <div className="mt-6 pt-4 border-t border-[#EFE7DA] dark:border-[#35302A] text-center">
          <button
            type="button"
            onClick={loadDemoData}
            className="text-xs text-[var(--theme-primary)] font-bold hover:underline flex items-center gap-1.5 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>O cargar datos de ejemplo (Familia Demo de 5)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
