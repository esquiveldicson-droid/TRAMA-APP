import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { sanitizeText } from '../../services/geminiService';
import { X, Utensils, Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRecipeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const addRecipe = useFamilyStore((state) => state.addRecipe);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempo, setTiempo] = useState(45);
  const [porciones, setPorciones] = useState(6);
  const [secreto, setSecreto] = useState('');
  const [imagenUrl, setImagenUrl] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
  );

  const [ingredientes, setIngredientes] = useState<string[]>(['1 kg de harina', '2 huevos']);
  const [newIngrediente, setNewIngrediente] = useState('');

  const [pasos, setPasos] = useState<string[]>(['Mezclar los ingredientes secos', 'Hornear a fuego medio']);
  const [newPaso, setNewPaso] = useState('');

  if (!isOpen) return null;

  const handleAddIng = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngrediente.trim()) return;
    setIngredientes([...ingredientes, newIngrediente.trim()]);
    setNewIngrediente('');
  };

  const handleAddPaso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaso.trim()) return;
    setPasos([...pasos, newPaso.trim()]);
    setNewPaso('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    addRecipe({
      creador_id: currentUser ? currentUser.id : 'admin',
      titulo: sanitizeText(titulo.trim()),
      descripcion: sanitizeText(descripcion.trim()),
      tiempo_minutos: Number(tiempo),
      porciones: Number(porciones),
      categoria: 'plato_fuerte',
      ingredientes: ingredientes.map(sanitizeText),
      pasos: pasos.map(sanitizeText),
      imagen_url: imagenUrl,
      secreto_familiar: secreto ? sanitizeText(secreto.trim()) : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6">
        <div className="p-4 border-b border-[#EFE7DA] bg-[#FAF6F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#E07A5F]" />
            <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
              Agregar Receta al Tesoro Familiar
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
              Nombre del Plato
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="ej. Canelones de la Nonna"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
              Breve Historia / Descripción
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Por qué este plato es especial para nosotros..."
              className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                Tiempo (min)
              </label>
              <input
                type="number"
                value={tiempo}
                onChange={(e) => setTiempo(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                Porciones
              </label>
              <input
                type="number"
                value={porciones}
                onChange={(e) => setPorciones(Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Ingredientes list */}
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
              Ingredientes
            </label>
            <div className="space-y-1 mb-2">
              {ingredientes.map((ing, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-stone-50 p-1.5 rounded-lg">
                  <span>• {ing}</span>
                  <button
                    type="button"
                    onClick={() => setIngredientes(ingredientes.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngrediente}
                onChange={(e) => setNewIngrediente(e.target.value)}
                placeholder="Agregar ingrediente..."
                className="flex-1 p-2 text-xs rounded-xl border border-stone-300"
              />
              <button
                type="button"
                onClick={handleAddIng}
                className="px-3 bg-[#819B84] text-white rounded-xl text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Pasos list */}
          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
              Pasos de Preparación
            </label>
            <div className="space-y-1 mb-2">
              {pasos.map((paso, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-stone-50 p-1.5 rounded-lg">
                  <span>{i + 1}. {paso}</span>
                  <button
                    type="button"
                    onClick={() => setPasos(pasos.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPaso}
                onChange={(e) => setNewPaso(e.target.value)}
                placeholder="Agregar paso..."
                className="flex-1 p-2 text-xs rounded-xl border border-stone-300"
              />
              <button
                type="button"
                onClick={handleAddPaso}
                className="px-3 bg-[#819B84] text-white rounded-xl text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
              Secreto de la Familia (Opcional)
            </label>
            <input
              type="text"
              value={secreto}
              onChange={(e) => setSecreto(e.target.value)}
              placeholder="ej. Dejar reposar la masa tapada con repasador"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#EFE7DA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#E07A5F] text-white text-xs font-bold rounded-xl shadow-md"
            >
              Guardar Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
