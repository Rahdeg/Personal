import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  stockLevelAlert: number;
  totalAvailableStocks: number;
  currency: string;
  language: string; // Add language state
  setStockLevelAlert: (level: number) => void;
  setTotalAvailableStocks: (stocks: number) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void; // Add setLanguage function
}

const useAppState = create(
  persist<AppState>(
    (set) => ({
      stockLevelAlert: 5, // Default stock level alert
      totalAvailableStocks: 0, // Default total available stocks
      currency: "NGN", // Default currency
      language: "en", // Default language
      setStockLevelAlert: (level: number) => {
        set({ stockLevelAlert: level });
      },
      setTotalAvailableStocks: (stocks: number) => {
        set({ totalAvailableStocks: stocks });
      },
      setCurrency: (currency: string) => {
        set({ currency });
      },
      setLanguage: (language: string) => {
        set({ language });
      },
    }),
    {
      name: "app-state-storage", // Storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage to persist
    }
  )
);

export default useAppState;
