import { useCallback } from 'react';
import { useRecipeTree } from '@/hooks/useRecipeTree';
import { ShoppingRow } from './ShoppingRow';

export function ShoppingList() {
  const { shoppingList } = useRecipeTree();

  const copyToClipboard = useCallback(() => {
    const text = shoppingList.map((e) => `${e.item.name}: ${e.totalQuantity}`).join('\n');
    void navigator.clipboard.writeText(text);
  }, [shoppingList]);

  if (shoppingList.length === 0) {
    return (
      <div className="empty-state" style={{ height: 'auto', paddingTop: 40 }}>
        <div className="empty-state-title">Nothing to gather</div>
        <div className="empty-state-sub">This item has no raw ingredients.</div>
      </div>
    );
  }

  return (
    <div className="shopping-list">
      <div className="shopping-header">
        <span className="t-badge gold">{shoppingList.length} materials</span>
        <button className="t-btn" onClick={copyToClipboard}>
          📋 Copy
        </button>
      </div>
      {shoppingList.map((entry) => (
        <ShoppingRow key={entry.itemId} entry={entry} />
      ))}
    </div>
  );
}
