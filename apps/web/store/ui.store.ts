import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Active repository selection */
interface ActiveRepo {
  id: string;
  name: string;
  fullName: string;
}

/** UI store state shape */
interface UIState {
  /** Whether the sidebar is open (mobile sheet) */
  sidebarOpen: boolean;
  /** Whether the sidebar is collapsed to icon-only mode */
  sidebarCollapsed: boolean;
  /** Whether the command palette dialog is open */
  commandPaletteOpen: boolean;
  /** Currently selected repository context */
  activeRepo: ActiveRepo | null;
  /** Notification state */
  notifications: { unreadCount: number };
}

/** UI store actions */
interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setActiveRepo: (repo: ActiveRepo | null) => void;
  setUnreadCount: (count: number) => void;
}

/**
 * Global UI state store using Zustand.
 *
 * `sidebarCollapsed` is persisted to localStorage so the user's
 * preference (expanded vs icon-only) survives page refreshes.
 */
export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      // ── State ─────────────────────────────────
      sidebarOpen: false,
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      activeRepo: null,
      notifications: { unreadCount: 0 },

      // ── Actions ───────────────────────────────
      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      openCommandPalette: () =>
        set({ commandPaletteOpen: true }),

      closeCommandPalette: () =>
        set({ commandPaletteOpen: false }),

      setActiveRepo: (repo) =>
        set({ activeRepo: repo }),

      setUnreadCount: (count) =>
        set({ notifications: { unreadCount: count } }),
    }),
    {
      name: 'codereview-ui',
      // Only persist sidebar collapse preference
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
