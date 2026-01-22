import { create } from "zustand";

type Variant = "default" | "success" | "error" | "warning" | "info";

interface NotiStackState {
  open: boolean;
  variant: Variant;
  message: string;
  setOpenNotiStack: (variant: Variant, message: string) => void;
  setCloseNotiStack: () => void;
}

export const useNotiStackStore = create<NotiStackState>((set) => ({
  open: false,
  variant: "default",
  message: "",
  setOpenNotiStack: (variant, message) => set({ open: true, variant, message }),
  setCloseNotiStack: () =>
    set({ open: false, variant: "default", message: "" }),
}));
