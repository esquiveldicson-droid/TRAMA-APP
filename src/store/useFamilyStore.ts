import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  FamilyUser,
  FamilyPost,
  FamilyEvent,
  Recipe,
  TimeCapsule,
  DailyStatus,
  HallOfFameQuote,
  DailyChallenge,
  AudioStory,
  NavigationTab,
  AttendanceStatus,
  PostReaction,
  ColorTheme,
  FamilyNotification,
} from '../types/family';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_EVENTS,
  INITIAL_RECIPES,
  INITIAL_QUOTES,
  INITIAL_TIME_CAPSULES,
  INITIAL_STATUSES,
  INITIAL_CHALLENGE,
  INITIAL_AUDIO_STORY,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

function triggerBrowserNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon.svg',
      });
    } catch {
      // Ignore background restriction
    }
  }
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FamilyStoreState {
  // Navigation & User
  activeTab: NavigationTab;
  currentUser: FamilyUser | null;
  users: FamilyUser[];
  familyName: string;
  inviteCode: string;
  
  // Theme & Appearance
  colorTheme: ColorTheme;
  darkMode: boolean;

  // Data Collections
  posts: FamilyPost[];
  events: FamilyEvent[];
  recipes: Recipe[];
  quotes: HallOfFameQuote[];
  timeCapsules: TimeCapsule[];
  dailyStatuses: DailyStatus[];
  dailyChallenge: DailyChallenge;
  audioStory: AudioStory;
  
  // App UI State
  toasts: ToastMessage[];
  hasCompletedOnboarding: boolean;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setCurrentUser: (user: FamilyUser | null) => void;
  addUser: (user: Omit<FamilyUser, 'id'>) => FamilyUser;
  deleteUser: (userId: string) => void;
  updateUserProfile: (userId: string, partial: Partial<FamilyUser>) => void;
  setFamilyName: (name: string) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  setHasCompletedOnboarding: (val: boolean) => void;

  // Post Actions
  addPost: (post: Omit<FamilyPost, 'id' | 'reacciones' | 'comentarios'>) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, nuevoContenido: string) => void;
  toggleReaction: (postId: string, emoji: PostReaction['emoji'], label: string) => void;
  addComment: (postId: string, contenido: string) => void;

  // Status Actions
  updateDailyStatus: (emoji: string, texto: string) => void;

  // Event Actions
  addEvent: (event: Omit<FamilyEvent, 'id' | 'asistencias' | 'creado_en'>) => void;
  updateAttendance: (eventId: string, status: AttendanceStatus) => void;
  toggleChecklistItem: (eventId: string, itemId: string) => void;

  // Recipe & Treasure Actions
  addRecipe: (recipe: Omit<Recipe, 'id' | 'creada_en'>) => void;
  addQuote: (quote: Omit<HallOfFameQuote, 'id' | 'fecha'>) => void;
  addChallengeAnswer: (respuesta: string) => void;
  updateDailyChallengeQuestion: (pregunta: string, categoria: string) => void;

  // Social Notifications System
  notifications: FamilyNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<FamilyNotification, 'id' | 'fecha' | 'leida'>) => void;
  sendTestNotification: () => void;

  // Clean mode & Demo data
  startCleanMode: () => void;
  loadDemoData: () => void;
  resetAllData: () => void;
}

