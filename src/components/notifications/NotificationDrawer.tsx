import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { FamilyNotification } from '../../types/family';
import { Avatar } from '../common/Avatar';
import {
  X,
  Bell,
  Heart,
  MessageCircle,
  Calendar,
  Camera,
  Smile,
  CheckCheck,
  Send,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const notifications = useFamilyStore((state) => state.notifications);
  const users = useFamilyStore((state) => state.users);
  const markNotificationAsRead = useFamilyStore((state) => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useFamilyStore((state) => state.markAllNotificationsAsRead);
  const sendTestNotification = useFamilyStore((state) => state.sendTestNotification);
  const showToast = useFamilyStore((state) => state.showToast);

  const [activeFilter, setActiveFilter] = useState<'todas' | 'sin_leer' | 'reaccion' | 'comentario' | 'evento'>('todas');
  const [permissionState, setPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === 'granted') {
          showToast('¡Notificaciones activadas en tu dispositivo!', 'success');
        } else {
          showToast('Permiso de notificaciones bloqueado en el navegador', 'warning');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'sin_leer') return !notif.leida;
    if (activeFilter === 'reaccion') return notif.tipo === 'reaccion';
    if (activeFilter === 'comentario') return notif.tipo === 'comentario';
    if (activeFilter === 'evento') return notif.tipo === 'evento';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Ahora';
      if (mins < 60) return `${mins}m`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}d`;
    } catch {
      return '';
    }
  };

  const getNotifIcon = (tipo: FamilyNotification['tipo']) => {
    switch (tipo) {
      case 'reaccion':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comentario':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />;
      case 'evento':
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case 'post':
        return <Camera className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Smile className="w-3.5 h-3.5 text-[var(--theme-primary)]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary)] flex items-center justify-center text-white shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Playfair_Display'] font-bold text-base text-[var(--text-primary)]">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)] text-white text-[10px] font-bold">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Actividad de la familia en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 text-xs text-[var(--theme-primary)] hover:underline flex items-center gap-1"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Permission Banner (if not granted) */}
        {permissionState !== 'granted' && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <Bell className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
              <span className="text-[11px] font-medium leading-tight">
                ¿Recibir avisos en tu celular cuando la familia publique?
              </span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] shrink-0"
            >
              Activar
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1.5 px-4 pt-3 pb-2 overflow-x-auto no-scrollbar border-b border-[#EFE7DA] dark:border-[#35302A]">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'sin_leer', label: `Sin leer (${unreadCount})` },
            { id: 'reaccion', label: 'Reacciones' },
            { id: 'comentario', label: 'Comentarios' },
            { id: 'evento', label: 'Eventos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-[var(--text-muted)] hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No tienes notificaciones en esta sección
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Cuando tu familia reaccione o comente, te avisaremos aquí.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const actor = users.find((u) => u.id === notif.actor_id);

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                    !notif.leida
                      ? 'bg-[var(--theme-primary-soft)]/50 border-[var(--theme-primary)]/40 dark:bg-stone-800/80'
                      : 'bg-white dark:bg-[#282420] border-[#EFE7DA] dark:border-[#35302A] opacity-90'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar user={actor} size="md" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                      {getNotifIcon(notif.tipo)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {notif.titulo}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                        {formatRelativeTime(notif.fecha)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] opacity-85 leading-relaxed line-clamp-2">
                      {notif.mensaje}
                    </p>
                  </div>

                  {!notif.leida && (
                    <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Test Notification Trigger */}
        <div className="p-3 border-t border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[var(--text-muted)]">
            ¿Quieres probar cómo se reciben?
          </span>
          <button
            onClick={sendTestNotification}
            className="px-3 py-1.5 bg-white dark:bg-[#282420] hover:bg-stone-50 border border-stone-200 dark:border-stone-700 text-[var(--theme-primary)] rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Aviso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
