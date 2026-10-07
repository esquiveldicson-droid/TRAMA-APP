import React from 'react';
import { Recipe } from '../../types/family';
import { Clock, Users, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  recipe: Recipe;
  onOpenReader: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<Props> = ({ recipe, onOpenReader }) => {
  return (
    <article
      onClick={() => onOpenReader(recipe)}
      className="bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#EFE7DA] shadow-xs hover:border-[#E07A5F]/40 cursor-pointer transition-all group"
    >
      {/* Recipe Photo */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        <img
          src={recipe.imagen_url}
          alt={recipe.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#E07A5F] rounded-md inline-block mb-1">
            Receta de la Familia
          </span>
          <h3 className="font-['Playfair_Display'] font-bold text-base leading-tight text-white drop-shadow-sm">
            {recipe.titulo}
          </h3>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        <p className="text-xs text-[#2C2724]/80 line-clamp-2 mb-3">
          {recipe.descripcion}
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-[#EFE7DA] pt-2.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
              {recipe.tiempo_minutos} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#819B84]" />
              {recipe.porciones} porciones
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#E07A5F] font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cocinar</span>
          </div>
        </div>

        {recipe.secreto_familiar && (
          <div className="mt-2.5 px-2.5 py-1.5 bg-[#FAF6F0] rounded-xl text-[10px] text-[#2C2724]/80 italic flex items-center gap-1.5 border border-[#EFE7DA]">
            <Sparkles className="w-3 h-3 text-[#E07A5F] shrink-0" />
            <span className="truncate">Secreto: {recipe.secreto_familiar}</span>
          </div>
        )}
      </div>
    </article>
  );
};
