import React from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { NavigationTab } from '../../types/family';
import { Home, Calendar, Sparkles, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const activeTab = useFamilyStore((state) => state.activeTab);
  const setActiveTab = useFamilyStore((state) => state.setActiveTab);
  const events = useFamilyStore((state) => state.events);

  const upcomingCount = events.length;

  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'muro', label: 'Muro', icon: Home },
    { id: 'calendario', label: 'Calendario', icon: Calendar, badge: upcomingCount },
    { id: 'tesoro', label: 'Tesoro', icon: Sparkles },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 dark:bg-[#151311]/95 backdrop-blur-lg border-t border-[#EFE7DA] dark:border-[#35302A] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[52px] min-w-[48px] py-1 rounded-xl transition-all duration-200 active:scale-90 relative"
              aria-label={`Ir a ${tab.label}`}
            >
              <div
                className={`relative p-1.5 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0 && !isActive) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--theme-primary)] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-stone-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors mt-0.5 ${
                  isActive ? 'text-[var(--theme-primary)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
