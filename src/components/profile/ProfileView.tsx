import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import { OnboardingModal } from './OnboardingModal';
import { PostCard } from '../feed/PostCard';
import {
  Sparkles,
  Heart,
  Cake,
  Edit3,
  Users,
  Camera,
  Utensils,
  Flame,
  Settings,
} from 'lucide-react';

interface Props {
  onOpenUserSwitcher: () => void;
  onOpenSettings: () => void;
}

export const ProfileView: React.FC<Props> = ({ onOpenUserSwitcher, onOpenSettings }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const posts = useFamilyStore((state) => state.posts);
  const recipes = useFamilyStore((state) => state.recipes);
  const events = useFamilyStore((state) => state.events);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="pb-24 max-w-md mx-auto px-4 pt-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">No hay usuario activo.</p>
      </div>
    );
  }

  // User posts
  const myPosts = posts.filter((p) => p.autor_id === currentUser.id);
  const myRecipes = recipes.filter((r) => r.creador_id === currentUser.id);

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3 space-y-4">
      {/* Profile Hero Card */}
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] rounded-3xl p-5 border border-[#EFE7DA] dark:border-[#35302A] shadow-xs text-center relative overflow-hidden">
        {/* Background warm pattern */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[var(--theme-primary-soft)] to-transparent pointer-events-none" />

        <div className="relative pt-2">
          <div
            onClick={() => setIsOnboardingOpen(true)}
            className="relative inline-block cursor-pointer mx-auto mb-3 group"
            title="Toca para cambiar tu foto de perfil"
          >
            <Avatar
              user={currentUser}
              size="xl"
              className="shadow-md transition-transform group-hover:scale-105"
              showStatusDot
            />
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text-primary)]">
              {currentUser.nombre}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 capitalize">
              {currentUser.rol}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary-soft)] text-[var(--theme-primary)] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentUser.apodo_IA}</span>
          </div>

          {/* AI Biography */}
          {currentUser.bio_ia && (
            <p className="text-xs text-[var(--text-primary)] opacity-85 italic max-w-sm mx-auto mb-4 bg-[#FAF6F0] dark:bg-[#1A1816] p-3 rounded-2xl border border-[#EFE7DA] dark:border-[#35302A]">
              "{currentUser.bio_ia}"
            </p>
          )}

          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-2 text-xs text-left mb-4">
            <div className="p-2.5 bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[var(--text-muted)] block">Comida Favorita</span>
                <span className="font-bold text-[var(--text-primary)] truncate block">
                  {currentUser.comida_fav}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 dark:bg-[#282420] rounded-xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-2">
              <Cake className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[var(--text-muted)] block">Cumpleaños</span>
                <span className="font-bold text-[var(--text-primary)] truncate block">
                  {new Date(currentUser.cumpleanos).toLocaleDateString('es-ES', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex-1 py-2.5 bg-[#FAF6F0] dark:bg-[#282420] hover:bg-[#EFE7DA] dark:hover:bg-stone-800 text-[var(--text-primary)] text-xs font-bold rounded-xl border border-[#EFE7DA] dark:border-[#35302A] flex items-center justify-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>Editar Ficha</span>
            </button>
            <button
              onClick={onOpenUserSwitcher}
              className="flex-1 py-2.5 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Cambiar Miembro</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2.5 bg-[#FAF6F0] dark:bg-[#282420] hover:bg-[#EFE7DA] dark:hover:bg-stone-800 text-[var(--text-primary)] rounded-xl border border-[#EFE7DA] dark:border-[#35302A] flex items-center justify-center"
              title="Ajustes de la app"
            >
              <Settings className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FFFDF9] dark:bg-[#201D1A] p-3 rounded-2xl border border-[#EFE7DA] dark:border-[#35302A] text-center">
          <Camera className="w-4 h-4 text-[var(--theme-primary)] mx-auto mb-1" />
          <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)] block">
            {myPosts.length}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-semibold">Momentos</span>
        </div>
        <div className="bg-[#FFFDF9] dark:bg-[#201D1A] p-3 rounded-2xl border border-[#EFE7DA] dark:border-[#35302A] text-center">
          <Utensils className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)] block">
            {myRecipes.length}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-semibold">Recetas</span>
        </div>
        <div className="bg-[#FFFDF9] dark:bg-[#201D1A] p-3 rounded-2xl border border-[#EFE7DA] dark:border-[#35302A] text-center">
          <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--text-primary)] block">
            {events.length}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-semibold">Encuentros</span>
        </div>
      </div>

      {/* Compiled Posts by this User */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Publicaciones de {currentUser.nombre.split(' ')[0]} ({myPosts.length})
        </h3>
        {myPosts.length === 0 ? (
          <div className="bg-[#FFFDF9] dark:bg-[#201D1A] rounded-2xl p-6 text-center text-xs text-[var(--text-muted)] border border-[#EFE7DA] dark:border-[#35302A]">
            Aún no has compartido momentos en el muro. ¡Toca el botón + para subir el primero!
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard key={post.id} post={post} author={currentUser} />
          ))
        )}
      </div>

      {/* Onboarding / Edit Sheet */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};
