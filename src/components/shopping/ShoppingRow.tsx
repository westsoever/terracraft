import type { ShoppingEntry } from '@/types/terraria';

interface Props {
  entry: ShoppingEntry;
}

export function ShoppingRow({ entry }: Props) {
  return (
    <div className="shopping-row">
      <div className="t-slot" style={{ width: 28, height: 28 }}>
        {entry.item.sprite ? (
          <img src={entry.item.sprite} alt={entry.item.name} />
        ) : (
          <div className="t-slot-placeholder" />
        )}
      </div>
      <div className="shopping-item-name">{entry.item.name}</div>
      <div className="shopping-qty">×{entry.totalQuantity}</div>
    </div>
  );
}