export const useFamilyStore = create<FamilyStoreState>()(
  persist(
    (set, get) => ({
      activeTab: 'muro',
      currentUser: null, // Starts clean if no previous saved session
      users: [],
      familyName: 'Mi Familia',
      inviteCode: 'TRAMA-FAM-2026',
      colorTheme: 'terracotta',
      darkMode: false,
      posts: [],
      events: [],
      recipes: [],
      quotes: [],
      timeCapsules: [],
      dailyStatuses: [],
      dailyChallenge: INITIAL_CHALLENGE,
      audioStory: INITIAL_AUDIO_STORY,
      notifications: INITIAL_NOTIFICATIONS,
      toasts: [],
      hasCompletedOnboarding: true,

      setActiveTab: (tab) => set({ activeTab: tab }),

      setCurrentUser: (user) => {
        set({ currentUser: user });
        if (user) {
          get().showToast(`Sesión activa: ${user.nombre}`, 'info');
        }
      },

      addUser: (userData) => {
        const id = 'user_' + Date.now();
        const newUser: FamilyUser = {
          ...userData,
          id,
        };
        set((state) => {
          const nextUsers = [...state.users, newUser];
          return {
            users: nextUsers,
            currentUser: state.currentUser || newUser,
          };
        });
        get().showToast(`¡${newUser.nombre} añadido a la familia!`, 'success');
        return newUser;
      },

      deleteUser: (userId) => {
        set((state) => {
          const nextUsers = state.users.filter((u) => u.id !== userId);
          return {
            users: nextUsers,
            currentUser: state.currentUser?.id === userId ? nextUsers[0] || null : state.currentUser,
          };
        });
        get().showToast('Miembro eliminado de la familia', 'info');
      },

      updateUserProfile: (userId, partial) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, ...partial } : u)),
          currentUser:
            state.currentUser?.id === userId ? { ...state.currentUser, ...partial } : state.currentUser,
        }));
        get().showToast('Perfil actualizado con éxito', 'success');
      },

      setFamilyName: (name) => {
        set({ familyName: name });
        get().showToast('Nombre de la familia actualizado', 'success');
      },

      setColorTheme: (theme) => {
        set({ colorTheme: theme });
        get().showToast(`Tema visual cambiado`, 'info');
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setDarkMode: (val) => set({ darkMode: val }),

      showToast: (message, type = 'info') => {
        const id = 'toast_' + Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts.slice(-4), { id, message, type }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),

      // POSTS
      addPost: (postData) => {
        const newPost: FamilyPost = {
          ...postData,
          id: 'post_' + Date.now(),
          reacciones: [],
          comentarios: [],
        };
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
        get().showToast('¡Momento compartido en el muro!', 'success');
      },

      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        }));
        get().showToast('Publicación eliminada', 'info');
      },

      editPost: (postId, nuevoContenido) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, contenido: nuevoContenido, editado: true }
              : p
          ),
        }));
        get().showToast('Publicación editada', 'success');
      },

      toggleReaction: (postId, emoji, label) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const userId = currentUser.id;

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post;
            const existingIdx = post.reacciones.findIndex(
              (r) => r.user_id === userId && r.emoji === emoji
            );
            let updatedReactions = [...post.reacciones];
            if (existingIdx >= 0) {
              updatedReactions.splice(existingIdx, 1);
            } else {
              updatedReactions = updatedReactions.filter((r) => r.user_id !== userId);
              updatedReactions.push({
                id: 'r_' + Date.now(),
                user_id: userId,
                emoji,
                label,
              });
            }
            return { ...post, reacciones: updatedReactions };
          }),
        }));
      },

      addComment: (postId, contenido) => {
        const currentUser = get().currentUser;
        if (!currentUser || !contenido.trim()) return;

        const newComment = {
          id: 'c_' + Date.now(),
          post_id: postId,
          autor_id: currentUser.id,
          contenido: contenido.trim(),
          fecha: new Date().toISOString(),
        };
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, comentarios: [...p.comentarios, newComment] }
              : p
          ),
        }));
        get().showToast('Comentario añadido', 'success');
      },

      // STATUS
      updateDailyStatus: (emoji, texto) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const userId = currentUser.id;

        const newStatus: DailyStatus = {
          id: 'status_' + Date.now(),
          user_id: userId,
          emoji_status: emoji,
          texto_status: texto,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          dailyStatuses: [
            newStatus,
            ...state.dailyStatuses.filter((s) => s.user_id !== userId),
          ],
        }));
        get().showToast('Tu estado diario ha sido actualizado', 'success');
      },

      // EVENTS
      addEvent: (eventData) => {
        const currentUserId = get().currentUser?.id || 'admin';
        const newEvent: FamilyEvent = {
          ...eventData,
          id: 'ev_' + Date.now(),
          asistencias: {
            [currentUserId]: 'voy',
          },
          creado_en: new Date().toISOString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
        get().showToast('¡Evento familiar agendado!', 'success');
      },

      updateAttendance: (eventId, status) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const userId = currentUser.id;

        set((state) => ({
          events: state.events.map((ev) =>
            ev.id === eventId
              ? {
                  ...ev,
                  asistencias: {
                    ...ev.asistencias,
                    [userId]: status,
                  },
                }
              : ev
          ),
        }));
        get().showToast('Asistencia actualizada', 'info');
      },

      toggleChecklistItem: (eventId, itemId) => {
        const currentUser = get().currentUser;
        const userId = currentUser?.id || 'admin';

        set((state) => ({
          events: state.events.map((ev) => {
            if (ev.id !== eventId) return ev;
            return {
              ...ev,
              items_necesarios: ev.items_necesarios.map((item) => {
                if (item.id !== itemId) return item;
                const nextCompleted = !item.completado;
                return {
                  ...item,
                  completado: nextCompleted,
                  asignado_a: nextCompleted ? (item.asignado_a || userId) : item.asignado_a,
                };
              }),
            };
          }),
        }));
      },

      // TREASURE
      addRecipe: (recipeData) => {
        const newRecipe: Recipe = {
          ...recipeData,
          id: 'rec_' + Date.now(),
          creada_en: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({
          recipes: [newRecipe, ...state.recipes],
        }));
        get().showToast('¡Receta familiar guardada en el tesoro!', 'success');
      },

      addQuote: (quoteData) => {
        const newQuote: HallOfFameQuote = {
          ...quoteData,
          id: 'q_' + Date.now(),
          fecha: new Date().toISOString().slice(0, 10),
        };
        set((state) => ({
          quotes: [newQuote, ...state.quotes],
        }));
        get().showToast('¡Frase inmortalizada!', 'success');
      },

      addChallengeAnswer: (respuesta) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const userId = currentUser.id;

        const newAns = {
          id: 'ans_' + Date.now(),
          user_id: userId,
          respuesta,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          dailyChallenge: {
            ...state.dailyChallenge,
            respuestas: [
              ...state.dailyChallenge.respuestas.filter((r) => r.user_id !== userId),
              newAns,
            ],
          },
        }));
        get().showToast('¡Respuesta guardada! Gracias por compartir', 'success');
      },

      updateDailyChallengeQuestion: (pregunta, categoria) => {
        set({
          dailyChallenge: {
            id: 'chal_' + Date.now(),
            pregunta,
            categoria,
            fecha: new Date().toISOString().slice(0, 10),
            respuestas: [],
          },
        });
      },

      // Social Notifications Actions
      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, leida: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, leida: true })),
        }));
        get().showToast('Todas las notificaciones marcadas como leídas', 'info');
      },

      addNotification: (notifData) => {
        const newNotif: FamilyNotification = {
          ...notifData,
          id: 'notif_' + Date.now(),
          fecha: new Date().toISOString(),
          leida: false,
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));

        triggerBrowserNotification(newNotif.titulo, newNotif.mensaje);
        get().showToast(newNotif.titulo, 'info');
      },

      sendTestNotification: () => {
        const currentUser = get().currentUser;
        const users = get().users;
        const otherUser = users.find((u) => u.id !== currentUser?.id) || users[0];
        const actorName = otherUser?.nombre.split(' ')[0] || 'Un familiar';

        const testNotifs = [
          {
            titulo: `${actorName} reaccionó ❤️ a tu foto`,
            mensaje: 'Le encantó el momento familiar que compartiste.',
            tipo: 'reaccion' as const,
          },
          {
            titulo: `${actorName} comentó en tu publicación`,
            mensaje: '"¡Qué lindo recuerdo! Hay que repetirlo pronto."',
            tipo: 'comentario' as const,
          },
          {
            titulo: `Nuevo plan familiar con ${actorName}`,
            mensaje: 'Confirmó asistencia para la próxima reunión.',
            tipo: 'evento' as const,
          },
        ];

        const randomTest = testNotifs[Math.floor(Math.random() * testNotifs.length)];

        get().addNotification({
          user_id: currentUser?.id || 'admin',
          actor_id: otherUser?.id || 'actor',
          tipo: randomTest.tipo,
          titulo: randomTest.titulo,
          mensaje: randomTest.mensaje,
        });
      },

      // START CLEAN FROM ZERO (requested by user)
      startCleanMode: () => {
        set({
          currentUser: null,
          users: [],
          posts: [],
          events: [],
          recipes: [],
          quotes: [],
          timeCapsules: [],
          dailyStatuses: [],
          notifications: [],
          dailyChallenge: {
            id: 'chal_' + Date.now(),
            pregunta: '¿Cuál es el mejor recuerdo que hemos vivido juntos en familia?',
            categoria: 'Recuerdos',
            fecha: new Date().toISOString().slice(0, 10),
            respuestas: [],
          },
        });
        get().showToast('Trama App limpia: lista en 0 para configurar tu familia', 'info');
      },

      // LOAD DEMO DATA
      loadDemoData: () => {
        set({
          users: INITIAL_USERS,
          currentUser: INITIAL_USERS[0],
          posts: INITIAL_POSTS,
          events: INITIAL_EVENTS,
          recipes: INITIAL_RECIPES,
          quotes: INITIAL_QUOTES,
          timeCapsules: INITIAL_TIME_CAPSULES,
          dailyStatuses: INITIAL_STATUSES,
          dailyChallenge: INITIAL_CHALLENGE,
          notifications: INITIAL_NOTIFICATIONS,
        });
        get().showToast('Datos de prueba cargados', 'info');
      },

      resetAllData: () => {
        get().loadDemoData();
      },
    }),
    {
      name: 'trama-app-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTab: state.activeTab,
        currentUser: state.currentUser,
        users: state.users,
        familyName: state.familyName,
        inviteCode: state.inviteCode,
        colorTheme: state.colorTheme,
        darkMode: state.darkMode,
        posts: state.posts,
        events: state.events,
        recipes: state.recipes,
        quotes: state.quotes,
        timeCapsules: state.timeCapsules,
        dailyStatuses: state.dailyStatuses,
        dailyChallenge: state.dailyChallenge,
        notifications: state.notifications,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
