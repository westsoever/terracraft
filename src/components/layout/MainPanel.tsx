import { useAppStore } from '@/store/useAppStore';
import { useRecipeTree } from '@/hooks/useRecipeTree';
import { itemById } from '@/lib/recipeIndex';
import { RecipeTreeView } from '@/components/tree/RecipeTreeView';
import { RecipeGraph } from '@/components/graph/RecipeGraph';
import { ShoppingList } from '@/components/shopping/ShoppingList';

export function MainPanel() {
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const quantity = useAppStore((s) => s.quantity);
  const setQuantity = useAppStore((s) => s.setQuantity);
  const { treeRoot } = useRecipeTree();

  const selectedItem = selectedItemId ? itemById.get(selectedItemId) : null;

  return (
    <main className="main-panel">
      <div className="main-panel-header">
        <div className="t-slot">
          {selectedItem?.sprite ? (
            <img src={selectedItem.sprite} alt={selectedItem.name} />
          ) : (
            <div className="t-slot-placeholder" />
          )}
        </div>
        <div className="main-panel-item-name">
          {selectedItem ? selectedItem.name : 'Select an item'}
        </div>
      </div>

      {selectedItemId && treeRoot && (
        <>
          <div className="tab-bar">
            {(['tree', 'graph', 'shopping'] as const).map((tab) => (
              <button
                key={tab}
                className={`t-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'tree' ? '🌿 Tree' : tab === 'graph' ? '🔗 Graph' : '📋 Shopping'}
              </button>
            ))}
          </div>

          <div className="qty-row">
            <span className="qty-label">Quantity:</span>
            <div className="qty-stepper">
              <button className="t-btn" onClick={() => setQuantity(quantity - 1)}>−</button>
              <input
                type="number"
                className="t-input"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
              <button className="t-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="panel-content" style={{ padding: activeTab === 'graph' ? 0 : '10px' }}>
            {activeTab === 'tree' && <RecipeTreeView />}
            {activeTab === 'graph' && <RecipeGraph />}
            {activeTab === 'shopping' && <ShoppingList />}
          </div>
        </>
      )}

      {!selectedItemId && (
        <div className="panel-content">
          <div className="empty-state">
            <div className="empty-state-icon">⛏</div>
            <div className="empty-state-title">No item selected</div>
            <div className="empty-state-sub">
              Search for an item in the sidebar to see its crafting recipe tree, visual graph, and shopping list.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
