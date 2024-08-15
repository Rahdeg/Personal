import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartProduct, Product } from "@/types";
import { toast } from "sonner";

interface CratStoreProp {
  items: CartProduct[];
  addItem: (data: CartProduct) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CratStoreProp>(
    (set, get) => ({
      items: [],
      addItem: (data: CartProduct) => {
        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("item removed from the cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
