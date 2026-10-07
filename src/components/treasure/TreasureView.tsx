import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Recipe } from '../../types/family';
import { SemanticSearchBar } from './SemanticSearchBar';
import { RecipeCard } from './RecipeCard';
import { RecipeReaderModal } from './RecipeReaderModal';
import { AudioStoryPlayer } from './AudioStoryPlayer';
import { HallOfFameSection } from './HallOfFameSection';
import { TimeCapsuleSection } from './TimeCapsuleSection';
import { CreateRecipeModal } from './CreateRecipeModal';
import { Utensils, BookOpen, Quote, Lock, Plus, Sparkles } from 'lucide-react';

export const TreasureView: React.FC = () => {
  const recipes = useFamilyStore((state) => state.recipes);
  const audioStory = useFamilyStore((state) => state.audioStory);

  const [activeSubTab, setActiveSubTab] = useState<'recetas' | 'historias' | 'frases' | 'capsulas'>('recetas');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [readingRecipe, setReadingRecipe] = useState<Recipe | null>(null);
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);

  // Sub tab definitions
  const subTabs = [
    { id: 'recetas', label: 'Recetario', icon: Utensils },
    { id: 'historias', label: 'Historias', icon: BookOpen },
    { id: 'frases', label: 'Hall of Fame', icon: Quote },
    { id: 'capsulas', label: 'Cápsulas', icon: Lock },
  ];

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Header */}
      <div className="mb-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>El Legado de Nuestra Familia</span>
        </div>
        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2724]">
          Tesoro Familiar
        </h2>
        <p className="text-xs text-[#2C2724]/70">
          Secretos de cocina, voces que no se apagan y frases inolvidables
        </p>
      </div>

      {/* Semantic Search Bar with AI */}
      <SemanticSearchBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Sub-tabs Navigation */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#FFFDF9] rounded-2xl border border-[#EFE7DA] shadow-xs mb-5">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#E07A5F] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#2C2724] hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] sm:text-xs truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: Recetario */}
      {activeSubTab === 'recetas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#2C2724]/70">
              Recetas de Mamá y los Abuelos ({recipes.length})
            </h3>
            <button
              onClick={() => setIsCreateRecipeOpen(true)}
              className="text-xs font-bold text-[#E07A5F] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Receta</span>
            </button>
          </div>

          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpenReader={(r) => setReadingRecipe(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Historias Sonoras */}
      {activeSubTab === 'historias' && (
        <div className="space-y-4">
          <AudioStoryPlayer story={audioStory} />

          {/* Family Tree / Narrative Note */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DA] space-y-2">
            <h4 className="font-['Playfair_Display'] font-bold text-sm text-[#2C2724]">
              Árbol de los Recuerdos
            </h4>
            <p className="text-xs text-[#2C2724]/80 leading-relaxed">
              Las historias grabadas con la voz de nuestros padres y abuelos son el tesoro más grande. Puedes escuchar las anécdotas de juventud tantas veces como quieras.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Hall of Fame */}
      {activeSubTab === 'frases' && <HallOfFameSection />}

      {/* Sub-tab 4: Cápsulas */}
      {activeSubTab === 'capsulas' && <TimeCapsuleSection />}

      {/* Modals */}
      <RecipeReaderModal
        recipe={readingRecipe}
        onClose={() => setReadingRecipe(null)}
      />

      <CreateRecipeModal
        isOpen={isCreateRecipeOpen}
        onClose={() => setIsCreateRecipeOpen(false)}
      />
    </div>
  );
};
