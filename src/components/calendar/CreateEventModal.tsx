import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { sanitizeText } from '../../services/geminiService';
import { X, Flame, Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export const CreateEventModal: React.FC<Props> = ({ isOpen, onClose, defaultDate }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const addEvent = useFamilyStore((state) => state.addEvent);

  const [titulo, setTitulo] = useState('Asado del Domingo');
  const [descripcion, setDescripcion] = useState('Reunión en familia para compartir sobremesa.');
  const [fecha, setFecha] = useState(defaultDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [hora, setHora] = useState('13:00');
  const [ubicacion, setUbicacion] = useState('Casa de los papás');
  const [tipo, setTipo] = useState<'asado' | 'reunion' | 'cena' | 'cumpleanos' | 'viaje'>('asado');
  const [items, setItems] = useState<string[]>([
    'Comprar carbón y carne',
    'Preparar ensaladas',
    'Comprar helado de postre',
  ]);
  const [newItemInput, setNewItemInput] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemInput.trim()) return;
    setItems([...items, newItemInput.trim()]);
    setNewItemInput('');
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !fecha) return;

    addEvent({
      creador_id: currentUser ? currentUser.id : 'admin',
      titulo: sanitizeText(titulo.trim()),
      descripcion: sanitizeText(descripcion.trim()),
      fecha,
      hora,
      ubicacion: sanitizeText(ubicacion.trim()),
      tipo,
      items_necesarios: items.map((t, idx) => ({
        id: 'item_' + Date.now() + '_' + idx,
        titulo: sanitizeText(t),
        completado: false,
      })),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE7DA] bg-[#FAF6F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E07A5F] text-white flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
              Planear Asado / Reunión Familiar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1">
              Nombre del Evento
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
              placeholder="ej. Asado de Domingo o Pizza Night"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1">
                Hora
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1">
              Lugar / Quincho
            </label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
              placeholder="ej. Quincho de mamá y papá"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1">
              Tipo de Encuentro
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['asado', 'cena', 'reunion', 'cumpleanos', 'viaje'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    tipo === t
                      ? 'bg-[#E07A5F] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist creation */}
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 uppercase tracking-wider block mb-1.5">
              Lista inicial de compras y tareas
            </label>
            <div className="space-y-1.5 mb-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-[#FAF6F0] rounded-xl text-xs border border-[#EFE7DA]"
                >
                  <span>• {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                placeholder="Agregar tarea (ej. Llevar hielo)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="p-2 bg-[#819B84] text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#EFE7DA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#E07A5F] hover:bg-[#C9654C] text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform"
            >
              Agendar Encuentro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
