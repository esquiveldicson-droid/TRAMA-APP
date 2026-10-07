import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import { Quote, Plus, Sparkles, X } from 'lucide-react';
import { sanitizeText } from '../../services/geminiService';

export const HallOfFameSection: React.FC = () => {
  const quotes = useFamilyStore((state) => state.quotes);
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const addQuote = useFamilyStore((state) => state.addQuote);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [frase, setFrase] = useState('');
  const [autorId, setAutorId] = useState(users[0]?.id || 'user_papa');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [contexto, setContexto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frase.trim()) return;

    addQuote({
      frase: sanitizeText(frase.trim()),
      autor_frase_id: autorId,
      publicador_id: currentUser ? currentUser.id : 'admin',
      anio: Number(anio),
      contexto: sanitizeText(contexto.trim()),
    });

    setFrase('');
    setContexto('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-['Playfair_Display'] font-bold text-base text-[#2C2724]">
            Hall of Fame de Frases Épicas
          </h3>
          <p className="text-xs text-[#2C2724]/60">
            Dichos célebres, salidas graciosas y lecciones inolvidables
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-[#E07A5F] hover:bg-[#C9654C] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Inmortalizar</span>
        </button>
      </div>

      <div className="grid gap-3">
        {quotes.map((q) => {
          const author = users.find((u) => u.id === q.autor_frase_id);

          return (
            <div
              key={q.id}
              className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border border-[#EFE7DA] shadow-xs relative overflow-hidden"
            >
              <Quote className="absolute top-3 right-3 w-10 h-10 text-[#E07A5F]/10 stroke-1 pointer-events-none" />

              <p className="font-['Playfair_Display'] font-bold text-sm sm:text-base text-[#2C2724] leading-relaxed mb-3">
                "{q.frase}"
              </p>

              <div className="flex items-center justify-between border-t border-[#EFE7DA] pt-3">
                <div className="flex items-center gap-2.5">
                  <Avatar user={author} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2C2724]">
                      {author?.nombre || 'Familia'}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-semibold">
                      Año {q.anio}
                    </span>
                  </div>
                </div>

                {q.contexto && (
                  <span className="text-[11px] text-[#2C2724]/60 italic max-w-[170px] truncate text-right">
                    {q.contexto}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add quote */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#EFE7DA] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#2C2724] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                <span>Agregar Frase al Hall of Fame</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                  La Frase Célebre
                </label>
                <textarea
                  required
                  rows={3}
                  value={frase}
                  onChange={(e) => setFrase(e.target.value)}
                  placeholder="ej. El asado no se apura..."
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                    ¿Quién la dijo?
                  </label>
                  <select
                    value={autorId}
                    onChange={(e) => setAutorId(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-stone-300"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                    Año
                  </label>
                  <input
                    type="number"
                    value={anio}
                    onChange={(e) => setAnio(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2C2724]/70 block mb-1">
                  Contexto o Momento
                </label>
                <input
                  type="text"
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  placeholder="ej. En las vacaciones de 2021 en la playa"
                  className="w-full p-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E07A5F] text-white text-xs font-bold rounded-xl"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
