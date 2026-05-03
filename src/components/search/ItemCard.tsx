import type { Item } from '@/types/terraria';
import { primaryStationName } from '@/lib/recipeIndex';

interface Props {
  item: Item;
  isSelected: boolean;
  onClick: () => void;
}

export function ItemCard({ item, isSelected, onClick }: Props) {
  const station = primaryStationName(item.id);

  return (
    <div className={`item-card${isSelected ? ' selected' : ''}`} onClick={onClick}>
      <div className="t-slot">
        {item.sprite ? (
          <img src={item.sprite} alt={item.name} />
        ) : (
          <div className="t-slot-placeholder" />
        )}
      </div>
      <div className="item-card-info">
        <div className="item-card-name">{item.name}</div>
        {station && <div className="item-card-station">{station}</div>}
      </div>
    </div>
  );
}
