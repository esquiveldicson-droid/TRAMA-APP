import React, { useState, useRef, useEffect } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { PostCategory } from '../../types/family';
import { compressImage, sanitizeText } from '../../services/geminiService';
import { useEventDetector } from '../../hooks/useEventDetector';
import { Avatar } from '../common/Avatar';
import {
  X,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Utensils,
  Camera,
  Trophy,
  Plane,
  Upload,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const addPost = useFamilyStore((state) => state.addPost);
  const addEvent = useFamilyStore((state) => state.addEvent);
  const showToast = useFamilyStore((state) => state.showToast);

  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState<PostCategory>('recuerdo');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDetecting, detectedEvent, analyzeText, clearDetection } = useEventDetector();

  // Debounced event intent detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contenido.trim().length > 15) {
        analyzeText(contenido);
      } else {
        clearDetection();
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [contenido, analyzeText, clearDetection]);

  if (!isOpen || !currentUser) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('La imagen no debe superar los 10MB', 'error');
      return;
    }

    try {
      setCompressing(true);
      const compressed = await compressImage(file, 1200, 0.8);
      setImageBase64(compressed);
    } catch (err: any) {
      showToast(err.message || 'Error al procesar la foto', 'error');
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    setIsSubmitting(true);
    const sanitized = sanitizeText(contenido.trim());

    addPost({
      autor_id: currentUser.id,
      tipo: imageBase64 ? 'foto' : 'texto',
      categoria,
      contenido: sanitized,
      imagen_url: imageBase64 || undefined,
      fecha: new Date().toISOString(),
      ia_metadata: {
        resumen_ia: `Publicado por ${currentUser.nombre} en ${categoria}.`,
        sentimiento: 'Cálido',
      },
    });

    setIsSubmitting(false);
    setContenido('');
    setImageBase64(null);
    clearDetection();
    onClose();
  };

  const handleAddDetectedEvent = () => {
    if (!detectedEvent) return;

    addEvent({
      creador_id: currentUser.id,
      titulo: detectedEvent.titulo,
      descripcion: `Creado automáticamente desde el muro: "${detectedEvent.intencion_verdadera || contenido}"`,
      fecha: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), // Próximos 2 días
      hora: '14:00',
      ubicacion: detectedEvent.ubicacion || 'Casa familiar',
      tipo: 'reunion',
      items_necesarios: [
        { id: 'it_' + Date.now(), titulo: 'Coordinar con la familia', completado: false },
      ],
    });

    clearDetection();
    showToast('¡Evento agregado al calendario familiar!', 'success');
  };

  const categories: Array<{ id: PostCategory; label: string; icon: any }> = [
    { id: 'recuerdo', label: 'Recuerdo', icon: Camera },
    { id: 'receta', label: 'Receta', icon: Utensils },
    { id: 'logro', label: 'Logro', icon: Trophy },
    { id: 'viaje', label: 'Viaje', icon: Plane },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] overflow-hidden animate-in slide-in-from-bottom-6 duration-300 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE7DA] flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} size="sm" />
            <div>
              <h3 className="font-bold text-sm text-[#2C2724]">
                Compartir Momento Familiar
              </h3>
              <p className="text-[11px] text-[#2C2724]/60">
                Visible solo para tus 5 familiares
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = categoria === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoria(c.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#E07A5F]/15 border-[#E07A5F] text-[#C9654C]'
                        : 'bg-white border-[#EFE7DA] text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder={`¿Qué quieres contar hoy, ${currentUser.nombre.split(' ')[0]}?`}
              className="w-full p-3.5 bg-stone-50/70 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-[#E07A5F] focus:bg-white resize-none"
              rows={4}
              autoFocus
            />
          </div>

          {/* AI Event Detection Card */}
          {detectedEvent && (
            <div className="p-3 bg-[#819B84]/15 border border-[#819B84]/40 rounded-2xl animate-in zoom-in-95 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-[#819B84] text-white rounded-xl mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#556F57]">
                    <Sparkles className="w-3 h-3" />
                    <span>¿Planean un encuentro?</span>
                  </div>
                  <p className="text-xs font-semibold text-[#2C2724]">
                    {detectedEvent.titulo}
                  </p>
                  <p className="text-[11px] text-stone-600">
                    {detectedEvent.fecha_estimada} • {detectedEvent.ubicacion || 'Casa'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddDetectedEvent}
                className="shrink-0 px-2.5 py-1.5 bg-[#819B84] hover:bg-[#647C66] text-white text-[11px] font-bold rounded-xl shadow-xs"
              >
                + Agendar
              </button>
            </div>
          )}

          {/* Image Preview or Upload */}
          <div>
            {imageBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 max-h-48">
                <img
                  src={imageBase64}
                  alt="Previsualización"
                  className="w-full h-full object-cover max-h-48"
                />
                <button
                  type="button"
                  onClick={() => setImageBase64(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-[#E07A5F] rounded-2xl p-4 text-center cursor-pointer bg-stone-50/50 hover:bg-[#FAF6F0] transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-600">
                  <ImageIcon className="w-4 h-4 text-[#E07A5F]" />
                  <span>
                    {compressing ? 'Optimizando foto...' : 'Agregar foto familiar (hasta 10MB)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EFE7DA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!contenido.trim() || isSubmitting || compressing}
              className="px-6 py-2.5 bg-[#E07A5F] hover:bg-[#C9654C] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-[#E07A5F]/20 active:scale-95 transition-transform"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar en el Muro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
