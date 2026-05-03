import Fuse from 'fuse.js';
import type { Item, Recipe, Station } from '@/types/terraria';
import itemsData from '@/data/items.json';
import recipesData from '@/data/recipes.json';
import stationsData from '@/data/stations.json';

export const allItems: Item[] = itemsData as Item[];
export const allRecipes: Recipe[] = recipesData as Recipe[];
export const allStations: Station[] = stationsData as Station[];

export const itemById = new Map<string, Item>(allItems.map((i) => [i.id, i]));
export const stationById = new Map<string, Station>(allStations.map((s) => [s.id, s]));
export const recipesByResultId = new Map<string, Recipe[]>();

for (const recipe of allRecipes) {
  const list = recipesByResultId.get(recipe.resultItemId) ?? [];
  list.push(recipe);
  recipesByResultId.set(recipe.resultItemId, list);
}

export const itemSearchIndex = new Fuse(allItems, {
  keys: ['name', 'tags'],
  threshold: 0.35,
  includeScore: true,
});

/** Returns the station name for the primary recipe of an item, or empty string. */
export function primaryStationName(itemId: string): string {
  const recipe = recipesByResultId.get(itemId)?.[0];
  if (!recipe) return '';
  return stationById.get(recipe.stationId)?.name ?? '';
}
