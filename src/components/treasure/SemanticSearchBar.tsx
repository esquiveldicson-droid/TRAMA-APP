import React, { useState } from 'react';
import { useGeminiSearch } from '../../hooks/useGeminiSearch';
import { Search, Sparkles, X, Filter } from 'lucide-react';
import { PostCard } from '../feed/PostCard';
import { useFamilyStore } from '../../store/useFamilyStore';

interface Props {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const SemanticSearchBar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const users = useFamilyStore((state) => state.users);
  const [query, setQuery] = useState('');
  const { search, clearSearch, result, isLoading } = useGeminiSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    search(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const filterTabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'receta', label: 'Solo Recetas' },
    { id: 'recuerdo', label: 'Solo Recuerdos' },
    { id: 'viaje', label: 'Solo Viajes' },
    { id: 'logro', label: 'Solo Logros' },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pregúntale al tesoro: ej. ¿Dónde fuimos de pesca?"
            className="w-full pl-10 pr-20 py-3 bg-[#FFFDF9] rounded-2xl border border-[#EFE7DA] text-xs sm:text-sm focus:outline-none focus:border-[#E07A5F] shadow-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-3 py-1.5 bg-[#E07A5F] hover:bg-[#C9654C] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isLoading ? '...' : 'Buscar'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === tab.id
                ? 'bg-[#E07A5F] text-white border-transparent shadow-xs'
                : 'bg-white text-stone-600 border-[#EFE7DA] hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Semantic Search AI Result */}
      {result && (
        <div className="p-4 bg-gradient-to-br from-[#FFFDF9] to-[#FAF0E6] rounded-3xl border border-[#E07A5F]/30 shadow-sm animate-in zoom-in-95 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E07A5F]">
              <Sparkles className="w-4 h-4" />
              <span>Resultado de Búsqueda Semántica con IA</span>
            </div>
            <button
              onClick={clearSearch}
              className="text-[11px] text-stone-400 hover:text-stone-600 font-semibold"
            >
              Cerrar
            </button>
          </div>

          <p className="text-xs text-[#2C2724] bg-white/80 p-2.5 rounded-xl border border-[#EFE7DA] italic">
            "{result.explanation}"
          </p>

          {result.post ? (
            <PostCard
              post={result.post}
              author={users.find((u) => u.id === result.post?.autor_id)}
            />
          ) : (
            <p className="text-xs text-stone-500 italic text-center py-2">
              No encontramos publicaciones que coincidan específicamente con esa anécdota.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
