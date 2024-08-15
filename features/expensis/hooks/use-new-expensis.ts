import { create } from "zustand";

type NewExpensisState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewExpensis = create<NewExpensisState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
