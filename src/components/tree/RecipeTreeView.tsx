import { useRecipeTree } from '@/hooks/useRecipeTree';
import { TreeNode } from './TreeNode';

export function RecipeTreeView() {
  const { treeRoot } = useRecipeTree();

  if (!treeRoot) return null;

  return (
    <div className="tree-root">
      <TreeNode node={treeRoot} />
    </div>
  );
}
