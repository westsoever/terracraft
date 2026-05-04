import { useAppStore } from '@/store/useAppStore';
import { itemById } from '@/lib/recipeIndex';
import { assetUrl } from '@/lib/assetUrl';
import { RecipeGraph } from '@/components/graph/RecipeGraph';

export function MainPanel() {
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const quantity = useAppStore((s) => s.quantity);
  const setQuantity = useAppStore((s) => s.setQuantity);

  const selectedItem = selectedItemId ? itemById.get(selectedItemId) : null;

  return (
    <main className="main-panel">
      <div className="main-panel-header">
        <div className="t-slot">
          {selectedItem?.sprite ? (
            <img src={assetUrl(selectedItem.sprite)} alt={selectedItem.name} />
          ) : (
            <div className="t-slot-placeholder" />
          )}
        </div>
        <div className="main-panel-item-name">
          {selectedItem ? selectedItem.name : 'Select an item'}
        </div>
      </div>

      {selectedItemId && (
        <>
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

          <div className="panel-content" style={{ padding: 0 }}>
            <RecipeGraph />
          </div>
        </>
      )}

      {!selectedItemId && (
        <div className="panel-content">
          <div className="empty-state">
            <div className="empty-state-icon">⛏</div>
            <div className="empty-state-title">No item selected</div>
            <div className="empty-state-sub">
              Search for an item in the sidebar to see its crafting recipe graph.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
