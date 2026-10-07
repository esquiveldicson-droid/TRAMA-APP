import React, { useState } from 'react';
import { FamilyPost, FamilyUser } from '../../types/family';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import { ReactionPicker } from './ReactionPicker';
import {
  MessageCircle,
  MoreVertical,
  Trash2,
  Edit2,
  Sparkles,
  Send,
  Utensils,
  Camera,
  Trophy,
  Plane,
} from 'lucide-react';

interface PostCardProps {
  post: FamilyPost;
  author?: FamilyUser;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author }) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const deletePost = useFamilyStore((state) => state.deletePost);
  const editPost = useFamilyStore((state) => state.editPost);
  const addComment = useFamilyStore((state) => state.addComment);

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.contenido);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [imageError, setImageError] = useState(false);

  const isMyPost = currentUser ? post.autor_id === currentUser.id : false;

  // Category chip styling
  const categoryConfig: Record<
    string,
    { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    receta: { label: 'Receta', bg: 'bg-[#E07A5F]/15', text: 'text-[#C9654C]', icon: Utensils },
    recuerdo: { label: 'Recuerdo', bg: 'bg-[#F2CC8F]/30', text: 'text-[#8C6D23]', icon: Camera },
    logro: { label: 'Logro', bg: 'bg-[#819B84]/20', text: 'text-[#556F57]', icon: Trophy },
    viaje: { label: 'Viaje', bg: 'bg-[#3D5A80]/15', text: 'text-[#293D57]', icon: Plane },
  };

  const cat = categoryConfig[post.categoria] || categoryConfig.recuerdo;
  const CategoryIcon = cat.icon;

  // Relative time formatter
  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const minutes = Math.floor(diffMs / (1000 * 60));
      if (minutes < 1) return 'Justo ahora';
      if (minutes < 60) return `Hace ${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Hace ${hours} h`;
      const days = Math.floor(hours / 24);
      if (days === 1) return 'Ayer';
      if (days < 30) return `Hace ${days} días`;
      return new Date(isoString).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recientemente';
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedText.trim()) return;
    editPost(post.id, editedText.trim());
    setIsEditing(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const isLongText = post.contenido.length > 220;
  const displayText =
    isLongText && !isExpanded ? `${post.contenido.slice(0, 220)}...` : post.contenido;

  return (
    <article className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border border-[#EFE7DA] shadow-xs mb-4 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar user={author} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#2C2724]">
                {author?.nombre || 'Miembro'}
              </h3>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                <CategoryIcon className="w-2.5 h-2.5" />
                <span>{cat.label}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#2C2724]/60">
              <span>{formatRelativeTime(post.fecha)}</span>
              {post.editado && <span className="text-[10px] italic text-stone-400">• editado</span>}
            </div>
          </div>
        </div>

        {/* Post Options Menu */}
        {isMyPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              aria-label="Opciones del post"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#EFE7DA] py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      deletePost(post.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post Body */}
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="mb-3 space-y-2">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#E07A5F]"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#E07A5F] text-white text-xs font-bold rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-[#2C2724] leading-relaxed mb-3">
          <p>{displayText}</p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-[#E07A5F] hover:underline mt-1 block"
            >
              {isExpanded ? 'Leer menos' : 'Leer más'}
            </button>
          )}
        </div>
      )}

      {/* Post Photo */}
      {post.imagen_url && !imageError && (
        <div className="rounded-xl overflow-hidden mb-3.5 bg-stone-100 border border-[#EFE7DA] max-h-96">
          <img
            src={post.imagen_url}
            alt="Foto compartida"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover max-h-96 hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* AI Metadata pill if present */}
      {post.ia_metadata?.resumen_ia && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6F0] rounded-xl text-[11px] text-[#2C2724]/75 mb-3 border border-[#EFE7DA]/60">
          <Sparkles className="w-3 h-3 text-[#E07A5F] shrink-0" />
          <span className="truncate italic">{post.ia_metadata.resumen_ia}</span>
        </div>
      )}

      {/* Reactions & Comments Bar */}
      <div className="pt-2.5 border-t border-[#EFE7DA] flex items-center justify-between">
        <ReactionPicker post={post} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#2C2724] px-2 py-1 rounded-lg transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-stone-400" />
          <span>{post.comentarios.length}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
          {post.comentarios.length === 0 ? (
            <p className="text-xs text-stone-400 italic text-center py-1">
              Aún no hay comentarios. ¡Sé el primero en dejar un abrazo!
            </p>
          ) : (
            post.comentarios.map((c) => (
              <div key={c.id} className="text-xs bg-[#FAF6F0] p-2.5 rounded-xl border border-[#EFE7DA]/50">
                <span className="font-bold text-[#2C2724] mr-1.5">
                  {c.autor_id.replace('user_', '')}:
                </span>
                <span className="text-[#2C2724]/90">{c.contenido}</span>
              </div>
            ))
          )}

          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Escribe un comentario cariñoso..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#E07A5F]"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 bg-[#E07A5F] hover:bg-[#C9654C] disabled:opacity-50 text-white rounded-xl shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
