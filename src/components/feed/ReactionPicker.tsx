import React, { useState } from 'react';
import { FamilyPost, PostReaction } from '../../types/family';
import { useFamilyStore } from '../../store/useFamilyStore';

interface ReactionPickerProps {
  post: FamilyPost;
}

const FAMILY_REACTIONS: Array<{ emoji: PostReaction['emoji']; label: string }> = [
  { emoji: '❤️', label: 'Amor familiar' },
  { emoji: '😂', label: 'Risas de sobremesa' },
  { emoji: '👏', label: 'Orgullo' },
  { emoji: '🥺', label: 'Nostalgia' },
  { emoji: '🥘', label: '¡Guárdame!' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ post }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const toggleReaction = useFamilyStore((state) => state.toggleReaction);

  const [isOpen, setIsOpen] = useState(false);

  // Group reactions by emoji
  const counts: Record<string, number> = {};
  post.reacciones.forEach((r) => {
    counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  });

  const myReaction = currentUser ? post.reacciones.find((r) => r.user_id === currentUser.id) : undefined;

  const handleSelect = (emoji: PostReaction['emoji'], label: string) => {
    toggleReaction(post.id, emoji, label);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 flex-wrap">
      {/* Existing Reaction Badges */}
      {Object.entries(counts).map(([emoji, count]) => {
        const isSelectedByMe = myReaction?.emoji === emoji;
        return (
          <button
            key={emoji}
            onClick={() => {
              const item = FAMILY_REACTIONS.find((r) => r.emoji === emoji);
              if (item) toggleReaction(post.id, item.emoji, item.label);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-transform active:scale-90 border ${
              isSelectedByMe
                ? 'bg-[#E07A5F]/15 border-[#E07A5F] text-[#C9654C]'
                : 'bg-white border-[#EFE7DA] text-[#2C2724]/80 hover:bg-stone-50'
            }`}
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        );
      })}

      {/* Add Reaction Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
          myReaction
            ? 'bg-[#E07A5F]/10 border-[#E07A5F]/40 text-[#E07A5F]'
            : 'bg-white border-dashed border-stone-300 text-stone-500 hover:border-stone-400'
        }`}
        title="Reaccionar a este momento"
        aria-label="Seleccionar reacción"
      >
        {myReaction ? myReaction.emoji : '➕'}
      </button>

      {/* Floating Reaction Selector Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#EFE7DA] p-1.5 flex items-center gap-1.5 animate-in zoom-in-90 duration-150">
            {FAMILY_REACTIONS.map((item) => (
              <button
                key={item.emoji}
                onClick={() => handleSelect(item.emoji, item.label)}
                className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                title={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
