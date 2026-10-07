import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { StatusStrip } from './StatusStrip';
import { DailyChallengeCard } from './DailyChallengeCard';
import { PostCard } from './PostCard';
import { ThrowbackCard } from './ThrowbackCard';
import { CreatePostModal } from './CreatePostModal';
import { Avatar } from '../common/Avatar';
import { Plus, Image as ImageIcon, Sparkles, Heart } from 'lucide-react';

export const FeedView: React.FC = () => {
  const posts = useFamilyStore((state) => state.posts);
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Separate regular posts from special throwback post
  const regularPosts = posts.filter((p) => !p.es_recuerdo_especial);
  const throwbackPost = posts.find((p) => p.es_recuerdo_especial);

  // Build the feed list
  const feedItems: Array<{ type: 'post' | 'throwback'; data: any }> = [];

  regularPosts.forEach((post, index) => {
    if (index === 1 && throwbackPost) {
      feedItems.push({ type: 'throwback', data: throwbackPost });
    }
    feedItems.push({ type: 'post', data: post });
  });

  if (regularPosts.length <= 1 && throwbackPost && !feedItems.some((i) => i.type === 'throwback')) {
    feedItems.push({ type: 'throwback', data: throwbackPost });
  }

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* 1. Status Strip */}
      <StatusStrip />

      {/* 2. Quick Post Creator Trigger */}
      <div
        onClick={() => setIsCreateOpen(true)}
        className="bg-[#FFFDF9] dark:bg-[#201D1A] rounded-2xl p-3.5 mb-4 border border-[#EFE7DA] dark:border-[#35302A] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[var(--theme-primary)]/40 transition-colors"
      >
        <Avatar user={currentUser || undefined} size="sm" />
        <div className="flex-1 text-xs text-[var(--text-muted)] font-medium">
          ¿Qué estás pensando para la familia hoy?
        </div>
        <div className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#282420] text-[var(--theme-primary)]">
          <ImageIcon className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Daily AI Challenge */}
      <DailyChallengeCard />

      {/* 4. Posts Feed */}
      {feedItems.length === 0 ? (
        <div className="bg-[#FFFDF9] dark:bg-[#201D1A] rounded-3xl p-8 text-center border border-[#EFE7DA] dark:border-[#35302A] my-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary-soft)] text-[var(--theme-primary)] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-['Playfair_Display'] text-base font-bold text-[var(--text-primary)]">
            Tu Muro Familiar está Listo
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
            Aún no hay publicaciones. Sé el primero en compartir una foto, receta o recuerdo familiar.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform"
          >
            + Publicar Primer Momento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => {
            if (item.type === 'throwback') {
              const author = users.find((u) => u.id === item.data.autor_id);
              return (
                <ThrowbackCard
                  key={item.data.id}
                  post={item.data}
                  author={author}
                />
              );
            }

            const author = users.find((u) => u.id === item.data.autor_id);
            return (
              <PostCard
                key={item.data.id}
                post={item.data}
                author={author}
              />
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-[var(--theme-primary)] active:scale-95 text-white shadow-xl shadow-[var(--theme-primary)]/40 flex items-center justify-center transition-all"
        aria-label="Crear nueva publicación"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Create Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};
