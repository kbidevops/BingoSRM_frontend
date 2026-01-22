import { create } from "zustand";
import { INavbarAppGroup } from "@/src/interface/navbar/AppInterface";
import { mockAppGroups } from "@/src/data/appGroups.mock";
interface LeftNavbarState {
  appGroups: INavbarAppGroup[];
  isDrawerOpen: boolean;
  drawerWidth: number;
  menuOpen: { [key: string]: boolean };

  toggleDrawer: () => void;
  setMenuOpen: (payload: { id: string }) => void;
  resetMenuOpen: () => void;
  toggleMenu: (id: string) => void;
}

export const useLeftNavbarStore = create<LeftNavbarState>((set) => ({
  appGroups: mockAppGroups,
  isDrawerOpen: true,
  drawerWidth: 220,
  menuOpen: {},

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  setMenuOpen: (payload: { id: string }) => {
    set((state) => ({
      menuOpen: {
        ...state.menuOpen,
        [payload.id]: true,
      },
    }));
  },

  resetMenuOpen: () => set({ menuOpen: {} }),
  toggleMenu: (id) =>
    set((state) => ({
      menuOpen: {
        ...state.menuOpen,
        [id]: !state.menuOpen[id],
      },
    })),
}));
