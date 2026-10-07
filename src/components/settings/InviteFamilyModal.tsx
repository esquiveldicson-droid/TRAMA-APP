import React, { useState, useRef } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { UserRole } from '../../types/family';
import { sanitizeText, compressImage } from '../../services/geminiService';
import { X, UserPlus, Share2, Copy, Check, Sparkles, Camera, Upload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteFamilyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const addUser = useFamilyStore((state) => state.addUser);
  const familyName = useFamilyStore((state) => state.familyName);
  const showToast = useFamilyStore((state) => state.showToast);

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<UserRole>('hijo');
  const [email, setEmail] = useState('');
  const [apodo, setApodo] = useState('');
  const [comidaFav, setComidaFav] = useState('');
  const [cumpleanos, setCumpleanos] = useState('2000-01-01');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

    addUser({
      nombre: sanitizeText(nombre.trim()),
      rol,
      email: email.trim().toLowerCase() || `${nombre.toLowerCase().replace(/\s+/g, '')}@familia.com`,
      apodo_IA: apodo.trim() ? sanitizeText(apodo.trim()) : `El/La ${rol}`,
      comida_fav: comidaFav.trim() ? sanitizeText(comidaFav.trim()) : 'Plato familiar',
      cumpleanos: cumpleanos || '1995-05-15',
      avatar_url: avatarUrl,
      fecha_ingreso: new Date().toISOString().slice(0, 10),
    });

    onClose();
  };

  const roles: Array<{ id: UserRole; label: string }> = [
    { id: 'padre', label: 'Papá / Padre' },
    { id: 'madre', label: 'Mamá / Madre' },
    { id: 'hijo', label: 'Hijo' },
    { id: 'hija', label: 'Hija' },
    { id: 'abuelo', label: 'Abuelo' },
    { id: 'abuela', label: 'Abuela' },
    { id: 'hermano', label: 'Hermano/a' },
    { id: 'tio', label: 'Tío' },
    { id: 'tia', label: 'Tía' },
    { id: 'pareja', label: 'Pareja / Esposo(a)' },
    { id: 'otro', label: 'Otro Familiar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary)] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-base text-[var(--text-primary)]">
                Invitar / Añadir Integrante
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Para {familyName}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Photo Picker */}
          <div className="flex flex-col items-center justify-center pb-1">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-18 h-18 rounded-full overflow-hidden border-3 border-[var(--theme-primary)] bg-stone-100 dark:bg-stone-800 shadow-sm flex items-center justify-center">
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-md">
                <Camera className="w-3 h-3" />
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
              Nombre Completo o Cariñoso *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. Tía Laura o Sofía"
              className="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Rol en la Familia
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
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
                placeholder="familiar@gmail.com"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>Apodo de la Familia o IA (Opcional)</span>
            </label>
            <input
              type="text"
              value={apodo}
              onChange={(e) => setApodo(e.target.value)}
              placeholder="ej. La repostera estrella, El bromista"
              className="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Comida Favorita
              </label>
              <input
                type="text"
                value={comidaFav}
                onChange={(e) => setComidaFav(e.target.value)}
                placeholder="ej. Milanesas napolitanas"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Cumpleaños
              </label>
              <input
                type="date"
                value={cumpleanos}
                onChange={(e) => setCumpleanos(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
            </div>
          </div>

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
              Guardar Integrante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
