import type { RecipeTreeNode } from '@/types/terraria';
import { useAppStore } from '@/store/useAppStore';
import { recipesByResultId, stationById } from '@/lib/recipeIndex';
import { AlternateRecipePicker } from './AlternateRecipePicker';

interface Props {
  node: RecipeTreeNode;
}

export function TreeNode({ node }: Props) {
  const collapsedNodes = useAppStore((s) => s.collapsedNodes);
  const toggleNodeCollapsed = useAppStore((s) => s.toggleNodeCollapsed);
  const recipeSelections = useAppStore((s) => s.recipeSelections);

  const isCollapsed = collapsedNodes.has(node.nodeKey);
  const hasChildren = node.children.length > 0;
  const stationName = node.recipeUsed ? (stationById.get(node.recipeUsed.stationId)?.name ?? '') : '';
  const currentRecipeId =
    recipeSelections.get(node.itemId) ?? recipesByResultId.get(node.itemId)?.[0]?.id ?? '';

  const indent = Array.from({ length: node.depth }, (_, i) => (
    <div key={i} className="tree-indent-line" />
  ));

  return (
    <div className="tree-node">
      <div className="tree-node-row">
        <div className="tree-indent">{indent}</div>

        {hasChildren ? (
          <div className="tree-toggle" onClick={() => toggleNodeCollapsed(node.nodeKey)}>
            {isCollapsed ? '▶' : '▼'}
          </div>
        ) : (
          <div className="tree-toggle-spacer" />
        )}

        <div className="t-slot" style={{ width: 28, height: 28 }}>
          {node.item.sprite ? (
            <img src={node.item.sprite} alt={node.item.name} />
          ) : (
            <div className="t-slot-placeholder" />
          )}
        </div>

        <div className="tree-item-name">{node.item.name}</div>
        <div className="tree-qty">×{node.quantityNeeded}</div>

        {stationName && <span className="t-badge dim">{stationName}</span>}
        {node.isCycleBreaker && <span className="t-badge red">CYCLE</span>}
        {node.recipeUsed === null && !node.isCycleBreaker && (
          <span className="t-badge green">RAW</span>
        )}

        {node.depth > 0 && currentRecipeId && (
          <AlternateRecipePicker itemId={node.itemId} currentRecipeId={currentRecipeId} />
        )}
      </div>

      {hasChildren && !isCollapsed && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={child.nodeKey} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
