import React from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Avatar } from './Avatar';
import { TramaLogo } from './TramaLogo';
import { Radio, WifiOff, Users, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenRadio: () => void;
  onOpenUserSwitcher: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRadio,
  onOpenUserSwitcher,
  onOpenSettings,
  onOpenNotifications,
}) => {
  const currentUser = useFamilyStore((state) => state.currentUser);
  const familyName = useFamilyStore((state) => state.familyName);
  const notifications = useFamilyStore((state) => state.notifications);
  const isOnline = useOnlineStatus();

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/90 dark:bg-[#151311]/90 backdrop-blur-md border-b border-[#EFE7DA] dark:border-[#35302A] px-3.5 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand with crisp TramaLogo */}
        <div className="flex items-center gap-2">
          <TramaLogo size={38} />
          <div>
            <h1 className="font-['Nunito',sans-serif] font-black text-base text-[var(--text-primary)] leading-tight flex items-center gap-1.5 tracking-tight">
              TRAMA
              <span className="text-[9px] font-sans font-bold tracking-wider uppercase px-1.5 py-0.5 bg-[var(--theme-primary-soft)] text-[var(--theme-primary)] rounded-md">
                Privada
              </span>
            </h1>
            <p className="text-[11px] text-[var(--text-muted)] font-medium truncate max-w-[130px]">
              {familyName}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Offline indicator */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-300 dark:border-amber-800"
              title="Modo sin conexión activado"
            >
              <WifiOff className="w-3 h-3 text-amber-700 dark:text-amber-300" />
              <span className="hidden xs:inline">Offline</span>
            </div>
          )}

          {/* Social Notifications Bell button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-[#EFE7DA] dark:bg-[#282420] hover:opacity-80 active:scale-95 text-[var(--text-primary)] rounded-xl transition-all shadow-xs"
            title="Notificaciones familiares"
            aria-label="Abrir Notificaciones"
          >
            <Bell className="w-4 h-4 text-[var(--text-primary)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-stone-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Radio Noticiero button */}
          <button
            onClick={onOpenRadio}
            className="p-2 bg-[#EFE7DA] dark:bg-[#282420] hover:opacity-80 active:scale-95 text-[var(--text-primary)] rounded-xl transition-all shadow-xs"
            title="Escuchar Noticiero Dominical de la Familia"
            aria-label="Abrir Noticiero Semanal"
          >
            <Radio className="w-4 h-4 text-[var(--theme-primary)] animate-pulse" />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-[#EFE7DA] dark:bg-[#282420] hover:opacity-80 active:scale-95 text-[var(--text-primary)] rounded-xl transition-all shadow-xs"
            title="Ajustes de la app"
            aria-label="Abrir Ajustes"
          >
            <Settings className="w-4 h-4 text-[var(--text-muted)]" />
          </button>

          {/* User Switcher Pill */}
          {currentUser && (
            <button
              onClick={onOpenUserSwitcher}
              className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white dark:bg-[#201D1A] border border-[#EFE7DA] dark:border-[#35302A] rounded-full shadow-xs active:scale-95 transition-all ml-0.5"
              title="Cambiar integrante activo"
            >
              <div className="text-right leading-none hidden xs:block">
                <span className="block text-xs font-bold text-[var(--text-primary)]">
                  {currentUser.nombre.split(' ')[0]}
                </span>
                <span className="text-[9px] text-[var(--text-muted)] capitalize">
                  {currentUser.rol}
                </span>
              </div>
              <Avatar user={currentUser} size="sm" showStatusDot />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
