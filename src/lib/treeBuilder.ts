import type { RecipeTreeNode } from '@/types/terraria';
import { itemById, recipesByResultId } from './recipeIndex';

export function buildRecipeTree(
  itemId: string,
  quantityNeeded: number,
  recipeSelections: Map<string, string>,
  visitedItemIds: Set<string>,
  depth: number,
  parentKey: string,
): RecipeTreeNode {
  const item = itemById.get(itemId) ?? {
    id: itemId,
    name: itemId,
    sprite: '',
    tags: [],
  };

  const nodeKey = `${itemId}-${depth}-${parentKey}`;

  if (visitedItemIds.has(itemId)) {
    return {
      nodeKey,
      itemId,
      item,
      quantityNeeded,
      recipeUsed: null,
      children: [],
      isCycleBreaker: true,
      depth,
    };
  }

  const recipes = recipesByResultId.get(itemId);
  if (!recipes || recipes.length === 0) {
    return {
      nodeKey,
      itemId,
      item,
      quantityNeeded,
      recipeUsed: null,
      children: [],
      isCycleBreaker: false,
      depth,
    };
  }

  const selectedRecipeId = recipeSelections.get(itemId);
  const recipe =
    (selectedRecipeId ? recipes.find((r) => r.id === selectedRecipeId) : undefined) ?? recipes[0]!;

  visitedItemIds.add(itemId);

  const children: RecipeTreeNode[] = recipe.ingredients.map((ingredient) => {
    const craftingRuns = Math.ceil(quantityNeeded / recipe.resultQuantity);
    const childQty = craftingRuns * ingredient.quantity;
    return buildRecipeTree(
      ingredient.itemId,
      childQty,
      recipeSelections,
      visitedItemIds,
      depth + 1,
      nodeKey,
    );
  });

  visitedItemIds.delete(itemId);

  return {
    nodeKey,
    itemId,
    item,
    quantityNeeded,
    recipeUsed: recipe,
    children,
    isCycleBreaker: false,
    depth,
  };
}
