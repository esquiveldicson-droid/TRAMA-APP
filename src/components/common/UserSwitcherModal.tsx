import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { FamilyUser } from '../../types/family';
import { Avatar } from './Avatar';
import { InviteFamilyModal } from '../settings/InviteFamilyModal';
import { X, Lock, Check, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const setCurrentUser = useFamilyStore((state) => state.setCurrentUser);
  const familyName = useFamilyStore((state) => state.familyName);

  const [magicEmail, setMagicEmail] = useState('');
  const [magicError, setMagicError] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!isOpen) return null;

  const handleSelectUser = (user: FamilyUser) => {
    setCurrentUser(user);
    setMagicError('');
    onClose();
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMagicError('');

    const target = users.find(
      (u) => u.email.toLowerCase() === magicEmail.trim().toLowerCase()
    );

    if (target) {
      setCurrentUser(target);
      setMagicEmail('');
      onClose();
    } else {
      setMagicError('Ups, parece que no eres de la familia. Esta red es 100% privada y exclusiva para los integrantes autorizados.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
        <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE7DA] dark:border-[#35302A] flex items-center justify-between bg-[#FAF6F0] dark:bg-[#1A1816]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--theme-primary-soft)] flex items-center justify-center text-[var(--theme-primary)]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-lg text-[var(--text-primary)]">
                  Acceso Familiar Privado
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {familyName} • Cambiar de integrante
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Integrantes ({users.length})
                </span>
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="text-xs font-bold text-[var(--theme-primary)] hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Nuevo</span>
                </button>
              </div>

              <div className="space-y-2">
                {users.map((user) => {
                  const isSelected = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-soft)] ring-1 ring-[var(--theme-primary)]'
                          : 'border-[#EFE7DA] dark:border-[#35302A] bg-white dark:bg-[#282420] hover:bg-[#FAF6F0] dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar user={user} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--text-primary)]">
                              {user.nombre}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full capitalize bg-stone-100 dark:bg-stone-800 font-semibold text-[var(--text-muted)]">
                              {user.rol}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--theme-primary)] font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {user.apodo_IA}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[var(--theme-primary)] flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Verification */}
            <div className="pt-2 border-t border-[#EFE7DA] dark:border-[#35302A]">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                Acceso por Correo Familiar
              </span>
              <form onSubmit={handleMagicLinkSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    placeholder="ej. familiar@gmail.com"
                    className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)] focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    Entrar
                  </button>
                </div>

                {magicError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{magicError}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <InviteFamilyModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </>
  );
};
