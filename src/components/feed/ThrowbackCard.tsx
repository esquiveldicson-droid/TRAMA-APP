import React, { useState } from 'react';
import { FamilyPost, FamilyUser } from '../../types/family';
import { Avatar } from '../common/Avatar';
import { ReactionPicker } from './ReactionPicker';
import { Sparkles, Calendar, MessageCircle, Heart } from 'lucide-react';
import { useFamilyStore } from '../../store/useFamilyStore';

interface ThrowbackCardProps {
  post: FamilyPost;
  author?: FamilyUser;
}

export const ThrowbackCard: React.FC<ThrowbackCardProps> = ({ post, author }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const addComment = useFamilyStore((state) => state.addComment);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(post.id, newComment.trim());
    setNewComment('');
  };

  return (
    <article className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border-2 border-[#F2CC8F] shadow-md shadow-[#F2CC8F]/15 mb-4 relative overflow-hidden">
      {/* Top Banner Ribbon */}
      <div className="flex items-center justify-between mb-3 bg-[#FAF0E6] -mx-4 -mt-4 px-4 py-2 border-b border-[#F2CC8F]/40">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9654C]">
          <Sparkles className="w-4 h-4 text-[#E07A5F]" />
          <span>EN ESTE DÍA EN NUESTRA FAMILIA</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
          <Calendar className="w-3 h-3 text-[#E07A5F]" />
          <span>Hace 3 años</span>
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar user={author} size="md" />
        <div>
          <h3 className="font-bold text-sm text-[#2C2724]">
            {author?.nombre || 'Familia'}
          </h3>
          <p className="text-[11px] text-[#2C2724]/60">
            {author?.apodo_IA || 'Recuerdo Inmortal'}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[#2C2724] leading-relaxed mb-3">
        {post.contenido}
      </p>

      {/* Polaroid-style photo frame if present */}
      {post.imagen_url && (
        <div className="bg-white p-2.5 pb-4 rounded-2xl shadow-sm border border-stone-200 mb-3.5 transform rotate-[-0.5deg]">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-stone-100">
            <img
              src={post.imagen_url}
              alt="Recuerdo familiar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-2 text-center text-xs font-['Playfair_Display'] italic text-stone-500">
            "Momentos que quedan para siempre en el corazón"
          </div>
        </div>
      )}

      {/* Reactions Row */}
      <div className="pt-2 border-t border-[#EFE7DA] flex items-center justify-between">
        <ReactionPicker post={post} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#2C2724] px-2 py-1 rounded-lg"
        >
          <MessageCircle className="w-4 h-4 text-stone-400" />
          <span>{post.comentarios.length}</span>
        </button>
      </div>

      {/* Expandable comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
          {post.comentarios.map((c) => (
            <div key={c.id} className="text-xs bg-[#FAF6F0] p-2 rounded-xl">
              <span className="font-bold mr-1 text-[#2C2724]">{c.autor_id.replace('user_', '')}:</span>
              <span className="text-stone-700">{c.contenido}</span>
            </div>
          ))}

          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Recordar juntos..."
              className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
            />
            <button
              type="submit"
              className="text-xs px-3 py-1.5 bg-[#E07A5F] text-white font-bold rounded-xl"
            >
              Comentar
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
