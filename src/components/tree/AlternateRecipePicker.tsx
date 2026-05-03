import { useAppStore } from '@/store/useAppStore';
import { recipesByResultId, stationById } from '@/lib/recipeIndex';

interface Props {
  itemId: string;
  currentRecipeId: string;
}

export function AlternateRecipePicker({ itemId, currentRecipeId }: Props) {
  const setRecipeSelection = useAppStore((s) => s.setRecipeSelection);
  const recipes = recipesByResultId.get(itemId);

  if (!recipes || recipes.length <= 1) return null;

  return (
    <select
      className="t-select alt-recipe-select"
      value={currentRecipeId}
      onChange={(e) => setRecipeSelection(itemId, e.target.value)}
      title="Choose alternate recipe"
    >
      {recipes.map((r) => {
        const station = stationById.get(r.stationId)?.name ?? 'By Hand';
        return (
          <option key={r.id} value={r.id}>
            {station}
          </option>
        );
      })}
    </select>
  );
}
