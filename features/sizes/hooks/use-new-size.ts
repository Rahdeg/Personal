import { create } from "zustand";

type NewSizeState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewSize = create<NewSizeState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
