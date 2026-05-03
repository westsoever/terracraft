import type { RecipeTreeNode, ShoppingEntry } from '@/types/terraria';
import { itemById } from './recipeIndex';

function accumulate(node: RecipeTreeNode, acc: Map<string, number>): void {
  if (node.children.length === 0) {
    acc.set(node.itemId, (acc.get(node.itemId) ?? 0) + node.quantityNeeded);
    return;
  }
  for (const child of node.children) {
    accumulate(child, acc);
  }
}

export function computeShoppingList(treeRoot: RecipeTreeNode): ShoppingEntry[] {
  const acc = new Map<string, number>();
  accumulate(treeRoot, acc);

  return Array.from(acc.entries())
    .map(([itemId, totalQuantity]) => ({
      itemId,
      item: itemById.get(itemId) ?? { id: itemId, name: itemId, sprite: '', tags: [] },
      totalQuantity,
    }))
    .sort((a, b) => a.item.name.localeCompare(b.item.name));
}
