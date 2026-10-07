import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { ColorTheme } from '../../types/family';
import { Avatar } from '../common/Avatar';
import { InviteFamilyModal } from './InviteFamilyModal';
import { InstallGuideModal } from './InstallGuideModal';
import {
  X,
  Moon,
  Sun,
  Palette,
  Users,
  UserPlus,
  Share2,
  Trash2,
  RotateCcw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const users = useFamilyStore((state) => state.users);
  const deleteUser = useFamilyStore((state) => state.deleteUser);
  const familyName = useFamilyStore((state) => state.familyName);
  const setFamilyName = useFamilyStore((state) => state.setFamilyName);
  const colorTheme = useFamilyStore((state) => state.colorTheme);
  const setColorTheme = useFamilyStore((state) => state.setColorTheme);
  const darkMode = useFamilyStore((state) => state.darkMode);
  const toggleDarkMode = useFamilyStore((state) => state.toggleDarkMode);
  const startCleanMode = useFamilyStore((state) => state.startCleanMode);
  const loadDemoData = useFamilyStore((state) => state.loadDemoData);
  const showToast = useFamilyStore((state) => state.showToast);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [editingFamilyName, setEditingFamilyName] = useState(familyName);
  const [showCleanConfirm, setShowCleanConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveFamilyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFamilyName.trim()) return;
    setFamilyName(editingFamilyName.trim());
  };

  const themeOptions: Array<{ id: ColorTheme; name: string; hex: string }> = [
    { id: 'terracotta', name: 'Terracota Cálido', hex: '#E07A5F' },
    { id: 'salvia', name: 'Salvia & Olivo', hex: '#5B8266' },
    { id: 'indigo', name: 'Índigo Trama', hex: '#4361EE' },
    { id: 'ciruela', name: 'Ciruela & Lavanda', hex: '#9D4EDD' },
    { id: 'ambar', name: 'Ámbar Solar', hex: '#D97706' },
  ];

  const handleCleanStart = () => {
    startCleanMode();
    setShowCleanConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-[#FFFDF9] dark:bg-[#201D1A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFE7DA] dark:border-[#35302A] overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7DA] dark:border-[#35302A] bg-[#FAF6F0] dark:bg-[#1A1816] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] font-bold text-base text-[var(--text-primary)]">
                Ajustes de Trama App
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Personalización, miembros y privacidad
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
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-[var(--text-primary)]">
          {/* 1. Modo Oscuro / Claro */}
          <div className="p-4 bg-[#FAF6F0] dark:bg-[#1A1816] rounded-2xl border border-[#EFE7DA] dark:border-[#35302A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-amber-400">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                  Modo Oscuro (Dark Mode)
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {darkMode ? 'Tema oscuro activado para la noche' : 'Tema claro cálido y suave'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                darkMode ? 'bg-[var(--theme-primary)] justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs block" />
            </button>
          </div>

          {/* 2. Rediseño de Color (Theme Color Picker) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <Palette className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>Rediseño de Color del Hogar</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {themeOptions.map((th) => {
                const isSelected = colorTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setColorTheme(th.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)] bg-white dark:bg-[#2A2622] scale-105'
                        : 'border-[#EFE7DA] dark:border-[#35302A] bg-stone-50 dark:bg-[#1A1816]'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full shadow-xs mb-1 flex items-center justify-center text-white text-[10px]"
                      style={{ backgroundColor: th.hex }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-[9px] font-bold text-center truncate max-w-full">
                      {th.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Nombre de la Familia */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Nombre de tu Familia
            </span>
            <form onSubmit={handleSaveFamilyName} className="flex gap-2">
              <input
                type="text"
                value={editingFamilyName}
                onChange={(e) => setEditingFamilyName(e.target.value)}
                placeholder="ej. Familia Esquivel"
                className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-[#282420] rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-primary)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform"
              >
                Guardar
              </button>
            </form>
          </div>

          {/* 4. Descargar en el Teléfono (PWA Guide) */}
          <div className="p-3.5 bg-gradient-to-r from-[var(--theme-primary-soft)] to-transparent rounded-2xl border border-[var(--theme-primary)]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-[var(--theme-primary)] shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[var(--text-primary)]">
                  Descargar en Teléfonos
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Guía para iPhone y Android
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsInstallOpen(true)}
              className="px-3 py-1.5 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95"
            >
              Ver Guía
            </button>
          </div>

          {/* 5. Gestión de Miembros Familiares */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[var(--theme-primary)]" />
                <span>Integrantes de la Familia ({users.length})</span>
              </span>
              <button
                onClick={() => setIsInviteOpen(true)}
                className="text-xs font-bold text-[var(--theme-primary)] flex items-center gap-1 hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Invitar</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#282420] border border-[#EFE7DA] dark:border-[#35302A]"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar user={u} size="sm" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[var(--text-primary)]">
                          {u.nombre}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] capitalize px-1.5 bg-stone-100 dark:bg-stone-800 rounded-md">
                          {u.rol}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {u.email}
                      </span>
                    </div>
                  </div>

                  {users.length > 1 && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg"
                      title="Eliminar integrante"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Modo Limpio vs Datos Demo */}
          <div className="pt-2 border-t border-[#EFE7DA] dark:border-[#35302A] space-y-2">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Configuración Inicial de Datos
            </span>

            {showCleanConfirm ? (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 space-y-2">
                <p className="text-xs text-rose-800 dark:text-rose-200 font-medium">
                  ¿Confirmas dejar la app 100% limpia en 0? Se borrarán los datos de ejemplo para que crees tu familia desde cero.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCleanStart}
                    className="flex-1 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs"
                  >
                    Sí, limpiar todo
                  </button>
                  <button
                    onClick={() => setShowCleanConfirm(false)}
                    className="flex-1 py-1.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCleanConfirm(true)}
                  className="py-2.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-700 dark:text-stone-200 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Empezar en 0 (Limpia)</span>
                </button>
                <button
                  onClick={loadDemoData}
                  className="py-2.5 px-3 bg-[#FAF6F0] dark:bg-[#282420] text-[var(--theme-primary)] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-[#EFE7DA] dark:border-[#35302A]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cargar Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <InviteFamilyModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <InstallGuideModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
};
