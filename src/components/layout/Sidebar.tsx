import { useRef, useState, useEffect, CSSProperties } from 'react';
import { List } from 'react-window';
import { useAppStore } from '@/store/useAppStore';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterBar } from '@/components/search/FilterBar';
import { ItemCard } from '@/components/search/ItemCard';
import type { Item } from '@/types/terraria';

const ITEM_HEIGHT = 48; // padding 6px × 2 + t-slot 36px

interface RowProps {
  items: Item[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
}

function ItemRow({
  index,
  style,
  items,
  selectedItemId,
  onSelect,
}: {
  index: number;
  style: CSSProperties;
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
} & RowProps) {
  const item = items[index];
  return (
    <div style={style}>
      <ItemCard
        item={item}
        isSelected={item.id === selectedItemId}
        onClick={() => onSelect(item.id)}
      />
    </div>
  );
}

export function Sidebar() {
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const setSelectedItemId = useAppStore((s) => s.setSelectedItemId);
  const { results } = useSearch();

  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setListHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">⛏ TERRACRAFT</div>
        <SearchBar />
        <FilterBar />
      </div>
      <div className="result-count">{results.length} items</div>
      <div ref={containerRef} className="sidebar-results">
        <List
          style={{ height: listHeight }}
          rowComponent={ItemRow}
          rowCount={results.length}
          rowHeight={ITEM_HEIGHT}
          overscanCount={5}
          rowProps={{ items: results, selectedItemId, onSelect: setSelectedItemId }}
        />
      </div>
    </aside>
  );
}
