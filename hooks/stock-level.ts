import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

interface StockAlertStoreProp {
  stockLevelAlert: number;
  totalAvailableStocks: number;
  setStockLevelAlert: (level: number) => void;
  setTotalAvailableStocks: (stocks: number) => void;
}

const useStockAlert = create(
  persist<StockAlertStoreProp>(
    (set) => ({
      stockLevelAlert: 5, // Default stock level alert
      totalAvailableStocks: 0, // Default total available stocks
      setStockLevelAlert: (level: number) => {
        set({ stockLevelAlert: level });
        toast.success("Stock level alert updated.");
      },
      setTotalAvailableStocks: (stocks: number) => {
        set({ totalAvailableStocks: stocks });
      },
    }),
    {
      name: "stock-alert-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStockAlert;
