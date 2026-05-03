import { useRecipeTree } from '@/hooks/useRecipeTree';

export function ShoppingPanel() {
  const { shoppingList } = useRecipeTree();

  if (shoppingList.length === 0) return null;

  return (
    <div className="shopping-panel">
      <div className="shopping-panel-header">
        <span className="t-badge gold">{shoppingList.length} needed</span>
      </div>
      <div className="shopping-panel-body">
        {shoppingList.map((entry) => (
          <div key={entry.itemId} className="shopping-panel-row">
            <div className="t-slot" style={{ width: 24, height: 24, flexShrink: 0 }}>
              {entry.item.sprite ? (
                <img src={entry.item.sprite} alt={entry.item.name} />
              ) : (
                <div className="t-slot-placeholder" />
              )}
            </div>
            <span className="shopping-panel-name">{entry.item.name}</span>
            <span className="shopping-panel-qty">×{entry.totalQuantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
