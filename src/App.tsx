/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useFamilyStore } from './store/useFamilyStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/ToastContainer';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { UserSwitcherModal } from './components/common/UserSwitcherModal';
import { NoticieroModal } from './components/news/NoticieroModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { CleanSetupWizard } from './components/welcome/CleanSetupWizard';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

// Tab Views
import { FeedView } from './components/feed/FeedView';
import { CalendarView } from './components/calendar/CalendarView';
import { TreasureView } from './components/treasure/TreasureView';
import { ProfileView } from './components/profile/ProfileView';

export default function App() {
  const activeTab = useFamilyStore((state) => state.activeTab);
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const darkMode = useFamilyStore((state) => state.darkMode);
  const colorTheme = useFamilyStore((state) => state.colorTheme);

  const [showSplash, setShowSplash] = useState(true);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Synchronize dark mode and theme classes on html/root and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }

    // Remove existing theme classes
    ['theme-terracotta', 'theme-salvia', 'theme-indigo', 'theme-ciruela', 'theme-ambar'].forEach((t) => {
      root.classList.remove(t);
      body.classList.remove(t);
    });
    root.classList.add(`theme-${colorTheme}`);
    body.classList.add(`theme-${colorTheme}`);
  }, [darkMode, colorTheme]);

  // Clean state: If there are no users yet, show the Clean Setup Wizard!
  if (users.length === 0 || !currentUser) {
    return (
      <ErrorBoundary>
        <div className={`theme-${colorTheme} ${darkMode ? 'dark' : ''} min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]`}>
          <ToastContainer />
          <CleanSetupWizard />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-['Nunito',sans-serif] selection:bg-[var(--theme-primary-soft)] selection:text-[var(--theme-primary)] theme-${colorTheme} ${darkMode ? 'dark' : ''}`}>
        {/* Splash screen on initial load */}
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

        {/* Global In-App Toast system */}
        <ToastContainer />

        {/* Top Header */}
        <Header
          onOpenRadio={() => setIsRadioOpen(true)}
          onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {activeTab === 'muro' && <FeedView />}
          {activeTab === 'calendario' && <CalendarView />}
          {activeTab === 'tesoro' && <TreasureView />}
          {activeTab === 'perfil' && (
            <ProfileView
              onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation (Tabs) */}
        <BottomNav />

        {/* Global Modals */}
        <NoticieroModal
          isOpen={isRadioOpen}
          onClose={() => setIsRadioOpen(false)}
        />

        <UserSwitcherModal
          isOpen={isUserSwitcherOpen}
          onClose={() => setIsUserSwitcherOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
