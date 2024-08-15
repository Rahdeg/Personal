import { create } from "zustand";

type NewColorState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewColor = create<NewColorState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
