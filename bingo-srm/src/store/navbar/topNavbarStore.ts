import { create } from "zustand";
import { mockAppGroups } from "@/src/data/appGroups.mock";
import { INavbarAppGroup } from "@/src/interface/navbar/AppInterface";
interface NavbarState {
  appGroups: INavbarAppGroup[];
}

export const useTopNavbarStore = create<NavbarState>((get) => ({
  appGroups: mockAppGroups,
}));
