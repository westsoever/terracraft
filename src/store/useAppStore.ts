import { create } from 'zustand';

interface AppState {
  selectedItemId: string | null;
  quantity: number;
  recipeSelections: Map<string, string>;
  searchQuery: string;
  stationFilter: string;
  haveItems: Set<string>;

  setSelectedItemId: (id: string | null) => void;
  setQuantity: (n: number) => void;
  setRecipeSelection: (itemId: string, recipeId: string) => void;
  setSearchQuery: (q: string) => void;
  setStationFilter: (id: string) => void;
  toggleHaveItem: (itemId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedItemId: null,
  quantity: 1,
  recipeSelections: new Map(),
  searchQuery: '',
  stationFilter: '',
  haveItems: new Set<string>(),

  setSelectedItemId: (id) =>
    set({ selectedItemId: id, recipeSelections: new Map(), quantity: 1, haveItems: new Set() }),

  setQuantity: (n) => set({ quantity: Math.max(1, n) }),

  setRecipeSelection: (itemId, recipeId) =>
    set((state) => {
      const next = new Map(state.recipeSelections);
      next.set(itemId, recipeId);
      return { recipeSelections: next };
    }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setStationFilter: (id) => set({ stationFilter: id }),

  toggleHaveItem: (itemId) =>
    set((state) => {
      const next = new Set(state.haveItems);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return { haveItems: next };
    }),
}));
