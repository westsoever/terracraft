export interface Item {
  id: string;
  name: string;
  sprite: string;
  tags: string[];
}

export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  resultItemId: string;
  resultQuantity: number;
  ingredients: RecipeIngredient[];
  stationId: string;
}

export interface Station {
  id: string;
  name: string;
  sprite: string;
}

export interface RecipeTreeNode {
  nodeKey: string;
  itemId: string;
  item: Item;
  quantityNeeded: number;
  recipeUsed: Recipe | null;
  children: RecipeTreeNode[];
  isCycleBreaker: boolean;
  depth: number;
}

export interface ShoppingEntry {
  itemId: string;
  item: Item;
  totalQuantity: number;
}

export interface ItemNodeData extends Record<string, unknown> {
  item: Item;
  quantityNeeded: number;
  stationId: string;
  isRaw: boolean;
  isCycleBreaker: boolean;
}
