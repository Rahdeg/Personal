import { create } from "zustand";

type NewAdminState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAdmin = create<NewAdminState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
