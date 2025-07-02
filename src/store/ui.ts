import { create } from 'zustand';

// store/ui.ts
interface UIState {
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

/* Corrected implementation: set is provided to the create callback */
export const useUI = create<UIState>((set) => ({
  isCartOpen: false,
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
