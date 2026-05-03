import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { allItems, itemSearchIndex, recipesByResultId } from '@/lib/recipeIndex';
import type { Item } from '@/types/terraria';

export function useSearch(): { results: Item[] } {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const stationFilter = useAppStore((s) => s.stationFilter);

  const results = useMemo(() => {
    let base: Item[];

    if (searchQuery.trim() === '') {
      base = allItems.filter((i) => recipesByResultId.has(i.id));
    } else {
      base = itemSearchIndex
        .search(searchQuery)
        .filter((r) => recipesByResultId.has(r.item.id))
        .map((r) => r.item);
    }

    if (stationFilter) {
      base = base.filter((item) => {
        const recipes = recipesByResultId.get(item.id);
        return recipes?.some((r) => r.stationId === stationFilter) ?? false;
      });
    }

    return base;
  }, [searchQuery, stationFilter]);

  return { results };
}
