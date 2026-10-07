import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import { Plus, Smile, X } from 'lucide-react';
import { FamilyUser } from '../../types/family';

export const StatusStrip: React.FC = () => {
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const dailyStatuses = useFamilyStore((state) => state.dailyStatuses);
  const updateDailyStatus = useFamilyStore((state) => state.updateDailyStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserStatus, setSelectedUserStatus] = useState<{
    user: FamilyUser;
    emoji: string;
    text: string;
  } | null>(null);

  const [inputEmoji, setInputEmoji] = useState('☕');
  const [inputText, setInputText] = useState('');

  const quickEmojis = ['☕', '🥩', '🎨', '⚽', '💻', '🚗', '📚', '🌻', '🛋️', '🍕'];

  const handleOpenMyStatus = () => {
    if (!currentUser) return;
    const currentStatus = dailyStatuses.find((s) => s.user_id === currentUser.id);
    if (currentStatus) {
      setInputEmoji(currentStatus.emoji_status);
      setInputText(currentStatus.texto_status);
    } else {
      setInputEmoji('☕');
      setInputText('');
    }
    setIsModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    updateDailyStatus(inputEmoji, inputText.trim());
    setIsModalOpen(false);
  };

  const handleUserClick = (user: FamilyUser) => {
    if (currentUser && user.id === currentUser.id) {
      handleOpenMyStatus();
    } else {
      const status = dailyStatuses.find((s) => s.user_id === user.id);
      setSelectedUserStatus({
        user,
        emoji: status?.emoji_status || '🏡',
        text: status?.texto_status || 'Descansando en casa',
      });
    }
  };

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Estados de Hoy
        </h2>
        <span className="text-[11px] text-emerald-600 font-semibold">
          {users.length} familiares
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
        {users.map((user) => {
          const isMe = currentUser ? user.id === currentUser.id : false;
          const status = dailyStatuses.find((s) => s.user_id === user.id);

          return (
            <button
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="flex flex-col items-center shrink-0 group relative text-center focus:outline-none"
            >
              <div className="relative">
                <Avatar
                  user={user}
                  size="lg"
                  className={`ring-2 ${isMe ? 'ring-[#E07A5F] ring-offset-2' : 'ring-transparent'}`}
                />
                {/* Emoji badge */}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#EFE7DA] shadow-xs flex items-center justify-center text-sm">
                  {status?.emoji_status || '🏡'}
                </span>
                {isMe && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#E07A5F] text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-white">
                    <Plus className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-[#2C2724] mt-1.5 max-w-[64px] truncate">
                {isMe ? 'Tú' : user.nombre.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#2C2724]/60 max-w-[70px] truncate leading-tight">
                {status?.texto_status || 'Sin estado'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modal to update your status */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#EFE7DA] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#E07A5F]" />
                <h3 className="font-bold text-base text-[#2C2724]">
                  ¿En qué andas hoy?
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-2 block">
                  Elige un emoji representativo
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickEmojis.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setInputEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        inputEmoji === emoji
                          ? 'bg-[#E07A5F]/20 ring-2 ring-[#E07A5F] scale-110'
                          : 'bg-stone-100 hover:bg-stone-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">
                  Mensaje corto para la familia
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="ej. Cocinando algo rico, ¡pasen más tarde!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#E07A5F]"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-2 bg-[#E07A5F] hover:bg-[#C9654C] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Guardar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popover to view another family member's status */}
      {selectedUserStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] w-full max-w-xs rounded-3xl p-5 shadow-2xl border border-[#EFE7DA] text-center animate-in zoom-in-95">
            <Avatar user={selectedUserStatus.user} size="xl" className="mx-auto mb-3" />
            <h4 className="font-bold text-base text-[#2C2724]">
              {selectedUserStatus.user.nombre}
            </h4>
            <span className="text-xs text-[#E07A5F] font-semibold block mb-3">
              {selectedUserStatus.user.apodo_IA}
            </span>
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EFE7DA] mb-4">
              <span className="text-2xl block mb-1">{selectedUserStatus.emoji}</span>
              <p className="text-sm font-medium text-[#2C2724]">
                "{selectedUserStatus.text}"
              </p>
            </div>
            <button
              onClick={() => setSelectedUserStatus(null)}
              className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
