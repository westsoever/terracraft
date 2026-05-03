import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { buildRecipeTree } from '@/lib/treeBuilder';
import { computeShoppingList } from '@/lib/shoppingList';
import type { RecipeTreeNode, ShoppingEntry } from '@/types/terraria';

export function useRecipeTree(): {
  treeRoot: RecipeTreeNode | null;
  shoppingList: ShoppingEntry[];
} {
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const quantity = useAppStore((s) => s.quantity);
  const recipeSelections = useAppStore((s) => s.recipeSelections);
  const haveItems = useAppStore((s) => s.haveItems);

  const treeRoot = useMemo(() => {
    if (!selectedItemId) return null;
    return buildRecipeTree(selectedItemId, quantity, recipeSelections, new Set(), 0, 'root');
  }, [selectedItemId, quantity, recipeSelections]);

  const shoppingList = useMemo(() => {
    if (!treeRoot) return [];
    return computeShoppingList(treeRoot, haveItems);
  }, [treeRoot, haveItems]);

  return { treeRoot, shoppingList };
}
