import { create } from 'zustand';

interface AppState {
  selectedItemId: string | null;
  quantity: number;
  recipeSelections: Map<string, string>;
  collapsedNodes: Set<string>;
  searchQuery: string;
  stationFilter: string;
  activeTab: 'tree' | 'graph' | 'shopping';

  setSelectedItemId: (id: string | null) => void;
  setQuantity: (n: number) => void;
  setRecipeSelection: (itemId: string, recipeId: string) => void;
  toggleNodeCollapsed: (nodeKey: string) => void;
  setSearchQuery: (q: string) => void;
  setStationFilter: (id: string) => void;
  setActiveTab: (tab: 'tree' | 'graph' | 'shopping') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedItemId: null,
  quantity: 1,
  recipeSelections: new Map(),
  collapsedNodes: new Set(),
  searchQuery: '',
  stationFilter: '',
  activeTab: 'tree',

  setSelectedItemId: (id) =>
    set({ selectedItemId: id, recipeSelections: new Map(), collapsedNodes: new Set(), quantity: 1 }),

  setQuantity: (n) => set({ quantity: Math.max(1, n) }),

  setRecipeSelection: (itemId, recipeId) =>
    set((state) => {
      const next = new Map(state.recipeSelections);
      next.set(itemId, recipeId);
      return { recipeSelections: next };
    }),

  toggleNodeCollapsed: (nodeKey) =>
    set((state) => {
      const next = new Set(state.collapsedNodes);
      if (next.has(nodeKey)) {
        next.delete(nodeKey);
      } else {
        next.add(nodeKey);
      }
      return { collapsedNodes: next };
    }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setStationFilter: (id) => set({ stationFilter: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
