import { create } from "zustand";

interface UserWalletState {
  coins: number;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
}

export const useUserStore = create<UserWalletState>(
  (set, get) => ({
    coins: 500,

    spendCoins: (amount) => {
      const currentBalance = get().coins;
      if (currentBalance < amount) {
        return false;
      }
      set({ coins: currentBalance - amount });
      return true;
    },

    addCoins: (amount) => {
      set((state) => ({ coins: state.coins + amount }));
    },
  })
);
